# Cleanup / Retention Policy

AuditRepo must preserve useful evidence without turning history into permanent operational burden.

## Principle

```text
Keep raw evidence.
Promote only useful synthesis.
Do not pretend old evidence is current truth.
Archive completed working material.
Do not synchronize documentation merely because Product HEAD moved.
```

---

## Folder roles

### `incoming/`

- raw reports and artifacts;
- immutable provenance;
- never silently rewritten;
- may be moved into a dated archive package only when paths remain indexed and discoverable.

### `working/`

- temporary verification waves;
- duplicate maps;
- root-cause clustering;
- prioritization drafts;
- should be archived after a wave is completed or superseded.

### `verification/`

- meaningful conflicts and disputed dispositions;
- system-level decisions;
- not required for every ordinary finding.

### `verified/`

- active backlog;
- system themes;
- owner decisions;
- compact closure history;
- one current entrypoint per fact class.

### `reverify/`

- significant current checks selected for work or disposition;
- not a chronological mirror of every Product commit;
- no document is required merely because unrelated `main` moved.

### `archive/`

- resolved working documents;
- superseded syntheses;
- historical verified packages;
- detailed closure evidence no longer needed in the active layer.

---

## Event-driven staleness

A finding becomes a recheck candidate when there is a **material trigger**:

1. its evidence-critical owner changed;
2. a newer browser/build/source witness contradicts it;
3. the route shell or build method relevant to the claim changed;
4. it was selected for repair;
5. a system fix may have absorbed it;
6. the owner is deciding whether to close, park or accept the risk.

The following are not enough by themselves:

- global Product HEAD moved;
- an unrelated PR merged;
- a file received a new blob SHA because of independent content;
- time passed;
- a branch list changed.

Do not open a reverify transaction without a question that the reverify will answer.

---

## Active vs historical truth

Every document must clearly belong to one role:

- **raw evidence**;
- **working synthesis**;
- **active guidance**;
- **historical closure**.

Historical documents may contain accurate statements about their anchors. They must not be presented as automatically current.

A large old audit is a source of hypotheses and causal models, not an obligation to keep every sentence synchronized forever.

---

## Single Writer Per Fact

A volatile fact should have one owner only.

| Fact class | Preferred owner |
|---|---|
| Raw observation | original `incoming/` report |
| Current selected work | project `WORK_QUEUE.md` |
| Active local backlog | project verified matrix/backlog |
| Systemic root themes | project `verified/SYSTEM_THEMES.md` |
| Closure summary | project `verified/CLOSURE_LEDGER.md` |
| Current Product code/deploy/branches | source repository, not AuditRepo |
| Project inventory | root `PROJECT_REGISTRY.md` |

AuditRepo documents may link to Product evidence. They should not duplicate current Product HEAD/deploy facts across README, matrix, registry, handoff and reverify files.

---

## Matrix transition

Some existing projects contain a monolithic matrix with both hundreds of closed rows and active findings. Do not perform risky bulk rewrites merely to satisfy the new shape.

Transition gradually:

1. freeze verbose growth of the closed section;
2. create/use a compact closure ledger for new waves;
3. move completed clusters in batches during dedicated consolidation waves;
4. keep immutable links to original evidence;
5. generate counters where possible instead of copying them manually.

Until a project completes migration, its `DOC_MAP.md` must state which legacy file still owns historical rows.

---

## Cleanup cadence

### After a verification/repair wave

- archive superseded working synthesis;
- update active backlog only for material dispositions;
- append a compact wave result;
- update `WORK_QUEUE.md` only if owner-selected priorities changed.

### Periodically or manually

- run full matrix/evidence coverage;
- run branch/closed-PR forensic;
- detect broken links and orphan evidence;
- archive stale control-plane documents;
- review whether system themes still help prioritization.

These deep checks are not required on every ordinary PR.

---

## Closed material

A closed finding should retain enough provenance to answer:

- what was observed;
- what disposition was chosen;
- what Product PR/system measure addressed it;
- what regression witness protects the result;
- whether live evidence was or was not required.

It does not need to repeat every workflow run, every later blob SHA and every subsequent unrelated HEAD.

---

## Archive buckets

Suggested buckets:

- `archive/closed/` — real findings addressed or absorbed;
- `archive/stale/` — no longer applicable formulations;
- `archive/invalid/` — false positives, wrong build, audit drift;
- `archive/superseded/` — old syntheses replaced by a better one;
- `archive/accepted-risk/` — known issues intentionally not repaired.

Exact folder names may vary by project; the disposition must remain discoverable.

---

## Never do this

- never silently delete raw evidence;
- never rewrite another agent’s intake;
- never mark a disputed claim invalid without recording the decisive evidence;
- never keep several documents claiming to be the same current authority;
- never make every Product merge trigger a documentation sync;
- never create temporary write-capable CI merely to edit Markdown;
- never require deep branch forensic for unrelated content changes;
- never keep verbose closure data in the active backlog just to preserve history.

---

## Success condition

AuditRepo is healthy when:

- it can absorb many new audit passes cheaply;
- useful evidence remains findable;
- active guidance is short enough to understand;
- old material does not masquerade as current truth;
- verification can be deep when needed and light when obvious;
- the repository helps Product work instead of becoming a second Product to maintain.
