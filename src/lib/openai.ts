import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

export interface VoiceProcessingResult {
  machineName: string;
  zone: string;
  issueSummary: string;
  priority: "critical" | "high" | "low";
  actionPlan: string;
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const file = new File([audioBlob], "audio.webm", { type: audioBlob.type });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: import.meta.env.VITE_WHISPER_MODEL || "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error("Failed to transcribe audio");
  }
}

export async function processIssueReport(
  transcription: string
): Promise<VoiceProcessingResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for a manufacturing facility operations system. Your task is to analyze voice-reported issues and extract structured information.

From the user's report, extract:
1. Machine name or equipment identifier
2. Zone or location (default to "Zone A", "Zone B", or "Zone C" if not specified)
3. Issue summary (concise description)
4. Priority level (critical, high, or low based on urgency and safety impact)
5. Suggested action plan (numbered steps to resolve the issue)

Respond in valid JSON format only:
{
  "machineName": "string",
  "zone": "string",
  "issueSummary": "string",
  "priority": "critical" | "high" | "low",
  "actionPlan": "string"
}

Priority guidelines:
- critical: Safety hazards, complete failures, production stoppage
- high: Significant performance issues, potential failures
- low: Minor issues, maintenance requests, routine checks`,
        },
        {
          role: "user",
          content: transcription,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as VoiceProcessingResult;

    if (
      !result.machineName ||
      !result.zone ||
      !result.issueSummary ||
      !result.priority ||
      !result.actionPlan
    ) {
      throw new Error("Invalid response structure from OpenAI");
    }

    return result;
  } catch (error) {
    console.error("Issue processing error:", error);
    throw new Error("Failed to process issue report");
  }
}
