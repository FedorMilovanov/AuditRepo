#!/usr/bin/env python3
"""Independently check live layer order, actual click routing and draft fate."""
import hashlib
import json
import struct
import sys
from pathlib import Path

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
GILL = '/articles/dzhon-gill-chast-2-uchenyi/'
APOSTASY = '/articles/otstuplenie-chto-govorit-bibliya/'
LIB, SEARCH = 'highlights', 'search:command-palette'
SP = 'overlay:' + SEARCH
LAYER = 'gb-hl-backdrop'
DRAFT = 'Черновик проверки: перечитать подтверждающий абзац.'
QUERY = 'Поиск после ответа'
CANCEL, SAVE, INPUT = 'gb-hl-note-cancel', 'note-submit', 'palette-input'
NAME = 'library-search-stack-witness.json'
OPEN = {'open': True, 'aria': 'false', 'inert': False}
CLOSED = {'open': False, 'aria': 'true', 'inert': True}
CLAIMED = {'open': True, 'aria': 'true', 'inert': True}
ARMS = ('library-only', 'palette-only', 'stack-escape-cold', 'stack-escape-warm', 'stack-field-click', 'stack-save-click')
IDS = {f'gill-{w}-{a}' for w in (390, 1440) for a in ARMS} | {f'apostasy-{w}-stack-escape-cold' for w in (390, 1440)}
FRAMES = {'palette-only-390.png': (390, 844), 'stacked-390.png': (390, 844),
          'stacked-1440.png': (1440, 900), 'reopened-empty-390.png': (390, 844)}


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def locked(s, *locks):
    assert s['locks'] == list(locks), s
    assert s['owners'] == ([SEARCH] if SP in locks else [])
    assert s['locked'] == bool(locks) and s['bodyPosition'] == ('fixed' if locks else 'static')


def last(series):
    assert [s['ms'] for s in series] == [0, 80, 250, 600]
    return series[-1]


def clicked_on(r, target, owner):
    rec = r['clicked']
    e, p = rec['click'], rec['probe']
    assert e in r['events'] and e['trusted'] and e['phase'] == 'capture' and e['type'] == 'click'
    assert e['node'] == p['hitName'] == target
    assert e['owner'] == p['hitOwner'] == owner
    assert all(abs(a-b) <= 1 for a,b in zip(e['point'], p['point']))
    return r['events'].index(e)


def note_written(r, route):
    s = r['saved']
    assert s['notes'] == r['final']['notes'] == [{'text': DRAFT, 'path': route, 'quote': ''}]
    assert not s['editor']['open'] and s['lib'] == OPEN
    assert s['status'] == 'Заметка сохранена.' and s['scope'] == 'note'
    return s


