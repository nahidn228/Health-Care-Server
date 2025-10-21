type AiResult = {
  doctorData: any | null; // parsed JSON (array/object) for doctors
  contentText: string | null; // plain reasoning text if available
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
  let contentText: string | null = null;

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
  contentText =
    completion?.choices?.[0]?.message?.content ||
    completion?.choices?.[0]?.content ||
    completion?.content ||
    null;

  if (!contentText) {
    const details =
      completion?.choices?.[0]?.message?.reasoning_details ||
      completion?.choices?.[0]?.reasoning_details ||
      completion?.reasoning_details ||
      null;

    if (Array.isArray(details) && details.length) {
      const contentTexts = details
        .map(
          (d: any) =>
            d?.text || d?.content || (typeof d === "string" ? d : null)
        )
        .filter(Boolean);
      if (contentTexts.length) contentText = contentTexts.join(" ");
    }
  }

  // Extract reasoning from raw if still missing
  if (!contentText) {
    const explMatch = raw.match(
      /(?:reasoning|explanation|analysis)[:\-\s]*([\s\S]{20,2000})/i
    );
    if (explMatch && explMatch[1]) {
      let txt = explMatch[1].trim();
      const cutIdx = txt.search(/```/);
      if (cutIdx > -1) txt = txt.slice(0, cutIdx).trim();
      contentText = txt;
    }
  }

  // Fallback: parse reasoning from raw JSON
  if (!contentText) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.reasoning && typeof parsed.reasoning === "string")
        contentText = parsed.reasoning;
    } catch {
      /* ignore */
    }
  }

  // 🧹 Clean up reasoning text (remove unwanted \n, \t, multiple spaces)
  if (contentText) {
    contentText = contentText
      .replace(/```json[\s\S]*?```/gi, "") // 🚀 remove any ```json ... ``` blocks
      .replace(/\\n+/g, " ") // remove escaped newlines
      .replace(/\n+/g, " ") // remove real newlines
      .replace(/\t+/g, " ") // remove tabs
      .replace(/\s{2,}/g, " ") // collapse multiple spaces
      .trim();
  }

  return {
    doctorData,
    contentText,
  };
}

// const message = completion.choices[0]?.message?.content || "";
// console.log("Raw response:", message);

// // Extract JSON from triple backticks
// const jsonMatch = message.match(/```json([\s\S]*?)```/);
// let doctorData;

// if (jsonMatch && jsonMatch[1]) {
//   try {
//     doctorData = JSON.parse(jsonMatch[1].trim());
//   } catch (err) {
//     console.error("Error parsing doctor JSON:", err);
//   }
// }

// console.log("Doctor Info:", doctorData);
// return doctorData;
