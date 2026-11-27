#!/usr/bin/env python3
"""Compare two independent same-document traversals, ignoring quiz shuffle."""
import hashlib
import json
from pathlib import Path
import sys

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


if len(sys.argv) != 6:
    raise SystemExit('check-replays.py RUN_A_JSON RUN_B_JSON STAGE_15_JSON DIST RECEIPT_JSON')
a, b, prior, dist, receipt = map(Path, sys.argv[1:])
a_data, b_data, prior_data = map(read, (a, b, prior))
assert a_data != b_data, 'A and B contain the same capture'
anchor = a_data['anchor']
assert anchor == b_data['anchor'] == prior_data['anchor'] == '9edef94ece08012223c1364bec7ddcd561cf5713'
for meta in ('chromium', 'playwright', 'node', 'method'):
    assert a_data[meta] == b_data[meta], meta
pins, old_pins = a_data['distSha256'], prior_data['distSha256']
assert len(pins) == 35 and pins == b_data['distSha256']
assert len(old_pins) == 36 and old_pins.keys() - pins.keys() == {'articles/dzhon-gill-chast-1-chelovek/index.html'}
assert all(old_pins[k] == h == sha(dist / k) for k, h in pins.items())

modes = ('native', 'closed', 'close-before', 'reopen-dismiss', 'reopen-link')
keys = [(f'{mode}-{width}', width, mode) for width in (390, 1440) for mode in modes]
rows = [{r['id']: r for r in data['results']} for data in (a_data, b_data)]
for data, mapping in zip((a_data, b_data), rows):
    assert len(data['results']) == len(mapping) == len(keys) and mapping.keys() == {key for key, _, _ in keys}

pairs = []
for key, width, mode in keys:
    native, blocked = mode == 'native', mode.startswith('reopen-')
    recovery_hit = None if not blocked else mode == 'reopen-link'
    doc = '/articles/' + ('anatomiya-padeniya-pyat-stadiy/' if native else 'dzhon-gill-chast-2-uchenyi/')
    initial, target = doc + ('#sec-quiz' if native else ''), doc + ('#metod' if native else '#sec-canticles')
    samples = []
    for mapping in rows:
        r = mapping[key]
        assert r['ok'] and r['errors'] == [], key
        assert r['mode'] == mode and r['viewport'] == {'width': width, 'height': 844 if width == 390 else 900}
        assert r['sameDocument'] and r['sameHistoryEntriesOnTraversalAndRecovery']
        assert r['documentRequests'] == [doc] and r['docs'] == [{'path': doc, 'status': 200}]
        assert r['quiz']['verdict'].startswith('Неверно') and r['quiz']['retainedViaUi']
        steps = r['steps']
        step_urls = {'answered': initial, 'click': target, 'back': initial, 'forward': target}
        if blocked or mode == 'close-before':
            step_urls['reopen'] = initial
        if mode == 'close-before':
            step_urls['dismissBeforeForward'] = initial
        if blocked:
            step_urls['recovery'] = target
        assert steps.keys() == step_urls.keys()
        answered, landed, back, fwd = (steps[n] for n in ('answered', 'click', 'back', 'forward'))
        assert landed['historyLength'] == answered['historyLength'] + 1
        assert landed['currentIndex'] == answered['currentIndex'] + 1
        for name, url in step_urls.items():
            s = steps[name]
            assert s['sameAnswer'] and s['scrollRestoration'] == 'auto'
            assert s['url'] == url and s['entries'][s['currentIndex']] == url
            if name != 'answered':
                assert s['historyLength'] == landed['historyLength'] and s['entries'] == landed['entries']
                assert s['currentIndex'] == (landed if url == target else answered)['currentIndex']
        assert landed['heading']['inViewport'] and landed['heading']['hit']
        assert not landed['sheet']['open'] and not landed['sheet']['lock']
        if not native:
            assert answered['sheet']['open'] and answered['sheet']['lock']
            assert landed['heading']['focus'] and not back['heading']['inViewport']
        if mode == 'close-before':
            assert steps['reopen']['sheet']['open'] and steps['reopen']['sheet']['lock']
            before = steps['dismissBeforeForward']
            assert not before['sheet']['open'] and not before['sheet']['lock'] and not before['heading']['hit']
        assert fwd['sheet']['open'] is blocked and fwd['sheet']['lock'] is blocked
        assert fwd['heading']['inViewport'] is (not blocked) and fwd['heading']['hit'] is (not blocked), key
        if blocked:
            assert fwd['sheet']['activeQuiz'] and fwd['sheet']['hidden'] == 'false'
            assert fwd['scrollY'] == back['scrollY'] and fwd['heading']['top'] >= r['viewport']['height']
            assert fwd['focus'] == steps['reopen']['focus'] and not fwd['heading']['focus']
            rec = steps['recovery']
            assert not rec['sheet']['open'] and not rec['sheet']['lock'] and rec['sheet']['hidden'] == 'true'
            assert rec['heading']['inViewport'] is recovery_hit and rec['heading']['hit'] is recovery_hit, key
            assert rec['heading']['focus'] is recovery_hit
            assert abs(rec['scrollY'] - (landed if recovery_hit else fwd)['scrollY']) <= 1
        else:
            assert abs(fwd['scrollY'] - landed['scrollY']) <= 1
        for event in ('popstate', 'hashchange'):
            assert [e['url'] for e in r['events'] if e['type'] == event] == ([target] if native else []) + [initial, target]
        clicks = [e for e in r['events'] if e['type'] == 'source-click']
        assert [e['url'] for e in clicks] == [initial] + ([target] if recovery_hit else [])
        assert all(e['trusted'] and e['prevented'] is (not native) and e['href'] == r['quiz']['href'] for e in clicks)
        assert [e for e in r['events'] if e['type'] in ('pageshow', 'pagehide')] == [
            {'type': 'pageshow', 'url': initial, 'persisted': False},
        ]
        samples.append({'scrollYClick': landed['scrollY'], 'scrollYBack': back['scrollY'],
                        'scrollYForward': fwd['scrollY'], 'headingTopForward': fwd['heading']['top'],
                        'focusForward': fwd['focus'], 'scrollYRecovery': steps.get('recovery', {}).get('scrollY'),
                        'seen': r['quiz']['seen']})
    assert rows[0][key]['quiz']['question'] == rows[1][key]['quiz']['question']
    pairs.append({'id': key, 'headingHitOnForwardBoth': not blocked, 'sheetLockedOnForwardBoth': blocked,
                  'headingHitAfterRecoveryBoth': recovery_hit, 'a': samples[0], 'b': samples[1]})

result = {'anchor': anchor, 'witnessSha256A': sha(a), 'witnessSha256B': sha(b), 'casesPerReplay': len(pairs),
          'matchedDistPinsFromStage15': len(pins), 'blockedForwardPerReplay': sum(p['sheetLockedOnForwardBoth'] for p in pairs),
          'caughtSameHashRecoveryPerReplay': sum(p['headingHitAfterRecoveryBoth'] is True for p in pairs), 'pairs': pairs}
receipt.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"PASS: {len(pairs)} measured cases ×2, {result['blockedForwardPerReplay']} blocked Forward outcomes per replay, {len(pins)} matching dist pins")
