'use strict';

const fs = require('fs');
const { chromium } = require('playwright');

const BASE = process.env.AUDIT_BASE || 'http://127.0.0.1:8090';
const OUTPUT = process.env.BROWSER_RESULT || '_browser-refined.json';
const ROUTES = [
  '/nagornaya/', '/nagornaya/chast-1/', '/nagornaya/chast-2/',
  '/nagornaya/chast-3/', '/nagornaya/chast-4/', '/nagornaya/chast-5/',
  '/nagornaya/seriya/', '/nagornaya/istochniki/', '/nagornaya/nakhodki/',
];
const SOURCE_USES = {
  'border-stone-100': 167,
  'text-amber-600': 45,
  'text-blue-600': 41,
  'text-rose-600': 41,
  'text-purple-600': 40,
  'text-blue-700': 22,
  'text-emerald-700': 15,
  'text-emerald-600': 14,
  'bg-stone-100': 13,
  'text-purple-700': 12,
  'text-amber-800': 11,
  'text-amber-700': 8,
  'text-red-700': 3,
  'text-teal-600': 3,
  'text-teal-700': 3,
  'bg-stone-200': 2,
  'text-orange-700': 1,
  'text-red-600': 1,
  'text-rose-700': 1,
};
const TOKENS = Object.keys(SOURCE_USES);
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};
const THEMES = ['light', 'dark'];

