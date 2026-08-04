from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import unquote
import json
import re

AUDIT_BASE = "0142b93de01160b77eda71cb9fd2f72fd8a4fbdc"
PRODUCT_SHA = "f9d0120718569c510833dba7a3abd68ce2f6a003"
PR_NUMBER = 152

root = Path.cwd()
product = root / "_product"
dist = product / "dist"
matrix_path = root / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
handoff_path = root / "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md"
reverify_path = root / "projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-native-dist.md"

expected_routes = {
    "nagornaya/index.html",
    "nagornaya/chast-1/index.html",
    "nagornaya/chast-2/index.html",
    "nagornaya/chast-3/index.html",
    "nagornaya/chast-4/index.html",
    "nagornaya/chast-5/index.html",
    "nagornaya/seriya/index.html",
    "nagornaya/istochniki/index.html",
    "nagornaya/nakhodki/index.html",
}
accent_names = {
    "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
    "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
}

class_attr_re = re.compile(r"(?:class|className)\s*=\s*([\"'])(.*?)\1", re.IGNORECASE | re.DOTALL)
body_re = re.compile(r"<body\b[^>]*\bclass\s*=\s*([\"'])(.*?)\1", re.IGNORECASE | re.DOTALL)
stylesheet_re = re.compile(
    r"<link\b[^>]*\brel\s*=\s*([\"'])stylesheet\1[^>]*\bhref\s*=\s*([\"'])(.*?)\2[^>]*>|"
    r"<link\b[^>]*\bhref\s*=\s*([\"'])(.*?)\4[^>]*\brel\s*=\s*([\"'])stylesheet\6[^>]*>",
    re.IGNORECASE | re.DOTALL,
)
style_re = re.compile(r"<style\b[^>]*>(.*?)</style>", re.IGNORECASE | re.DOTALL)
rule_re = re.compile(r"([^{}]+)\{([^{}]*)\}", re.DOTALL)
dark_context_re = re.compile(r"html\.dark|(?:^|[\s,>+~])\.dark(?:[\s.#:[>+~]|$)|\[data-theme\s*=\s*[\"']?dark", re.IGNORECASE)
utility_re = re.compile(r"^(text|bg|border)-([a-z]+)-(50|100|200|300|400|500|600|700|800|900|950)$")


def in_historical_scope(token: str) -> bool:
    match = utility_re.fullmatch(token)
    if not match:
        return False
    kind, color, shade = match.groups()
    if kind == "text" and color in accent_names and shade in {"600", "700"}:
        return True
    return token in {
        "text-amber-800",
        "border-stone-100",
        "bg-rose-50",
        "bg-stone-100",
        "bg-stone-200",
    }


def resolve_local_asset(html_path: Path, href: str) -> Path | None:
    clean = unquote(href.split("?", 1)[0].split("#", 1)[0].strip())
    if not clean or clean.startswith(("http://", "https://", "//", "data:")):
        return None
    candidate = dist / clean.lstrip("/") if clean.startswith("/") else html_path.parent / clean
    try:
        resolved = candidate.resolve(strict=False)
        resolved.relative_to(dist.resolve())
    except (ValueError, OSError):
        raise SystemExit(f"dist stylesheet escapes root: {html_path}: {href}")
    return resolved


def parse_rules(css: str) -> list[tuple[str, str]]:
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)
    return [
        (" ".join(match.group(1).split()), " ".join(match.group(2).split()))
        for match in rule_re.finditer(css)
    ]


if not dist.is_dir():
    raise SystemExit("production-like Product dist is missing")

route_files: list[Path] = []
route_tokens: dict[str, Counter[str]] = {}
route_body_classes: dict[str, list[str]] = {}
route_rule_sources: dict[str, list[tuple[str, list[tuple[str, str]]]]] = {}
token_counts: Counter[str] = Counter()
token_routes: dict[str, set[str]] = defaultdict(set)

