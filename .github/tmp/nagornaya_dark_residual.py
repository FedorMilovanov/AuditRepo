from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import unquote
import json
import re

AUDIT_BASE = "a1ae62a06a803824d4dd828bbd06a4cead3dd1b1"
PRODUCT_SHA = "f9d0120718569c510833dba7a3abd68ce2f6a003"
PR_NUMBER = 151

root = Path.cwd()
product = root / "_product"
matrix_path = root / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
handoff_path = root / "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md"
reverify_path = root / "projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-current-residual.md"

if not product.is_dir():
    raise SystemExit("exact Product checkout is missing")

color_names = (
    "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|"
    "teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"
)
color_token_re = re.compile(
    rf"^(?:text|bg|border)-(?:{color_names})-(?:50|100|200|300|400|500|600|700|800|900|950)$"
)
class_attr_re = re.compile(r"(?:class|className)\s*=\s*([\"'])(.*?)\1", re.IGNORECASE | re.DOTALL)
stylesheet_re = re.compile(
    r"<link\b[^>]*\brel\s*=\s*([\"'])stylesheet\1[^>]*\bhref\s*=\s*([\"'])(.*?)\2[^>]*>|"
    r"<link\b[^>]*\bhref\s*=\s*([\"'])(.*?)\4[^>]*\brel\s*=\s*([\"'])stylesheet\6[^>]*>",
    re.IGNORECASE | re.DOTALL,
)
body_re = re.compile(r"<body\b[^>]*\bclass\s*=\s*([\"'])(.*?)\1", re.IGNORECASE | re.DOTALL)
rule_re = re.compile(r"([^{}]+)\{([^{}]*)\}", re.DOTALL)
dark_context_re = re.compile(r"html\.dark|(?:^|[\s,>+~])\.dark(?:[\s.#:[>+~]|$)|\[data-theme\s*=\s*[\"']?dark", re.IGNORECASE)


def resolve_local_css(html_path: Path, href: str) -> Path | None:
    clean = unquote(href.split("?", 1)[0].split("#", 1)[0].strip())
    if not clean or clean.startswith(("http://", "https://", "//", "data:")):
        return None
    candidate = product / clean.lstrip("/") if clean.startswith("/") else html_path.parent / clean
    try:
        resolved = candidate.resolve(strict=False)
        resolved.relative_to(product.resolve())
    except (ValueError, OSError):
        raise SystemExit(f"stylesheet escapes Product root: {html_path}: {href}")
    return resolved


route_files: list[Path] = []
route_tokens: dict[str, Counter[str]] = {}
route_css: dict[str, list[Path]] = {}
all_token_counts: Counter[str] = Counter()
token_routes: dict[str, set[str]] = defaultdict(set)

for html_path in sorted((product / "nagornaya").rglob("index.html")):
    text = html_path.read_text(encoding="utf-8")
    body_match = body_re.search(text)
    if not body_match:
        continue
    body_classes = set(body_match.group(2).split())
    if "nagornaya-page" not in body_classes:
        continue
    rel = html_path.relative_to(product).as_posix()
    route_files.append(html_path)
    counts: Counter[str] = Counter()
    for match in class_attr_re.finditer(text):
        for raw in match.group(2).split():
            token = raw.strip()
            if ":" in token:
                continue
            if color_token_re.fullmatch(token):
                counts[token] += 1
                all_token_counts[token] += 1
                token_routes[token].add(rel)
    route_tokens[rel] = counts

    css_paths: list[Path] = []
    for match in stylesheet_re.finditer(text):
        href = match.group(3) or match.group(5) or ""
        css_path = resolve_local_css(html_path, href)
        if css_path is None:
            continue
        if not css_path.is_file():
            raise SystemExit(f"linked local stylesheet is missing: {rel}: {href} -> {css_path}")
        css_paths.append(css_path)
    route_css[rel] = sorted(set(css_paths))

