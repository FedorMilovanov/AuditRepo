# Agent Work Report — arena-auditor — 2026-07-14

## Meta
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: arena-auditor
- Date: 2026-07-14
- Audited branch: main
- Audited SHA: `2ca2af3b91ace0a94d1537595a8d6e66281c0023` (2ca2af3)
- Current HEAD at start: `2ca2af3`
- Current HEAD at end: `2ca2af3`
- Environment: E2B sandbox, Node v22.22.3, npm ci OK
- Build mode: source-only (no dist; gates run where possible without build)
- Browser: none

---

## 1. New Findings

### Finding AR-AUDIT-16
- **Title:** Source HEAD advanced from `b8459bdf` to `2ca2af3` — 2+ commits not reflected in matrix
- **Severity:** P1
- **Route(s):** N/A (system-level)
- **Source file(s):** N/A
- **Observed on SHA:** `2ca2af3`
- **Evidence:** `git rev-parse HEAD` → `2ca2af3b91ace0a94d1537595a8d6e66281c0023`; matrix tracks `b8459bdf`
- **Confidence:** high
- **Suggested repair lane:** W0 (truth hygiene)

### Finding AR-AUDIT-17
- **Title:** `validate:all` fails with 2 errors on current source HEAD (`2ca2af3`)
- **Severity:** P2
- **Route(s):** scripts/genealogy-build/atlas-template.html, scripts/genealogy-build/interactive-template.html
- **Source file(s):** `scripts/genealogy-build/atlas-template.html`, `scripts/genealogy-build/interactive-template.html`
- **Observed on SHA:** `2ca2af3`
- **Evidence:** `npm run validate:all` → `❌ [scripts/genealogy-build/atlas-template.html] inline <script> syntax error (#1): Unexpected token ';'` (x2); 2 warnings also
- **Confidence:** high
- **Suggested repair lane:** W6 (Bible/data) or genealogy lane

### Finding AR-AUDIT-18
- **Title:** D-1 partially fixed: indexnow concurrency group changed but still separate from deploy
- **Severity:** P3 (downgrade from P2)
- **Route(s):** .github/workflows/
- **Source file(s):** `.github/workflows/deploy.yml:50`, `.github/workflows/indexnow.yml:30`
- **Observed on SHA:** `2ca2af3`
- **Evidence:**
  - deploy.yml: `concurrency: group: pages, cancel-in-progress: true`
  - indexnow.yml: `concurrency: group: metadata-indexnow-readiness-${{ github.ref }}, cancel-in-progress: true`
  - Both now use `cancel-in-progress: true` (was `false` for indexnow — FIXED)
  - But groups are still SEPARATE: `pages` vs `metadata-indexnow-readiness-*` → deploy and indexnow can still run in parallel
- **Confidence:** high (verified-source)
- **Suggested repair lane:** W1 (release transaction)

---

## 2. Confirmations of Existing Findings

### Confirm D-4
- Target finding: D-4 (magic z-index)
- My evidence: `grep -n 'z-index:' css/floating-cluster.css` → 20 z-index declarations; magic values: 2102, 9999, 3000, 2147483000, 2147483100. `--z-*` tokens exist but not used for these.
- Same bug: confirmed still open on `2ca2af3`
- Recommended status: confirmed-current (verified-source)

### Confirm D-7
- Target finding: D-7 (repo-relative link in PremiumControlAnchor.astro)
- My evidence: `grep -rn 'AuditRepo' src/components/` → `PremiumControlAnchor.astro:3:// See: AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md §1`
- Same bug: confirmed still open
- Recommended status: confirmed-current (verified-source)

### Confirm D-8
- Target finding: D-8 (deploy.yml paths not including *.md)
- My evidence: `deploy.yml` paths block has 17 entries, none include `*.md`
- Same bug: confirmed still open
- Recommended status: confirmed-current (verified-source)

### Confirm D-21
- Target finding: D-21 (glossary innerHTML vs textContent)
- My evidence: `js/glossary.js` function `o()` builds `.gtip` span → `a.innerHTML = ...` (includes `detail` with HTML). Upgrade path `l()` uses `host.querySelector(".gtip-papyrus").innerHTML=detail` — still innerHTML for detail. data/glossary.json detail fields may contain `<em>` tags.
- Same bug: confirmed still open
- Recommended status: confirmed-current (verified-source)

