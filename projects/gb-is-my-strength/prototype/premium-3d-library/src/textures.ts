import * as THREE from "three";
import { type Item } from "./data";
import { SERIF, SANS } from "./fonts";

type Ctx = CanvasRenderingContext2D;

export function canvasTex(w: number, h: number, draw: (c: Ctx, w: number, h: number) => void) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

export function wrap(c: Ctx, text: string, x: number, y: number, maxW: number, lh: number, maxLines = 99) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (c.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s.,;:—-]*\S*$/, "") + "…";
  }
  lines.forEach((l, i) => c.fillText(l, x, y + i * lh));
  return lines.length;
}

const spaced = (c: Ctx, px: number) => {
  (c as any).letterSpacing = `${px}px`;
};

/** Fit real loaded glyph advances inside the editorial safe zone.
 * Do not squish text horizontally via CanvasRenderingContext2D.fillText's
 * maxWidth parameter: that distorts serif letterforms, especially in WebKit.
 * The authored type hierarchy may decrease in size, never exit its border. */
export function fitCanvasTypeface(
  c: Ctx, text: string, opts: {
    family: string; weight: number; maxPx: number; minPx: number; maxWidth: number
  },
): number {
  for (let px = opts.maxPx; px >= opts.minPx; px -= 1) {
    c.font = `${opts.weight} ${px}px ${opts.family}`;
    if (c.measureText(text).width <= opts.maxWidth) return px;
  }
  throw new Error(`Canvas typography cannot fit: ${text}`);
}

function ornamentCorner(c: Ctx, x: number, y: number, s: number, color: string) {
  c.save();
  c.translate(x, y);
  c.rotate(Math.PI / 4);
  c.fillStyle = color;
  c.fillRect(-s / 2, -s / 2, s, s);
  c.restore();
}

/** Табличка раздела (над экспонатом) */
export function plaqueTexture(item: Item) {
  return canvasTex(1024, 420, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#101736");
    g.addColorStop(1, "#170e2a");
    c.fillStyle = g;
    c.beginPath();
    c.roundRect(6, 6, w - 12, h - 12, 34);
    c.fill();
    c.lineWidth = 3;
    c.strokeStyle = item.color;
    c.globalAlpha = 0.85;
    c.beginPath();
    c.roundRect(6, 6, w - 12, h - 12, 34);
    c.stroke();
    c.globalAlpha = 0.35;
    c.beginPath();
    c.roundRect(22, 22, w - 44, h - 44, 24);
    c.stroke();
    c.globalAlpha = 1;
    [[40, 40], [w - 40, 40], [40, h - 40], [w - 40, h - 40]].forEach(([x, y]) => ornamentCorner(c, x, y, 12, item.color));

    c.textBaseline = "alphabetic";
    c.fillStyle = item.color;
    c.font = `600 28px ${SANS}`;
    spaced(c, 5);
    c.fillText(`${item.n}  ·  ${item.label.toUpperCase()}`, 70, 92);
    spaced(c, 0);

    c.fillStyle = "#fbf3df";
    // Font metrics differ between Chromium and WebKit even after the same
    // locally hosted font loads. Fit the actual glyphs to symmetric margins.
    fitCanvasTypeface(c, item.title, {
      family: SERIF, weight: 600, maxPx: 142, minPx: 76, maxWidth: w - 140,
    });
    c.fillText(item.title, 70, 232);

    const gl = c.createLinearGradient(70, 0, 520, 0);
    gl.addColorStop(0, item.color);
    gl.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = gl;
    c.fillRect(70, 262, 450, 3);

    c.fillStyle = "#bfc4de";
    c.font = `400 33px ${SANS}`;
    wrap(c, item.desc, 70, 318, w - 140, 44, 2);
  });
}

