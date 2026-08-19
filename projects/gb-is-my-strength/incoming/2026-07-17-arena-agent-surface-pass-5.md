# Agent Audit Report — Surface Pass 5: Series order mismatch, Ancestor tracing logic, Golden path efficiency, Hardcoded author logic

## Meta

- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: Arena Agent (arena.ai)
- Date: 2026-07-17
- Audited branch/ref: main
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Signal class: Product
- Proof state: FAIL (confirmed defects)
- Claim boundary: HEAD SHA 485db8c

---

## 1. `SERIES-ORDER-INDEX-MISMATCH` — Part 4 before Part 3 in John Gill series

- Kind: **defect**
- Suggested impact: low (ordering only)
- Route(s) / owner(s): `src/data/site.ts`
- Observed on anchor: 485db8c

**Evidence:**

`site.ts` L44-51:
```typescript
  'dzhon-gill': [
    'dzhon-gill-istoricheskiy-kontekst',
    'dzhon-gill-chast-1-chelovek',
    'dzhon-gill-chast-2-uchenyi',
    'dzhon-gill-chast-4-ekzeget',
    'dzhon-gill-chast-3-nasledie',
    'dzhon-gill-spravochnik',
  ],
```
The list for `dzhon-gill` series places `chast-4-ekzeget` (Part 4) before `chast-3-nasledie` (Part 3). This causes incorrect ordering in navigation (Prev/Next buttons) and series lists.

- Fix: Swap the two entries.

---

## 2. `ANCESTOR-TRACING-INCOMPLETE` — `computeFocusLineage` misses ancestors in multi-parent scenarios

- Kind: **defect**
- Suggested impact: medium
- Route(s) / owner(s): `src/components/genealogy/layout.ts`
- Observed on anchor: 485db8c

**Evidence:**

`layout.ts` L53-58:
```typescript
  let cur: Person | undefined = target;
  const upGuard = new Set<string>();
  while (cur && !upGuard.has(cur.id)) {
    result.add(cur.id);
    upGuard.add(cur.id);
    if (cur.id === 'jesus' && cur.mother) cur = byId.get(cur.mother);
    else cur = cur.father ? byId.get(cur.father) : (cur.mother ? byId.get(cur.mother) : undefined);
  }
```
The ancestor tracing logic uses a single-pointer `while` loop that only follows one parent branch (preferring father, except for Jesus where it follows mother). 
1. For most people, it ignores the mother's entire ancestral line.
2. For Jesus, it ignores the father's (Joseph's) line entirely (which is important for the legal messianic claim in Matthew).
3. "Focus Lineage" for a node should ideally include the full ancestral tree above it.

- Fix: Use a queue-based or recursive traversal (BFS/DFS) to include both `father` and `mother` branches for all nodes.

---

## 3. `TRACE-GOLDEN-PATH-INEFFICIENT` — $O(N^2)$ traversal in `traceGoldenPath`

- Kind: **technical-debt** / **performance-risk**
- Suggested impact: low-medium (depending on person count)
- Route(s) / owner(s): `src/components/genealogy/layout.ts`
- Observed on anchor: 485db8c

**Evidence:**

`layout.ts` L29-33:
```typescript
  while (cur && !guard.has(cur.id)) {
    path.add(cur.id); guard.add(cur.id);
    if (cur.id === 'jesus' && cur.mother) cur = persons.find(p => p.id === cur!.mother);
    else cur = cur.father ? persons.find(p => p.id === cur!.father!) : undefined;
  }
```
`traceGoldenPath` iterates through the messianic line and calls `persons.find()` for every step. If `persons` array grows large (e.g., thousands of biblical names), this becomes significantly slower than using a `Map`.

- Fix: Build an `id -> Person` map at the start of the function, similar to how `computeFocusLineage` does.

---

## 4. `ARTICLE-AUTHOR-HARDCODED` — Translation logic limited to a single author

- Kind: **defect** / **design-flaw**
- Suggested impact: low
- Route(s) / owner(s): `src/layouts/ArticleLayout.astro`
- Observed on anchor: 485db8c

**Evidence:**

`ArticleLayout.astro` L24:
```typescript
const isTranslation = data.author === 'abner-chou';
```
The logic for determining if an article is a translation and setting the author/role is hardcoded to the string `'abner-chou'`. This will fail to correctly attribute translations by any other author in the future.

- Fix: Move translation status or translator identity to MDX frontmatter (e.g., `translator: '...'`) and use that to determine the role/labels.

---

## 5. Verification of Pass 4 Findings

- `RODOSLOVIYE-OG-IMAGE`: **CONFIRMED**. `RodosloviyePageHead.astro` incorrectly uses `og-karty-1200x630.webp`.
- `ArticleLayout` seriesNames: **CONFIRMED**. `genesis-6` is missing from hardcoded `seriesNames` map in `ArticleLayout.astro`.
- `GenealogyTree` ErrorBoundary: **CONFIRMED**. No `ErrorBoundary` in `GenealogyTree.tsx`.
