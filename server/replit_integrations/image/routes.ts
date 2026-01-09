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

const ROOFING_OPTIONS = {
  "asphalt-black": "modern black asphalt shingles",
  "asphalt-charcoal": "elegant charcoal gray asphalt shingles",
  "asphalt-brown": "warm brown asphalt shingles",
  "asphalt-red": "distinctive red-toned asphalt shingles",
  "metal-standing-seam": "sleek standing seam metal roofing",
  "metal-silver": "contemporary silver metal roofing",
  "clay-terracotta": "classic terracotta clay tiles",
  "slate-gray": "premium gray slate tiles",
};

const DRIVEWAY_OPTIONS = {
  "concrete-plain": "smooth poured concrete driveway",
  "concrete-stamped": "decorative stamped concrete driveway",
  "asphalt": "fresh black asphalt driveway",
  "pavers-brick": "elegant brick paver driveway",
  "pavers-stone": "natural stone paver driveway",
  "gravel": "crushed gravel driveway",
  "cobblestone": "classic cobblestone driveway",
};

const SIDING_OPTIONS = {
  "vinyl-white": "clean white vinyl siding",
  "vinyl-gray": "modern gray vinyl siding",
  "vinyl-blue": "coastal blue vinyl siding",
  "vinyl-beige": "warm beige vinyl siding",
  "wood-natural": "natural wood siding",
  "wood-painted": "painted wood siding",
  "fiber-cement": "durable fiber cement siding",
  "stone-veneer": "elegant stone veneer facade",
  "brick": "classic red brick exterior",
  "stucco-white": "smooth white stucco finish",
  "stucco-tan": "warm tan stucco finish",
};

const PAINT_OPTIONS = {
  "white": "crisp white",
  "off-white": "warm off-white",
  "gray-light": "light gray",
  "gray-dark": "charcoal gray",
  "blue-navy": "classic navy blue",
  "blue-coastal": "soft coastal blue",
  "green-sage": "earthy sage green",
  "green-hunter": "deep hunter green",
  "beige": "warm beige",
  "tan": "golden tan",
  "brown": "rich brown",
  "red-barn": "traditional barn red",
  "yellow-soft": "soft butter yellow",
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
      const { roomType, style, additionalDetails, sourceImage } = req.body;

      if (!roomType || !style) {
        return res.status(400).json({ error: "Room type and style are required" });
      }

      const roomDesc = ROOM_TYPES[roomType as keyof typeof ROOM_TYPES] || `a renovated ${roomType}`;
      const styleDesc = DESIGN_STYLES[style as keyof typeof DESIGN_STYLES] || style;

      let prompt: string;
      const parts: any[] = [];

      if (sourceImage) {
        // Extract base64 data and mime type from data URL
        const matches = sourceImage.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
          return res.status(400).json({ error: "Invalid image format" });
        }
        const imageMimeType = matches[1];
        const imageData = matches[2];

        prompt = `Transform this room photo into ${roomDesc} with ${styleDesc}. Redesign the space while keeping the same room layout and perspective. ${additionalDetails || ""} Make it look like a professional interior design rendering showing what the renovated space could look like. Keep the same camera angle and room dimensions.`;

        parts.push({
          inlineData: {
            mimeType: imageMimeType,
            data: imageData,
          },
        });
        parts.push({ text: prompt });

        console.log("[Design Generation] Generating from uploaded image:", { roomType, style, hasSourceImage: true });
      } else {
        prompt = `Generate a photorealistic interior design visualization of ${roomDesc} with ${styleDesc}. ${additionalDetails || ""} The image should be high quality, professionally lit, and showcase the renovation beautifully. Make it look like a real photograph from an interior design magazine.`;
        parts.push({ text: prompt });

        console.log("[Design Generation] Generating new design:", { roomType, style, prompt });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ role: "user", parts }],
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
        usedSourceImage: !!sourceImage,
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

  // Get available exterior options for the visualizer
  app.get("/api/exterior-options", (req: Request, res: Response) => {
    res.json({
      roofing: Object.keys(ROOFING_OPTIONS).map(key => ({
        value: key,
        label: key.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      })),
      driveway: Object.keys(DRIVEWAY_OPTIONS).map(key => ({
        value: key,
        label: key.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      })),
      siding: Object.keys(SIDING_OPTIONS).map(key => ({
        value: key,
        label: key.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      })),
      paint: Object.keys(PAINT_OPTIONS).map(key => ({
        value: key,
        label: key.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      })),
    });
  });

  // Home Exterior Before/After Visualization endpoint
  app.post("/api/generate-exterior-visualization", async (req: Request, res: Response) => {
    try {
      const { 
        sourceImage, 
        roofing, 
        driveway, 
        siding, 
        paintColor,
        additionalDetails 
      } = req.body;

      if (!sourceImage) {
        return res.status(400).json({ error: "A photo of the home exterior is required" });
      }

      // Build the transformation description
      const changes: string[] = [];
      
      if (roofing) {
        const roofDesc = ROOFING_OPTIONS[roofing as keyof typeof ROOFING_OPTIONS] || roofing;
        changes.push(`new ${roofDesc}`);
      }
      
      if (driveway) {
        const drivewayDesc = DRIVEWAY_OPTIONS[driveway as keyof typeof DRIVEWAY_OPTIONS] || driveway;
        changes.push(`a ${drivewayDesc}`);
      }
      
      if (siding) {
        const sidingDesc = SIDING_OPTIONS[siding as keyof typeof SIDING_OPTIONS] || siding;
        changes.push(`${sidingDesc}`);
      }
      
      if (paintColor) {
        const paintDesc = PAINT_OPTIONS[paintColor as keyof typeof PAINT_OPTIONS] || paintColor;
        changes.push(`${paintDesc} exterior paint`);
      }

      if (changes.length === 0) {
        return res.status(400).json({ error: "At least one improvement option must be selected" });
      }

      // Extract base64 data and mime type from data URL
      const matches = sourceImage.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: "Invalid image format. Please upload a valid image." });
      }
      const imageMimeType = matches[1];
      const imageData = matches[2];

      const changesDescription = changes.join(", ");
      const prompt = `Transform this home exterior photo to show the following improvements: ${changesDescription}. 
      
Keep the same house structure, angle, perspective, and surroundings. Only modify the specified elements (roof, driveway, siding, paint) while maintaining photorealism. 
${additionalDetails ? `Additional details: ${additionalDetails}` : ""}
The result should look like a professional "after" photo from a home renovation project, showing what the house would look like with these upgrades installed.`;

      console.log("[Exterior Visualization] Generating transformation:", { 
        roofing, driveway, siding, paintColor, 
        changesDescription 
      });

      const parts = [
        {
          inlineData: {
            mimeType: imageMimeType,
            data: imageData,
          },
        },
        { text: prompt },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ role: "user", parts }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const candidate = response.candidates?.[0];
      const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);

      if (!imagePart?.inlineData?.data) {
        return res.status(500).json({ error: "Failed to generate visualization. Please try again." });
      }

      const mimeType = imagePart.inlineData.mimeType || "image/png";
      res.json({
        b64_json: imagePart.inlineData.data,
        mimeType,
        appliedChanges: {
          roofing: roofing || null,
          driveway: driveway || null,
          siding: siding || null,
          paintColor: paintColor || null,
        },
      });
    } catch (error) {
      console.error("Error generating exterior visualization:", error);
      res.status(500).json({ error: "Failed to generate exterior visualization. Please try again." });
    }
  });
}

