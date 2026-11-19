#!/usr/bin/env python3
"""Check two independent clean-history reader captures and bind artifact hashes."""
from hashlib import sha256
from pathlib import Path
from urllib.parse import urljoin
import json
import sys

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
WITNESS = 'search-recent-return-witness.json'
SRC, BIO = '/articles/dzhon-gill-chast-2-uchenyi/', '/biografii/'
START = SRC + '#sec-canticles'
ANATOMY = '/articles/anatomiya-padeniya-pyat-stadiy/'
RECENT, EXACT, ARTICLE = 'Недавние запросы', 'Точные вхождения', 'Статьи'
TITLE = 'Джон Гилл (1697–1771). Часть II: Учёный — экзегеза, система, иврит'
CASE_FIXTURES = {
    'A': {'query': 'Второзаконие 33:8', 'target': SRC + '#sec-deism-polemic', 'scope': 'scripture'},
    'B': {'query': 'Евреям 10:7', 'target': SRC + '#sec-pactum', 'scope': 'scripture'},
    'C': {'query': 'Анатомия падения', 'target': ANATOMY, 'scope': 'all'},
}
PAIRS = {'ab': ['A', 'B'], 'ba': ['B', 'A'], 'mixed': ['A', 'C']}
IDS = [f'{arm}-{width}' for width in (390, 1440) for arm in PAIRS]
IMG = sorted(['ab-390-recent.png', 'ab-390-replayed.png', 'ab-390-landed.png', 'ab-390-manual.png',
              'ab-390-recovered.png', 'ba-1440-replayed.png', 'mixed-1440-recent.png'])
BIO_ROWS = ['Биографии служителей', 'Джон Гилл (1697–1771). Часть IV: Наследие',
            'Джон Гилл (1697–1771). Часть I: Человек', 'Джон Гилл: справочник']
BIO_URLS = [BIO, '/articles/dzhon-gill-chast-3-nasledie/', '/articles/dzhon-gill-chast-1-chelovek/',
            '/articles/dzhon-gill-spravochnik/']
PREVIEW_MISS = '/articles/images/og-biografii.jpg'


def digest(p):
    return sha256(p.read_bytes()).hexdigest()


def load(p):
    return json.loads(p.read_text(encoding='utf-8'))


def recent_labels(s):
    assert all(x['role'] == 'option' for x in s['recent'])
    return [x['label'] for x in s['recent']]


def active(s, group, href):
    a = s['active']
    assert s['focus'] == 'cp-input' and s['palette'] and s['loaded']
    assert a['group'] == group and a['href'] == href and a['role'] == 'option'
    assert a['selected'] and a['box']['inView'] and a['box']['hit']
    return a


def replay(chosen, replayed, text, target):
    assert active(chosen, RECENT, None)['label'] == text and chosen['input'] == '' and chosen['scope'] == 'all'
    assert active(replayed, ARTICLE, target) and replayed['input'] == text and replayed['scope'] == 'all'
    assert replayed['recent'] == [] and replayed['groups'][0]['group'] == ARTICLE
    for k in ('doc', 'url', 'history', 'records', 'quiz'):
        assert chosen[k] == replayed[k], k  # First Enter on a recent row does not navigate.


