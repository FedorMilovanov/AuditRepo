#!/usr/bin/env python3
import os, re, json, sys
from collections import defaultdict
CACHE="/home/user/audit/live"
pages={}
for f in sorted(os.listdir(CACHE)):
    if not f.endswith(".html"): continue
    path = "/" if f=="root.html" else "/"+f[:-5].replace("__","/")+"/"
    pages[path]=open(os.path.join(CACHE,f),encoding="utf-8",errors="replace").read()
print("live pages:",len(pages))

links=defaultdict(set)
attr=re.compile(r'(?:href|src)\s*=\s*"([^"]+)"')
for p,t in pages.items():
    for m in attr.finditer(t):
        u=m.group(1)
        if u.startswith("/") and not u.startswith("//"):
            links[u.split("#")[0]].add(p)
print("unique internal targets:",len(links))
json.dump({k:sorted(v) for k,v in links.items()},open(CACHE+"/_links.json","w"))

# canonical / og:url / title checks
print("\n== canonical vs page ==")
canon=defaultdict(list)
for p,t in pages.items():
    head=t[:t.find("</head>")] if "</head>" in t else t[:20000]
    m=re.search(r'<link[^>]*rel="canonical"[^>]*>',head) or re.search(r'<link[^>]*canonical[^>]*>',head)
    if not m: print("NO canonical:",p); continue
    href=re.search(r'href="([^"]+)"',m.group(0))
    href=href.group(1) if href else None
    canon[href].append(p)
    rel=(href or "").replace("https://gospod-bog.ru","")
    if rel!=p: print(f"MISMATCH page={p} canonical={href}")
for h,ps in canon.items():
    if len(ps)>1: print("DUP canonical",h,ps)

print("\n== og:url vs canonical ==")
for p,t in pages.items():
    m=re.search(r'<meta[^>]*property="og:url"[^>]*content="([^"]+)"',t) or re.search(r'<meta[^>]*content="([^"]+)"[^>]*property="og:url"',t)
    c=re.search(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"',t) or re.search(r'<link[^>]*href="([^"]+)"[^>]*rel="canonical"',t)
    ogu=m.group(1) if m else None
    cu=c.group(1) if c else None
    if ogu and cu and ogu!=cu: print("OGURL != canonical",p,ogu,cu)
    if not ogu: print("no og:url",p)

print("\n== JSON-LD ==")
ld=re.compile(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',re.S)
for p,t in pages.items():
    for i,m in enumerate(ld.finditer(t)):
        try: json.loads(m.group(1))
        except Exception as e: print("LD-ERR",p,i,str(e)[:90])

print("\n== duplicate DOM ids ==")
idre=re.compile(r'\sid="([^"]+)"')
for p,t in pages.items():
    c=defaultdict(int)
    for m in idre.finditer(t): c[m.group(1)]+=1
    d={k:v for k,v in c.items() if v>1}
    if d: print(p,dict(list(d.items())[:8]))

print("\n== <title> and description ==")
for p,t in pages.items():
    ti=re.search(r'<title[^>]*>(.*?)</title>',t,re.S)
    de=re.search(r'<meta[^>]*name="description"[^>]*content="([^"]*)"',t) or re.search(r'<meta[^>]*content="([^"]*)"[^>]*name="description"',t)
    if not ti: print("NO title",p)
    if not de: print("NO description",p)
    elif len(de.group(1))<50: print("SHORT desc",p,len(de.group(1)))
titles=defaultdict(list)
for p,t in pages.items():
    ti=re.search(r'<title[^>]*>(.*?)</title>',t,re.S)
    if ti: titles[ti.group(1).strip()].append(p)
for k,v in titles.items():
    if len(v)>1: print("DUP title",repr(k[:60]),v)

print("\n== lang/charset/viewport ==")
for p,t in pages.items():
    h=t[:3000]
    if 'lang="ru"' not in h[:400]: print("lang?",p,h[:200].replace("\n"," ")[:120])
    if "charset" not in h: print("no charset",p)
    if "viewport" not in t[:6000]: print("no viewport",p)
