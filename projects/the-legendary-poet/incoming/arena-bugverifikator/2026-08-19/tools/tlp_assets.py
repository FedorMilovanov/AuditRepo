#!/usr/bin/env python3
"""Asset + metadata integrity for TheLegendaryPoet: source-referenced media vs repo files vs live HTTP."""
import json
import os
import re
import urllib.error
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor

SRC = '/tmp/TLP'
PUB = os.path.join(SRC, 'public')
BASE = 'https://thelegendarypoet.ru'
UA = {'User-Agent': 'AuditRepo-bugverifikator/1.1'}

# 1) collect asset paths referenced from src/ and public data
refs = defaultdict(set)          # asset path -> referencing files
pat = re.compile(r"['\"](/(?:images|audio|assets|brand|media)/[A-Za-z0-9._/-]+)['\"]")
for dp, dn, fn in os.walk(os.path.join(SRC, 'src')):
    if 'node_modules' in dp:
        continue
    for f in fn:
        if not f.endswith(('.ts', '.tsx', '.json', '.css')):
            continue
        p = os.path.join(dp, f)
        t = open(p, encoding='utf-8', errors='replace').read()
        for m in pat.finditer(t):
            refs[m.group(1)].add(os.path.relpath(p, SRC))

print('referenced asset paths:', len(refs))

missing_local = {a: sorted(v)[:3] for a, v in refs.items() if not os.path.exists(PUB + a)}
print('\n### referenced but MISSING in public/:', len(missing_local))
for a, v in sorted(missing_local.items())[:25]:
    print('   ', a, '<-', v)


def check(a):
    try:
        r = urllib.request.urlopen(urllib.request.Request(BASE + a, headers=UA), timeout=40)
        b = r.read(2048)
        return a, r.status, r.headers.get('Content-Type', ''), r.headers.get('Content-Length')
    except urllib.error.HTTPError as e:
        return a, e.code, '', None
    except Exception as e:
        return a, 'ERR', str(e)[:40], None


print('\n### live status of referenced assets')
bad = []
with ThreadPoolExecutor(max_workers=8) as ex:
    for a, s, ct, cl in ex.map(check, sorted(refs)):
        if s != 200:
            bad.append((a, s, sorted(refs[a])[:2]))
            print('   BAD', s, a, sorted(refs[a])[:2])
print('   live-broken:', len(bad), 'of', len(refs))

# 2) unused files in public/images (informational)
have = set()
for sub in ('images', 'audio'):
    d = os.path.join(PUB, sub)
    if not os.path.isdir(d):
        continue
    for dp, dn, fn in os.walk(d):
        for f in fn:
            have.add('/' + os.path.relpath(os.path.join(dp, f), PUB).replace('\\', '/'))
unused = sorted(have - set(refs))
print(f'\n### files in public/images+audio not referenced from src/: {len(unused)} of {len(have)}')
for u in unused[:20]:
    print('   ', u)

json.dump({'missing_local': missing_local, 'live_bad': bad, 'unused': unused},
          open('/home/user/tlp/asset_report.json', 'w'), ensure_ascii=False, indent=1)
