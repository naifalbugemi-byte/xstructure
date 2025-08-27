import sharp from "sharp";

export async function generateAllSizes(imageBuffer: Buffer) {
  return {
    instagramPost: await sharp(imageBuffer).resize(1080, 1080).toBuffer(),
    instagramStory: await sharp(imageBuffer).resize(1080, 1920).toBuffer(),
    youtubeThumb: await sharp(imageBuffer).resize(1280, 720).toBuffer(),
    twitterPost: await sharp(imageBuffer).resize(1200, 600).toBuffer(),
  };
}
