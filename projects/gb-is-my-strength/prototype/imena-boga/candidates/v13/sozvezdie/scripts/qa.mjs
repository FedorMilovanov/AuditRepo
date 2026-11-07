import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { statfsSync } from "node:fs";

const ROOT = resolve("dist");
const MIN_QA_FREE_GIB = 1;
// Guard the owner's computer before any screenshot-heavy headless QA.
// Read-only: never clean user files or other agents' work automatically.
for (const location of new Set([ROOT, tmpdir()])) {
  const fsStats = statfsSync(location, { bigint: true });
  const freeGiB = Number(fsStats.bavail * fsStats.bsize) / 1073741824;
  if (freeGiB < MIN_QA_FREE_GIB) {
    throw new Error("QA_DISK_BUDGET: " + freeGiB.toFixed(2) +
      " GiB free at " + location + "; need >= " + MIN_QA_FREE_GIB +
      " GiB before Playwright screenshots. Clean only proven disposable QA caches.");
  }
}
const MIME = { ".html": "text/html; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".woff2": "font/woff2" };

const server = createServer((req, res) => {
  try {
    const url = new URL(req.url || "/", "http://127.0.0.1").pathname;
    const requested = decodeURIComponent(url.slice(1) || "index.html");
    const file = resolve(ROOT, requested);
    if (!file.startsWith(ROOT + sep)) {
      res.writeHead(403).end("forbidden");
      return;
    }
    if (!existsSync(file)) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(readFileSync(file));
  } catch (error) {
    res.writeHead(500).end("QA server error");
  }
});
await new Promise((resolveServer, rejectServer) =>
  server.listen(0, "127.0.0.1", resolveServer).on("error", rejectServer)
);
const BASE_URL = "http://127.0.0.1:" + server.address().port;

// Portable Playwright launcher: install browser once via `npx playwright install chromium`.
// CHROMIUM_PATH is an optional escape hatch for an already-installed browser.
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ["--no-sandbox", "--font-render-hinting=none"],
});

const problems = [];
const notes = [];
const ok = (m) => notes.push("PASS " + m);
const bad = (m) => problems.push("FAIL " + m);

async function newPage(width, height, { touch = false } = {}) {
  const ctx = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
    viewport: { width, height },
    deviceScaleFactor: 1,
    hasTouch: touch,
    isMobile: touch,
    locale: "ru-RU",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("requestfailed", (r) => {
    if (!r.url().includes("fonts.g")) errors.push("REQFAIL " + (r.failure()?.errorText || "unknown") + " " + r.url());
  });
  page.errors = errors;
  return { ctx, page };
}

const boxesOverlap = (a, b) =>
  a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

