#!/usr/bin/env python3
"""Fetch live production pages listed in sitemap.xml, cache to disk."""
import os, re, urllib.request, urllib.error, time, sys, json
from concurrent.futures import ThreadPoolExecutor

BASE = "https://gospod-bog.ru"
CACHE = "/home/user/audit/live"
os.makedirs(CACHE, exist_ok=True)

def get(url, timeout=40):
    req = urllib.request.Request(url, headers={"User-Agent": "AuditRepo-bugverifikator/1.0 (audit pass)"} )
    try:
        r = urllib.request.urlopen(req, timeout=timeout)
        return r.status, r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:2000], dict(e.headers)
    except Exception as e:
        return None, str(e).encode(), {}

def cache_name(path):
    n = path.strip("/").replace("/", "__") or "root"
    return os.path.join(CACHE, n + ".html")

def fetch_path(path):
    fn = cache_name(path)
    if os.path.exists(fn) and os.path.getsize(fn) > 0:
        return path, 200, open(fn, "rb").read()
    st, body, hdr = get(BASE + path)
    if st == 200:
        open(fn, "wb").write(body)
    return path, st, body

if __name__ == "__main__":
    st, sm, _ = get(BASE + "/sitemap.xml")
    open(os.path.join(CACHE, "_sitemap.xml"), "wb").write(sm)
    locs = re.findall(rb"<loc>(.*?)</loc>", sm)
    paths = [l.decode().replace(BASE, "") or "/" for l in locs]
    print("sitemap urls:", len(paths))
    results = {}
    with ThreadPoolExecutor(max_workers=6) as ex:
        for path, code, body in ex.map(fetch_path, paths):
            results[path] = code
            if code != 200:
                print("NON-200", code, path)
    json.dump(results, open(os.path.join(CACHE, "_status.json"), "w"), indent=1)
    print("fetched", sum(1 for v in results.values() if v == 200))
