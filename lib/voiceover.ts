import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateVoiceOver(text: string, voice: "male" | "female" = "male") {
  const outputPath = path.resolve(`./tmp/voice_${Date.now()}.mp3`);

  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: voice === "male" ? "alloy" : "verse",
    input: text,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
}