// ───────────────────────── desktop 1440 ─────────────────────────
{
  const { ctx, page } = await newPage(1440, 900);
  await page.goto(BASE_URL + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2600);

  const h1 = await page.locator("h1").first().innerText();
  h1.includes("ИМЕНА БОГА") ? ok("hero title renders") : bad("hero title missing: " + h1);

  // hero image actually decoded
  const imgOk = await page.evaluate(async () => {
    const img = document.querySelector('[data-sinai-backdrop]');
    if (!(img instanceof HTMLImageElement)) return false;
    if (!img.complete) await new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
    return img.naturalWidth > 500 && img.naturalHeight > 200;
  });
  imgOk ? ok("hero artwork loads & decodes") : bad("hero artwork broken");

  // first name must be YHWH
  const firstSection = await page.locator("main section[id]").first().getAttribute("id");
  firstSection === "yhwh" ? ok("ЯХВЕ is first section") : bad("first section is " + firstSection);

  // tree present, nodes clickable
  await page.locator("#tsentr").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  const treeNodes = await page.locator('#tsentr [data-orbit-name], #tsentr button[aria-label^="ЯХВЕ — центральное имя"]').evaluateAll((els) =>
    els.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x, w: r.width, txt: e.innerText.replace(/\n/g, " ").trim() }; }),
  );
  treeNodes.length === 13 ? ok("radial tree has 13 nodes") : bad("radial nodes: " + treeNodes.length);
  const unlabelled = treeNodes.filter((n) => n.txt.length < 3);
  unlabelled.length === 0 ? ok("every radial node is labelled") : bad("unlabelled nodes: " + unlabelled.length);
  const off = treeNodes.filter((n) => n.x < 0 || n.x + n.w > 1440);
  off.length === 0 ? ok("radial nodes inside viewport") : bad("radial nodes offscreen: " + off.length);

  // The scene illustrates names; there is no orbit simulator or rotating rings.
  const ringAnimations = await page.locator('#tsentr [data-scene-ring]').evaluateAll(
    els => els.map(el => getComputedStyle(el).animationName),
  );
  ringAnimations.length === 2 && ringAnimations.every(n => n === 'none')
    ? ok("illustration rings are fixed; no endless rotation")
    : bad("unexpected orbit animation: " + JSON.stringify(ringAnimations));

  const strands = await page.locator('#tsentr [data-scene-strand]').evaluateAll(els => els.map(el => {
    const id = el.getAttribute('data-scene-strand');
    const node = [...document.querySelectorAll('#tsentr [data-orbit-name]')].find(btn => btn.getAttribute('data-orbit-name') === id);
    const coords = (el.getAttribute('d') || '').match(/-?[0-9]+(?:[.][0-9]+)?/g)?.map(Number) || [];
    if (!node || coords.length < 4) return { id, bad: true };
    const x = parseFloat(node.style.left), y = parseFloat(node.style.top);
    const ex = coords[coords.length - 2], ey = coords[coords.length - 1];
    return { id, startDistance: Math.hypot(coords[0] - 50, coords[1] - 50),
      endDistance: Math.hypot(ex - x, ey - y) };
  }));
  strands.length === 12 && strands.every(v => v.startDistance >= 10.0 && v.endDistance >= 3.3)
    ? ok("all 12 strands stop outside root and name-disc edges")
    : bad("scene strands intersect nodes: " + JSON.stringify(strands.filter(v => v.bad || v.startDistance < 10 || v.endDistance < 3.3)));

  const masks = await page.locator('#tsentr [data-scene-caption]').evaluateAll(els => els.map(el => {
    const color = getComputedStyle(el).backgroundColor;
    const parts = (color.match(/[0-9.]+/g) || []).map(Number);
    return { color, alpha: parts.length >= 4 ? parts[3] : parts.length === 3 ? 1 : 0 };
  }));
  masks.length === 24 && masks.every(x => x.alpha >= 0.99)
    ? ok("24 captions have opaque strand masks")
    : bad("missing/transparent captions: " + JSON.stringify(masks.filter(x => x.alpha < 0.99).slice(0, 3)));
  await page.screenshot({ path: join(tmpdir(), "shot-tree-desktop.png") });

  // grid: 29 cards
  await page.locator("#sozvezdie").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const cards = await page.locator('#sozvezdie button[aria-label^="Перейти"]').count();
  cards === 29 ? ok("grid shows 29 names") : bad("grid cards: " + cards);

  // search filter
  const search = page.locator('#sozvezdie input[type="search"]');
  await search.fill("пастырь");
  await page.waitForTimeout(350);
  const filtered = await page.locator('#sozvezdie button[aria-label^="Перейти"]').count();
  filtered > 0 && filtered < 29 ? ok(`search narrows to ${filtered}`) : bad("search filter count " + filtered);
  await search.fill("zzzz");
  await page.waitForTimeout(250);
  (await page.getByText("По этому запросу имён не нашлось").isVisible())
    ? ok("empty search state")
    : bad("no empty state");
  await page.getByRole("button", { name: "Показать все имена" }).click();
  await page.waitForTimeout(250);
  (await page.locator('#sozvezdie button[aria-label^="Перейти"]').count()) === 29
    ? ok("reset filters restores 29")
    : bad("reset filters broken");

  // navigate into an article section via grid
  await page.locator('#sozvezdie button[aria-label*="Эль Шадда"]').first().click();
  await page.waitForTimeout(1500);
  const hash = await page.evaluate(() => location.hash);
  hash === "#el-shaddai" ? ok("grid click sets hash") : bad("hash after grid click: " + hash);

  // header pill reflects real section (not "sozvezdie")
  const pill = await page.locator("header button").first().innerText();
  pill.toLowerCase().includes("шадда") ? ok("header pill shows active name") : bad("header pill: " + pill);

  // rails visible and NOT overlapping the dock
  const railBoxes = await page.locator("[data-rails]").evaluateAll((els) =>
    els.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }),
  );
  railBoxes.length === 2 ? ok("both rails mounted in article") : bad("rails count " + railBoxes.length);
  const dock = await page.locator("[data-reader-dock]").boundingBox();
  for (const rb of railBoxes) {
    if (boxesOverlap(rb, dock)) bad("RAIL OVERLAPS DOCK " + JSON.stringify({ rb, dock }));
  }
  if (!railBoxes.some((rb) => boxesOverlap(rb, dock))) ok("rails clear of reader dock");

  // rails clear of the reading column
  const col = await page.locator("#el-shaddai .reader-measure").boundingBox();
  for (const rb of railBoxes) if (boxesOverlap(rb, col)) bad("RAIL OVERLAPS TEXT COLUMN");
  if (!railBoxes.some((rb) => boxesOverlap(rb, col))) ok("rails clear of text column");

  // anchor lands below fixed header
  const head = await page.locator("header").boundingBox();
  const secTop = (await page.locator("#el-shaddai").boundingBox()).y;
  secTop >= head.height - 2 ? ok("anchor lands below header") : bad(`anchor under header: ${secTop} vs ${head.height}`);

  // ── YHWH anatomy block ──
  await page.evaluate(() => document.getElementById("yhwh").scrollIntoView({ behavior: "instant", block: "start" }));
  await page.waitForTimeout(1400);
  const tabs = await page.locator('#tetragrammaton [role="tab"]').count();
  tabs === 4 ? ok("tetragrammaton has 4 letter tabs") : bad("letter tabs: " + tabs);
  const firstPanel = await page.locator("#letter-panel").innerText();
  await page.locator('#tetragrammaton [role="tab"]').nth(2).click();
  await page.waitForTimeout(500);
  const thirdPanel = await page.locator("#letter-panel").innerText();
  thirdPanel !== firstPanel && thirdPanel.includes("Вав")
    ? ok("letter tab switches explanation")
    : bad("letter panel did not switch: " + thirdPanel.slice(0, 40));
  const selectedCount = await page.locator('#tetragrammaton [role="tab"][aria-selected="true"]').count();
  selectedCount === 1 ? ok("exactly one letter tab selected") : bad("selected tabs: " + selectedCount);
  (await page.getByText("числовые значения букв в традиционной системе счёта · 26").isVisible())
    ? ok("gematria sum reads 26")
    : bad("gematria sum wrong");
  const chain = await page.locator("#tetragrammaton ol li").count();
  chain === 4 ? ok("reading chain has 4 steps") : bad("chain steps: " + chain);
  const wrapped = await page.locator("#tetragrammaton ol li span:nth-of-type(3)").evaluateAll((els) =>
    els.filter((e) => e.getBoundingClientRect().height > parseFloat(getComputedStyle(e).lineHeight) * 1.6).length,
  );
  wrapped === 0 ? ok("chain labels stay on one line") : bad("wrapped chain labels: " + wrapped);
  const rtl = await page.locator('#tetragrammaton [role="tablist"]').getAttribute("dir");
  rtl === "rtl" ? ok("letters laid out right-to-left") : bad("tablist dir: " + rtl);

  // copy verse writes to the clipboard
  await page.locator('#yhwh button[aria-label^="Скопировать стих"]').click();
  await page.waitForTimeout(500);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  clip.includes("Исход 3:15") && clip.includes("Господь, Бог отцов ваших")
    ? ok("copy verse puts verse + reference on clipboard")
    : bad("clipboard content: " + clip.slice(0, 60));
  (await page.getByText("Стих скопирован").isVisible()) ? ok("copy verse confirms") : bad("no copy-verse toast");

  // theological framing: ЯХВЕ is central, never called a root
  const bodyText = await page.evaluate(() => document.body.innerText);
  !/корень всех имён|корень, из которого|Из этого имени вырастает/i.test(bodyText)
    ? ok("no 'root of all names' claim")
    : bad("stale derivation wording still on page");
  bodyText.includes("центральное имя") ? ok("central-name framing present") : bad("central framing missing");

  // ── grid search: Enter opens first, Esc clears, matches highlighted ──
  await page.locator("#sozvezdie").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const field = page.locator('#sozvezdie input[type="search"]');
  await field.fill("шалом");
  await page.waitForTimeout(350);
  (await page.locator("#sozvezdie mark").count()) > 0 ? ok("search highlights matches") : bad("no highlight marks");
  await field.press("Enter");
  await page.waitForTimeout(1300);
  (await page.evaluate(() => location.hash)) === "#shalom"
    ? ok("Enter opens first search result")
    : bad("Enter did not open result");
  await page.locator("#sozvezdie").scrollIntoViewIfNeeded();
  await field.fill("мир");
  await field.press("Escape");
  await page.waitForTimeout(300);
  (await field.inputValue()) === "" ? ok("Esc clears the search field") : bad("Esc left text in field");

  await page.locator('#sozvezdie button[aria-label*="Эль Шадда"]').first().click();
  await page.waitForTimeout(1500);

  // mark as studied → toast + persistence
  await page.locator('#el-shaddai button[aria-pressed]').first().click();
  await page.waitForTimeout(500);
  (await page.getByText("Отмечено как изученное").isVisible()) ? ok("mark shows toast") : bad("no toast on mark");
  const stored = await page.evaluate(() => localStorage.getItem("gb-imena-progress-v1"));
  stored?.includes("el-shaddai") ? ok("progress persisted") : bad("progress not stored: " + stored);

  // Reader shortcuts must not steal arrows from focused controls.
  await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  await page.waitForTimeout(180);
  // keyboard: ArrowRight advances
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1400);
  const h2 = await page.evaluate(() => location.hash);
  h2 !== "#el-shaddai" ? ok("ArrowRight advances to " + h2) : bad("ArrowRight did nothing");

  // keyboard: M marks after focus returns to reading surface
  await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("gb-imena-progress-v1") || "[]").length);
  await page.keyboard.press("m");
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("gb-imena-progress-v1") || "[]").length);
  after === before + 1 ? ok("M marks current name") : bad(`M did not mark (${before}->${after})`);

  // font size control changes rendered size
  const sizeBefore = await page.locator("#el-elyon .reader-body").first().evaluate((e) => getComputedStyle(e).fontSize);
  await page.locator('[data-reader-dock] button[aria-label="Увеличить шрифт"]').click();
  await page.waitForTimeout(600);
  const sizeAfter = await page.locator("#el-elyon .reader-body").first().evaluate((e) => getComputedStyle(e).fontSize);
  parseFloat(sizeAfter) > parseFloat(sizeBefore) ? ok(`font grows ${sizeBefore}→${sizeAfter}`) : bad("font control inert");

  // wide measure must not push text under the rails
  await page.locator('[data-reader-dock] button[aria-label="Ширина колонки"]').click();
  await page.waitForTimeout(900);
  const railsWide = await page.locator("[data-rails]").evaluateAll((els) =>
    els.filter((e) => getComputedStyle(e).display !== "none").map((e) => e.getBoundingClientRect()),
  );
  const colWide = await page.locator("#el-elyon .reader-measure").boundingBox();
  const clash = railsWide.some((r) => boxesOverlap(r, colWide));
  clash ? bad("WIDE MEASURE OVERLAPS RAILS at 1440") : ok(`wide measure safe (rails shown: ${railsWide.length})`);
  await page.locator('[data-reader-dock] button[aria-label="Ширина колонки"]').click();
  await page.waitForTimeout(500);

  // motion toggle really stops CSS animation
  await page.locator('[data-reader-dock] button[aria-label="Анимации"]').click();
  await page.waitForTimeout(500);
  const anim = await page.evaluate(() => {
    const el = document.querySelector(".gold-text");
    return el ? getComputedStyle(el).animationName : "none";
  });
  anim === "none" ? ok("motion toggle disables animation") : bad("animation still running: " + anim);
  await page.locator('[data-reader-dock] button[aria-label="Анимации"]').click();
  await page.waitForTimeout(400);

  // scroll the whole article: no horizontal overflow anywhere
  const overflow = await page.evaluate(async () => {
    const bad = [];
    for (let y = 0; y < document.body.scrollHeight; y += 900) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
      if (document.documentElement.scrollWidth > window.innerWidth + 1) bad.push(y);
    }
    return bad;
  });
  overflow.length === 0 ? ok("no horizontal overflow on full scroll") : bad("h-overflow at " + overflow.join(","));

  // epilogue summary + resume persistence
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  (await page.getByText("Следующее неизученное", { exact: false }).isVisible())
    ? ok("epilogue next-unread CTA")
    : bad("epilogue CTA missing");
  await page.waitForTimeout(1600);
  const epiOpacity = await page.evaluate(() => {
    const f = document.querySelector("footer");
    const inView = [...f.querySelectorAll(":scope > div > *")].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.top < innerHeight - 40 && r.bottom > 40;
    });
    return inView.map((e) => Number(getComputedStyle(e).opacity));
  });
  epiOpacity.length > 0 && epiOpacity.every((o) => o > 0.85)
    ? ok(`epilogue content opaque (${epiOpacity.length} blocks)`)
    : bad("epilogue faded: " + JSON.stringify(epiOpacity));
  await page.screenshot({ path: join(tmpdir(), "shot-epilogue.png") });

  page.errors.length === 0 ? ok("no console/page errors (desktop)") : bad("errors: " + page.errors.slice(0, 4).join(" | "));
  await page.screenshot({ path: join(tmpdir(), "shot-desktop-article.png") });
  await ctx.close();
}

