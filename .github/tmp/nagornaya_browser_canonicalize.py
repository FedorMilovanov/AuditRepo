from pathlib import Path
import re

PRODUCT_SHA = 'f9d0120718569c510833dba7a3abd68ce2f6a003'
AUDIT_BASE = '850429a299a6118db85811602fdb661b81b2296f'
REFINED_RUN = '30908030497'
REFINED_ARTIFACT = '8892026949'
REFINED_DIGEST = 'ff3896b0c208b4e385552dd2b1646149b1e441de3fb495cb7d9f08d7697c0b43'
PRELIM_RUN = '30907436765'

root = Path.cwd()
confirmed = [
    ('text-blue-600', 41, '3.40', '34 / 36 visible samples'),
    ('text-rose-600', 41, '3.74', '24 / 24'),
    ('text-purple-600', 40, '3.27', '34 / 34'),
    ('text-purple-700', 12, '2.52', '24 / 24'),
    ('text-teal-700', 3, '3.21', '6 / 6'),
    ('bg-stone-200', 2, '1.05', '4 / 4 text samples + 4 light islands'),
    ('text-orange-700', 1, '3.40', '2 / 2'),
    ('text-red-600', 1, '3.64', '2 / 2'),
    ('text-rose-700', 1, '2.84', '2 / 2'),
]
removed = [
    ('border-stone-100', 167, 'remapped subtle decorative border'),
    ('text-amber-600', 45, 'browser-readable remap'),
    ('text-blue-700', 22, 'browser-readable remap'),
    ('text-emerald-700', 15, 'browser-readable remap'),
    ('text-emerald-600', 14, 'theme-static but readable'),
    ('bg-stone-100', 13, 'effective body cascade covered'),
    ('text-amber-800', 11, 'browser-readable remap'),
    ('text-amber-700', 8, 'browser-readable remap'),
    ('text-red-700', 3, 'browser-readable remap'),
    ('text-teal-600', 3, 'theme-static but readable'),
]
assert sum(x[1] for x in confirmed) == 142
assert sum(x[1] for x in removed) == 301

confirmed_table = '\n'.join(
    f'| `{token}` | {uses} | {ratio}:1 | {failures} |'
    for token, uses, ratio, failures in confirmed
)
removed_table = '\n'.join(
    f'| `{token}` | {uses} | {verdict} |'
    for token, uses, verdict in removed
)
confirmed_names = ', '.join(f'`{token}` ({uses}×)' for token, uses, _, _ in confirmed)

reverify = f'''# CURRENT HEAD REVERIFY — Nagornaya dark-theme refined browser disposition

- Date: 2026-08-04
- Product anchor: `{PRODUCT_SHA}`
- AuditRepo base: `{AUDIT_BASE}`
- Browser evidence lane: AuditRepo PR #153
- Preliminary Chromium run: `{PRELIM_RUN}`
- Refined authority run: `{REFINED_RUN}`
- Refined artifact: `{REFINED_ARTIFACT}`
- Artifact digest: `sha256:{REFINED_DIGEST}`
- Canonical owner: `NG-DARK-01`
- Product mutation: **none**
- TTS scope: **excluded**
- Production claim: **none**

## Authority and method

Exact Product `{PRODUCT_SHA}` passed the permanent nine-route native Astro contract and `strangler:build:production-like`. Chromium loaded all nine native built routes at desktop `1440×900` and mobile `390×844`, in explicit light and dark themes: **36 / 36 route-theme-viewport observations**.

The preliminary run measured all 19 source-residual tokens and reported zero meaningful browser/page/overflow errors after applying the Product repository's existing local-smoke boundary for absolute-origin CSP image noise. The refined run repeated the full matrix with a stricter semantic classifier:

- ordinary and large text use WCAG thresholds `4.5:1` and `3:1`;
- emoji-only and non-text graphics are not misclassified as ordinary text;
- a background is a light island only above luminance `0.65` over a parent below `0.35`;
- decorative borders are not called broken merely because they are intentionally subtle;
- absence of a dedicated selector is never sufficient by itself.

Refined run `{REFINED_RUN}` recorded **36 observations, 0 meaningful errors and 184 explicitly classified local CSP-noise messages**. Artifact `{REFINED_ARTIFACT}` preserves the complete machine evidence (`sha256:{REFINED_DIGEST}`).

## Canonical browser-confirmed residual

The native-dist source boundary was **19 tokens / 443 uses**. Refined Chromium confirms **9 tokens / 142 source uses** as actual dark-theme defects:

| Token | Source uses | Minimum observed dark contrast | Refined failure evidence |
|---|---:|---:|---|
{confirmed_table}

`bg-stone-200` is both a contrast failure and a confirmed light island. The other eight are text-contrast failures. This is the only accepted Product-repair boundary from this lane.

## Removed from the repair boundary

The remaining **10 tokens / 301 source uses** are browser-readable or effectively governed by the current cascade:

| Token | Source uses | Refined Chromium verdict |
|---|---:|---|
{removed_table}

The most important corrections are:

- `border-stone-100` was a false positive in the preliminary coarse classifier: refined semantics identify a theme-remapped subtle decorative border, not unreadable text or a missing structural boundary;
- `bg-stone-100` is **effective-body-cascade-covered**. Every dark fixture renders the body on the same dark surface (`rgb(14, 17, 22)` in the preliminary computed evidence), including the three native routes whose source body class still contains `bg-stone-100`;
- `text-emerald-600` and `text-teal-600` remain theme-static but pass the text threshold and are not repair obligations.

## Canonical dispositions

`NG-DARK-01` remains **OPEN / CURRENT**, narrowed to **9 browser-confirmed tokens / 142 source uses**: {confirmed_names}.

`NG-BODY-01` is a stale visual subset and remains closed as duplicate/merged into the root history: native source still contains three `bg-stone-100` body owners, but Chromium proves the effective dark body cascade is correct.

`NG-DARK-05` remains a closed duplicate: `bg-stone-100` is removed from the repair boundary, while `bg-stone-200` remains represented only by open root `NG-DARK-01`.

`NG-MOBILE-01` remains a closed aggregate duplicate: its body subset is browser-effective; independent `NG-TOC-01` and `NG-A11Y-01` owners remain unchanged.

## Evidence boundary

- exact source and native production-like build only;
- Chromium computed-style evidence at two viewports and two themes;
- no Product mutation;
- no deployed-SHA or live-production claim;
- no TTS inspection or modification;
- canonical arithmetic remains **358 = 213 closed + 145 open**, P1 **70**.
'''
reverify_path = root / 'projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-browser.md'
reverify_path.write_text(reverify, encoding='utf-8')