for rel in sorted(expected_routes):
    html_path = dist / rel
    if not html_path.is_file():
        raise SystemExit(f"expected native dist route missing: {rel}")
    html = html_path.read_text(encoding="utf-8")
    if "nagornaya-page" not in html or "main-content" not in html:
        raise SystemExit(f"native semantic markers missing from dist route: {rel}")
    route_files.append(html_path)

    body_match = body_re.search(html)
    if not body_match:
        raise SystemExit(f"body class missing from dist route: {rel}")
    body_classes = body_match.group(2).split()
    if "nagornaya-page" not in body_classes:
        raise SystemExit(f"nagornaya-page body owner missing from dist route: {rel}")
    route_body_classes[rel] = body_classes

    counts: Counter[str] = Counter()
    for match in class_attr_re.finditer(html):
        for raw in match.group(2).split():
            token = raw.strip()
            if ":" in token or not in_historical_scope(token):
                continue
            counts[token] += 1
            token_counts[token] += 1
            token_routes[token].add(rel)
    route_tokens[rel] = counts

    rule_sources: list[tuple[str, list[tuple[str, str]]]] = []
    seen_paths: set[Path] = set()
    for match in stylesheet_re.finditer(html):
        href = match.group(3) or match.group(5) or ""
        css_path = resolve_local_asset(html_path, href)
        if css_path is None or css_path in seen_paths:
            continue
        seen_paths.add(css_path)
        if not css_path.is_file():
            raise SystemExit(f"linked dist stylesheet missing: {rel}: {href} -> {css_path}")
        rule_sources.append((css_path.relative_to(dist).as_posix(), parse_rules(css_path.read_text(encoding="utf-8"))))
    for index, css in enumerate(style_re.findall(html), start=1):
        rule_sources.append((f"{rel}#inline-style-{index}", parse_rules(css)))
    if not rule_sources:
        raise SystemExit(f"no local or inline style source resolved for dist route: {rel}")
    route_rule_sources[rel] = rule_sources

if {path.relative_to(dist).as_posix() for path in route_files} != expected_routes:
    raise SystemExit("native dist route set drift")
if not token_counts:
    raise SystemExit("historical-scope tokens absent from native dist; manual closure review required")

coverage: dict[str, dict[str, list[dict[str, str]]]] = defaultdict(dict)
for token, routes in token_routes.items():
    selector_fragment = "." + token
    for rel in sorted(routes):
        matches: list[dict[str, str]] = []
        for source_name, rules in route_rule_sources[rel]:
            for selectors, declarations in rules:
                if selector_fragment in selectors and dark_context_re.search(selectors):
                    matches.append({
                        "source": source_name,
                        "selectors": selectors[:500],
                        "declarations": declarations[:500],
                    })
        coverage[token][rel] = matches

covered: dict[str, dict[str, object]] = {}
residual: dict[str, dict[str, object]] = {}
for token in sorted(token_counts):
    routes = sorted(token_routes[token])
    missing = [rel for rel in routes if not coverage[token][rel]]
    sources = sorted({m["source"] for rel in routes for m in coverage[token][rel]})
    payload = {
        "uses": token_counts[token],
        "routes": routes,
        "missing_routes": missing,
        "sources": sources,
    }
    (residual if missing else covered)[token] = payload

if not residual:
    raise SystemExit("native dist shows no historical-scope source residual; manual closure review required")

all_uses = sum(token_counts.values())
covered_uses = sum(int(v["uses"]) for v in covered.values())
residual_uses = sum(int(v["uses"]) for v in residual.values())
body_stone_100_routes = sorted(rel for rel, classes in route_body_classes.items() if "bg-stone-100" in classes)
body_stone_900_routes = sorted(rel for rel, classes in route_body_classes.items() if "bg-stone-900" in classes)


def sorted_items(items: dict[str, dict[str, object]]) -> list[tuple[str, dict[str, object]]]:
    return sorted(items.items(), key=lambda pair: (-int(pair[1]["uses"]), pair[0]))


