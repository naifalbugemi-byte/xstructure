import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateCaptionsAndTags(topic: string) {
  const prompt = `
  أعطني 3 خيارات مختلفة لتعليق (Caption) على محتوى بموضوع "${topic}" :
  1. رسمي
  2. شبابي
  3. ساخر

  وأعطني هاشتاقات ترند مناسبة للسعودية والخليج.
  `;
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message?.content;
}