if len(route_files) < 8:
    raise SystemExit(f"expected at least eight current legacy Nagornaya routes, found {len(route_files)}")
if len(all_token_counts) < 10:
    raise SystemExit(f"color-utility inventory unexpectedly small: {len(all_token_counts)} tokens")

css_rule_cache: dict[Path, list[tuple[str, str]]] = {}
for css_paths in route_css.values():
    for css_path in css_paths:
        if css_path in css_rule_cache:
            continue
        css = css_path.read_text(encoding="utf-8")
        css = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)
        css_rule_cache[css_path] = [
            (" ".join(match.group(1).split()), " ".join(match.group(2).split()))
            for match in rule_re.finditer(css)
        ]

coverage: dict[str, dict[str, list[dict[str, str]]]] = defaultdict(dict)
for token, routes in token_routes.items():
    selector_fragment = "." + token
    for rel in sorted(routes):
        matches: list[dict[str, str]] = []
        for css_path in route_css[rel]:
            for selectors, declarations in css_rule_cache[css_path]:
                if selector_fragment in selectors and dark_context_re.search(selectors):
                    matches.append(
                        {
                            "css": css_path.relative_to(product).as_posix(),
                            "selectors": selectors[:500],
                            "declarations": declarations[:500],
                        }
                    )
        coverage[token][rel] = matches

covered: dict[str, dict[str, object]] = {}
uncovered: dict[str, dict[str, object]] = {}
partial: dict[str, dict[str, object]] = {}
for token in sorted(all_token_counts):
    routes = sorted(token_routes[token])
    covered_routes = [rel for rel in routes if coverage[token][rel]]
    missing_routes = [rel for rel in routes if not coverage[token][rel]]
    rule_files = sorted(
        {
            match["css"]
            for rel in routes
            for match in coverage[token][rel]
        }
    )
    payload = {
        "uses": all_token_counts[token],
        "routes": routes,
        "covered_routes": covered_routes,
        "missing_routes": missing_routes,
        "rule_files": rule_files,
    }
    if not missing_routes:
        covered[token] = payload
    elif covered_routes:
        partial[token] = payload
    else:
        uncovered[token] = payload

if "bg-stone-100" not in covered:
    raise SystemExit("fixed NG-BODY-01 boundary regressed: bg-stone-100 is not covered on every using route")
if all_token_counts.get("bg-rose-50", 0) and "bg-rose-50" not in covered:
    raise SystemExit("expected current bg-rose-50 dark remap is not effective on every using route")
if not uncovered and not partial:
    raise SystemExit("NG-DARK-01 may be fully stale/fixed; narrowing transaction requires manual closure review")

residual = {**uncovered, **partial}
residual_uses = sum(int(item["uses"]) for item in residual.values())
covered_uses = sum(int(item["uses"]) for item in covered.values())
all_uses = sum(all_token_counts.values())

report = {
    "product_sha": PRODUCT_SHA,
    "route_count": len(route_files),
    "routes": [path.relative_to(product).as_posix() for path in route_files],
    "token_count": len(all_token_counts),
    "all_uses": all_uses,
    "covered_token_count": len(covered),
    "covered_uses": covered_uses,
    "uncovered_token_count": len(uncovered),
    "partial_token_count": len(partial),
    "residual_uses": residual_uses,
    "covered": covered,
    "partial": partial,
    "uncovered": uncovered,
}
Path("/tmp/nagornaya-dark-current-residual.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
)


def sort_items(items: dict[str, dict[str, object]]) -> list[tuple[str, dict[str, object]]]:
    return sorted(items.items(), key=lambda pair: (-int(pair[1]["uses"]), pair[0]))


def format_token_summary(items: dict[str, dict[str, object]], limit: int = 14) -> str:
    ordered = sort_items(items)
    shown = [f"`{token}` ({data['uses']}×)" for token, data in ordered[:limit]]
    if len(ordered) > limit:
        shown.append(f"и ещё {len(ordered) - limit}")
    return ", ".join(shown)


