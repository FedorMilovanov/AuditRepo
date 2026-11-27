#!/usr/bin/env python3
"""Independently recompute contrast and compare real input states on pinned dist."""
import hashlib
import json
from pathlib import Path
import re
import struct
import sys

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def luminance(css):
    m = re.fullmatch(r'rgb\((\d+), (\d+), (\d+)\)', css)
    assert m, css
    vals = [int(ch) / 255 for ch in m.groups()]
    s = [ch / 12.92 if ch <= 0.04045 else ((ch + 0.055) / 1.055) ** 2.4 for ch in vals]
    return sum(a * b for a, b in zip(s, (0.2126, 0.7152, 0.0722)))


def contrast(state):
    assert state['backgroundImage'] == state['textShadow'] == 'none'
    assert state['visibility'] == 'visible' and not state['compositing']
    assert state['fontSize'] == '14px' and state['fontWeight'] == '700', 'small bold text uses 4.5:1'
    assert state['color'] == state['textFill'] and state['label'] == 'Продолжить'
    a, b = sorted(map(luminance, (state['textFill'], state['background'])))
    expected = round((b + 0.05) / (a + 0.05), 4)
    assert state['ratio'] == expected
    return expected


def has_rule(rules, selector, prop, value):
    return any(rule['file'] == '/css/site.css' and selector in rule['selectors'] and any(
        x == {'name': prop, 'value': value, 'important': False} for x in rule['properties']
    ) for rule in rules)


def png(path):
    data = path.read_bytes()
    assert data.startswith(b'\x89PNG\r\n\x1a\n') and data[12:16] == b'IHDR', path
    w, h = struct.unpack('>II', data[16:24])
    assert 260 < w < 390 and 200 < h < 450, (path, w, h)
    return {'width': w, 'height': h, 'sha256': sha(path)}


if len(sys.argv) != 6:
    raise SystemExit('check-replays.py RUN_A_DIR RUN_B_DIR STAGE_18_JSON DIST RECEIPT_JSON')
a, b, prevfile, dist, receipt = map(Path, sys.argv[1:])
wa, wb = (d / 'resume-label-witness.json' for d in (a, b))
data_a, data_b, prev = map(load, (wa, wb, prevfile))
assert data_a != data_b, 'A and B contain the same capture'
anchor = '9edef94ece08012223c1364bec7ddcd561cf5713'
assert data_a['anchor'] == data_b['anchor'] == prev['anchor'] == anchor
for k in ('chromium', 'playwright', 'node', 'method'):
    assert data_a[k] == data_b[k], k
pins, old = data_a['distSha256'], prev['distSha256']
assert pins == data_b['distSha256'] and len(old) == 46
assert {'css/site.css', 'css/home.css', 'index.html', 'articles/dzhon-gill-chast-2-uchenyi/index.html'} <= pins.keys()
shared = pins.keys() & old.keys()
assert all(pins[k] == old[k] for k in shared)
assert all(sha(dist / k) == v for k, v in (old | pins).items())
assert any(k.endswith('.woff2') for k in pins)

route = '/articles/dzhon-gill-chast-2-uchenyi/'
cases = [(f'{pathway}-{width}-{theme}-{mode}', width, pathway, theme, mode)
         for width, mode in ((390, 'pointer'), (1440, 'pointer'), (390, 'touch'))
         for theme in ('light', 'dark') for pathway in (('learning',) if mode == 'touch' else ('learning', 'reading'))]
by_id = [{r['id']: r for r in d['results']} for d in (data_a, data_b)]
for d, idx in zip((data_a, data_b), by_id):
    assert len(d['results']) == len(idx) == len(cases) and idx.keys() == {c[0] for c in cases}

