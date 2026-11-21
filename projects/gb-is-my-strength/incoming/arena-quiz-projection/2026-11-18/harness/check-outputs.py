#!/usr/bin/env python3
"""Verify quiz projection/state fingerprints and inspect actual printed PDF bytes.

Requires pypdfium2 (4.30.0) and Pillow (11.3.0) for the unannotated image crop.
Pass OUT from quiz-projection.mjs in 'all' mode and the anchored Product dist.
"""
import hashlib
import json
import re
import sys
from contextlib import closing
from pathlib import Path

import pypdfium2 as pdf
from pypdfium2.version import PDFIUM_INFO, PYPDFIUM_INFO

if not __debug__:
    raise SystemExit('Audit assertions are disabled; remove -O and unset PYTHONOPTIMIZE.')

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
NOTICE = 'Интерактивный тест доступен в электронной версии статьи.'
A = '/articles/anatomiya-padeniya-pyat-stadiy/'
G = '/articles/dzhon-gill-chast-2-uchenyi/'
D = '/articles/diotrefy-nashego-vremeni/'
PRINT_ARTICLES = {A: ('anatomy', 13), G: ('gill2', 34)}
PRINT_PHASES = {'idle': 'idle', 'idleRepeat': 'idle-repeat', 'answered': 'answered', 'result': 'result'}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def norm(text):
    return re.sub(r'\s+', ' ', text).strip()


def projection_state(row, codes, inside):
    assert list(row['states']) == list(codes), row['route']
    baseline = row['states']['idle']['text']['withoutQuizSha256']
    for phase, count in codes.items():
        state = row['states'][phase]
        assert state['root']['quizInside'] == inside
        assert len(state['text']['quiz']) == count == state['quizPrintNodes']
        assert state['text']['withoutQuizSha256'] == baseline
        if row['kind'].startswith('native') and count > 0:
            assert [part['tag'] for part in state['text']['quiz']][:2] == ['P', 'H3']
            assert [part['text'] for part in state['text']['quiz']][:2] == [norm(state['progress']), norm(state['question'])]
            assert all(part['tag'] in ('P', 'H3') for part in state['text']['quiz'])
        if phase == 'answered':
            assert state['feedback'] and len(state['options']) >= 3
            assert all(op['disabled'] for op in state['options'])


def crop_notice(doc, index, out):
    page = doc[index - 1]
    txt = page.get_textpage()
    hit = txt.search(NOTICE, match_case=True).get_next()
    assert hit is not None
    first, count = hit
    boxes = [txt.get_charbox(i) for i in range(first, first + count)]
    _, height = page.get_size()
    top, bottom = max(b[3] for b in boxes), min(b[1] for b in boxes)
    # Crop coordinates for PIL are top-left, PDF text coordinates are bottom-left.
    scale = 1.6
    bitmap = page.render(scale=scale)
    im = bitmap.to_pil()
    cropped = im.crop((0, max(0, int((height - top - 66) * scale)),
                       im.width, min(im.height, int((height - bottom + 45) * scale))))
    path = out / 'print-static-quiz-notice.png'
    cropped.save(path)
    return {'file': path.name, 'sha256': sha(path.read_bytes()), 'dimensions': list(cropped.size), 'page': index}


def check_speech(row, phases):
    # One projected segment can be split across multiple utterances.
    def joined(parts):
        return re.sub(r'\s+', '', ''.join(p['text'] for p in parts))

    speech = row.get('speech', {})
    assert speech.keys() == phases.keys(), f"missing or unexpected speech phases: {row['kind']} {row['route']}"
    for phase, count in phases.items():
        s = speech[phase]
        scope = row['route'], phase
        assert s['phase'] == 'complete' and s['engine'] == 'webspeech', scope
        projected = row['states'][phase]['text']['quiz']
        assert s['utterances'] > 0 and s['quizSegments'] == len(projected) == count, scope
        emitted = s['quizUtterances']
        indices = [u['i'] for u in emitted]
        assert indices == sorted(set(indices)) and all(0 <= i < s['utterances'] for i in indices), scope
        assert joined(emitted) == joined(projected), scope


