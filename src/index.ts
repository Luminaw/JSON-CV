import { generatePdf, getHtml } from "./generator";

async function main() {
  const isDev = process.env.NODE_ENV !== "production";

  try {
    // Initial generation
    await generatePdf();

    if (isDev) {
      const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
      console.log("Watch mode enabled. Starting preview server...");
      
      try {
        Bun.serve({
          port,
          async fetch(req) {
            try {
              const html = await getHtml();
              return new Response(html, {
                headers: { "Content-Type": "text/html" },
              });
            } catch (e) {
              return new Response("Error generating preview: " + e, { status: 500 });
            }
          },
        });
        console.log(`Preview your resume at: http://localhost:${port}`);
      } catch (e: any) {
        if (e.code === "EADDRINUSE") {
          console.error(`Port ${port} is already in use. Try running with PORT=3001 bun dev`);
        } else {
          throw e;
        }
      }
    }
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    process.exit(1);
  }
}

main();