### Confirm GATE-MARKER-DATA-DRIFT / NF-GATE-IZ5-STALE
- Target finding: GATE-MARKER-DATA-DRIFT, NF-GATE-IZ5-STALE
- My evidence: `grep -rn 'из 5' scripts/` → 6 occurrences across `gill-context-visual-parity-audit.js`, `gill-spravochnik-visual-parity-audit.js`, `gill-v16-mobile-play-smoke.js`, `premium-controls-rollout-audit.js`
- Same bug: confirmed still open on `2ca2af3`
- Recommended status: confirmed-current (verified-source)

### Confirm NF-DEAD-ENHANCE-SHIM
- Target finding: NF-DEAD-ENHANCE-SHIM
- My evidence: `grep -n 'enhanceGillMobileBarMarkup' js/floating-cluster-controller.js` → line 1084 (function), line 1162 (call). Bail at :986 still present. CSS classes `mobile-btoc-meter`/`mobile-icon-row` built but CSS was deleted.
- Same bug: confirmed still open on `2ca2af3`
- Recommended status: confirmed-current (verified-source)

### Confirm R-001
- Target finding: R-001 (site.js monolith ~167KB)
- My evidence: `wc -c js/site.js` → 169500 bytes (169.5 KB). 54 addEventListener, 4 removeEventListener.
- Same bug: confirmed, slightly worsened (was ~167KB)
- Recommended status: confirmed-current (verified-source)

### Confirm R-002
- Target finding: R-002 (enhancements.js monolith ~48KB)
- My evidence: `wc -c js/enhancements.js` → 46141 bytes (46.1 KB)
- Same bug: confirmed
- Recommended status: confirmed-current (verified-source)

### Confirm NEW-VOSK-FETCH-NO-ABORT
- Target finding: NEW-VOSK-FETCH-NO-ABORT (from claude-auditor 07-09, not in matrix)
- My evidence: `grep -n 'AbortController\|fetch.*MODEL' js/vosk-tts-engine.js` → line 166: `return fetch(MODEL_URL).then(...)` — no AbortController, no signal, no cancellation
- Same bug: confirmed on `2ca2af3`
- Recommended status: should be added to matrix as P3 verified-source

### Confirm NEW-VOSK-DEAD-SPLITSENTENCES
- Target finding: NEW-VOSK-DEAD-SPLITSENTENCES
- My evidence: `js/vosk-tts-core.js:413` exports `splitSentences`, `js/vosk-tts-core.js:446` adds to exports. But `js/floating-cluster-controller.js:487` defines own `splitTtsChunks` (line 601 uses it). Dead export confirmed.
- Same bug: confirmed on `2ca2af3`
- Recommended status: confirmed-current (verified-source)

### Confirm TTS-DL-UNZIP-SYNC
- Target finding: TTS-DL-UNZIP-SYNC
- My evidence: `js/vosk-tts-engine.js:110`: `fflate.unzipSync(u8, {...})` — synchronous unzip of ~280MB archive on main thread
- Same bug: confirmed on `2ca2af3`
- Recommended status: confirmed-current (verified-source)

### Confirm NEW-HARDTEXTS-CSP-MISSING-HFCDN
- Target finding: NEW-HARDTEXTS-CSP-MISSING-HFCDN
- My evidence: `src/pages/hard-texts/index.astro:122` connect-src has `huggingface.co` but no `*.aws.cdn.hf.co`
- Same bug: confirmed on `2ca2af3`
- Recommended status: confirmed-current (verified-source)

### Confirm BUG-PERF-001 (with updated count)
- Target finding: BUG-PERF-001
- My evidence: 80 addEventListener / 10 removeEventListener across all js/ files (matrix says 339/25 which is per-line count of a minified file; the unminified count is 80/10)
- Same bug: confirmed, note count discrepancy is due to minification
- Recommended status: confirmed-current

---

## 3. Challenges / Disputes