def table(items: dict[str, dict[str, object]], covered_mode: bool) -> str:
    lines = ["| Utility token | Uses | Routes | Dist dark coverage | Rule sources |", "|---|---:|---:|---|---|"]
    for token, data in sorted_items(items):
        missing = list(data["missing_routes"])
        coverage_text = "covered on every using route" if covered_mode else f"missing on {len(missing)}/{len(data['routes'])} route(s)"
        sources = ", ".join(f"`{s}`" for s in data["sources"]) or "—"
        lines.append(f"| `{token}` | {data['uses']} | {len(data['routes'])} | {coverage_text} | {sources} |")
    return "\n".join(lines)


def summary(items: dict[str, dict[str, object]], limit: int = 12) -> str:
    values = [f"`{t}` ({d['uses']}×)" for t, d in sorted_items(items)[:limit]]
    if len(items) > limit:
        values.append(f"and {len(items) - limit} more")
    return ", ".join(values)

routes_md = "\n".join(f"- `{rel}`" for rel in sorted(expected_routes))
body_100_md = ", ".join(f"`{r}`" for r in body_stone_100_routes) or "none"
body_900_md = ", ".join(f"`{r}`" for r in body_stone_900_routes) or "none"

reverify = f"""# CURRENT HEAD REVERIFY — Nagornaya native/dist dark-theme authority correction

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `NG-DARK-01`
- Product anchor: `{PRODUCT_SHA}`
- AuditRepo base: `{AUDIT_BASE}`
- Authority-correction lane: AuditRepo PR #{PR_NUMBER}
- Product mutation: **none**
- Browser/live-production claim: **none**
- TTS scope: **excluded**

## Why this correction exists

AuditRepo PR #151 correctly rejected the stale broad July wording but counted legacy shadow HTML. Current Product authority is native Astro: `scripts/nagornaya-visual-parity-audit.js` requires all nine routes to own native pages/components and forbids legacy full-document transport.

This reverify therefore supersedes PR #151 **only for source authority**. It uses a successful `strangler:build:production-like` and inspects the exact built native output under `dist/`.

## Native production-like route boundary

The build produced all nine expected native routes:

{routes_md}

Each built route contains `nagornaya-page` and `main-content`. Historical-scope utility tokens were extracted from built HTML, while dark coverage was accepted only from local CSS or inline styles actually linked by that exact built page.

Native body ownership:

- built routes whose body still uses `bg-stone-100`: {body_100_md};
- built routes whose body uses `bg-stone-900`: {body_900_md}.

## Historical-scope dist inventory

- Present historical-scope tokens: **{len(token_counts)} tokens / {all_uses} uses**.
- Covered on every using built route: **{len(covered)} tokens / {covered_uses} uses**.
- Missing a direct dark-context rule on at least one using built route: **{len(residual)} tokens / {residual_uses} uses**.

### Covered in native dist

{table(covered, True)}

### Native-dist source residual

{table(residual, False)}

## Disposition

`NG-DARK-01` remains **OPEN / CURRENT**, but its authoritative source boundary is now the native production-like dist residual: {summary(residual)}.

The dist inventory replaces the legacy-shadow counts from PR #151. Absence of a direct selector is still a source-level obligation, not proof of a visual contrast failure; future browser/computed-style verification must operate on this exact native-dist set before Product mutation.

`NG-BODY-01` remains closed. Where native bodies retired `bg-stone-100` in favor of `bg-stone-900`, removal is the current fix; any remaining built body use must be covered by its linked dark CSS. Closed duplicate rows remain closed and must not become second owners.

## Evidence boundary

- exact Product `{PRODUCT_SHA}`;
- successful native visual-parity source contract and production-like build;
- exact built HTML plus route-linked CSS/inline styles;
- no Product mutation;
- no browser, computed-style, deployed-SHA or live-production claim;
- no TTS inspection or modification;
- canonical arithmetic remains **358 = 213 closed + 145 open**, P1 **70**.
"""
reverify_path.write_text(reverify, encoding="utf-8")

