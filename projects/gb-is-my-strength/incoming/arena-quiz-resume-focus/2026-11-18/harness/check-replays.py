#!/usr/bin/env python3
"""Independently check homepage focus facts, A/B agreement and dist pins."""
import hashlib
import json
import struct
import sys
from pathlib import Path

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
CTA, DISMISS, SEARCH = 'resumeReadingLink', 'resumeReadingDismiss', 'heroSearchBar'
GILL = '/articles/dzhon-gill-chast-2-uchenyi'
ANATOMY = '/articles/anatomiya-padeniya-pyat-stadiy'
EXPECTED = {
    *(f'learning-390-{motion}-{arm}' for motion in ('reduce', 'no-preference')
      for arm in ('quick', 'dwell', 'escape')),
    'learning-1440-reduce-quick', 'anatomy-reading-390-reduce-quick',
    'empty-390-reduce-quick', 'empty-390-reduce-dwell', 'gill-reading-390-reduce-quick',
    *(f'dismiss-{kind}-{width}-reduce-escape' for width in (390, 1440) for kind in ('one', 'two')),
}
STEPS = [0, 250, 600, 1200]


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def pinned(pins, dist):
    for name, digest in pins.items():
        rel = Path(name)
        assert not rel.is_absolute() and '..' not in rel.parts, name
        assert sha(dist / rel) == digest, name


def is_sequential_focus(s, target):
    assert s['target'] == target and s['focusVisible'] and not s['hovered'], s


def on_screen(s, target):
    is_sequential_focus(s, target)
    assert s['inView'] and s['hit'] and not s['locked'], s


def below_screen(s, target, locked):
    is_sequential_focus(s, target)
    assert not s['inView'] and not s['hit'] and s['scrollY'] == 0, s
    assert s['top'] >= s['viewportHeight'], s
    assert s['locked'] == locked, s


