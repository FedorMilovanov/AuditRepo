#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const matrixPath = path.join(ROOT, 'projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md');
const nextPath = path.join(ROOT, 'projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md');
const reverifyRel = 'projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-08-05_b3768b45_searchaction-closure.md';
const reverifyPath = path.join(ROOT, reverifyRel);

const productBase = 'c159526e272812371be614a2fa95e0b149fbbe20';
const productHead = 'ca045325458df820cf98f746e15bb7ab051ef826';
const productMerge = 'b3768b45de4f9b5abcc39236ee94b7cfe6c55281';
const auditBase = 'cc180c5632fa12b25c035ac5abd2bfb6097316a1';

function fail(message) {
  console.error(`SEARCH-P2-09 reconciliation failed: ${message}`);
  process.exit(1);
}

function replaceOnce(text, before, after, label) {
  const first = text.indexOf(before);
  if (first < 0) fail(`missing anchor: ${label}`);
  if (text.indexOf(before, first + before.length) >= 0) fail(`non-unique anchor: ${label}`);
  return text.slice(0, first) + after + text.slice(first + before.length);
}

function replaceRegexOnce(text, pattern, replacement, label) {
  const matches = [...text.matchAll(pattern)];
  if (matches.length !== 1) fail(`${label}: expected one match, found ${matches.length}`);
  return text.replace(pattern, replacement);
}

let matrix = fs.readFileSync(matrixPath, 'utf8');
const openRow = '| SEARCH-P2-09 | 🆕 **Search contract P2:** Home JSON-LD advertises WebSite `SearchAction` target `https://gospod-bog.ru/?q={search_term_string}`, but current runtime/source has no `?q=` handler (`js/search.js`, `HomePageChrome.astro`, `HomeSearchA11yGuard.astro` do not read `location.search`/`URLSearchParams`). SearchAction target therefore lands on ordinary home, not a search-results state. | `incoming/search-deep-audit-2026-08-04/PASS4_SEARCH_CONTRACT_A11Y.md`; `PASS4_CONTRACT_PROBE.json`; reverify `CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_search-contract-a11y.md` |';
const closedRow = `| SEARCH-P2-09 | ✅ **FIXED-CURRENT / MERGED-SOURCE+CHROMIUM+WEBKIT+CI VERIFIED 2026-08-05.** Product PR #968 / squash merge \`${productMerge}\` makes the advertised WebSite \`SearchAction\` target \`/?q={search_term_string}\` open and query the existing canonical Home command palette. The bounded adapter reads only \`q\`, collapses whitespace, trims and caps at 160 characters, no-ops for absent/blank input, then uses the existing \`gb:openSearch\` and canonical input-event contracts without duplicating ranking, Pagefind/fallback, rendering, history, navigation or modal ownership. Exact head \`${productHead}\` passed all 12 triggered workflow groups, including the permanent Chromium/WebKit desktop/mobile SearchAction witness, Runtime Interactive Audit, Visual Parity, Route Registry, Native Source, Deploy Candidate and deterministic Scripture-index read-only checks. Merged-main compare \`${productBase}...${productMerge}\` is exactly one commit and the same three Product files. No production deployment claim. | \`${productMerge.slice(0, 8)}\` PR#968; exact head \`${productHead.slice(0, 8)}\` |`;

matrix = replaceOnce(matrix, '## ✅ ЗАКРЫТО (225)', '## ✅ ЗАКРЫТО (226)', 'closed heading');
matrix = replaceOnce(
  matrix,
  '| ID | Описание | Коммит |\n|---|---|---|\n| TTS-DL-UNZIP-SYNC |',
  `| ID | Описание | Коммит |\n|---|---|---|\n${closedRow}\n| TTS-DL-UNZIP-SYNC |`,
  'closed table insertion',
);
matrix = replaceOnce(matrix, '## 🟡 P2 — ОТКРЫТО (30)', '## 🟡 P2 — ОТКРЫТО (29)', 'P2 heading');
matrix = replaceOnce(matrix, `${openRow}\n`, '', 'open SEARCH-P2-09 row');
matrix = replaceOnce(
  matrix,
  '## Статистика (обновлено 2026-08-05: source/deploy anchor `38b25703`; exact production run `30960174778`; 371 canonical = 225 closed + 146 open)',
  '## Статистика (обновлено 2026-08-05: source anchor `b3768b45`; production anchor `38b25703`; exact production run `30960174778`; 371 canonical = 226 closed + 145 open)',
  'statistics heading',
);
matrix = replaceOnce(matrix, '| Закрыто (fixed) | 225 |', '| Закрыто (fixed) | 226 |', 'fixed summary');
matrix = replaceOnce(matrix, '| P2 открыто | 30 |', '| P2 открыто | 29 |', 'P2 summary');
matrix = replaceOnce(matrix, '| **Всего открыто (матрица)** | **146** |', '| **Всего открыто (матрица)** | **145** |', 'open summary');
matrix = replaceRegexOnce(
  matrix,
  /^\| Source verification anchor \|.*$/gm,
  `| Source verification anchor | \`${productMerge}\` (current merged Product source for \`SEARCH-P2-09\`; exact PR head \`${productHead}\` passed 12/12 workflow groups; production authority remains \`38b257030afb7cfa8a7b1128f8c86539fd36dec0\`). |`,
  'source verification anchor',
);
matrix = replaceRegexOnce(
  matrix,
  /^\| Last reverify \|.*$/gm,
  `| Last reverify | \`reverify/CURRENT_HEAD_REVERIFY_2026-08-05_b3768b45_searchaction-closure.md\` (Product PR #968, exact head \`${productHead.slice(0, 8)}\`, squash merge \`${productMerge.slice(0, 8)}\`; merged source and exact-head Chromium/WebKit/CI closure, no new production claim). |`,
  'last reverify anchor',
);

