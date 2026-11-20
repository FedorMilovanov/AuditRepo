#!/usr/bin/env python3
"""Compare real Tab navigation after a clicked toast and its natural expiry."""
import hashlib
import json
import sys
from pathlib import Path

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
TO = '/articles/dzhon-gill-chast-2-uchenyi/'
FROM = '/articles/dzhon-gill-chast-1-chelovek/'
TARGET = 'sec-hebrew'


def load(p):
    return json.loads(p.read_text(encoding='utf-8'))


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def visible(box):
    return bool(box and box['inView'] and box['hit'])


def check(r, timing):
    arm = r['dismiss']
    pressed = arm == 'press'
    assert r['ok'] and r['arm']=='quiz-focus' and r['id']==f'quiz-focus-{arm}'
    assert r['outcome']==r['dismissal']==('pointer-cta' if pressed else 'timer-control')
    assert (r['width'],r['height'])==(390,844) and r['target']==TARGET
    assert not r['errors'] and not r['searchAssets']
    assert r['docs']==[[p,200,'no-store'] for p in (TO,FROM,TO)]
    made, origin, offer, landing, before, removed = (r[k] for k in ('produced','origin','offer','landed','before','after'))
    assert len({s['doc'] for s in (made,origin,offer)})==3 and offer['nav']=='navigate'
    assert offer['hash']=='' and offer['y']==0 and offer['ack']=='1'
    assert offer['history']==origin['history']+1 and origin['ack'] is None
    assert offer['toast']['on'] and visible(offer['toast']['go'])
    assert offer['saved']==origin['saved'] and offer['saved']['sectionId']=='sec-canticles'
    assert {**offer['saved'],'savedAt':made['saved']['savedAt']}==made['saved']
    assert made['y']==made['saved']['scrollY'] and visible(made['A'])
    walk = r['questionWalk']
    assert 1<=len(walk)<=32 and walk[-1]=='gill.scholar.mishnah' and len(set(walk))==len(walk)
    assert r['answered']['quiz']['source']==[TO+'#'+TARGET,False]
    assert r['answered']['quiz']['verdict'][0].startswith('Неверно')
    assert all(s['focus']==s['active']['name']==TARGET for s in (landing,before))
    assert before['toast']['on'] and visible(before['toast']['go']) and removed['toast'] is None
    assert landing['y']==before['y']==removed['y']
    assert all(visible(s['B']) and not visible(s['A']) for s in (landing,before,removed))

    events = r['events']; assert all(e['trusted'] for e in events)
    doc = offer['doc']; current = [e for e in events if e['doc']==doc]
    assert [e['doc'] for e in events if e['kind']=='pageshow' and not e['persisted']]==[made['doc'],origin['doc'],doc]
    assert not any(e['kind'] in ('hashchange','popstate') for e in current)
    [source_key,source] = [e for e in current if e.get('action')=='quiz-source']
    assert source_key['kind']=='quiz-keydown' and source_key['key']=='Enter' and source_key['focusIsTarget']
    assert source['kind']=='click' and source['detail']==0 and source['focusIsTarget'] and source['button']==0
    assert source_key['toastPhase']==source['toastPhase']=='on'
    assert source['link']==TO+'#'+TARGET and source['hash']=='' and source['history']==offer['history']
    assert offer['ageMs']<source_key['ageMs']<=source['ageMs']<=landing['ageMs']<=before['ageMs']
    mount,show,hide,gone = removed['transitions']
    assert [e['phase'] for e in (mount,show,hide,gone)]==['off','on','off','absent']
    assert mount['hash']==show['hash']=='' and show['ageMs']<=offer['ageMs']
    assert hide['hash']==gone['hash']=='#'+TARGET and before['ageMs']<=hide['ageMs']
    assert gone['ageMs']<=removed['ageMs'] and removed['ageMs']-gone['ageMs']>=110
    assert not [s for s in removed['scrolls'] if s[0]>=before['ageMs']]
    continue_events = [e for e in current if e.get('action')=='continue']
    cta_ms = None
    if pressed:
        [cta] = continue_events
        cta_ms = cta['ageMs']
        assert cta['kind']=='click' and cta['detail']>=1 and cta['button']==0 and cta['hit']
        assert cta['label']=='Продолжить' and cta['toastPhase']=='on' and cta['focus']=='gbs2-resume-go'
        assert cta['y']==before['y'] and before['ageMs']<=cta_ms<=hide['ageMs']
        assert before['ageMs']-mount['ageMs']<timing['actByMount'] and hide['ageMs']-mount['ageMs']<6500
        assert 0<=hide['ageMs']-cta_ms<=50 and 375<=gone['ageMs']-cta_ms<=600
        assert hide['focus']=='gbs2-resume-go' and gone['focus']=='gbs-world'
        assert removed['active']['tag']=='BODY' and removed['active']['body']
    else:
        assert not continue_events and hide['ageMs']-mount['ageMs']>=6450
        assert removed['active']['tag']=='H3' and removed['active']['name']==TARGET
        assert hide['focus']==gone['focus']==TARGET

    tab_actions = [e for e in current if e['kind']=='after-source-tab']
    choices = r['tabs']; assert len(choices)==len(tab_actions)==2
    previous = removed
    for i,(step,event) in enumerate(zip(choices,tab_actions)):
        b,a = step['before'],step['after']
        assert b==previous and b['ageMs']<=event['ageMs']<=a['ageMs']
        assert event['y']==b['y'] and event['active']==b['active'] and not event['shift'] and event['toastPhase']=='absent'
        assert a['toast'] is None and visible(a['active']['visible'])
        assert a['scrolls'][:len(b['scrolls'])]==b['scrolls']
        added = a['scrolls'][len(b['scrolls']):]
        assert added and added[-1][1]==a['y'] and all(event['ageMs']<=s[0]<=a['ageMs'] for s in added)
        focusins = [f for f in current if f['kind']=='after-source-focus' and event['ageMs']<=f['ageMs']<=a['ageMs']]
        assert focusins and focusins[-1]['active']['name']==a['active']['name']
        previous = a
    first, second = (t['after'] for t in choices)
    if pressed:
        assert first['focus']=='skip-link' and first['active']['href']==TO+'#main-content'
        assert first['y']==0 and not visible(first['B']) and not first['active']['inMain']
        assert second['focus']=='gill-card__cta' and second['active']['href']==FROM
        assert not visible(second['B'])
    else:
        assert first['active']['tag']=='IMG' and first['active']['inMain'] and visible(first['B'])
        assert second['active']['tag']=='TABLE' and second['focus']=='manuscript-table' and second['active']['inMain']
        assert landing['y']<first['y']<second['y']
    for s in (landing,before,removed,first,second):
        assert s['path']==TO and s['doc']==doc and s['hash']=='#'+TARGET and s['match'] is None
        assert s['history']==offer['history']+1 and s['quiz']==r['answered']['quiz'] and s['ack']=='1'
        assert not s['overlays'] and not s['locked'] and not s['legacy'] and s['pageFocus']
    return {'id':r['id'],'dismissal':r['dismissal'],'questionNumber':len(walk),'hash':first['hash'],
            'sourceAgeMs':source['ageMs'],'continueAgeMs':cta_ms,'removedAgeMs':gone['ageMs'],
            'focusBefore':[before['focus'],removed['focus']],
            'viewportY':[landing['y'],removed['y'],first['y'],second['y']],
            'firstTab':{'focus':first['active']['name'],'label':first['active']['label'],
                        'href':first['active']['href'],'headingVisible':visible(first['B'])},
            'secondTab':{'focus':second['active']['name'],'label':second['active']['label'],
                         'href':second['active']['href'],'headingVisible':visible(second['B'])},
            'scrollAfterRemovalBeforeKey':0}


