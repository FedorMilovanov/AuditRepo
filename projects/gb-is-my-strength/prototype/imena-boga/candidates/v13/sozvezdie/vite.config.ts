import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Match the actual emitted hashed @fontsource WOFF2 files.
// No extra font binaries, visual changes, or preload on 320–359px where it hurts CLS.
function responsiveTitlePreload(): Plugin {
  return {
    name: "gb-constellation-responsive-title-preload",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        const outputs = Object.keys(ctx.bundle);
        return ["cormorant-garamond-cyrillic-600-normal-", "eb-garamond-cyrillic-400-italic-"].map((prefix) => {
          const hits = outputs.filter((name) => name.startsWith("assets/" + prefix) && name.endsWith(".woff2"));
          if (hits.length !== 1) throw new Error("Missing or ambiguous title font: " + prefix);
          return {
            tag: "link",
            attrs: {
              rel: "preload",
              href: "./" + hits[0],
              as: "font",
              type: "font/woff2",
              crossorigin: true,
              media: "(min-width: 360px)",
            },
            injectTo: "head-prepend" as const,
          };
        });
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Standalone reference builds must not assume they are hosted at site root.
  // Product will use Astro's own asset pipeline at the canonical route.
  base: './',
  plugins: [react(), tailwindcss(), responsiveTitlePreload()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
