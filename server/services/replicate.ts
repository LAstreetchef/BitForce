import Replicate from "replicate";

interface FluxFillProInput {
  image: string;
  prompt: string;
  aspect_ratio?: string;
  safety_tolerance?: number;
  prompt_upsampling?: boolean;
}

function getReplicateClient(): Replicate {
  const apiKey = process.env.REPLICATE_API_KEY;
  if (!apiKey) {
    throw new Error("REPLICATE_API_KEY is not set. Please add your Replicate API token to secrets.");
  }
  return new Replicate({ auth: apiKey });
}

export async function generateExteriorVisualization(
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<{ imageUrl: string }> {
  const replicate = getReplicateClient();
  const dataUri = `data:${mimeType};base64,${imageBase64}`;
  
  console.log("[Replicate] Starting Flux Fill Pro generation with prompt:", prompt.substring(0, 100) + "...");
  console.log("[Replicate] Using API key:", process.env.REPLICATE_API_KEY?.substring(0, 10) + "...");
  
  const input: FluxFillProInput = {
    image: dataUri,
    prompt: prompt,
    safety_tolerance: 5,
    prompt_upsampling: true,
  };

  const output = await replicate.run(
    "black-forest-labs/flux-fill-pro",
    { input }
  );

  let imageUrl: string;
  if (typeof output === "string") {
    imageUrl = output;
  } else if (output && typeof output === "object" && "url" in output) {
    imageUrl = (output as { url: string }).url;
  } else if (Array.isArray(output) && output.length > 0) {
    const firstItem = output[0];
    imageUrl = typeof firstItem === "string" ? firstItem : (firstItem as { url: string }).url;
  } else {
    throw new Error("Unexpected output format from Replicate");
  }

  console.log("[Replicate] Generated image URL:", imageUrl);
  
  return { imageUrl };
}

export async function fetchImageAsBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  
  const contentType = response.headers.get("content-type") || "image/png";
  
  return { base64, mimeType: contentType };
}
