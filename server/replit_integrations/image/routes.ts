import type { Express, Request, Response } from "express";
import { Modality } from "@google/genai";
import { ai } from "./client";

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
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const candidate = response.candidates?.[0];
      const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);

      if (!imagePart?.inlineData?.data) {
        return res.status(500).json({ error: "No image data in response" });
      }

      const mimeType = imagePart.inlineData.mimeType || "image/png";
      res.json({
        b64_json: imagePart.inlineData.data,
        mimeType,
      });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Renovation design visualization endpoint
  app.post("/api/generate-renovation-design", async (req: Request, res: Response) => {
    try {
      const { roomType, style, additionalDetails } = req.body;

      if (!roomType || !style) {
        return res.status(400).json({ error: "Room type and style are required" });
      }

      const roomDesc = ROOM_TYPES[roomType as keyof typeof ROOM_TYPES] || `a renovated ${roomType}`;
      const styleDesc = DESIGN_STYLES[style as keyof typeof DESIGN_STYLES] || style;

      const prompt = `Generate a photorealistic interior design visualization of ${roomDesc} with ${styleDesc}. ${additionalDetails || ""} The image should be high quality, professionally lit, and showcase the renovation beautifully. Make it look like a real photograph from an interior design magazine.`;

      console.log("[Design Generation] Generating design:", { roomType, style, prompt });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const candidate = response.candidates?.[0];
      const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);

      if (!imagePart?.inlineData?.data) {
        return res.status(500).json({ error: "No image data in response" });
      }

      const mimeType = imagePart.inlineData.mimeType || "image/png";
      res.json({
        b64_json: imagePart.inlineData.data,
        mimeType,
        roomType,
        style,
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