const sessionEntry = `### 2026-08-05 — Home SearchAction P2 closure @ merged Product \`${productMerge.slice(0, 8)}\`\n\n- Closed \`SEARCH-P2-09\` from Product PR #968 / squash merge \`${productMerge}\`.\n- Exact tested head \`${productHead}\` passed all 12 triggered workflow groups; the permanent Home SearchAction contract passed Chromium and WebKit on desktop and mobile, including query normalization, one canonical dialog, result presence without rank coupling, input focus, truthful trigger/dialog ARIA, empty/unrelated query no-op behavior, URL retention, geometry, no page/console errors and read-only validation.\n- Merged-main compare from \`${productBase}\` to \`${productMerge}\` is exactly one commit and three files: \`.github/workflows/home-search-action-contract.yml\`, \`scripts/home-search-action-browser-contract.mjs\`, and \`src/pages/index.astro\`.\n- No search ranking, Pagefind, manifest, Scripture corpus, CSS, cache, service-worker, generated HTML, production deployment or TTS/Vosk claim.\n- Canonical arithmetic: total remains **371**; closed \`225 → 226\`, open \`146 → 145\`, P2 \`30 → 29\`.\n`;
matrix = replaceOnce(matrix, '## Session log\n', `## Session log\n\n${sessionEntry}\n`, 'session log heading');

if (matrix.includes(openRow)) fail('open row survived transformation');
if (!matrix.includes(closedRow)) fail('closed row missing after transformation');
fs.writeFileSync(matrixPath, matrix);

let next = fs.readFileSync(nextPath, 'utf8');
next = replaceOnce(
  next,
  '- AuditRepo base incorporated before this transaction: `75f6aa9a11fa46c02bfe03272f52dec5f5eead15`.',
  `- AuditRepo base incorporated before this transaction: \`${auditBase}\`.`,
  'NEXT AuditRepo base',
);
next = replaceOnce(
  next,
  '- Product source and production anchor: `38b257030afb7cfa8a7b1128f8c86539fd36dec0`.',
  `- Product current source anchor: \`${productMerge}\` (PR #968 merged; no new production deployment claim).\n- Product production anchor remains: \`38b257030afb7cfa8a7b1128f8c86539fd36dec0\`.`,
  'NEXT Product authority',
);
next = replaceOnce(
  next,
  '- Canonical reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-08-05_38b25703_tts-production-closure.md`.',
  '- Canonical reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-08-05_b3768b45_searchaction-closure.md` (production authority remains documented in the prior TTS closure reverify).',
  'NEXT reverify',
);
next = replaceOnce(next, '- **371 total = 225 closed + 146 open**.', '- **371 total = 226 closed + 145 open**.', 'NEXT total');
next = replaceOnce(
  next,
  '- Open severity counts: P0 `0`, P1 `70`, P2 `30`, P3 `39`, refactoring `4`, AuditRepo `3`.',
  '- Open severity counts: P0 `0`, P1 `70`, P2 `29`, P3 `39`, refactoring `4`, AuditRepo `3`.',
  'NEXT severity',
);
next = replaceOnce(
  next,
  '- `SEARCH-P2-08` remains closed from Product PR #901; `SEARCH-P2-07` remains open pending authoritative/licensed corpus plus rights/provenance.',
  '- `SEARCH-P2-08` remains closed from Product PR #901; `SEARCH-P2-09` is closed from Product PR #968; `SEARCH-P2-07` remains open pending authoritative/licensed corpus plus rights/provenance.',
  'NEXT search closures',
);
next = replaceOnce(
  next,
  '1. `SEARCH-P2-09`: implement the advertised `/?q={search_term_string}` SearchAction target as a real search-open/query state.\n2. `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`: complete AT/modal/touch contracts with browser evidence.\n3. `SEARCH-P1-01`: extend the unified command palette to remaining searchable app/tool routes.\n4. `SEARCH-P2-07`: proceed only with authoritative/licensed corpus and rights/provenance evidence.\n5. Search P3 polish rows.',
  '1. `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`: complete AT/modal/touch contracts with browser evidence.\n2. `SEARCH-P1-01`: extend the unified command palette to remaining searchable app/tool routes.\n3. `SEARCH-P2-07`: proceed only with authoritative/licensed corpus and rights/provenance evidence.\n4. Search P3 polish rows.',
  'NEXT lane list',
);
fs.writeFileSync(nextPath, next);

