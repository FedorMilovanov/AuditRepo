# Optional Work Queue — gb-is-my-strength

Эта очередь показывает **возможные** направления. Она не является обязательным планом, не должна всегда быть полной и не синхронизируется после каждого Product commit.

Перед началом любой lane нужно перечитать актуальный Product owner, open PRs и релевантное evidence.

## How to use

Владелец может:

- выбрать один мелкий finding;
- выбрать systemic root;
- провести verification wave по пакету;
- заменить очередь новым приоритетом;
- оставить очередь пустой;
- park/accept risk без Product mutation.

AuditRepo не требует закрывать список сверху вниз.

---

## Candidate lanes from current evidence corpus

### 1. Baptists 3D measured split

- Historical theme: `R-005`.
- Verified measurement at Product exact head `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae`: `_app/index.html` is **2,245,854 bytes**.
- Ownership: explicit `built-app` / `copy-as-built-asset`; it is not a strangler duplicate.
- First question: can complete source/dependency boundaries be obtained and split without changing iframe/strict-native-app behavior?
- Suggested mode: measurement-first improvement.
- Do not split the one-line app by guessed anchors or introduce a global blocking size gate.
- Possible outcomes: bounded extraction / park / accepted current cost.

### 2. Strangler parity-authority migration before retirement

- Theme: `ST-STRANGLER`; detailed wave: `verification/2026-08-06-strangler-inventory-wave/REPORT.md`.
- Verified inventory: **52 public indexes = 51 Astro shadows + 1 independent built app; unowned 0**.
- Current deletion-ready count: **0**, because `legacy-shadow-wrapper-audit.js` actively consumes all 51 shadows.
- First question: for which one small route or tightly related family can parity evidence be moved to another named immutable owner with equal coverage?
- Suggested mode: route-family verification/retirement wave.
- Required sequence: consumer inventory → replacement parity authority → source/dist/browser evidence → bounded deletion → rerun inventory.
- Do not weaken text ratios, canonical/noindex checks or route markers merely to reduce file count.
- Possible outcomes: one bounded retirement / park / accepted duplication / better system design.

### 3. Bible corpus acquisition and import proof

- Historical owner: `SEARCH-P2-07`; detailed rights wave: `verification/2026-08-06-bible-corpus-rights-wave/REPORT.md`.
- Research authority: PR #149 / merge `d52ea9d54dd2c2488223d25f5f6cefd263c23328`.
- Verified decision: exact CrossWire `RusSynodal` 1.9.1 is `CANDIDATE_ONLY`; `RusSynodalLIO` is permission-controlled; Cassian must not be expanded or republished without explicit permission.
- Remaining holds: official archive not acquired or hashed; book manifest, versification and 66-book Product mapping are not verified; current Product records lack complete `sourceUrl`/`rights` provenance.
- First question: can the exact official archive be acquired, hashed and mapped without mixing translations or weakening existing canonical-record evidence?
- Suggested mode: bounded acquisition/import transaction, not another broad web search.
- Required sequence: exact archive bytes → SHA-256 → embedded licence/source/book manifest → 66-book mapping → verse-level comparison/import receipt → Product source/dist/browser evidence.
- `SEARCH-P2-07` remains open until the complete import and publication boundary are proved.
- Possible outcomes: proceed with exact `RusSynodal` import / obtain separate Cassian permission / choose another licensed corpus / park the full-corpus promise.

---

## How to add a lane

A useful queue entry needs only:

- question to answer;
- evidence source;
- expected user/system benefit;
- first narrow verification;
- possible outcomes, including park or no fix.

Do not copy full run IDs, global HEAD or all historical proofs here.

---

## Last queue change

2026-08-06 selected current-check classified historical `R-006` as `absorbed-by-system-fix`: representative unrelated native surfaces do not mount Reader TTS, eligible pages expose a real PLAY capability, and the heavy Vosk model remains lazy and Worker-owned. The completed generic lane was removed without Product mutation or matrix recount. Detailed evidence: `verification/2026-08-06-r006-tts-loading-wave/REPORT.md`.