def verify_row(r):
    assert r['ok'] and not r['errors'], r['id']
    scenario, arm = r['scenario'], r['arm']
    narrow = r['viewport']['width'] == 390
    assert r['viewport']['height'] == (844 if narrow else 900)
    empty, dismiss = scenario == 'empty', scenario.startswith('dismiss-')
    at_term = r['glossary']
    assert r['start']['target'] == 'body' and r['start']['scrollY'] == 0
    is_sequential_focus(at_term, 'hero-term')
    assert at_term['text'] == 'Экзегеза' and at_term['definitionOpener'] == 'hero-term'
    assert at_term['lockSources'] == (['tooltip-mobile-sheet'] if narrow else [])
    assert at_term['locked'] == narrow and at_term['bodyPosition'] == ('fixed' if narrow else 'static')
    assert at_term['articleOwner'] is None and at_term['overlays'] == []
    assert len(at_term['openDefinitions']) == 1
    first = next(e for e in r['focusEvents'] if e['kind'] == 'focusin' and e['from'] == 'hero-term')
    leave = next(e for e in r['focusEvents'] if e['kind'] == 'focusout' and e['from'] == 'hero-term')
    assert leave['to'] == SEARCH and first['trusted'] and leave['trusted']
    dwell = leave['ms'] - first['ms']
    assert dwell == r['heroTermDwellMs']
    assert dwell >= 500 if arm == 'dwell' else 0 <= dwell < 350
    is_sequential_focus(r['hero'], SEARCH)
    if arm == 'quick':
        assert r['hero']['definitionOpener'] == 'hero-term' and r['hero']['locked'] == narrow
    else:
        assert not r['hero']['locked'] and not r['hero']['openDefinitions']
        marker = r['dwell' if arm == 'dwell' else 'escaped']
        assert marker['target'] == 'hero-term'
        assert bool(marker['openDefinitions']) == (arm == 'dwell')
        assert marker['locked'] == (arm == 'dwell' and narrow)

    entry = r['entry']
    assert [s['ms'] for s in entry] == STEPS
    target = 'directions-share' if empty else 'card-term' if dismiss or scenario == 'gill-reading' else CTA
    if narrow and arm == 'quick':
        for s in entry:
            below_screen(s, target, True)
            assert s['bodyPosition'] == 'fixed' and s['lockSources'] == ['tooltip-mobile-sheet']
            assert s['definitionOpener'] == ('card-term' if target == 'card-term' else 'hero-term')
            assert s['articleOwner'] is None and s['overlays'] == []
    elif target != 'card-term':
        on_screen(entry[-1], target)
    if target == 'card-term':
        assert entry[-1]['text'] == 'Песнь Песней' and entry[-1]['definitionOpener'] == 'card-term'
        on_screen(r['cardTermExit'][-1], CTA)
    if r['id'] == 'learning-390-reduce-quick':
        s = r['afterRecovery']
        assert r['emergencyUnlocks'] == 1 and 2900 <= r['recoverySinceGlossaryMs'] <= 4500
        below_screen(s, CTA, False)
        assert s['bodyPosition'] == 'static' and s['lockSources'] == [] and len(s['openDefinitions']) == 1

    before = r['cardBefore']
    expected_reads = 0 if empty else 2 if scenario == 'dismiss-two' else 1
    assert len(r['reads']) == expected_reads
    assert before['hidden'] == empty
    if empty:
        assert before['href'] is None and r['savedBefore'] == [None, None]
    else:
        for article in r['reads']:
            rec = r['savedBefore'][0 if article['route'] == ANATOMY + '/' else 1]
            assert rec['source'] == 'reader-state-v1' and article['hit'] and not rec['dismissed']
            assert rec['scrollY'] == article['scrollY'] and 4 <= rec['progress'] < 97
        assert before['href'] == (ANATOMY + '#metod' if scenario == 'anatomy-reading'
                                  else GILL + ('#sec-hebrew' if scenario == 'learning' else '#sec-canticles'))

    expected_resume = before['href']
    if dismiss:
        on_screen(r['atDismiss'], DISMISS)
        steps = r['dismissal']
        assert [s['ms'] for s in steps] == STEPS
        assert r['stampChangedInAction']
        assert not r['savedBefore'][1]['dismissed']
        assert r['savedAfter'] == [r['savedBefore'][0], {**r['savedBefore'][1], 'dismissed': True}]
        on_screen(r['next'], 'directions-share')
        after, reload = r['cardAfter'], r['reload']
        assert reload['type'] == 'reload' and reload['saved'] == r['savedAfter']
        assert after['listHidden'] and after['remaining'] == []
        for k in ['hidden', 'listHidden', 'remaining', 'href']:
            assert reload['card'][k] == after[k], k
        if scenario == 'dismiss-one':
            assert before['remaining'] == [] and after['hidden']
            assert steps[0]['target'] in ('body', DISMISS)
            assert all(s['primaryHidden'] and not s['hit'] and not s['locked'] for s in steps)
            assert all(s['target'] == 'body' for s in steps[1:])
            on_screen(r['previous'], SEARCH)
            assert after['href'] is None
            expected_resume = None
        else:
            assert before['remaining'] == [ANATOMY + '#metod']
            assert not after['hidden'] and after['href'] == ANATOMY + '#metod'
            for s in steps:
                on_screen(s, DISMISS)
            on_screen(r['previous'], DISMISS)
            on_screen(r['fallback'], CTA)
            assert r['fallback']['href'] == after['href']
            expected_resume = after['href']

    activated = r.get('activated')
    paths = [article['route'] for article in r['reads']] + ['/'] + (['/'] if dismiss else [])
    if expected_resume:
        article, fragment = expected_resume.split('#')
        assert activated == {'url': expected_resume, 'target': fragment, 'nav': 'navigate'}
        paths.append(article)
    else:
        assert activated is None
    assert r['responses'] == [{'path': p, 'status': 200} for p in paths]


def compact(s):
    return {k: s[k] for k in ('target', 'href', 'top', 'scrollY', 'inView', 'hit', 'locked', 'definitionOpener')}


