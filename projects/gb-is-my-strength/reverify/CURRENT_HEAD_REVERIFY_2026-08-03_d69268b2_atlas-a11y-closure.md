# CURRENT HEAD REVERIFY — Atlas accessibility closure

- Date: 2026-08-03
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source PR: #759
- Exact verified PR head: `33a2380d6748da26d64eb33d84ff7e588fd6e508`
- Source/main merge: `d69268b27bb83fe8741159da59f9c1b038d7d9b9`
- Last exact production authority: `abf1edba190280e554dfda085bef9fb6594c896d`
- Production claim: **none**

## Dispositions

### `A11Y-P1-01` — FIXED-CURRENT

The historical two-H1 intro defect is repaired. The page retains one semantic page H1 while the visual intro title is H2. Bounded Chromium lifecycle sampling run `30771541994` recorded `maxH1CountDuringIntro=1`; artifact `8840711226`, digest `sha256:bc92b51ebc665585b222bcb56d2298ba2523e7ae16d629f8b694ef0519f95fdc`.

### `AVRAAM-P1-04` — FIXED-CURRENT

The narrowed residual is repaired: the dossier tabs implement `tablist`, `tab` and `tabpanel` semantics, `aria-selected`, roving `tabindex`, local Enter/Space activation and Arrow/Home/End focus navigation. The bounded accessibility witness passed the ARIA pattern, roving focus, Enter, Space, numeric shortcut and ArrowRight without activating the global tour. Final exact-head Map Keyboard run `30779633059` passed.

## Final exact-head evidence

All required workflows on `33a2380d6748da26d64eb33d84ff7e588fd6e508` succeeded. The load-bearing browser artifacts are:

- Avraam Dossier run `30779633089`, artifact `8843269226`, digest `sha256:9a8cb1b2ce8fe3ae11c288228537bbafdfa1a8da060897eaebc885696cdb1cae`: `304/304`, failures `0`, warnings `0`, console/page errors `0`, failed requests `0`.
- Avraam Reference Baseline run `30779633071`, artifact `8843277612`, digest `sha256:166d138b85be90622004c987e4b5ec257473734bfdef30aac99dd365819d0b93`: seven viewports, verification failures `0`, offscreen labels `0`, label overlaps `0`, undersized controls `0`, offscreen fixed controls `0`, console errors `0`, failed requests `0`.
- Map Keyboard run `30779633059`: success.
- Overlay Runtime Browser run `30779633127`: success across Chromium, Firefox and WebKit.
- Static Projection run `30779633119`, Shared Files `30779633079`, Node Toolchain `30779633065`, Native Source `30779633063`, Visual Parity `30779633074` and Pihahiroth `30779633053`: success.

## Canonical arithmetic

- Canonical IDs: **358**
- Closed: **187 → 189**
- Open: **171 → 169**
- P1: **83 → 81**
- P0: 0
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 189 + 169`. No adjacent finding is silently closed by this wave.

## Boundary

This document records source and browser finding disposition only. It does not establish deployment, live convergence or production authority; the last exact production authority remains `abf1edba190280e554dfda085bef9fb6594c896d`.
