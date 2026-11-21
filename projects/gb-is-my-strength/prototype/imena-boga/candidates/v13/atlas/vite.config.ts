import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only two proven critical title faces are prioritized; no font binary is copied.
// Vite resolves content-hashed outputs from the existing @fontsource imports.
function atlasTitlePreload(): Plugin {
  return {
    name: "gb-atlas-title-preload",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        if (!ctx.bundle) return; // Standalone dev uses the ordinary CSS delivery.
        const outputs = Object.keys(ctx.bundle);
        return ["playfair-display-cyrillic-700-normal-", "playfair-display-cyrillic-400-italic-"].map((prefix) => {
          const matches = outputs.filter((name) => name.startsWith("assets/" + prefix) && name.endsWith(".woff2"));
          if (matches.length !== 1) throw new Error("Missing or ambiguous title font: " + prefix);
          return {
            tag: "link",
            attrs: { rel: "preload", href: "./" + matches[0], as: "font", type: "font/woff2", crossorigin: true },
            injectTo: "head-prepend" as const,
          };
        });
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Route-safe assets for nested standalone prototypes; Astro is the Product owner.
  base: "./",
  plugins: [react(), tailwindcss(), atlasTitlePreload()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
