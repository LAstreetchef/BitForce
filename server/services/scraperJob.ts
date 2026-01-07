import { runScraper } from "./scraper";

interface ScraperJobStatus {
  status: "idle" | "running" | "completed" | "error";
  startedAt: Date | null;
  completedAt: Date | null;
  error: string | null;
  triggeredByLeadId: number | null;
}

const COOLDOWN_MS = 10 * 60 * 1000;

let globalStatus: ScraperJobStatus = {
  status: "idle",
  startedAt: null,
  completedAt: null,
  error: null,
  triggeredByLeadId: null,
};

let lastScrapedAt: Date | null = null;
let isLocked = false;
const pendingLeadIds = new Set<number>();

export function getScraperJobStatus(leadId: number): ScraperJobStatus & { leadId: number; canTrigger: boolean } {
  return {
    ...globalStatus,
    leadId,
    canTrigger: canTriggerScrape(),
  };
}

export function canTriggerScrape(): boolean {
  if (isLocked) return false;
  if (!lastScrapedAt) return true;
  
  const elapsed = Date.now() - lastScrapedAt.getTime();
  return elapsed >= COOLDOWN_MS;
}

export function enqueueScrapeJob(leadId: number): boolean {
  if (isLocked) {
    console.log(`[ScraperJob] Scrape already running, lead ${leadId} will benefit from current run`);
    pendingLeadIds.add(leadId);
    return false;
  }
  
  if (!canTriggerScrape()) {
    console.log(`[ScraperJob] Cooldown active, skipping scrape for lead ${leadId}`);
    globalStatus = {
      status: "completed",
      startedAt: lastScrapedAt,
      completedAt: lastScrapedAt,
      error: null,
      triggeredByLeadId: leadId,
    };
    return false;
  }
  
  isLocked = true;
  pendingLeadIds.add(leadId);
  
  globalStatus = {
    status: "running",
    startedAt: new Date(),
    completedAt: null,
    error: null,
    triggeredByLeadId: leadId,
  };
  
  setImmediate(async () => {
    try {
      console.log(`[ScraperJob] Starting background scrape triggered by lead ${leadId}`);
      await runScraper();
      
      lastScrapedAt = new Date();
      globalStatus = {
        status: "completed",
        startedAt: globalStatus.startedAt,
        completedAt: new Date(),
        error: null,
        triggeredByLeadId: leadId,
      };
      console.log(`[ScraperJob] Background scrape completed, benefiting leads: ${Array.from(pendingLeadIds).join(", ")}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`[ScraperJob] Scrape failed:`, errorMessage);
      
      globalStatus = {
        status: "error",
        startedAt: globalStatus.startedAt,
        completedAt: new Date(),
        error: errorMessage,
        triggeredByLeadId: leadId,
      };
    } finally {
      isLocked = false;
      pendingLeadIds.clear();
    }
  });
  
  return true;
}

export function clearJobStatus(): void {
  if (!isLocked) {
    globalStatus = {
      status: "idle",
      startedAt: null,
      completedAt: null,
      error: null,
      triggeredByLeadId: null,
    };
  }
}
