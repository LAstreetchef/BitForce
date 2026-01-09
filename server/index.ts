import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { initializeDatabase, isDatabaseAvailable } from "./db";

console.log("[server] Starting server initialization...");
console.log("[server] NODE_ENV:", process.env.NODE_ENV);
console.log("[server] PORT:", process.env.PORT || "5000 (default)");

const app = express();
const httpServer = createServer(app);

let isFullyInitialized = false;

// In production, cache index.html for fast serving
let cachedIndexHtml: string | null = null;
if (process.env.NODE_ENV === "production") {
  const indexPath = path.resolve(__dirname, "public", "index.html");
  try {
    if (fs.existsSync(indexPath)) {
      cachedIndexHtml = fs.readFileSync(indexPath, "utf-8");
      console.log("[server] Cached index.html for fast root serving");
    }
  } catch (err) {
    console.error("[server] Failed to cache index.html:", err);
  }
}

// Health check endpoint - responds immediately for deployment health checks
// Returns 200 only when fully initialized, 503 otherwise
app.get("/api/health", (_req, res) => {
  if (isFullyInitialized) {
    res.status(200).json({ 
      status: "ok", 
      timestamp: Date.now(),
      database: isDatabaseAvailable() ? "connected" : "unavailable"
    });
  } else {
    res.status(503).json({
      status: "initializing",
      timestamp: Date.now()
    });
  }
});

// Root "/" must respond with 200 OK for deployment health checks
// Only returns 200 when fully initialized
app.head("/", (_req, res) => {
  if (isFullyInitialized) {
    res.status(200).end();
  } else {
    res.status(503).end();
  }
});

// GET "/" - serve HTML when ready, 503 when initializing
app.get("/", (_req, res, next) => {
  if (!isFullyInitialized) {
    res.status(503).send("Server is starting up. Please wait...");
    return;
  }
  
  if (process.env.NODE_ENV === "production") {
    if (cachedIndexHtml) {
      res.status(200).type("html").send(cachedIndexHtml);
    } else {
      res.status(200).send("OK");
    }
  } else {
    // In development, let Vite handle it
    next();
  }
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: '50mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// START LISTENING IMMEDIATELY - before any async initialization
// This ensures health checks pass right away
const port = parseInt(process.env.PORT || "5000", 10);

httpServer.listen(
  {
    port,
    host: "0.0.0.0",
    reusePort: true,
  },
  () => {
    log(`serving on port ${port}`);
    console.log("[server] Server listening! Health checks will now pass.");
    
    // Now do async initialization in the background
    initializeAsync();
  },
);

async function initializeAsync() {
  try {
    // Initialize database (non-blocking - won't crash if unavailable)
    console.log("[server] Initializing database...");
    const dbAvailable = initializeDatabase();
    console.log(`[server] Database available: ${dbAvailable}`);
    
    // Register routes (may use database if available)
    console.log("[server] Registering routes...");
    await registerRoutes(httpServer, app);
    console.log("[server] Routes registered");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error("[server] Request error:", err);
    });

    // Setup static files or Vite dev server
    if (process.env.NODE_ENV === "production") {
      console.log("[server] Setting up static file serving...");
      serveStatic(app);
      console.log("[server] Static file serving configured");
    } else {
      console.log("[server] Setting up Vite dev server...");
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
      console.log("[server] Vite dev server configured");
    }
    
    isFullyInitialized = true;
    console.log("[server] Server initialization complete! Ready to accept all requests.");
  } catch (err) {
    console.error("[server] Fatal error during initialization:", err);
    // Exit so deployment fails and alerts operators
    process.exit(1);
  }
}