if (fs.existsSync(reverifyPath)) fail(`reverify already exists: ${reverifyRel}`);
const reverify = `# Current-Head Reverify — Home SearchAction Closure\n\n- Project: \`gb-is-my-strength\`\n- Date: 2026-08-05\n- AuditRepo base incorporated: \`${auditBase}\`\n- Product PR: #968\n- Product exact tested head: \`${productHead}\`\n- Product squash merge/current source: \`${productMerge}\`\n- Product merge parent: \`${productBase}\`\n- Production authority retained: \`38b257030afb7cfa8a7b1128f8c86539fd36dec0\` / Pages run \`30960174778\` (not changed or re-claimed here)\n\n## Question\n\nDoes the advertised WebSite \`SearchAction\` target \`/?q={search_term_string}\` now enter a real, canonical search state on current merged Product source?\n\n## Finding\n\n### \`SEARCH-P2-09\`\n\n**Result: FIXED-CURRENT / MERGED-SOURCE + CHROMIUM/WEBKIT + CI VERIFIED.**\n\nProduct PR #968 adds a bounded adapter in the existing Home route owner. It reads only \`q\`, collapses repeated whitespace, trims and caps the value at 160 characters, no-ops for absent or blank input, opens search through the existing \`gb:openSearch\` event and enters the query through the existing canonical input event. It does not create a second search implementation and does not own ranking, Pagefind/fallback, rendering, history, navigation or modal behavior.\n\n## Exact Product tree\n\nMerged-main compare \`${productBase}...${productMerge}\` is exactly one commit with three files:\n\n1. \`.github/workflows/home-search-action-contract.yml\`;\n2. \`scripts/home-search-action-browser-contract.mjs\`;\n3. \`src/pages/index.astro\`.\n\nNo \`js/search.js\`, ranking, search-manifest, Scripture corpus, CSS, cache-revision, service-worker or generated-HTML mutation is included.\n\n## Exact-head workflow evidence\n\nAll 12 pull-request workflow groups completed successfully on \`${productHead}\`:\n\n- Home SearchAction Contract — run \`30988019819\`;\n- Runtime Interactive Audit — \`30988019839\`;\n- Visual Parity Guard — \`30988019825\`;\n- Route Registry Validators — \`30988019865\`;\n- Native Source Contract — \`30988019822\`;\n- Deploy Candidate Contract — \`30988019895\`;\n- Shared Files Guard — \`30988019850\`;\n- Metadata & IndexNow Readiness — \`30988019823\`;\n- Search Manifest Policy — \`30988019841\`;\n- Scripture Occurrence Index Contract — \`30988019835\`;\n- Glossary Contract — \`30988019874\`;\n- Node Toolchain Contract — \`30988019851\`.\n\nThe permanent browser contract passed Chromium and WebKit on desktop and mobile. It verified repeated-space Cyrillic query normalization, exactly one canonical dialog, matching-result presence without backend rank coupling, input focus, truthful trigger/dialog ARIA, retained URL query, blank/unrelated query no-op behavior, horizontal geometry, no page/console errors and a clean read-only tree. The deterministic Scripture source index remained unchanged.\n\n## Boundary\n\nThis closure is current merged-source and exact-head CI authority. It does **not** claim a new Pages deployment or change the retained production authority. \`SEARCH-P2-07\`, \`SEARCH-P2-10\`, \`SEARCH-P2-11\`, \`SEARCH-P2-12\`, \`SEARCH-P1-01\` and search P3 polish remain independent.\n\n## Canonical action\n\nMove exactly \`SEARCH-P2-09\` from P2 open to closed. Arithmetic becomes **371 = 226 closed + 145 open**, P2 **29**.\n`;
fs.writeFileSync(reverifyPath, reverify);

console.log('SEARCH-P2-09 reconciliation prepared: matrix 226/145, P2 29, NEXT updated, paired reverify created.');
