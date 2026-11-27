#!/usr/bin/env python3
"""Independently check UI actions, native navigation, controls, and byte provenance."""
from hashlib import sha256
from pathlib import Path
from urllib.parse import urljoin
import json
import sys

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
WITNESS = 'search-resume-route-witness.json'
KEY = '/articles/dzhon-gill-chast-2-uchenyi'
ROUTE, OTHER = KEY + '/', '/articles/anatomiya-padeniya-pyat-stadiy/'
ID, TITLE = 'sec-canticles', 'Песнь Песней: самый личный труд Гилла'
HASH, ACT = '#' + ID, 'Продолжить'
IDS = [f'{arm}-{width}' for width in (390, 1440) for arm in ('home', 'other-enter', 'current-enter', 'other-dismiss')]
IDS += ['other-preview-1440', 'home-redirect-390', 'other-enter-redirect-390', 'current-enter-redirect-390']
IMAGES = sorted(['home-390-card.png', 'home-390-landing.png', 'other-enter-390-palette.png', 'other-enter-390-landing.png',
                 'other-enter-390-recovered.png', 'other-dismiss-390-palette.png', 'other-dismiss-390-landing.png',
                 'other-preview-1440-palette.png'])


def digest(p):
    return sha256(p.read_bytes()).hexdigest()


def load(p):
    return json.loads(p.read_text(encoding='utf-8'))


def hit(s):
    return bool(s and s['inView'] and s['hit'])


