#!/usr/bin/env python3
"""Check the observed ownership, real key boundaries, data retention and exact dist pins."""
import hashlib
import json
import struct
import sys
from pathlib import Path

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
GILL = '/articles/dzhon-gill-chast-2-uchenyi/'
SET, LEARN, SEARCH = 'gill-settings', 'gill-learning', 'search:command-palette'
NEXT, SOURCE, SECTION = 'glsQuizNext', 'glsQuizSource', 'sec-canticles'
NAME = 'quiz-search-handoff-witness.json'
SHOTS = ('before-search-390.png', 'escape-and-tab-390.png', 'solo-after-next-390.png')
OPEN = {'open': True, 'aria': 'false', 'inert': False}
CLOSED = {'open': False, 'aria': 'true', 'inert': True}
SAMPLES = [0, 80, 250, 600]
ARMS = {'after-miss': ('no-search', 'shortcut-cold', 'shortcut-warm', 'section-button'),
        'before-answer': ('no-search', 'shortcut-cold', 'shortcut-warm'), 'solo': ('escape-and-next',)}
IDS = {f'{w}-{phase}-{arm}' for w in (390, 1440) for phase, arms in ARMS.items() for arm in arms}


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def lock(s, *owners):
    assert s['owners'] == list(owners), s
    assert s['locks'] == sorted('overlay:' + x for x in owners), s
    assert s['locked'] == bool(owners) and s['bodyPosition'] == ('fixed' if owners else 'static'), s


def boundary(steps, panel, focus):
    assert [s['ms'] for s in steps] == SAMPLES
    for step in steps:
        lock(step)
        assert step[panel] == CLOSED, step
    assert steps[-2]['focus'] == steps[-1]['focus'] == focus, steps
    return [s['focus'] for s in steps]


def answer(q):
    assert q['chosenConfidence'] == 'sure' and q['sourceHref'].endswith('#' + SECTION)
    assert q['verdict'].startswith('Неверно — а уверенность была высокой.') and not q['verdictHidden']
    assert q['sourceText'].startswith('Перечитать:') and not q['sourceHidden']
    assert q['explanation'] and all(x[2] for x in q['options'])
    assert sum('is-wrong' in x[1] for x in q['options']) == sum('is-correct' in x[1] for x in q['options']) == 1


