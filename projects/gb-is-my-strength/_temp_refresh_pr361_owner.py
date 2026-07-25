from pathlib import Path

MATRIX = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
WORKFLOW = Path('.github/workflows/_temp-refresh-pr361-owner.yml')
SELF = Path('projects/gb-is-my-strength/_temp_refresh_pr361_owner.py')

text = MATRIX.read_text(encoding='utf-8')


def replace_once(old: str, new: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'expected exactly one match, found {count}: {old[:120]!r}')
    text = text.replace(old, new, 1)


replace_once(
    '| Source HEAD | `9407cc92eb22dc6eab76f831df35a09429663e3e` (current source main; #336/#346 trustworthy source-link acceptance, #338 homepage Chromium/WebKit contract, #354 Gill source repair and #348 exact Genesis 6 Research provenance merged; no open source PR at capture) |',
    '| Source HEAD | `9407cc92eb22dc6eab76f831df35a09429663e3e` (current source main; #336/#346 trustworthy source-link acceptance, #338 homepage Chromium/WebKit contract, #354 Gill source repair and #348 exact Genesis 6 Research provenance merged; active source owner at capture: #361 homepage lifecycle evidence) |',
)
replace_once(
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@9407cc92`, exact deployed Pages/live/TTS authority `f5e29998`, successful trusted replay `30171194731`, merged #336/#346/#338/#354/#348 and no open source PR at capture. It separates Research provenance, Genesis product activation, source deployment and production authority. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `9407cc92` source + exact `f5e29998` evidence import |',
    '| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@9407cc92`, exact deployed Pages/live/TTS authority `f5e29998`, successful trusted replay `30171194731`, merged #336/#346/#338/#354/#348 and active test-only owner #361. It separates Research provenance, Genesis product activation, homepage lifecycle evidence, source deployment and production authority. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `9407cc92` source + exact `f5e29998` evidence import |',
)
replace_once(
    '- Closed count 159 → 160; P2 open count 37 → 36. No open source PR existed at capture.',
    '- Closed count 159 → 160; P2 open count 37 → 36. Active source PR owner at capture: #361 (test-only homepage lifecycle evidence); no Genesis activation owner existed.',
)

MATRIX.write_text(text, encoding='utf-8')
SELF.unlink()
WORKFLOW.unlink()
print('refreshed PR361 ownership and removed temporary transport')