def check_manifest(witness):
    assert witness['anchor'] == ANCHOR, 'wrong Product anchor'
    rows = witness['results']
    assert len(rows) == witness['completed'] == witness['total'] == 38 and witness['mode'] == 'all', 'wrong scenario total'
    assert len({(r['kind'], r['route']) for r in rows}) == len(rows), 'duplicate route within a scenario type'
    assert all(r['ok'] and not any(r['errors'].values()) for r in witness['results'])
    by_kind = {k: [r for r in witness['results'] if r['kind'] == k] for k in
               ('native-matrix', 'learning-matrix', 'native-channels', 'learning-channels', 'disclosure-channels')}
    assert list(map(len, by_kind.values())) == [23, 11, 2, 1, 1]
    for kind, expected in (('native-channels', {A, G}), ('learning-channels', {G}), ('disclosure-channels', {D})):
        assert {r['route'] for r in by_kind[kind]} == expected, kind
    for family in ('native', 'learning'):
        matrix = by_kind[f'{family}-matrix']
        assert sorted(witness['routes'][family]) == sorted(r['route'] for r in matrix), family
        assert all('speech' not in r and 'pdf' not in r for r in matrix), family
    pages = {r['route'].lstrip('/') + 'index.html' for r in rows}
    assert pages == {f for f in witness['distSha256'] if f.endswith('/index.html')}, 'missing or unexpected page pins'
    native_questions = sum(r['totalQuestions'] for r in by_kind['native-matrix'])
    assert native_questions == 153
    for r in by_kind['native-matrix']:
        projection_state(r, {'idle': 0, 'started': 2, 'answered': 4, 'next': 2}, True)
        assert r['states']['answered']['feedback'] == 'Неверно'
        assert len(r['states']['answered']['explanation']) == 2
    for r in by_kind['learning-matrix'] + by_kind['learning-channels']:
        projection_state(r, {'idle': 0, 'answered': 0, 'closed': 0}, False)

    r, = by_kind['learning-channels']
    check_speech(r, {'idle': 0, 'closed': 0})
    assert r['speech']['idle']['allSha256'] == r['speech']['closed']['allSha256']

    r, = by_kind['disclosure-channels']
    check_speech(r, {'closed': 52, 'opened': 52})
    closed, opened = (r['states'][k] for k in ('closed', 'opened'))
    assert closed['text']['fromClosedDisclosure'] == 50 and opened['text']['fromClosedDisclosure'] == 45
    assert closed['text']['sha256'] == opened['text']['sha256']
    assert r['speech']['closed']['allSha256'] == r['speech']['opened']['allSha256']
    assert 'Разбор:' not in r['ax']['closed'] and 'Разбор:' in r['ax']['firstOpened']
    actual = norm(' '.join(x['text'] for x in r['speech']['closed']['quizUtterances']))
    for d in closed['disclosures']:
        assert all(norm(choice) in actual for choice in d['choices'])
        assert norm(d['explanation']) in actual
        assert norm(d['prompt']) not in actual

    return by_kind


def check_pins(witness, dist):
    dist = dist.resolve(strict=True)
    for name, expected in witness['distSha256'].items():
        relative = Path(name)
        assert not relative.is_absolute() and '..' not in relative.parts and relative.as_posix() == name, name
        asset = (dist / relative).resolve(strict=True)
        assert asset.is_relative_to(dist), name
        raw = asset.read_bytes()
        assert sha(raw) == expected, f'projection dist pin mismatch: {name}'
        if name.endswith('/index.html'):
            route = '/' + name.removesuffix('index.html')
            for family, marker in (('native', br'\bid="quizPlaceholder"'), ('learning', br'\bid="gillQuizData"')):
                assert bool(re.search(marker, raw)) == (route in witness['routes'][family]), (family, route)


