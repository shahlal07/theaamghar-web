import "server-only";

// Same free-tier Groq client pattern as api/chat/route.ts -- reused here for
// a single, non-streaming completion instead of a conversation. Best-effort:
// a missing key or an upstream failure must never block the actual bug
// report from saving, so every failure path returns null and the caller
// falls back to a canned acknowledgment.
const MODEL = "llama-3.3-70b-versatile";

export async function generateBugReportAiReply(
  title: string,
  description: string,
  businessName: string,
  rewardCurrencySingular: string
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `You are an automated acknowledgment assistant for ${businessName}'s bug-reporting system. A customer just submitted a bug report through the website. Write a short (2-3 sentences), warm, professional reply:
- Thank them for reporting it.
- Briefly paraphrase the issue in your own words so they know it was understood -- don't just repeat their text verbatim.
- Tell them our team will review it manually, and that they'll earn 1 ${rewardCurrencySingular} once the team confirms it's a genuine bug (not automatically -- only after confirmation).
- Don't promise a fix timeline, don't apologize excessively, don't diagnose or claim to have fixed anything.
- Plain text only, no markdown.`,
          },
          {
            role: "user",
            content: `Bug title: ${title}\n\nDescription: ${description}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.6,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    return reply || null;
  } catch (err) {
    console.error("[bug-report-ai] Failed to generate reply:", err);
    return null;
  }
}
