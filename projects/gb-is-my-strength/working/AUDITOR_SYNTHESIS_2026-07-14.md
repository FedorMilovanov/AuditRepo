# AUDITOR SYNTHESIS — gb-is-my-strength
**Date:** 2026-07-14
**Auditor:** Arena-Agent-Auditor
**Status:** Preliminary Synthesis / Project Health-Check
**Scope:** AuditRepo governance + gb-is-my-strength strategic state

---

## 1. Executive Summary

The project is currently in a critical transition phase. While the "base" site is stable (Prod Deploy GREEN), the focus has shifted from "rapid lane-based bug fixing" to "high-fidelity architectural redesign" for its premium visual sections (Karty/Atlas and Rodosloviye/Genealogy). 

The core risk is **Architectural Drift**: the gap between the current "prototype" implementation (React Flow, inline CSS, runtime layout) and the "Atlas-grade" vision (Semantic Zoom, build-time layout, vanilla SVG, scoped CSS).

---

## 2. Governance & Process Audit

### 2.1. Single-Writer-Per-Fact (SWPF)
**Status:** ✅ Compliant (Enforced)
The introduction of `DOC_MAP.md` has successfully centralized the "Truth" (HEAD in `NEXT_AGENT_PROMPT.md`, Bugs in `MASTER_BUG_MATRIX.md`). I observed no duplication of volatile facts in the root README or Registry.

### 2.2. Verification Ladder
**Status:** ⚠️ Partially Compliant
The `MULTI_WITNESS_VERIFICATION_PROTOCOL.md` is clear, but some findings in `incoming/` (e.g., visual bugs in Karty v3) are floating without explicit witness labels (`verified-source`, `verified-browser`). 
**Audit Note:** The project correctly avoids "one-agent-claims" for canonical status, but the gap between `raw` (L0) and `confirmed-current` (L3) is currently wide due to the architectural pivot.

### 2.3. Multi-witness Efficiency
**Status:** ✅ High
The use of different witness angles (Source $\rightarrow$ Artifact $\rightarrow$ Browser) is well-documented in the `SUPER_AUDIT` and `KARTY` strategy.

---

## 3. Project State: `gb-is-my-strength`

### 3.1. Vital Signs
- **Source HEAD:** `b8459bdf`
- **Deploy:** ✅ GREEN (`29065454930`)
- **P0/P1 Open:** 2 bugs (Perf-leak, TTS-Consent).
- **S-Audit:** The project has moved from a "Wave" (W1-W10) model to a "Phase" model for its premium components.

### 3.2. The "Atlas-Grade" Pivot
Analysis of `incoming/arena-agent-karty-strategy` and `incoming/claude-genealogy-atlas-strategy` reveals a unified strategic shift:
- **LOD (Level of Detail) Requirement:** The target scale (~3k nodes) makes full SVG rendering impossible. Semantic Zoom (L0 $\rightarrow$ L1 $\rightarrow$ L2) is the only viable path.
- **Engine Replacement:** The current React Flow $\rightarrow$ dagre runtime chain is identified as a bottleneck. The recommended path is a custom `GenealogyEngine` / `MapEngine` using vanilla TypeScript and build-time precomputed layouts.
- **Doctrine:** "Ideal before Fast". This is a high-risk, high-reward strategy that requires a "Freeze" on prototype development to avoid wasting effort on "fixed" v1 bugs.

---

## 4. Cross-Cutting Technical Debt (The "S-Class" Bugs)

I have identified several patterns of debt that span multiple modules:

### 4.1. Visual/Styling Debt (`S-A5` / `D-4`)
- **Inline CSS-in-JS:** Widespread use of `style={{...}}` in `PersonNode.tsx`, `GenealogyTree.tsx`, and `avraam-app.js`. This violates the project's theming contract (`html.dark`) and increases bundle size.
- **Z-Index Chaos (`D-4`):** Magic numbers (e.g., `2147483100`) are used in `floating-cluster.css`. Despite tokens existing, they are ignored.

### 4.2. Tooling Gaps (`S-T-01`)
- **Root-Only Scanning:** `audit-pro.js`, `seo-audit.js`, and `validate.js` predominantly scan root HTML files. Astro-only pages (like `/izbrannoe/` and the new `/rodosloviye/`) are effectively "invisible" to these tools, creating a blind spot for canonical/SEO/a11y audits.

### 4.3. Discoverability (`GEN-ORPHAN-01`)
- The `/rodosloviye/` route is technically "production-ready" but is an **orphan** (0 incoming links). This is a P2 discoverability bug.

---

## 5. Audit of `incoming/` Intakes

### 5.1. Karty v3 Deep Audit
- **Findings:** 8 new ground-truth visual bugs (VB-NEW-001..008), including timeline inconsistencies.
- **Auditor's Verdict:** These are **prototype-level defects**. In the context of the "Atlas Strategy", they should be recorded as "Baseline v1" rather than "Bugs to be fixed in v1". Fixing them now would be a violation of the "Engine Redesign" priority.

### 5.2. Genealogy Strategy
- **Findings:** Core architectural mismatch identified (LOD vs Full Render).
- **Auditor's Verdict:** High-quality strategic analysis. The proposed 6-phase plan is sound and aligns with the `KARTY` precedent.

---

## 6. Auditor's Recommendations

### 6.1. Immediate (P2)
- **Update Matrix:** Add `GEN-ORPHAN-01` (Orphaned Route) to `MASTER_BUG_MATRIX.md` as a P2. This is a simple fix (link from Hub/Home) and doesn't depend on the engine.

### 6.2. Short-Term (Strategic)
- **Unified "Atlas" Manifesto:** Merge the `KARTY` and `GENEALOGY` strategies into a single `projects/gb-is-my-strength/docs/ATLAS-STRATEGY.md`. This prevents fragmented "S-Class" decisions.
- **Tooling Hardening:** Fix `S-T-01` (Root-only scanning) by updating `walk()` logic to include `dist/` or use `sitemap.xml` as the entry point. This is the most urgent "Meta-Bug" in the audit process.

### 6.3. Long-Term (Architectural)
- **Phase-Gate Enforcement:** Ensure that no "v1" visual fixes are merged into `main` until the "Engine Contract" (Phase 2) is signed.
- **Data-First Implementation:** Prioritize the `S-T-01` data-pipeline (TIPNR $\rightarrow$ v2 JSON) before any UI work in `lane/genealogy-*`.

---

**Signature:** `Arena-Agent-Auditor`
**Reference:** `AuditRepo` $\rightarrow$ `gb-is-my-strength` $\rightarrow$ `S-Analysis-2026-07-14`