def summarize(r):
    arm, width = r['arm'], r['width']
    exact_activation = 'preview' if width == 1440 else 'Enter'
    assert r['ok'] and not r['errors'] and width in (390, 1440)
    source = r['source']
    assert source['url'] == START and source['target']['hit'] and source['focus'] == 'sec-canticles'
    assert not source['records'] and not source['palette'] and not source['locks']
    assert source['quiz']['glsQuizVerdict'][0].startswith('Неверно') and not source['quiz']['glsQuizVerdict'][1]
    assert source['quiz']['glsQuizSource'][2].endswith('#sec-canticles')
    assert len(r['attempts']) == 2
    expected_acts, projected, accepted = [], [], []
    current = source
    for name, lane in zip(PAIRS[arm], r['attempts'], strict=True):
        f = CASE_FIXTURES[name]
        assert lane['fixture'] == f
        opened, selected, arrived, reopened = (lane[k] for k in ('opened', 'selected', 'arrived', 'reopened'))
        is_exact = name in ('A', 'B')
        a = active(selected, EXACT if is_exact else ARTICLE, f['target'])
        assert selected['input'] == f['query'] and selected['scope'] == f['scope']
        assert opened['input'] == '' and opened['scope'] == 'all' and opened['palette']
        for k in ('records', 'doc', 'history', 'url', 'quiz'):
            assert opened[k] == selected[k] == current[k], k
        assert not arrived['palette'] and not arrived['locks'] and arrived['url'] == f['target']
        assert arrived['history'] == selected['history'] + 1
        stored = TITLE if is_exact else a['label']
        projected = [stored] + [n for n in projected if n != stored]
        assert arrived['records'] == projected == reopened['records'] == recent_labels(reopened)
        assert reopened['scope'] == 'all' and reopened['input'] == '' and reopened['doc'] == arrived['doc']
        if is_exact:
            assert a['label'] == f['query'] and a['preview']['hit'] == (width == 1440)
            assert arrived['doc'] == source['doc'] and arrived['quiz'] == source['quiz'] and arrived['target']
            if width == 1440:
                assert arrived['target']['inView'] and arrived['target']['hit']
        else:
            assert a['label'].startswith(f['query']) and arrived['h1'] == a['label']
            assert arrived['doc'] != source['doc']
        expected_acts.append((exact_activation if is_exact else 'Enter', f['query'], f['target'], selected['doc']))
        accepted.append({'typed': f['query'], 'target': f['target'], 'activation': expected_acts[-1][0],
                         'targetHit': arrived['target']['hit'] if arrived['target'] else None,
                         'historyLabels': recent_labels(reopened)})
        current = arrived
    if arm == 'mixed':
        c, d = (r['articleControl'][k] for k in ('chosen', 'replayed'))
        replay(c, d, projected[0], ANATOMY)
        assert c['doc'] == current['doc'] and c['records'] == projected
        expected_acts.append(('Enter', '', None, c['doc']))
    a, b = r['chosen'], r['replayed']
    replay(a, b, TITLE, BIO)
    assert a['records'] == projected and a['url'] == current['url'] and a['doc'] == current['doc']
    assert b['status'] == '4 рез.' and not b['empty'] and not b['loading']
    assert len(b['groups']) == 1 and [x['label'] for x in b['groups'][0]['items']] == BIO_ROWS
    expected_acts.append(('Enter', '', None, a['doc']))
    observed = {'id': r['id'], 'inputs': accepted, 'recentChoice': a['active']['label'],
                'rebuiltInput': b['input'], 'rebuiltScope': b['scope'], 'autoSelected': BIO,
                'rebuiltOptions': BIO_ROWS, 'firstEnterChangesDocument': False,
                'preview404': r['preview404']}
    assert b['previewImage']['attr'] == '../images/og-biografii.jpg' and b['previewImage']['path'] == PREVIEW_MISS
    assert b['previewImage']['width'] == 0
    assert r['preview404'] == ([['GET', PREVIEW_MISS, 404]] if width == 1440 else [])
    if width == 1440:
        assert b['previewImage']['complete']
    if arm == 'ba':
        assert [e['href'] for e in r['enumerated']] == BIO_URLS
        assert [e['label'] for e in r['enumerated']] == BIO_ROWS
        observed['enumeratedDestinations'] = BIO_URLS

    m, fin = r['manual'], r['final']
    first = CASE_FIXTURES[PAIRS[arm][0]]
    assert active(m, EXACT, first['target'])['label'] == first['query']
    assert m['input'] == first['query'] and m['scope'] == 'scripture'
    assert not fin['palette'] and not fin['locks']
    check_index = [['GET', '/data/scripture-search-index.json', 200]]
    navigation = [SRC]
    visible_urls = [SRC]
    doc_times = [source['doc']]
    if arm == 'ab':
        land = r['landed']
        assert land['url'] == BIO and land['h1'] == BIO_ROWS[0] and land['scroll'] == 0
        assert land['doc'] != source['doc'] and land['nav'] == 'navigate' and land['history'] == b['history'] + 1
        assert not land['palette'] and land['quiz']['glsQuizVerdict'] is None
        assert m['doc'] == land['doc'] and m['records'] == land['records'] and m['url'] == BIO
        assert [' '.join(n.split()) for n in land['records']] == [BIO_ROWS[0], TITLE]
        assert fin['doc'] not in (source['doc'], land['doc']) and fin['nav'] == 'navigate'
        assert fin['url'] == first['target'] and fin['target']['inView'] and fin['target']['hit']
        assert fin['history'] == land['history'] + 1
        assert fin['records'] == [TITLE, land['records'][0]]
        expected_acts += [('Enter', TITLE, BIO, b['doc']), ('Enter', first['query'], first['target'], land['doc'])]
        navigation += [BIO, SRC]
        visible_urls += [BIO, first['target']]
        doc_times += [land['doc'], fin['doc']]
        check_index *= 2
        observed['secondEnter'] = [land['url'], land['h1'], land['scroll']]
        observed['manualRecovery'] = [fin['url'], fin['target']['hit']]
    elif arm == 'mixed':
        assert m['url'] == fin['url'] == ANATOMY and m['doc'] == fin['doc'] == current['doc']
        assert fin['records'] == m['records'] == projected
        navigation += [ANATOMY]
        visible_urls += [ANATOMY]
        doc_times += [current['doc']]
        check_index *= 2
        observed['articleHistoryControl'] = [projected[0], c['url'], d['active']['href']]
    else:
        assert m['url'] == fin['url'] == current['url'] and m['doc'] == fin['doc'] == source['doc']
        assert fin['records'] == projected == m['records'] and fin['quiz'] == m['quiz'] == source['quiz']
        observed['retainedReview'] = True
    assert r['docs'] == [[url, 200, 'no-store'] for url in navigation]
    assert r['refResponses'] == check_index
    page_shows = [e for e in r['life'] if e['type'] == 'pageshow']
    assert [e['doc'] for e in page_shows] == doc_times and [e['url'] for e in page_shows] == visible_urls
    assert all(e['persisted'] is False for e in page_shows)
    jumps = [CASE_FIXTURES[n]['target'] for n in PAIRS[arm] if n != 'C']
    assert [e['url'] for e in r['life'] if e['type'] == 'hashchange'] == jumps
    assert [e['url'] for e in r['life'] if e['type'] == 'popstate'] == jumps
    assert all(e['trusted'] and (e['key'] == 'Enter' if e['action'] == 'Enter' else e['type'] == 'click') for e in r['acts'])
    assert [(e['action'], e['input'], e['active']['href'], e['doc']) for e in r['acts']] == expected_acts
    assert len(r['indexResponses']) and all(x[2] == 200 for x in r['indexResponses'])
    assert ['HEAD', '/pagefind/pagefind.js', 200] in r['indexResponses'] and ['GET', '/pagefind/pagefind.js', 200] in r['indexResponses']
    for suffix in ('.pf_index', '.pf_fragment'):
        assert any(url.endswith(suffix) for _, url, _ in r['indexResponses'])
    return observed | {'ordinaryHTML': navigation, 'manualRequery': [m['input'], m['active']['href']]}


