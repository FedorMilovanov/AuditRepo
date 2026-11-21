#!/usr/bin/env python3
"""Verify the narrow keyboard-in-quiz / pointer-CTA replays without browsers."""
import hashlib
import json
import runpy
import sys
from pathlib import Path

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

# Keep the published fragment, document, history, timing and scroll checks.
check_fragment = runpy.run_path(str(Path(__file__).with_name('check-quiz-push-replays.py')))['case']
ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
OUTCOME = 'visible-toast-click-no-return'


def load(p):
    return json.loads(p.read_text(encoding='utf-8'))


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def check(row, timing):
    case_id = row['id']
    assert row['ok'] and row['arm']=='quiz-keys' and case_id in ('quiz-keys-1','quiz-keys-2')
    assert (row['width'],row['height'])==(390,844)
    all_events = row['events']
    assert all(e['trusted'] for e in all_events)
    # The prior pointer checker intentionally has no confidence/answer actions.
    quiz_internal = {'quiz-confidence','quiz-answer','quiz-next'}
    base_events = [e for e in all_events if e['kind']!='quiz-keydown' and e.get('action') not in quiz_internal]
    base = check_fragment({**row,'arm':'quiz','id':'quiz-390','events':base_events},timing,keyboard_source=True)
    doc = row['offer']['doc']
    events = [e for e in all_events if e['doc']==doc and e.get('action','').startswith('quiz-')]
    walk = row['questionWalk']
    steps = [(i,q,step) for i,q in enumerate(walk,1)
             for step in ('confidence','answer','next' if i<len(walk) else 'source')]
    key_actions = row['keyActions']
    assert len(events)==2*len(steps)==2*len(key_actions)
    covered = []
    hidden_source_stops, outside_tab_stops, tab_keys = 0, 0, 0
    for i, ((ordinal, question, step), action) in enumerate(zip(steps,key_actions)):
        assert (action['ordinal'],action['question'],action['step'])==(ordinal,question,step)
        key, click = events[2*i:2*i+2]
        assert key['kind']=='quiz-keydown' and key['key']=='Enter' and click['kind']=='click'
        assert key['action']==click['action']=='quiz-'+step and key['question']==click['question']
        assert click['detail']==0 and click['button']==0 and key['focusIsTarget'] and click['focusIsTarget']
        assert key['hash']==click['hash']=='' and key['history']==click['history']==row['offer']['history']
        assert action['enter']['ageMs']<=key['ageMs']<=click['ageMs']<=action['after']['ageMs']
        assert action['enter']['found'] and action['enter']['inSheet'] and action['enter']['enabled'] and not action['enter']['hidden']
        tabs = action['tabs']
        expected_key = ('Shift+Tab' if step=='answer' or (step=='confidence' and ordinal!=1) else 'Tab')
        assert action['key']==expected_key and len(tabs)<=24
        assert tabs[-1]['found'] if tabs else action['before']['found']
        assert not any(t['found'] for t in tabs[:-1])
        hidden_source_stops += sum(t['focus']=='glsQuizSource' and t['focusHidden'] for t in tabs)
        outside_tab_stops += sum(not t['inSheet'] for t in tabs)
        tab_keys += len(tabs)
        if step=='confidence':
            enter, after = action['enter'], action['after']
            assert click['label']=='Точно знаю' and enter['options']==[0,4] and after['options']==[4,4]
            if (enter['covered'] and enter['hitCount']==0 and enter['toastOn'] and after['toastOn']
                    and key['toastPhase']==click['toastPhase']=='on'):
                covered.append({'questionOrdinal':ordinal,'questionId':question,'ageMs':click['ageMs'],
                                'center':enter['center'],'sampledHits':enter['hitCount'],'topNode':enter['topNode'],
                                'scrollRoom':enter['scrollRoom'],'toastZ':enter['toastZ'],'sheetZ':enter['sheetZ'],
                                'optionsBeforeAfter':[enter['options'],after['options']]})
        if step=='answer':
            assert click['label']==action['label']
    assert events[-1]['action']=='quiz-source' and events[-1]['ageMs']==base['sourceAgeMs']
    assert events[-1]['question']==row['answered']['quiz']['q']
    return {**base,'id':case_id,'viewport':[390,844],'inputToSource':'Tab / Shift+Tab / Enter',
            'inputToContinue':'pointer' if base['ctaAgeMs'] is not None else None,
            'tabs':tab_keys,'enterActivations':len(key_actions),'hiddenSourceTabStops':hidden_source_stops,
            'tabsOutsideSheet':outside_tab_stops,'confidenceKeysWithPointerCovered':covered}


def main(args):
    if len(args)!=5:
        raise SystemExit('check-quiz-keyboard-replays.py A_JSON B_JSON DIST POINTER_WITNESS RECEIPT')
    a,b,dist,prior,out = map(Path,args)
    prev = load(prior)
    witnesses = [load(p) for p in (a,b)]
    pins = prev['distSha256']
    assert prev['anchor']==ANCHOR and len(pins)==49
    seen_docs = set()
    cases = []
    for witness in witnesses:
        for field in ('anchor','node','playwright','chromium','method','distSha256'):
            assert witness[field]==prev[field],field
        rows = witness['rows']
        assert len(rows)==2 and {r['id'] for r in rows}=={'quiz-keys-1','quiz-keys-2'}
        results = []
        for r in rows:
            docs = {r[k]['doc'] for k in ('produced', 'origin', 'offer')}
            assert docs.isdisjoint(seen_docs), 'same capture reused: repeated document start'
            seen_docs.update(docs)
            results.append(check(r,witness['method']['timing']))
        cases.append(results)
    for file,digest in pins.items():
        assert sha(dist/file)==digest,file
    flat = [r for run in cases for r in run]
    counts = {'contexts':len(flat),'trustedKeyboardSource':len(flat),
              'sourceWhileOfferOn':sum(r['toastAtSource']=='on' for r in flat),
              'contextsWithCoveredConfidenceKey':sum(bool(r['confidenceKeysWithPointerCovered']) for r in flat),
              'coveredConfidenceKeys':sum(len(r['confidenceKeysWithPointerCovered']) for r in flat),
              'pointerContinueNoReturn':sum(r['outcome']==OUTCOME for r in flat)}
    receipt = {'anchor':ANCHOR,'sameDistPinsAsPointerReplays':len(pins),'independentRuns':2,
               'witnessSha256':[sha(a),sha(b)],'counts':counts,'casesAB':cases}
    out.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('PASS 2+2',counts)


if __name__=='__main__':
    main(sys.argv[1:])