def inventory_table(items: dict[str, dict[str, object]], status: str) -> str:
    lines = ["| Utility token | Uses | Routes | Dark coverage | Linked rule files |", "|---|---:|---:|---|---|"]
    for token, data in sort_items(items):
        routes = list(data["routes"])
        missing = list(data["missing_routes"])
        coverage_text = status if not missing else f"missing on {len(missing)}/{len(routes)} route(s)"
        files = ", ".join(f"`{path}`" for path in data["rule_files"]) or "—"
        lines.append(f"| `{token}` | {data['uses']} | {len(routes)} | {coverage_text} | {files} |")
    if len(lines) == 2:
        lines.append("| — | 0 | 0 | none | — |")
    return "\n".join(lines)

route_lines = "\n".join(f"- `{path.relative_to(product).as_posix()}`" for path in route_files)
covered_summary = format_token_summary(covered)
residual_summary = format_token_summary(residual)
full_reverify = f"""# CURRENT HEAD REVERIFY — Nagornaya dark-theme current residual

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `NG-DARK-01`
- Product anchor: `{PRODUCT_SHA}`
- AuditRepo base: `{AUDIT_BASE}`
- Closure/narrowing lane: AuditRepo PR #{PR_NUMBER}
- Product mutation: **none**
- Browser/live-production claim: **none**
- TTS scope: **excluded**

## Exact current-source inventory

The fail-closed scan selected **{len(route_files)}** current legacy Nagornaya routes by the semantic body owner `nagornaya-page`:

{route_lines}

It extracted **{len(all_token_counts)} distinct static color utility tokens / {all_uses} uses** from their markup, resolved every local stylesheet linked by each page, and matched each token only against a dark-context selector in CSS actually loaded by the route.

- Fully covered now: **{len(covered)} tokens / {covered_uses} uses**.
- Still fully uncovered: **{len(uncovered)} tokens**.
- Partially covered across using routes: **{len(partial)} tokens**.
- Current residual: **{len(residual)} tokens / {residual_uses} uses**.

The current linked CSS covers, among others, {covered_summary}. Therefore the historical “54 classes all missing; remaps only in `mobile-hotfix.css`” wording is stale. In particular, `bg-stone-100` and `bg-rose-50` are governed by linked dark selectors in `css/nagornaya-mobile-toc.css`.

The reproducible current residual is: {residual_summary}.

### Current residual inventory

{inventory_table(residual, 'uncovered')}

### Current covered inventory

{inventory_table(covered, 'covered on every using route')}

## Disposition

`NG-DARK-01` remains **OPEN / CURRENT**, but is narrowed to the exact residual inventory above.

This transaction removes fixed/stale subsets from the canonical wording without pretending that the broader dark-theme debt is repaired. Future Product work must use the generated residual table as its acceptance boundary instead of the July count or an assumption that all accent utilities lack dark treatment.

Closed rows `NG-DARK-04` and `NG-DARK-05` remain closed as historical duplicate consolidations. Their old current-source explanations are reconciled: `bg-rose-50` and body `bg-stone-100` now have effective linked remaps; any still-uncovered token is owned only by this narrowed root.

## Evidence boundary

- exact Product source only;
- no Product mutation;
- no browser, deployed-SHA or live-production claim;
- no TTS inspection or modification;
- canonical arithmetic is unchanged at **358 = 213 closed + 145 open**, P1 **70**.
"""
reverify_path.write_text(full_reverify, encoding="utf-8")

matrix = matrix_path.read_text(encoding="utf-8")
handoff = handoff_path.read_text(encoding="utf-8")


def replace_line_by_id(text: str, finding_id: str, replacement: str) -> str:
    pattern = re.compile(rf"(?m)^\| {re.escape(finding_id)} \|.*$")
    matches = pattern.findall(text)
    if len(matches) != 1:
        raise SystemExit(f"{finding_id}: expected one canonical row, found {len(matches)}")
    return pattern.sub(replacement, text, count=1)


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one marker, found {count}")
    return text.replace(old, new, 1)