def case(r):
    route, fragment = (GILL, '#sec-canticles') if r['route'] == 'gill' else (APOSTASY, '#odno-slovo')
    w, arm = r['width'], r['arm']
    assert r['id'] == f"{r['route']}-{w}-{arm}" and r['height'] == {390: 844, 1440: 900}[w]
    assert r['ok'] and r['sameDocument'] and not r['errors'] and r['documents'] == [[route, 200]]
    assert r['optional'] == ([] if arm == 'library-only' else [['HEAD', '/pagefind/pagefind.js', 404]])
    assert r['source']['hash'] == r['final']['hash'] == fragment and r['source']['active']['hit']
    assert r['source']['history'] == r['initial']['history'] + 1 == r['final']['history']
    assert r['initial']['lib'] == r['final']['lib'] == CLOSED
    locked(r['initial']); locked(r['source']); locked(r['final'])
    assert r['answer'] == r['finalAnswer'] and r['answer']['glsQuizVerdict'][0].startswith('Неверно')
    assert r['answer']['glsQuizSource'][2].endswith(fragment)
    assert r['source']['active']['name'] == fragment[1:]
    events = r['events']
    search_events = [e for e in events if e.get('owner') == SEARCH]
    warm = arm == 'stack-escape-warm'
    nsearch = int(arm != 'library-only') + int(warm)
    assert [e['type'] for e in search_events] == ['gb:overlay-open', 'gb:overlay-close'] * nsearch
    assert not any(e.get('owner') == LIB for e in events if e['type'].startswith('gb:'))
    capture = [e for e in events if e['type']=='keydown' and e['phase']=='capture']
    trigger = [e['node'] for e in capture if e['key'] == 'k' and e['ctrl'] and e['trusted']]
    assert any(e['node']=='glsQuizSource' and e['key']=='enter' and e['trusted'] for e in capture)
    if arm == 'palette-only':
        assert trigger == [fragment[1:]] and r['paint']['lib'] is None
        assert r['open']['searchInput']['hit'] and r['open']['lib'] == CLOSED
        clicked_on(r, INPUT, 'cp-backdrop')
        assert last(r['esc'])['active']['name'] == fragment[1:]
        return {'control':arm,'target':INPUT,'restored':fragment[1:]}

    opened = r['library']['opened']
    locked(opened, LIB)
    assert opened['active']['name'] == 'gb-hl-close' and opened['learning'] == CLOSED
    assert any(e['node']=='manageNotesBtn' and e['key']=='enter' and e['trusted'] for e in capture)
    assert r['editable']['active']['name'] == 'gb-hl-note-text' and not (r['editable']['palette'] or {}).get('open')
    d = {'open':True,'value':DRAFT}
    assert r['editable']['editor'] == r['fromCancel']['editor'] == d
    assert r['fromCancel']['active']['name'] == CANCEL and not r['fromCancel']['notes']
    assert r['fromCancel']['ready'] is warm
    assert any(e['type']=='keydown' and e['phase']=='bubble' and e['key']=='k' and e['node']=='gb-hl-note-text'
               and e['trusted'] and not e['prevented'] for e in events)
    locked(r['fromCancel'], LIB)
    exit_state = last(r['exit']); locked(exit_state)
    assert exit_state['lib'] == exit_state['learning'] == CLOSED and exit_state['active']['name'] == 'gbs-world'
    assert exit_state['scrollY'] == r['source']['scrollY']
    if arm == 'library-only':
        assert trigger == ['gb-hl-note-text'] and r['saved']['palette'] is None
        assert any(e['node']==SAVE and e['key']=='enter' and e['trusted'] for e in capture)
        note_written(r, route)
        return {'control':arm,'saved':True,'exit':'gbs-world'}

    assert trigger == [fragment[1:]]*warm + ['gb-hl-note-text', CANCEL]
    if warm:
        assert r['warm']['searchInput']['hit'] and last(r['warmEsc'])['active']['name']==fragment[1:]
    acquired, released = search_events[-2:]
    assert acquired['lib'] == CLAIMED and acquired['focus'] == CANCEL
    assert acquired['locks'] == [LIB, SP] and acquired['owners'] == [SEARCH]
    top = r['open']; locked(top, LIB, SP)
    assert top['lib'] == top['palette'] == OPEN and top['editor'] == d and top['directLib'] and top['directPalette']
    assert top['article'] == {'aria':'true','inert':True} and not top['notes']
    assert top['active']['name'] == INPUT and top['searchInput']['hitOwner'] == LAYER and not top['searchInput']['hit']
    assert top['submit']['hitName'] == SAVE and top['submit']['hitOwner'] == LAYER and top['submit']['hit']
    paint = r['paint']
    assert paint['lib']['order'] > paint['input']['order'] > paint['palette']['order']
    assert paint['panel']['order'] > paint['lib']['order']
    assert paint['lib']['styles']['z-index'] == '2147483200' and paint['palette']['styles']['z-index'] == '2147483000'
    assert paint['lib']['styles']['backdrop-filter'] == 'blur(5px)' and paint['lib']['styles']['display'] == 'flex'
    assert paint['lib']['styles']['opacity'] == '1'
    assert paint['panel']['styles']['background-color'] == 'rgb(252, 249, 243)'
    ax = r['ax']; assert all(not ax[k]['ignored'] for k in ('library','search','save','field'))
    assert all(ax[k]['role'] == 'dialog' and ax[k]['modal'] for k in ('library','search'))
    assert ax['save']['name'] == 'Сохранить заметку' and ax['save']['focusable']
    assert ax['field']['name'] == 'Поиск' and ax['field']['role'] == 'combobox'
    esc = last(r['esc']); assert esc['palette'] == CLOSED and not released['owners']
    esc_location = esc['active']['name']
    crosses = dict(acquiredInert=True, settledInert=False, fieldHit=top['searchInput']['hitName'],
                   twoExposedAXModals=True, escape=esc_location)
    if arm == 'stack-field-click':
        hit = 'gb-hl-backdrop' if w==390 else 'gb-hl-header'
        clicked_on(r, hit, LAYER)
        post = r['clicked']['after']
        assert post['palette'] == OPEN and not post['notes']
        if w==390:
            locked(post, SP); locked(esc)
            assert post['lib'] == CLOSED and not post['editor']['open'] and post['editor']['value']==DRAFT
            assert post['searchInput']['hit'] and esc_location == 'gbs-world'
            assert r['reopenEmpty']['editor'] == {'open':True,'value':''} and r['reopenEmpty']['notes'] == r['final']['notes'] == []
            assert not any(e['type']=='submit' for e in events)
            return dict(crosses, pointer=hit, draftAfterReopen='empty', saved=False)
        locked(post, LIB, SP); locked(esc, LIB)
        assert post['lib']==OPEN and post['editor']==d and post['active']['name']=='gb-hl-panel'
        tab = r['afterPointerTab']
        locked(tab, LIB, SP)
        assert tab['active']['owner']==LAYER and tab['active']['hit'] and tab['palette']==OPEN
        assert esc_location == CANCEL and esc['editor']==d
        note_written(r, route)
        return dict(crosses, pointer=hit, tabAtLibrary=tab['active']['name'], draftAfterEscape='retained', saved=True)
    locked(esc, LIB)
    assert esc['lib'] == OPEN
    if arm == 'stack-save-click':
        at = clicked_on(r, SAVE, LAYER)
        until = events.index(released, at)
        assert any(e['type']=='submit' and e['trusted'] and e['owner']==LAYER for e in events[at:until])
        saved = note_written(r, route);locked(saved, LIB, SP);assert saved['palette']==OPEN
        return dict(crosses, pointer=SAVE, savedWithPaletteOpen=True)
    assert r['typed']['query']==QUERY and r['typed']['editor']==d
    assert r['tab']['active']['owner']=='cp-backdrop' and r['reverse']['active']['name']==INPUT
    assert not r['tab']['active']['hit'] and not r['reverse']['active']['hit']
    assert esc_location==CANCEL and esc['active']['hit'] and esc['editor']==d and not esc['notes']
    assert any(e['key']=='escape' and e['node']==INPUT and e['trusted'] for e in capture)
    assert not any(e['type']=='keydown' and e['phase']=='bubble' and e['key']=='escape' and e['node']==INPUT for e in events)
    note_written(r, route)
    return dict(crosses, draftAfterEscape='retained', saved=True, tabWithPalette=r['tab']['active']['name'])


