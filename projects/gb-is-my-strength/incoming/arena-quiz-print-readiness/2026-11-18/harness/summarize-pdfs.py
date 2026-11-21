#!/usr/bin/env python3
"""Verify two paired main/font-overlay replays; retain compact PDF receipts, not the PDFs."""
import hashlib
import json
import math
import re
import sys
from contextlib import closing
from pathlib import Path

import pypdfium2 as pdf
from pypdfium2 import PDFIUM_INFO, PYPDFIUM_INFO

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

MAIN = '9edef94ece08012223c1364bec7ddcd561cf5713'
FONT_REF = '0b9576278d2ec5ea89da804934823d460720501a'
ROUTES = {'anatomy': '/articles/anatomiya-padeniya-pyat-stadiy/', 'gill2': '/articles/dzhon-gill-chast-2-uchenyi/'}
CYR = 'fonts/SourceSans3/sourcesans3-cyrillic-500.woff2'
LAT = 'fonts/SourceSans3/sourcesans3-latin-500.woff2'
MARKERS = {
    'editorial': 'Писание выше личности и системы',
    'feedback': 'Богословскую или техническую — напишите',
    'signature': 'Soli Deo Gloria',
    'quizNotice': 'Интерактивный тест доступен в электронной версии статьи.',
}
MAIN_PLAN = {('anatomy', 390, 'button'): 3, ('anatomy', 390, 'direct'): 2,
             ('anatomy', 390, 'delay'): 2, ('anatomy', 390, 'font-warm'): 3,
             ('anatomy', 390, 'print-media'): 2, ('anatomy', 1440, 'button'): 2,
             ('gill2', 1440, 'button'): 2}
FONT_PLAN = {('anatomy', 390, 'button'): 2, ('anatomy', 390, 'font-warm'): 2,
             ('gill2', 1440, 'button'): 1}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def read_sample(folder, source):
    f = folder / source['file']
    raw = f.read_bytes()
    assert raw.startswith(b'%PDF-') and len(raw) == source['bytes'] and sha(raw) == source['sha256'], f
    with closing(pdf.PdfDocument(raw)) as doc:
        segments = []
        for index in range(len(doc)):
            with closing(doc[index]) as page, closing(page.get_textpage()) as text:
                segments.append(norm(text.get_text_bounded()))
    markers = {key: [i + 1 for i, page in enumerate(segments) if value.casefold() in page.casefold()]
               for key, value in MARKERS.items()}
    assert len(markers['quizNotice']) == 1 and 'Начать проверку' not in ' '.join(segments), f
    before = source['after']['events'][0]
    return dict(file=source['file'], bytes=source['bytes'], sha256=source['sha256'], pages=len(segments),
                markerPages=markers, normalizedPagesSha256=sha('\n'.join(segments).encode()),
                pageSha256=[sha(p.encode()) for p in segments],
                fontRequests=dict(before=source['fontsBefore'], during=source['fontsDuring'],
                                  loaded500Ranges=source['loadedWeight500']),
                print=dict(source=before['source'], beforePrintMedia=before['printMedia'],
                           fontStatusBeforePdf=source['before']['fontStatus'], groups=before['groups'],
                           geometry=before['geometry'], author=before['author'], feedback=before['feedback'],
                           signature=before['signature'],
                           mediaEvents=source['after']['media'], lifecycle=[x['name'] for x in source['after']['events']],
                           reset=source['after']['state']['prepared'] is None)), segments


def load_runs(root):
    runs, seen = {}, set()
    for variant, plan in (('main', MAIN_PLAN), ('overlay', FONT_PLAN)):
        overlay = variant == 'overlay'
        ids = [f'{article}-{width}-{mode}-{rep}' for (article, width, mode), count in plan.items()
               for rep in range(1, count + 1)]
        for arm in ('a', 'b'):
            folder = root / f'{variant}-{arm}'
            data = json.loads((folder / 'browser.json').read_text())
            assert data['anchor'] == MAIN and data['overlayRef'] == (FONT_REF if overlay else None)
            assert len(data['overlaySha256']) == (9 if overlay else 0)
            assert [r['id'] for r in data['results']] == ids, f'wrong print case IDs: {folder}'
            assert {path.lstrip('/') + 'index.html' for path in ROUTES.values()} <= data['distSha256'].keys()
            for row in data['results']:
                case = row['id']
                assert case == f"{row['article']}-{row['width']}-{row['mode']}-{row['rep']}" and row['route'] == ROUTES[row['article']]
                assert [p['file'] for p in row['prints']] == [f'{case}-1.pdf', f'{case}-2.pdf']
                doc = row['prints'][0]['start']['document']
                assert type(doc) in (int, float) and math.isfinite(doc) and doc > 0, f'invalid document start: {folder} / {case}'
                assert doc not in seen, f'reused document start: {folder} / {case}'
                for p in row['prints']:
                    states = [p['start'], p['before'], p['after']['state'], *p['after']['events']]
                    assert all(s['document'] == doc for s in states), f'print moved to a different document: {folder} / {case}'
                seen.add(doc)
            runs[variant, arm] = (folder, data)
    return runs


