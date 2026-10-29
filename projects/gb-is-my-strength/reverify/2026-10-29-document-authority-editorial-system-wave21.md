# Document authority and editorial system audit — broad wave 21

**Date:** 2026-10-29  
**Product anchor:** `54877be73a590b1e29f4d701724b39ed41c17e14` (`main`)  
**Active adjacent owner:** draft Product PR #2217, head observed as `ffdd9b236fd7dde38819691422c1d451e666ac5e`  
**Mutation boundary:** evidence-only; Product and the active owner were not changed.

## Scope and method

Read the operational root/router, machine document registry, current normative governance, all three editorial authorities and the delegated-looking series author guide. Compared their authority orders, entry paths, promised checks and executable Product surface.

Current documentation scale is 265 Markdown files / 52,204 lines under `docs/`. The machine registry narrows this to 19 current repository-wide documents: 14 normative, four supporting and one informational. The normal article/editorial core alone is 801 lines (`ARTICLE-STANDARD-CHARTER`, `EDITORIAL-SOURCE-POLICY`, `CONTENT-QUALITY-STANDARD`); root/router/work-mode/owner/document-authority add another 724 lines.

## What is already strong

1. `AGENTS.md` is genuinely compact relative to the repository, tells agents not to reread history, routes by surface and requires collision checks.
2. `data/document-authority.json` gives lifecycle and authority machine ownership instead of trusting filenames. The control-plane consumes `required:true`; historical snapshots cannot silently become current policy.
3. `WORK_MODES` makes verification proportional. FAST/LANE/SYSTEM is materially better than a universal ceremony.
4. Editorial responsibilities are meaningfully separated: publication eligibility, research/evidence closure and reader-facing quality are not conflated.
5. Source policy rejects plausible fabrication, requires claim-level support and distinguishes a source being real from it supporting the claim.
6. The 54-point charter has high editorial ambition: argument, exegesis, counterarguments, quotations, Russian reader language, metadata and accessibility are treated as publication concerns rather than decoration.
7. Owner-sensitive data/UI and exact-head evidence are protected. These are premium controls, not bureaucracy for its own sake.

## Finding A — repository authority order contradicts itself

Three current normative entrypoints give materially different precedence:

| Document | Relevant order after direct owner instruction |
|---|---|
| `AGENTS.md` §1 | current `main` / open PRs / exact heads → source-of-truth files → `OWNER-INVARIANTS` |
| `DOCUMENT_AUTHORITY.md` Rule | Product tree / open PRs / exact-head evidence → machine/source owners → normative docs |
| `OWNER-INVARIANTS.md` §1 | `OWNER-INVARIANTS` + normative `AGENTS` → current `main` / open PRs / CI → modes/source registries |
| `WORK_MODES.md` §1 | relevant open issues/PRs → main/exact heads/CI → source-of-truth files → history |

This is not stylistic duplication. If shipped source disagrees with an owner invariant, `AGENTS`/document authority say source precedes the invariant, while `OWNER-INVARIANTS` says the opposite. An agent can obey one current normative document and violate another. Existing machine authority validation verifies lifecycle and some stale phrases, not cross-document order equivalence.

**Disposition:** admit one narrow system lane, `SYS-DOCUMENT-AUTHORITY-ORDER-CONTRADICTION`. It needs an owner-approved canonical order represented once or mechanically checked; it does not justify a broad governance rewrite.

## Finding B — article authoring guidance is not an authoritative atomic path

`docs/SERIES-ENGINE-GUIDE.md` opens with “Для агентов, пишущих статьи”, asks for a complete read and ends with “всё зелёное = сдавай”. Yet:

- it is absent from `data/document-authority.json`;
- `AGENTS-REFERENCE.md` does not explicitly delegate a series/article-authoring surface to it;
- under `DOCUMENT_AUTHORITY`, it is therefore only `surface-local-non-overriding` without a demonstrated current delegation;
- its checklist names series config, route, `data/series.json`, editorial metadata and engine gates, but not the complete route profile / page ownership / search manifest / sitemap / RSS / scripture index / current discovery transaction exercised by PR #2217;
- it claims that config/registry drift will be caught, while existing controlled probes already show a config-only item can pass full static publication validation and create dangling routes.

The guide is useful and concise, but it currently looks more authoritative and complete than its actual lifecycle and executable boundary. This directly extends the existing `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`; no duplicate row is needed.

## Premium/usability verdict

The policy content is high-level and mostly premium. The main weakness is not “too few rules” but the handoff from good policy to a safe author transaction:

- 54 editorial standards are suitable as a reference and review rubric, not as working memory;
- the repository correctly tells agents to route narrowly, but does not provide one current authoritative publication entrypoint that resolves the applicable subset and performs all writes/checks atomically;
- adding another prose checklist would worsen the problem. The durable improvement is a typed manifest/scaffold plus one check/write transaction, while retaining the deeper policies as reference.

## Root-cause allocation

| Factor | Assessment |
|---|---|
| Weak-agent negligence | Real when an agent ignores explicit gates, but insufficient as the primary explanation. |
| Unclear rules | Proven for authority precedence and the lifecycle of the series guide. |
| Redundant rules | Authority order is repeated four times and has drifted semantically. |
| Missing scaffolding | Proven by the orphan-MDX/config-only probes and live PR #2217 sequence. |
| Weak gates | Gates catch many defects, but late and individually; they do not enforce one atomic publication transaction. |
| Split ownership | Proven across authored MDX, route, typed config and many generated/discovery registries. |

## Closure boundaries

1. Canonicalize authority precedence once and fail a deliberate cross-document permutation fixture.
2. Explicitly register/delegate or retire the apparent article/series guide; do not leave its authority inferential.
3. Close article publication through the existing typed/atomic system lane, not another mandatory prose document.
4. Preserve proportional modes and the three editorial policy boundaries; no evidence supports merging them into one monolith.

**Broad wave 21 complete.**
