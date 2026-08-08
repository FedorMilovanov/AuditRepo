# Hall v3 — Camera Approval chain verification

Status: **verified merged production evidence** for `TLP-HALL-001` / Product #369.

This record closes the three bounded camera-stage source waves that occurred after topology selection and before the material/light/export spike. It does not close the Hall lane.

## 1. H3 camera candidate authoring — Product PR #382

- exact tested head: `7637010ef69248fe05ea37c1a1cf9ee8d2a38193`;
- resulting Product `main`: `779719f88e630acda9dfb84520c913aac239fbf4`;
- topology remained frozen at H3;
- R0 = frozen 35 mm benchmark;
- R1 = surviving 28 mm candidate;
- R2 = reproducibly rejected because the viewing ray first hit `HUMAN_PROXY`;
- R3 = surviving 35 mm reserve candidate;
- the other five H3 journey cameras remained parameter-identical across rigs;
- exact Blender camera artifact: `9027136608`, digest `sha256:17af431ffb72bd40b5febd8fa9927699f8c792ecdeea795d3b913b9cd6941c04`;
- Blender `4.5.12 LTS`; H3 layout fingerprint `5d5d0ddd8b150aa64afb73a2a3d9e00c6005e99fc935a6d4707a49ecd475fe65`; mesh geometry fingerprint `b3de770858a423305db8fcab15b405414e66b3d3de93ab1deaa5b3b35b418777`;
- materials/lights remained `0/0`;
- `approvedRig` remained `null` in this evidence-only wave.

## 2. R1 camera decision — Product PR #383

- exact tested head: `8682789cf78e4e717eba5181246700da09de5c11`;
- resulting Product `main`: `07e23ea3feb79fea9d42f29b192e4e3f046713cc`;
- selected guided rig: **R1**;
- reserve: R3;
- rejected: R0 and R2;
- frozen R1 `pushkinViewing`: position `[8.0,2.5,1.60]`, target/destination `[11.15,5.45,1.95]`, lens `28 mm`;
- camera decision remained a separate transaction: topology H3 was not edited, camera coordinates were not rewritten, and later lookdev/export gates remained blocked.

## 3. Camera-gate promotion — Product PR #384

- exact tested head: `f559a06f51483c4ea2a95795a7dad266940ddd70`;
- resulting/current Product `main`: `a873a427c8dda34bd28baa12d8e34fc110f3268c`;
- `cameraApproval: active → completed`;
- `materialLightingExportSpike: blocked → active`;
- H3 topology and R1 camera remain frozen;
- production `/hall` remains a lightweight DOM placeholder;
- later gates remain blocked: Pushkin vertical slice, offline visual approval, web vertical slice and full museum scale-out.

Frozen authorities recorded by the promotion:

- H3 layouts blob `b3def316d855a6539ffd280217ed63e22c6855d9`;
- greybox generator blob `7f5dbe64d61880031819a5d4e855e5c6b7285ef3`;
- camera-rigs blob `8c65312a53dbd41c7ec5f0a6128610e3f5428205`;
- camera generator blob `79f8b396b2fe0ca5fe695b49a70eb013f9c9418f`;
- camera-decision blob `fedf0c0d269822655a9db15b95914222c815769f`.

## Current production authority after this chain

Product `main@a873a427c8dda34bd28baa12d8e34fc110f3268c` is the verified current source witness for the next Hall transaction.

The only active Hall gate is **materialLightingExportSpike**. Its allowed scope is one small representative H3 architectural bay proving PBR color-space ownership, UV/optional lightmap delivery, static-light strategy, raw→optimized glTF validation and browser viability. It may not redesign H3/R1, texture/light the whole Hall, add final Pushkin documentary assets or activate production Three/R3F/WebGL.
