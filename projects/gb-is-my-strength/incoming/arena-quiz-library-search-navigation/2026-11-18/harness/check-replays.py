#!/usr/bin/env python3
"""Independently replay the admission oracle over two real browser captures."""
from hashlib import sha256
from pathlib import Path
import json
import sys

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

SRC = '/articles/dzhon-gill-chast-2-uchenyi/'
OTHER = '/articles/anatomiya-padeniya-pyat-stadiy/'
FROM, TO = 'sec-canticles', 'sec-deism-polemic'
START, EXACT = SRC + '#' + FROM, SRC + '#' + TO
SEARCH, LIB = 'overlay:search:command-palette', 'highlights'
NOTE = 'Черновик: перечитать пояснение к Песни Песней.'
EDIT = 'Правка: проверить источник в оригинале.'
REF, QUERY = 'Второзаконие 33:8', 'Анатомия падения'
CANCEL = 'gb-hl-note-cancel'
WITNESS = 'library-search-navigation-witness.json'
ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
ARMS = ['route-solo', 'route-draft', 'route-saved', 'route-edit', 'route-escape', 'exact-solo', 'exact-draft']
IDS = [f'{arm}-{width}' for width in (390, 1440) for arm in ARMS] + ['exact-link-1440']
IMAGES = ['exact-link-1440-destination.png', 'exact-solo-1440-destination.png', 'route-draft-390-back.png',
          'route-draft-390-reopened.png', 'route-draft-390-selected.png', 'route-solo-390-back.png',
          'route-solo-390-selected.png']


def digest(path):
    return sha256(path.read_bytes()).hexdigest()


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def doc_urls(rows):
    assert all(status == 200 and cache == 'no-store' for _, status, cache in rows)
    return [url for url, _, _ in rows]


