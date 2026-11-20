#!/usr/bin/env python3
"""Separate actual clicks after a pushState hop from timed-out/blocked probes."""
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
MAPPING = {'gill.scholar.mishnah': 'sec-hebrew', 'gill.scholar.systematics': 'sec-systematics'}
NOOP = 'visible-toast-click-no-return'
LATE = 'no-action-in-offer-window'
WITNESS = 'resume-in-page-witness.json'


def visible(b):
    return bool(b and b['hit'] and b['inView'])


def load(p):
    return json.loads(p.read_text(encoding='utf-8'))


def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def case(r, timing, *, keyboard_source=False):
    assert r['arm']=='quiz' and r['id']==f"quiz-{r['width']}" and r['ok']
    assert (r['width'],r['height']) in ((390,844),(1440,900))
    assert not r['searchAssets'] and not r['errors']
    assert r['docs']==[[p,200,'no-store'] for p in (TO,FROM,TO)]
    made, origin, offer, answered, landed, before, after = (r[k] for k in ('produced','origin','offer','answered','landed','before','after'))
    assert len({made['doc'],origin['doc'],offer['doc']})==3 and offer['nav']=='navigate'
    assert offer['hash']=='' and offer['y']==0 and offer['ack']=='1'
    assert offer['toast']['on'] and visible(offer['toast']['go'])
    assert offer['saved']==origin['saved'] and offer['saved']['sectionId']==made['saved']['sectionId']=='sec-canticles'
    assert {**origin['saved'], 'savedAt':made['saved']['savedAt']}==made['saved']
    assert made['saved']['scrollY']==made['y'] and visible(made['A'])
    assert made['saved']['dismissedAt']==0 and not made['saved']['completed']
    assert origin['ack'] is None and offer['history']==origin['history']+1
    walk=r['questionWalk']; assert walk and len(walk)<=32 and len(set(walk))==len(walk)
    assert not (set(walk[:-1]) & MAPPING.keys())
    target=r['target']; assert MAPPING[walk[-1]]==target
    assert answered['hash']=='' and answered['path']==TO and answered['history']==offer['history']
    assert answered['doc']==offer['doc'] and answered['quiz']['verdict'][0].startswith('Неверно')
    assert answered['quiz']['source']==[TO+'#'+target,False]
    assert landed['focus']==target and landed['B']['id']==target and visible(landed['B'])
    assert r['link']['label'].startswith('Перечитать:')
    for s in (landed,before,after):
        assert s['doc']==offer['doc'] and s['path']==TO and s['hash']=='#'+target
        assert s['history']==offer['history']+1 and s['quiz']==answered['quiz'] and s['match'] is None
        assert s['ack']=='1' and s['saved']['dismissedAt']==0
        assert not s['overlays'] and not s['locked'] and not s['legacy']
    assert not visible(landed['A'])
    assert after['toast'] is None
    current=[e for e in r['events'] if e['doc']==offer['doc']]
    assert all(e['trusted'] for e in r['events'])
    assert [e['doc'] for e in r['events'] if e['kind']=='pageshow' and not e['persisted']]==[
        made['doc'],origin['doc'],offer['doc']]
    clicks=[e for e in r['events'] if e['kind']=='click']
    for click in clicks:
        assert click['button']==0
        source_key = keyboard_source and click['doc']==offer['doc'] and click['action']=='quiz-source'
        assert click['detail']==0 if source_key else click['detail']>=1
    assert [(e['doc'],e['link']) for e in clicks[:2]]==[(made['doc'],TO+'#sec-canticles'),(origin['doc'],TO)]
    [wheel]=[e for e in r['events'] if e['kind']=='wheel' and e['doc']==made['doc']]
    assert wheel['deltaMode']==0 and wheel['deltaY']==r['wheelDelta']>0
    assert not [e for e in current if e['kind'] in ('hashchange','popstate')]
    [source]=[e for e in current if e.get('action')=='quiz-source']
    assert source['hash']=='' and source['link']==TO+'#'+target and source['history']==offer['history']
    assert source['label']==r['link']['label']
    assert offer['ageMs']<answered['ageMs']<=source['ageMs']<=landed['ageMs']<=before['ageMs']
    mount,show,hide,gone=after['transitions']
    assert [e['phase'] for e in (mount,show,hide,gone)]==['off','on','off','absent']
    assert mount['hash']==show['hash']=='' and show['ageMs']<=offer['ageMs']
    ctas=[e for e in current if e.get('action')=='continue']
    outcome=r['outcome']; assert outcome in (LATE,NOOP)
    if outcome==NOOP:
        [cta]=ctas
        assert source['toastPhase']==cta['toastPhase']=='on' and source['ageMs']<cta['ageMs']
        assert cta['hit'] and cta['label']=='Продолжить' and cta['hash']=='#'+target
        assert cta['y']==before['y']==after['y'] and cta['saved']['dismissedAt']==0
        assert visible(before['toast']['go']) and visible(after['B']) and not visible(after['A'])
        assert not [v for v in after['scrolls'] if v[0]>=cta['ageMs']]
        assert hide['ageMs']-mount['ageMs']<6500
        off,removed=[e['ageMs']-cta['ageMs'] for e in (hide,gone)]
        assert [off,removed]==[r['delays'][k] for k in ('off','removed')]
        assert 0<=off<=50 and 375<=removed<=600
    else:
        assert not ctas
        assert (not before['toast'] or not before['toast']['on'] or not visible(before['toast']['go'])
                or before['ageMs']-mount['ageMs']>=timing['actByMount'])
        assert hide['ageMs']-mount['ageMs']>=6450
    overlaps=[]
    for e in r['pointerInterference']:
        probe=e['before']; assert probe['covered']
        if 'afterTimeout' not in e:
            continue
        b,a=e['stalled'],e['cleared']; cleared=e['afterTimeout']
        blocked=e.get('afterWheel',probe)
        assert blocked['covered'] and blocked['point'] is None
        assert b['doc']==a['doc']==offer['doc'] and b['quiz']==a['quiz']
        assert b['overlays']==a['overlays']==['gillLearningOverlay'] and b['locked'] and a['locked']
        assert b['toast']['on'] and a['toast'] is None and not cleared['covered']
        assert offer['ageMs']<=b['ageMs']<hide['ageMs']<gone['ageMs']<=a['ageMs']<=source['ageMs']
        overlaps.append({'control':e['selector'],'q':b['quiz']['q'],'beforePoint':probe['point'],
                         'firstCenter':probe['center'],'scrollDeltaAvailable':probe['delta'],
                         'afterAutoDismissPoint':cleared.get('point'),'beforeAgeMs':b['ageMs'],'afterAgeMs':a['ageMs']})
    return {'id':r['id'],'question':walk[-1],'precedingQuestions':len(walk)-1,'hash':landed['hash'],
            'targetPseudoClass':landed['match'],'focusAtLanding':landed['focus'],'landedY':landed['y'],
            'clickOrSampleY':before['y'],'afterY':after['y'],'hashchange':0,'outcome':outcome,
            'sourceAgeMs':source['ageMs'],'toastAtSource':source['toastPhase'],
            'ctaAgeMs':ctas[0]['ageMs'] if ctas else None,'dismissMs':r.get('delays'),
            'storedSectionAtOfferBeforeAfter':[s['saved']['sectionId'] for s in (offer,before,after)],
            'storedSectionAtClick':ctas[0]['saved']['sectionId'] if ctas else None,
            'autoDismissControl':overlaps}


