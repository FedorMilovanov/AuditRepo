#!/usr/bin/env python3
"""Check the two held-Web-Speech runs and bridge their pins/text to stage 10."""
import hashlib
import json
from pathlib import Path
import sys


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def record(rows):
    return {r['id']: r for r in rows}


def main():
    if len(sys.argv) != 6:
        raise SystemExit('check-replays.py RUN_A_JSON RUN_B_JSON STAGE_10_JSON DIST RECEIPT_JSON')
    a, b, prior, dist, receipt = map(Path, sys.argv[1:])
    first, second, old = (json.loads(f.read_text(encoding='utf-8')) for f in (a, b, prior))
    assert first == second and digest(a) == digest(b), 'replays must agree, including captured phrases and timing order'
    assert first['anchor'] == old['anchor'] == '9edef94ece08012223c1364bec7ddcd561cf5713'
    pins, old_pins = first['distSha256'], old['distSha256']
    assert len(pins) == 35 and len(old_pins) == 38
    common = pins.keys() & old_pins.keys()
    assert all(pins[f] == old_pins[f] for f in common)
    for file, sha256 in (old_pins | pins).items():
        assert digest(dist / file) == sha256, file
    old_jobs = {r['route']: r['speech'] for r in old['results'] if r['kind'] == 'native-channels'}
    expected = {
        'anatomy-start': ('idle', 'started', 0, 2),
        'gill2-start': ('idle', 'started', 0, 2),
        'anatomy-feedback': ('started', 'answered', 2, 5),
        'gill2-feedback': ('started', 'answered', 2, 4),
        'anatomy-next': ('answered', None, 5, 2),
        'gill2-next': ('answered', None, 4, 2),
        'gill2-paused-next': ('answered', None, 2, 2),
        'gill2-rate-next': ('answered', None, 3, 2),
        'gill2-stop-next': (None, None, 0, 2),
        'gill2-retry': ('result', 'started', 3, 2),
        'gill2-learning': ('idle', 'idle', 0, 0),
    }
    rows = record(first['results'])
    assert rows.keys() == expected.keys() and len(first['results']) == len(rows)
    bridge_count = 0
    for case, (before, after, later_quiz, new_quiz) in expected.items():
        r = rows[case]
        assert r['ok'] is True and not any(r['errors'].values()), case
        w = r['witness']
        in_flight, fresh = r['streams']['inFlight'], r['streams']['fresh']
        assert w['sameDocument'] and w['before'] == w['after'], case
        assert w['afterBoth']['phase'] == 'complete' and w['afterBoth']['progress'] == 1
        assert sum(x['afterChange'] for x in in_flight['quiz']) == later_quiz, case
        assert len(fresh['quiz']) == new_quiz, case
        old_speech = old_jobs[r['route']]
        assert fresh['bodySha256'] == old_speech['idle']['bodySha256'], case
        for stream, previous in ((in_flight, before), (fresh, after)):
            if previous:
                assert stream['total'] == old_speech[previous]['utterances'], case
                assert stream['sha256'] == old_speech[previous]['allSha256'], case
                bridge_count += 1
        if case == 'gill2-stop-next':
            assert in_flight['complete'] is False and w['firstEnd']['phase'] == 'idle'
            assert w['firstEnd']['partCount'] == 0 and w['firstEnd']['platform']['canceled'] == 1
        else:
            assert in_flight['complete'] is True and w['firstEnd']['phase'] == 'complete'
    assert len({rows[k]['streams']['fresh']['sha256'] for k in (
        'gill2-next', 'gill2-paused-next', 'gill2-rate-next', 'gill2-stop-next')}) == 1
    data = {
        'anchor': first['anchor'],
        'witnessSha256A': digest(a), 'witnessSha256B': digest(b),
        'replaysByteEqual': True, 'completedScenariosPerReplay': len(rows),
        'completePlaySessionsPerReplay': sum(1 + r['streams']['inFlight']['complete'] for r in rows.values()),
        'stoppedPrefixesPerReplay': sum(not r['streams']['inFlight']['complete'] for r in rows.values()),
        'distPins': len(pins), 'stage10PinsVerified': len(old_pins), 'sharedPins': len(common),
        'stage10MatchedCompleteTextStreamsPerReplay': bridge_count,
    }
    receipt.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'PASS: {len(rows)} identical scenarios x2, {len(pins)} pins, {bridge_count} complete streams match stage 10')


if __name__ == '__main__':
    main()
