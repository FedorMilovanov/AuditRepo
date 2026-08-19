#!/usr/bin/env python3
"""Check every same-origin URL referenced from head links, JSON-LD and the web manifest."""
import json
import os
import re
import urllib.error
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor

BASE = 'https://thelegendarypoet.ru'
UA = {'User-Agent': 'AuditRepo-bugverifikator/1.1'}
CACHE = '/home/user/tlp/live'


def head(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u if u.startswith('http') else BASE + u, headers=UA), timeout=45)
        r.read(64)
        return u, r.status, r.headers.get('Content-Type', '')
    except urllib.error.HTTPError as e:
        return u, e.code, ''
    except Exception as e:
        return u, 'ERR', str(e)[:40]


refs = defaultdict(set)
for f in sorted(os.listdir(CACHE)):
    if not f.endswith('.html') or f.startswith('_'):
        continue
    p = '/' if f == 'root.html' else '/' + f[:-5].replace('__', '/')
    t = open(os.path.join(CACHE, f), encoding='utf-8', errors='replace').read()
    for m in re.finditer(r'<link\b[^>]*href="([^"]+)"', t):
        refs[m.group(1)].add(p + ' (link)')
    for m in re.finditer(r'<meta\b[^>]*content="(https://thelegendarypoet\.ru[^"]+|/[^"]+)"', t):
        if re.search(r'(og:image|twitter:image|image)', m.group(0)):
            refs[m.group(1)].add(p + ' (meta)')
    for m in re.finditer(r'<script[^>]*ld\+json[^>]*>(.*?)</script>', t, re.S):
        try:
            d = json.loads(m.group(1))
        except Exception:
            continue
        s = json.dumps(d)
        for u in re.findall(r'"(https://thelegendarypoet\.ru[^"]*)"', s):
            refs[u].add(p + ' (jsonld)')

# manifest
try:
    mr = urllib.request.urlopen(urllib.request.Request(BASE + '/site.webmanifest', headers=UA), timeout=40)
    man = json.load(mr)
    for icon in man.get('icons', []):
        refs[icon['src']].add('site.webmanifest')
    print('manifest icons:', [i.get('src') for i in man.get('icons', [])])
except Exception as e:
    print('manifest error:', e)

same = sorted(u for u in refs if u.startswith('/') or u.startswith(BASE))
print('same-origin referenced URLs:', len(same))
bad = []
with ThreadPoolExecutor(max_workers=8) as ex:
    for u, s, ct in ex.map(head, same):
        if s != 200:
            bad.append((u, s, sorted(refs[u])[:3]))
            print('  BAD', s, u, '<-', sorted(refs[u])[:3])
print('broken:', len(bad), 'of', len(same))
json.dump(bad, open('/home/user/tlp/meta_assets_bad.json', 'w'), ensure_ascii=False, indent=1)
