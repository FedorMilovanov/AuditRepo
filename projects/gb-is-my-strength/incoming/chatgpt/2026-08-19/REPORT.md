# Agent Audit Report — oracle forensics

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `ChatGPT GPT-5.6 Sol`
- Date: 2026-08-19
- Audited Product anchor: `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Local source snapshot: user-provided `gb-is-my-strength-main (13).zip`, source-equivalent to `d99bd866de090023eac39d1aa648feb63ff45d52` for the selected owners; compare to current anchor changes only `.github/workflows/notify-on-failure.yml` and `scripts/dist-css-parity-audit.js`.
- AuditRepo base: `6aae4f35a7f308d364f924bc41ea9796e99dd34f`
- Environment: local dependency-free Node/Python source/index inspection + GitHub current-source/history inspection. Local Playwright/Chromium was present but browser navigation was administratively blocked even for local targets; this is classified as environment-only and is not used as Product evidence.
- Signal class: Product + audit-harness / evidence-integrity
- Product mutation: none
- MASTER mutation: none
- Claim boundary: source/index/contract behavior at the stated Product anchor; no claim of a captured live-browser screenshot in this pass.
- Collision boundary: current Product `/app/` preview work owns `data/scripture-search-index.json`; no competing repair/regeneration is opened here. Concurrent AuditRepo matrix PRs are not touched.

---

## 1. `SCRIPTURE-OCCURRENCE-CONTEXT-ORACLE-LEAK`

### Classification

- Kind: current Product representation defect + audit-harness false-green
- Suggested system themes: `ST-AUDIT-HARNESS`, `ST-DISCOVERY-AUTHORITY`, `ST-SOURCE-GUARD-CLOSURE`
- Confidence: high
- Scope: exact Scripture occurrence search snippets, not Pagefind ranking and not Scripture corpus correctness

### Expected contract

The original S1 owner, Product PR #895 / commit `35e36febe88e0aaec61c568534832d0f5c8b0ec0`, explicitly defines the index as literal visible prose and requires masking imports, frontmatter, scripts, styles, markup tags, component props, expressions and MDX code while storing a readable context. The same history explicitly rejected an earlier import-graph inventory because props/attributes/shared modules leaked non-visible material.

### Current mechanism

`build-scripture-occurrence-index.mjs` correctly builds `masked = maskCommentsAndCode(original, extension)` and runs the Bible-reference regex over that masked representation. This prevents many non-visible references from becoming occurrences.

However, once a valid match is found, the generator switches representations:

```text
match position: masked source
context source: original source
cleanup: lexical regexes over a ± source-byte window
```

`contextAround(original, ...)` therefore slices raw Astro/MDX/HTML source. `cleanContext()` removes only complete `<...>` tags, braces/backticks and a short attribute-name subset. A source window can start/end inside a tag, include attributes not in that subset, or include Astro/JSX expression payloads. Those fragments survive as `occurrence.context`.

This is a representation-boundary error: the detector proves that the reference itself belongs to visible prose, but the presentation field is reconstructed from a different, less-safe representation.

### Current evidence

Dependency-free checks on the current-equivalent local snapshot both return success:

```text
node scripts/build-scripture-occurrence-index.mjs --check
→ Scripture occurrence index is current: 1010 references, 2429 occurrences, 75 routes.

node scripts/scripture-occurrence-index-contract.mjs
→ Scripture occurrence index contract passed: 1010 references, 2429 occurrences, 148 curated text records.
```

Yet a deterministic scan of the runtime-first unique occurrence candidates (`url#anchor`, matching the runtime dedupe boundary) finds **at least 423 / 1963 (21.5%)** with unambiguous source-syntax patterns under a deliberately strict lower-bound detector. The matched set spans **306 / 1010 reference labels** and **51 / 75 indexed routes**. These are not claimed as the complete pollution count; they are a conservative witness subset.

Representative first-page exact-result contexts include:

- `Бытие 3:15`: context starts with a partial `type="button"` source fragment and later includes role-bearing markup syntax;
- `Бытие 6`: several first-page occurrences expose `article-header--no-border`, `item.roman` and `frontmatter.h1` source/template material;
- diagram/source contexts can expose attributes such as `font-family="sans-serif"` and `fill=...`.

