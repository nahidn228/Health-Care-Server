import OpenAI from "openai";
import config from "../../config";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openRouter.api_key,
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});

// utils/extractAiDoctorResult.ts
type AiResult = {
  // fullReply: string; // raw text reply to show to user
  doctorData: any | null; // parsed JSON (array/object) for doctors
  reasoningText: string | null; // plain reasoning text if available
};

export async function extractAiDoctorResult(
  completion: any
): Promise<AiResult> {
  const raw =
    completion?.choices?.[0]?.message?.content ||
    completion?.output?.[0]?.content?.[0]?.text ||
    completion?.content ||
    (typeof completion?.choices?.[0]?.message?.content === "object" &&
      JSON.stringify(completion.choices[0].message.content)) ||
    JSON.stringify(completion || {}, null, 2);

  let doctorData: any = null;
  let reasoningText: string | null = null;

  // Extract JSON inside ```json ... ```
  const codeBlockMatch = raw.match(/```json([\s\S]*?)```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    const candidate = codeBlockMatch[1].trim();
    try {
      doctorData = JSON.parse(candidate);
    } catch {
      /* ignore */
    }
  }

  // Fallback: find first JSON array/object
  if (!doctorData) {
    const altMatch = raw.match(/(\[[\s\S]*?\]|\{[\s\S]*?\})/);
    if (altMatch && altMatch[0]) {
      try {
        doctorData = JSON.parse(altMatch[0]);
      } catch {
        /* ignore */
      }
    }
  }

  // Extract reasoning
  reasoningText =
    completion?.choices?.[0]?.message?.reasoning ||
    completion?.choices?.[0]?.reasoning ||
    completion?.reasoning ||
    null;

  if (!reasoningText) {
    const details =
      completion?.choices?.[0]?.message?.reasoning_details ||
      completion?.choices?.[0]?.reasoning_details ||
      completion?.reasoning_details ||
      null;

    if (Array.isArray(details) && details.length) {
      const reasoningTexts = details
        .map(
          (d: any) =>
            d?.text || d?.content || (typeof d === "string" ? d : null)
        )
        .filter(Boolean);
      if (reasoningTexts.length) reasoningText = reasoningTexts.join(" ");
    }
  }

  // Extract reasoning from raw if still missing
  if (!reasoningText) {
    const explMatch = raw.match(
      /(?:reasoning|explanation|analysis)[:\-\s]*([\s\S]{20,2000})/i
    );
    if (explMatch && explMatch[1]) {
      let txt = explMatch[1].trim();
      const cutIdx = txt.search(/```/);
      if (cutIdx > -1) txt = txt.slice(0, cutIdx).trim();
      reasoningText = txt;
    }
  }

  // Fallback: parse reasoning from raw JSON
  if (!reasoningText) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.reasoning && typeof parsed.reasoning === "string")
        reasoningText = parsed.reasoning;
    } catch {
      /* ignore */
    }
  }

  // 🧹 Clean up reasoning text (remove unwanted \n, \t, multiple spaces)
  if (reasoningText) {
    reasoningText = reasoningText
      .replace(/\\n+/g, " ") // remove escaped newlines
      .replace(/\n+/g, " ") // remove real newlines
      .replace(/\t+/g, " ") // remove tabs
      .replace(/\s{2,}/g, " ") // collapse multiple spaces
      .trim();
  }

  return {
    doctorData,
    reasoningText,
  };
}
