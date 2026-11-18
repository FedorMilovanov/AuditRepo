// Serve the exact audited bytes plus a separate, client-only print witness page.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const [distArg, libArg, portArg = '4178'] = process.argv.slice(2);
assert.ok(distArg && libArg, 'node preview.mjs PRODUCT/dist PDFJS_DIST [PORT]');
const dist = await realpath(distArg);
const lib = await realpath(libArg);
const packageInfo = JSON.parse(await readFile(resolve(lib, 'package.json'), 'utf8'));
assert.equal(packageInfo.name, 'pdfjs-dist');
assert.equal(packageInfo.version, '5.4.624');
const prev = JSON.parse(await readFile(new URL('../../../arena-quiz-print-readiness/2026-11-18/evidence/print-tail-witness.json', import.meta.url)));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
assert.equal(prev.anchor, anchor);
const pins = prev.assets.main.distSha256;
const hash = data => createHash('sha256').update(data).digest('hex');
assert.equal(Object.keys(pins).length, 48);
for (const [file, expected] of Object.entries(pins)) {
  assert.equal(hash(await readFile(resolve(dist, file))), expected, `wrong dist bytes: ${file}`);
}
const article = '/articles/anatomiya-padeniya-pyat-stadiy/';
const marker = article.slice(1) + 'index.html';
assert.ok(pins[marker]);
const witness = { anchor, article, articleSha256: pins[marker], distPinsVerifiedAtStartup: 48, pdfjs: packageInfo.version,
  nativePrintWitness: 'pending', expectedProfile: { width: 390, height: 844, paper: 'A4' } };
const pathBase = '/__print-witness/';
const kit = new Map(await Promise.all([
  [pathBase, 'index.html', 'text/html; charset=utf-8'],
  [pathBase + 'checker.mjs', 'checker.mjs', 'text/javascript; charset=utf-8'],
  [pathBase + 'style.css', 'style.css', 'text/css; charset=utf-8'],
].map(async ([url, file, type]) => [url, [await readFile(new URL(file, import.meta.url)), type]])));
kit.set(pathBase + 'status.json', [Buffer.from(JSON.stringify(witness, null, 2) + '\n'), 'application/json; charset=utf-8']);
const mime = new Map(Object.entries({
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml',
  '.ico':'image/x-icon', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.gif':'image/gif', '.woff2':'font/woff2', '.woff':'font/woff', '.ttf':'font/ttf', '.wasm':'application/wasm',
  '.pdf':'application/pdf', '.xml':'application/xml; charset=utf-8', '.webmanifest':'application/manifest+json',
}));
const rules = {
  article: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'",
  kit: "default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; worker-src 'self'; connect-src 'self'; font-src 'self' data: blob:; img-src 'self' data: blob:; object-src 'none'; base-uri 'none'; form-action 'none'",
};
async function staticFile(root, rel) {
  const local = resolve(root, rel);
  if (!local.startsWith(root + sep)) return null;
  const full = await realpath(local);
  if (!full.startsWith(root + sep) || !(await stat(full)).isFile()) return null;
  return [await readFile(full), mime.get(extname(full).toLowerCase()) || 'application/octet-stream'];
}
const server = createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const url = decodeURIComponent(new URL(req.url, 'http://preview.invalid').pathname);
    if (url === '/' || url === '/__print-witness') {
      res.writeHead(302, { Location: pathBase }).end();
      return;
    }
    if (url.includes('\\') || url.includes('\0') || url.startsWith('//')) throw new Error('invalid path');
    const pdfjs = /^\/__print-witness\/pdfjs\/(build\/(?:pdf|pdf\.worker)\.mjs|(?:cmaps|standard_fonts|wasm|iccs)\/[\w.-]+)$/.exec(url);
    const item = kit.get(url) || (pdfjs ? await staticFile(lib, pdfjs[1]) : url.startsWith(pathBase)
      ? null : await staticFile(dist, url === article.slice(0, -1) ? marker : url.slice(1) + (url.endsWith('/') ? 'index.html' : '')));
    if (!item) throw new Error('not found');
    const [body, type] = item;
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': body.length,
      'Content-Security-Policy': url.startsWith(pathBase) ? rules.kit : rules.article });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});
server.listen(Number(portArg), '0.0.0.0', () => console.log(`${witness.distPinsVerifiedAtStartup} exact dist pins; witness on port ${server.address().port}`));