def replay_line(r):
    line = {'entry': compact(r['entry'][-1]), 'heroTermDwellMs': r['heroTermDwellMs']}
    if 'afterRecovery' in r:
        line.update(afterRecovery=compact(r['afterRecovery']), recoverySinceGlossaryMs=r['recoverySinceGlossaryMs'])
    if 'cardTermExit' in r:
        line['afterCardTerm'] = compact(r['cardTermExit'][-1])
    if 'dismissal' in r:
        line.update(afterHide=compact(r['dismissal'][-1]), next=compact(r['next']), reverseFromNext=compact(r['previous']),
                    reload={'hidden': r['reload']['card']['hidden'], 'href': r['reload']['card']['href']})
    if 'activated' in r:
        line['activated'] = r['activated']
    return line


def agree(a, b):
    # Timings are checked against the grace window in verify_row, not byte-for-byte.
    for k in a.keys() - {'heroTermDwellMs', 'recoverySinceGlossaryMs'}:
        if 'scrollY' in a[k]:
            for g in ('scrollY', 'top'):
                assert abs(a[k][g] - b[k][g]) <= 2, (k, g, a[k], b[k])
            assert {x: y for x, y in a[k].items() if x not in ('top', 'scrollY')} == {
                x: y for x, y in b[k].items() if x not in ('top', 'scrollY')}, k
        else:
            assert a[k] == b[k], k


def main():
    a_dir, b_dir, previous_path, dist, receipt_path = map(Path, sys.argv[1:])
    a, b = [read(d / 'resume-focus-witness.json') for d in (a_dir, b_dir)]
    assert a != b, 'A and B contain the same capture'
    for k in ('anchor', 'chromium', 'playwright', 'node', 'distSha256'):
        assert a[k] == b[k], k
    assert a['anchor'] == ANCHOR
    pins = a['distSha256']
    previous = read(previous_path)
    assert previous['anchor'] == ANCHOR
    old = previous['distSha256']
    assert len(old) == 61 and all(pins[k] == old[k] for k in pins.keys() & old.keys())
    assert {'index.html', 'js/site.js', 'js/site-utils.js', 'js/glossary.js', 'js/reader-state.js',
            'data/glossary.json', 'data/glossary-policy.json', GILL[1:] + '/index.html',
            ANATOMY[1:] + '/index.html'} <= pins.keys()
    pinned(pins | old, dist)
    rows = []
    for wa, wb in zip(a['results'], b['results'], strict=True):
        assert wa['id'] == wb['id']
        verify_row(wa)
        verify_row(wb)
        av, bv = replay_line(wa), replay_line(wb)
        assert av.keys() == bv.keys()
        agree(av, bv)
        rows.append({'id': wa['id'], 'a': av, 'b': bv})
    assert {r['id'] for r in rows} == EXPECTED and len(rows) == len(EXPECTED)
    pngs = {}
    for arm in ('quick', 'dwell'):
        name = f'resume-focus-{arm}-390.png'
        paths = (a_dir / name, b_dir / name)
        for p in paths:
            buf = p.read_bytes()
            assert buf[:16] == b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR'
            assert struct.unpack('>II', buf[16:24]) == (390, 844)
        sa, sb = map(sha, paths)
        pngs[name] = {'width': 390, 'height': 844, 'sha256A': sa, 'sha256B': sb, 'byteIdentical': sa == sb}
    receipt = {'anchor': ANCHOR, 'casesPerRun': len(rows), 'replays': 2, 'currentDistPins': len(pins),
               'previousDistPinsRechecked': len(old), 'commonDistPins': len(pins.keys() & old.keys()),
               'screenshots': pngs, 'rows': rows}
    receipt_path.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"PASS: {len(rows)}×2 measured, {len(pins)} current pins and {len(old)} prior pins verified, "
          f"{sum('activated' in r['a'] for r in rows)} Enter landings per run, {sum(p['byteIdentical'] for p in pngs.values())}/2 PNGs byte-identical")


if __name__ == '__main__':
    main()
