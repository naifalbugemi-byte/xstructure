import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSpeech(text: string, voice: "male" | "female" = "male") {
  const filePath = path.resolve(`./tmp/tts_output.mp3`);

  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts", // أو gpt-4o-tts
    voice: voice === "male" ? "alloy" : "verse",
    input: text,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return filePath;
}
