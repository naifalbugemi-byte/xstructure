import { sendResetEmail } from "../../lib/email";

async function main() {
  try {
    await sendResetEmail("care@xstructure.ai", "Biggieme", "https://xstructure.ai/reset/123456");
    console.log("✅ Reset email sent");
  } catch (err) {
    console.error("❌ Reset email failed", err);
  }
}

main();
