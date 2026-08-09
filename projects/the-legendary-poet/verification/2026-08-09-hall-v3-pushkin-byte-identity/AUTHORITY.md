# Hall v3 — Pushkin source-byte identity verification

Status: **verified merged Product source-byte identity wave** for `TLP-HALL-001` / Product #369.

This checkpoint follows `verification/2026-08-09-hall-v3-pushkin-acquisition-routes/AUTHORITY.md`. It verifies the bounded actual-byte acquisition/hash transaction only. It does **not** approve reproduction rights, authorize documentary media for the Hall manifest, assign runtime paths, start the documentary Blender exhibit, activate production WebGL, or advance any later Hall gate.

## Product transaction

- Product PR: **#393 — `architecture(hall): prove Pushkin source-byte identities`**;
- final exact tested head: `04d556fec4dac1510c0e6cd4ef90f1aaad0bfcc5`;
- resulting Product `main`: `68afe7f7bb2438b2bb87d7b93817b9450d22cf2f`;
- base Product authority: `01572b3485d9b6c9a9e371b0eeddf22265741261` from merged #392.

Final scope was **9 governance/docs/validator/QA-workflow files** with:

- zero `src/` changes;
- zero `public/` changes;
- zero documentary media committed;
- zero Hall runtime asset paths added;
- zero approved documentary records;
- zero production Three/R3F/WebGL activation.

## Two-stage actual-byte proof

Initial evidence head `be1d38a80d26a5ad0116ad1d1ec43540b803d795` added an isolated source-byte probe/workflow. GitHub Actions downloaded the two already-registered Wikimedia Commons originals into ephemeral runner storage, verified actual file identity, computed SHA-256 from those bytes and retained only a small JSON evidence artifact.

Observed identities:

### Kiprensky 1827 portrait

- asset ID: `pushkin-kiprensky-1827-portrait`;
- detected type: `image/jpeg`;
- dimensions: `3455 × 4000`;
- byte count: `10,862,180`;
- SHA-256: `sha256:316d5f366a46f23cd0a181e570f2d09a6b0d12bc368dab18fdb394b8b8b8bf4b`.

### `Eugene Onegin`, 1833 edition

- asset ID: `pushkin-onegin-1833-edition`;
- detected type: `application/pdf`;
- pages: `324`;
- byte count: `5,433,794`;
- SHA-256: `sha256:d629c10943cbf6428eabb194ee5c17c1b763c27108a2238eaf72fadb275643e5`.

The canonical acquisition/rights records then registered only those evidence-backed identities. Final exact head `04d556fec4dac1510c0e6cd4ef90f1aaad0bfcc5` independently downloaded both originals again and succeeded with `recordedSourceFileHash == freshly acquired SHA-256` for both files.

The final artifact explicitly reported `sourceFilesCommitted=false`.

## Exact-head certification

Final head `04d556fec4dac1510c0e6cd4ef90f1aaad0bfcc5` passed:

- dedicated Pushkin source-byte evidence workflow with independent re-download/hash comparison;
- Project Contracts;
- full CI including typecheck/build/budgets/prerender/SEO;
- Hall rights/source semantic validator;
- canonical `RIGHTS_REGISTER` record-shape validator;
- acquisition authority validator;
- full Hall Blender 4.5.12 LTS H1/H2/H3 and R0/R1/R2/R3 regeneration;
- representative H3 material bay regeneration;
- raw and optimized Khronos validation;
- preservation-safe `gltfpack@1.2.0` transport;
- selected/rejected material browser evidence;
- route integrity audit;
- Chromium/Android Chrome/iPhone Safari/premium-home/WebKit browser QA;
- brand deep-reference/motion audit.

Pages deployment was skipped as expected for the PR.

## Current documentary disposition

### Hashed Commons reproductions

Both the Kiprensky portrait and 1833 `Eugene Onegin` records now have exact source-byte identity, but both remain:

- `rightsStatus=rights-pending`;
- `verificationStatus=rights-pending`;
- `creditLine=null`;
- `runtimeAssetPath=null`;
- `productionManifestEligible=false`.

Successful acquisition/hash is **not** publication approval.

### Pushkin House manuscript candidate

`pushkin-house-onegin-self-portrait-1824` remains:

- object provenance: `source-verified`;
- archive cipher: `Ф. 244, оп. 12, ед. хр. 6`;
- acquisition: `institutional-copy-request-required`;
- request status: `not-submitted`;
- source hash/runtime path: unset;
- rights/intended-use: pending;
- production eligible: false.

This remains a genuine human/institutional dependency. An agent may preserve the blocker and exact archival identity but may not fabricate request submission, fulfilment or permission.

### Weak mirror

`pushkin-onegin-autograph-weak-mirror` remains blocked / do-not-acquire negative-control evidence.

## Current totals

- approved documentary assets: **0**;
- exact acquired-byte hashes: **2**;
- production manifest allowed: **false**;
- documentary Blender media consumption allowed: **false**;
- production WebGL allowed: **false**.

## Next bounded question

The autonomous byte-acquisition blocker is closed. The next owner-selected question is:

> For the two exact hashed Commons reproductions, can final credit and intended-use/reproduction-rights disposition be independently established strongly enough to satisfy the canonical `approved` contract, or does either record require a real human/legal/institutional decision that must remain external?

Required discipline:

1. Keep object provenance, exact byte identity and reproduction/intended-use rights as separate evidence layers.
2. Re-evaluate rights only for the exact hashed reproductions now fixed by SHA-256.
3. Resolve a final credit line only if supported for that exact reproduction/source chain.
4. Do not infer global/commercial approval merely from public-domain age, Commons availability or metadata badges.
5. Record jurisdiction/institution-specific uncertainty explicitly.
6. Promote to `approved` only if the full canonical rights contract is genuinely satisfied.
7. If a human/legal/institutional decision is still required, stop at that boundary rather than manufacturing approval.
8. Do not begin documentary Blender media consumption, production WebGL or later Hall gates before approved records exist.