def main(args):
    if len(args)!=5:
        raise SystemExit('check-quiz-focus-replays.py A_JSON B_JSON DIST KEYBOARD_WITNESS RECEIPT')
    a,b,dist,prior,out = map(Path,args)
    prev = load(prior); pins = prev['distSha256']
    assert prev['anchor']==ANCHOR and len(pins)==49
    seen = set(); cases = []
    for file in (a,b):
        w = load(file)
        for k in ('anchor','node','playwright','chromium','method','distSha256'):
            assert w[k]==prev[k],k
        rows = w['rows']
        assert len(rows)==2 and {r['id'] for r in rows}=={'quiz-focus-press','quiz-focus-timer'}
        each = []
        for r in rows:
            doc = r['offer']['doc']; assert doc not in seen; seen.add(doc)
            each.append(check(r,w['method']['timing']))
        cases.append(each)
    for f,digest in pins.items():
        assert sha(dist/f)==digest,f
    receipt = {'anchor':ANCHOR,'equalDistPins':len(pins),'independentRuns':2,
               'witnessSha256':[sha(a),sha(b)],'casesAB':cases}
    out.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('PASS 2+2: clicked CTA → first Tab at start 2/2; natural timeout → first Tab at image in chosen section 2/2')


if __name__=='__main__':
    main(sys.argv[1:])
