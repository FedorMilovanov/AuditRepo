#!/usr/bin/env python3
"""Check offer -> same-document section -> trusted action in two clean replays."""
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
TO = '/articles/dzhon-gill-chast-2-uchenyi/'
FROM = '/articles/dzhon-gill-chast-1-chelovek/'
SAVED, CHOSEN = 'sec-canticles', 'sec-hebrew'
WITNESS = 'resume-in-page-witness.json'
CASES = {f'{arm}-{width}' for width in (390, 1440) for arm in ('plain', 'toc', 'outline')}


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def visible(box):
    return bool(box and box['inView'] and box['hit'])


def stored(s):
    return {k: v for k, v in s['saved'].items() if k != 'savedAt'}


def check(r):
    arm, width = r['id'].split('-')
    native = arm == 'toc'
    assert r['arm'] == arm and r['width'] == int(width) and r['height'] == (844 if width == '390' else 900)
    assert r['ok'] and not r['errors'] and not r['searchAssets']
    assert r['docs'] == [[p, 200, 'no-store'] for p in (TO, FROM, TO)]
    source, produced, origin, offer, before, after = (r[k] for k in ('source', 'produced', 'origin', 'offer', 'before', 'after'))
    assert source['hash'] == '#' + SAVED and source['focus'] == SAVED and visible(source['A'])
    assert source['quiz']['verdict'][0].startswith('Неверно') and source['quiz']['source'] == [TO+'#'+SAVED, False]
    assert stored(produced) == stored(origin) == stored(offer)
    assert produced['saved']['sectionId'] == SAVED and produced['saved']['scrollY'] == produced['y']
    assert 8 <= produced['saved']['progress'] <= 92 and produced['saved']['dismissedAt'] == 0
    assert produced['doc'] == source['doc'] and len({produced['doc'], origin['doc'], offer['doc']}) == 3
    assert offer['ack'] == '1' and origin['ack'] is None and offer['saved'] == origin['saved']
    assert offer['path'] == TO and offer['history'] == origin['history'] + 1 and offer['nav'] == 'navigate'
    assert offer['y'] == 0 and offer['match'] is None and offer['hash'] == ''
    assert offer['toast']['on'] and visible(offer['toast']['go']) and not visible(offer['A']) and not visible(offer['B'])
    assert offer['toast']['label'].endswith(f"Вы остановились на {offer['saved']['progress']}%")

    be_hash = '#'+CHOSEN if native else ''
    assert before['toast']['on'] and visible(before['toast']['go']) and before['toast']['label'] == offer['toast']['label']
    assert after['toast'] is None
    for s in (before, after):
        assert not s['legacy'] and not s['overlays'] and not s['locked']
        assert s['doc'] == offer['doc'] and s['path'] == TO and s['ack'] == '1'
        assert s['history'] == offer['history'] + int(native)
        assert s['hash'] == be_hash and s['match'] == (CHOSEN if native else None)
        assert s['quiz'] == offer['quiz'] and s['saved']['dismissedAt'] == 0
    if arm == 'plain':
        assert before['y'] == 0 and before['saved'] == offer['saved']
    else:
        assert r['link']['href'] == '#'+CHOSEN
        mid = r['landed']
        assert mid['doc'] == offer['doc'] == before['doc'] and mid['hash'] == before['hash']
        assert mid['quiz'] == offer['quiz'] and mid['history'] == before['history']
        assert visible(mid['B']) and visible(before['B']) and not visible(before['A'])
        assert before['ageMs'] - mid['ageMs'] >= 1120
        assert before['live']['id'] == (CHOSEN if native else 'sec-trinity')

    ev = r['events']
    assert all(e['trusted'] for e in ev)
    assert [e['doc'] for e in ev if e['kind']=='pageshow' and not e['persisted']] == [source['doc'], origin['doc'], offer['doc']]
    [wheel] = [e for e in ev if e['kind']=='wheel']
    assert wheel['doc'] == source['doc'] and wheel['deltaY'] == r['wheelDelta'] > 0 and wheel['deltaMode'] == 0
    clicks = [e for e in ev if e['kind']=='click']
    route = ('sheet' if width=='390' else 'rail') if native else arm
    assert [e['action'] for e in clicks] == ['quiz-source', 'entry'] + ([] if arm=='plain' else [route]) + ['continue']
    # The Playwright hit point can differ from the box midpoint (e.g. a
    # clipped quiz source on desktop). Require the real event on that anchor;
    # require center hit separately for the saved/chosen heading and CTA.
    assert all(e['button']==0 and e['detail']>=1 for e in clicks)
    assert clicks[0]['doc'] == source['doc'] and clicks[0]['link'] == TO+'#'+SAVED
    assert clicks[1]['doc'] == origin['doc'] and clicks[1]['link'] == TO
    press = clicks[-1]; assert press['doc'] == offer['doc'] and press['hash'] == be_hash and press['y'] == before['y']
    assert press['hit'] and press['label'] == 'Продолжить' and press['toastPhase']=='on'
    for record in (before['saved'], press['saved']):
        if record == offer['saved']:
            continue
        assert arm != 'plain' and record['sectionId'] == before['live']['id']
        assert record['scrollY']==before['y'] and record['savedAt']>offer['saved']['savedAt'] and record['dismissedAt']==0
    if arm != 'plain':
        choice = clicks[-2]
        assert choice['doc'] == offer['doc'] and offer['ageMs'] <= choice['ageMs'] < press['ageMs']
        assert choice['hash'] == '' and choice['link'] == TO+'#'+CHOSEN and choice['toastPhase'] == 'on'
    hash_events = [e for e in ev if e['doc']==offer['doc'] and e['kind']=='hashchange']
    if native:
        [hash_change] = hash_events
        assert hash_change['hash'] == be_hash and choice['ageMs'] <= hash_change['ageMs'] < press['ageMs']
    else:
        assert not hash_events

    mount, show, hide, removed = after['transitions']
    assert [x['phase'] for x in (mount,show,hide,removed)] == ['off','on','off','absent']
    assert all(e['doc']==offer['doc'] for e in after['transitions'])
    assert mount['hash']==show['hash']=='' and mount['y']==show['y']==0 and show['ageMs']<=offer['ageMs']
    assert 875 <= show['ageMs']-mount['ageMs'] <= 1000
    assert press['ageMs'] - mount['ageMs'] < 6500 and hide['ageMs'] - mount['ageMs'] < 6500
    assert hide['hash']==removed['hash']==press['hash']
    off, gone = r['delays']['off'], r['delays']['removed']
    assert 0 <= off <= 50 and 375 <= gone <= 600
    assert [off,gone] == [x['ageMs']-press['ageMs'] for x in (hide,removed)]
    scrolls = [x for x in after['scrolls'] if x[0] >= press['ageMs']]
    if native:
        assert r['outcome']=='visible-toast-click-no-return' and not scrolls and before['y']==after['y']
        assert after['saved']['sectionId']==CHOSEN and after['saved']['scrollY']==after['y']
        assert visible(after['B']) and not visible(after['A'])
    else:
        assert r['outcome']=='saved-heading-restored' and scrolls and before['y']!=after['y']
        assert visible(after['A']) and not visible(after['B'])
        assert after['saved']['sectionId']==SAVED and after['saved']['scrollY']==after['y']
    return {'id': r['id'], 'outcome':r['outcome'], 'route':route, 'hash': be_hash, 'hashchange':len(hash_events),
            'entryY':offer['y'], 'clickY':before['y'], 'afterY':after['y'],
            'storedAtOffer':stored(offer),'liveSectionBeforeClick':before['live']['id'],'storedAfter':stored(after),
            'toastText':offer['toast']['label'], 'historyDelta':after['history']-offer['history']}


