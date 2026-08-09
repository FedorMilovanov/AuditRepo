# TLP-HALL-001 — Hall v3 integrity wave authority

Date: 2026-08-09
Product repository: `FedorMilovanov/TheLegendaryPoet`
Audit repository: `FedorMilovanov/AuditRepo`
Architecture lane: `TLP-HALL-001`
Product issue: #369

## Purpose

This package records the bounded engineering-integrity wave completed after the already-audited external-authority handoff (#395/#396). The wave does **not** resolve documentary reproduction rights, does not approve media, does not advance the Pushkin visual gate, and does not authorize production WebGL.

It closes four reproducible workflow/reproof defects while preserving the existing owner/legal/institutional boundary.

## Product #397 — DCC trigger coverage for active Pushkin authorities

Title: `fix(hall): seal DCC trigger coverage for Pushkin authorities`

Root cause: the active Gate-5 rights validator consumed policy/scene/visual/delivery authorities that did not all select the path-scoped Hall Blender reproof.

Repair: add the five missing authorities to Hall DCC PR/`main` filters and bind dual trigger coverage in the existing rights validator. No new validator/workflow/schema/runtime/gate.

Exact tested head: `234817b1d1d020853d38ed73081395680f60be8a`
Resulting Product main: `6255b06632ac738071dbbd2c2fd815289eba40bf`

Certification:
- Project Contracts `31334575997` — success;
- CI `31334575970` — success;
- Hall greybox tooling `31334575951` — success, full Blender/export/browser reproof;
- Site route integrity `31334575940` — success;
- Brand audit `31334576009` — success;
- Manual Browser QA `31334575936` — success.

## Product #398 — source-byte reproof on main pushes

Title: `fix(hall): reprove Pushkin source bytes on main pushes`

Root cause: the dedicated source-byte workflow freshly downloaded/hashed registered originals on PR/manual dispatch but not on `main` push.

Repair: add the same byte-critical path set to `push: main` and bind dual event/path coverage in the existing acquisition validator. Exact URLs/hashes and all rights/runtime blockers remain unchanged.

Exact tested head: `7f13ce4eab923b3b03df31865564eae259a1b1bb`
Resulting Product main: `e6b1bbb013f1feda69158c3d96d0cbded8985de6`

Certification:
- Pushkin source-byte evidence `31335414221` — success, fresh external download/hash revalidation;
- Project Contracts `31335414250` — success;
- CI `31335414222` — success;
- Hall greybox tooling `31335414253` — success;
- Site route integrity `31335414246` — success;
- Brand audit `31335414233` — success;
- Manual Browser QA `31335414218` — success.

## Product #399 — locked DCC toolchain trigger integrity

Title: `fix(hall): reprove DCC on locked toolchain changes`

Root cause: Hall DCC executes repository Node/Playwright composite actions and installs through the lockfile, but changes to `package-lock.json` or either action implementation did not select the Hall DCC reproof.

Repair: add lockfile and both local action paths to PR/`main` filters and bind toolchain trigger coverage in the existing post-material validator.

Exact tested head: `f88f8f12a9b164a3f1fb4137e3d16ba5970f1d9e`
Resulting Product main: `2a79860ec59dbeb489c9c72907c544fe02116979`

Certification:
- Project Contracts `31336321605` — success;
- CI `31336321561` — success;
- Hall greybox tooling `31336321537` — success;
- Site route integrity `31336321611` — success;
- Brand audit `31336321581` — success;
- Manual Browser QA `31336321552` — success.

## Product #400 — isolated source-byte runtime

Title: `fix(hall): isolate source-byte proof from app dependencies`

Root cause: the source-byte probe imports only Node built-ins/native `fetch` and uses system `pdfinfo`, but the workflow ran the repository setup action and unnecessary `npm ci`, coupling byte identity to the whole application package graph.

Repair: direct `actions/setup-node@v4` pinned to Node `24`; no application npm/yarn/pnpm dependency install; existing acquisition validator requires the isolated runtime and forbids the npm-installing repository setup path.

Exact tested head: `e571e51e2530c2798f9e8bf36f42fd0b022eb881`
Resulting Product main: `4e9046640d0f070783e60de41afff3ab3c1cb319`

Certification:
- Pushkin source-byte evidence `31337049726` — success. Exact checkout → isolated Node runtime → system PDF tool → fresh source-byte acquisition/hash → evidence upload; no application dependency install step;
- Project Contracts `31337049757` — success;
- CI `31337049715` — success;
- Hall greybox tooling `31337049730` — success, full 75-step DCC/export/browser reproof;
- Site route integrity `31337049720` — success;
- Brand audit `31337049712` — success;
- Manual Browser QA `31337049713` — success, all four browser jobs including Chromium/Android and fresh-process iPhone Safari.

## Preserved Hall truth

- `pushkinVerticalSlice` remains the only active Hall gate;
- canonical Pushkin rights workflow remains `external-authority-required`;
- `offlineVisualApproval`, `webVerticalSlice`, `fullMuseumScaleOut` remain blocked;
- approved documentary assets: **0**;
- exact acquired-byte hashes: **2**;
- final documentary credits: **0**;
- documentary runtime paths: **0**;
- production manifest allowed: **false**;
- documentary Blender media consumption allowed: **false**;
- production WebGL allowed: **false**;
- `/hall` remains the lightweight placeholder;
- H3/R1/L0/UV0 remain frozen; UV1 remains reserve; current L1 remains rejected.

Verified source-byte hashes remain:
- Kiprensky portrait: `sha256:316d5f366a46f23cd0a181e570f2d09a6b0d12bc368dab18fdb394b8b8b8bf4b`;
- 1833 `Eugene Onegin` PDF: `sha256:d629c10943cbf6428eabb194ee5c17c1b763c27108a2238eaf72fadb275643e5`.

No owner intent, legal opinion, museum permission or Pushkin House institutional submission/fulfilment was fabricated by this wave.

## Current boundary

The engineering-integrity wave is exhausted at the currently reproduced evidence boundary. Do not create another schema/workflow/recheck transaction from the same evidence solely to keep the Hall lane active.

A new Product transaction requires either:
1. explicit owner intended-use/commercial-use/final-credit disposition;
2. qualified legal/institutional disposition resolving the pending reproduction question;
3. actual Pushkin House request/submission/fulfilment or explicit owner choice to proceed without the optional drawing;
4. materially new primary rights evidence; or
5. a newly reproduced engineering defect on then-current Product `main`.

After genuine external documentary authority exists, the next bounded production sequence remains: approve/promote only independently cleared records → author one source/offline Pushkin exhibit in Blender → measure first-slice delivery/performance → produce required offline visual evidence → human offline visual approval before any production WebGL work.

Engineering MASTER is intentionally untouched; the TLP engineering matrix remains zero.
