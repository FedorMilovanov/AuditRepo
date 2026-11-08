import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const archiveExport = process.env.GB_LIBRARY_SINGLE_FILE === "1";

// Normal development/publishing: cacheable assets with relative URLs for a
// subdirectory preview. Single-file export is an explicit archival option.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), ...(archiveExport ? [viteSingleFile()] : [])],
  build: { target: "es2022" },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