matrix_path = root / 'projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md'
matrix = matrix_path.read_text(encoding='utf-8')
for field, replacement in {
    'Source verification anchor': f'| Source verification anchor | `{PRODUCT_SHA}` (native production-like source + refined Chromium: `NG-DARK-01` narrowed from 19 source-residual tokens / 443 uses to **9 browser-confirmed tokens / 142 uses**; 10 tokens / 301 uses are readable/effectively governed; no Product mutation, production or TTS claim). |',
    'Last reverify': '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-browser.md` |',
}.items():
    pattern = re.compile(rf'(?m)^\| {re.escape(field)} \|.*$')
    matrix, count = pattern.subn(replacement, matrix, count=1)
    if count != 1:
        raise SystemExit(f'{field}: expected one masthead row, found {count}')

rows = {
    'NG-BODY-01': f'| NG-BODY-01 | ✅ **STALE VISUAL SUBSET + DUPLICATE / MERGED INTO `NG-DARK-01`; SOURCE+CHROMIUM VERIFIED 2026-08-04.** Exact native source `{PRODUCT_SHA}` still contains `bg-stone-100` on `/nagornaya/`, `/nagornaya/istochniki/` and `/nagornaya/nakhodki/`, but refined Chromium run `{REFINED_RUN}` proves the effective dark body cascade is correct across all nine routes, both viewports: `bg-stone-100` is classified `effective-body-cascade-covered`, with no light island or contrast failure. PR #150/#152 source-only wording is superseded by browser truth. The historical subset remains closed and creates no Product repair obligation. No Product mutation, production or TTS claim. | `{PRODUCT_SHA[:8]}` run `{REFINED_RUN}` artifact `{REFINED_ARTIFACT}` |',
    'NG-DARK-05': f'| NG-DARK-05 | ✅ **DUPLICATE / MERGED INTO `NG-DARK-01`; REFINED BROWSER BOUNDARY 2026-08-04.** Refined Chromium run `{REFINED_RUN}` removes `bg-stone-100` from the repair boundary because the effective body cascade is dark and readable. `bg-stone-200` remains a confirmed light island with minimum text contrast `1.05:1`, but has one repair owner only: open `NG-DARK-01`. This aggregate row remains closed. No Product mutation, production or TTS claim. | `{PRODUCT_SHA[:8]}` run `{REFINED_RUN}` |',
    'NG-MOBILE-01': f'| NG-MOBILE-01 | ✅ **AGGREGATE DUPLICATE / MERGED; BROWSER OWNER LINKS RECONCILED 2026-08-04.** Refined Chromium run `{REFINED_RUN}` proves the former native `bg-stone-100` body subset is effectively dark at desktop and mobile, so it is not a repair obligation. Chapter-specific TOC accent remains owned by open `NG-TOC-01`; inline hero height/adaptivity remains owned by open `NG-A11Y-01`. No independent mobile root remains in this row. No Product mutation, production or TTS claim. | `{PRODUCT_SHA[:8]}` run `{REFINED_RUN}` |',
    'NG-DARK-01': f'| NG-DARK-01 | ⚠️ **CURRENT / SOURCE+REFINED CHROMIUM NARROWED 2026-08-04:** Exact Product `{PRODUCT_SHA}` passed the nine-route native contract and production-like build. Native source yielded 19 candidate tokens / 443 uses; refined Chromium run `{REFINED_RUN}` (36/36 observations, 0 meaningful errors; artifact `{REFINED_ARTIFACT}`, `sha256:{REFINED_DIGEST}`) confirms only **9 tokens / 142 source uses** as actual dark-theme defects: {confirmed_names}. `bg-stone-200` is a light island and contrast failure; the other eight fail text contrast. Ten tokens / 301 uses are removed from repair scope, including browser-effective `bg-stone-100`, readable accent levels and the remapped subtle decorative `border-stone-100`. Future Product repair and permanent browser acceptance must be bounded to these nine tokens only. No Product mutation, production or TTS claim. | `{PRODUCT_SHA[:8]}` runs `{PRELIM_RUN}`/`{REFINED_RUN}` artifact `{REFINED_ARTIFACT}` |',
}
for finding, replacement in rows.items():
    pattern = re.compile(rf'(?m)^\| {re.escape(finding)} \|.*$')
    matrix, count = pattern.subn(replacement, matrix, count=1)
    if count != 1:
        raise SystemExit(f'{finding}: expected one row, found {count}')