def measure(r):
    arm, w, redirect = r['arm'], r['width'], r['redirect']
    assert r['ok'] and not r['errors']
    assert (w, r['height']) in ((390, 844), (1440, 900))
    assert r['id'] == f'{arm}{"-redirect" if redirect else ""}-{w}'
    home, current, dismiss = (arm == k for k in ('home', 'current-enter', 'other-dismiss'))
    route = ROUTE if redirect else KEY
    target = route + HASH if home else route
    src, read, land = r['source'], r['read']['after'], r['landing']
    saved = read['saved']
    assert src['doc'] == read['doc'] and src['url'] == read['url'] == ROUTE + HASH
    assert src['quiz']['glsQuizVerdict'][0].startswith('Неверно') and src['quiz']['glsQuizVerdict'][1] is False
    assert urljoin(ROUTE, src['quiz']['glsQuizSource'][2]) == ROUTE + HASH and src['quiz'] == read['quiz']
    assert src['focus'] == ID and hit(src['section']) and hit(read['section'])
    assert read['section']['top'] < read['readingLine'] < src['section']['top']
    assert read['scroll'] - src['scroll'] == r['read']['dy'] > 0
    assert (saved['source'], saved['routePath'], saved['sectionId'], saved['sectionTitle']) == ('reader-state-v1', KEY, ID, TITLE)
    assert saved['scrollY'] == read['scroll'] and 8 <= saved['progress'] < 92 and not saved['completed'] and saved['dismissedAt'] == 0
    assert read['searchHistory'] == [] and not read['locks'] and not read['palette']

    expected_calls = [('review', src['doc'], ROUTE), ('wheel', src['doc'], ROUTE + HASH)]
    paths, urls, docs = [ROUTE], [ROUTE], [src['doc']]
    if not current:
        h = r['home']
        assert h['home']['hidden'] is False and h['home']['href'] == KEY + HASH
        assert h['home']['meta'].casefold() == f'{TITLE} · {saved["progress"]}% прочитано'.casefold()
        assert h['home']['title'] == saved['title'] and h['url'] == '/' and h['searchHistory'] == []
        assert h['saved']['savedAt'] >= saved['savedAt'] and (h['saved'] | {'savedAt': saved['savedAt']}) == saved
        paths.append('/')
        urls.append('/')
        docs.append(h['doc'])
        saved = h['saved']
        if dismiss:
            d = r['dismiss']
            assert d['doc'] == h['doc'] and d['history'] == h['history']
            assert d['home']['hidden'] and d['home']['href'] is None
            assert (d['saved'] | {'dismissedAt': 0}) == saved and d['saved']['dismissedAt'] > saved['savedAt']
            saved = d['saved']
            expected_calls.append(('dismiss', h['doc'], '/'))

    if home:
        dep = r['homeReady']
        assert dep['doc'] == h['doc'] and dep['history'] == h['history'] and hit(dep['home']['go'])
        expected_calls += [('wheel', h['doc'], '/'), ('home', h['doc'], '/')]
        assert r['pagefindResponses'] == []
    else:
        origin, dep = r['origin'], r['palette']
        assert dep['doc'] == origin['doc'] and dep['url'] == origin['url'] and dep['history'] == origin['history']
        if current:
            assert origin['doc'] == src['doc'] and origin['url'] == src['url'] and dep['quiz'] == read['quiz']
            assert hit(origin['section'])
        else:
            assert origin['url'] == OTHER and origin['doc'] != src['doc'] and origin['scroll'] == 0
            paths.append(OTHER)
            urls.append(OTHER)
            docs.append(origin['doc'])
        assert dep['palette'] and dep['locks'] == ['overlay:search:command-palette']
        assert dep['pagefind'] and dep['query'] == '' and dep['focus'] == 'cp-input' and dep['searchHistory'] == []
        a = dep['result']
        assert a['group'] == ACT and a['id'] == 'cp-option-0' and a['selected'] and a['role'] == 'option' and hit(a['box'])
        assert a['href'] == KEY and a['detail'] == 'Раздел: ' + TITLE and a['label'] == saved['title']
        assert a['meta'] == str(saved['progress']) + '%' and ACT == dep['groups'][0] and 'Недавние запросы' not in dep['groups']
        assert dep['saved'] == saved and dep['candidate'] == (saved | {'path': KEY})
        expected = 'preview' if arm == 'other-preview' else 'enter'
        expected_calls.append((expected, dep['doc'], dep['url']))
        if expected == 'preview':
            assert w == 1440 and hit(a['preview'])
        assert sorted(r['pagefindResponses']) == [['GET', '/pagefind/pagefind.js', 200], ['HEAD', '/pagefind/pagefind.js', 200]]

    assert land['url'] == target and land['nav'] == 'navigate' and land['history'] == dep['history'] + 1
    assert land['h1'].startswith('Джон Гилл') and land['sectionText'] == TITLE
    assert land['saved']['sectionId'] == ID and land['saved']['sectionTitle'] == TITLE
    assert not land['palette'] and not land['locks'] and land['body'][0] != 'fixed'
    paths.append(route)
    urls.append(target)
    docs.append(land['doc'])
    assert len(set(docs)) == len(docs), 'fresh document, not just a changed href'
    expected_docs = [[p, 200, 'no-store', None] for p in paths]
    if redirect:
        expected_docs.insert(-1, [KEY, 308, 'no-store', ROUTE])
    assert r['docs'] == expected_docs
    shows = [e for e in r['life'] if e['type'] == 'pageshow']
    assert [(e['doc'], e['url']) for e in shows] == list(zip(docs, urls, strict=True)) and all(e['persisted'] is False for e in shows)

    restored = None
    if home:
        assert land['match'] == ID and hit(land['section']) and land['scroll'] > 1200 and land['searchHistory'] == []
    else:
        assert land['match'] is None and land['scroll'] == 0 and not hit(land['section']) and not land['section']['inView']
        assert land['searchHistory'] == [saved['title']]
        if dismiss:
            l = r['later']
            assert land['toast'] is None and l['toast'] is None and not hit((l['legacyToast'] or {}).get('show'))
            assert not land['acknowledgements'] and not l['acknowledgements']
            assert l['ageMs'] > land['ageMs'] + 1000 and l['scroll'] == 0 and not l['section']['inView']
            assert l['doc'] == land['doc'] and l['saved']['dismissedAt'] == land['saved']['dismissedAt'] == saved['dismissedAt']
        else:
            assert land['toast']['on'] and hit(land['toast']['go'])
            back = r['recovered']
            assert (back['doc'], back['url'], back['history']) == (land['doc'], land['url'], land['history'])
            assert back['toast'] is None and hit(back['section']) and back['match'] is None
            assert back['scroll'] > 1200 and not back['locks']
            restored = {'y': back['scroll'], 'headingTop': back['section']['top'], 'visible': hit(back['section'])}
            expected_calls.append(('toast', land['doc'], land['url']))
        if current:
            b = r['quizBack']
            assert b['doc'] == land['doc'] and b['url'] == land['url']
            assert b['quiz']['glsQuizVerdict'][:2] == ['', True] and b['quiz']['glsQuizSource'] == ['', True, '#'] and b['quiz']['glsQuizExplanation'][1]

    act = r['acts']
    assert [(e['action'], e['doc'], e['url']) for e in act] == expected_calls
    for e in act:
        name = e['action']
        assert e['trusted'] and e['type'] == ('wheel' if name == 'wheel' else 'keydown' if name in ('review', 'enter') else 'click')
        if name in ('enter', 'preview'):
            assert e['query'] == '' and e['result']['group'] == ACT and e['result']['href'] == KEY
            assert e['focus'] == ('cp-input' if name == 'enter' else 'cp-read-btn')
        if name == 'review':
            assert e['focus'] == 'glsQuizSource'
    assert act[1]['deltaY'] == r['read']['dy']
    return {'id': r['id'], 'before': dep['url'], 'destination': target, 'html': paths, 'slashRedirect': redirect,
            'savedSection': saved['sectionId'], 'savedY': saved['scrollY'], 'savedProgress': saved['progress'],
            'cta': 'home' if home else 'preview' if arm == 'other-preview' else 'enter',
            'landing': {'y': land['scroll'], 'headingTop': land['section']['top'], 'visible': hit(land['section']),
                        'toast': bool(land['toast'] and land['toast']['on']), 'target': land['match']},
            'restored': restored, 'dismissed': dismiss, 'quizResetInNewDocument': current}


