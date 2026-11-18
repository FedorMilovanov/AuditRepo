#!/usr/bin/env python3
"""Verify quiz projection/state fingerprints and inspect actual printed PDF bytes.

Requires pypdfium2 (4.30.0) and Pillow (11.3.0) for the unannotated image crop.
Run on each OUT produced by quiz-projection.mjs in 'all' mode.
"""
import hashlib
import json
import re
import sys
from contextlib import closing
from pathlib import Path

import pypdfium2 as pdf
from pypdfium2.version import PDFIUM_INFO, PYPDFIUM_INFO

NOTICE = 'Интерактивный тест доступен в электронной версии статьи.'
A = '/articles/anatomiya-padeniya-pyat-stadiy/'
G = '/articles/dzhon-gill-chast-2-uchenyi/'


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


def main(out):
    witness = json.loads((out / 'quiz-projection-witness.json').read_text())
    assert witness['completed'] == witness['total'] == 38 and witness['mode'] == 'all'
    assert all(r['ok'] and not any(r['errors'].values()) for r in witness['results'])
    by_kind = {k: [r for r in witness['results'] if r['kind'] == k] for k in
               ('native-matrix', 'learning-matrix', 'native-channels', 'learning-channels', 'disclosure-channels')}
    assert list(map(len, by_kind.values())) == [23, 11, 2, 1, 1]
    native_questions = sum(r['totalQuestions'] for r in by_kind['native-matrix'])
    assert native_questions == 153
    for r in by_kind['native-matrix']:
        projection_state(r, {'idle': 0, 'started': 2, 'answered': 4, 'next': 2}, True)
        assert r['states']['answered']['feedback'] == 'Неверно'
        assert len(r['states']['answered']['explanation']) == 2
    for r in by_kind['learning-matrix'] + by_kind['learning-channels']:
        projection_state(r, {'idle': 0, 'answered': 0, 'closed': 0}, False)

    r, = by_kind['disclosure-channels']
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

    receipts, crop = {}, None
    for r in by_kind['native-channels']:
        projection_state(r, {'idle': 0, 'started': 2, 'answered': 4, 'result': 3, 'restarted': 2}, True)
        assert r['route'] in (A, G)
        assert [r['speech'][phase]['quizSegments'] for phase in ('idle', 'started', 'answered', 'result')] == [0, 2, 4, 3]
        assert all(s['phase'] == 'complete' and s['engine'] == 'webspeech' for s in r['speech'].values())
        assert r['speech']['result']['quizUtterances'][0]['text'] == r['states']['result']['progress']
        probes = [r['states']['started']['progress'], r['states']['started']['question'],
                  *r['states']['answered']['explanation'], r['states']['result']['progress'],
                  'Начать проверку', 'Следующий вопрос', 'Показать результат', 'Пройти ещё раз']
        phase_text = {}
        rows = {}
        for phase, exported in r['pdf'].items():
            file = out / exported['file']
            assert sha(file.read_bytes()) == exported['sha256']
            assert exported['request'] == 'button' and exported['reset']
            with closing(pdf.PdfDocument(file)) as doc:
                pages = [norm(page.get_textpage().get_text_bounded()) for page in doc]
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
                    crop = crop_notice(doc, indices[0], out)
        assert list(rows) == ['idle', 'idleRepeat', 'answered', 'result']
        reference = phase_text['idleRepeat']
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
    assert crop is not None
    report = {'anchor': witness['anchor'], 'pypdfium2': str(PYPDFIUM_INFO), 'pdfium': str(PDFIUM_INFO),
              'nativeProjectionRoutes': 23, 'nativeBankSize': native_questions,
              'learningProjectionRoutes': 11, 'closedDisclosureBlocks': 50,
              'speechRuns': sum(len(r.get('speech', {})) for r in witness['results']),
              'pdfFiles': sum(len(x['phases']) for x in receipts.values()), 'pdf': receipts, 'crop': crop}
    (out / 'pdf-text-witness.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('38/38 scenarios interpreted; 12 complete speech queues, 8 real PDFs; text and scope assertions passed')


if __name__ == '__main__':
    main(Path(sys.argv[1]))
