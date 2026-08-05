# Reader Projection & Controls — Check Ledger

## Authoritative inventory

Product head: `182793e35c238c6b4635e25bdf9c2dbb3696b75f`  
Workflow run: `30966440764`

### Source and owner checks

| Area | Checks | Pass | Diagnostic findings |
|---|---:|---:|---:|
| Authority topology | 8 | 7 | 1 |
| TTS ownership source | 10 | 6 | 4 |
| ReaderProjection source | 16 | 6 | 10 |
| Speakable/summary/search convergence | 10 | 7 | 3 |
| Hermenevtika speed slot | 12 | 2 | 10 |
| Gill speed slot | 8 | 5 | 3 |
| Popup semantics | 4 | 2 | 2 |
| Favorites metadata/store | 12 | 5 | 7 |
| **Total** | **80** | **40** | **40** |

Source findings are classified in `CLASSIFICATION.md`; they are not all Product defects.

### Production-like browser checks

| Case | Checks | Pass | Diagnostic findings | Page errors |
|---|---:|---:|---:|---:|
| Hermenevtika desktop 1440×900 | 17 | 14 | 3 | 0 |
| Gill desktop 1440×900 | 17 | 14 | 3 | 0 |
| Antisovetov desktop 1440×900 | 17 | 14 | 3 | 0 |
| Hermenevtika mobile 390×844 | 52 | 30 | 22 | 0 |
| Gill mobile 390×844 | 52 | 37 | 15 | 0 |
| Antisovetov mobile 390×844 | 27 | 20 | 7 | 0 |
| **Total** | **182** | **129** | **53** | **0** |

Console messages were retained in the artifact, but no uncaught page errors occurred. Product findings were intentionally diagnostic so the audit could complete and preserve the whole ledger.

## Check families

1. Route/document success, JSON-LD parsing, Article/Speakable presence and duplicate IDs.
2. Canonical TTS API readiness, public legacy-overlay absence, visible Play cardinality and one-click/one-owner speech.
3. Shared ReaderProjection API and explicit rendered policy-marker inventory.
4. Mobile popup claim/controlled-element truth.
5. Natural, forced-closed and opened speed-slot state.
6. `aria-hidden`/inert state and radio Tab-stop cardinality.
7. ArrowRight, Home, End and Enter behavior plus focus-stranding checks.
8. Save-surface pressed/class/label synchronization.
9. Persisted favorite JSON, normalized path, title, canonical metadata, schema version and store API.

## Artifact ledger

| Artifact | ID | Digest | Contents |
|---|---:|---|---|
| Exact-head source audit | `8914900439` | `sha256:2074d961a4cc32f6eb7fd427bb0af995fd71703d7ffb6b8f69e463508cfe5f50` | JSON/Markdown/log for 80 checks |
| Exact-head browser audit | `8914961188` | `sha256:b895deb934ed00cc84d680a153c8d028d49a7bf5f31a821c7aa387f289350073` | JSON/Markdown/log, production-like build log and six screenshots |

## Superseded diagnostic packages

Product PRs #963 and #965 are closed unmerged. Their runs helped correct sequencing and provenance, but they are not authorities for this intake. In particular:

- the first browser pass inspected slots after PLAY and was superseded by the sequenced pass;
- the next pass checked out a synthetic PR merge commit and was superseded by exact-head PR #970;
- Product #970/run `30966440764` stamps the checked-out head in both JSON reports and is the only package used for current classification.

## Matrix disposition

No matrix row is closed, reopened or re-prioritized by this audit intake. The audit establishes current defects and lane boundaries. Status transitions require merged Product repair, fresh exact-head verification, and—where relevant—production evidence.