def check_rows(result):
    name, phase, arm, width = (result[k] for k in ('id', 'phase', 'arm', 'width'))
    r = result
    assert name == f'{width}-{phase}-{arm}' and r['height'] == {390: 844, 1440: 900}[width]
    assert r['ok'] and not r['errors'] and r['documents'] == [[GILL, 200]], name
    assert r['initial']['palette'] is None and not r['initial']['ready'] and r['initial']['searchBootstrap'] == 'idle'
    assert r['initial']['nav'] == {'direct': True, 'inert': True, 'hidden': True, 'aria': 'true', 'display': 'none'}
    assert r['navAxBefore']['ignored']; lock(r['initial'])
    events = r['events']
    lifecycle = [e for e in events if e['kind'].startswith('gb:overlay-')]
    sequence = [(e['kind'].split('-')[-1], e['owner'], e['reason']) for e in lifecycle]
    for e in lifecycle:
        assert e['owners'] == ([e['owner']] if e['kind'].endswith('-open') else []), e
        assert e['locks'] == ['overlay:' + x for x in e['owners']], e
    captured = [e for e in events if e['kind'] == 'key-capture']
    assert all(e['trusted'] for e in captured)
    assert not any(e['kind'] == 'key-bubble' and e['key'] == 'escape' for e in events)
    opens = [e for e in lifecycle if e['owner'] == SEARCH and e['kind'].endswith('-open')]
    closes = [e for e in lifecycle if e['owner'] == SEARCH and e['kind'].endswith('-close')]
    shortcut = [e for e in captured if e['key'] == 'k' and e['ctrl']]
    learn = [('open', SET, 'open'), ('close', SET, 'switch'), ('open', LEARN, 'open')]
    palette = [('open', SEARCH, 'open'), ('close', SEARCH, 'close')]
    assert r['sheet']['learning'] == OPEN and r['sheet']['settings'] == CLOSED; lock(r['sheet'], LEARN)
    assert r['sheet']['skip'] == r['initial']['skip'] and r['sheet']['world'] == r['initial']['world']
    if phase != 'before-answer':
        answer(r['quizBefore'])
        assert r['atSource']['focus'] == SOURCE and r['atSource']['insideLearning'] and r['atSource']['inView']
    if phase == 'solo':
        setting_button = 'mobSettingsBtn' if width == 390 else 'railSettingsBtn'
        assert sequence == [('open', SET, 'open'), ('close', SET, 'escape')] + (learn + [('close', LEARN, 'escape')]) * 2
        assert [e['target'] for e in captured if e['key'] == 'escape'][1] == SOURCE
        boundary(r['settingsEscape'], 'settings', setting_button)
        assert r['settingsEscape'][-1]['hit']
        boundary(r['learningEscape'], 'learning', 'body')
        assert r['quizAfterReopen'] == r['quizBefore']
        assert r['nextBeforeWrap']['focus'] == r['wrappedReverse']['focus'] == NEXT
        assert r['wrapped']['insideLearning'] and r['wrappedReverse']['insideLearning']
        assert r['wrapped']['focus'] == ('learning-handle' if width == 390 else 'heading-anchor')
        ax = r['axWhileOpen']
        assert ax['dialog'] == {'role': 'dialog', 'name': 'Разобраться и запомнить', 'ignored': False, 'focusable': False}
        assert ax['background'] == {'role': 'link', 'name': 'Перейти к содержимому', 'ignored': False, 'focusable': True}
        assert r['quizBefore']['question'] != r['afterNextQuiz']['question'] and r['afterNextQuiz']['verdictHidden']
        assert r['afterNext']['focus'] == ('body' if width == 390 else NEXT)
        assert any(e['target'] == NEXT and e['key'] == 'enter' for e in captured)
        for s in r['afterNextKeys']:
            lock(s, LEARN)
            assert s['learning'] == OPEN and s['world'] == r['initial']['world']
        after_next_keys = [s['focus'] for s in r['afterNextKeys']]
        if width == 390:
            assert after_next_keys == ['body', 'skip-link', 'body']
            assert r['afterNextKeys'][1]['focusVisible'] and r['afterNextKeys'][1]['hit']
        else:
            assert all(s['insideLearning'] for s in r['afterNextKeys'])
        assert r['exitAfterNext'][-1]['learning'] == CLOSED; lock(r['exitAfterNext'][-1])
        assert not r['optionalHead'] and not shortcut
        return dict(control='standalone', settingsEscape=setting_button, learningEscape='body',
                    wrap=r['wrapped']['focus'], afterNext=r['afterNext']['focus'], afterNextKeys=after_next_keys,
                    backgroundExposedInAX=True)
    if phase == 'after-miss':
        assert r['withoutSearchNext']['focus'] == NEXT and r['reverse']['focus'] == SOURCE
        assert r['withoutSearchNext']['insideLearning'] and r['reverse']['insideLearning']
    else:
        before = r['quizBefore']
        assert r['atAnswer']['insideLearning'] and r['atAnswer']['focus'] == 'quiz-option'
        assert before['chosenConfidence'] == 'sure' and before['verdictHidden'] and before['sourceHidden']
        assert all(not opt[2] for opt in before['options']), before
        answer(r['quizAnswered'])
        assert r['quizAnswered']['question'] == before['question']
        assert any(e['target'] == 'quiz-option' and e['key'] == 'enter' for e in captured)
    assert any(e['target'] == SOURCE and e['key'] == 'enter' for e in captured)
    assert r['finalQuiz'] == r.get('quizAnswered', r['quizBefore'])
    destination = r['landed']
    assert destination['hash'] == '#' + SECTION and destination['focus'] == SECTION
    assert destination['learning'] == CLOSED and destination['hit'] and destination['inView'] and destination['scrollY'] > 500
    assert destination['historyLength'] == r['initial']['historyLength'] + 1; lock(destination)
    if arm == 'no-search':
        assert sequence == learn + [('close', LEARN, 'handle')] and not r['optionalHead'] and not shortcut
        assert destination['nav'] == r['initial']['nav']
        return dict(control='uninterrupted', sourceHitAtStart=r.get('atSource', {}).get('hit'), landing=SECTION)
    warm = arm == 'shortcut-warm'
    arrival = 'globalSearchBtn' if arm == 'section-button' else SOURCE if phase == 'after-miss' else 'quiz-option'
    assert sequence == palette * warm + learn + [('close', LEARN, 'handle')] + palette + learn + [('close', LEARN, 'handle')]
    trigger, opened = r['beforeSearch'], r['open']
    lock(trigger, LEARN); lock(opened, SEARCH)
    assert trigger['focus'] == arrival and trigger['insideLearning'] and trigger['ready'] is warm
    assert trigger['learning'] == OPEN and opened['learning'] == CLOSED and opened['palette'] == OPEN
    assert opened['focus'] == 'palette-input' and opened['hit'] and opened['ready'] and opened['searchBootstrap'] == 'ready'
    assert opened['world'] == opened['skip'] == {'aria': 'true', 'inert': True}
    assert opened['nav']['inert'] and opens[-1]['focus'] == (arrival if warm else 'body')
    assert opens[-1]['nav']['inert'] and closes[-1]['nav'] == trigger['nav']
    sampled = boundary(r['searchClosed'], 'palette', 'body')
    assert all(s['learning'] == s['settings'] == CLOSED for s in r['searchClosed'])
    assert all(s['hash'] == '' and s['historyLength'] == trigger['historyLength'] for s in [opened, *r['searchClosed']])
    assert r['searchClosed'][-1]['nav'] == {**trigger['nav'], 'inert': False} and r['navAxAfter']['ignored']
    assert r['nextAfterSearch']['focusVisible'] and r['nextAfterSearch']['hit']
    assert all(not r[k]['insideLearning'] and not r[k]['insideNav'] for k in ('nextAfterSearch', 'reverseAfterSearch'))
    assert r['quizAfterSearch'] == r['quizAfterReopen'] == r['quizBefore']
    assert r['optionalHead'] == [['HEAD', '/pagefind/pagefind.js', 404]]
    if arm == 'section-button':
        editable = r['editable']
        lock(editable, LEARN)
        assert editable['focus'] == 'learningSearchInput' and editable['palette'] is None
        assert editable['partInput'] == r['reopened']['partInput'] == 'test'
        assert r['reopened']['activeLearningTab'] == 'tabSearch'
        assert [e['target'] for e in shortcut] == ['learningSearchInput']
        assert any(e['target'] == arrival and e['key'] == 'enter' for e in captured)
    else:
        assert [e['target'] for e in shortcut] == ['body'] * warm + [arrival]
        assert r['reopened']['activeLearningTab'] == 'tabQuiz'
    assert [e['target'] for e in captured if e['key'] == 'escape'] == ['palette-input'] * (1 + warm)
    if warm:
        boundary(r['warmupClosed'], 'palette', 'body')
        assert closes[0]['nav'] == r['initial']['nav']
        assert r['warmupClosed'][-1]['nav'] == {**r['initial']['nav'], 'inert': False}
    return dict(preSearch=arrival, atOverlayOpen=opens[-1]['focus'], postEscapeFocus=sampled,
                nextTab=r['nextAfterSearch']['focus'], nextShiftTab=r['reverseAfterSearch']['focus'],
                navigationInertRestoredAtClose=closes[-1]['nav']['inert'], navigationInertAfterEscape=False,
                landing=SECTION)