### Challenge D-1 severity
- Target finding: D-1
- Reason for challenge: indexnow now uses `cancel-in-progress: true` — the most dangerous aspect (stale runs) is fixed. Remaining issue (separate groups) is lower risk.
- Current HEAD evidence: deploy.yml:50 and indexnow.yml:30 both use `cancel-in-progress: true`
- Recommended status: downgrade from P2 to P3 (partial fix on current HEAD)

---

## 4. Duplicate / Merge Proposals

### Merge proposal: NEW-VOSK-UNZIP-SYNC-JANK → TTS-DL-UNZIP-SYNC
- Finding A: NEW-VOSK-UNZIP-SYNC-JANK (claude-auditor 07-09)
- Finding B: TTS-DL-UNZIP-SYNC (in matrix as P2)
- Why same root cause: both describe `fflate.unzipSync` blocking main thread on the same line (vosk-tts-engine.js:110)
- Canonical ID suggestion: TTS-DL-UNZIP-SYNC (already in matrix); NEW-VOSK-UNZIP-SYNC-JANK as alias

---

## 5. Severity Proposals

- Target bug: D-1
- Current severity: P2
- Proposed severity: P3 (partial fix: cancel-in-progress:true now applied to indexnow)
- Evidence: verified-source on `2ca2af3`

---

## 6. Repair Lane Suggestions

- Bug IDs: AR-AUDIT-16, AR-AUDIT-17
- Lane: W0 (truth hygiene) for AR-AUDIT-16; genealogy lane for AR-AUDIT-17
- Why together: AR-AUDIT-16 is truth-surface drift (update matrix HEAD); AR-AUDIT-17 is a new finding from genealogy work
- What must NOT be mixed: genealogy HTML fixes (AR-AUDIT-17) with truth-surface updates (AR-AUDIT-16)

---

## 7. Reverify Notes

- Bug: all D-* open items
- Current HEAD: `2ca2af3`
- Results:
  - D-1: partially fixed (cancel-in-progress:true added to indexnow), P2→P3
  - D-2: not checked (needs production-like build)
  - D-3: JS budget 467KB source (minified), over 365KB limit — confirmed
  - D-4: 20 z-index in floating-cluster.css, 5 magic values — confirmed
  - D-7: repo-relative link still present at PremiumControlAnchor.astro:3 — confirmed
  - D-8: deploy.yml paths still missing *.md — confirmed
  - D-19: no custom PageHead files found at expected paths on current HEAD (may have moved)
  - D-21: glossary.js still uses innerHTML for detail — confirmed
  - CI-INDEXNOW-CHECKER-STALE: indexnow.yml now uses `contents: read` (least privilege); check-workflows.js still requires `contents: write` and `baptisty-rossii/**` — stale check confirmed

Gate results on source `2ca2af3`:
- `npm run data:consistency` → ✅ PASS
- `npm run gill:series:data:consistency:audit` → ✅ PASS
- `npm run guard:shared-files` → ✅ PASS
- `npm run native:runtime:audit:strict` → ✅ PASS (55/56 strict-native + 1 legacy-shadow-app)
- `npm run css:layer:validate` → ❌ FAIL (21.2% layered, target ≥80%) — D-2 confirmed
- `npm run validate:all` → ❌ 2 errors (genealogy HTML inline script syntax errors) + 2 warnings

---

## 8. Notes for Verifier

1. Source HEAD has advanced significantly from matrix HEAD `b8459bdf` → `2ca2af3`. The matrix and NEXT_AGENT_PROMPT need updating.

2. 16 ORPHAN-CLAIM bugs now have verified-source evidence from this pass (grep output above). Recommend creating minimal reverify documents or accepting this report as evidence.

3. NEW-VOSK-FETCH-NO-ABORT (found by claude-auditor 07-09) is a real bug not yet in matrix — should be added as P3.

4. D-1 partially fixed — recommend severity downgrade P2→P3.

5. The `validate:all` failure (genealogy HTML syntax errors) is a new finding from the genealogy work that was merged. These are in `scripts/genealogy-build/` templates, not in production code — but the validate gate catches them.

6. BUG-PERF-001 count discrepancy: the matrix says "339 add / 25 remove" which counts lines of minified code. The actual unminified count is 80 add / 10 remove. Both numbers are correct from different measurement methods. Recommend clarifying in matrix.
