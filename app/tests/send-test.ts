import { sendVerificationEmail } from "../../lib/email";

async function main() {
  try {
    await sendVerificationEmail("care@xstructure.ai", "999999");
    console.log("✅ Verification email sent");
  } catch (err) {
    console.error("❌ Verification email failed", err);
  }
}

main();
