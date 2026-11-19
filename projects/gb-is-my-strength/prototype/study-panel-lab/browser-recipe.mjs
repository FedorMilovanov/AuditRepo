/**
 * Arena browser launch helper — Sparticuz Chromium 153.
 *
 * Recipe from the session history:
 *  1. NSS patch: inflate al2023.tar.br into /tmp/gblib/lib and point
 *     LD_LIBRARY_PATH there (libnspr4/libnss3/libnssutil3 are not in the base image).
 *  2. LD_PRELOAD stub: a tiny empty shared object keeps Chromium's dynamic
 *     loader happy on this sandbox without pulling any CDN binary.
 *  3. Chromium binary lives at /tmp/chromium; swiftshader libs in /tmp.
 *
 * Full playwright install is impossible here (CDN outside egress). WebKit
 * contracts are deliberately NOT run: mark them "skipped: sandbox egress"
 * and leave them to CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const LAB = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(LAB, 'package.json'));
const puppeteer = require('puppeteer-core');
let chromiumPkg;
try { chromiumPkg = require('@sparticuz/chromium').default; } catch { chromiumPkg = null; }

const CHROME = '/tmp/chromium';
const NSS = '/tmp/gblib/lib';
const STUB = '/tmp/arena-chromium-preload.so';
const FONTS = '/tmp/fonts';

function ensureNss() {
  if (fs.existsSync(path.join(NSS, 'libnss3.so'))) return;
  fs.mkdirSync(NSS, { recursive: true });
  const br = path.join(LAB, 'node_modules/@sparticuz/chromium/bin/al2023.tar.br');
  const tar = '/tmp/arena-launch-helper-al2023.tar';
  fs.writeFileSync(tar, zlib.brotliDecompressSync(fs.readFileSync(br)));
  execFileSync('tar', ['-xf', tar, '-C', NSS, '--strip-components=1']);
}

function ensureChromium() {
  if (fs.existsSync(CHROME)) return;
  const br = path.join(LAB, 'node_modules/@sparticuz/chromium/bin/chromium.br');
  fs.writeFileSync(CHROME, zlib.brotliDecompressSync(fs.readFileSync(br)), { mode: 0o700 });
}

function ensureStub() {
  if (fs.existsSync(STUB)) return;
  const c = '/tmp/arena-chromium-preload.c';
  fs.writeFileSync(c, '/* Arena sandbox LD_PRELOAD stub — intentionally empty. */\n' +
    'int arena_chromium_preload_stub(void) { return 0; }\n');
  execFileSync('gcc', ['-shared', '-fPIC', '-o', STUB, c]);
}

function ensureFonts() {
  if (fs.existsSync(path.join(FONTS, 'fonts.conf'))) return;
  fs.mkdirSync(FONTS, { recursive: true });
  const br = path.join(LAB, 'node_modules/@sparticuz/chromium/bin/fonts.tar.br');
  const tar = '/tmp/arena-launch-helper-fonts.tar';
  fs.writeFileSync(tar, zlib.brotliDecompressSync(fs.readFileSync(br)));
  execFileSync('tar', ['-xf', tar, '-C', FONTS]);
}

export const BROWSER_META = {
  engine: 'Sparticuz Chromium 153.0.8010.0',
  helper: '/tmp/launch-helper.js',
  nssPatch: NSS,
  preloadStub: STUB,
  webkit: 'skipped: sandbox egress',
  ciOwner: 'CI verifies WebKit/Safari contracts',
};

export async function launch() {
  ensureNss();
  ensureChromium();
  ensureStub();
  ensureFonts();
  const args = [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--no-zygote', '--single-process', '--disable-gpu',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--font-render-hinting=none', '--headless=shell',
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  ];
  return puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args,
    env: {
      ...process.env,
      LD_LIBRARY_PATH: `${NSS}:/tmp`,
      LD_PRELOAD: STUB,
      FONTCONFIG_PATH: FONTS,
      HOME: '/tmp',
      LIBGL_ALWAYS_SOFTWARE: '1',
    },
  });
}