def main():
    a, b, prev, prev_reader, dist, ia, ib, receipt = map(Path, sys.argv[1:])
    assert a.resolve() != b.resolve() and ia.resolve() != ib.resolve()
    aw, bw = load(a / WITNESS), load(b / WITNESS)
    starts = [e['doc'] for w in (aw, bw) for r in w['rows'] for e in r['life']
              if e['type'] == 'pageshow' and e['persisted'] is False]
    assert starts and len(starts) == len(set(starts)), 'same capture reused: repeated document start'
    for k in ('anchor', 'chromium', 'playwright', 'node', 'method', 'pagefind', 'distSha256'):
        assert aw[k] == bw[k], k
    assert aw['anchor'] == ANCHOR and not (dist / 'pagefind').exists()
    pins, pf = aw['distSha256'], aw['pagefind']
    assert pf['entry']['version'] == '1.5.2' and pf['files'] == 147
    assert pf['requestedSha256'].keys() == {'pagefind.js'}
    for i in (ia, ib):
        table = {f.relative_to(i).as_posix(): digest(f) for f in sorted(i.rglob('*')) if f.is_file()}
        compact = json.dumps(table, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode()
        assert load(i / 'pagefind-entry.json') == pf['entry']
        assert len(table) == pf['files'] and sha256(compact).hexdigest() == pf['treeSha256']
        assert {k: table[k] for k in pf['requestedSha256']} == pf['requestedSha256']
    prevs = [load(p) for p in (prev, prev_reader)]
    assert prevs[0]['pagefind']['treeSha256'] == pf['treeSha256']
    shared = []
    for p in prevs:
        assert p['anchor'] == ANCHOR
        before = p['distSha256']
        overlap = before.keys() & pins.keys()
        assert all(before[k] == pins[k] for k in overlap)
        assert all(digest(dist / k) == v for k, v in before.items())
        shared.append({'rechecked': len(before), 'shared': len(overlap)})
    assert all(digest(dist / k) == v for k, v in pins.items())
    required = {'index.html', ROUTE.lstrip('/') + 'index.html', OTHER.lstrip('/') + 'index.html', 'js/bookmark-engine.js', 'js/reader-state.js',
                'js/search.js', 'js/site-utils.js', 'js/floating-cluster-controller.js', 'css/command-palette.css', 'data/search-manifest.json'}
    assert required <= pins.keys()

    summaries = []
    for w in (aw, bw):
        assert [r['id'] for r in w['rows']] == IDS
        items = []
        for r in w['rows']:
            try:
                items.append(measure(r))
            except AssertionError as e:
                e.add_note(f'{r["id"]}, run {"A" if w is aw else "B"}')
                raise
        summaries.append(items)
    for x, y in zip(*summaries, strict=True):
        assert x == y, (x['id'], {k: (x[k], y[k]) for k in x if x[k] != y[k]})
    assert sorted(f.name for f in a.glob('*.png')) == sorted(f.name for f in b.glob('*.png')) == IMAGES
    images = {name: {'a': digest(a / name), 'b': digest(b / name)} for name in IMAGES}
    same = sum(x['a'] == x['b'] for x in images.values())
    assert same == len(IMAGES)
    s = summaries[0]
    counts = {'a': len(IDS), 'b': len(IDS), 'distPins': len(pins), 'homeDirect': 2*sum(i['cta'] == 'home' for i in s),
              'paletteAtTop': 2*sum(i['cta'] != 'home' for i in s), 'toastRecovered': 2*sum(i['restored'] is not None for i in s),
              'dismissedNoPrompt': 2*sum(i['dismissed'] for i in s), 'quizReset': 2*sum(i['quizResetInNewDocument'] for i in s),
              'pagefindFiles': pf['files'], 'pagefindRequested': len(pf['requestedSha256']), 'pngIdentical': same, 'pngCompared': len(IMAGES)}
    receipt.write_text(json.dumps({'verdict': 'PASS', 'anchor': ANCHOR, 'chromium': aw['chromium'], 'playwright': aw['playwright'],
        'node': aw['node'], 'counts': counts, 'pagefindTreeSha256': pf['treeSha256'], 'prior': {
        'recentSearch': {'sha256': digest(prev), **shared[0]}, 'sourceReaderState': {'sha256': digest(prev_reader), **shared[1]}},
        'witnessSha256': {'a': digest(a / WITNESS), 'b': digest(b / WITNESS)}, 'cases': s, 'images': images}, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'PASS {len(IDS)}+{len(IDS)}; {len(pins)} dist pins; {shared} prior; {pf["files"]} index files/{len(pf["requestedSha256"])} requested; {same} identical PNGs')


if __name__ == '__main__':
    main()
