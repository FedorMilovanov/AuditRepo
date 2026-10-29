# Wave 4 — artifact retention and duplicate admission

**Result:** `AR-ARTIFACT-RETENTION-001` closed  
**Scope:** tracked binary/archive corpus, exact duplicates, prospective admission

## Census

At the wave anchor the tracked tree contained:

- 222 PNG, 12 WebP, 3 ZIP and 1 PATCH artifacts;
- 28 exact-content groups among files ≥1 KiB: 65 copies, 4,562,304 duplicate bytes beyond one retained copy per group;
- a 7,690,266-byte `projects/gb-is-my-strength/ZIP GBS.zip`, the only tracked path with whitespace;
- 107.32 MiB packed Git history. Historical pack size is not presented as reclaimable by a normal deletion commit.

Most duplicate groups are historical raw/package topology: standalone prototypes repeated inside a research package, archived screenshots paired with a retained current copy, and frozen documents in two historical collections. Mass deletion would rewrite evidence package boundaries for about 4.35 MiB of working-tree savings and is not justified.

## Proven redundant container

`ZIP GBS.zip` contained two nested archives. Independent extraction compared every regular entry against the unpacked tracked owner under `incoming/gbs-book-engine-research/2026-07-15/`:

- `GBS_ENGINE_RESEARCH_2026-07-15.zip`: 49/49 files byte-identical;
- `GBS_HTML_PROTOTYPES_2026-07-15.zip`: 22/22 files byte-identical;
- mismatches or missing retained files: 0.

The outer container adds no unique bytes, provenance or navigation authority. It is removed; Git history preserves the original object. The other two ZIP files are retained because one includes at least one non-identical document and the Gill package is not unpacked elsewhere as a complete byte-identical owner.

## Prospective protection

A changed-path artifact gate now rejects:

1. exact binary/archive duplicates of another tracked path;
2. whitespace in changed artifact paths;
3. archives without an adjacent identity/provenance/retention sidecar;
4. artifacts larger than 2 MiB without the same sidecar.

The sidecar must bind repository path, SHA-256 and byte size, so a stale manifest fails closed. Regression fixtures cover duplicate rejection, missing archive manifest, a valid exact manifest and whitespace rejection. Historical artifacts are not silently reclassified as CI failures.

## Boundary

This wave reduces the current checkout by 7.69 MB and prevents recurrence. It does not claim to shrink existing Git history, rewrite raw reports, or delete every historical duplicate. Remaining exact copies are accepted historical topology unless a future bounded proof establishes a retained byte-identical owner and no package-level semantic loss.