/** Карточка-стела (редакторский выбор) */
export function createCardTexture(item: Item) {
  const w = 1024;
  const h = 660;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const c = cv.getContext("2d")!;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const draw = (img?: HTMLImageElement) => {
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0d1330");
    g.addColorStop(1, "#1a1033");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);

    // арт-блок
    const ax = 22, ay = 22, aw = w - 44, ah = 332;
    c.save();
    c.beginPath();
    c.roundRect(ax, ay, aw, ah, 22);
    c.clip();
    if (img) {
      const r = Math.max(aw / img.width, ah / img.height);
      const iw = img.width * r;
      const ih = img.height * r;
      c.drawImage(img, ax + (aw - iw) / 2, ay + (ah - ih) / 2, iw, ih);
    } else {
      const bg = c.createRadialGradient(w / 2, ay + ah / 2, 10, w / 2, ay + ah / 2, 520);
      bg.addColorStop(0, item.color + "aa");
      bg.addColorStop(0.5, "#1a1a3c");
      bg.addColorStop(1, "#080a1c");
      c.fillStyle = bg;
      c.fillRect(ax, ay, aw, ah);
      c.strokeStyle = item.color;
      c.globalAlpha = 0.25;
      c.lineWidth = 1.5;
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        c.beginPath();
        c.moveTo(w / 2 + Math.cos(a) * 60, ay + ah / 2 + Math.sin(a) * 60);
        c.lineTo(w / 2 + Math.cos(a) * 700, ay + ah / 2 + Math.sin(a) * 700);
        c.stroke();
      }
      for (let r = 80; r < 420; r += 60) {
        c.beginPath();
        c.arc(w / 2, ay + ah / 2, r, 0, Math.PI * 2);
        c.stroke();
      }
      c.globalAlpha = 1;
      c.fillStyle = "#fff6dc";
      c.font = `600 150px ${SERIF}`;
      c.textAlign = "center";
      c.fillText(item.glyph || "", w / 2, ay + ah / 2 + 48);
      c.textAlign = "left";
    }
    const sh = c.createLinearGradient(0, ay + ah - 140, 0, ay + ah);
    sh.addColorStop(0, "rgba(8,10,28,0)");
    sh.addColorStop(1, "rgba(8,10,28,0.9)");
    c.fillStyle = sh;
    c.fillRect(ax, ay + ah - 140, aw, 140);
    c.restore();

    // Editorial metadata has its own strip BETWEEN the art and title.
    // Never put badges over source cover artwork: those images can already
    // contain large baked-in lettering that cannot be detected by a DOM test.
    c.font = `600 24px ${SANS}`;
    spaced(c, 3);
    const label = item.label.toUpperCase();
    fitCanvasTypeface(c, label, {
      family: SANS, weight: 600, maxPx: 24, minPx: 18, maxWidth: w - 140,
    });
    const tw = c.measureText(label).width + 44;
    c.fillStyle = "#182126";
    c.beginPath();
    c.roundRect(48, 365, tw, 46, 23);
    c.fill();
    c.strokeStyle = item.color;
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = item.color;
    c.fillText(label, 70, 397);
    spaced(c, 0);

    // Independent editorial type zone, with sufficient ascent/descent
    // clearance even for a two-line heading and two lines of description.
    c.fillStyle = "#fbf3df";
    c.font = `600 56px ${SERIF}`;
    const n = wrap(c, item.title, 48, 477, w - 96, 52, 2);
    c.fillStyle = "#b9bfdc";
    c.font = `400 25px ${SANS}`;
    wrap(c, item.desc, 48, 477 + n * 52 + 7, w - 96, 35, n > 1 ? 2 : 3);

    // рамка
    c.strokeStyle = item.color;
    c.globalAlpha = 0.6;
    c.lineWidth = 3;
    c.strokeRect(4, 4, w - 8, h - 8);
    c.globalAlpha = 1;
    tex.needsUpdate = true;
  };

  draw();
  if (item.image) {
    const img = new Image();
    img.onload = () => draw(img);
    img.src = item.image;
  }
  return tex;
}

/** Детальная панель для VR */
export function detailTexture(item: Item) {
  return canvasTex(1024, 720, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "rgba(10,15,38,0.96)");
    g.addColorStop(1, "rgba(24,12,44,0.96)");
    c.fillStyle = g;
    c.beginPath();
    c.roundRect(4, 4, w - 8, h - 8, 36);
    c.fill();
    c.strokeStyle = item.color;
    c.lineWidth = 4;
    c.stroke();
    c.fillStyle = item.color;
    c.font = `600 28px ${SANS}`;
    spaced(c, 5);
    c.fillText(item.label.toUpperCase(), 60, 90);
    spaced(c, 0);
    c.fillStyle = "#fbf3df";
    c.font = `600 76px ${SERIF}`;
    const n = wrap(c, item.title, 60, 180, w - 120, 78, 3);
    c.fillStyle = "#c3c8e2";
    c.font = `400 33px ${SANS}`;
    wrap(c, item.desc, 60, 180 + n * 78 + 24, w - 120, 46, 5);
    c.fillStyle = item.color;
    c.font = `600 28px ${SANS}`;
    c.fillText(item.tags.join("  ·  "), 60, h - 50);
  });
}

