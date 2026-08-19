#!/usr/bin/env python3
"""Crawl thelegendarypoet.ru: sitemap routes + head/meta/JSON-LD census (order-insensitive parsing)."""
import json
import os
import re
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

BASE = 'https://thelegendarypoet.ru'
CACHE = '/home/user/tlp/live'
os.makedirs(CACHE, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0 (compatible; AuditRepo-bugverifikator/1.1; +audit)'}


def get(path, timeout=45):
    try:
        r = urllib.request.urlopen(urllib.request.Request(BASE + path, headers=UA), timeout=timeout)
        return r.status, r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:4000], dict(e.headers)
    except Exception as e:
        return None, str(e).encode(), {}


def fname(p):
    return os.path.join(CACHE, (p.strip('/').replace('/', '__') or 'root') + '.html')


def fetch(p):
    f = fname(p)
    if os.path.exists(f):
        return p, 200, open(f, 'rb').read(), {}
    s, b, h = get(p)
    if s == 200:
        open(f, 'wb').write(b)
    return p, s, b, h


if __name__ == '__main__':
    s, sm, hdr = get('/sitemap.xml')
    open(CACHE + '/_sitemap.xml', 'wb').write(sm)
    locs = [l.decode().replace(BASE, '') or '/' for l in re.findall(rb'<loc>(.*?)</loc>', sm)]
    print('sitemap urls:', len(locs))
    status = {}
    with ThreadPoolExecutor(max_workers=5) as ex:
        for p, st, b, h in ex.map(fetch, locs):
            status[p] = st
            if st != 200:
                print('NON-200', st, p)
    json.dump(status, open(CACHE + '/_status.json', 'w'), indent=1)
    print('fetched 200:', sum(1 for v in status.values() if v == 200))
    st, body, h = get('/')
    print('\n-- response headers for / --')
    for k in sorted(h):
        print(f'  {k}: {h[k][:110]}')
