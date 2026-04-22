import { generatePdf, getHtml } from "./generator";
import { watch } from "fs";

async function main() {
  const isDev = process.env.NODE_ENV !== "production";

  try {
    // Initial generation
    await generatePdf();

    if (isDev) {
      const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
      console.log("Watch mode enabled. Starting preview server...");
      
      const server = Bun.serve({
        port,
        async fetch(req, server) {
          const url = new URL(req.url);
          
          // WebSocket endpoint for live reload
          if (url.pathname === "/ws") {
            const upgraded = server.upgrade(req);
            if (!upgraded) {
              return new Response("WebSocket upgrade failed", { status: 400 });
            }
            return;
          }

          // Serve the live reload client script
          if (url.pathname === "/live-reload.js") {
            return new Response(Bun.file("./src/client.js"));
          }

          try {
            let html = await getHtml();
            
            // Inject live reload script only in dev browser view
            const scriptTag = '<script src="/live-reload.js"></script>';
            html = html.replace("</body>", `${scriptTag}</body>`);
            
            return new Response(html, {
              headers: { "Content-Type": "text/html" },
            });
          } catch (e) {
            return new Response("Error generating preview: " + e, { status: 500 });
          }
        },
        websocket: {
          open(ws) {
            ws.subscribe("reload");
          },
          message() {}, // No messages expected from client
          close(ws) {
            ws.unsubscribe("reload");
          },
        },
      });

      console.log(`Preview your resume at: http://localhost:${port}`);

      // Setup file watcher
      let debounceTimer: any = null;
      watch(process.cwd(), { recursive: true }, (event, filename) => {
        if (!filename) return;
        
        // Ignore node_modules, git, and the generated PDF
        if (
          filename.includes("node_modules") || 
          filename.includes(".git") || 
          filename === "resume.pdf" ||
          filename.endsWith(".js") // Ignore compiled/client JS
        ) return;

        // Only watch relevant file types
        const relevantExtensions = [".ts", ".hbs", ".css", ".json"];
        if (!relevantExtensions.some(ext => filename.endsWith(ext))) return;

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          console.log(`File changed: ${filename}. Re-generating PDF and reloading...`);
          try {
            await generatePdf();
            server.publish("reload", "reload");
          } catch (err) {
            console.error("Error during auto-regeneration:", err);
          }
        }, 100);
      });
    }
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    process.exit(1);
  }
}

main();