def main(args):
    if len(args)!=5:
        raise SystemExit('check-quiz-push-replays.py RUN_A_OR_JSON RUN_B_OR_JSON DIST IN_PAGE_WITNESS RECEIPT')
    a,b,dist,old,out=map(Path,args)
    witnesses=[p/WITNESS if p.is_dir() else p for p in (a,b)]
    ws=[load(p) for p in witnesses]; prev=load(old)
    assert ws[0] != ws[1], 'A and B contain the same capture'
    pins=ws[0]['distSha256']
    for k in ('node','playwright','chromium','method'):
        assert ws[0][k]==ws[1][k]==prev[k],k
    for w in ws:
        assert w['anchor']==prev['anchor']==ANCHOR and w['distSha256']==pins
        assert len(w['rows'])==2 and {row['id'] for row in w['rows']}=={'quiz-390','quiz-1440'}
    prior=prev['distSha256']; assert pins==prior and len(pins)==49
    for p,pin in pins.items():
        assert digest(dist/p)==pin,p
    cases=[[case(r,w['method']['timing']) for r in w['rows']] for w in ws]
    counts=Counter(r['outcome'] for rows in cases for r in rows)
    receipt={'anchor':ANCHOR,'distPinsEqualToInPage':len(pins),'independentRuns':2,
             'witnessSha256':[digest(p) for p in witnesses],'counts':dict(counts),'casesAB':cases}
    out.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('PASS',len(cases[0]),'+',len(cases[1]),'observed;',counts)


if __name__=='__main__':
    main(sys.argv[1:])
