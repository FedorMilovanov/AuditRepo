# Agent Audit Report — Lot external links omit `noreferrer`

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: Arena.ai Agent Mode
- Date: 2026-07-17
- Audited branch/ref: Product `main`
- Audited anchor: Product `a2ef67da54dd4ae00aedae154422280620acdf21`; live `https://gospod-bog.ru/articles/lot-i-sodom/`
- Environment: exact GitHub source archive; generated production-like `dist`; direct live HTML response
- Build mode: source + production-like dist + live
- Browser / device if used: no browser-behavior claim; HTML and policy inspection
- Scope: seven external source links in `src/components/article-pilots/lot/LotSectionSources.astro`
- Explicit exclusions: linked-site availability/content, all other route families, referrer headers set outside repository visibility, Product mutation
- Signal class: Product + audit harness
- Proof state: `FAIL` for explicit no-referrer isolation; `PASS` for `noopener`
- Claim boundary: all seven current Lot source links opened with `target="_blank"` omit the explicit `noreferrer` token, and the current guard declares this class healthy by checking only `noopener`
- Preservation boundary: preserve source URLs, visible citations, new-tab behavior where owner-intended, accessibility names, and `noopener`
- Semantic owner: Lot sources projection plus external-new-tab link policy/guard
- Overlapping active owner/PR/branch check: GitHub API returned no open Product PRs or issues and only Product `main`; no competing current owner was found

> The anchor records what this pass actually inspected. Do not update this report merely because Product later moves.

---

## 1. New observations

### Observation `LOT-EXTERNAL-BLANK-NO-NOREFERRER`

- Title: Seven Lot source links open third-party origins without explicit `noreferrer`
- Kind: defect
- Suggested impact: low
- Route(s) / owner(s): `/articles/lot-i-sodom/`; `src/components/article-pilots/lot/LotSectionSources.astro`
- Observed on anchor: Product `a2ef67da54dd4ae00aedae154422280620acdf21`; current live page
- Expected: externally opened source links use `rel="noopener noreferrer"`, matching the repository's current explicit pattern on `/app/` and preventing referrer disclosure independently of browser/default response policy
- Actual: all seven links use exactly `target="_blank" rel="noopener"`
- Reproduction or inspection steps:
  1. inspect `LotSectionSources.astro` lines containing `target="_blank"`;
  2. build current route and inspect `dist/articles/lot-i-sodom/index.html`;
  3. fetch current live `/articles/lot-i-sodom/` and enumerate new-tab anchors;
  4. inspect response/meta for an explicit stricter no-referrer policy
- Evidence type: verified-source + verified-build + verified-live
- Evidence:
  - source count: 7 `target="_blank"` links, 7 without `noreferrer`;
  - dist count: 7, all `rel="noopener"`, none with `noreferrer`;
  - live count: 7, all `rel="noopener"`, none with `noreferrer`;
  - destinations span Harvard White Levy, DOI/Nature, and UNESCO third-party origins;
  - current live response/page inspection found no explicit `Referrer-Policy: no-referrer` response header and no `<meta name="referrer" content="no-referrer">` fallback;
  - current `/app/` source demonstrates the repository already uses `rel="noopener noreferrer"` for external new-tab links
- Confidence: high
- Limitations of this method: the exact referrer value ultimately sent can vary with browser default, redirect behavior, and infrastructure headers not visible in the inspected response. Modern defaults commonly reduce cross-origin referrers to origin rather than full path. The proved defect is omission of the route-local explicit no-referrer contract, not a claim that every browser leaks the full article URL.
- Possible mechanism: the links were authored to satisfy the historical `noopener` security guard, while privacy isolation was not included in that guard
- Related existing findings: stale archive statements claimed all `target=_blank` links were secured; those claims only establish historical context and are not current authority
- Applicability: identical markup exists in current source, exact-head build output, and live output
- What this evidence does **not** prove: no reverse-tabnabbing defect is claimed because `noopener` is present; no credential, query secret, or personal-data leak is claimed

