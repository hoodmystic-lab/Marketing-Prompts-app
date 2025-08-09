import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }

  try {
    const { business, audience, offer, tone, platform, principle } = req.body || {};

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Ask for strict JSON back (Structured Outputs)
    const completion = await openai.responses.create({
      model: "gpt-4o-mini",
      input:
        `You are a senior marketing strategist. Produce concise, *practical* outputs.
Return ONLY JSON matching the provided schema. No extra text.

Inputs:
- Business: ${business || ""}
- Audience: ${audience || ""}
- Offer: ${offer || ""}
- Tone: ${tone || ""}
- Platform: ${platform || ""}
- Core principle to emphasize (AIDA, 4Ps, etc.): ${principle || ""}

Rules:
- Tailor language to the audience and platform.
- Be specific and avoid fluff.
- Keep each item punchy (<= 20 words when possible).
`,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "MarketingOutput",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              tagline: { type: "string" },
              value_proposition: { type: "string" },
              aida: {
                type: "object",
                additionalProperties: false,
                properties: {
                  attention: { type: "string" },
                  interest: { type: "string" },
                  desire: { type: "string" },
                  action: { type: "string" }
                },
                required: ["attention", "interest", "desire", "action"]
              },
              four_ps: {
                type: "object",
                additionalProperties: false,
                properties: {
                  product: { type: "string" },
                  price: { type: "string" },
                  place: { type: "string" },
                  promotion: { type: "string" }
                },
                required: ["product", "price", "place", "promotion"]
              },
              hooks: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
              cta: { type: "string" }
            },
            required: ["tagline", "value_proposition", "aida", "four_ps", "hooks", "cta"]
          },
          strict: true
        }
      }
    });

    // Prefer parsed JSON if available
    const data = completion.output_parsed ?? JSON.parse(completion.output_text);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", detail: String(err?.message || err) });
  }
}

