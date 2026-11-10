import "@fontsource/cormorant-garamond/cyrillic-500.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/cyrillic-600.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/cyrillic-500-italic.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/inter/cyrillic-400.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/cyrillic-600.css";
import "@fontsource/inter/latin-600.css";

export const SERIF = '"Cormorant Garamond", Georgia, serif';
export const SANS = 'Inter, system-ui, sans-serif';

/** Font-dependent CanvasTextures must not initialize on unverified fallback.
 * Fonts ship with the lab itself; no CDN, test overrides or font substitutions.
 * A real failure must be surfaced, not silently render different typography. */
export async function loadFonts(): Promise<void> {
  const specs = [
    { font: '600 48px "Cormorant Garamond"', text: "Конфессии" },
    { font: '500 48px "Cormorant Garamond"', text: "Статьи" },
    { font: 'italic 500 48px "Cormorant Garamond"', text: "История" },
    { font: "400 30px Inter", text: "Библиотека" },
    { font: "600 30px Inter", text: "СЕРИИ" },
    { font: '600 48px "Cormorant Garamond"', text: "Abcdefg 0123" },
    { font: "400 30px Inter", text: "Abcdefg 0123" },
  ];
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      Promise.all(specs.map(async ({ font, text }) => {
        const faces = await document.fonts.load(font, text);
        if (!faces.length || faces.some((face) => face.status !== "loaded")) {
          throw new Error(`Font unavailable: ${font}, sample ${text}`);
        }
        if (!document.fonts.check(font, text)) {
          throw new Error(`Font not ready: ${font}, sample ${text}`);
        }
      })),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Local typefaces exceeded 12s deadline")), 12000);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
