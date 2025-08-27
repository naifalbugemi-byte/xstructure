import { generateCaptionsAndTags } from "./ai-content";
import { generateAllSizes } from "./resize";

export async function generateCampaign(topic: string, baseImage: Buffer) {
  const captions = await generateCaptionsAndTags(topic);
  const sizes = await generateAllSizes(baseImage);

  return {
    captions,
    assets: sizes,
    schedule: [
      { platform: "instagram", type: "post", date: new Date(Date.now() + 86400000) },
      { platform: "instagram", type: "reel", date: new Date(Date.now() + 2*86400000) },
      { platform: "youtube", type: "short", date: new Date(Date.now() + 3*86400000) },
    ],
  };
}
