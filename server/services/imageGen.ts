import type { Express, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with environment variable
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const DESIGN_STYLES = {
  modern: "modern minimalist design with clean lines, neutral colors, and contemporary furniture",
  farmhouse: "cozy farmhouse style with rustic wood elements, shiplap walls, and warm earth tones",
  coastal: "bright coastal design with white and blue tones, natural textures, and beachy accents",
  industrial: "urban industrial style with exposed brick, metal accents, and raw materials",
  traditional: "classic traditional design with elegant furniture, warm colors, and timeless details",
  scandinavian: "scandinavian design with light wood, white walls, and functional minimalist furniture",
  bohemian: "eclectic bohemian style with vibrant patterns, plants, and layered textiles",
  luxury: "high-end luxury design with premium materials, sophisticated lighting, and elegant finishes",
};

const ROOM_TYPES = {
  kitchen: "a beautifully renovated kitchen",
  bathroom: "a stunning updated bathroom",
  "living room": "an inviting living room",
  bedroom: "a serene and stylish bedroom",
  "home office": "a productive home office space",
  basement: "a finished basement living area",
  exterior: "an impressive home exterior",
  backyard: "a landscaped backyard oasis",
};

export function registerImageRoutes(app: Express): void {
  app.post("/api/generate-image", async (req: Request, res: Response) => {
    try {
      if (!genAI) {
        return res.status(503).json({ error: "Image generation not configured. Set GEMINI_API_KEY." });
      }

      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Note: Gemini's direct API may not support image generation in the same way
      // This is a stub - may need adjustment based on actual Gemini API capabilities
      res.json({
        text: response.text(),
        note: "Image generation via Gemini API - check response format",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Renovation design visualization endpoint
  app.post("/api/generate-renovation-design", async (req: Request, res: Response) => {
    try {
      if (!genAI) {
        return res.status(503).json({ error: "Image generation not configured. Set GEMINI_API_KEY." });
      }

      const { roomType, style, additionalDetails } = req.body;

      if (!roomType || !style) {
        return res.status(400).json({ error: "Room type and style are required" });
      }

      const roomDesc = ROOM_TYPES[roomType as keyof typeof ROOM_TYPES] || `a renovated ${roomType}`;
      const styleDesc = DESIGN_STYLES[style as keyof typeof DESIGN_STYLES] || style;

      const prompt = `Generate a photorealistic interior design visualization of ${roomDesc} with ${styleDesc}. ${additionalDetails || ""} The image should be high quality, professionally lit, and showcase the renovation beautifully.`;

      // Stub response - actual implementation depends on Gemini image gen API
      res.json({
        prompt,
        roomType,
        style,
        note: "Image generation stub - configure actual API",
      });
    } catch (error) {
      console.error("Error generating renovation design:", error);
      res.status(500).json({ error: "Failed to generate renovation design" });
    }
  });

  // Get available design styles and room types
  app.get("/api/design-options", (req: Request, res: Response) => {
    res.json({
      styles: Object.keys(DESIGN_STYLES),
      roomTypes: Object.keys(ROOM_TYPES),
    });
  });
}