export function buttonTexture(text: string, primary: boolean) {
  return canvasTex(512, 128, (c, w, h) => {
    c.fillStyle = primary ? "#f0c27a" : "rgba(20,26,56,0.95)";
    c.beginPath();
    c.roundRect(4, 4, w - 8, h - 8, 60);
    c.fill();
    c.strokeStyle = "#f0c27a";
    c.lineWidth = 4;
    c.stroke();
    c.fillStyle = primary ? "#1a1204" : "#f0c27a";
    c.font = `600 44px ${SANS}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, w / 2, h / 2 + 2);
  });
}

/** Главный заголовок над ротондой */
export function titleTexture() {
  return canvasTex(2048, 640, (c, w) => {
    c.textAlign = "center";
    c.fillStyle = "#f0c27a";
    c.font = `600 40px ${SANS}`;
    spaced(c, 14);
    c.fillText("БОГОСЛОВСКАЯ БИБЛИОТЕКА  ·  3D-КАРТА САЙТА", w / 2 + 7, 110);
    spaced(c, 0);
    const g = c.createLinearGradient(0, 160, 0, 400);
    g.addColorStop(0, "#fffaf0");
    g.addColorStop(1, "#f0c27a");
    c.fillStyle = g;
    c.font = `600 232px ${SERIF}`;
    c.fillText("Господь Бог", w / 2, 340);
    c.font = `600 232px ${SERIF}`;
    c.fillText("— сила моя", w / 2, 560);
  });
}

/** Бронзовый пояс с девизом вокруг пьедестала */
export function verseTexture() {
  return canvasTex(2048, 192, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#1b2149");
    g.addColorStop(1, "#0b0f28");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);

    c.textBaseline = "middle";
    c.textAlign = "center";
    const text = "«Господь Бог — сила моя»   ✦   Аввакум 3:19";
    const tg = c.createLinearGradient(0, 0, 0, h);
    tg.addColorStop(0, "#fffaea");
    tg.addColorStop(1, "#f0c27a");
    c.fillStyle = tg;
    c.font = `600 118px ${SERIF}`;
    c.fillText(text, w / 2, h / 2 + 4);

    c.fillStyle = "#f0c27a";
    [70, w - 70].forEach((x) => {
      c.save();
      c.translate(x, h / 2);
      c.rotate(Math.PI / 4);
      c.fillRect(-9, -9, 18, 18);
      c.restore();
    });
  });
}

/** Мраморный пол ротонды (центр холста = центр платформы; 64 px = 1 м) */
/**
 * Travertine tile and restrained inlay. The layout is deterministic and includes
 * no fantasy signposting or emissive rings; low mode saves 75% texture memory.
 */
export function tabletTextures(label: string) {
  const make = (emissive: boolean) =>
    canvasTex(256, 400, (c, w, h) => {
      c.fillStyle = emissive ? "#000" : "#6c6f86";
      c.fillRect(0, 0, w, h);
      if (!emissive) {
        for (let i = 0; i < 1400; i++) {
          c.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},255,0.03)`;
          c.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        }
      }
      c.textAlign = "center";
      c.fillStyle = emissive ? "#ffd58a" : "#2a2c3d";
      c.font = `600 54px ${SERIF}`;
      const nums = label.split(" ");
      nums.forEach((n, i) => c.fillText(n, w / 2, 90 + i * 62));
      c.strokeStyle = emissive ? "#ffd58a" : "#2a2c3d";
      c.lineWidth = 3;
      c.strokeRect(18, 18, w - 36, h - 36);
    });
  return { map: make(false), emissive: make(true) };
}

export function paperTexture() {
  return canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = "#f3ead3";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "rgba(60,45,30,0.55)";
    for (let y = 30; y < h - 20; y += 14) {
      const len = w - 70 - (Math.random() > 0.8 ? 80 : 0);
      c.fillRect(34, y, len, 3);
    }
    c.fillStyle = "rgba(160,30,30,0.7)";
    c.fillRect(34, 16, 40, 6);
  });
}

export function glowTexture() {
  return canvasTex(128, 128, (c, w) => {
    const g = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, w, w);
  });
}

