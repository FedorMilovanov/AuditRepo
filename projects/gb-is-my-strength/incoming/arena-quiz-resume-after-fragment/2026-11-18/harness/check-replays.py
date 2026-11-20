#!/usr/bin/env python3
"""Check immediate entry, trusted CTA effect, timing guards and A/B provenance."""
from hashlib import sha256
from pathlib import Path
from urllib.parse import urljoin
import json
import sys

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
WITNESS = 'resume-after-fragment-witness.json'
TO = '/articles/dzhon-gill-chast-2-uchenyi/'
FROM = '/articles/dzhon-gill-chast-1-chelovek/'
A, TITLE = 'sec-canticles', 'Песнь Песней: самый личный труд Гилла'
A_HREF = TO + '#' + A
ACK = 'gb:reader-resume-offered:v1:gb-strength:' + TO.rstrip('/')
FIX = {'plain': (None, None), 'toc': ('sec-hebrew', None), 'pactum': ('sec-pactum', 'Евреям 10:7'),
       'deism': ('sec-deism-polemic', 'Второзаконие 33:8'), 'cold': ('sec-pactum', 'Евреям 10:7')}
IDS = [f'{a}-{w}' for w in (390, 1440) for a in ('plain', 'pactum', 'deism', 'cold')] + ['toc-390']
PNG = sorted([f'{arm}-{phase}.png' for arm in ('plain-390', 'pactum-390', 'pactum-1440') for phase in ('offered', 'acted')] + ['toc-390-offered.png'])


def sha(p):
    return sha256(p.read_bytes()).hexdigest()


def load(p):
    return json.loads(p.read_text(encoding='utf-8'))


def hit(x):
    return bool(x and x['inView'] and x['hit'])


