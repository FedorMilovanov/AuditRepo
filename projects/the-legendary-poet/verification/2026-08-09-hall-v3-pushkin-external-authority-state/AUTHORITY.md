# Hall v3 — Pushkin external-authority machine-state verification

Status: **verified merged Product state-machine repair** for `TLP-HALL-001` / Product #369.

This checkpoint follows `verification/2026-08-09-hall-v3-pushkin-rights-boundary/AUTHORITY.md`. It does not add new rights evidence or approve any documentary asset. It verifies that Product machine state now faithfully encodes the already-established external owner/legal/institutional boundary.

## Product transaction

- Product PR: **#395 — `fix(hall): seal Pushkin external-authority handoff`**.
- Base Product main: `dcbc7f07392075ddbf7d0bf784b0a38dbb556632` from #394.
- Exact tested PR head: `402ea400c96bfdd094ada3dbd71de2415461644b`.
- Resulting Product main: `a9dab5be4a616178f553a2bb967ef327a26f0a76`.
- Final diff: four existing Hall authority/validator files; zero `src/`, zero `public/`, zero media, zero production runtime assets.

## Reproduced defect

After Product #394, additive `pushkin-rights-review.json` correctly said autonomous byte acquisition and rights research were complete and that the next material authority must be owner/legal/institutional. Canonical machine state still contained three stale signals:

1. `pushkin-rights.json` top-level workflow status remained `acquisition-in-progress`;
2. `pushkin-slice.json.nextAllowedWork` still included `acquire-exact-source-files-and-hashes`, despite two exact SHA-256 identities already having been independently proven;
3. final `pushkin-rights-review.json` was not registered in `hall-v3-contract.json.sourceAuthority`.

That disagreement could send a future owner agent back into a completed acquisition/research loop while AuditRepo already prohibited such a transaction.

## Verified repair

Product #395:

- registers `docs/hall-v3/pushkin-rights-review.json` as current Hall source authority;
- changes only the registry-level workflow status to fail-closed `external-authority-required`;
- replaces stale acquisition next-work with explicit owner/legal/institutional disposition before documentary approval/offline authoring;
- extends the existing `validate-hall-pushkin-rights.ts` validator instead of creating another parallel schema or authority layer;
- binds the final review to the exact two source hashes, current rights-pending dispositions, Pushkin House `not-submitted` institutional dependency, and blocked production/runtime gates.

No asset was promoted to `approved`. No final credit, runtime path, Blender documentary consumption, production manifest or Three/R3F/WebGL authority was added.

## Exact-head verification

All applicable exact-head workflows were terminal on `402ea400c96bfdd094ada3dbd71de2415461644b` before merge:

- Project Contracts run `31332268467` — **success**;
- CI run `31332268510` — **success**, including typecheck, production build, route/asset budgets, prerender and SEO;
- Hall greybox tooling run `31332268460` — **success**, including pinned Blender 4.5.12, frozen H1/H2/H3 regeneration, R1 camera evidence, representative material/light bay, explicit tangents, Khronos raw validation, preservation-safe `gltfpack`, Khronos optimized validation and Chromium material witness;
- Pushkin source-byte evidence run `31332268491` — **success**, independently reacquiring/revalidating registered exact source-byte identities;
- Site route integrity run `31332268505` — **success**;
- Brand deep reference and motion audit run `31332268489` — **success**;
- Manual Browser QA run `31332268439` — **success** across core Chromium/Android, fresh-process base iPhone Safari, critical/reduced-motion iPhone Safari, premium desktop pointer/performance and WebKit home/route contours;
- Pages request — expected **skipped**.

PR review surface at the final head had zero submitted reviews and zero review threads. Final Product race preflight showed main unchanged at `dcbc7f07392075ddbf7d0bf784b0a38dbb556632`, PR #395 as the only open Product PR, branch `behind=0`, and the four-file diff unchanged before expected-head-protected merge.

## Preserved Hall authority

The repair does not alter the Hall art/runtime decisions:

- H3 topology and frozen layout/mesh fingerprints remain authority;
- R1 guided camera remains authority;
- L0 minimal-runtime lighting remains the selected baseline;
- UV0 remains selected at `1.5 m / UV unit`, UV1 remains optional reserve;
- current L1 bake remains rejected;
- `pushkinVerticalSlice` remains the only active Hall gate;
- `offlineVisualApproval`, `webVerticalSlice` and `fullMuseumScaleOut` remain blocked;
- production `/hall` remains a lightweight placeholder; production Three/R3F/WebGL remains blocked.

## Documentary state after repair

Totals remain unchanged:

- approved documentary assets: **0**;
- exact acquired-byte hashes: **2**;
- final credits: **0**;
- documentary runtime paths: **0**;
- production manifest allowed: **false**;
- documentary Blender media consumption allowed: **false**;
- production WebGL allowed: **false**.

Kiprensky remains `rights-pending` with review disposition `human-legal-owner-decision-required`. The 1833 Onegin PDF remains `rights-pending` with `copyright-evidence-strong-owner-production-disposition-required`. Pushkin House `Ф. 244, оп. 12, ед. хр. 6` remains source-verified with institutional request status `not-submitted`. The weak mirror remains blocked negative control.

## Queue disposition

**No new autonomous Product transaction is selected by this checkpoint.**

The next legitimate material Product input still requires at least one real external fact: owner intended-use/credit disposition, qualified legal/institutional disposition where required, a real Pushkin House request/result or explicit owner decision to proceed without that optional documentary drawing, or materially new primary evidence.

Once such authority exists, the machine-advertised sequence may proceed through approved documentary records → one source/offline Pushkin Blender exhibit → measured first-slice delivery/performance → required offline visual evidence. Later Hall gates remain separately evidence-gated.

Engineering MASTER remains untouched; this architecture/state-authority correction is not promoted into an engineering bug row.
