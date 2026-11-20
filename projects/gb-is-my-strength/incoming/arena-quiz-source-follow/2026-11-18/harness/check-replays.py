#!/usr/bin/env python3
"""Check the browser outcomes, distinct from merely seeing a scrollIntoView call."""
import hashlib
import json
from pathlib import Path
import struct
import sys

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def main():
    if len(sys.argv) != 6:
        raise SystemExit('check-replays.py RUN_A_DIR RUN_B_DIR STAGE_13_JSON DIST RECEIPT_JSON')
    a_dir, b_dir, old_path, dist, receipt = map(Path, sys.argv[1:])
    a, b = [d / 'source-follow-witness.json' for d in (a_dir, b_dir)]
    one, two, old = [read(f) for f in (a, b, old_path)]
    assert one != two, 'A and B contain the same capture'
    assert one['anchor'] == two['anchor'] == old['anchor'] == '9edef94ece08012223c1364bec7ddcd561cf5713'
    pins = one['distSha256']
    assert pins == two['distSha256'] and len(pins) == 35
    old_pins = old['distSha256']
    common = pins.keys() & old_pins.keys()
    assert len(old_pins) == 35 and all(pins[f] == old_pins[f] for f in common)
    for f, h in (old_pins | pins).items():
        assert digest(dist / f) == h, f
    for source, root in ((one, a_dir), (two, b_dir)):
        assert source['images'].keys() == {'anatomy-at-source.png', 'anatomy-after-next-phrase.png'}
        assert len(set(source['images'].values())) == 2
        for image, h in source['images'].items():
            file = root / image
            data = file.read_bytes()
            assert data[:8] == b'\x89PNG\r\n\x1a\n' and struct.unpack('>II', data[16:24]) == (390, 844)
            assert digest(file) == h
    previous = {r['route']: r['witness'] for r in old['results'] if r['kind'] == 'start'}
    expected = {
        'anatomy-narrow-idle': False, 'anatomy-narrow-on': True,
        'anatomy-wide-on': True, 'anatomy-narrow-reduce': False,
        'gill-learning-narrow-idle': False, 'gill-learning-narrow-on': True,
        'gill-learning-narrow-reduce': False, 'gill-learning-wide-pause': True,
    }
    paired = []
    x, y = [{r['id']: r for r in data['results']} for data in (one, two)]
    assert x.keys() == y.keys() == expected.keys()
    assert len(x) == len(one['results']) == len(two['results'])
    for job, leaves in expected.items():
        rows = [x[job], y[job]]
        measures = [r['measurement'] for r in rows]
        assert rows[0]['link'] == rows[1]['link']
        assert measures[0]['speech'] == measures[1]['speech']
        assert rows[0]['quiz']['question'] == rows[1]['quiz']['question']
        for r, m in zip(rows, measures):
            assert r['ok'] and not any(r['errors'].values()), job
            assert r['documentRequests'] == [r['route']]
            assert r['quiz']['sameAfterBack'] and m['sameDocument']
            assert not m['before']['source']['painted']
            assert m['arrived']['source']['hit'] and m['held']['source']['hit'] and m['boundary']['source']['hit']
            assert m['arrived']['y'] == m['held']['y'] == m['boundary']['y']
            assert m['arrived']['url'] == m['next']['url'] == r['route'] + r['link']['fragment']
            assert m['sourceLeft'] == leaves == (not m['next']['source']['painted']), job
            assert bool(m['deltaY']) == leaves
            assert len(m['callsAfterBoundary']) == int(leaves)
            if leaves:
                follow, = m['callsAfterBoundary']
                assert follow['from']['connected'] and follow['atSettle']['hit'] and not follow['quiz']
                assert m['next']['phase'] == 'playing' and m['next']['platform']['canceled'] == 0
                if job == 'gill-learning-narrow-on':
                    assert m['arrived']['source']['focus'] and m['next']['source']['focus'], job
            if r['mode'] != 'idle':
                held = previous[r['route']]
                assert m['speech'][0]['text'] == held['before']['live']
                assert m['speech'][1] == held['firstSubmissionAfterChange']
            if r['mode'] == 'pause':
                assert m['held']['phase'] == 'paused' and m['resumed']['phase'] == 'playing'
                assert m['held']['y'] == m['resumed']['y'] and m['held']['calls'] == m['resumed']['calls']
        paired.append({'id': job, 'sourceLeftBoth': leaves, 'scrollYA': [measures[0][k]['y'] for k in ('arrived', 'next')],
                       'scrollYB': [measures[1][k]['y'] for k in ('arrived', 'next')],
                       'seenA': rows[0]['quiz']['seen'], 'seenB': rows[1]['quiz']['seen']})
    data = {'anchor': one['anchor'], 'witnessSha256A': digest(a), 'witnessSha256B': digest(b),
            'sameOutcomeForAllCases': True, 'casesPerReplay': len(paired), 'movedAwayPerReplay': sum(expected.values()),
            'distPins': len(pins), 'stage13PinsVerified': len(old_pins), 'sharedPins': len(common), 'pairs': paired}
    receipt.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'PASS: {len(paired)} cases ×2, {sum(expected.values())} real departures per run, {len(pins)} exact dist pins')


if __name__ == '__main__':
    main()
