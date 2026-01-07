import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import fs from "fs";
import path from "path";

const app = express();
const httpServer = createServer(app);

// Health check endpoint - responds immediately for deployment health checks
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

// In production, root "/" must respond immediately with 200 OK for deployment health checks
// Load index.html into memory at startup for fast serving
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
  
  // HEAD requests for health probes - respond immediately with just status
  app.head("/", (_req, res) => {
    res.status(200).end();
  });
  
  // GET requests - serve cached index.html for browsers, fallback to OK for probes
  app.get("/", (_req, res) => {
    // Serve cached index.html immediately - no file I/O needed
    if (cachedIndexHtml) {
      res.status(200).type("html").send(cachedIndexHtml);
    } else {
      // Fallback: just return OK for health check
      res.status(200).send("OK");
    }
  });
}

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
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error("[server] Request error:", err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`serving on port ${port}`);
      },
    );
  } catch (err) {
    console.error("[server] Fatal error during startup:", err);
    process.exit(1);
  }
})();