def measure(r):
    arm, w = r['arm'], r['width']
    assert r['ok'] and not r['errors'] and r['id'] == f'{arm}-{w}'
    assert (w, r['height']) in ((390, 844), (1440, 900))
    section, query = FIX[arm]
    fragment = '#' + section if section else ''
    target = TO + fragment
    cold = arm == 'cold'
    origin, landing, after = (r[k] for k in ('origin', 'landing', 'after'))
    assert origin['url'] == FROM and origin['scroll'] == 0 and origin['recordHistory'] == []
    assert origin['acknowledgements'] == [] and origin['toast'] is None
    acts, urls, times = [], [], []
    if cold:
        assert 'source' not in r and 'read' not in r and origin['saved'] is None
    else:
        src, read = r['source'], r['read']
        saved = read['saved']
        assert read['doc'] == src['doc'] and src['url'] == read['url'] == A_HREF
        assert hit(src['section']) and hit(read['section']) and src['section']['top'] > read['readingLine'] > read['section']['top']
        assert src['focus'] == A and urljoin(TO, src['quiz']['glsQuizSource'][2]) == A_HREF
        assert src['quiz'] == read['quiz'] and src['quiz']['glsQuizVerdict'][0].startswith('Неверно')
        assert read['scroll'] - src['scroll'] == r['wheelDelta'] > 0 and not read['locks'] and read['toast'] is None
        assert (saved['sectionId'], saved['sectionTitle'], saved['scrollY']) == (A, TITLE, read['scroll'])
        assert saved['source'] == 'reader-state-v1' and saved['routePath'] == TO.rstrip('/')
        assert 8 <= saved['progress'] <= 92 and not saved['completed'] and not saved['dismissedAt']
        assert (origin['saved'] | {'savedAt': saved['savedAt']}) == saved and origin['saved']['savedAt'] >= saved['savedAt']
        acts.extend([('review', src['doc'], TO, A_HREF), ('wheel', src['doc'], A_HREF, None)])
        urls.append(TO)
        times.append(src['doc'])
    urls.extend([FROM, target])
    times.extend([origin['doc'], landing['doc']])
    assert len(set(times)) == len(times) and r['docs'] == [[u.split('#')[0], 200, 'no-store'] for u in urls]
    shows = [e for e in r['life'] if e['type'] == 'pageshow']
    assert [(e['doc'], e['url']) for e in shows] == list(zip(times, urls, strict=True))
    assert all(e['persisted'] is False for e in shows)
    for t in ('DOMContentLoaded', 'load'):
        assert [e['doc'] for e in r['life'] if e['type'] == t] == times
    arrived = [e for e in r['life'] if e['doc'] == landing['doc'] and e['type'] in ('DOMContentLoaded', 'load', 'pageshow')]
    assert [e['type'] for e in arrived] == ['DOMContentLoaded', 'load', 'pageshow']
    assert not any(e['doc'] == landing['doc'] and e['type'] == 'hashchange' for e in r['life'])

    if query:
        chosen = r['chosen']
        a = chosen['result']
        assert chosen['focus'] == 'cp-input' and chosen['palette'] and chosen['pagefind']
        assert chosen['scope'] == 'scripture' and chosen['query'] == query and chosen['groups'] == [query]
        assert a['id'] == 'cp-option-0' and a['role'] == 'option' and a['selected'] and hit(a['box'])
        assert (a['label'], a['group'], a['href']) == (query, 'Точные вхождения', target)
        assert chosen['recordHistory'] == [] and chosen['saved'] == origin['saved']
        assert chosen['locks'] == ['overlay:search:command-palette']
        method = 'exact-preview' if w == 1440 and arm != 'deism' else 'exact-enter'
        if method == 'exact-preview':
            assert hit(a['preview'])
        assert sorted(r['pagefindResponses']) == [['GET', '/pagefind/pagefind.js', 200], ['HEAD', '/pagefind/pagefind.js', 200]]
        assert r['refResponses'] == [['GET', '/data/scripture-search-index.json', 200]]
    else:
        assert r['native']['href'] == target
        label = 'Раввинист — христианин с Мишной в руках' if arm == 'toc' else 'Перейти к части' if w == 390 else 'Читать Часть II →'
        assert r['native']['text'] == label
        chosen = r['native']['before']
        assert chosen['toc'] == (w == 390) and chosen['saved'] == origin['saved']
        assert not r['pagefindResponses'] and not r['refResponses']
        method = 'native'
    assert chosen['doc'] == origin['doc'] and chosen['url'] == FROM
    acts.append((method, chosen['doc'], FROM, target))
    assert landing['url'] == target and landing['match'] == section and landing['nav'] == 'navigate'
    assert landing['h1'].startswith('Джон Гилл') and landing['history'] == chosen['history'] + 1
    assert landing['saved'] == origin['saved'] and not hit(landing['section'])
    assert bool(hit(landing['explicit'])) == bool(section)
    assert landing['recordHistory'] == ([origin['saved']['title']] if query and not cold else after['recordHistory'] if cold else [])
    if cold:
        assert len(landing['recordHistory']) == 1 and landing['recordHistory'][0].startswith('Джон Гилл')
    for k in ('doc', 'url', 'match', 'history', 'recordHistory'):
        assert landing[k] == after[k], k
    for p in (landing, after):
        assert not p['palette'] and not p['toc'] and not p['bodyFixed'] and not p['locks']
        assert not (p['legacy'] or {}).get('shown')

    shift = after['scroll'] - landing['scroll']
    outcome = r['outcome']
    if not landing['toast']:
        assert outcome == ('no-saved-control' if cold else 'not-offered-with-saved')
        assert after['toast'] is None and after['trace']['toast'] == []
        assert landing['acknowledgements'] == after['acknowledgements'] == [] and 'beforeClick' not in r
        assert section and hit(after['explicit']) and shift == 0
        assert after['saved'] == origin['saved']
        assert after['ageMs'] >= (2600 if cold else 4800)
    else:
        assert not cold and outcome == ('shown-noop' if section else 'restored')
        b = r['beforeClick']
        for p in (landing, b):
            t = p['toast']
            assert t['on'] and hit(t['go']) and t['role'] == 'status'
            assert t['label'].endswith(str(origin['saved']['progress']) + '%')
        assert after['toast'] is None and b['scroll'] == landing['scroll'] and b['doc'] == landing['doc']
        assert landing['acknowledgements'] == after['acknowledgements'] == [ACK]
        acts.append(('restore', b['doc'], target, None))
        restore = r['acts'][-1]
        assert restore['action'] == 'restore' and restore['focus'] == 'gbs2-resume-go'
        assert restore['scroll'] == b['scroll'] and b['ageMs'] <= restore['ageMs'] < 5200
        off, on, close, gone = after['trace']['toast']
        assert [t['phase'] for t in (off,on,close,gone)] == ['off', 'on', 'off', 'absent']
        assert all(t['hash'] == fragment for t in (off,on,close,gone))
        assert off['scroll'] == 0 and on['scroll'] == landing['scroll']
        assert 850 <= on['ageMs'] - off['ageMs'] <= 1150
        assert 0 <= close['ageMs'] - restore['ageMs'] <= 100 and 350 <= gone['ageMs'] - close['ageMs'] <= 600
        assert gone['ageMs'] - off['ageMs'] < 5600 and after['ageMs'] - gone['ageMs'] >= 880
        scroll_after = [y for t, y in after['trace']['scroll'] if t >= restore['ageMs']]
        if section:
            assert shift == 0 and not scroll_after and after['explicit'] == b['explicit'] and not hit(after['section'])
            assert after['saved'] == b['saved'] == origin['saved'] and close['scroll'] == gone['scroll'] == landing['scroll']
        else:
            assert landing['scroll'] == 0 and shift > 1200 and hit(after['section']) and after['match'] is None
            assert scroll_after == [after['scroll']] and close['scroll'] == gone['scroll'] == after['scroll']
            assert after['saved']['sectionId'] == A
    assert [(x['action'], x['doc'], x['url'], x['link']) for x in r['acts']] == acts
    assert all(x['trusted'] for x in r['acts'])
    for x in r['acts']:
        a = x['action']
        assert x['type'] == ('keydown' if a in ('review', 'exact-enter') else 'wheel' if a == 'wheel' else 'click')
        if a == 'wheel':
            assert r['wheelDelta'] == x['delta']
        if a.startswith('exact-'):
            assert x['result']['href'] == target and x['result']['group'] == 'Точные вхождения'
    return {'id': r['id'], 'entry': method, 'url': target, 'saved': origin['saved']['sectionId'] if not cold else None,
            'savedY': origin['saved']['scrollY'] if not cold else None, 'offer': bool(landing['toast']),
            'landY': landing['scroll'], 'landTarget': landing['match'], 'targetHit': hit(landing['explicit']),
            'afterY': after['scroll'], 'shift': shift, 'savedHeadingHit': hit(after['section']),
            'outcome': outcome, 'sameSavedSnapshotAfterClick': None if not landing['toast'] else after['saved'] == origin['saved']}


