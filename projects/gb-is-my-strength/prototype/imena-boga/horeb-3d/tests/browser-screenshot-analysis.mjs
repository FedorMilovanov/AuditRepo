// Analyze screenshot PNGs via browser canvas: brightness, color distribution,
// content variety. Verifies 3D scene is rendering (not blank/black).
// Uses Sparticuz Chromium 153 + puppeteer-core.
//
// Usage: LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser-screenshot-analysis.mjs
import puppeteer from 'puppeteer-core';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const CHROME = '/tmp/chromium';
const SHOTS = join(process.cwd(), '.test-build/screenshots');

const args = [
  '--no-sandbox', '--disable-setuid-sandbox',
  '--disable-gpu', '--disable-dev-shm-usage',
  '--single-process', '--no-zygote',
  '--headless=shell',
  '--window-size=1440,900',
  '--font-render-hinting=none',
];

let pass = 0, fail = 0;
const t = (name, ok, detail = '') => {
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' — ' + detail : ''));
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args,
  headless: 'shell',
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Get list of 3D world screenshots (exclude intro/reader/mobile)
const files = readdirSync(SHOTS).filter(f => f.endsWith('.png'));
const worldShots = files.filter(f => ['02-world-initial', '03-move-forward', '04-move-right', '05-explore', '08-walk-forward', '09-interact', '10-bush-area'].some(s => f.startsWith(s)));

console.log(`Analyzing ${worldShots.length} 3D world screenshots:\n`);

const results = [];
for (const f of worldShots) {
  const buf = readFileSync(join(SHOTS, f));
  const b64 = buf.toString('base64');
  const result = await page.evaluate((data) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = data.data;
        let sumR = 0, sumG = 0, sumB = 0, count = 0;
        let nonBlack = 0, nonWhite = 0;
        const colors = new Map();
        // Sample every 50th pixel for speed
        for (let i = 0; i < pixels.length; i += 200) {
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          sumR += r; sumG += g; sumB += b; count++;
          if (r + g + b > 30) nonBlack++;
          if (r + g + b < 700) nonWhite++;
          // Quantize color for distribution
          const key = `${Math.floor(r / 32)}-${Math.floor(g / 32)}-${Math.floor(b / 32)}`;
          colors.set(key, (colors.get(key) || 0) + 1);
        }
        const avgR = (sumR / count).toFixed(0);
        const avgG = (sumG / count).toFixed(0);
        const avgB = (sumB / count).toFixed(0);
        const brightness = ((sumR + sumG + sumB) / (count * 3)).toFixed(0);
        resolve({
          size: `${canvas.width}x${canvas.height}`,
          avgR, avgG, avgB,
          brightness,
          nonBlackPct: ((nonBlack / count) * 100).toFixed(1),
          nonWhitePct: ((nonWhite / count) * 100).toFixed(1),
          uniqueColors: colors.size,
          topColors: [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k}(${((v / count) * 100).toFixed(1)}%)`),
        });
      };
      img.onerror = () => resolve({ error: 'failed to load' });
      img.src = 'data:image/png;base64,' + data;
    });
  }, b64);
  results.push({ file: f, result });
  if (result.error) {
    console.log(`  ${f}: ${result.error}`);
    continue;
  }
  console.log(`  ${f}:`);
  console.log(`    size=${result.size} brightness=${result.brightness} avgRGB(${result.avgR},${result.avgG},${result.avgB})`);
  console.log(`    non-black: ${result.nonBlackPct}%  non-white: ${result.nonWhitePct}%  unique-colors: ${result.uniqueColors}`);
  console.log(`    top-colors: ${result.topColors.join(', ')}`);
}

// ── Verify rendering
let renderedCount = 0;
let brightnessVariety = 0;
const brightnesses = [];
for (const { file, result } of results) {
  if (result.error) continue;
  if (parseFloat(result.nonBlackPct) > 10) renderedCount++;
  brightnesses.push(parseFloat(result.brightness));
}
if (brightnesses.length > 1) {
  const min = Math.min(...brightnesses);
  const max = Math.max(...brightnesses);
  brightnessVariety = max - min;
}

t(`${renderedCount}/${results.length} screenshots have rendered content (>10% non-black)`, renderedCount === results.length, renderedCount === results.length ? '' : `${results.length - renderedCount} blank`);
t('screenshots have brightness variety (different zones/positions)', brightnessVariety > 5, `range: ${brightnesses.length > 1 ? Math.min(...brightnesses) + '-' + Math.max(...brightnesses) : 'n/a'}`);

// ── Check color distribution (warm vs cool tones)
let warmCount = 0, coolCount = 0;
for (const { result } of results) {
  if (result.error) continue;
  const r = parseInt(result.avgR), g = parseInt(result.avgG), b = parseInt(result.avgB);
  if (r > b + 10) warmCount++;
  else if (b > r + 10) coolCount++;
}
t('color tone variety (warm and cool zones)', warmCount + coolCount >= 2, `warm=${warmCount} cool=${coolCount}`);

await browser.close();

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