residual_short = format_token_summary(residual, limit=10)
new_root_row = (
    f"| NG-DARK-01 | ⚠️ **CURRENT / NARROWED 2026-08-04:** Exact Product `{PRODUCT_SHA}` scan covered "
    f"{len(route_files)} current legacy Nagornaya routes, {len(all_token_counts)} distinct color utility tokens and {all_uses} uses. "
    f"Linked dark selectors now govern {len(covered)} tokens / {covered_uses} uses, including `bg-stone-100` and `bg-rose-50`; "
    f"the July claim that 54 classes are all unremapped and only `mobile-hotfix.css` owns dark fixes is stale. "
    f"The current residual is {len(residual)} tokens / {residual_uses} uses without complete route-level dark coverage: {residual_short}. "
    f"Repair only this generated residual through linked explicit remaps or governed chapter variables; do not recreate fixed `NG-BODY-01` or duplicate rows. "
    f"No Product mutation, browser, production or TTS claim. | current source `f9d01207`; `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-current-residual.md` |"
)
new_dark04 = (
    f"| NG-DARK-04 | ✅ **DUPLICATE / MERGED INTO `NG-DARK-01` 2026-08-04; CURRENT WORDING RECONCILED.** "
    f"This row remains closed because `bg-rose-50` never defined an independent repair lane. Exact Product `{PRODUCT_SHA}` reverify now shows "
    f"the token is covered on every current using route by linked dark CSS, so the former sentence that current source lacks this remap is retired and does not support the remaining root residual. "
    f"No Product mutation, browser, production or TTS claim. | `f9d01207` source reverify |"
)
new_dark05 = (
    f"| NG-DARK-05 | ✅ **DUPLICATE / MERGED INTO `NG-DARK-01` 2026-08-04; CURRENT WORDING RECONCILED.** "
    f"The aggregate stone-background row remains closed and is not reopened as a second owner. Exact Product `{PRODUCT_SHA}` proves body `bg-stone-100` is covered by linked dark CSS; "
    f"any stone token still lacking complete coverage is recorded only in the generated current residual of open `NG-DARK-01`. "
    f"No Product mutation, browser, production or TTS claim. | `f9d01207` source reverify |"
)

