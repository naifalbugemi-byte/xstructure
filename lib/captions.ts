import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 🟢 استخراج نصوص من فيديو (Whisper)
export async function generateCaptions(audioFile: string) {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    response_format: "srt"
  });
  return transcription; // ملف SRT جاهز
}