def summarize(r, exact_title):
    arm = r['arm']
    stack = arm not in ('route-solo', 'exact-solo', 'exact-link')
    exact = arm.startswith('exact-')
    route = not exact and arm != 'route-escape'
    save_first = arm in ('route-saved', 'route-edit')
    draft = stack and arm != 'route-saved'
    src, sr, final = (r[k] for k in ('source', 'selected', 'final'))
    s = sr['selected']
    lock_pair = [LIB, SEARCH] if stack else [SEARCH]
    start_focus = src['focus']
    start_scroll = src['scroll']
    pinned_position = ['fixed', f'-{start_scroll}px']
    assert r['ok'] and not r['errors']
    assert start_focus == FROM and start_scroll > 400 and src['url'] == START and not src['locks']
    assert src['from']['inView'] and src['from']['hit'] and not src['to']['inView'] and not src['notes']
    assert src['quiz']['glsQuizVerdict'][0].startswith('Неверно') and not src['quiz']['glsQuizVerdict'][1]
    assert src['quiz']['glsQuizSource'][2].endswith('#' + FROM) and not src['quiz']['glsQuizSource'][1]
    assert sr['quiz'] == src['quiz'] and sr['focus'] == 'cp-input' and sr['doc'] == src['doc']
    assert sr['url'] == START and sr['history'] == src['history'] and sr['body'] == pinned_position and sr['scroll'] == 0
    assert sr['locks'] == lock_pair and sr['owners'] == ['search:command-palette'] and not sr['searchHistory']
    assert sr['editor']['open'] == draft and sr['library']['open'] == stack and sr['palette']['open']
    assert not sr['palette']['inert'] and sr['pagefindReady'] and sr['inputHit']['hit'] is not stack
    assert s['rendered'] and s['selected'] and s['activeClass'] and s['role'] == 'option' and s['hit']['inView']
    assert s['hit']['hit'] is not stack and s['hit']['layer'] == ('library' if stack else 'search')
    assert sr['inputHit']['layer'] == ('library' if stack else 'search')
    assert sr['input'] == (REF if exact else QUERY) and s['group'] == ('Точные вхождения' if exact else 'Статьи')
    assert s['href'] == (EXACT if exact else OTHER) and (s['title'] == REF if exact else s['title'].startswith(QUERY))
    if draft:
        assert sr['editor']['value'] == (EDIT if arm == 'route-edit' else NOTE) and r['toCancel'][-1] == CANCEL
    if save_first:
        assert sr['notes'] == r['saved']['state']['notes'] and r['saved']['trace'][-1] == 'note-submit'
        assert len(sr['notes']) == 1 and sr['notes'][0]['text'] == NOTE and sr['notes'][0]['url'] == SRC
        assert sr['notes'][0]['id'].startswith('note') and sr['notes'][0]['savedAt'] > 0
    else:
        assert not sr['notes']
    assert ['HEAD', '/pagefind/pagefind.js', 200] in r['indexResponses']
    assert ['GET', '/pagefind/pagefind.js', 200] in r['indexResponses']
    assert all(status == 200 for _, _, status in r['indexResponses'])
    if exact:
        assert r['indexJSON'] == [['GET', '/data/scripture-search-index.json', 200]]
        assert sr['scope'] == 'scripture' and r['scopeTabs'][-1] == 'scope:scripture'
    else:
        assert sr['scope'] == 'all' and not r['indexJSON']
        assert all(any(url.endswith(suffix) for _, url, _ in r['indexResponses']) for suffix in ('.pf_index', '.pf_fragment'))

    pageshows = [e for e in r['lifecycle'] if e['type'] == 'pageshow']
    assert all(e['trusted'] and e['persisted'] is False for e in pageshows)
    assert pageshows[0]['doc'] == src['doc'] and pageshows[0]['url'] == SRC
    html = doc_urls(r['docs'])
    beforeunload = [e for e in r['overlay'] if e.get('reason') == 'beforeunload']
    assert not final['locks'] and not final['library']['open'] and not (final['palette'] or {}).get('open')
    out = {'id': r['id'], 'activation': 'Escape' if arm == 'route-escape' else 'click' if arm == 'exact-link' else 'Enter',
           'result': [s['title'], s['group'], s['href']], 'hit': [sr['inputHit']['layer'], s['hit']['layer']],
           'before': [start_focus, start_scroll], 'html200': html, 'navigationDelta': final['history'] - src['history'],
           'pageshowPersisted': [e['persisted'] for e in pageshows]}
    if arm == 'route-escape':
        es = r['escaped']
        assert not beforeunload and not r['enter'] and len(pageshows) == 1 and html == [SRC]
        assert es['focus'] == CANCEL and es['editor'] == sr['editor'] and es['locks'] == [LIB] and es['activeHit']['hit']
        assert es['doc'] == final['doc'] == src['doc'] and es['url'] == final['url'] == START and not final['searchHistory']
        assert final['quiz'] == src['quiz'] and final['scroll'] == start_scroll and final['from']['hit']
        assert [n['text'] for n in final['notes']] == [NOTE]
        assert any(e['type'] == 'keydown' and e['key'] == 'Escape' and e['target'] == 'cp-input' and e['trusted']
                   for e in r['currentEvents'])
        return out | {'escape': [CANCEL, True, LIB], 'finished': [final['focus'], final['scroll'], True]}

    dst, back = r['destination'], r['back']
    assert dst['url'] == s['href'] and back['url'] == final['url'] == START
    assert dst['history'] == back['history'] == final['history'] == src['history'] + 1
    search_history = [exact_title if exact else s['title']]
    assert dst['searchHistory'] == back['searchHistory'] == final['searchHistory'] == search_history
    assert dst['notes'] == back['notes'] == sr['notes']
    if arm == 'exact-link':
        assert not r['enter'] and s['linkHit']['inView'] and s['linkHit']['hit']
        assert any(e['type'] == 'click' and e['target'] == 'cp-read-btn' and e['trusted'] for e in r['currentEvents'])
    else:
        assert len(r['enter']) == 1
        (ev,) = r['enter']
        assert ev['trusted'] and ev['type'] == 'keydown' and ev['key'] == 'Enter' and ev['target'] == ev['focus'] == 'cp-input'
        assert ev['doc'] == src['doc'] and ev['url'] == START and ev['locks'] == lock_pair and ev['editor'] == sr['editor']
        assert not ev['searchHistory'] and ev['selected']['href'] == dst['url'] and ev['selected']['id'] == s['id']
    out |= {'back': [back['focus'], back['scroll'], back['from']['inView'], back['from']['hit']],
            'historyTitle': search_history[0]}
    if route:
        assert len(pageshows) == 3 and html == [SRC, OTHER, SRC]
        assert len({src['doc'], dst['doc'], back['doc']}) == 3 and [e['doc'] for e in pageshows] == [src['doc'], dst['doc'], back['doc']]
        assert [e['url'] for e in pageshows] == [SRC, OTHER, START] and back['nav'] == 'back_forward'
        assert dst['h1'].startswith(QUERY) and dst['focus'] == 'gbs-world' and dst['scroll'] == 0 and not dst['locks']
        assert not back['locks'] and back['focus'] == 'gbs-world' and not back['library']['open'] and not back['palette']
        assert not back['editor']['open'] and back['fragmentTarget'] == FROM and back['body'] == ['static', '']
        assert back['from']['inView'] is not stack and back['from']['hit'] is not stack
        assert back['editor']['value'] == sr['editor']['value']
        assert back['scroll'] == (0 if stack else start_scroll)
        assert final['scroll'] == back['scroll'] and back['reader'] == dst['reader']
        assert len(beforeunload) == 1
        (close,) = beforeunload
        assert close['doc'] == src['doc'] and close['url'] == START and close['owners'] == []
        assert close['locks'] == ([LIB] if stack else []) and close['editor'] == sr['editor'] and close['searchHistory'] == search_history
        assert close['body'] == (pinned_position if stack else ['static', '']) and close['scroll'] == (0 if stack else start_scroll)
        (reasons,) = r['notRestored']
        assert any(reason == 'BackForwardCacheDisabledByCommandLine' for _, reason in reasons)
        opened = r['quizBack']
        q = opened['quiz']
        assert opened['learning']['open'] and opened['focus'] == 'tabQuiz'
        assert q['glsQuizVerdict'][:2] == ['', True] and q['glsQuizExplanation'][1] and q['glsQuizSource'][1]
        assert q['glsQuizQuestion'][0] and not q['glsQuizConf'][1] and q['options'] and all(disabled for _, disabled in q['options'])
        assert opened['doc'] == back['doc'] and opened['doc'] == final['doc']
        assert final['notes'] == sr['notes']
        if stack:
            ed = r['editorBack']
            assert ed['editor'] == {'open': True, 'value': NOTE if save_first else ''}
            assert ed['focus'] == 'gb-hl-note-text' and ed['notes'] == sr['notes'] and ed['doc'] == back['doc']
        return out | {'documentCount': 3, 'closeBeforeLeaving': [close['locks'], close['scroll'], close['body']],
                      'quizAfterBack': 'unanswered', 'backReaderY': (back['reader'] or {}).get('scroll'),
                      'noteCount': len(back['notes']), 'hiddenValueOnBack': back['editor']['value'],
                      'reopenedValue': r.get('editorBack', {}).get('editor', {}).get('value'),
                      'bfcacheNotUsed': [reason for _, reason in reasons]}

    assert not beforeunload and html == [SRC] and not r['notRestored']
    assert len(pageshows) == 1 and dst['doc'] == back['doc'] == final['doc'] == src['doc']
    assert dst['fragmentTarget'] == TO and back['fragmentTarget'] == FROM
    assert dst['quiz'] == back['quiz'] == final['quiz'] == src['quiz']
    assert [e['url'] for e in r['lifecycle'] if e['type'] == 'hashchange'] == [EXACT, START]
    assert [e['url'] for e in r['lifecycle'] if e['type'] == 'popstate'] == [EXACT, START]
    if arm == 'exact-link':
        assert dst['to']['inView'] and dst['to']['hit'] and not dst['to']['inert'] and not dst['locks']
        assert dst['scroll'] > start_scroll and not dst['palette']['open'] and back['from']['hit']
    else:
        assert dst['locks'] == back['locks'] == lock_pair and dst['body'] == back['body'] == pinned_position
        assert dst['palette']['open'] and back['palette']['open'] and dst['scroll'] == back['scroll'] == 0
        assert dst['focus'] == back['focus'] == 'gbs-world' and dst['from']['inert']
        assert dst['to']['rect'][1] > r['height'] and not dst['to']['inView'] and not dst['to']['hit'] and dst['to']['inert']
        assert dst['editor'] == back['editor'] == sr['editor']
        assert r['afterEscape']['focus'] == (CANCEL if stack else FROM) and r['afterEscape']['locks'] == ([LIB] if stack else [])
        assert r['afterEscape']['editor'] == sr['editor'] and final['scroll'] == start_scroll and final['from']['hit']
        assert [n['text'] for n in final['notes']] == ([NOTE] if stack else [])
    return out | {'documentCount': 1, 'target': [dst['to']['rect'][1], dst['to']['inView'], dst['to']['hit'], dst['to']['inert']],
                  'destination': [dst['focus'], dst['scroll'], dst['locks']], 'quizAfterBack': 'same-review',
                  'draftAfterBack': back['editor']['value'] if back['editor']['open'] else None,
                  'noteCountAfterClose': len(final['notes'])}