def main(a, b, previous, dist, out):
    names = [a / NAME, b / NAME]
    wa, wb = map(read, names)
    assert wa != wb, 'A and B contain the same capture'
    for key in ('anchor', 'node', 'chromium', 'playwright', 'distSha256'):
        assert wa[key] == wb[key], key
    prev = read(previous)
    assert wa['anchor'] == prev['anchor'] == ANCHOR
    pins, earlier = wa['distSha256'], prev['distSha256']
    shared = pins.keys() & earlier.keys()
    assert {'js/search.js', 'js/site-utils.js', GILL.strip('/') + '/index.html'} <= shared
    assert all(pins[k] == earlier[k] for k in shared)
    for rel, value in (pins | earlier).items():
        assert sha(dist / rel) == value, rel
    measured = []
    for w in (wa, wb):
        assert len(w['results']) == len(IDS) and {r['id'] for r in w['results']} == IDS
        measured.append({r['id']: check_rows(r) for r in w['results']})
    assert measured[0] == measured[1], [(k, measured[0][k], measured[1][k]) for k in IDS if measured[0][k] != measured[1][k]]
    shots = {}
    for f in SHOTS:
        hashes = []
        for parent in (a, b):
            frame = (parent / f).read_bytes()
            assert frame[:8] == b'\x89PNG\r\n\x1a\n' and struct.unpack('>II', frame[16:24]) == (390, 844)
            hashes.append(hashlib.sha256(frame).hexdigest())
        shots[f] = {'a': hashes[0], 'b': hashes[1], 'byteIdentical': hashes[0] == hashes[1]}
    receipt = dict(anchor=ANCHOR, chromium=wa['chromium'], playwright=wa['playwright'], node=wa['node'],
                   casesPerRun=len(IDS), pinned=len(pins), priorPinned=len(earlier), sharedPins=len(shared),
                   witnessSha256={'a': sha(names[0]), 'b': sha(names[1])}, priorWitnessSha256=sha(previous),
                   screenshots=shots, stableOutcomeByCase=measured[0])
    out.write_text(json.dumps(receipt, ensure_ascii=False, indent=2, sort_keys=True) + '\n', encoding='utf-8')
    print(f'PASS: {len(IDS)} + {len(IDS)} cases, {len(pins)} exact pins, {len(shared)}/{len(earlier)} shared/prior, '
          f'{sum(s["byteIdentical"] for s in shots.values())}/{len(shots)} identical frames')


if __name__ == '__main__':
    main(*map(Path, sys.argv[1:]))