matrix = replace_once(
    matrix,
    f"| Source verification anchor | `{PRODUCT_SHA}` (exact Product effective-cascade verification: `NG-BODY-01` is fixed-current; broad `NG-DARK-01` remains open pending current-residual narrowing; no browser or live-production claim). |",
    f"| Source verification anchor | `{PRODUCT_SHA}` (exact route-linked CSS inventory: `NG-DARK-01` narrowed to {len(residual)} current residual tokens / {residual_uses} uses; no Product mutation, browser, production or TTS claim). |",
    "matrix source anchor",
)
matrix = replace_once(
    matrix,
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-body-subset-duplicate.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-current-residual.md` |",
    "matrix reverify",
)
matrix = replace_line_by_id(matrix, "NG-DARK-01", new_root_row)
matrix = replace_line_by_id(matrix, "NG-DARK-04", new_dark04)
matrix = replace_line_by_id(matrix, "NG-DARK-05", new_dark05)

handoff = replace_once(
    handoff,
    "**AuditRepo base before this handoff:** `f59571e6690e695a7fcf5d1a4da71c33fb6401aa`",
    f"**AuditRepo base before this handoff:** `{AUDIT_BASE}`",
    "handoff base",
)
handoff = replace_once(
    handoff,
    "**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-body-subset-duplicate.md`",
    "**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-current-residual.md`",
    "handoff reverify",
)
handoff = replace_once(
    handoff,
    "Source movement does **not** change canonical AuditRepo counts by itself. AuditRepo PRs #132, #136–#141, #143–#147 and #149 are merged; PR #142 was closed unmerged after its exact-row gate disproved an incorrect duplicate mapping. AuditRepo PR #150 closes `NG-BODY-01` as fixed-current after exact effective-cascade source verification; it makes no Product mutation, browser or live-production claim.",
    f"Source movement does **not** change canonical AuditRepo counts by itself. AuditRepo PRs #132, #136–#141, #143–#147, #149 and #150 are merged; PR #142 was closed unmerged after its exact-row gate disproved an incorrect duplicate mapping. AuditRepo PR #{PR_NUMBER} narrows `NG-DARK-01` through an exact route-linked CSS inventory; counts remain unchanged and the lane makes no Product mutation, browser, production or TTS claim.",
    "handoff source movement",
)
handoff = replace_once(
    handoff,
    f"- Product `main@{PRODUCT_SHA}` remains source authority. `NG-BODY-01` is fixed-current; `NG-DARK-01` remains open only for a freshly narrowed residual. `NG-INLINE-01` and `NG-SEO-01` remain open current root owners.",
    f"- Product `main@{PRODUCT_SHA}` remains source authority. `NG-BODY-01` is fixed-current; `NG-DARK-01` remains open only for the generated {len(residual)}-token / {residual_uses}-use residual. `NG-INLINE-01` and `NG-SEO-01` remain open current root owners.",
    "handoff Product owners",
)
handoff = replace_once(
    handoff,
    "- PR #150 (`verify/nagornaya-body-subset-duplicate-20260804`) is the active canonical fixed-current lane for `NG-BODY-01`; its final diff is bounded to the matrix, this handoff and the paired reverify document.",
    f"- PR #{PR_NUMBER} (`verify/nagornaya-dark-current-residual-20260804`) is the active canonical narrowing lane for `NG-DARK-01`; its final diff is bounded to the matrix, this handoff and the paired reverify document.",
    "handoff AuditRepo owner",
)
handoff = replace_once(
    handoff,
    "1. Merge AuditRepo PR #150 only after validator, matrix coverage and repository-history forensic checks pass on its exact final head; preserve disjoint PR #148.\n2. Reverify and narrow `NG-DARK-01` against current CSS before any Product mutation; exclude fixed `NG-BODY-01` and do not recreate it. Keep `NG-INLINE-01` and `NG-SEO-01` open independently.",
    f"1. Merge AuditRepo PR #{PR_NUMBER} only after validator, matrix coverage and repository-history forensic checks pass on its exact final head; preserve all disjoint lanes.\n2. Use only the generated {len(residual)}-token `NG-DARK-01` residual for a future bounded Product repair; do not recreate fixed `NG-BODY-01` or retired duplicate wording. Keep `NG-INLINE-01` and `NG-SEO-01` open independently.",
    "handoff next work",
)

if "{{CURRENT_DARK_INVENTORY}}" in reverify_path.read_text(encoding="utf-8"):
    raise SystemExit("reverify placeholder survived")
if matrix.count("| NG-DARK-01 |") != 1:
    raise SystemExit("NG-DARK-01 cardinality changed")
if "## ✅ ЗАКРЫТО (213)" not in matrix or "## 🟠 P1 — ОТКРЫТО (70)" not in matrix:
    raise SystemExit("canonical counters changed unexpectedly")
if "**358 IDs = 213 closed + 145 open**" not in handoff:
    raise SystemExit("handoff arithmetic changed unexpectedly")
if "TTS scope: **excluded**" not in full_reverify:
    raise SystemExit("TTS exclusion boundary missing")

matrix_path.write_text(matrix, encoding="utf-8")
handoff_path.write_text(handoff, encoding="utf-8")

print(json.dumps({
    "routes": len(route_files),
    "tokens": len(all_token_counts),
    "uses": all_uses,
    "covered_tokens": len(covered),
    "residual_tokens": len(residual),
    "residual_uses": residual_uses,
    "residual": {token: data["uses"] for token, data in sort_items(residual)},
}, ensure_ascii=False, indent=2))
