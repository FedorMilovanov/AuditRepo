# Cleanup / Retention Policy

AuditRepo must not become a junk drawer. It should preserve evidence **without letting stale material pretend to be current truth**.

---

## 1. Principle

```text
Keep raw evidence.
Promote only verified truth.
Downgrade stale truth before deleting anything.
Archive, do not silently erase.
```

---

## 2. Folder roles in cleanup terms

### `incoming/`
- raw evidence
- never rewritten as final truth
- should not be deleted just because a later synthesis exists
- can be archived if superseded and safely indexed elsewhere

### `working/`
- temporary synthesis layer
- can become noisy fastest
- should be periodically pruned into:
  - `verified/` (if canonical)
  - `archive/stale/` (if superseded)

### `verification/`
- dispute-resolution layer
- keep while there are active contradictions
- once contradictions are resolved, older dispute docs can move to `archive/stale/`

### `verified/`
- only current canonical handoff docs
- if a new ledger supersedes an old one, the old one should move to `archive/stale/` or `archive/fixed/`, not sit beside the canonical one forever without a note

### `repairs/`
- implementation tracking
- after fixes are reverified, old repair plans can move to `archive/fixed/`

### `reverify/`
- truth against current source HEAD
- this folder is what prevents `verified/` from silently going stale

---

## 3. Anti-clutter rules

## 3.1 One canonical entrypoint per layer

Every active project should have:
- `working/START_HERE_<date>.md`
- `verification/START_HERE_<date>.md`
- `verified/START_HERE_<date>.md`

These entrypoints should say:
- what is canonical,
- what is supporting,
- what is historical only.

## 3.2 Old docs are not deleted first; they are demoted first

Before removing a claim from active use, do this sequence:

```text
confirmed-current
→ suspected-stale
→ reverified
→ fixed-current / false-positive / stale-on-current-head
→ archive
```

## 3.3 `verified/` should not accumulate parallel truths forever

If there are multiple ledgers in `verified/`, one of them must be named or declared as the current canonical handoff.

If not, the verifier should create/update:
- `verified/START_HERE_<date>.md`
- `working/CANONICAL_DOC_STATUS_<date>.md`

## 3.4 `working/` should not become a graveyard

Working docs are useful while synthesis is active. Once a document is:
- fully superseded,
- merged into a canonical matrix,
- or disproven by reverify,

it should move to:
- `archive/stale/` or
- `archive/false-positive/`

with a short index note.

---

## 4. Staleness rules

A verified bug becomes a **stale candidate** when any of the following is true:

1. source repo HEAD moved significantly after the bug was verified;
2. another verifier reports contradictory evidence on newer SHA;
3. build method changed (e.g. source-only finding vs production-like artifact finding);
4. route shell changed and old audit assumptions no longer map 1:1 to live UI.

When this happens, do **not** delete the bug. Mark it:

```text
suspected-stale
```

and open a reverify document.

---

## 5. Archive buckets

### `archive/fixed/`
Use when:
- bug was once real,
- later reverified as fixed-current,
- useful to retain historical trail.

### `archive/stale/`
Use when:
- document is superseded,
- not false, but no longer canonical,
- or tied to old SHA / old route shell / old artifact.

### `archive/false-positive/`
Use when:
- claim was carefully rechecked,
- and determined to be false, misleading, or audit/tool drift.

---

## 6. Minimum cleanup cadence

For active projects with many agents:
- after every major intake wave,
- after every major verified ledger update,
- after every big source-repo repair wave.

Recommended output:
- one `reverify/` doc per meaningful source HEAD change,
- one update to `START_HERE` / canonical status,
- one archive move if older docs are clearly superseded.

---

## 7. Never do this

- never silently delete raw incoming evidence
- never overwrite another agent’s intake folder to “clean it up”
- never mark a bug false-positive without explicit recheck record
- never leave multiple verified ledgers without naming which one is canonical