def main():
    a, b, previous, dist, ia, ib, receipt = map(Path, sys.argv[1:])
    assert a.resolve() != b.resolve() and ia.resolve() != ib.resolve()
    wa, wb = load(a / WITNESS), load(b / WITNESS)
    starts = [e['doc'] for w in (wa, wb) for r in w['rows'] for e in r['lifecycle']
              if e['type'] == 'pageshow' and e['persisted'] is False]
    assert starts and len(starts) == len(set(starts)), 'same capture reused: repeated document start'
    for key in ('product', 'chromium', 'playwright', 'node', 'server', 'pagefind', 'distSha256'):
        assert wa[key] == wb[key], key
    assert wa['product'] == ANCHOR and wa['pagefind']['entry']['version'] == '1.5.2'
    assert not (dist / 'pagefind').exists()
    for folder in (ia, ib):
        assert load(folder / 'pagefind-entry.json') == wa['pagefind']['entry']
        assert digest(folder / 'pagefind-entry.json') == wa['pagefind']['manifestSha256']
        tree = {p.relative_to(folder).as_posix(): digest(p) for p in sorted(folder.rglob('*')) if p.is_file()}
        stable = json.dumps(tree, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()
        assert len(tree) == wa['pagefind']['indexFiles']
        assert sha256(stable).hexdigest() == wa['pagefind']['treeSha256']
        assert {k: tree[k] for k in wa['pagefind']['fetchedSha256']} == wa['pagefind']['fetchedSha256']
    old = load(previous)
    assert old['anchor'] == ANCHOR
    new_pins, old_pins = wa['distSha256'], old['distSha256']
    shared = sorted(new_pins.keys() & old_pins.keys())
    assert shared and all(new_pins[k] == old_pins[k] for k in shared)
    assert all(digest(dist / k) == v for k, v in (old_pins | new_pins).items())
    (ref,) = [r for r in load(dist / 'data/scripture-search-index.json')['references'] if r['label'] == REF]
    (occurrence,) = ref['occurrences']
    assert occurrence['url'] + '#' + occurrence['anchor'] == EXACT
    assert 'id="' + TO + '"' in (dist / (SRC.lstrip('/') + 'index.html')).read_text(encoding='utf-8')
    summaries = []
    for w in (wa, wb):
        assert [r['id'] for r in w['rows']] == IDS
        fetched = {url.removeprefix('/pagefind/') for r in w['rows'] for _, url, _ in r['indexResponses']}
        assert fetched == w['pagefind']['fetchedSha256'].keys()
        result = []
        for r in w['rows']:
            try:
                result.append(summarize(r, occurrence['title']))
            except AssertionError as exc:
                exc.add_note(f'{r["id"]}, run {"B" if w is wb else "A"}')
                raise
        summaries.append(result)
    for ra, rb in zip(*summaries, strict=True):
        assert ra == rb, {k: (ra[k], rb[k]) for k in ra if ra[k] != rb[k]}
    assert sorted(p.name for p in a.glob('*.png')) == sorted(p.name for p in b.glob('*.png')) == IMAGES
    images = {f: {'a': digest(a / f), 'b': digest(b / f)} for f in IMAGES}
    matched = sum(item['a'] == item['b'] for item in images.values())
    receipt.write_text(json.dumps({'verdict': 'PASS', 'product': ANCHOR, 'chromium': wa['chromium'],
        'node': wa['node'], 'playwright': wa['playwright'], 'counts': {'a': len(IDS), 'b': len(IDS),
        'distPins': len(new_pins), 'priorPinsRechecked': len(old_pins), 'sharedPins': len(shared),
        'pagefindFilesEachBuild': wa['pagefind']['indexFiles'], 'pagefindFilesRequested': len(wa['pagefind']['fetchedSha256']),
        'pngIdentical': matched, 'pngCompared': len(images)}, 'pagefindTreeSha256': wa['pagefind']['treeSha256'],
        'priorWitnessSha256': digest(previous), 'witnessSha256': {'a': digest(a / WITNESS), 'b': digest(b / WITNESS)},
        'scenarios': summaries[0], 'images': images}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'PASS {len(IDS)}+{len(IDS)} contexts; {len(new_pins)} dist pins, {len(old_pins)} prior ({len(shared)} shared); '
          f'{wa["pagefind"]["indexFiles"]} index files / {len(wa["pagefind"]["fetchedSha256"])} requested; {matched}/{len(images)} PNGs equal')


if __name__ == '__main__':
    main()