def read_run(folder, data, dist, overlay):
    for filename, digest in data['distSha256'].items():
        assert sha((dist / filename).read_bytes()) == digest, filename
    cases = []
    for row in data['results']:
        mode = row['mode']
        anatomy = row['article'] == 'anatomy'
        short = anatomy and row['width'] == 390 and mode in ('button', 'delay', 'direct')
        reference_pages = 13 if anatomy else 34
        assert row['ok'] and len(row['prints']) == 2 and not any(row['errors'].values())
        assert all(p['start']['fontStatus'] == 'loaded' for p in row['prints'])
        a, b = (read_sample(folder, p) for p in row['prints'])
        first, first_text = a
        repeat, repeat_text = b
        assert repeat['pages'] == reference_pages and repeat['markerPages']['signature']
        if anatomy:
            assert repeat['markerPages']['editorial'] == repeat['markerPages']['feedback'] == [13]
        if short:
            assert first['pages'] == 12 and first_text == repeat_text[:-1], row['id']
            assert not any(first['markerPages'][x] for x in ('editorial', 'feedback', 'signature'))
            assert not first['fontRequests']['before'] and CYR in first['fontRequests']['during']
        else:
            assert first_text == repeat_text, row['id']
        if mode == 'font-warm':
            assert CYR in first['fontRequests']['before'] and CYR not in first['fontRequests']['during']
            assert first['fontRequests']['loaded500Ranges']
            if overlay:
                assert LAT in first['fontRequests']['before'] and LAT not in first['fontRequests']['during']
        for receipt in (first, repeat):
            assert receipt['print']['reset'] and receipt['print']['lifecycle'] == ['beforeprint', 'afterprint']
            assert receipt['print']['source'] == ('native' if mode == 'direct' else 'button')
            assert receipt['print']['beforePrintMedia'] == (mode == 'print-media')
            if anatomy:
                assert receipt['print']['author']['follower'] is False
                assert receipt['print']['feedback']['follower'] is False
        if overlay:
            assert 'fonts/fonts.css' in row['overrides']
            if short or mode == 'font-warm':
                assert LAT in row['overrides']
        cases.append(dict(id=row['id'], route=row['route'], mode=mode, width=row['width'],
                          documentStart=row['prints'][0]['start']['document'],
                          overrides=row['overrides'], first=first, repeat=repeat,
                          omittedLastPage=repeat_text[-1] if short and row['rep'] == 1 else None))
    base_signature = cases[0]['repeat']['normalizedPagesSha256']
    assert all(c['repeat']['normalizedPagesSha256'] == base_signature
               for c in cases if 'anatomiya' in c['route'] and c['mode'] != 'print-media')
    print(f"{folder.name}: {len(cases)} pairs; {sum(c['first']['pages'] < c['repeat']['pages'] for c in cases)} cold tail omissions")
    return data, cases


def compare_replay(first, second):
    for a, b in zip(first, second, strict=True):
        assert a['id'] == b['id'] and a['overrides'] == b['overrides']
        for phase in ('first', 'repeat'):
            for key in ('pageSha256', 'markerPages', 'pages', 'fontRequests'):
                assert a[phase][key] == b[phase][key], (a['id'], phase, key)
            for key in ('beforePrintMedia', 'groups', 'geometry', 'author', 'feedback', 'signature'):
                assert a[phase]['print'][key] == b[phase]['print'][key], (a['id'], phase, key)


def main(root, dist, prior):
    inputs = load_runs(root)
    versions, assets, replays = None, {}, {}
    for variant in ('main', 'overlay'):
        a, cases = read_run(*inputs[variant, 'a'], dist, variant == 'overlay')
        b, repeat = read_run(*inputs[variant, 'b'], dist, variant == 'overlay')
        compare_replay(cases, repeat)
        assert a['distSha256'] == b['distSha256'] and a['overlaySha256'] == b['overlaySha256']
        env = {k: a[k] for k in ('chromium', 'playwright', 'node')}
        assert all(v == b[k] for k, v in env.items()) and (versions is None or versions == env)
        versions = env
        assets[variant] = {'distSha256': a['distSha256'], 'overlaySha256': a['overlaySha256']}
        replays[variant] = {'a': cases, 'b': repeat}
    result = root / 'summary'
    result.mkdir(exist_ok=True)
    cold = replays['main']['a'][0]
    prior_match = None
    if prior:
        entry = json.loads(prior.read_text())
        prev = entry['pdf'][cold['route']]['phases']
        assert prev['idle']['normalizedPageTextSha256'] == cold['first']['normalizedPagesSha256']
        assert prev['idleRepeat']['normalizedPageTextSha256'] == cold['repeat']['normalizedPagesSha256']
        prior_match = True
    # Real PDF page 13 from the repeat; not a screen/print-media screenshot.
    cropped = result / 'anatomy-repeat-page-13.png'
    with closing(pdf.PdfDocument(root / 'main-a' / cold['repeat']['file'])) as doc, closing(doc[12]) as page:
        with closing(page.render(scale=1.25)) as bitmap:
            image = bitmap.to_pil().copy()
            image.crop((0, 78, image.width, min(545, image.height))).save(cropped)
    evidence = dict(anchor=MAIN, overlayRef=FONT_REF, versions=versions, pypdfium2=str(PYPDFIUM_INFO), pdfium=str(PDFIUM_INFO),
                    stage10ReplayTextMatched=prior_match, cases=sum(len(v) for r in replays.values() for v in r.values()),
                    assets=assets, replays=replays, raster=dict(file=cropped.name, page=13, sha256=sha(cropped.read_bytes()),
                    source=cold['repeat']['file'], pdfSha256=cold['repeat']['sha256']))
    (result / 'print-tail-witness.json').write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + '\n')
    print(f"PASS {evidence['cases']} contexts / {2 * evidence['cases']} PDFs; retained exact pins and both replay receipts")


if __name__ == '__main__':
    if len(sys.argv) not in (3, 4):
        sys.exit('python summarize-pdfs.py WORK DIST [STAGE10_PDF_REPLAY_JSON]')
    main(Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]) if len(sys.argv) == 4 else None)