pairs = []
for ident, width, pathway, theme, mode in cases:
    samples = []
    for mapping in by_id:
        r = mapping[ident]
        touch, dark = mode == 'touch', theme == 'dark'
        assert r['ok'] and not r['errors'] and r['freshCardHidden']
        assert (r['pathway'], r['theme'], r['touch']) == (pathway, theme, touch)
        assert r['viewport'] == {'width': width, 'height': 844 if width == 390 else 900}
        assert r['source']['hit'] and r['saved']['scrollY'] == r['source']['y']
        assert r['saved']['source'] == 'reader-state-v1'
        assert ('quiz' in r) is (pathway == 'learning')
        if pathway == 'learning':
            assert r['quiz']['retained'] and r['quiz']['href'].endswith('#sec-canticles') and r['source']['active']
        else:
            assert r['source']['top'] < 250 and r['saved']['sectionId'] == 'sec-canticles'
        assert r['ax'].startswith('- link "Продолжить":')
        assert r['responses'] == [dict(path=p, status=200) for p in ('/', route, '/', route[:-1])]
        expected_href = route[:-1] + '#' + r['saved']['sectionId']
        assert r['returned'] == dict(url=expected_href, target=r['saved']['sectionId'], nav='navigate')
        assert r['action'] == ('tap' if touch else 'Enter')

        base = r['rest']
        fill = 'rgb(212, 165, 116)' if dark else 'rgb(122, 46, 46)'
        foreground = fill if dark else 'rgb(255, 255, 255)'
        names = ('rest',) if touch else ('rest', 'hover', 'keyboard')
        ratios = {}
        for name in names:
            v = r[name]
            assert v['dark'] is dark and v['href'] == expected_href
            assert v['background'] == fill and v['textFill'] == (fill if name == 'hover' else foreground)
            assert v['hovered'] is (name == 'hover') and v['focusVisible'] is (name == 'keyboard')
            assert v['focused'] is (name == 'keyboard')
            if name != 'keyboard':
                assert v['full'] and v['hit']
            ratios[name] = contrast(v)
        assert ('tabSteps' in r) is (not touch)
        assert has_rule(r['restCascade'], '.resume-reading-btn', 'background', 'var(--color-accent)')
        assert has_rule(r['restCascade'], '.resume-reading-btn', 'color', '#fff')
        assert has_rule(r['restCascade'], 'html.dark a', 'color', '#d4a574') is dark
        if not touch:
            assert has_rule(r['hoverCascade'], 'a:hover', 'color', 'var(--color-accent)')
        white = luminance('rgb(255, 255, 255)')
        assert base['whiteOnFill'] == round((white + 0.05) / (luminance(fill) + 0.05), 4)

        probes = {}
        for name in ('rest', 'hover'):
            probe = r.get(name + 'Probe')
            assert bool(probe) is (name in ratios and ratios[name] < 4.5)
            if probe:
                assert probe['property'] == 'color' and probe['value'] == ('#000' if dark else '#fff')
                assert probe['important'] and probe['reverted']
                v = probe['after']
                for k in ('background', 'box', 'href', 'label', 'hovered', 'focused'):
                    assert v[k] == r[name][k]
                assert contrast(v) >= 4.5
                probes[name] = v['ratio']
        samples.append({'ratios': ratios, 'whiteOnFill': base['whiteOnFill'], 'fill': fill,
                        'labForegroundOnly': probes, 'action': r['action'], 'href': expected_href})
    assert samples[0] == samples[1], ident
    pairs.append({'id': ident, **samples[0]})

names = ('home-resume-light-rest.png', 'home-resume-light-hover.png', 'home-resume-dark-rest.png', 'home-resume-dark-color-probe.png')
shots = {nm: dict(a=png(a/nm), b=png(b/nm)) for nm in names}
for run in ('a', 'b'):
    assert len({x[run]['sha256'] for x in shots.values()}) == len(names)
values = [v for r in pairs for v in r['ratios'].values()]
assert len(values) == 26 and sum(v == 1.0 for v in values) == 17
result = {'anchor': anchor, 'witnessSha256A': sha(wa), 'witnessSha256B': sha(wb),
          'casesPerReplay': len(pairs), 'stateObservationsPerReplay': len(values), 'oneToOnePerReplay': sum(v == 1 for v in values),
          'distPins': len(pins), 'sharedStage18Pins': len(shared), 'verifiedStage18Pins': len(old),
          'newlyObservedPins': sorted(pins.keys() - old.keys()), 'screenshots': shots, 'pairs': pairs}
receipt.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'PASS: {len(pairs)} cases ×2, 17/26 one-to-one states per replay, all returns verified, {len(pins)} dist pins')
