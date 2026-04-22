import { generatePdf } from "./generator";

async function main() {
  try {
    await generatePdf();
  } catch (error) {
    console.error("Γ¥î Failed to generate PDF:", error);
    process.exit(1);
  }
}

main();
