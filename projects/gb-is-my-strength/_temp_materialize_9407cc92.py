from pathlib import Path

MATRIX = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
WORKFLOW = Path('.github/workflows/_temp-materialize-9407cc92.yml')
SELF = Path('projects/gb-is-my-strength/_temp_materialize_9407cc92.py')

text = MATRIX.read_text(encoding='utf-8')


def replace_once(old: str, new: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'expected exactly one match, found {count}: {old[:120]!r}')
    text = text.replace(old, new, 1)


replace_once(
    '| Source HEAD | `b594ba82afbbefb8cc5c27ea2604d9f308392daa` (current source main; #336/#346 trustworthy source-link acceptance, #338 homepage Chromium/WebKit contract and #354 citation-preserving Gill source repair merged; active source owner at capture: #348 Genesis 6 Research provenance) |',
    '| Source HEAD | `9407cc92eb22dc6eab76f831df35a09429663e3e` (current source main; #336/#346 trustworthy source-link acceptance, #338 homepage Chromium/WebKit contract, #354 Gill source repair and #348 exact Genesis 6 Research provenance merged; no open source PR at capture) |',
)
replace_once(
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; trusted manual replay `30171194731` later completed successfully without rewriting that history. Current source `b594ba82` includes merged source-link, homepage-browser and Gill source-repair contracts but is not claimed deployed; whole-release identity/build-once remain open. |',
    '| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; trusted manual replay `30171194731` later completed successfully without rewriting that history. Current source `9407cc92` includes merged source-link, homepage-browser, Gill-source and Genesis 6 Research-provenance contracts but is not claimed deployed; whole-release identity/build-once remain open. |',
)
replace_once(
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_b594ba82_home-links-clean.md` |',
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_genesis-provenance.md` |',
)
replace_once(
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `b594ba82`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical ledger run `30169981463` remains failure; trusted manual replay `30171194731` is a separate later success. PRs #336/#346 close SYSTEM source-link acceptance, PR #338 closes the homepage browser-contract gap, and PR #354 closes the five Gill source defects with zero hard network results. Newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_b594ba82_home-links-clean.md`.',
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `9407cc92`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical ledger run `30169981463` remains failure; trusted manual replay `30171194731` is a separate later success. PR #348 closes the Research authority/provenance gap while preserving `draft-noindex`; it does not activate Genesis 6 routes. Newer-source deployment, Genesis product activation and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_genesis-provenance.md`.',
)
replace_once('## ✅ ЗАКРЫТО (159)', '## ✅ ЗАКРЫТО (160)')
replace_once(
    '|---|---|---|\n| GILL-EXTERNAL-SOURCE-5 |',
    '|---|---|---|\n| RESEARCH-AUTHORITY-MANIFEST-MISSING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** Research issue #16 produced a machine-readable authority/supersession/rights manifest and publication ledger. PR #348 then pinned exact Research commit `9bba3d45`, authority base `b654c537`, manifest digest `95320cc5…`, four ordered article bundles and exact rights decisions in a read-only site contract. Exact head `ce75fcde` passed Genesis provenance `30176399705`, Shared Guard `30176399710` and Visual Parity `30176399701`; merge `9407cc92`. This closes provenance ordering only: no MDX/routes/publication state changed, `draft-noindex` remains mandatory and `GENESIS6-ACTIVATION-OWNER-GAP` stays open. | `9407cc92` PR#348; Research issue #16 |\n| GILL-EXTERNAL-SOURCE-5 |',
)
replace_once(
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@b594ba82`, exact deployed Pages/live/TTS authority `f5e29998`, successful trusted replay `30171194731`, merged #336/#346/#338/#354 and active #348 ownership without conflating browser/network evidence, source deployment or production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `b594ba82` source + exact `f5e29998` evidence import |',
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@9407cc92`, exact deployed Pages/live/TTS authority `f5e29998`, successful trusted replay `30171194731`, merged #336/#346/#338/#354/#348 and no open source PR at capture. It separates Research provenance, Genesis product activation, source deployment and production authority. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `9407cc92` source + exact `f5e29998` evidence import |',
)
replace_once(
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; trusted manual replay `30171194731` completed success while historical run `30169981463` remains failure. Residual gap is now only that current source `b594ba82` has no exact readiness/Pages/live deployment witness and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); replay `30171194731`; source `b594ba82`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_b594ba82_home-links-clean.md` |',
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; trusted manual replay `30171194731` completed success while historical run `30169981463` remains failure. Residual gap is now only that current source `9407cc92` has no exact readiness/Pages/live deployment witness and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); replay `30171194731`; source `9407cc92`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_genesis-provenance.md` |',
)
replace_once('## 🟡 P2 — ОТКРЫТО (37)', '## 🟡 P2 — ОТКРЫТО (36)')
replace_once(
    '| GENESIS6-ACTIVATION-OWNER-GAP | Canonical Genesis 6 MDX/images remain draft/noindex. Temporary verifier PR #296 completed and closed without merge; issue #287 remains coordination evidence, but no fresh-main five-route product finalizer/activation owner exists. | issue #287; PR #296 closed without merge |',
    '| GENESIS6-ACTIVATION-OWNER-GAP | Exact Research provenance is now pinned by PR #348, but canonical Genesis 6 MDX/routes remain absent or draft/noindex. Issue #287 is archived/not-planned transport history and cannot own activation; no fresh-main product finalizer exists. Closing requires one normal reviewable product PR with shared series chrome, exact-head Astro/build/Chromium/WebKit, rights/source and publication-state evidence. | PR #348; issue #287 archived; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_genesis-provenance.md` |',
)
replace_once(
    '| RESEARCH-AUTHORITY-MANIFEST-MISSING | Genesis/Jude/Peter publication still requires manual composition of XLVIII base + XLIX text corrections + L rights decisions + LI precision overlays. Add machine-readable authority/supersession/rights manifest and pinned Research SHA/compiler. | Research issue #16; Research `b654c537` |\n',
    '',
)

session = '''

### 2026-07-25 — source `9407cc92`, Genesis 6 Research provenance pinned

- Advanced source SSOT from `b594ba82` to merged PR #348 / `9407cc92`; production authority remains exact imported `f5e29998`.
- Moved `RESEARCH-AUTHORITY-MANIFEST-MISSING` from open P2 to closed after exact Research SHA/manifest/ledger/bundle/rights pinning and successful provenance, Shared and Visual gates.
- Preserved `GENESIS6-ACTIVATION-OWNER-GAP`: #348 changed no route, MDX, theme, CSS or publication state; `draft-noindex` remains mandatory and issue #287 remains archived transport history.
- Closed count 159 → 160; P2 open count 37 → 36. No open source PR existed at capture.
'''
if session.strip() in text:
    raise SystemExit('session entry already exists')
text = text.rstrip() + session + '\n'

MATRIX.write_text(text, encoding='utf-8')
SELF.unlink()
WORKFLOW.unlink()
print('materialized 9407cc92 matrix reconciliation and removed temporary transport')
