# Evidence Integrity & Repository Hygiene Audit — AuditRepo (Agent 5 of 5)

## Identity

- **Agent:** Arena Agent 5 / Evidence integrity & repository hygiene audit
- **Date:** 2026-09-06
- **Scope:** whole repository — current tree **and** full reachable history
- **Audited anchor:** AuditRepo `main` commit `29450bf8dc3baa69289be770e3fbb64a1728dcee` (merge of PR #363, 2026-09-06), full history 1490 commits (2026-06-25 → 2026-09-06) re-fetched unshallow for this audit
- **Mode:** non-destructive. No evidence was deleted, rewritten or moved. MASTER matrices untouched. CI/workflows untouched. No secrets copied into this report; only redacted fingerprints.

## Method (all read-only)

| Check | Tool/method | Coverage |
|---|---|---|
| Size inventory | `git ls-files` + `stat`, `git rev-list --objects --all` + `cat-file --batch-check` | 1929 tracked files; 3426 history blobs |
| Duplicate detection | SHA-256 of every tracked file, cross-path grouping; content comparison of ZIP vs extracted tree | full tree |
| Corruption | PNG chunk walker (signature/ICC/CRC/IEND/IDAT inflate + row-length check); `zipfile.testzip` (nested, recursive); `git fsck --connectivity-only` | 131 PNGs; 4 ZIPs (incl. nested); object store |
| Type mismatch | magic-byte vs extension; NUL-byte scan inside text extensions | all 1929 files |
| Secrets | 9 high-signal regex families (AWS/GitHub/OpenAI/Anthropic/Google/PGP-OPENSSH keys/Slack/JWT/Telegram) over **every blob in full history** (3426), the working tree, and **inside all ZIPs incl. nested**; 2 low-signal generic patterns for triage | 100% of reachable history |
| Dead references | relative-link resolver over all 1503 tracked Markdown files | full tree |
| Manifests | SHA-256 re-computation for `research-package/meta/FILE_MANIFEST_SHA256.txt` and `scripts/vendor/pyyaml_6_0_3.manifest.json` | both manifests |
| Repo self-checks | `scripts/validate_audit_repo.py`, `scripts/check_auditrepo_structure.py` | PASS/PASS |
| Exec bits / ignore gaps | `git ls-files -s`, `.gitignore`/`.gitattributes` review, CRLF scan | full tree |

---

## 1. Size / hygiene inventory

**Working tree (HEAD):** 1929 files, **96.6 MB** tracked content. **Object store:** pack 87.5 MB, `git fsck` clean, no garbage. **History:** 1490 commits, 3426 blobs, 136.2 MB raw (pre-delta) — history is already compact: only ~43.6 MB of retired text blobs (old matrix revisions, logs, workflows) are not in HEAD, and **no large binary blob exists in history outside HEAD** (largest retired blob is a 0.34 MB log).

**By extension (working tree):**

| ext | files | MB | | ext | files | MB |
|---|---|---|---|---|---|---|
| .png | 131 | 73.69 | | .txt | 105 | 0.30 |
| .md | 1503 | 9.07 | | .mdx | 9 | 0.25 |
| .zip | 3 | 7.39 | | .woff2 | 12 | 0.12 |
| .html | 23 | 1.94 | | .xml | 2 | 0.07 |
| .patch | 1 | 1.45 | | code (py/js/mjs/css/ts/yml) | 108 | 0.49 |
| .webp | 12 | 0.66 | | json | 44 | 0.60 |

Screenshot evidence (PNG) is **76% of all tracked bytes**; together with the ZIPs it accounts for ~84 MB of the 87.5 MB pack (binary evidence is incompressible, so pack ≈ raw for these).

**Top material contributors (working tree):**

| MB | Area |
|---|---|
| 86.34 | `projects/gb-is-my-strength/` |
| 8.05 | `references/gb-ui-canon-2026-07-13/` (canon UI witnesses, 2 PNGs alone are 3.2 + 2.2 MB) |
| 0.85 | `projects/the-legendary-poet/` |
| 0.68 | `references/gill-mobile/` |
| <0.4 each | `scripts/`, `verification/`, `references/ref-retirement/`, `projects/code-audit/`, `_OWNER_DOWNLOADS/` |

Largest single files: `projects/gb-is-my-strength/ZIP GBS.zip` (7.33 MB), `references/gb-ui-canon-2026-07-13/reader-engine-settings-canon.png` (3.22 MB), `desktop-settings-popover-canon.png` (2.22 MB), then the 27 witnesses of `projects/gb-is-my-strength/verification/atlas/root-evidence-2026-07-11/` (1.5–1.8 MB each, ~36 MB block).

**Generated / cache / temp files committed:** none found in the current tree. The 11 tracked `.out` files (archive, `arena-agent-premiumcontrols-surgeon/2026-06-27/evidence/`) are **captured tool runs** (pa11y, lhci, semgrep, stylelint, linkinator, webhint, depcheck) — raw audit evidence, not build droppings, and correctly located in `archive/`. `commands.log` (22 lines) is a hand-written provenance header, not a runtime log. No `.pyc`/`__pycache__`/`.DS_Store`/`Thumbs.db`/`.tmp` tracked; object store has zero garbage.

**Exec bits:** only `scripts/scaffold_intake.py` and `scripts/scaffold_regression_test.py` (intentional).

---

## 2. Integrity verification — everything that PASSED

- **PNG evidence:** 131/131 structurally valid (signature, chunk CRCs, IEND terminator, IDAT inflates, row length vs IHDR). Zero corrupt or truncated screenshots.
- **ZIPs:** `ZIP GBS.zip`, both nested archive members, `_OWNER_DOWNLOADS/gb-floating-cluster-LATEST-REPORTS-2026-06-27.zip`, `references/gill-mobile/gill-research-3-engines-package.zip` — all pass CRC test, including nested-on-nested.
- **Extension/content match:** 0 mismatches across all files (magic bytes vs extension; no binary content hidden in text extensions; the single CRLF-bearing `production-headers.txt` is a raw HTTP-header capture where CRLF is intrinsic — correctly *not* normalized by `.gitattributes`).
- **Checksum manifests:** `incoming/gbs-book-engine-research/2026-07-15/research-package/meta/FILE_MANIFEST_SHA256.txt` → **48/48 files match**; `scripts/vendor/pyyaml_6_0_3.manifest.json` → **18/18 files match**, vendored package imports as PyYAML **6.0.3** with LICENSE + source URL + purpose recorded in `scripts/vendor/README.md`. Vendoring is exemplary: pinned, checksummed, licensed, documented, used by exactly one consumer (`check_workflow_syntax.py`).
- **Repo self-checks:** `validate_audit_repo.py` → PASS; `check_auditrepo_structure.py` → PASS; `git fsck --connectivity-only` → clean.
- **History hygiene:** the 2026-08-10 history-image-rewrite left no large binaries behind; `.gitignore` (*.log etc.) is respected in new commits; workflow yml files use only `secrets.GITHUB_TOKEN`.

## 3. Secrets & sensitive data — CLEAN (with two informational notes)

- **Zero hits** for AWS access keys, GitHub tokens (`gh*_…`), OpenAI/Anthropic keys, Google API keys, private-key PEM headers, Slack tokens, JWTs, Telegram bot tokens, `Authorization: Bearer …` headers, session cookies — across **every blob in full history (3426), the whole working tree, and all ZIPs including nested members**.
- One low-signal candidate was triaged and is a **false positive**: `projects/gb-is-my-strength/passes/reports/2026-07-11-gill-mobile-agent-findings.md:11` — the word "token" in prose followed by a **CSS `box-shadow` value** (`token = '0 -10px 30px rgba(…)'`). Fingerprint of the matched string: `len=78 sha256[:8]=8d5a6227`. No credential. Nothing redacted needed.
- **Informational (not secrets):** ~100 evidence files contain machine-local sandbox paths (`/home/user/...`, `/home/user/work/gb-is-my-strength`, `/home/user/gb-project/...`), e.g. `archive/2026-06-27-premiumcontrols-docs/DEEP_REVERIFY_2026-06-27.md`, `incoming/gbs-book-engine-research/2026-07-15/research-package/meta/REFERENCE_INPUTS_SHA256.txt`. These are recorded session environments (the repo even documents this convention in `SANDBOX-ENV-2026-06-21.md`). They reveal only a sandbox username; **do not rewrite raw evidence to scrub them.** No personal data (emails/phones) beyond the git identity was found.

## 4. Verified issues

**VIE-01 (medium — evidence gap on an active spec).** `projects/gb-is-my-strength/PremiumControls/spec/playember-speed-morph.md` (UI spec v2.0) references its own acceptance image `../screenshots/speed-pill-mobile-gbs.png` (lines 5 and 150), but that file was **never committed anywhere in the tree or in all history**. The spec's mobile visual-QA acceptance criterion ("Matches … within 4px") is therefore not executable as written. The two screenshots that do exist (`speed-pill-desktop.png`, `speed-pill-full-cluster.png`) are present and referenced by `archive/2026-06-27-premiumcontrols-docs/DEEP_REVERIFY_2026-06-27.md:1480`. → Owner/next agent should either commit the missing mobile witness or re-anchor the criterion to an existing artifact.

**VIE-02 (low — dead pointers inside a raw intake, inherited from upstream).** `incoming/gbs-book-engine-research/2026-07-15/research-package/research/ENGINE_DOCUMENTATION_AUDIT.md` links to `screenshots/current-*.png` (7 targets), `integration/ENGINE_PLATFORM_INTEGRATION.md`, `integration/enginePlatformContracts.ts`, `integration/engineExamples.ts`, `integration/SVG_STATE_ANIMATION_MANIFEST.md` and `book-engine-reference-prototype.html` (relative path) — none resolve inside the package (`screenshots/` holds `reference-*.png`; the docs live in `research/`, `contracts/`, `prototype/`). **The extraction is faithful** — the source archive itself (`GBS_ENGINE_RESEARCH_2026-07-15.zip`, verified byte-identical to the tree, 71/71 files) never contained those targets. Report-only: raw intakes are not rewritten; the audit value is that future readers know the gap came with the package.

**VIE-03 (low — self-declared stray duplicate in `working/`).** `working/DEBT-REGISTER-ROOT-STRAY-2026-07-14.md` is **byte-identical** (sha256 `7f24554b…`) to `working/atlas/DEBT-REGISTER.md`, and its own filename says "ROOT-STRAY". Per `working/README.md`, superseded drafts belong in `archive/`. Both copies exist, so no evidence is at risk. → Cleanup candidate C-01 (recommendation only).

**VIE-04 (low — contradictory canonical pointer, fixed in this PR).** `references/gill-mobile/README.md` marks `gill-mobile-bars-v2.9.html` ✅ CANONICAL in its table, but "How to use" still said "canonical reference (currently v2.7)" — an agent following that line would reconcile to a **superseded** mockup. This is a guidance index, not raw evidence; the one-word correction (v2.7 → v2.9) is applied in this PR.

**VIE-05 (low — registry/evidence mismatch).** `projects/code-audit/` exists with a complete scaffold and a `PROJECT_META.yml` (`source_repo: 3stoneBrother/code-audit`), but is absent from `PROJECT_REGISTRY.md` (which lists only the two active projects and a status glossary that *includes* statuses like `intake-only`/`paused`/`archived` for exactly this case). → Recommend adding a registry row (status `intake-only`) rather than deleting the scaffold.

**VIE-06 (low — promised evidence never landed).** `incoming/arena-agent-karty-strategy/2026-07-07/proposals/proposal-OWNER-5-visual-qa-baseline.md` links five screenshots (`screenshots/desktop-main.png`, `desktop-panel.png`, `desktop-tour.png`, `mobile-main.png`, `mobile-panel.png`) that exist nowhere in tree or history — the proposed visual-QA baseline was never materialized. Report-only (raw intake).

## 5. Duplicate evidence — classified (all harmless/intentional today)

27 duplicate-content groups; **3.99 MB** redundant in the *working tree* (identical blobs are stored once in the pack, so clone/pack cost ≈ 0).

| Class | Evidence | Verdict |
|---|---|---|
| Faithful intake mirroring | `incoming/gbs-book-engine-research/2026-07-15/prototypes/` ≡ `…/research-package/prototypes/` (22/22 files identical) | **Intentional** — mirrors the two original archive members exactly (`GBS_HTML_PROTOTYPES_2026-07-15.zip` and the copy inside `GBS_ENGINE_RESEARCH_…zip`). Deduping would break fidelity to the raw package. Keep. |
| Raw artifact vs extracted tree | `ZIP GBS.zip` (7.33 MB) vs `incoming/gbs-book-engine-research/2026-07-15/**` — **71/71 files byte-identical (SHA-256), 0 differ, 0 missing** | The ZIP is 100% content-redundant, but it is the **raw owner-provided artifact** and the intake's stated identity source (`REPORT.md`: "распакованный из архива `ZIP GBS.zip`"). Per `CLEANUP_RETENTION_POLICY.md` ("never silently delete raw evidence") → **retain**; listed as owner-decision candidate C-02 with the redundancy proof attached. |
| Curated copy vs raw intake | `PremiumControls/screenshots/speed-pill-full-cluster.png` ≡ `archive/…/arena-agent-premiumcontrols-verifier/2026-06-26/artifacts/premium-controls-reference-mobile.png`; `speed-pill-desktop.png` ≡ `…/premium-controls-reference-compact.png` | Both copies are referenced by their own documents (spec / DEEP_REVERIFY line 1480). Independent navigation value; keep. |
| Archive-of-archive | `archive/2026-06-27-working/premium-surface-bug-matrix-2026-06-25.md` ≡ `archive/2026-07-03-stale-incoming/arena-agent/2026-06-25/…` (same for `PREMIUM_CONTROLS_ROUTE_MAP_…`) | Two archival passes copied the same retirement material. ~30 KB, zero pack cost, legacy is intentionally retained. Keep; optional consolidation candidate C-03. |
| Stray working copy | `working/DEBT-REGISTER-ROOT-STRAY-2026-07-14.md` ≡ `working/atlas/DEBT-REGISTER.md` | See VIE-03 / C-01. |
| Intake asset reuse | `prototype/assets/*` (kod/heart/gill/herm.webp, 4 woff2) ≡ intake prototypes assets | The working prototype legitimately consumes the same assets; single pack object. Keep. |

## 6. Must explicitly be RETAINED (anti-cleanup list)

- **All raw evidence in `incoming/`, `archive/`, `verification/atlas/root-evidence-2026-07-11/`** — including the 36 MB atlas witness block and the 5.5 MB `claude-atlas-deep-audit` screenshots. Old/large ≠ deletable; each is a dated, anchored witness.
- **`ZIP GBS.zip` and `_OWNER_DOWNLOADS/gb-floating-cluster-LATEST-REPORTS-2026-06-27.zip`.** The latter additionally contains `FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md`, which is **not extracted anywhere else in the repo** (5 of 6 members are byte-identical with `archive/2026-07-03-stale-*` copies; this one is unique) — deleting the ZIP would lose a document.
- **`references/gill-mobile/` version chain v2.5→v2.9** and `references/gb-ui-canon-2026-07-13/` canon PNGs — design ground truth used for 1:1 reconciliation.
- **`references/gill-mobile/gill-research-3-engines-package.zip`** — raw package, CRC-clean, secret-free, not extracted elsewhere.
- **The `.out` tool logs, `commands.log`, `.mdx` content captures, the 1.45 MB `.patch`** — raw evidence with provenance value.
- **Vendored `scripts/vendor/pyyaml_6_0_3/`** — needed by the workflow preflight on cold runners, checksummed and licensed.

## 7. Cleanup candidates — RECOMMENDATIONS ONLY (nothing executed)

- **C-01** After owner confirms `working/atlas/DEBT-REGISTER.md` is the live copy: move `working/DEBT-REGISTER-ROOT-STRAY-2026-07-14.md` to `archive/` (proof: byte-identical, sha256 `7f24554b…`; no information loss — the copy survives in archive and in history).
- **C-02** `ZIP GBS.zip`: if clone weight ever matters, the owner may retire the 7.33 MB ZIP to external storage — proof that no forensic authority would be lost: every member (and nested member) of the archive is byte-identical (71/71 SHA-256) to the committed extraction, the extraction itself carries a 48/48-verifying SHA-256 manifest, and the ZIP's identity role is documented in the intake `REPORT.md`. Until decided: **keep** (policy default).
- **C-03** Optionally note one archive location as authoritative for the two 2026-06-25 premium-controls retirement docs (both copies currently valid and retained).
- **No MASTER rows, no legacy content, no screenshots, no raw intakes are proposed for deletion.**

## 8. Guards — justified, minimal, applied in this PR

- `.gitattributes`: explicit `binary` markers for evidence media types (`png/jpg/jpeg/gif/webp/zip/woff2/pdf`) so no future EOL/whitespace tooling can mangle binary witnesses (vendor dir already protected; raw CRLF capture `production-headers.txt` deliberately left untouched).
- `.gitignore`: defensive additions `*.py[cod]`, `node_modules/`, `.venv/` (repo runs Python tooling in CI; keeps accidental virtualenv/dependency droppings out of future intakes without touching any tracked file).
- Not applied (no justification yet): LFS, file-size CI gate. Current history is compact (87.5 MB pack, no stray history blobs); if screenshot sizes keep growing, an advisory size report (not a hard gate) would be the right next guard — decision left to owner.

## 9. Re-run instructions (follow-up audits)

```bash
git fetch --unshallow origin main            # full history for blob scans
python3 scripts/validate_audit_repo.py       # repo self-check (expect PASS)
python3 scripts/check_auditrepo_structure.py # expect PASS
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectsize) %(rest)' \
  | awk '$1=="blob" && $2>1000000'           # top history blobs (expect only known evidence)
# secret rescan: high-signal regex families over all blobs + tree + nested zips (see REPORT §3 method)
```

## Limitations

Secret scan is pattern-based (9 high-signal families + 2 triage patterns); high-entropy-only scanning and AI-assisted classification were not available in this environment. `git grep` scans text-decodable content only (binary blobs inside ZIPs were scanned by extraction, which covers the committed archives). Findings VIE-01/02/05/06 need owner/next-agent disposition; this audit intentionally did not modify any project evidence, MASTER matrix, or workflow.