The runtime consumer does not reinterpret these strings as markup: `js/search.js` escapes/highlights them before rendering. Therefore this report **does not classify the finding as XSS**. The defect is that source implementation syntax is published as reader-facing search context.

### Why the durable guards false-green

`scripture-occurrence-index-contract.mjs` requires `occurrence.context` to be a non-empty string and verifies route/title/source ownership. With `--dist`, it verifies the anchor and the raw Bible-reference witness in rendered route text. It does **not** verify that `occurrence.context` itself corresponds to visible rendered prose or is free of source syntax.

`search-scripture-occurrence-runtime-browser-test.mjs` checks exact-results ordering, lazy index loading, timing, result count, status text, preview-link identity and alias reuse. It does **not** assert the semantic cleanliness/readability of the displayed exact-result snippet.

Therefore the source contract and the browser contract can both remain green while the explicit S1 `readable context` promise is violated. This is a genuine end-to-end oracle gap rather than a missing unit test for one bad string.

### Root-cause formulation

```text
visible-reference detection on masked representation
        ↓
byte offset reused against original source
        ↓
raw-source context reconstructed with regex cleanup
        ↓
contract checks existence/provenance, not semantic representation
        ↓
browser test checks navigation/performance, not snippet truth
        ↓
source syntax can ship as “readable context” while all owners are green
```

A durable repair should be evaluated at this class boundary, not by deleting individual dirty contexts. Candidate closure properties for a future owned Product lane:

1. presentation context derives from a visible-text/rendered-text projection or an equivalently safe representation, not an arbitrary raw-source slice;
2. adversarial fixtures place Bible references adjacent to split tags, uncommon attributes, Astro/JSX expressions and component props;
3. the index contract proves context semantic cleanliness / visible-text witness, not merely non-emptiness;
4. the real browser contract asserts an exact-result snippet contains expected prose and does not expose source syntax;
5. anchors, exact-result-first behavior, dedupe identity and no-invented-text rules remain preserved.

No Product repair is started by this report because an active Product lane currently owns the generated index file.

---

## 2. `SITEWIDE-BTN-TYPE-AUDIT-FALSE-COMPLETENESS`

### Classification

- Kind: AuditRepo evidence-integrity / audit-oracle defect
- Suggested system theme: `ST-AUDIT-HARNESS`
- Confidence: high
- Product-behavior implication: none newly claimed; the existing MASTER already classifies missing button types as latent hardening because current rendered instances are outside forms.

### Existing authority claim

`verification/2026-07-17-sitewide-btn-type-audit.md` says it scanned **all 543** `src/**/*.astro`, `src/**/*.tsx`, `src/**/*.jsx` files at Product `cb3681e1a85b5f8919c9dc537f812a842bbe9235` with regex:

```text
<button\b([^>]*?)(?:/>|>)
```

It declares a **complete instance list** of 20 files / 47 `<button>` elements missing `type=` and sets closure to adding `type="button"` to those 47 plus a zero-hit rerun.

### Exact-anchor contradiction

At that same historical Product anchor, two additional TSX buttons already existed and lack `type=`:

- `src/components/genealogy/SplitView.tsx` — close-comparison button;
- `src/components/genealogy/DetailPanel.tsx` — close-panel button.

Neither appears in the claimed complete 20-file / 47-instance list.

Running the audit's declared regex and declared extension scope over the supplied current-equivalent tree yields **543 files, 22 files, 49 missing-type button tags**. The two extra files are exactly `SplitView.tsx` and `DetailPanel.tsx`.

Because both omissions are independently present at `cb3681e`, this is not explained by Product movement after the historical audit. The historical exhaustive result itself was incomplete.

### What is and is not proved about cause

This pass proves false completeness. It does **not** prove whether the historical miss came from repository enumeration, pagination/retrieval, local file availability, post-processing or manual transcription. Naming one of those mechanisms without the original executor artifact would be speculation.

