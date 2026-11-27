#!/usr/bin/env python3
"""Compare browser outcomes across two native-input runs; quiz shuffle stays live."""
import hashlib
import json
from pathlib import Path
import sys

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def main():
    if len(sys.argv) != 6:
        raise SystemExit('check-replays.py RUN_A_JSON RUN_B_JSON STAGE_14_JSON DIST RECEIPT_JSON')
    a, b, older, dist, receipt = map(Path, sys.argv[1:])
    first, second, old = [read(f) for f in (a, b, older)]
    assert first != second, 'A and B contain the same capture'
    assert first['anchor'] == second['anchor'] == old['anchor'] == '9edef94ece08012223c1364bec7ddcd561cf5713'
    pins_a, pins_b = first['distSha256'], second['distSha256']
    assert all(pins_a[k] == pins_b[k] for k in pins_a.keys() & pins_b.keys())
    pins = pins_a | pins_b
    assert len(pins) == 36
    old_pins = old['distSha256']
    assert len(old_pins) == 35
    assert all(p[k] == h for p in (pins_a, pins_b) for k, h in old_pins.items())
    assert pins.keys() - old_pins.keys() == {'articles/dzhon-gill-chast-1-chelovek/index.html'}
    for k, h in pins.items():
        assert digest(dist / k) == h, k
    expected = {
        'anatomy-click': (0, False), 'anatomy-ctrl': (1, False),
        'anatomy-middle': (1, False), 'anatomy-ctrl-enter': (1, False),
        'learning-local-click': (0, True), 'learning-local-ctrl': (0, True),
        'learning-local-middle': (1, False), 'learning-local-ctrl-enter': (0, True),
        'learning-cross-ctrl': (1, False), 'learning-tracked-ctrl': (1, False),
        'learning-play-ctrl': (0, True), 'learning-play-middle': (1, False),
    }
    rows_a, rows_b = [{r['id']: r for r in x['results']} for x in (first, second)]
    assert rows_a.keys() == rows_b.keys() == expected.keys()
    assert len(rows_a) == len(first['results']) == len(second['results'])
    matched = []
    for key, (want_new, prevented) in expected.items():
        rows = [rows_a[key], rows_b[key]]
        w1, w2 = (r['witness'] for r in rows)
        assert w1['action'] == w2['action'] and rows[0]['link'] == rows[1]['link']
        assert rows[0]['quiz']['question'] == rows[1]['quiz']['question']
        observed = []
        for r, w in zip(rows, (w1, w2)):
            v, before, parent = w['action'], w['before'], w['parent']
            assert r['ok'] and not any(r['errors'].values()), key
            n = w['newPages']
            observed.append(int(w['child'] is not None))
            assert n in range(want_new + 1) and w['pageCount'] == 1 + n
            assert v['trusted'] is True and v['prevented'] is prevented
            assert w['parentSameDocument'] and r['quiz']['retained']
            if w['heading']:
                assert w['heading']['hit']
            assert parent['queue'] == before['queue'] and parent['playback'] == before['playback']
            doc_urls = [before['url'].split('#')[0]]
            if w['child']:
                assert n == 1 and w['incompletePage'] is None
                child = w['child']
                assert child['separateDocument'] and child['url'] == r['link']['target']
                assert parent['url'] == before['url'] and parent['historyLength'] == before['historyLength']
                assert parent['open'] == before['open'] and parent['locked'] == before['locked']
                assert w['outcome'] == 'new-page' and w['heading']
                assert not r['quiz']['reopenNeeded']
                assert child['queue']['phase'] == 'idle' and not child['openSheet'] and not child['locked']
                doc_urls.append(child['url'].split('#')[0])
            elif want_new:
                assert w['outcome'] in ('no-page-observed', 'document-response-without-page', 'blank-context')
                assert n == int(w['outcome'] == 'blank-context')
                if n:
                    assert w['incompletePage'] == {'url': 'about:blank'}
                assert w['heading'] is None and w['child'] is None
                if w['outcome'] == 'document-response-without-page' or (n and len(r['docs']) == 2):
                    doc_urls.append(r['link']['target'].split('#')[0])
                assert parent['url'] == before['url'] and parent['historyLength'] == before['historyLength']
                assert parent['open'] == before['open'] and parent['locked'] == before['locked']
                assert not r['quiz']['reopenNeeded']
            else:
                assert w['outcome'] == 'parent-fragment' and w['heading']
                assert w['child'] is None and parent['url'] == r['link']['target']
                assert parent['historyLength'] == before['historyLength'] + 1
                if prevented:
                    assert before['open'] and not parent['open'] and not parent['locked']
                    assert w['heading']['focused'] and r['quiz']['reopenNeeded']
            assert r['docs'] == [{'path': d, 'status': 200} for d in doc_urls]
            if r['playing']:
                assert parent['queue'] == {'phase': 'playing', 'index': 0}
                assert parent['playback']['spoke'] == 1 and parent['playback']['canceled'] == 0
        matched.append({'id': key, 'browserDefaultPath': bool(want_new), 'confirmedNewPagesA': observed[0], 'confirmedNewPagesB': observed[1], 'preventedBoth': prevented,
                        'parentKeepsPanel': w1['parent']['open'] if rows[0]['kind'] != 'native' else None,
                        'seenA': rows[0]['quiz']['seen'], 'seenB': rows[1]['quiz']['seen']})
    data = {'anchor': first['anchor'], 'witnessSha256A': digest(a), 'witnessSha256B': digest(b),
            'pairedDispatchSemantics': True, 'casesPerReplay': len(matched), 'distPins': len(pins),
            'stage14PinsVerified': len(old_pins), 'browserDefaultAttemptsPerReplay': sum(n for n, _ in expected.values()),
            'confirmedNewPagesA': sum(r['confirmedNewPagesA'] for r in matched), 'confirmedNewPagesB': sum(r['confirmedNewPagesB'] for r in matched),
            'canceledModifiedLocalClicksPerReplay': sum(prevented and 'ctrl' in key for key, (_, prevented) in expected.items()),
            'pairs': matched}
    receipt.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"PASS: {len(matched)} cases ×2, {data['confirmedNewPagesA']} / {data['confirmedNewPagesB']} confirmed new pages, {len(pins)} exact dist pins")


if __name__ == '__main__':
    main()
