# Reader Projection & Controls — Current-Head Classification

## Classification rule

A source string match is not sufficient. Promotion to `confirmed-current` requires direct owner inspection plus exact-head production-like behavior. This intake does not mark anything fixed.

| Cluster / signal | Classification | Evidence | Disposition |
|---|---|---|---|
| Shared ReaderProjection API/policy | **confirmed-current** | `RC-PROJ-01..10`; all six browser cases `*-13`/`*-14` | Dedicated ReaderProjection lane |
| TTS vs Speakable/summary/search convergence | **confirmed-current** | Hermenevtika SpeakableSpecification exists; TTS has no shared selector/policy source | ReaderProjection lane, no TTS-engine rewrite |
| Hermenevtika closed speed rail AT/Tab exposure | **confirmed-current** | `RC-SEQ-HERM-SLOT-03/04/09/10` | Controls accessibility lane |
| Hermenevtika roving keyboard model | **confirmed-current** | `RC-SEQ-HERM-SLOT-14/16/18/19/20` | Controls accessibility lane |
| Hermenevtika badge ownership/expanded state | **confirmed-current** | `RC-SEQ-HERM-SLOT-06/07/15` | Controls accessibility lane |
| Gill closed rail exposure | **fixed-current / pass** | `RC-SEQ-GILL-SLOT-02/03/04/08/09/10` | Preserve; regression guard |
| Gill opened rail roving Tab stop | **confirmed-current** | `RC-SEQ-GILL-SLOT-14/18`: six `tabIndex=0` radios | Controls accessibility lane |
| Gill ArrowRight navigation | **fixed-current / pass** | `RC-SEQ-GILL-SLOT-16/17` | Preserve; do not regress |
| Gill Home/End navigation | **confirmed-current** | `RC-SEQ-GILL-SLOT-19/20` | Controls accessibility lane |
| Gill badge ownership/expanded state | **confirmed-current** | `RC-SEQ-GILL-SLOT-06/07/15` | Controls accessibility lane |
| Desktop Play popup ownership | **fixed-current / pass** | desktop `*-15`: real `aria-controls` target exists | Preserve |
| Mobile Play popup ownership | **confirmed-current** | mobile Herm/Gill/Antisovetov `*-15`: `aria-haspopup=true`, no controls | Controls accessibility lane |
| One live TTS owner | **fixed-current / pass** | all six `*-05/06/16/17`; no public legacy overlay | Keep TTS closure closed |
| Legacy TTS source implementation remains | **narrowed-current architecture debt** | `RC-TTS-06..09`; browser proves it dormant on audited routes | Optional later pruning lane |
| Save pressed/class synchronization | **fixed-current / pass** | mobile save `*-02/03` | Preserve |
| Save accessible label synchronization | **confirmed-current** | persisted UI labels remain `Добавить в Избранное` after save; source regex was overbroad | Favorites lane |
| Canonical favorite type/category | **confirmed-current** | save `*-08`; records store breadcrumb `section` only | Favorites lane |
| Favorite schema version | **confirmed-current** | save `*-09` | Favorites lane |
| Canonical favorite store API/event | **confirmed-current** | save `*-10`; source `RC-SAVE-07/09` | Favorites lane |
| Breadcrumb/OG metadata scraping | **confirmed-current** | source `RC-SAVE-05/06`; records show `Главная`/`⌂ Главная` despite canonical `SITE_CONFIG.page` | Favorites lane |
| Generic descendants under `aria-hidden=true` | **not promoted / probe overreach** | selector includes CSS-hidden sheets and modals without proving actual sequential focus | Separate focused audit if needed |
| Final visual close sampled at 100 ms | **not promoted / transition timing** | state and Tab values already changed while CSS visibility transition remained | Use transition-aware regression timing |
| `RC-AUTH-01` | **false positive** | literal `ReaderActionsRuntime` string is absent from its own file; imports/API prove ownership | Ignore |
| Research repository as Product authority | **not applicable** | no governing ReaderProjection/radiogroup/popup/favorites contract found | Product current head remains authority |

## Scope boundary

The first repair lane may touch only shared/mobile control semantics and their tests. It must not introduce ReaderProjection, migrate favorites, redesign controls, change TTS/Vosk engines, or modify unrelated route/content owners.

The second and third lanes must begin from fresh Product `main`, perform a new overlap check, and retain all passing one-owner TTS and save-surface synchronization contracts.