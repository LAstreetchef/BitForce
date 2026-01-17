import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, ExternalLink, ArrowRight, ArrowDown, Users, DollarSign, Coins, TrendingUp, Building2, Smartphone } from "lucide-react";

function MoneyFlowDiagram() {
  return (
    <div className="w-full py-4">
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Revenue Sources</div>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-md">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Ambassador Fees</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-md">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Product Revenue</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-2">
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Cash Allocation</div>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-500/10 border border-slate-500/30 rounded-md">
            <Building2 className="w-4 h-4 text-slate-500" />
            <span className="text-sm">Operations</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-md">
            <Users className="w-4 h-4 text-orange-500" />
            <span className="text-sm">Ambassador Payouts</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-md">
            <Coins className="w-4 h-4 text-purple-500" />
            <span className="text-sm">BFT Buybacks</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-2">
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Investor Outcomes</div>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">Token Value Growth</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
            <Coins className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">Reduced Supply</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DualAppArchitectureDiagram() {
  return (
    <div className="w-full py-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex-1 max-w-xs">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">Ambassador Portal</span>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Lead generation & tracking</li>
              <li>• Customer acquisition</li>
              <li>• Ambassador onboarding</li>
              <li>• Referral management</li>
              <li>• BFT rewards earned</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1 py-2 md:py-0">
          <div className="hidden md:flex items-center">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <ArrowRight className="w-5 h-5 text-muted-foreground -ml-2" />
          </div>
          <div className="md:hidden flex items-center">
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Sync</span>
          <div className="hidden md:flex items-center rotate-180">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <ArrowRight className="w-5 h-5 text-muted-foreground -ml-2" />
          </div>
          <div className="md:hidden flex items-center rotate-180">
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex-1 max-w-xs">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-purple-600 dark:text-purple-400">Token Platform</span>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• BFT token purchases</li>
              <li>• Wallet management</li>
              <li>• Buyback execution</li>
              <li>• Token burning</li>
              <li>• Liquidity pools</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg max-w-md text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Investor Value</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Revenue from Ambassador Portal funds BFT buybacks, reducing supply and driving token appreciation
          </p>
        </div>
      </div>
    </div>
  );
}

export function InvestorEcosystemDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-primary gap-1 h-auto" data-testid="button-investor-ecosystem">
          <Info className="w-4 h-4" />
          <span>How BitForce Works for Investors</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">BitForce Ecosystem for Investors</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold text-lg mb-2">Overview</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                BitForce operates a dual-platform ecosystem designed to create sustainable value for investors. 
                The <strong>Ambassador Portal</strong> drives customer acquisition and revenue generation, 
                while the <strong>Token Platform</strong> manages BFT token utility, buybacks, and liquidity. 
                Together, they create a flywheel where business success directly translates to token value appreciation.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold text-lg mb-2">Money Flow</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Revenue flows from customer subscriptions through our ecosystem, with a portion allocated to BFT token buybacks:
              </p>
              <MoneyFlowDiagram />
            </section>
            
            <section>
              <h3 className="font-semibold text-lg mb-2">Two-App Architecture</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our platforms synchronize in real-time to ensure seamless operations:
              </p>
              <DualAppArchitectureDiagram />
            </section>
            
            <section>
              <h3 className="font-semibold text-lg mb-2">Key Investment Highlights</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Revenue-Backed Buybacks:</strong> A percentage of net profit funds regular BFT token purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Deflationary Mechanics:</strong> Purchased tokens are burned, permanently reducing supply</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Real Business Model:</strong> Value driven by actual customer revenue, not speculation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Transparent Metrics:</strong> Use the scenario analyzer above to model different growth cases</span>
                </li>
              </ul>
            </section>
            
            <section className="pt-2 border-t">
              <h3 className="font-semibold text-lg mb-3">Explore Our Platforms</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" asChild className="gap-2">
                  <a 
                    href="https://BitForceAmbassadorPortal.replit.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    data-testid="link-ambassador-portal"
                  >
                    <Users className="w-4 h-4" />
                    Ambassador Portal
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
                <Button variant="outline" asChild className="gap-2">
                  <a 
                    href="https://BitForceToken.replit.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    data-testid="link-token-platform"
                  >
                    <Coins className="w-4 h-4" />
                    Token Platform
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