function isExpectedLocalCspNoise(text) {
  return BASE.startsWith('http://127.0.0.1:') &&
    text.includes("Loading the image 'https://gospod-bog.ru/") &&
    text.includes('violates the following Content Security Policy directive');
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const observations = [];
  const meaningfulErrors = [];
  const expectedLocalNoise = [];

  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    for (const theme of THEMES) {
      for (const route of ROUTES) {
        const context = await browser.newContext({ viewport, colorScheme: theme });
        await context.addInitScript((wantedTheme) => {
          try { localStorage.setItem('theme', wantedTheme); } catch {}
        }, theme);
        const page = await context.newPage();
        const pageErrors = [];
        const localNoise = [];
        page.on('pageerror', (error) => {
          pageErrors.push(String(error && (error.stack || error.message) || error));
        });
        page.on('console', (message) => {
          if (message.type() !== 'error') return;
          const text = message.text();
          if (isExpectedLocalCspNoise(text)) localNoise.push(text);
          else pageErrors.push(`console: ${text}`);
        });

        try {
          await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
          await page.evaluate((wantedTheme) => {
            try { localStorage.setItem('theme', wantedTheme); } catch {}
            const root = document.documentElement;
            root.classList.toggle('dark', wantedTheme === 'dark');
            root.dataset.theme = wantedTheme;
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
                const bg = parseColor(getComputedStyle(node).backgroundColor);
                if (bg.a > 0.001) layers.push(bg);
                node = node.parentElement;
              }
              for (let i = layers.length - 1; i >= 0; i -= 1) accumulated = composite(layers[i], accumulated);
              return accumulated;
            }
            function meaningfulText(el) {
              return (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160);
            }
            function emojiOnly(text) {
              if (!text) return false;
              return /^(?:[\p{Extended_Pictographic}\uFE0F\u200D\s])+$/u.test(text);
            }
            function textThreshold(cs) {
              const size = Number.parseFloat(cs.fontSize) || 16;
              const weight = Number.parseInt(cs.fontWeight, 10) || 400;
              return size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
            }
            function borderColor(cs) {
              const values = [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor].map(parseColor);
              return values.find((value) => value.a > 0.01) || values[0];
            }

            const bodyStyle = getComputedStyle(document.body);
            const bodyBg = ancestorBackground(document.body);
            const body = {
              classes: [...document.body.classList],
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
                const parentBg = ancestorBackground(el.parentElement || document.body);
                const selfBg = parseColor(cs.backgroundColor);
                const effectiveBg = selfBg.a > 0.001 ? composite(selfBg, parentBg) : parentBg;
                const color = parseColor(cs.color);
                const text = meaningfulText(el);
                const isEmojiOnly = emojiOnly(text);
                const hasGraphic = Boolean(el.querySelector('svg, img, canvas')) || (!text && el.children.length > 0);
                const isTextual = Boolean(text) && !isEmojiOnly;
                const threshold = isTextual ? textThreshold(cs) : null;
                const textContrast = contrast(color, effectiveBg);
                const graphicContrast = hasGraphic ? contrast(color, effectiveBg) : null;
                const border = borderColor(cs);
                const borderContrast = contrast(border, parentBg);
                const property = type === 'text' ? cs.color : type === 'bg' ? cs.backgroundColor : border.raw;
                samples.push({
                  visible: visible(el),
                  tag: el.tagName.toLowerCase(),
                  id: el.id || '',
                  classes: [...el.classList].slice(0, 16),
                  text,
                  emojiOnly: isEmojiOnly,
                  hasGraphic,
                  isTextual,
                  property,
                  color: cs.color,
                  background: cs.backgroundColor,
                  effectiveBackgroundRgb: [Math.round(effectiveBg.r), Math.round(effectiveBg.g), Math.round(effectiveBg.b)],
                  parentBackgroundRgb: [Math.round(parentBg.r), Math.round(parentBg.g), Math.round(parentBg.b)],
                  textContrast,
                  textThreshold: threshold,
                  textPass: !isTextual || textContrast + 1e-6 >= threshold,
                  graphicContrast,
                  graphicPass: !hasGraphic || graphicContrast + 1e-6 >= 3,
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
              darkApplied: document.documentElement.classList.contains('dark'),
              expectedDark: expectedTheme === 'dark',
              body,
              scrollOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
              tokenData,
            };
          }, { tokens: TOKENS, expectedTheme: theme });

          if (result.darkApplied !== result.expectedDark) pageErrors.push('theme class mismatch');
          if (result.scrollOverflow > 1) pageErrors.push(`horizontal overflow ${result.scrollOverflow}px`);
          observations.push({ viewport: viewportName, theme, route, ...result });
        } catch (error) {
          pageErrors.push(String(error && (error.stack || error.message) || error));
        } finally {
          for (const error of pageErrors) meaningfulErrors.push(`${viewportName} ${theme} ${route}: ${error}`);
          for (const noise of localNoise) expectedLocalNoise.push(`${viewportName} ${theme} ${route}: ${noise}`);
          await context.close();
        }
      }
    }
  }
  await browser.close();

  const classification = {};
  for (const token of TOKENS) {
    const darkSamples = observations.flatMap((observation) => observation.theme === 'dark'
      ? observation.tokenData[token].samples.filter((sample) => sample.visible) : []);
    const lightSamples = observations.flatMap((observation) => observation.theme === 'light'
      ? observation.tokenData[token].samples.filter((sample) => sample.visible) : []);
    const darkProperties = [...new Set(darkSamples.map((sample) => sample.property))].sort();
    const lightProperties = [...new Set(lightSamples.map((sample) => sample.property))].sort();
    const changed = JSON.stringify(darkProperties) !== JSON.stringify(lightProperties);
    const textual = darkSamples.filter((sample) => sample.isTextual);
    const graphics = darkSamples.filter((sample) => sample.hasGraphic && !sample.isTextual);
    const textFailures = textual.filter((sample) => !sample.textPass);
    const graphicFailures = graphics.filter((sample) => !sample.graphicPass);
    const lightIslands = darkSamples.filter((sample) => sample.lightIsland);
    const bodyDark = darkSamples.filter((sample) => sample.body);
    const bodyLight = lightSamples.filter((sample) => sample.body);
    const bodyEffectivelyDark = bodyDark.length > 0 && bodyDark.every((sample) => sample.backgroundLuminance < 0.35);
    const bodyEffectivelyLight = bodyLight.length > 0 && bodyLight.every((sample) => sample.backgroundLuminance > 0.55);
    const min = (items, key) => items.length ? Math.min(...items.map((item) => item[key])) : null;

    let verdict = 'browser-readable-remapped';
    if (!darkSamples.length) verdict = 'not-visible-in-dark-fixtures';
    else if (lightIslands.length) verdict = 'confirmed-light-island';
    else if (textFailures.length) verdict = 'confirmed-text-contrast-failure';
    else if (graphicFailures.length) verdict = 'confirmed-graphic-contrast-failure';
    else if (token === 'bg-stone-100' && bodyEffectivelyDark && bodyEffectivelyLight) verdict = 'effective-body-cascade-covered';
    else if (token.startsWith('border-') && changed) verdict = 'remapped-subtle-decorative-border';
    else if (!changed) verdict = 'theme-static-but-readable';

    classification[token] = {
      sourceUses: SOURCE_USES[token],
      verdict,
      darkVisible: darkSamples.length,
      darkTextualSamples: textual.length,
      darkTextFailures: textFailures.length,
      darkGraphicSamples: graphics.length,
      darkGraphicFailures: graphicFailures.length,
      darkLightIslands: lightIslands.length,
      darkMinTextContrast: min(textual, 'textContrast'),
      darkMinGraphicContrast: min(graphics, 'graphicContrast'),
      darkMinBorderContrast: token.startsWith('border-') ? min(darkSamples, 'borderContrast') : null,
      propertyChangesAcrossTheme: changed,
      lightProperties,
      darkProperties,
      bodyEffectivelyDark,
      bodyEffectivelyLight,
      failureSamples: [...textFailures, ...graphicFailures, ...lightIslands].slice(0, 20),
    };
  }

  const confirmedTokens = TOKENS.filter((token) => classification[token].verdict.startsWith('confirmed-'));
  const confirmedSourceUses = confirmedTokens.reduce((sum, token) => sum + SOURCE_USES[token], 0);
  const output = {
    productSha: process.env.PRODUCT_SHA || null,
    base: BASE,
    routes: ROUTES,
    viewports: VIEWPORTS,
    themes: THEMES,
    sourceUses: SOURCE_USES,
    sourceResidual: { tokens: TOKENS.length, uses: Object.values(SOURCE_USES).reduce((a, b) => a + b, 0) },
    browserConfirmedResidual: { tokens: confirmedTokens.length, uses: confirmedSourceUses, tokenNames: confirmedTokens },
    meaningfulErrors,
    expectedLocalNoiseCount: expectedLocalNoise.length,
    expectedLocalNoise: expectedLocalNoise.slice(0, 20),
    classification,
    observationCount: observations.length,
    observations,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(JSON.stringify({
    observationCount: output.observationCount,
    meaningfulErrors: meaningfulErrors.length,
    expectedLocalNoiseCount: output.expectedLocalNoiseCount,
    sourceResidual: output.sourceResidual,
    browserConfirmedResidual: output.browserConfirmedResidual,
    verdicts: Object.fromEntries(TOKENS.map((token) => [token, classification[token].verdict])),
  }, null, 2));
  if (meaningfulErrors.length || output.observationCount !== 36) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
