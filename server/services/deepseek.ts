let deepseekClient: any = null;

async function getDeepSeekClient(): Promise<any> {
  if (!deepseekClient) {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not configured. Please add it to your secrets.");
    }
    const { default: OpenAI } = await import("openai");
    deepseekClient = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }
  return deepseekClient;
}

const BITFORCE_SYSTEM_PROMPT = `You are an AI assistant for Bit Force brand ambassadors. Bit Force helps ambassadors connect homeowners with home and digital services including:

- Home security systems and surveillance
- Smart home automation
- Photo and video digitization services
- Home repair and handyman services
- Internet and WiFi solutions
- Solar panel installation
- HVAC and home comfort systems

Your role is to:
1. Answer questions about home services, pricing strategies, and sales techniques
2. Help ambassadors understand customer needs and pain points
3. Provide talking points and objection handling strategies
4. Explain the benefits of various home services
5. Offer tips for property assessments and customer consultations
6. Share best practices for lead generation and follow-ups

Be professional, helpful, and focused on empowering ambassadors to better serve their customers. Keep responses concise but thorough. When discussing specific services, emphasize value propositions that resonate with homeowners.

If asked about topics unrelated to home services or sales, politely redirect the conversation back to how you can help with their ambassador activities.`;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function sanitizeConversationHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];
  
  return history
    .filter((msg): msg is { role: string; content: string } => {
      return (
        typeof msg === "object" &&
        msg !== null &&
        typeof msg.role === "string" &&
        typeof msg.content === "string" &&
        (msg.role === "user" || msg.role === "assistant") &&
        msg.content.length <= 10000
      );
    })
    .map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content.slice(0, 10000),
    }))
    .slice(-20);
}

export function isDeepSeekConfigured(): boolean {
  return !!process.env.DEEPSEEK_API_KEY;
}

export async function askDeepSeek(
  userMessage: string,
  conversationHistory: unknown = []
): Promise<string> {
  if (!isDeepSeekConfigured()) {
    return "AI assistant is not currently available. Please contact your administrator to configure the DEEPSEEK_API_KEY.";
  }
  
  try {
    const client = await getDeepSeekClient();
    const sanitizedHistory = sanitizeConversationHistory(conversationHistory);
    
    const messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
      { role: "system", content: BITFORCE_SYSTEM_PROMPT },
      ...sanitizedHistory,
      { role: "user", content: userMessage.slice(0, 10000) },
    ];

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("DeepSeek API error:", error);
    throw new Error(error.message || "Failed to get response from AI assistant");
  }
}
