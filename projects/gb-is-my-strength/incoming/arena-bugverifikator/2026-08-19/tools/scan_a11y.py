#!/usr/bin/env python3
import os, re, json
from collections import defaultdict
CACHE = "/home/user/audit/live"
pages = {}
for f in sorted(os.listdir(CACHE)):
    if not f.endswith(".html") or f.startswith("_"): continue
    path = "/" if f == "root.html" else "/" + f[:-5].replace("__", "/") + "/"
    pages[path] = open(os.path.join(CACHE, f), encoding="utf-8", errors="replace").read()
print("pages:", len(pages))

tag_re = re.compile(r'<([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^<>"]*(?:"[^"]*")?)*?)\s*/?>')

def attrs(s):
    return dict((m.group(1).lower(), m.group(2)) for m in re.finditer(r'([a-zA-Z_:@\-\.]+)\s*=\s*"([^"]*)"', s))

report = defaultdict(list)
for p, t in pages.items():
    ids = set(re.findall(r'\sid="([^"]+)"', t))
    # dangling aria references
    for attr in ("aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "aria-activedescendant", "aria-details", "aria-errormessage", "for"):
        for m in re.finditer(r'\b' + attr + r'="([^"]+)"', t):
            for ref in m.group(1).split():
                if ref not in ids:
                    report[f"dangling {attr}"].append((p, ref))
    # buttons without type
    for m in re.finditer(r'<button\b([^>]*)>', t):
        a = attrs(m.group(1))
        if "type" not in a:
            report["button-without-type"].append((p, m.group(0)[:80]))
    # target blank without rel noopener
    for m in re.finditer(r'<a\b([^>]*)>', t):
        a = attrs(m.group(1))
        if a.get("target") == "_blank":
            rel = a.get("rel", "")
            if "noopener" not in rel and "noreferrer" not in rel:
                report["blank-without-noopener"].append((p, a.get("href", "")[:70]))
        if a.get("href", "").startswith("http") and "gospod-bog.ru" not in a.get("href", ""):
            pass
    # img alt
    for m in re.finditer(r'<img\b([^>]*)>', t):
        a = attrs(m.group(1))
        if "alt" not in a:
            report["img-without-alt"].append((p, a.get("src", "")[:70]))
        if "loading" not in a:
            report["img-without-loading"].append((p, a.get("src", "")[:60]))
        if ("width" not in a or "height" not in a) and "svg" not in a.get("src", ""):
            report["img-without-dims"].append((p, a.get("src", "")[:60]))
    # tabindex positive
    for m in re.finditer(r'tabindex="(\d+)"', t):
        if int(m.group(1)) > 0:
            report["positive-tabindex"].append((p, m.group(0)))
    # multiple h1 / heading order
    heads = [(int(m.group(1)), re.sub(r"<[^>]+>", "", m.group(2))[:50]) for m in re.finditer(r'<h([1-6])\b[^>]*>(.*?)</h\1>', t, re.S)]
    h1s = [h for h in heads if h[0] == 1]
    if len(h1s) != 1:
        report["h1-count"].append((p, len(h1s), [h[1] for h in h1s][:3]))
    prev = None
    for lvl, txt in heads:
        if prev is not None and lvl > prev + 1:
            report["heading-jump"].append((p, f"h{prev}->h{lvl}", txt))
        prev = lvl
    # aria-label on generic containers
    for m in re.finditer(r'<(div|span|p|li)\b([^>]*)>', t):
        a = attrs(m.group(2))
        if "aria-label" in a and "role" not in a:
            report["aria-label-on-generic"].append((p, m.group(1), a.get("aria-label", "")[:40]))
    # inputs without label
    for m in re.finditer(r'<input\b([^>]*)>', t):
        a = attrs(m.group(1))
        if a.get("type") in ("hidden", "submit", "button", "image"): continue
        if not any(k in a for k in ("aria-label", "aria-labelledby", "title", "id", "placeholder")):
            report["input-unlabeled"].append((p, m.group(0)[:80]))
    # meta refresh / deprecated
    if re.search(r'http-equiv="refresh"', t): report["meta-refresh"].append((p,))
    # duplicate main / nav landmarks
    if t.count("<main") > 1: report["multiple-main"].append((p, t.count("<main")))
    # empty links / buttons (no text, no aria-label)
    for m in re.finditer(r'<a\b([^>]*)>(.*?)</a>', t, re.S):
        a = attrs(m.group(1)); inner = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        if not inner and "aria-label" not in a and "title" not in a:
            report["empty-link"].append((p, a.get("href", "")[:60]))

for k in sorted(report):
    v = report[k]
    bypage = defaultdict(int)
    for item in v: bypage[item[0]] += 1
    print(f"\n### {k}: {len(v)} occurrences on {len(bypage)} pages")
    for item in v[:8]:
        print("   ", item)
    if len(v) > 8:
        print("    top pages:", sorted(bypage.items(), key=lambda kv: -kv[1])[:5])
