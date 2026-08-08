# GILL CONTENT / RESEARCH MATRIX — 2026-07-09

> **Status:** `working / pending-verifier-synthesis`  
> **Не входит** в open/closed counters `verified/MASTER_BUG_MATRIX.md`.  
> **Source repo:** `FedorMilovanov/gb-is-my-strength@08d9fd1ed097f36a8ad0e3b0ff20eb48e3c080cf`  
> **Functional source SHA:** `f5e000e87f7fe148ee6ea6b3f9623dfe1d207a35`  
> **Research backend:** `FedorMilovanov/Research@58e1ea5fab638812ae693a1d0b1e79c4dcb47131`  
> **Intake:** `../incoming/gpt-5-5-gill-content-research-audit/2026-07-09/REPORT.md`

## 1. Evidence corpus

- Complete indexed findings: **480** (`GILL-CONTENT-001…480`).
- P0 / P0–P1 candidates inside the evidence corpus: **75**.
- Explicit `NEEDS SOURCE / UNVERIFIED / UNSUPPORTED / UNRESOLVED`: **101**.
- The corpus is mixed-status and must not be converted into 480 canonical matrix rows without verifier synthesis.

Full artifact is stored in the intake `artifacts/` transport package and deterministically reconstructs:

```text
GILL_SERIES_FINAL_MASTER_AUDIT_ALL_FINDINGS_2026-07-09.md
```

## 2. Proposed canonical umbrella matrix

| Proposed ID | Scope | Severity candidate | Evidence range | Current status | Suggested lane |
|---|---|---:|---|---|---|
| `GILL-CONTENT-CANONICAL-CLAIMS` | One canonical value per fact; supersession and deployment map | P0 | 315–337, 370–382, 466–470 | pending verifier | `gill-registry-foundation` |
| `GILL-CONTENT-SOURCE-REGISTRY` | Source level, access host, edition, volume/book/chapter/page, quote mode | P0 | 073–078, 120–125, 318–322, 370–382, 397–403, 441–445 | pending verifier | `gill-registry-foundation` |
| `GILL-CONTEXT-HISTORY-INTEGRITY` | Law, toleration, universities, General Baptists, Salters’ Hall, academies, coffee houses | P0/P1 | 180–235, 278–299 | mixed: direct + HOLD | `gill-context-history` |
| `GILL-PART1-BIOGRAPHY-INTEGRITY` | Conversion chronology, family, ordination, Personal Credo, evangelism, quiz | P0/P1 | 031–078, 236–277, 300–314, 323–332 | mixed: direct + HOLD | `gill-part1-biography` |
| `GILL-PART2-RESEARCH-INTEGRITY` | Body structure, CCEL locators, rabbinics, Targums, Song, Whiston, Eastcheap, quotations | P0/P1 | 084–101, 135–164, 333–351, 367–369, 375–480 | mixed: direct + disputed | `gill-part2-sources` |
| `GILL-PART3-LEGACY-INTEGRITY` | Hyper-Calvinism, Spurgeon, Brown, epitaph, modern scholarship, bibliography | P0/P1 | 102–115, 128–179, 290–299, 338–366 | mixed: academic + HOLD | `gill-part3-scholarship` |
| `GILL-SPRAVOCHNIK-GLOSSARY-INTEGRITY` | Timeline, works, glossary definitions, source links and edition normalization | P0/P1 | 001–030, 116–127, 131–144, 157–167 | pending verifier | `gill-spravochnik-glossary` |
| `GILL-IMAGE-PROVENANCE` | Historical original / modern photo / reconstruction / AI-assisted disclosure | P1 | 213, 248, 309–312 | direct current-source evidence | `gill-image-provenance` |
| `GILL-RESEARCH-BACKEND-SUPERSESSION` | Contradictory and superseded claims across Research dossiers 00–42 | P0 | 315–374, 375–470 | direct repository evidence | `research-gill-canonicalization` |
| `GILL-QUIZ-GLOSSARY-SOURCE-GRAPH` | Body → claim → source → quiz/glossary synchronization | P1 | 079–083, 109–119, 292–314 | direct current-source evidence | `gill-quiz-glossary-sync` |

## 3. Route map

| Route / subsystem | Main issue families | Must be repaired after |
|---|---|---|
| `dzhon-gill-istoricheskiy-kontekst` | legal chronology, denominations, Salters’ Hall, academies, coffee-house claims | canonical claims + historical source map |
| `dzhon-gill-chast-1-chelovek` | conversion chronology, family, ordination, quotations, quiz | biography registry + quote registry |
| `dzhon-gill-chast-2-uchenyi` | book structure, locators, rabbinics, Targums, Song, Eastcheap, Whitefield | edition/source registry |
| `dzhon-gill-chast-3-nasledie` | hyper-Calvinism table, Spurgeon dates, Brown, epitaph, bibliography | scholarship matrix + quote registry |
| `dzhon-gill-spravochnik` | canonical timeline, work catalogue, glossary, source ownership | all registries |
| `Research/Джон Гилл/00–42` | stale summaries, conflicting levels, incorrect locators, no supersession | Research canonicalization lane |
| shared series layer | TOC, quiz sourceRef, glossary, SEO/share, timeline, image provenance | route content fixes |

## 4. Verification ladder

### Eligible for fast promotion after current-head line recheck

- Current-source structural defects: broken/missing source graph, TOC/source discoverability, image provenance, contradictory 26/27-year copy.
- Direct primary-source chronology: baptism / membership / first sermon sequence.
- Direct bibliographic contradictions: 7 doctrinal + 4 practical core books; impossible Practical Book V eschatology locator.
- Research cross-file contradictions: CCEL route/book mapping, four/five books, ten-thousand sheets/ten-million words.

### Must remain disputed

- Whether Gill should finally be classified as hyper-Calvinist.
- Whether active/passive justification removes or confirms that label.
- Scope and meaning of duty-faith.
- Modern evaluation of Gill’s vowel-point thesis.

### Must remain HOLD until exact source

- Brown 52 folios/current holdings.
- Exact Spurgeon phrases not located in primary corpus.
- Diplomatic Latin epitaph.
- Aberdeen 1747/1748 archival date.
- Whitefield invitation/co-platform claims.
- Coffee-house institutional details.

## 5. Repair-order proposal

1. **Registry foundation** — claims, sources, editions, quotations, supersession, images.
2. **P0 chronology and locator corrections** — no stylistic rewrite yet.
3. **Historical context lane**.
4. **Part I biography + quiz lane**.
5. **Part II research/source lane**.
6. **Part III scholarship/legacy lane**.
7. **Spravochnik + glossary lane**.
8. **Shared quiz/TOC/SEO/image synchronization**.
9. **Research backend cleanup** after canonical facts are accepted.

## 6. Acceptance gates before canonical matrix promotion

- [ ] Verifier has rechecked target source lines on current functional HEAD.
- [ ] Each umbrella ID has exact route/file scope.
- [ ] Each direct claim has evidence type: source / primary / academic / institutional.
- [ ] Disputed interpretation is not recorded as factual error.
- [ ] HOLD claims remain HOLD.
- [ ] No duplicate canonical IDs with existing Gill UI/TOC findings.
- [ ] Open/closed counters are updated only after accepted rows enter `verified/MASTER_BUG_MATRIX.md`.

## 7. Relationship to existing canonical matrix

This working matrix does **not** replace existing Gill UI/TOC entries such as rail, submenu, Play/Search/Save and visual fixes. It opens a separate content/research workstream and should be merged into the canonical matrix only through verifier acceptance.
