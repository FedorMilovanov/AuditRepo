#!/usr/bin/env python3
"""Compare actual resume choices, durable positions and visual landings."""
import hashlib
import json
from pathlib import Path
import sys


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


if len(sys.argv) != 6:
    raise SystemExit('check-replays.py RUN_A_JSON RUN_B_JSON STAGE_17_JSON DIST RECEIPT_JSON')
a, b, prior, dist, receipt = map(Path, sys.argv[1:])
data_a, data_b, baseline = map(read, (a, b, prior))
anchor = data_a['anchor']
assert anchor == data_b['anchor'] == baseline['anchor'] == '9edef94ece08012223c1364bec7ddcd561cf5713'
for k in ('chromium', 'playwright', 'node', 'method'):
    assert data_a[k] == data_b[k], k
pins, old = data_a['distSha256'], baseline['distSha256']
assert pins == data_b['distSha256'] and len(pins) == 46 and len(old) == 40
common = pins.keys() & old.keys()
assert common == old.keys()
assert all(pins[k] == old[k] for k in common)
assert all(sha(dist / k) == v for k, v in (old | pins).items())

route = '/articles/dzhon-gill-chast-2-uchenyi/'
key = route.rstrip('/')
other, source, preceding = '/hard-texts/genesis-6/', 'sec-canticles', 'sec-hebrew'
specs = [(s, m) for s in ('home', 'toast') for m in ('learning', 'native', 'wheel')]
specs += [('fragment', 'learning'), ('library-bridge', 'wheel')]
cases = [(f'{s}-{m}-{w}', w, s, m) for w in (390, 1440) for s, m in specs]
by_id = [{r['id']: r for r in d['results']} for d in (data_a, data_b)]
for d, index in zip((data_a, data_b), by_id):
    assert len(d['results']) == len(index) == len(cases) and index.keys() == {c[0] for c in cases}

pairs = []
for ident, width, surface, mode in cases:
    bridge = surface == 'library-bridge'
    chosen = preceding if mode == 'learning' else source
    target = source if surface == 'fragment' else preceding if bridge else chosen
    samples = []
    for mapping in by_id:
        r = mapping[ident]
        assert r['ok'] and not r['errors'] and (r['surface'], r['mode']) == (surface, mode), ident
        assert r['viewport'] == {'width': width, 'height': 844 if width == 390 else 900}
        assert r['quiz']['retainedOnHandoff'] and r['quiz']['href'].endswith('#' + source)
        first, returned = r['click'], r['returned']
        assert first['url'] == route + '#' + source
        assert first['target'] == (source if mode == 'native' else None)
        assert first['source']['hit'] and not first['sheetOpen'] and not first['locked']
        if mode != 'native':
            assert first['source']['focused'] and first['source']['top'] > first['state']['readingLine']
        assert ('wheel' in r) is (mode == 'wheel')
        left = r.get('wheel', first)
        if mode == 'wheel':
            assert left['dy'] > 0 and left['scrollY'] > first['scrollY'] and left['url'] == first['url']
            assert left['source']['hit'] and 250 < left['source']['top'] < left['state']['readingLine']
        record = r['recordAtHome']
        assert record['source'] == 'reader-state-v1' and record['sectionId'] == chosen
        assert record['scrollY'] == left['scrollY'] == left['state']['scrollY']
        assert record['sectionId'] == left['state']['sectionId'] and record['sectionTitle'] == left['state']['sectionTitle']
        assert returned['newDocumentAfterDeparture'] and returned['nav'] == 'navigate'
        assert not returned['locked'] and not returned['sheetOpen']
        if bridge or surface == 'home':
            c = r['control']
            assert c['href'] == key + '#' + chosen and c['title']
            assert c['meta'].startswith(record['sectionTitle'] + ' · ')
        if bridge:
            assert record['library']['state'] == 'reading' and record['library']['anchor'] == preceding != chosen
            assert 0 < record['library']['ratio'] < 1 and r['bridge']['sameBothRecordsOnOtherRoute']
            assert returned['url'] == key and returned['target'] is None
        else:
            assert record['library'] is None
            if surface == 'home':
                assert returned['url'] == r['control']['href'] and returned['target'] == chosen
            elif surface == 'toast':
                before = r['control']['before']
                assert 'вы здесь были' in r['control']['text'].casefold()
                assert before['url'] == returned['url'] == route and before['scrollY'] <= 200
                assert before['toastOn'] and not returned['toastOn'] and returned['target'] is None
            else:
                assert returned['url'] == route + '#' + source and returned['target'] == source
        p = key if surface == 'home' or bridge else route
        assert r['requests'] == [route, '/', *([other] if bridge else []), p]
        assert r['responses'] == [dict(path=x, status=200) for x in r['requests']]
        assert returned['source']['hit'] is (target == source)
        if target == preceding:
            assert returned['preceding']['hit'] and returned['source']['top'] >= r['viewport']['height']
            assert returned['scrollY'] < left['scrollY']
        samples.append({'sourceTopOnSave': left['source']['top'], 'readingLine': left['state']['readingLine'],
                        'scrollYOnSave': left['scrollY'], 'scrollYAfterReturn': returned['scrollY'],
                        'sourceTopAfterReturn': returned['source']['top'], 'urlAfterReturn': returned['url']})
    assert by_id[0][ident]['quiz']['question'] == by_id[1][ident]['quiz']['question']
    pairs.append({'id': ident, 'readerStateSectionBoth': chosen, 'landingBoth': target,
                  'libraryAnchorBoth': preceding if bridge else None, 'a': samples[0], 'b': samples[1]})

result = {'anchor': anchor, 'witnessSha256A': sha(a), 'witnessSha256B': sha(b), 'casesPerReplay': len(pairs),
          'distPins': len(pins), 'sharedStage17Pins': len(common), 'stage17Only': sorted(old.keys() - pins.keys()),
          'newlyLoadedPins': sorted(pins.keys() - old.keys()),
          'centeredSourceWrongHomeOrToastPerReplay': sum(x['landingBoth'] == preceding and x['libraryAnchorBoth'] is None for x in pairs),
          'libraryReaderStateDisagreementsPerReplay': sum(x['libraryAnchorBoth'] is not None for x in pairs), 'pairs': pairs}
receipt.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"PASS: {len(pairs)} cases ×2, {result['centeredSourceWrongHomeOrToastPerReplay']} earlier returns and "
      f"{result['libraryReaderStateDisagreementsPerReplay']} same-profile disagreements per replay; {len(pins)} dist pins")