### Observation `TARGET-BLANK-GUARD-NARROWNESS`

- Title: Existing target-blank guard false-greens links that lack `noreferrer`
- Kind: audit-harness defect
- Suggested impact: low
- Route(s) / owner(s): repository-wide external-link policy; `scripts/audit-pro.js` G23
- Observed on anchor: Product `a2ef67da54dd4ae00aedae154422280620acdf21`
- Expected: if current intended contract is `noopener noreferrer`, the guard must reject either missing token for external new-tab links
- Actual: G23 explicitly accepts any `rel` containing `noopener` and prints `target="_blank" links: all carry rel="noopener"`; all seven Lot links therefore pass
- Reproduction or inspection steps: inspect `scripts/audit-pro.js` lines 1596–1617 and compare its regex with current Lot markup
- Evidence type: verified-source + mechanism
- Evidence: guard predicate is `/\bnoopener\b/` only; there is no `noreferrer` condition
- Confidence: high
- Limitations of this method: an owner could explicitly choose origin-referrer sharing as acceptable. In that case the Product link change would be an owner-policy decision rather than a mandatory security repair; however the user has directed that this route be treated as a separate bug and current `/app/` supplies a stronger in-repository pattern.
- Possible mechanism: the guard originated as reverse-tabnabbing protection and was never extended to privacy isolation
- Related existing findings: same local repair package as `LOT-EXTERNAL-BLANK-NO-NOREFERRER`, but the guard gap should be retained in evidence so a seven-link textual fix cannot false-close recurrence protection
- Applicability: guard and route are both current Product source at the same exact anchor
- What this evidence does **not** prove: it does not prove every source file with `noopener` must necessarily suppress referrers; policy scope should distinguish external from same-origin links

---

## 2. Confirmations and extensions

### Confirm or extend `LOT-EXTERNAL-BLANK-NO-NOREFERRER`

- Target report/finding: current Lot source-link omission
- Evidence angle added: three independent current surfaces
- My evidence anchor: Product source, generated production-like dist, live page on the exact current release lineage
- Result: same symptom + stronger applicability
- What this changes: the finding is not an unbuilt source artifact or stale legacy copy; it reaches current publication unchanged

### Confirm existing protection remains intact

- Target report/finding: whether `window.opener` isolation is missing
- Evidence angle added: `rel` token inspection
- My evidence anchor: same seven source/dist/live links
- Result: narrower scope
- What this changes: `noopener` is present on all seven links. Severity remains low and wording is restricted to explicit referrer privacy, not reverse tabnabbing.

---

## 3. Challenges and negative findings

### Challenge historical “all target=_blank secured” closure language

- Target report/finding: archived claims that all target-blank links were secured
- Reason: current Lot source, dist and live witnesses contain seven links without the requested `noreferrer` token; historical checks only required `noopener`
- Contradictory evidence angle: current source/build/live
- Evidence anchor: Product `a2ef67da54dd4ae00aedae154422280620acdf21`
- Recommended result: `narrower-scope / stale for noreferrer completeness`; retain historical reverse-tabnabbing closure only

### Challenge high-severity interpretation

- Target report/finding: possible characterization as a severe security vulnerability
- Reason: links already include `noopener`; no sensitive URL/query or full-path disclosure was demonstrated; modern default policy usually sends at most origin cross-origin
- Contradictory evidence angle: exact token and response inspection
- Evidence anchor: current live page
- Recommended result: low-severity privacy-hardening defect with a concrete, cheap repair

---

## 4. Root-cause clusters

### Cluster `LOT-EXTERNAL-LINK-PRIVACY-CONTRACT`

