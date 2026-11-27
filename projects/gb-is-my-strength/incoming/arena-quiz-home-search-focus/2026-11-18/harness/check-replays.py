#!/usr/bin/env python3
"""Check the focus, lock and event transitions in two fresh browser replays."""
import hashlib
import json
import struct
import sys
from pathlib import Path

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
SEARCH, LEGACY = 'search:command-palette', 'tooltip-mobile-sheet'
LOCK = 'overlay:' + SEARCH
HERO, HEADER, CTA = 'heroSearchBar', 'gbSearchBtn', 'resumeReadingLink'
GILL = '/articles/dzhon-gill-chast-2-uchenyi/'
STRANDED = {'empty-quick-escape', 'empty-quick-normal', 'empty-quick-touch-emulation',
            'empty-quick-held-escape', 'learning-quick-escape'}
SECONDS = {'empty-quick-second-escape', 'learning-quick-second-escape'}
BUTTONS = {'empty-quick-close-enter', 'empty-quick-close-click'}
CONTROLS = {'empty-dwell-escape', 'empty-early-escape', 'empty-header-escape', 'empty-wide-quick-escape'}
ALL = STRANDED | SECONDS | BUTTONS | CONTROLS
SCREENSHOTS = ('empty-quick-escape.png', 'empty-quick-second-escape.png')


def load(p):
    return json.loads(p.read_text(encoding='utf-8'))


def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def lock_sample(s, locks, search=False):
    assert s['locks'] == locks, s
    assert s['locked'] == bool(locks) and s['bodyPosition'] == ('fixed' if locks else 'static'), s
    assert s['owners'] == ([{'ownerId': SEARCH, 'lockScroll': True}] if search else []), s


def visible(s, target):
    assert s['target'] == target and s['inView'] and s['hit'], s


def behind_viewport(s, target):
    assert s['target'] == target and s['focusVisible'], s
    assert s['top'] >= s['viewport']['height'] and not s['inView'] and not s['hit'] and s['scrollY'] == 0, s


def verify(r):
    name = r['id']
    assert r['ok'] and r['sameHome'] and not r['errors'] and r['emergencyUnlocks'] == 0, name
    assert r['optionalHead'] == [['HEAD', '/pagefind/pagefind.js', 404]]
    learning = name.startswith('learning-')
    assert r['learning'] == learning
    assert r['documents'] == ([[GILL, 200]] if learning else []) + [['/', 200]]
    assert r['initial']['search'] is None and r['initial']['scrollY'] == 0 and r['initial']['target'] == 'body'
    assert r['card']['hidden'] == (not learning)
    if learning:
        assert r['source']['fragment'] == '#sec-canticles' and r['source']['retained']
        assert r['card']['href'] == GILL[:-1] + '#sec-hebrew'
        saved = r['card']['saved']
        assert saved['source'] == 'reader-state-v1' and saved['sectionId'] == 'sec-hebrew' and saved['progress'] >= 4
    else:
        assert r['card']['href'] is None and r['card']['saved'] is None
    width, height = (1440, 900) if name == 'empty-wide-quick-escape' else (390, 844)
    assert (r['width'], r['height']) == (width, height)
    assert r['touch'] == (name == 'empty-quick-touch-emulation')
    assert r['motion'] == ('no-preference' if name == 'empty-quick-normal' else 'reduce')
    assert r['second'] == (name in SECONDS)
    header = name == 'empty-header-escape'
    accepts_legacy = name in STRANDED | SECONDS | BUTTONS
    remains = name in STRANDED | SECONDS
    opener = HEADER if header else HERO
    next_target = CTA if learning else 'themeToggle' if header else 'directions-share'

    if not header:
        term = r['glossary']
        assert term['target'] == 'hero-term' and term['term']['expanded'] == 'true' and term['tip']['ported']
        lock_sample(term, [LEGACY] if width == 390 else [])
        dwell = r['termDwellMs']
        assert dwell >= 500 if name == 'empty-dwell-escape' else 0 <= dwell < 350
    visible(r['opener'], opener)
    lock_sample(r['opener'], [LEGACY] if accepts_legacy else [])
    opened = r['open']
    visible(opened, 'search-input')
    assert opened['viewport'] == {'width': width, 'height': height}
    assert opened['search'] == {'open': True, 'hidden': 'false', 'inert': False,
                                'inputExpanded': 'true', 'value': '', 'heroExpanded': 'true'}
    assert opened['term']['inert']
    if accepts_legacy:
        assert opened['tip']['ported'] and opened['tip']['inert'] and opened['term']['expanded'] == 'true'
    lock_sample(opened, [LOCK, LEGACY] if accepts_legacy else [LOCK], search=True)
    held_ms = 3350 if name == 'empty-quick-held-escape' else 700 if name in BUTTONS else 0
    assert r['hold'] == held_ms
    if held_ms:
        h = r['held']
        assert h['ms'] - opened['ms'] >= held_ms - 4
        assert h['search']['value'] == ('г' if held_ms == 3350 else '')
        visible(h, 'search-input')
        lock_sample(h, [LOCK, LEGACY], search=True)
    assert [s['after'] for s in r['closed']] == [0, 80, 240]
    closed = r['closed'][-1]
    visible(closed, opener)
    assert not closed['term']['inert']
    assert closed['search'] == {'open': False, 'hidden': 'true', 'inert': True,
                                'inputExpanded': 'false', 'value': '', 'heroExpanded': 'false'}
    lock_sample(closed, [LEGACY] if remains else [])
    if remains:
        assert closed['tip']['ported'] and not closed['tip']['inert'] and closed['term']['expanded'] == 'true'
        assert closed['tip']['visibility'] == 'hidden' and closed['tooltipRootClass']
    if name in BUTTONS:
        assert closed['tip'] is None
    if name in SECONDS:
        s = r['beforeTabEscape']
        visible(s, opener)
        lock_sample(s, [])
        assert s['tip'] is None
    assert [s['after'] for s in r['next']] == [0, 150, 500, 1000]
    next_s = r['next'][-1]
    if name in STRANDED:
        for s in r['next']:
            behind_viewport(s, next_target)
            lock_sample(s, [LEGACY])
        last = r['afterTabEscape']
        behind_viewport(last, next_target)
        lock_sample(last, [])
        assert last['tip'] is None
    else:
        visible(next_s, next_target)
        lock_sample(next_s, [])
    assert next_s['focusVisible']

    events = r['events']
    owner_events = [(e['kind'], e['owner'], e['reason']) for e in events if e['kind'].startswith('gb:overlay-')]
    assert owner_events == [('gb:overlay-open', SEARCH, 'open'), ('gb:overlay-close', SEARCH, 'close')]
    clicks = [(e['control'], e['detail'], e['trusted']) for e in events if e['kind'] == 'click']
    assert clicks[0] == (opener, 0, True)
    if name in BUTTONS:
        assert clicks[1:] == [('search-close', 0 if name.endswith('-enter') else 1, True)]
    else:
        assert clicks[1:] == []
        esc = [e for e in events if e.get('key') == 'Escape' and e['target'] == 'search-input']
        assert [(e['kind'], e['trusted']) for e in esc] == [('key-capture', True)], esc
    if name in STRANDED | SECONDS:
        extra_target = opener if name in SECONDS else next_target
        extra = [e for e in events if e.get('key') == 'Escape' and e['target'] == extra_target]
        assert [(e['kind'], e['trusted']) for e in extra] == [('key-capture', True), ('key-bubble', True)], extra