def main(args):
    if len(args) != 5:
        raise SystemExit('check-in-page-replays.py RUN_A RUN_B DIST F27_WITNESS RECEIPT')
    a,b,dist,old,out=map(Path,args)
    ws=[load(d/WITNESS) for d in (a,b)]
    w0,w1=ws
    assert w0 != w1, 'A and B contain the same capture'
    for k in ('anchor','node','playwright','chromium','method','distSha256'):
        assert w0[k]==w1[k],k
    assert w0['anchor']==ANCHOR
    results=[]
    for w in ws:
        assert len(w['rows'])==len(CASES) and {r['id'] for r in w['rows']}==CASES
        results.append([check(r) for r in w['rows']])
    assert results[0]==results[1]
    old=load(old); assert old['anchor']==ANCHOR
    pins=w0['distSha256']; prev=old['distSha256']; shared=pins.keys()&prev.keys()
    assert all(pins[f]==prev[f] for f in shared)
    for f,h in (pins | prev).items():
        assert sha(dist/f)==h,f
    assert {'js/reader-state.js','js/floating-cluster-controller.js',TO[1:]+'index.html',FROM[1:]+'index.html'} <= pins.keys()
    sa,sb=({f.name:sha(f) for f in sorted(d.glob('*.png'))} for d in (a,b))
    assert sa.keys()==sb.keys()=={f'{arm}-390-{point}.png' for arm in ('toc','outline') for point in ('before','after')}
    screenshots={f:{'runA':h,'runB':sb[f],'equal':h==sb[f]} for f,h in sa.items()}
    samples={r['id']:[] for r in ws[0]['rows']}
    for w in ws:
        for r in w['rows']:
            press=next(e for e in r['events'] if e.get('action')=='continue')
            samples[r['id']].append({'actionAgeMs':press['ageMs'],'hideLatencyMs':r['delays'],
                                     'storedAtClick':stored(press), 'savedAtClick':press['saved']['savedAt'],
                                     'savedAtAfter':r['after']['saved']['savedAt']})
    verdicts=Counter(c['outcome'] for c in results[0]); assert verdicts=={'visible-toast-click-no-return':2,'saved-heading-restored':4}
    receipt={'anchor':ANCHOR,'perRun':dict(verdicts),'witnessSha256':[sha(d/WITNESS) for d in (a,b)],
             'pins':{'bothRuns':len(pins),'recheckedF27':len(prev),'sharedF27':len(shared)},
             'cases':results[0],'actionSamplesAB':samples,'screens':screenshots}
    out.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'PASS {len(CASES)}+{len(CASES)}; {len(pins)} dist pins/{len(shared)} shared with F27; '
          f'{sum(x["equal"] for x in screenshots.values())}/{len(screenshots)} same PNG')


if __name__=='__main__':
    main(sys.argv[1:])
