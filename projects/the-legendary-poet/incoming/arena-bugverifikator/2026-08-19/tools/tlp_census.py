#!/usr/bin/env python3
"""Head/meta/JSON-LD census over the prerendered TLP pages (order-insensitive attribute parsing)."""
import json
import os
import re
from collections import defaultdict

CACHE = '/home/user/tlp/live'
pages = {}
for f in sorted(os.listdir(CACHE)):
    if not f.endswith('.html') or f.startswith('_'):
        continue
    p = '/' if f == 'root.html' else '/' + f[:-5].replace('__', '/')
    pages[p] = open(os.path.join(CACHE, f), encoding='utf-8', errors='replace').read()
print('pages:', len(pages))


def attrs(tag):
    return {m.group(1).lower(): m.group(2) for m in re.finditer(r'([a-zA-Z:_-]+)\s*=\s*"([^"]*)"', tag)}


def metas(t):
    return [attrs(m.group(0)) for m in re.finditer(r'<meta\b[^>]*>', t)]


def links(t):
    return [attrs(m.group(0)) for m in re.finditer(r'<link\b[^>]*>', t)]


def meta_val(t, key):
    for a in metas(t):
        if a.get('name', '').lower() == key or a.get('property', '').lower() == key:
            return a.get('content')
    return None


def link_href(t, rel):
    for a in links(t):
        if rel in a.get('rel', '').lower().split():
            return a.get('href')
    return None


report = defaultdict(list)
titles = defaultdict(list)
canons = defaultdict(list)
for p, t in pages.items():
    title = re.search(r'<title[^>]*>(.*?)</title>', t, re.S)
    title = title.group(1).strip() if title else None
    canon = link_href(t, 'canonical')
    desc = meta_val(t, 'description')
    ogt = meta_val(t, 'og:title')
    ogd = meta_val(t, 'og:description')
    ogi = meta_val(t, 'og:image')
    ogu = meta_val(t, 'og:url')
    robots = meta_val(t, 'robots')
    tw = meta_val(t, 'twitter:card')
    if not title:
        report['no-title'].append(p)
    else:
        titles[title].append(p)
    if not canon:
        report['no-canonical'].append(p)
    else:
        canons[canon].append(p)
        want = 'https://thelegendarypoet.ru' + ('' if p == '/' else p)
        if canon.rstrip('/') != want.rstrip('/'):
            report['canonical-mismatch'].append((p, canon))
    if not desc:
        report['no-description'].append(p)
    for key, val in (('og:title', ogt), ('og:description', ogd), ('og:image', ogi), ('og:url', ogu)):
        if not val:
            report['missing-' + key].append(p)
    if ogu and canon and ogu.rstrip('/') != canon.rstrip('/'):
        report['ogurl!=canonical'].append((p, ogu, canon))
    if not robots:
        report['no-robots-meta'].append(p)
    if not tw:
        report['no-twitter-card'].append(p)
    # JSON-LD
    for i, m in enumerate(re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', t, re.S)):
        try:
            json.loads(m.group(1))
        except Exception as e:
            report['jsonld-parse-error'].append((p, i, str(e)[:80]))
    if 'application/ld+json' not in t:
        report['no-jsonld'].append(p)
    # html lang / charset
    if not re.search(r'<html[^>]*\slang="ru"', t[:400]):
        report['html-lang'].append(p)

for k, v in titles.items():
    if len(v) > 1:
        report['duplicate-title'].append((k[:50], v))
for k, v in canons.items():
    if len(v) > 1:
        report['duplicate-canonical'].append((k, v))

for k in sorted(report):
    v = report[k]
    print(f'\n### {k}: {len(v)}')
    for item in v[:10]:
        print('   ', item)