def facts(r):
    def select(s):
        return {k: s[k] for k in ('target', 'href', 'inView', 'hit', 'locks', 'top', 'scrollY')}
    result = {'inputLocks': r['open']['locks'], 'closed': select(r['closed'][-1]), 'tab': select(r['next'][-1])}
    for key in ('beforeTabEscape', 'afterTabEscape'):
        if key in r:
            result[key] = select(r[key])
    return result


def agree(a, b):
    assert a.keys() == b.keys() and a['inputLocks'] == b['inputLocks']
    for k in a.keys() - {'inputLocks'}:
        assert a[k].keys() == b[k].keys()
        for x, value in a[k].items():
            if x in ('top', 'scrollY'):
                assert abs(value - b[k][x]) <= 2, (k, x, value, b[k][x])
            else:
                assert value == b[k][x], (k, x, value, b[k][x])


def main():
    a_dir, b_dir, stage20, dist, receipt = map(Path, sys.argv[1:])
    a, b = [load(d / 'home-search-focus-witness.json') for d in (a_dir, b_dir)]
    assert a != b, 'A and B contain the same capture'
    for k in ('anchor', 'chromium', 'playwright', 'node', 'distSha256'):
        assert a[k] == b[k], k
    old = load(stage20)
    assert a['anchor'] == old['anchor'] == ANCHOR
    previous, current = old['distSha256'], a['distSha256']
    common = current.keys() & previous.keys()
    assert len(previous) == 67 and all(current[f] == previous[f] for f in common)
    assert {'index.html', 'js/search.js', 'js/site-utils.js', 'js/site.js', 'js/glossary.js',
            'css/command-palette.css', 'data/glossary.json', 'data/glossary-policy.json'} <= current.keys()
    for f, checksum in (previous | current).items():
        p = Path(f)
        assert not p.is_absolute() and '..' not in p.parts and digest(dist / p) == checksum, f
    rows = []
    for u, v in zip(a['results'], b['results'], strict=True):
        assert u['id'] == v['id']
        verify(u)
        verify(v)
        fa, fb = facts(u), facts(v)
        agree(fa, fb)
        rows.append({'id':u['id'], 'a':fa, 'b':fb})
    assert {r['id'] for r in rows} == ALL and len(rows) == len(ALL)
    shots = {}
    for f in SCREENSHOTS:
        paths = [d / f for d in (a_dir, b_dir)]
        for p in paths:
            data = p.read_bytes()
            assert data[:16] == b'\x89PNG\r\n\x1a\n\x00\x00\x00\x0dIHDR'
            assert struct.unpack('>II', data[16:24]) == (390, 844)
        ha, hb = map(digest, paths)
        shots[f] = {'width':390, 'height':844, 'sha256A':ha, 'sha256B':hb, 'byteIdentical':ha == hb}
    out = {'anchor':ANCHOR, 'casesPerRun':len(rows), 'replays':2, 'currentDistPins':len(current),
           'stage20PinsRechecked':len(previous), 'sharedDistPins':len(common), 'screenshots':shots, 'rows':rows}
    receipt.write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'PASS: {len(rows)}×2, {len(current)} current / {len(previous)} prior dist pins; '
          f'{len(STRANDED)} off-screen next stops per run; {sum(s["byteIdentical"] for s in shots.values())}/2 identical PNGs')


if __name__ == '__main__':
    main()