session_marker = '### 2026-08-04 — Nagornaya refined Chromium dark-theme narrowing @ `f9d01207`'
if session_marker not in matrix:
    heading = '## Session log (append-only)\n'
    if matrix.count(heading) != 1:
        raise SystemExit('session log heading drift')
    session = f'''\n{session_marker}
- Refined production-like Chromium measured all nine native routes at desktop/mobile and light/dark: 36/36 observations, zero meaningful errors.
- Narrowed `NG-DARK-01` from 19 source candidates / 443 uses to 9 browser-confirmed tokens / 142 uses.
- Removed `border-stone-100`, `bg-stone-100` and eight readable accent tokens from Product repair scope; reconciled `NG-BODY-01`, `NG-DARK-05` and `NG-MOBILE-01` without changing counts.
- Exact run `{REFINED_RUN}`, artifact `{REFINED_ARTIFACT}`, digest `sha256:{REFINED_DIGEST}`. No Product mutation, production or TTS claim.
'''
    matrix = matrix.replace(heading, heading + session, 1)
matrix_path.write_text(matrix, encoding='utf-8')

handoff_path = root / 'projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md'
handoff = handoff_path.read_text(encoding='utf-8')
handoff = re.sub(r'(?m)^\*\*AuditRepo base before this handoff:\*\*.*$', f'**AuditRepo base before this handoff:** `{AUDIT_BASE}`', handoff, count=1)
handoff = re.sub(r'(?m)^\*\*Current reverify:\*\*.*$', '**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-browser.md`', handoff, count=1)
handoff = re.sub(
    r'Source movement does \*\*not\*\* change canonical AuditRepo counts by itself\..*?\n\n## Active canonical owner lanes',
    'Source movement does **not** change canonical AuditRepo counts by itself. AuditRepo PR #152 is merged and established native-dist source authority. AuditRepo PR #153 adds refined Chromium truth and narrows `NG-DARK-01` to 9 browser-confirmed tokens / 142 uses; counts remain unchanged. Neither lane mutates Product, touches TTS, or claims production.\n\n## Active canonical owner lanes',
    handoff, count=1, flags=re.S)
handoff = re.sub(
    r'(?m)^- Product `main@f9d0120718569c510833dba7a3abd68ce2f6a003` remains source authority\..*$',
    f'- Product `main@{PRODUCT_SHA}` remains source authority. Refined Chromium owns the current `NG-DARK-01` acceptance boundary: **9 tokens / 142 source uses**. `NG-BODY-01` is browser-effective/stale; `NG-INLINE-01` and `NG-SEO-01` remain open independently.',
    handoff, count=1)
handoff = re.sub(
    r'(?m)^- PR #152 \(`verify/nagornaya-dark-native-dist-authority-20260804`\).*$',
    '- PR #153 (`verify/nagornaya-dark-browser-computed-20260804`) is the active browser-disposition lane; final scope is matrix, handoff and paired reverify only. PR #152 is merged source-authority history.',
    handoff, count=1)
handoff = re.sub(
    r'1\. Merge AuditRepo PR #152.*?\n2\. Use only.*?\n3\.',
    '1. Merge AuditRepo PR #153 only after exact-head validator, matrix coverage and repository-history forensic checks pass; preserve disjoint lanes.\n2. Future Product repair must target only the refined Chromium residual: **9 tokens / 142 uses**. Do not repair `border-stone-100`, `bg-stone-100` or the eight other browser-readable tokens removed from scope.\n3.',
    handoff, count=1, flags=re.S)
if '**Canonical matrix:** **358 IDs = 213 closed + 145 open**.' not in handoff:
    raise SystemExit('handoff canonical counts drift')
handoff_path.write_text(handoff, encoding='utf-8')

for path in (matrix_path, handoff_path, reverify_path):
    if not path.exists() or not path.read_text(encoding='utf-8').strip():
        raise SystemExit(f'empty canonical output: {path}')
print('Canonicalized refined Chromium boundary: 9 tokens / 142 uses; counts unchanged.')
