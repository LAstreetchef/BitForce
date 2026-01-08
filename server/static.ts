import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In production, server runs from dist/index.cjs, static files are in dist/public
  const distPath = path.resolve(__dirname, "public");
  
  console.log(`[static] Looking for static files at: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.warn(`[static] WARNING: Build directory not found: ${distPath}`);
    console.warn("[static] Static file serving disabled - health checks will still work");
    
    // Register a fallback handler that returns a helpful message
    app.use("*", (_req, res) => {
      res.status(503).send("Application is starting up. Please refresh in a moment.");
    });
    return;
  }

  const indexPath = path.resolve(distPath, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.warn(`[static] WARNING: index.html not found at: ${indexPath}`);
  } else {
    console.log("[static] index.html found");
  }

  console.log("[static] Mounting static file middleware");
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
  
  console.log("[static] Static file serving configured successfully");
}