export function lintelTexture() {
  return canvasTex(1024, 128, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#f0c27a";
    c.font = `600 54px ${SERIF}`;
    spaced(c, 10);
    c.fillText("НА ВЫСОТЫ МОИ", w / 2 + 5, h / 2 + 2);
    spaced(c, 0);
  });
}

export function verseTabletTexture() {
  return canvasTex(1024, 1280, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#1a1730");
    g.addColorStop(1, "#0c1024");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = "#f0c27a";
    c.lineWidth = 6;
    c.strokeRect(28, 28, w - 56, h - 56);
    c.globalAlpha = 0.45;
    c.lineWidth = 2;
    c.strokeRect(48, 48, w - 96, h - 96);
    c.globalAlpha = 1;
    c.textAlign = "center";
    c.fillStyle = "#f0c27a";
    c.font = `600 28px ${SANS}`;
    spaced(c, 6);
    c.fillText("АВВАКУМ  3:19", w / 2 + 3, 140);
    spaced(c, 0);
    c.fillStyle = "#fbf3df";
    c.font = `500 64px ${SERIF}`;
    const lines = [
      "Господь Бог —",
      "сила моя:",
      "Он сделает ноги мои",
      "как у оленя",
      "и на высоты мои",
      "возведёт меня.",
    ];
    lines.forEach((l, i) => c.fillText(l, w / 2, 280 + i * 92));
    c.fillStyle = "#f0c27a";
    c.font = `italic 500 36px ${SERIF}`;
    c.fillText("Soli Deo Gloria", w / 2, h - 110);
  });
}

export function lecternPage(item: Item) {
  return canvasTex(1024, 680, (c, w, h) => {
    c.fillStyle = "#f4ead3";
    c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(90,50,30,0.35)";
    c.lineWidth = 2;
    for (let y = 40; y < h - 30; y += 36) {
      c.beginPath();
      c.moveTo(48, y);
      c.lineTo(w - 48, y);
      c.stroke();
    }
    c.fillStyle = "#7a1f2c";
    c.font = `600 22px ${SANS}`;
    c.fillText(item.label.toUpperCase(), 56, 64);
    c.fillStyle = "#2a2118";
    c.font = `600 58px ${SERIF}`;
    const n = wrap(c, item.title, 56, 140, w - 120, 62, 2);
    c.fillStyle = "#4a3b2e";
    c.font = `400 28px ${SANS}`;
    wrap(c, item.desc, 56, 150 + n * 62, w - 120, 38, 5);
    c.fillStyle = "#8a6230";
    c.font = `italic 500 32px ${SERIF}`;
    c.fillText("Soli Deo Gloria", 56, h - 48);
  });
}

export function spineTexture(title: string, color: string, n: string) {
  return canvasTex(256, 768, (c, w, h) => {
    c.fillStyle = color;
    c.fillRect(0, 0, w, h);
    const g = c.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "rgba(0,0,0,0.35)");
    g.addColorStop(0.2, "rgba(255,255,255,0.08)");
    g.addColorStop(1, "rgba(0,0,0,0.25)");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = "#e7c98a";
    c.lineWidth = 6;
    c.strokeRect(14, 14, w - 28, h - 28);
    c.fillStyle = "#f6e7c1";
    c.font = `600 40px ${SANS}`;
    c.textAlign = "center";
    c.fillText(n, w / 2, 78);
    c.save();
    c.translate(w / 2, h / 2 + 20);
    c.rotate(-Math.PI / 2);
    c.fillStyle = "#f8edd4";
    c.font = `600 64px ${SERIF}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    let size = 64;
    while (c.measureText(title).width > h - 220 && size > 28) {
      size -= 2;
      c.font = `600 ${size}px ${SERIF}`;
    }
    c.fillText(title, 0, 0);
    c.restore();
  });
}

export function tomePlaque(item: Item) {
  return canvasTex(768, 200, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    c.fillStyle = "rgba(8,10,24,0.78)";
    c.beginPath();
    c.roundRect(8, 24, w - 16, h - 48, 28);
    c.fill();
    c.strokeStyle = item.color;
    c.lineWidth = 3;
    c.stroke();
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#fbf3df";
    c.font = `600 52px ${SERIF}`;
    const title = item.spine || item.title;
    c.fillText(title, w / 2, h / 2 + 2);
  });
}