def verify(a,b,prior,dist,out):
    inputs = (a/NAME,b/NAME)
    wa,wb = map(load,inputs)
    assert wa != wb, 'A and B contain the same capture'
    for k in ('anchor','chromium','node','playwright','distSha256'):
        assert wa[k] == wb[k], k
    before = load(prior)
    assert wa['anchor'] == before['anchor'] == ANCHOR
    pins,old = wa['distSha256'],before['distSha256']
    shared = set(pins)&set(old)
    assert {'js/highlights.js','js/search.js','js/site-utils.js','css/command-palette.css',GILL.strip('/')+'/index.html'} <= shared
    assert all(pins[k]==old[k] for k in shared)
    for rel,sha in (pins | old).items():
        assert digest(dist/rel)==sha, rel
    aa,bb = ({r['id']:case(r) for r in w['rows']} for w in (wa,wb))
    assert len(wa['rows'])==len(wb['rows'])==len(IDS) and aa.keys()==bb.keys()==IDS
    assert aa==bb, [(n,aa[n],bb[n]) for n in IDS if aa[n]!=bb[n]]
    shots={}
    for name,dims in FRAMES.items():
        values=[]
        for p in (a,b):
            raw=(p/name).read_bytes()
            assert raw[:8]==b'\x89PNG\r\n\x1a\n' and struct.unpack('>II',raw[16:24])==dims, name
            values.append(hashlib.sha256(raw).hexdigest())
        shots[name]={'a':values[0],'b':values[1],'byteIdentical':values[0]==values[1]}
    receipt=dict(anchor=ANCHOR,chromium=wa['chromium'],node=wa['node'],playwright=wa['playwright'],
                 casesPerRun=len(IDS),pinned=len(pins),priorPinned=len(old),sharedPins=len(shared),
                 witnessSha256={'a':digest(inputs[0]),'b':digest(inputs[1])},priorWitnessSha256=digest(prior),
                 shots=shots,stableOutcomeByCase=aa)
    out.write_text(json.dumps(receipt,ensure_ascii=False,sort_keys=True,indent=2)+'\n',encoding='utf-8')
    print(f'PASS: {len(IDS)}+{len(IDS)} cases, {len(pins)} pins, {len(shared)}/{len(old)} shared/prior, '
          f'{sum(x["byteIdentical"] for x in shots.values())}/{len(shots)} identical frames')


if __name__=='__main__':
    verify(*map(Path,sys.argv[1:]))