// ───────────────────────── reload → resume ─────────────────────────
{
  const { ctx, page } = await newPage(1440, 900);
  await page.goto(BASE_URL + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.setItem("gb-imena-last-v1", "shalom");
    localStorage.setItem("gb-imena-progress-v1", JSON.stringify(["yhwh", "ehyeh"]));
  });
  // document.fonts.ready covers fonts already needed by this document, but
  // later CSS/layout can enqueue more WOFF2. Finish network requests BEFORE
  // deliberately replacing the document. Genuine request errors stay reported.
  await page.evaluate(async () => { await document.fonts.ready; return document.fonts.status; });
  await page.waitForLoadState("networkidle");
  await page.reload({ waitUntil: "load" });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2600);
  const resume = page.locator('[aria-label="Продолжить чтение"]');
  (await resume.isVisible()) ? ok("resume banner appears on return") : bad("resume banner missing");
  if (await resume.isVisible()) {
    await resume.getByRole("button").first().click();
    await page.waitForTimeout(1500);
    await page.evaluate(async () => { await document.fonts.ready; return document.fonts.status; });
    await page.waitForLoadState("networkidle");
    (await page.evaluate(() => location.hash)) === "#shalom"
      ? ok("resume jumps to saved name")
      : bad("resume jump wrong");
  }
  page.errors.length === 0 ? ok("no errors (resume flow)") : bad("resume errors: " + page.errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ───────────────────────── mobile 390 & 320 ─────────────────────────
for (const [w, h] of [[390, 844], [320, 700]]) {
  const { ctx, page } = await newPage(w, h, { touch: true });
  await page.goto(BASE_URL + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2400);

  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ov <= 1 ? ok(`no h-overflow at ${w} (hero)`) : bad(`h-overflow ${ov}px at ${w} hero`);

  // Quiet mobile illustration; the accessible branch list remains the only
  // interactive navigation instead of exposing an orbit-control editor.
  await page.locator("#tsentr").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  const preview = page.locator('#tsentr [data-scene-mobile-preview]');
  const previewBounds = await preview.boundingBox();
  previewBounds && previewBounds.x >= -1 && previewBounds.x + previewBounds.width <= w + 1
    ? ok(`mobile name illustration fits @${w}`)
    : bad(`mobile illustration clipped @${w}: ` + JSON.stringify(previewBounds));
  (await preview.locator('button,input,[role="slider"]').count()) === 0
    ? ok(`no orbit settings exposed @${w}`)
    : bad(`unwanted orbit editor @${w}`);
  const libraryTarget = await page.locator('header a[aria-label="Библиотека статей"]').boundingBox();
  libraryTarget && libraryTarget.height >= 44 && libraryTarget.width >= 44 && libraryTarget.x + libraryTarget.width <= w + 1
    ? ok(`library navigation tap target >=44px @${w}`)
    : bad(`library tap target clipped/small @${w}: ` + JSON.stringify(libraryTarget));
  const rows = await page.locator("#tsentr button:visible").evaluateAll((els) =>
    els.map((e) => {
      const r = e.getBoundingClientRect();
      const clipped = [...e.querySelectorAll("span")].some((s) => s.scrollWidth > s.clientWidth + 1 && s.clientWidth > 0);
      return { x: r.x, y: r.y, width: r.width, height: r.height, clipped, txt: e.innerText.replace(/\n/g, " ").slice(0, 30) };
    }),
  );
  rows.length === 13 ? ok(`mobile branch list has 13 rows @${w}`) : bad(`branch rows @${w}: ${rows.length}`);
  const clippedRows = rows.filter((r) => r.clipped);
  clippedRows.length === 0 ? ok(`no truncated tree text @${w}`) : bad(`truncated @${w}: ` + clippedRows.map((r) => r.txt).slice(0, 3).join(" | "));
  const outside = rows.filter((r) => r.x < -1 || r.x + r.width > w + 1);
  outside.length === 0 ? ok(`tree rows inside viewport @${w}`) : bad(`tree rows outside @${w}: ${outside.length}`);
  const collisions = [];
  for (let i = 0; i < rows.length; i++)
    for (let j = i + 1; j < rows.length; j++)
      if (boxesOverlap(rows[i], rows[j])) collisions.push(`${rows[i].txt} × ${rows[j].txt}`);
  collisions.length === 0 ? ok(`tree rows clear at ${w}`) : bad(`tree row collisions @${w}: ` + collisions.slice(0, 2).join("; "));
  await page.screenshot({ path: join(tmpdir(), `shot-tree-${w}.png`) });

  // grid usable
  await page.locator("#sozvezdie").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const ov2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ov2 <= 1 ? ok(`no h-overflow at ${w} (grid)`) : bad(`h-overflow ${ov2}px at ${w} grid`);

  // enter article, dock must not cover the mobile index pill
  await page.locator('#sozvezdie button[aria-label*="ЯХВЕ"]').first().click();
  await page.waitForTimeout(1600);
  const dockB = await page.locator("[data-reader-dock]").boundingBox();
  const pill = await page.locator('button[aria-label="Открыть список имён"]').boundingBox();
  dockB && pill ? (boxesOverlap(dockB, pill) ? bad(`DOCK COVERS INDEX PILL @${w}`) : ok(`dock clear of index pill @${w}`)) : bad("dock/pill missing @" + w);
  if (dockB && dockB.x + dockB.width > w + 1) bad(`dock overflows viewport @${w}`);
  else ok(`dock fits viewport @${w}`);

  // dock recedes while the page is moving, returns when reading pauses
  await page.evaluate(() => window.scrollBy(0, 420));
  await page.waitForTimeout(160);
  const moving = await page.locator("[data-reader-dock]").getAttribute("data-idle");
  moving === "false" ? ok(`dock recedes during scroll @${w}`) : bad(`dock did not recede @${w}: ${moving}`);
  await page.waitForTimeout(1100);
  const idle = await page.locator("[data-reader-dock]").getAttribute("data-idle");
  idle === "true" ? ok(`dock returns when idle @${w}`) : bad(`dock stayed hidden @${w}: ${idle}`);

  // expand dock on phone
  await page.locator('[data-reader-dock] button[aria-expanded]').first().click();
  await page.waitForTimeout(500);
  const expanded = await page.locator("[data-reader-dock]").boundingBox();
  expanded.x >= -1 && expanded.x + expanded.width <= w + 1
    ? ok(`expanded dock fits @${w}`)
    : bad(`expanded dock overflows @${w}: x=${expanded.x} w=${expanded.width}`);
  await page.locator('[data-reader-dock] button[aria-expanded]').first().click();
  await page.waitForTimeout(300);

  // mobile index opens, scrolls, closes
  await page.locator('button[aria-label="Открыть список имён"]').click();
  await page.waitForTimeout(700);
  const dlg = page.locator('[aria-label="Указатель имен Бога"]');
  (await dlg.isVisible()) ? ok(`mobile index opens @${w}`) : bad("mobile index did not open");
  const locked = await page.evaluate(() => document.body.style.overflow);
  locked === "hidden" ? ok("body scroll locked in modal") : bad("body not locked: " + locked);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const unlocked = await page.evaluate(() => document.body.style.overflow);
  unlocked !== "hidden" ? ok("body scroll restored after Esc") : bad("body still locked after Esc");

  const ov3 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ov3 <= 1 ? ok(`no h-overflow at ${w} (article)`) : bad(`h-overflow ${ov3}px at ${w} article`);

  page.errors.length === 0 ? ok(`no console/page errors @${w}`) : bad(`errors @${w}: ` + page.errors.slice(0, 4).join(" | "));
  await page.screenshot({ path: join(tmpdir(), `shot-article-${w}.png`), fullPage: false });
  await ctx.close();
}

// ───────────────────────── all-studied celebration ─────────────────────────
{
  const { ctx, page } = await newPage(1440, 900);
  await page.goto(BASE_URL + "/", { waitUntil: "domcontentloaded" });
  const ids = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main section[id]")).map((s) => s.id),
  );
  await page.evaluate((all) => {
    localStorage.setItem("gb-imena-progress-v1", JSON.stringify(all.slice(0, -1)));
    localStorage.setItem("gb-imena-last-v1", all[all.length - 1]);
  }, ids);
  // Complete first-document font requests before the intentional reload.
  // Preserve reporting of all genuine network and JavaScript failures.
  await page.evaluate(async () => { await document.fonts.ready; return document.fonts.status; });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  // Avoid a stale active chapter while smooth scroll is still in progress.
  await page.evaluate((last) => document.getElementById(last).scrollIntoView({ behavior: "instant", block: "start" }), ids[ids.length - 1]);
  await page.waitForFunction((count) => document.querySelector("header button")?.textContent?.includes(`${count}/${count}`), ids.length, { timeout: 10000 });
  await page.keyboard.press("m");
  await page.waitForTimeout(900);
  (await page.getByText("Все 29 имён изучены").isVisible())
    ? ok("all-studied celebration fires")
    : bad("celebration did not fire");
  await page.screenshot({ path: join(tmpdir(), "shot-celebration.png") });
  page.errors.length === 0 ? ok("no errors (celebration)") : bad("celebration errors: " + page.errors.slice(0, 3).join(" | "));
  await ctx.close();
}

await browser.close();
server.close();

console.log(notes.join("\n"));
console.log("\n" + "=".repeat(52));
if (problems.length) {
  console.log("PROBLEMS (" + problems.length + "):\n" + problems.join("\n"));
  process.exit(1);
}
console.log("ALL " + notes.length + " CHECKS PASSED");