def main():
    a, b, previous, dist, ia, ib, receipt = map(Path, sys.argv[1:])
    assert a.resolve() != b.resolve() and ia.resolve() != ib.resolve()
    aw, bw = load(a / WITNESS), load(b / WITNESS)
    for k in ('anchor', 'chromium', 'playwright', 'node', 'server', 'fixtures', 'pagefind', 'distSha256'):
        assert aw[k] == bw[k], k
    assert aw['anchor'] == ANCHOR and aw['fixtures'] == CASE_FIXTURES | {'title': TITLE}
    assert aw['pagefind']['entry']['version'] == '1.5.2' and not (dist / 'pagefind').exists()
    entry = aw['pagefind']['entry']
    for p in (ia, ib):
        assert load(p / 'pagefind-entry.json') == entry
        index = {f.relative_to(p).as_posix(): digest(f) for f in sorted(p.rglob('*')) if f.is_file()}
        text = json.dumps(index, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode()
        assert len(index) == aw['pagefind']['files'] and sha256(text).hexdigest() == aw['pagefind']['treeSha256']
        assert {k: index[k] for k in aw['pagefind']['requestedSha256']} == aw['pagefind']['requestedSha256']
    old = load(previous)
    assert old['product'] == ANCHOR
    assert aw['pagefind']['treeSha256'] == old['pagefind']['treeSha256']
    prior, current = old['distSha256'], aw['distSha256']
    shared = prior.keys() & current.keys()
    assert shared and all(prior[k] == current[k] for k in shared)
    assert all(digest(dist / k) == v for k, v in (prior | current).items())
    ri = load(dist / 'data/scripture-search-index.json')
    html = (dist / (SRC.lstrip('/') + 'index.html')).read_text(encoding='utf-8')
    for n in ('A', 'B'):
        f = CASE_FIXTURES[n]
        (occ,) = next(x for x in ri['references'] if x['label'] == f['query'])['occurrences']
        assert occ['url'] + '#' + occ['anchor'] == f['target'] and occ['title'] == TITLE
        assert f'id="{occ["anchor"]}"' in html
    assert urljoin(SRC, '../images/og-biografii.jpg') == PREVIEW_MISS
    assert not (dist / PREVIEW_MISS.lstrip('/')).exists()
    assert (dist / urljoin(BIO, '../images/og-biografii.jpg').lstrip('/')).is_file()
    summaries = []
    for w in (aw, bw):
        assert [r['id'] for r in w['rows']] == IDS
        assert {url.removeprefix('/pagefind/') for r in w['rows'] for _, url, _ in r['indexResponses']} == w['pagefind']['requestedSha256'].keys()
        items = []
        for r in w['rows']:
            try:
                items.append(summarize(r))
            except AssertionError as exc:
                exc.add_note(f'{r["id"]}, run {"B" if w is bw else "A"}')
                raise
        summaries.append(items)
    for x, y in zip(*summaries, strict=True):
        assert x == y, {k: (x[k], y[k]) for k in x if x[k] != y[k]}
    assert sorted(f.name for f in a.glob('*.png')) == sorted(f.name for f in b.glob('*.png')) == IMG
    images = {name: {'a': digest(a / name), 'b': digest(b / name)} for name in IMG}
    same = sum(x['a'] == x['b'] for x in images.values())
    counts = {'a': len(IDS), 'b': len(IDS), 'distPins': len(current), 'priorPinsRechecked': len(prior),
              'sharedPins': len(shared), 'pagefindFiles': aw['pagefind']['files'],
              'pagefindRequested': len(aw['pagefind']['requestedSha256']), 'pngIdentical': same, 'pngCompared': len(IMG)}
    receipt.write_text(json.dumps({'verdict': 'PASS', 'anchor': ANCHOR, 'chromium': aw['chromium'],
        'playwright': aw['playwright'], 'node': aw['node'], 'counts': counts, 'pagefindTreeSha256': aw['pagefind']['treeSha256'],
        'priorWitnessSha256': digest(previous), 'witnessSha256': {'a': digest(a / WITNESS), 'b': digest(b / WITNESS)},
        'cases': summaries[0], 'images': images}, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'PASS {len(IDS)}+{len(IDS)}; {len(current)} dist pins & {len(prior)} prior ({len(shared)} shared); '
          f'{counts["pagefindFiles"]} Pagefind files / {counts["pagefindRequested"]} requested; {same}/{len(IMG)} identical PNGs')


if __name__ == '__main__':
    main()
