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

/** Шрифты нужны до рисования canvas-текстур (в 3D и VR весь текст — это текстуры). */
export async function loadFonts() {
  const specs = [
    '600 48px "Cormorant Garamond"',
    '500 48px "Cormorant Garamond"',
    'italic 500 48px "Cormorant Garamond"',
    "400 30px Inter",
    "600 30px Inter",
  ];
  try {
    await Promise.race([
      Promise.all(
        specs.flatMap((s) => [
          document.fonts.load(s, "Абвгдежз"),
          document.fonts.load(s, "Abcdefg 0123"),
        ])
      ),
      new Promise((r) => setTimeout(r, 4000)),
    ]);
  } catch {
    /* fallback fonts */
  }
}