- Current manifestations: seven source links in one semantic sources block omit `noreferrer`; the existing G23 guard accepts all seven
- Shared mechanism: repository policy is encoded only as `noopener` reverse-tabnabbing protection, while current desired external-link contract also requires referrer suppression
- Why one cluster: seven anchors are repeated instances generated/owned by one component, not seven independent bugs
- Local root: `LotSectionSources.astro`
- System prevention owner: target-blank external-link guard
- Class-level guard requirement: for cross-origin `target="_blank"`, require both `noopener` and `noreferrer`; retain a documented exception mechanism if owner intentionally allows referrers
- Historical IDs absorbed: none found as current active rows

This report remains a separate finding package from CSS parity and schema audit-boundary reports.

---

## 5. Value and cost assessment

| Work | Value | Cost | Assessment |
|---|---|---|---|
| Add `noreferrer` to seven Lot links | Explicitly prevents referrer disclosure to cited third parties | Very small | Worth fixing |
| Extend external new-tab guard | Prevents immediate recurrence and false closure | Small | Required for durable closure |
| Add a global `no-referrer` policy | Broader behavior change for all outbound navigation and analytics | Medium/risky | Not authorized by this local finding |
| Remove `target="_blank"` | Also changes user navigation behavior | Small but product-facing | Not necessary unless owner prefers same-tab links |

The repair has low implementation cost and low compatibility risk when limited to these external links and their guard contract.

---

## 6. Suggested verification wave

1. Reconfirm Product head and open PR/branch collision immediately before repair.
2. Enumerate the seven current Lot source anchors.
3. Change each to `rel="noopener noreferrer"` without altering URL, link text, citation order, or `target` behavior.
4. Strengthen the guard for cross-origin new-tab links and add adversarial fixtures:
   - `noopener noreferrer` → PASS;
   - `noopener` only → FAIL;
   - `noreferrer` only → fail if explicit dual-token policy is retained;
   - reversed token order → PASS;
   - additional tokens → PASS;
   - same-origin exception, if any, documented and tested.
5. Build production-like dist.
6. Assert source and dist both contain seven Lot target-blank links and zero without `noreferrer`.
7. Run static publication, route/browser smoke, source-link audit, and general audit guard.
8. Optionally use a controlled echo endpoint in Chromium/WebKit to confirm no `Referer` header is delivered; do not make external third-party services the test authority.

Closure witness: exact candidate source + dist token count + guard mutation suite. Live verification is useful after deployment but not necessary to prove the local markup repair.

---

## 7. Suggested repair boundaries

### Product local lane

- Primary file: `src/components/article-pilots/lot/LotSectionSources.astro`
- Allowed textual mutation: add `noreferrer` to the seven existing `rel` attributes
- Preserve:
  - all destination URLs;
  - citation wording/order;
  - `target="_blank"`;
  - `noopener`;
  - typography and semantic list structure

### Guard lane in same independently mergeable repair

- Owner: `scripts/audit-pro.js` G23 or the current canonical successor if ownership has moved
- Required behavior: external new-tab links lacking either required isolation token fail closed
- Avoid:
  - route-specific Lot whitelist;
  - regex that depends on attribute/token order;
  - checking generated root legacy HTML instead of current ownership surfaces;
  - global referrer-policy changes beyond the seven-link claim

Required checks should be proportional: focused mutation fixtures, current source scan, production-like build/dist scan, and existing static publication checks.

---

## 8. Owner decisions

1. Confirm repository-wide intended external-new-tab policy as `noopener noreferrer`. Recommendation: confirm; current `/app/` already follows it and the user explicitly selected the Lot omission as a bug.
2. Decide whether same-origin `target="_blank"` links require `noreferrer`. Recommendation: scope the hard requirement to cross-origin links unless a stricter global privacy policy is desired.
3. Decide whether an explicit exception mechanism is needed for outbound analytics/referrer partnerships. No such requirement was found for these academic source links; recommendation: no exception for the seven Lot citations.
4. Decide whether browser echo verification is required for closure. Recommendation: source + dist + adversarial guard is sufficient for this low-risk token repair; optional browser witness can strengthen it.

No decision is needed about citation destinations or editorial claims; this finding authorizes no content rewrite.