def main():
    ra, rb, prev, dist, pa, pb, output = map(Path, sys.argv[1:])
    assert ra.resolve() != rb.resolve() and pa.resolve() != pb.resolve()
    wa, wb = load(ra / WITNESS), load(rb / WITNESS)
    assert wa != wb, 'A and B contain the same capture'
    prior = load(prev)
    for k in ('anchor', 'chromium', 'node', 'playwright', 'fixtures', 'method', 'distSha256', 'pagefind'):
        assert wa[k] == wb[k], k
    assert wa['anchor'] == prior['anchor'] == ANCHOR
    assert wa['fixtures'] == {k: {'section': s, 'query': q} for k,(s,q) in FIX.items()}
    pins, old = wa['distSha256'], prior['distSha256']
    shared = pins.keys() & old.keys()
    assert all(pins[k] == old[k] for k in shared) and all(sha(dist / k) == v for k,v in (pins | old).items())
    assert {'js/search.js', 'js/reader-state.js', 'js/floating-cluster-controller.js', 'js/bookmark-engine.js', 'css/command-palette.css',
            'data/scripture-search-index.json', TO.lstrip('/')+'index.html', FROM.lstrip('/')+'index.html'} <= pins.keys()
    idx, html = load(dist / 'data/scripture-search-index.json'), (dist / (TO.lstrip('/')+'index.html')).read_text(encoding='utf-8')
    for section, query in FIX.values():
        if section:
            assert f'id="{section}"' in html
        if query:
            (record,) = (s for s in idx['references'] if s['label'] == query)
            (occ,) = record['occurrences']
            assert occ['url'] == TO and occ['anchor'] == section
    pf = wa['pagefind']
    assert pf['treeSha256'] == prior['pagefind']['treeSha256'] and pf['files'] == 147 and pf['entry']['version'] == '1.5.2'
    assert pf['requestedSha256'].keys() == {'pagefind.js'} and not (dist / 'pagefind').exists()
    for d in (pa, pb):
        table = {p.relative_to(d).as_posix(): sha(p) for p in sorted(d.rglob('*')) if p.is_file()}
        data = json.dumps(table, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()
        assert len(table) == pf['files'] and sha256(data).hexdigest() == pf['treeSha256']
        assert {k: table[k] for k in pf['requestedSha256']} == pf['requestedSha256']
        assert load(d/'pagefind-entry.json') == pf['entry']
    results = []
    for w in (wa, wb):
        assert [r['id'] for r in w['rows']] == IDS
        series = []
        for r in w['rows']:
            try:
                series.append(measure(r))
            except AssertionError as e:
                e.add_note(f'{r["id"]}, run {"A" if w is wa else "B"}')
                raise
        results.append(series)
    stable = ('id', 'entry', 'url', 'saved', 'savedY', 'landY', 'landTarget', 'targetHit', 'afterY', 'shift', 'savedHeadingHit')
    for a, b in zip(*results, strict=True):
        assert all(a[k] == b[k] for k in stable), (a, b)
    shots = []
    for run, rs in zip((ra, rb), results, strict=True):
        expected = {n for n in PNG if any(n.startswith(r['id']+'-') and r['offer'] for r in rs)}
        actual = {p.name for p in run.glob('*.png')}
        assert expected == actual, (expected, actual)
        shots.append(actual)
    images = {n: {'a':sha(ra/n) if n in shots[0] else None,
                  'b':sha(rb/n) if n in shots[1] else None} for n in sorted(shots[0] | shots[1])}
    same = sum(p['a'] == p['b'] for p in images.values())
    assert same == len(shots[0] & shots[1])
    observed = [*results[0], *results[1]]
    assert all(any(x['id'].endswith(str(width)) and x['entry'].startswith('exact') and x['outcome']=='shown-noop' for x in observed)
               for width in (390,1440))
    assert any(x['id']=='toc-390' and x['outcome']=='shown-noop' for x in observed)
    counters = {'a': len(IDS), 'b': len(IDS), 'distPins':len(pins), 'priorPinsRechecked':len(old), 'sharedPins':len(shared),
                'pagefindFiles':pf['files'], 'pagefindRequested':len(pf['requestedSha256']), 'pngIdentical':same, 'pngCompared':len(shots[0] & shots[1]),
                'withHashNoop':sum(x['outcome']=='shown-noop' for x in observed),
                'withHashNoOfferDespiteSaved':sum(x['outcome']=='not-offered-with-saved' for x in observed),
                'withoutHashWorks':sum(x['outcome']=='restored' for x in observed),
                'unsavedNoOffer':sum(x['outcome']=='no-saved-control' for x in observed)}
    output.write_text(json.dumps({'verdict':'PASS', 'anchor':ANCHOR, 'chromium':wa['chromium'], 'node':wa['node'], 'playwright':wa['playwright'],
        'counts':counters, 'priorWitnessSha256':sha(prev), 'witnessSha256':{'a':sha(ra/WITNESS),'b':sha(rb/WITNESS)},
        'pagefindTreeSha256':pf['treeSha256'], 'cases':{'a':results[0],'b':results[1]}, 'images':images}, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print('PASS:', json.dumps(counters, ensure_ascii=False))


if __name__ == '__main__':
    main()