The systemic weakness that *is* proved is the authority/closure model: a one-off external scan was promoted to a durable exhaustive class boundary without a committed reproducible guard whose result could be rerun and mechanically compared. The MASTER therefore inherited a false `full sitewide scan completed` premise.

Future closure for this class should require a repository-owned or equivalently reproducible scanner, deterministic file inventory, machine-readable hit set/count and a zero-hit assertion at the repair anchor. A prose instance list may remain evidence, but must not be the oracle.

---

## 3. Cross-finding root synthesis

These two findings are different Product surfaces but the same forensic failure mode:

```text
measured surrogate is narrower than the claim
→ check remains green / report says complete
→ human-facing conclusion overstates what was actually proved
```

For Scripture Search, the surrogate is “context exists + raw reference appears in dist”. The claim is “readable visible-prose context”.

For button coverage, the surrogate was the recorded result set. The claim was an exhaustive 543-file class closure.

This is why the recommended next work is oracle-first. Repairing sample snippets or adding two button `type=` attributes before repairing/verifying the class oracle would improve symptoms while preserving the mechanism that produced the false confidence.

---

## 4. Currentness and collision check

Product `main` advanced during this pass. The final selected anchor is `bcb41e57d7f9c011ac597c51a240fba19152a908`. Relative to local snapshot base `d99bd866de090023eac39d1aa648feb63ff45d52`, only the failure-notifier workflow and `scripts/dist-css-parity-audit.js` changed; none of the Scripture generator/contract/runtime owners or the historical genealogy button witnesses changed in that interval.

Open Product work is treated as an ownership boundary. In particular, the `/app/` preview lane owns `data/scripture-search-index.json`, so this audit does not start a generated-index writer or Product fix. Open AuditRepo matrix/consolidation PRs are also left untouched; this report lives under a unique incoming path.

---

## 5. Browser/environment boundary

A local Playwright binding and system Chromium were discovered and invoked, but navigation was rejected by the execution environment with `ERR_BLOCKED_BY_ADMINISTRATOR`, including local targets. This is **not** a Product failure and no availability/browser-compatibility conclusion is drawn from it.

The browser-contract false-green claim above is instead source-grounded: the durable Playwright test's assertion set can be inspected directly and contains no semantic assertion over the rendered exact-result context. A later unrestricted browser witness should be additive evidence, not a prerequisite for recognizing that the current oracle cannot detect this class.

---

## 6. Negative findings / scope guards

- No XSS claim: exact-result context is escaped before HTML rendering.
- No claim that every one of 2429 stored contexts is polluted; 423/1963 is a strict lower-bound witness over runtime-first unique candidates.
- No claim that missing button `type=` currently submits a form; the existing live evidence says otherwise.
- No Product or MASTER mutation is authorized by this intake alone.
- No historical executor failure mode is invented for the 47→49 button discrepancy.

---

## 7. Proposed verifier disposition

1. Admit `SCRIPTURE-OCCURRENCE-CONTEXT-ORACLE-LEAK` for a current verification/synthesis wave as a system-level representation + guard defect unless a newer owned lane independently closes the same mechanism first.
2. Correct the `SITEWIDE-BTN-TYPE-AUDIT` evidence boundary: historical exhaustive count is invalid; re-run with a durable scanner before using it for closure. This may be absorbed into `ST-AUDIT-HARNESS` rather than becoming a Product defect row.
3. Do not open a competing Product repair while `data/scripture-search-index.json` has an active writer/owner.
4. Keep MASTER untouched until the verifier reconciles these findings with concurrent matrix work.

---

## 8. Reproduction summary

Scripture currentness and existing contract:

```bash
node scripts/build-scripture-occurrence-index.mjs --check
node scripts/scripture-occurrence-index-contract.mjs
```

Button audit reproduction uses the exact historical scope and tag regex over every `src/**/*.astro`, `src/**/*.tsx`, `src/**/*.jsx`; verify that the inventory contains 543 files and inspect the full deterministic hit set rather than trusting a copied prose count.

The important regression test for both findings is adversarial: prove the oracle turns red when its semantic contract is violated, then prove the repaired Product/class turns green.