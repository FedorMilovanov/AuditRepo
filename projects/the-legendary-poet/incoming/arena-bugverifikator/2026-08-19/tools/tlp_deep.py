#!/usr/bin/env python3
"""Deep checks: audio delivery, internal links, date parity, analytics/consent surface.

Note: bodies are read in full on purpose — an earlier truncated read (4096 bytes)
produced a false "no scripts on the page" reading during this pass.
"""
import json
import os
import re
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

BASE = 'https://thelegendarypoet.ru'
UA = {'User-Agent': 'AuditRepo-bugverifikator/1.1'}
CACHE = '/home/user/tlp/live'


def req(path, headers=None, method='GET'):
    h = dict(UA)
    if headers:
        h.update(headers)
    try:
        r = urllib.request.urlopen(urllib.request.Request(BASE + path, headers=h, method=method), timeout=45)
        return r.status, r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:500], dict(e.headers)
    except Exception as e:
        return 'ERR', str(e).encode(), {}


print('### 1. audio delivery')
src = open('/tmp/TLP/src/data/library/musicTracks.ts', encoding='utf-8', errors='replace').read()
audio_paths = sorted(set(re.findall(r"['\"](/audio/[A-Za-z0-9._/-]+)['\"]", src)))
print('audio refs in data:', audio_paths)
for a in audio_paths:
    s, b, h = req(a)
    s2, b2, h2 = req(a, headers={'Range': 'bytes=0-1023'})
    print(f'  {a}: {s} type={h.get("Content-Type")} len={h.get("Content-Length")} '
          f'accept-ranges={h.get("Accept-Ranges")} range-request={s2} content-range={h2.get("Content-Range")}')

print('\n### 2. internal links from prerendered pages')
pages = {}
for f in sorted(os.listdir(CACHE)):
    if f.endswith('.html') and not f.startswith('_'):
        p = '/' if f == 'root.html' else '/' + f[:-5].replace('__', '/')
        pages[p] = open(os.path.join(CACHE, f), encoding='utf-8', errors='replace').read()
targets = {}
for p, t in pages.items():
    for m in re.finditer(r'(?:href|src)="(/[^"#?]*)"', t):
        targets.setdefault(m.group(1), set()).add(p)
print('unique internal targets:', len(targets))


def chk(u):
    s, b, h = req(u)
    return u, s


bad = []
with ThreadPoolExecutor(max_workers=8) as ex:
    for u, s in ex.map(chk, sorted(targets)):
        if s != 200:
            bad.append((u, s, sorted(targets[u])[:3]))
            print('   BAD', s, u, sorted(targets[u])[:3])
print('   broken:', len(bad))

print('\n### 3. date parity: sitemap lastmod vs feed updated vs page JSON-LD')
sm = open(CACHE + '/_sitemap.xml', encoding='utf-8').read()
last = dict((m.group(1).replace(BASE, '') or '/', m.group(2))
            for m in re.finditer(r'<loc>(.*?)</loc>\s*<lastmod>(.*?)</lastmod>', sm, re.S))
feed = open(CACHE + '/_feed.xml', encoding='utf-8').read()
fd = {}
for m in re.finditer(r'<entry>(.*?)</entry>', feed, re.S):
    e = m.group(1)
    u = re.search(r'<link[^>]*href="([^"]*)"', e).group(1).replace(BASE, '')
    up = re.search(r'<updated>(.*?)</updated>', e)
    fd[u] = up.group(1) if up else None
rows = []
for p, t in pages.items():
    ld_dates = re.findall(r'"date(?:Published|Modified)"\s*:\s*"([^"]+)"', t)
    rows.append((p, last.get(p), fd.get(p), sorted(set(d[:10] for d in ld_dates))))
mism = [r for r in rows if r[1] and r[3] and r[1][:10] not in r[3]]
print('  pages where sitemap lastmod not among page JSON-LD dates:', len(mism))
for r in mism[:15]:
    print('   ', r[0], 'sitemap', r[1][:10], 'ld', r[3])
fm = [(p, last.get(p, '')[:10], fd[p][:10]) for p in fd if last.get(p) and fd[p][:10] != last[p][:10]]
print('  feed updated != sitemap lastmod:', len(fm), fm[:10])

print('\n### 4. analytics / consent surface in initial HTML')
s, b, h = req('/')
html = b.decode('utf-8', 'replace')
for pat in ['mc.yandex', 'metrika', 'googletagmanager', 'gtag', 'analytics', 'plausible', 'clarity']:
    if pat in html.lower():
        print('   initial HTML mentions:', pat)
print('   inline scripts:', len(re.findall(r'<script(?![^>]*src=)[^>]*>', html)))
print('   external scripts:', re.findall(r'<script[^>]*src="([^"]+)"', html))
print('   CSP meta:', [m.group(0)[:120] for m in re.finditer(r'<meta[^>]*>', html) if 'Content-Security-Policy' in m.group(0)])
