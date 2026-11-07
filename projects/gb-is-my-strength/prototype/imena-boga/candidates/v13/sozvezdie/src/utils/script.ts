import type { NameEntry } from "../data/names";

export type ScriptKind = "hebrew" | "aramaic" | "greek";

const ARAMAIC_IDS = new Set(["abba", "atiq-yomin"]);
const GREEK_IDS = new Set(["pantokrator", "alpha-omega", "ego-eimi"]);

export function scriptOf(name: Pick<NameEntry, "id">): ScriptKind {
  if (GREEK_IDS.has(name.id)) return "greek";
  if (ARAMAIC_IDS.has(name.id)) return "aramaic";
  return "hebrew";
}

export function scriptLabel(name: Pick<NameEntry, "id">): string {
  const kind = scriptOf(name);
  return kind === "greek" ? "Греческий" : kind === "aramaic" ? "Арамейский" : "Иврит";
}

export function scriptAttrs(name: Pick<NameEntry, "id">): {
  dir: "rtl" | "ltr";
  lang: "he" | "arc" | "el";
} {
  const kind = scriptOf(name);
  if (kind === "greek") return { dir: "ltr", lang: "el" };
  if (kind === "aramaic") return { dir: "rtl", lang: "arc" };
  return { dir: "rtl", lang: "he" };
}

export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u0591-\u05c7]/g, "")
    .replace(/ё/g, "е")
    .trim();
}
