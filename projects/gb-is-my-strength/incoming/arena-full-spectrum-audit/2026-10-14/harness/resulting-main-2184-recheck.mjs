import { chromium } from "playwright-core";
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const BASE = "http://127.0.0.1:8099",
  DIST = "/tmp/gbs-product/dist",
  OUT = "/tmp/caeb-visual";
mkdirSync(OUT, { recursive: true });
const rows = [];
function routes() {
  const out = [];
  function walk(d) {
    for (const n of readdirSync(d)) {
      const p = join(d, n),
        s = statSync(p);
      if (s.isDirectory()) walk(p);
      else if (n === "index.html") {
        let r = "/" + relative(DIST, d).replaceAll("\\", "/") + "/";
        if (r === "//") r = "/";
        out.push(r);
      }
    }
  }
  walk(DIST);
  return out.sort();
}
const browser = await chromium.launch({
  executablePath: "/tmp/gbchrome/chrome.sh",
  args: ["--no-sandbox"],
});
async function ctx(width = 1440, scheme = "light", forcedColors = "none") {
  return browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 900 },
    isMobile: width < 500,
    hasTouch: width < 500,
    colorScheme: scheme,
    forcedColors,
    reducedMotion: "reduce",
    locale: "ru-RU",
  });
}
async function open(c, route) {
  const p = await c.newPage();
  p.setDefaultTimeout(12000);
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(BASE + route, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(250);
  return { p, errors };
}
async function axe(p, rules) {
  await p.evaluate(AXE);
  return p.evaluate(
    async (rules) =>
      (await axe.run(document, { runOnly: { type: "rule", values: rules } })).violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.length,
        targets: v.nodes.map((n) => n.target),
      })),
    rules,
  );
}
function add(id, data) {
  rows.push({ id, ...data });
}
try {
  // All built headings: the control stays exposed, but no heading name includes its label.
  let headings = 0,
    polluted = 0,
    anchors = 0;
  for (const route of routes()) {
    const c = await ctx();
    const { p } = await open(c, route);
    const x = await p.evaluate(() => {
      const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")],
        as = [...document.querySelectorAll("h1 .heading-anchor,h2 .heading-anchor,h3 .heading-anchor,h4 .heading-anchor,h5 .heading-anchor,h6 .heading-anchor")];
      return {
        h: hs.length,
        a: as.length,
        bad: hs.filter((h) => (h.getAttribute("aria-label") || h.textContent || "").includes("Скопировать ссылку на раздел")).length,
      };
    });
    headings += x.h;
    anchors += x.a;
    polluted += x.bad;
    await c.close();
  }
  add("headings-all-built", {
    routes: routes().length,
    headings,
    anchors,
    polluted,
  });
  // Quiz surfaces: discover the runtime owner across every route, both schemes and widths.
  let quizStates = 0,
    quizViolations = 0;
  const quizRoutes = new Set();
  for (const width of [1440, 390])
    for (const scheme of ["light", "dark"])
      for (const route of routes()) {
        const c = await ctx(width, scheme);
        const { p } = await open(c, route);
        const q = await p.locator(".quiz-wrapper,#quizLaunch,[data-quiz-root]").count();
        if (q) {
          quizRoutes.add(route);
          quizStates++;
          const v = await axe(p, ["color-contrast"]);
          quizViolations += v.flatMap((x) => x.targets).filter((t) => String(t).includes("quiz")).length;
        }
        await c.close();
      }
  add("quiz-all-built", {
    routes: [...quizRoutes],
    states: quizStates,
    quizContrastViolations: quizViolations,
  });
  // Theme toggle immediate keyboard ring, including forced-colors controls.
  for (const route of ["/articles/", "/izbrannoe/"])
    for (const width of [1440, 390])
      for (const scheme of ["light", "dark"]) {
        const c = await ctx(width, scheme);
        const { p } = await open(c, route);
        let reached = false;
        for (let i = 0; i < 120; i++) {
          await p.keyboard.press("Tab");
          if (await p.evaluate(() => document.activeElement?.id === "themeToggle")) {
            reached = true;
            break;
          }
        }
        const s = await p.locator("#themeToggle").evaluate((e) => {
          const c = getComputedStyle(e);
          return {
            outline: c.outline,
            outlineWidth: c.outlineWidth,
            focusVisible: e.matches(":focus-visible"),
          };
        });
        add(`theme-${route}-${width}-${scheme}`, { reached, ...s });
        await c.close();
      }
  for (const route of ["/articles/", "/izbrannoe/"]) {
    const c = await ctx(390, "light", "active");
    const { p } = await open(c, route);
    await p.locator("#themeToggle").focus();
    const s = await p.locator("#themeToggle").evaluate((e) => {
      const c = getComputedStyle(e);
      return { outline: c.outline, outlineWidth: c.outlineWidth };
    });
    add(`theme-forced-${route}`, s);
    await c.close();
  }
  // Shared mobile chrome hidden at rest and operable after reveal.
  const mobile = ["/articles/", "/biografii/", "/hard-texts/", "/hard-texts/genesis-6/", "/journal/", "/journal/dossiers/g3/", "/karty/", "/konfessii/", "/rodosloviye/"];
  for (const route of mobile) {
    const c = await ctx(390, "dark");
    const { p } = await open(c, route);
    const before = await p.locator(".mcp-top").evaluate((e) => {
      const s = getComputedStyle(e),
        cs = [...e.querySelectorAll("a,button")];
      cs[0]?.focus();
      return {
        visibility: s.visibility,
        top: e.getBoundingClientRect().top,
        focused: e.contains(document.activeElement),
        controls: cs.length,
      };
    });
    await p.evaluate(() => scrollTo(0, 700));
    await p.waitForTimeout(500);
    const afterFirst = await p.locator(".mcp-top").evaluate((e) => ({
      visibility: getComputedStyle(e).visibility,
      top: e.getBoundingClientRect().top,
      shown: e.closest(".mobile-chrome")?.classList.contains("is-shown"),
    }));
    if (afterFirst.visibility === "hidden") {
      await p.mouse.wheel(0, 20);
      await p.waitForTimeout(500);
    }
    const after = await p.locator(".mcp-top").evaluate((e) => {
      const s = getComputedStyle(e),
        cs = [...e.querySelectorAll("a,button")];
      cs[0]?.focus();
      return {
        visibility: s.visibility,
        top: e.getBoundingClientRect().top,
        focused: e.contains(document.activeElement),
        controls: cs.length,
      };
    });
    add(`mobile-chrome-${route}`, { before, afterFirst, after });
    await c.close();
  }
  // Journal bypass target, activation and next content stop.
  for (const route of ["/journal/", "/journal/dossiers/g3/"])
    for (const width of [1440, 390]) {
      const c = await ctx(width);
      const { p } = await open(c, route);
      let reached = false;
      for (let i = 0; i < 12; i++) {
        await p.keyboard.press("Tab");
        if (await p.evaluate(() => document.activeElement?.classList.contains("skip-link"))) {
          reached = true;
          break;
        }
      }
      const href = reached ? await p.evaluate(() => document.activeElement.getAttribute("href")) : null;
      if (reached) await p.keyboard.press("Enter");
      await p.waitForTimeout(100);
      const target = await p.evaluate(() => ({
        hash: location.hash,
        main: !!document.querySelector("main#main-content"),
      }));
      await p.keyboard.press("Tab");
      const next = await p.evaluate(() => ({
        tag: document.activeElement?.tagName,
        id: document.activeElement?.id,
        main: !!document.activeElement?.closest("main"),
      }));
      add(`journal-skip-${route}-${width}`, { reached, href, target, next });
      await c.close();
    }
  // Scroll-to-top is excluded from focus when hidden and works after reveal.
  for (const route of ["/", "/articles/", "/biografii/", "/hard-texts/", "/nagornaya/seriya/", "/pastor-series/"]) {
    const c = await ctx();
    const { p } = await open(c, route);
    const b = await p.locator("#hScrollTop").evaluate((e) => {
      e.focus();
      const s = getComputedStyle(e);
      return {
        visibility: s.visibility,
        opacity: s.opacity,
        focused: document.activeElement === e,
      };
    });
    await p.evaluate(() => scrollTo(0, 800));
    await p.waitForTimeout(500);
    const a = await p.locator("#hScrollTop").evaluate((e) => {
      e.focus();
      const s = getComputedStyle(e);
      return {
        visibility: s.visibility,
        opacity: s.opacity,
        focused: document.activeElement === e,
      };
    });
    await p.locator("#hScrollTop").click();
    await p.waitForTimeout(500);
    add(`scroll-top-${route}`, {
      before: b,
      after: a,
      finalY: await p.evaluate(() => scrollY),
    });
    await c.close();
  }
  // Home search has one visible named close control and restores focus.
  for (const width of [1440, 390])
    for (const scheme of ["light", "dark"]) {
      const c = await ctx(width, scheme);
      const { p } = await open(c, "/");
      const opener = p.locator("#heroSearchBar,[data-home-search-trigger]").first();
      await opener.click();
      await p.waitForSelector(".cp-backdrop.is-open");
      const closes = p.getByRole("button", { name: "Закрыть поиск" });
      const visible = await closes.evaluateAll(
        (es) =>
          es.filter((e) => {
            const r = e.getBoundingClientRect(),
              s = getComputedStyle(e);
            return r.width && r.height && s.visibility !== "hidden" && s.display !== "none";
          }).length,
      );
      await p.keyboard.press("Escape");
      add(`home-close-${width}-${scheme}`, {
        visible,
        restored: await opener.evaluate((e) => document.activeElement === e),
      });
      await p.screenshot({ path: `${OUT}/home-${width}-${scheme}.png` });
      await c.close();
    }
  // Genesis breadcrumb and brand have no geometric overlap.
  for (const scheme of ["light", "dark"]) {
    const c = await ctx(390, scheme);
    const { p } = await open(c, "/hard-texts/genesis-6/");
    const g = await p.evaluate(() => {
      const a = document.querySelector("nav.genesis6-hub__breadcrumb")?.getBoundingClientRect(),
        b = document.querySelector(".astro-header__brand")?.getBoundingClientRect();
      const overlap = a && b ? Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) : null;
      return {
        crumb: a && { x: a.x, y: a.y, w: a.width, h: a.height },
        brand: b && { x: b.x, y: b.y, w: b.width, h: b.height },
        overlap,
        aria: document.querySelector("nav.genesis6-hub__breadcrumb")?.getAttribute("aria-label"),
      };
    });
    add(`genesis-crumb-${scheme}`, g);
    await p.screenshot({ path: `${OUT}/genesis-${scheme}.png` });
    await c.close();
  }
  // Map SVG route names and keyboard-owned controls.
  for (const route of ["/karty/avraam/", "/karty/ishod/"])
    for (const width of [1440, 390]) {
      const c = await ctx(width, "dark");
      const { p } = await open(c, route);
      await p.waitForTimeout(1000);
      const m = await p.evaluate(() => {
        const s = document.querySelector("svg[role]");
        return {
          role: s?.getAttribute("role"),
          label: s?.getAttribute("aria-label"),
          labelledby: s?.getAttribute("aria-labelledby"),
          title: s?.querySelector("title")?.textContent?.trim(),
          controls: s?.querySelectorAll('g[role="button"][tabindex="0"]').length || 0,
        };
      });
      add(`map-svg-${route}-${width}`, m);
      await c.close();
    }
  // Persistent non-colour cue: narrowed source routes plus G3 extension.
  for (const route of ["/nagornaya/chast-1/", "/nagornaya/chast-3/", "/nagornaya/chast-5/", "/journal/dossiers/g3/"])
    for (const scheme of ["light", "dark"]) {
      const c = await ctx(1440, scheme);
      const { p } = await open(c, route);
      const v = await axe(p, ["link-in-text-block"]);
      const samples = await p.evaluate(() =>
        [...document.querySelectorAll("main a")]
          .filter((a) => a.textContent.trim())
          .map((a) => {
            const s = getComputedStyle(a);
            return {
              text: a.textContent.trim().slice(0, 60),
              dec: s.textDecorationLine,
              color: s.color,
            };
          })
          .filter((x) => x.dec.includes("underline"))
          .slice(0, 8),
      );
      add(`source-links-${route}-${scheme}`, { violations: v, samples });
      await c.close();
    }
  writeFileSync("/tmp/caeb-resulting-main.jsonl", rows.map((x) => JSON.stringify(x)).join("\n") + "\n");
  console.log("DONE", rows.length);
} finally {
  await browser.close();
}
