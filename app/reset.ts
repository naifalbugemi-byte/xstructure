import { sendResetEmail } from "../lib/email";

async function main() {
  try {
    const to = "care@xstructure.ai"; // غيّرها لإيميلك للتجربة
    const name = "Biggieme 🐯";
    const resetLink = "https://xstructure.ai/reset/123456";

    await sendResetEmail(to, name, resetLink);
    console.log("✅ Reset email sent!");
  } catch (err) {
    console.error("❌ Failed to send reset email:", err);
  }
}

main();
