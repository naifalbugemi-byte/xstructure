import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const STABILITY_API = "https://api.stability.ai/v2beta/stable-image/generate/core";
const RUNWAY_API = "https://api.runwayml.com/v1/videos";

export async function generateImage(prompt: string) {
  const res = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });
  return res.data[0].url;
}

export async function editImage(imageUrl: string, prompt: string) {
  const res = await axios.post(
    STABILITY_API,
    {
      prompt,
      image: imageUrl,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
    }
  );
  return res.data.image_url;
}

export async function generateVideo(prompt: string) {
  const res = await axios.post(
    RUNWAY_API,
    { prompt },
    { headers: { Authorization: `Bearer ${process.env.RUNWAY_API_KEY}` } }
  );
  return res.data.video_url;
}