matrix = matrix_path.read_text(encoding="utf-8")
handoff = handoff_path.read_text(encoding="utf-8")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one marker, found {count}")
    return text.replace(old, new, 1)


def replace_row(text: str, finding_id: str, new_row: str) -> str:
    pattern = re.compile(rf"(?m)^\| {re.escape(finding_id)} \|.*$")
    matches = pattern.findall(text)
    if len(matches) != 1:
        raise SystemExit(f"{finding_id}: expected one row, found {len(matches)}")
    return pattern.sub(new_row, text, count=1)

residual_summary = summary(residual, limit=12)
covered_summary = summary(covered, limit=8)

matrix = replace_once(
    matrix,
    '| Source verification anchor | `f9d0120718569c510833dba7a3abd68ce2f6a003` (exact route-linked CSS inventory: `NG-DARK-01` narrowed to 12 historically in-scope tokens / 327 uses; 37 ambient no-selector tokens are not promoted without browser/owner evidence; no Product mutation, browser, production or TTS claim). |',
    f'| Source verification anchor | `{PRODUCT_SHA}` (native Astro production-like dist inventory: `NG-DARK-01` = {len(residual)} historical-scope tokens / {residual_uses} uses without complete direct dark coverage; PR #151 legacy-shadow counts superseded; no Product mutation, browser, production or TTS claim). |',
    'matrix source anchor',
)
matrix = replace_once(
    matrix,
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-current-residual.md` |',
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-native-dist.md` |',
    'matrix reverify',
)
new_root = (
    f'| NG-DARK-01 | ⚠️ **CURRENT / NATIVE-DIST AUTHORITY CORRECTED 2026-08-04:** Product `{PRODUCT_SHA}` passed the native Nagornaya parity contract and a production-like build. '
    f'Exact built `dist/nagornaya/**/index.html` contains {len(token_counts)} currently used historical-scope utility tokens / {all_uses} uses; linked built CSS covers {len(covered)} tokens / {covered_uses} uses ({covered_summary}). '
    f'The authoritative source residual is **{len(residual)} tokens / {residual_uses} uses** without complete direct dark coverage: {residual_summary}. '
    f'This supersedes PR #151 legacy-shadow counts. Missing direct coverage is not yet a browser contrast failure; verify computed native output before a bounded Product repair. No Product mutation, browser, production or TTS claim. '
    f'| native production-like dist `f9d01207`; `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-native-dist.md` |'
)
matrix = replace_row(matrix, 'NG-DARK-01', new_root)

body_state = (
    f'{len(body_stone_900_routes)} built route(s) use `bg-stone-900`; '
    f'{len(body_stone_100_routes)} built route(s) still use `bg-stone-100`'
)
new_body = (
    f'| NG-BODY-01 | ✅ **FIXED-CURRENT / NATIVE-DIST SOURCE VERIFIED 2026-08-04.** Product `{PRODUCT_SHA}` passed the native route contract and production-like build; {body_state}. '
    f'The authoritative built output no longer supports the historical claim that an ungoverned light-only `bg-stone-100` body necessarily survives in dark mode. Where the class was retired, removal is the fix; any remaining built use is evaluated through route-linked CSS. '
    f'PR #150 legacy evidence is superseded only on authority, not closure. No browser, production or TTS claim. | native dist `f9d01207` |'
)
matrix = replace_row(matrix, 'NG-BODY-01', new_body)

