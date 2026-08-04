'use strict';

const fs = require('fs');
const { chromium } = require('playwright');

const BASE = process.env.AUDIT_BASE || 'http://127.0.0.1:8090';
const OUTPUT = process.env.BROWSER_RESULT || '_browser-result.json';
const ROUTES = [
  '/nagornaya/',
  '/nagornaya/chast-1/',
  '/nagornaya/chast-2/',
  '/nagornaya/chast-3/',
  '/nagornaya/chast-4/',
  '/nagornaya/chast-5/',
  '/nagornaya/seriya/',
  '/nagornaya/istochniki/',
  '/nagornaya/nakhodki/',
];
const TOKENS = [
  'border-stone-100',
  'text-amber-600',
  'text-blue-600',
  'text-rose-600',
  'text-purple-600',
  'text-blue-700',
  'text-emerald-700',
  'text-emerald-600',
  'bg-stone-100',
  'text-purple-700',
  'text-amber-800',
  'text-amber-700',
  'text-red-700',
  'text-teal-600',
  'text-teal-700',
  'bg-stone-200',
  'text-orange-700',
  'text-red-600',
  'text-rose-700',
];
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};
const THEMES = ['light', 'dark'];

function emptyAggregate(token) {
  return {
    token,
    type: token.split('-')[0],
    visible: 0,
    total: 0,
    textFailures: 0,
    minTextContrast: null,
    minBorderContrast: null,
    lightIslandCount: 0,
    bodySamples: [],
    propertyValues: [],
    samples: [],
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const observations = [];
  const errors = [];
  const aggregate = Object.fromEntries(TOKENS.map((token) => [token, emptyAggregate(token)]));

  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    for (const theme of THEMES) {
      for (const route of ROUTES) {
        const context = await browser.newContext({ viewport, colorScheme: theme });
        await context.addInitScript((wantedTheme) => {
          try { localStorage.setItem('theme', wantedTheme); } catch {}
          document.documentElement.classList.toggle('dark', wantedTheme === 'dark');
          document.documentElement.dataset.theme = wantedTheme;
        }, theme);
        const page = await context.newPage();
        const pageErrors = [];
        page.on('pageerror', (error) => pageErrors.push(String(error && error.message || error)));
        page.on('console', (message) => {
          if (message.type() === 'error') pageErrors.push(`console: ${message.text()}`);
        });

        try {
          await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
          await page.evaluate((wantedTheme) => {
            try { localStorage.setItem('theme', wantedTheme); } catch {}
            document.documentElement.classList.toggle('dark', wantedTheme === 'dark');
            document.documentElement.dataset.theme = wantedTheme;
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: wantedTheme } }));
          }, theme);
          await page.waitForTimeout(300);

          const result = await page.evaluate(({ tokens, expectedTheme }) => {
            function parseColor(value) {
              if (!value || value === 'transparent') return { r: 0, g: 0, b: 0, a: 0, raw: value || '' };
              const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
              if (!match) return { r: 0, g: 0, b: 0, a: 0, raw: value, unsupported: true };
              return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: match[4] == null ? 1 : Number(match[4]), raw: value };
            }
            function composite(fg, bg) {
              const a = fg.a + bg.a * (1 - fg.a);
              if (!a) return { r: 255, g: 255, b: 255, a: 1, raw: 'composited-white' };
              return {
                r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
                g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
                b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
                a,
                raw: `composite(${fg.raw},${bg.raw})`,
              };
            }
            function channel(v) {
              const x = v / 255;
              return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
            }
            function luminance(c) {
              return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
            }
            function contrast(a, b) {
              const l1 = luminance(a);
              const l2 = luminance(b);
              return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            }
            function visible(el) {
              const cs = getComputedStyle(el);
              const rect = el.getBoundingClientRect();
              return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.01 && rect.width > 0 && rect.height > 0;
            }
            function ancestorBackground(start) {
              let node = start;
              let accumulated = { r: 255, g: 255, b: 255, a: 1, raw: 'white-fallback' };
              const layers = [];
              while (node && node.nodeType === 1) {
                const cs = getComputedStyle(node);
                const bg = parseColor(cs.backgroundColor);
                if (bg.a > 0.001) layers.push(bg);
                node = node.parentElement;
              }
              for (let i = layers.length - 1; i >= 0; i -= 1) accumulated = composite(layers[i], accumulated);
              return accumulated;
            }
            function meaningfulText(el) {
              return (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
            }
            function largeTextThreshold(cs) {
              const size = Number.parseFloat(cs.fontSize) || 16;
              const weight = Number.parseInt(cs.fontWeight, 10) || 400;
              return size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
            }
            function borderColor(cs) {
              const values = [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor].map(parseColor);
              return values.find((value) => value.a > 0.01) || values[0];
            }

            const darkApplied = document.documentElement.classList.contains('dark');
            const expectedDark = expectedTheme === 'dark';
            const bodyStyle = getComputedStyle(document.body);
            const bodyBg = ancestorBackground(document.body);
            const bodyInfo = {
              classes: [...document.body.classList],
              background: bodyBg.raw,
              backgroundRgb: [Math.round(bodyBg.r), Math.round(bodyBg.g), Math.round(bodyBg.b)],
              luminance: luminance(bodyBg),
              color: bodyStyle.color,
            };
            const tokenData = {};
            for (const token of tokens) {
              const type = token.split('-')[0];
              const nodes = [...document.getElementsByClassName(token)];
              const samples = [];
              for (const el of nodes) {
                const cs = getComputedStyle(el);
                const isVisible = visible(el);
                const parentBg = ancestorBackground(el.parentElement || document.body);
                const selfBgRaw = parseColor(cs.backgroundColor);
                const effectiveBg = selfBgRaw.a > 0.001 ? composite(selfBgRaw, parentBg) : parentBg;
                const textColor = parseColor(cs.color);
                const textContrast = contrast(textColor, effectiveBg);
                const threshold = largeTextThreshold(cs);
                const border = borderColor(cs);
                const borderContrast = contrast(border, parentBg);
                const property = type === 'text' ? cs.color : type === 'bg' ? cs.backgroundColor : border.raw;
                samples.push({
                  visible: isVisible,
                  tag: el.tagName.toLowerCase(),
                  id: el.id || '',
                  classes: [...el.classList].slice(0, 12),
                  text: meaningfulText(el),
                  property,
                  color: cs.color,
                  background: cs.backgroundColor,
                  effectiveBackground: effectiveBg.raw,
                  effectiveBackgroundRgb: [Math.round(effectiveBg.r), Math.round(effectiveBg.g), Math.round(effectiveBg.b)],
                  parentBackgroundRgb: [Math.round(parentBg.r), Math.round(parentBg.g), Math.round(parentBg.b)],
                  textContrast,
                  textThreshold: threshold,
                  textPass: textContrast + 1e-6 >= threshold,
                  borderContrast,
                  backgroundLuminance: luminance(effectiveBg),
                  parentBackgroundLuminance: luminance(parentBg),
                  lightIsland: type === 'bg' && luminance(effectiveBg) > 0.65 && luminance(parentBg) < 0.35,
                  body: el === document.body,
                });
              }
              tokenData[token] = { total: nodes.length, samples };
            }
            return {
              darkApplied,
              expectedDark,
              body: bodyInfo,
              scrollOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
              tokenData,
            };
          }, { tokens: TOKENS, expectedTheme: theme });

          if (result.darkApplied !== result.expectedDark) {
            errors.push(`${viewportName} ${theme} ${route}: theme class mismatch`);
          }
          if (result.scrollOverflow > 1) {
            errors.push(`${viewportName} ${theme} ${route}: horizontal overflow ${result.scrollOverflow}px`);
          }
          for (const pageError of pageErrors) errors.push(`${viewportName} ${theme} ${route}: ${pageError}`);

          observations.push({ viewport: viewportName, theme, route, ...result });
          for (const token of TOKENS) {
            const bucket = aggregate[token];
            const data = result.tokenData[token];
            bucket.total += data.total;
            for (const sample of data.samples) {
              if (!sample.visible) continue;
              bucket.visible += 1;
              if (!bucket.propertyValues.includes(sample.property)) bucket.propertyValues.push(sample.property);
              if (token.startsWith('text-') || token.startsWith('bg-')) {
                bucket.minTextContrast = bucket.minTextContrast == null ? sample.textContrast : Math.min(bucket.minTextContrast, sample.textContrast);
                if (!sample.textPass) bucket.textFailures += 1;
              }
              if (token.startsWith('border-')) {
                bucket.minBorderContrast = bucket.minBorderContrast == null ? sample.borderContrast : Math.min(bucket.minBorderContrast, sample.borderContrast);
              }
              if (sample.lightIsland) bucket.lightIslandCount += 1;
              if (sample.body) bucket.bodySamples.push({ viewport: viewportName, theme, route, property: sample.property, backgroundLuminance: sample.backgroundLuminance });
              if (bucket.samples.length < 12 && (theme === 'dark' || sample.body)) {
                bucket.samples.push({ viewport: viewportName, theme, route, ...sample });
              }
            }
          }
        } catch (error) {
          errors.push(`${viewportName} ${theme} ${route}: ${String(error && error.message || error)}`);
        } finally {
          await context.close();
        }
      }
    }
  }

  await browser.close();

  const classification = {};
  for (const token of TOKENS) {
    const bucket = aggregate[token];
    const darkSamples = observations.flatMap((observation) => {
      if (observation.theme !== 'dark') return [];
      return observation.tokenData[token].samples.filter((sample) => sample.visible);
    });
    const lightSamples = observations.flatMap((observation) => {
      if (observation.theme !== 'light') return [];
      return observation.tokenData[token].samples.filter((sample) => sample.visible);
    });
    const darkProperties = [...new Set(darkSamples.map((sample) => sample.property))].sort();
    const lightProperties = [...new Set(lightSamples.map((sample) => sample.property))].sort();
    const changed = JSON.stringify(darkProperties) !== JSON.stringify(lightProperties);
    const darkTextFailures = darkSamples.filter((sample) => (token.startsWith('text-') || token.startsWith('bg-')) && !sample.textPass).length;
    const darkLightIslands = darkSamples.filter((sample) => sample.lightIsland).length;
    const darkMinBorder = darkSamples.length && token.startsWith('border-') ? Math.min(...darkSamples.map((sample) => sample.borderContrast)) : null;
    const darkMinText = darkSamples.length && (token.startsWith('text-') || token.startsWith('bg-')) ? Math.min(...darkSamples.map((sample) => sample.textContrast)) : null;
    const bodyDark = darkSamples.filter((sample) => sample.body);
    const bodyLight = lightSamples.filter((sample) => sample.body);
    const bodyEffectivelyDark = bodyDark.length > 0 && bodyDark.every((sample) => sample.backgroundLuminance < 0.35);
    const bodyEffectivelyLight = bodyLight.length > 0 && bodyLight.every((sample) => sample.backgroundLuminance > 0.55);

    let verdict = 'browser-readable';
    if (!darkSamples.length) verdict = 'not-visible-in-dark-fixtures';
    else if (darkTextFailures > 0) verdict = 'confirmed-text-contrast-failure';
    else if (darkLightIslands > 0) verdict = 'confirmed-light-island';
    else if (token.startsWith('border-') && darkMinBorder != null && darkMinBorder < 1.3) verdict = 'confirmed-near-invisible-border';
    else if (token === 'bg-stone-100' && bodyDark.length && bodyEffectivelyDark && bodyEffectivelyLight) verdict = 'effective-body-cascade-covered';
    else if (!changed) verdict = 'theme-static-but-readable';

    classification[token] = {
      verdict,
      darkVisible: darkSamples.length,
      lightVisible: lightSamples.length,
      darkTextFailures,
      darkLightIslands,
      darkMinTextContrast: darkMinText,
      darkMinBorderContrast: darkMinBorder,
      propertyChangesAcrossTheme: changed,
      lightProperties,
      darkProperties,
      bodyEffectivelyDark,
      bodyEffectivelyLight,
    };
  }

  const output = {
    productSha: process.env.PRODUCT_SHA || null,
    base: BASE,
    routes: ROUTES,
    viewports: VIEWPORTS,
    themes: THEMES,
    tokens: TOKENS,
    errors,
    aggregate,
    classification,
    observationCount: observations.length,
    observations,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(JSON.stringify({
    observationCount: output.observationCount,
    errors: errors.length,
    verdicts: Object.fromEntries(TOKENS.map((token) => [token, classification[token]])),
  }, null, 2));
  if (errors.length) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
