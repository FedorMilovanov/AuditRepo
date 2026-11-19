#!/usr/bin/env python3
"""Assert the actual saved anchor/ratio and visible landing in independent runs."""
import hashlib
import json
from pathlib import Path
import sys


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


if len(sys.argv) != 6:
    raise SystemExit('check-replays.py RUN_A_JSON RUN_B_JSON STAGE_16_JSON DIST RECEIPT_JSON')
a, b, prior, dist, receipt = map(Path, sys.argv[1:])
data_a, data_b, baseline = map(read, (a, b, prior))
anchor = data_a['anchor']
assert anchor == data_b['anchor'] == baseline['anchor'] == '9edef94ece08012223c1364bec7ddcd561cf5713'
for k in ('chromium', 'playwright', 'node', 'method'):
    assert data_a[k] == data_b[k], k
pins, old_pins = data_a['distSha256'], baseline['distSha256']
assert len(pins) == 40 and pins == data_b['distSha256'] and len(old_pins) == 35
common = pins.keys() & old_pins.keys()
assert len(common) == 34 and all(pins[k] == old_pins[k] for k in common)
assert old_pins.keys() - pins.keys() == {'articles/anatomiya-padeniya-pyat-stadiy/index.html'}
assert pins.keys() - old_pins.keys() == {
    '_astro/BaseLayout.D_7an2sg.css', 'css/home.css', 'hard-texts/genesis-6/index.html',
    'js/reader-library-presenter.js', 'js/reader-library-v3.js', 'js/site.js',
}
for k, v in (old_pins | pins).items():
    assert sha(dist / k) == v, k

route = '/articles/dzhon-gill-chast-2-uchenyi/'
other = '/hard-texts/genesis-6/'
source, preceding = 'sec-canticles', 'sec-hebrew'
keys = [(f'{m}-{w}', w, m) for w in (390, 1440) for m in ('native', 'learning', 'learning-wheel')]
rows = [{r['id']: r for r in d['results']} for d in (data_a, data_b)]
for d, index in zip((data_a, data_b), rows):
    assert len(d['results']) == len(index) == 6 and index.keys() == {k for k, _, _ in keys}

items = []
for key, width, mode in keys:
    expected = preceding if mode == 'learning' else source
    samples = []
    for d in rows:
        r = d[key]
        assert r['ok'] and not r['errors'] and r['mode'] == mode, key
        assert r['viewport'] == {'width': width, 'height': 844 if width == 390 else 900}
        assert r['quiz']['retainedOnHandoff'] and r['pageCount'] == 1
        assert r['quiz']['href'].endswith('#' + source)
        assert r['documentRequests'] == [route, other, route.rstrip('/')]
        assert r['documentResponses'] == [dict(path=p, status=200) for p in r['documentRequests']]
        click, final = r['click'], r['resumed']
        assert click['route'] == route + '#' + source and click['unlocked']
        assert click['source']['id'] == source and click['source']['hit'] and click['source']['inView']
        assert click['libraryCutoff'] == 250
        heading_before_wheel = click['source']['top']
        if mode == 'native':
            assert heading_before_wheel < 250 and click['library']['anchor'] == source
        else:
            assert click['source']['focused'] and heading_before_wheel > 250
            assert click['library']['anchor'] == preceding and not click['savedHeading']['inView']
        assert ('wheel' in r) is (mode == 'learning-wheel')
        left = r.get('wheel', click)
        if mode == 'learning-wheel':
            assert left['deltaY'] > 0 and left['scrollY'] > click['scrollY']
            assert left['route'] == click['route'] and left['source']['hit'] and left['source']['top'] < 250
        rec = left['library']
        assert rec['state'] == 'reading' and rec['anchor'] == expected
        assert abs(rec['ratio'] - left['scrollY'] / left['maxScroll']) <= 0.0001
        assert r['other']['path'] == other and r['other']['readingStillMarked'] and r['other']['sameAnchorAndRatio']
        canon = r['other']['canonicalAfterPagehide']
        assert canon['source'] == 'reader-state-v1' and canon['key'].endswith(':' + route.rstrip('/'))
        assert canon['sectionId'] == expected and canon['scrollY'] == left['scrollY']
        assert final['separateDocument'] and final['nav'] == 'navigate' and final['unlocked']
        assert final['route'] == route.rstrip('/')
        assert final['savedHeading']['id'] == expected and final['savedHeading']['hit']
        assert final['source']['hit'] is (expected == source)
        if expected == preceding:
            assert final['source']['top'] >= r['viewport']['height']
            assert final['scrollY'] < left['scrollY']
        samples.append({'clickedSourceTop': heading_before_wheel, 'sourceTopOnSave': left['source']['top'],
                        'scrollYOnSave': left['scrollY'], 'recordRatio': rec['ratio'],
                        'scrollYAfterResume': final['scrollY'], 'sourceTopAfterResume': final['source']['top']})
    assert rows[0][key]['quiz']['question'] == rows[1][key]['quiz']['question']
    items.append({'id': key, 'savedAnchorBoth': expected, 'landedAnchorBoth': expected,
                  'sourceHitOnResumeBoth': expected == source, 'a': samples[0], 'b': samples[1]})

result = {'anchor': anchor, 'witnessSha256A': sha(a), 'witnessSha256B': sha(b), 'casesPerReplay': len(items),
          'distPins': len(pins), 'sharedStage16Pins': len(common), 'previousHeadingLandingsPerReplay':
          sum(not x['sourceHitOnResumeBoth'] for x in items), 'pairs': items}
receipt.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"PASS: {len(items)} cases ×2, {result['previousHeadingLandingsPerReplay']} returns to the preceding heading per replay, {len(pins)} exact dist pins")