handoff = replace_once(
    handoff,
    '**AuditRepo base before this handoff:** `a1ae62a06a803824d4dd828bbd06a4cead3dd1b1`',
    f'**AuditRepo base before this handoff:** `{AUDIT_BASE}`',
    'handoff base',
)
handoff = replace_once(
    handoff,
    '**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-current-residual.md`',
    '**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-native-dist.md`',
    'handoff reverify',
)
handoff = replace_once(
    handoff,
    'Source movement does **not** change canonical AuditRepo counts by itself. AuditRepo PRs #132, #136–#141, #143–#147, #149 and #150 are merged; PR #142 was closed unmerged after its exact-row gate disproved an incorrect duplicate mapping. AuditRepo PR #151 narrows `NG-DARK-01` through an exact route-linked CSS inventory; counts remain unchanged and the lane makes no Product mutation, browser, production or TTS claim.',
    f'Source movement does **not** change canonical AuditRepo counts by itself. AuditRepo PRs #132, #136–#141, #143–#147 and #149–#151 are merged; PR #142 was closed unmerged after its exact-row gate disproved an incorrect duplicate mapping. AuditRepo PR #{PR_NUMBER} corrects `NG-DARK-01` authority from legacy shadows to native production-like dist; counts remain unchanged and the lane makes no Product mutation, browser, production or TTS claim.',
    'handoff source movement',
)
pattern_product = re.compile(r'(?m)^- Product `main@f9d0120718569c510833dba7a3abd68ce2f6a003` remains source authority\..*$')
if len(pattern_product.findall(handoff)) != 1:
    raise SystemExit('handoff Product owner line drift')
handoff = pattern_product.sub(
    f'- Product `main@{PRODUCT_SHA}` remains source authority. Native production-like dist, not legacy shadows, owns `NG-DARK-01`; the current source residual is {len(residual)} tokens / {residual_uses} uses pending browser/computed-style verification. `NG-INLINE-01` and `NG-SEO-01` remain open independently.',
    handoff,
    count=1,
)
handoff = replace_once(
    handoff,
    '- PR #151 (`verify/nagornaya-dark-current-residual-20260804`) is the active canonical narrowing lane for `NG-DARK-01`; its final diff is bounded to the matrix, this handoff and the paired reverify document.',
    f'- PR #{PR_NUMBER} (`verify/nagornaya-dark-native-dist-authority-20260804`) is the active authority-correction lane for `NG-DARK-01`; its final diff is bounded to the matrix, this handoff and the paired reverify document.',
    'handoff AuditRepo lane',
)
pattern_next = re.compile(r'(?m)^1\. Merge AuditRepo PR #151 .*\n2\. Use only the generated .*$', re.MULTILINE)
matches = pattern_next.findall(handoff)
if len(matches) != 1:
    raise SystemExit(f'handoff next-work drift: {len(matches)}')
handoff = pattern_next.sub(
    f'1. Merge AuditRepo PR #{PR_NUMBER} only after exact-head validator, matrix coverage and repository-history forensic checks pass; preserve disjoint lanes.\n2. Use only the native production-like dist residual ({len(residual)} tokens / {residual_uses} uses) for future browser verification; do not repair from PR #151 legacy-shadow counts.',
    handoff,
    count=1,
)

if '{{NATIVE_DIST_INVENTORY}}' in reverify_path.read_text(encoding='utf-8'):
    raise SystemExit('native dist placeholder survived')
if matrix.count('| NG-DARK-01 |') != 1 or matrix.count('| NG-BODY-01 |') != 1:
    raise SystemExit('canonical row cardinality changed')
if '## ✅ ЗАКРЫТО (213)' not in matrix or '## 🟠 P1 — ОТКРЫТО (70)' not in matrix:
    raise SystemExit('canonical counters changed unexpectedly')
if '**358 IDs = 213 closed + 145 open**' not in handoff:
    raise SystemExit('handoff arithmetic changed')

matrix_path.write_text(matrix, encoding='utf-8')
handoff_path.write_text(handoff, encoding='utf-8')

report = {
    'routes': sorted(expected_routes),
    'body_classes': route_body_classes,
    'token_count': len(token_counts),
    'uses': all_uses,
    'covered': {k: v['uses'] for k, v in sorted_items(covered)},
    'residual': {k: v['uses'] for k, v in sorted_items(residual)},
}
print(json.dumps(report, ensure_ascii=False, indent=2))