def main(out, dist):
    witness = json.loads((out / 'quiz-projection-witness.json').read_text())
    by_kind = check_manifest(witness)
    check_pins(witness, dist)
    receipts, seen_pdfs, crop_source = {}, set(), None
    for r in by_kind['native-channels']:
        projection_state(r, {'idle': 0, 'started': 2, 'answered': 4, 'result': 3, 'restarted': 2}, True)
        slug, repeat_pages = PRINT_ARTICLES[r['route']]
        check_speech(r, {'idle': 0, 'started': 2, 'answered': 4, 'result': 3})
        assert r['speech']['result']['quizUtterances'][0]['text'] == r['states']['result']['progress']
        probes = [r['states']['started']['progress'], r['states']['started']['question'],
                  *r['states']['answered']['explanation'], r['states']['result']['progress'],
                  'Начать проверку', 'Следующий вопрос', 'Показать результат', 'Пройти ещё раз']
        phase_text = {}
        rows = {}
        assert list(r['pdf']) == list(PRINT_PHASES), r['route']
        for phase, suffix in PRINT_PHASES.items():
            exported = r['pdf'][phase]
            assert exported['file'] == f'{slug}-{suffix}.pdf', (r['route'], phase, exported['file'])
            file = out / exported['file']
            stat = file.stat()
            identity = stat.st_dev, stat.st_ino
            assert identity not in seen_pdfs, f'reused PDF file: {file.name}'
            seen_pdfs.add(identity)  # Equal PDF bytes do not by themselves identify the capture.
            raw = file.read_bytes()
            assert len(raw) == exported['bytes'] and sha(raw) == exported['sha256'], file.name
            assert exported['request'] == 'button' and exported['reset'] is True
            assert [e['name'] for e in exported['nativeEvents']] == ['beforeprint', 'afterprint'], file.name
            with closing(pdf.PdfDocument(raw)) as doc:
                pages = []
                for index in range(len(doc)):
                    with closing(doc[index]) as page, closing(page.get_textpage()) as text:
                        pages.append(norm(text.get_text_bounded()))
                indices = [i for i, text in enumerate(pages, 1) if NOTICE in text]
                full = norm(' '.join(pages))
                assert len(indices) == 1 and 'Проверь себя' in pages[indices[0] - 1]
                leaked = [token for token in probes if norm(token) in full]
                assert not leaked, (file.name, leaked)
                phase_text[phase] = pages
                rows[phase] = {
                    'file': exported['file'], 'sha256': exported['sha256'], 'pages': len(pages),
                    'normalizedPageTextSha256': sha('\n'.join(pages).encode('utf-8')),
                    'notice': NOTICE, 'noticePage': indices[0], 'checkedAbsent': probes,
                }
                if r['route'] == G and phase == 'answered':
                    crop_source = file, indices[0]
        reference = phase_text['idleRepeat']
        assert len(reference) == repeat_pages, r['route']
        assert phase_text['answered'] == phase_text['result'] == reference
        first = phase_text['idle']
        details = {'answerAndResultMatchIdleRepeat': True, 'firstIdleMatchesRepeat': first == reference}
        if first != reference:
            # A separate first-print difference has been observed even before touching the quiz.
            # Keep it visible; never use it as evidence that the quiz changed pagination.
            assert r['route'] == A and len(reference) == len(first) + 1 and first == reference[:-1]
            assert 'Писание выше личности и системы' in reference[-1]
            details['firstIdleMissingTailPageText'] = reference[-1]
        receipts[r['route']] = {'phases': rows, 'comparisons': details}
        print(r['route'], len(first), '→', len(reference),
              'pages idle/repeat; quiz PDF text matches repeat, with static notice only')
    assert crop_source is not None
    file, page = crop_source
    with closing(pdf.PdfDocument(file)) as doc:
        crop = crop_notice(doc, page, out)
    report = {'anchor': witness['anchor'], 'pypdfium2': str(PYPDFIUM_INFO), 'pdfium': str(PDFIUM_INFO),
              'nativeProjectionRoutes': len(by_kind['native-matrix']), 'nativeBankSize': 153,
              'learningProjectionRoutes': 11, 'closedDisclosureBlocks': 50,
              'speechRuns': sum(len(r.get('speech', {})) for r in witness['results']),
              'pdfFiles': sum(len(x['phases']) for x in receipts.values()), 'pdf': receipts, 'crop': crop}
    (out / 'pdf-text-witness.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"{witness['completed']}/{witness['total']} scenarios interpreted; {report['speechRuns']} complete speech queues, "
          f"{report['pdfFiles']} real PDFs; text and scope assertions passed")


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('python check-outputs.py OUT DIST')
    main(Path(sys.argv[1]), Path(sys.argv[2]))
