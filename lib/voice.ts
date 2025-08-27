import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 🟢 توليد صوت من نص
export async function textToSpeech(text: string, outputPath: string) {
  const res = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy", // تقدر تختار صوت
    input: text,
  });

  const buffer = Buffer.from(await res.arrayBuffer());
  await Bun.write(outputPath, buffer);
  return outputPath;
}
