#!/usr/bin/env python3
"""Check saved entries, actual download contents and two-tab order, not just notices."""
import hashlib
import json
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

ANCHOR = '9edef94ece08012223c1364bec7ddcd561cf5713'
A = '/articles/dzhon-gill-chast-2-uchenyi/'
B = '/articles/otstuplenie-chto-govorit-bibliya/'
TARGET = A + '#sec-systematics'
ORIGIN = 'http://local.invalid'
MD, JSON = 'gb-moya-biblioteka.md', 'gb-library-backup.json'
SHA = re.compile(r'[a-f0-9]{64}')
CASES = {f'{arm}-{width}' for width in (390, 1440) for arm in ('same', 'delete', 'distinct')}
WITNESS = 'comment-followup-witness.json'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def compact(data):
    return json.dumps(data, ensure_ascii=False, separators=(',', ':')).encode()


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def verify_state(state, records, *, hidden=False):
    assert state['library'] and state['notesKeySet'] and state['listVisible'] != hidden
    assert state['rawNotes'] == records
    assert state['cards'] == [{'id': n['id'], 'text': n['text']} for n in records]
    assert len(state['cardBoxes']) == len(records)
    # The second card may be clipped by the scrollable panel. Check both
    # card payloads, not simultaneous line-of-sight for a multi-card list.
    boxes = state['cardBoxes']
    if hidden:
        assert not any(b['inView'] or b['hit'] for b in boxes)
    elif boxes:
        assert any(b['inView'] and b['hit'] for b in boxes)
    if not records:
        assert state['empty'] == 'Ваша библиотека ждёт первую запись'


def verify_markdown(file, records):
    if not records:
        assert file == {'name': None, 'notice': 'Библиотека пуста.'}
        return None
    assert file['name'] == MD and SHA.fullmatch(file['sha256']) and file['bytes'] > 0
    lines = ['# Моя библиотека · Господь Бог — Сила Моя', '']
    for n in records:
        lines += ['## Заметка — ' + n['articleTitle'], '', n['text'], '', 'Источник: ' + n['url'], '']
    assert file['text'] == '\n'.join(lines)
    assert file['normalizedSha256'] == digest(file['text'].encode())
    return file['normalizedSha256']


def verify_pair(pair, records):
    md = verify_markdown(pair['md'], records)
    file = pair['json']
    assert file['name'] == JSON and SHA.fullmatch(file['sha256']) and file['bytes'] > 0
    payload = file['body']
    assert payload['format'] == 'gospod-bog-reader-library' and payload['version'] == 3
    datetime.fromisoformat(payload['exportedAt'].replace('Z', '+00:00'))
    expected = {'quotes': [], 'notes': records, 'favorites': [], 'tags': {}, 'reading': {}, 'revisit': {}}
    assert payload['data'] == expected
    assert file['normalizedDataSha256'] == digest(compact(expected))
    return md


def patch(records, note, text):
    # Compute the expected full saved payload; ID, URL and savedAt stay pinned.
    return [{**n, 'text': text} if n['id'] == note else n for n in records]


def verify_case(r, words):
    arm, width = r['id'].split('-')
    assert r['arm'] == arm and r['width'] == int(width)
    assert r['height'] == (844 if width == '390' else 900)
    assert r['ok'] and not r['errors']
    assert r['docs'] == [['A', A, 200, 'no-store'], ['B', B, 200, 'no-store'], ['B', B, 200, 'no-store']]

    qe = r['editorial']
    start, land, paragraph = (qe[k] for k in ('selected', 'source', 'read'))
    q = start['quiz']
    assert qe['questionId'] == 'gill.scholar.systematics' and start['learning'] and not start['notesKeySet']
    assert not start['rawNotes'] and not start['cards'] and start['url'] == A
    assert q['verdict'] == ['Верно — и вы были уверены. Точная калибровка.', False]
    assert not q['explanation'][1] and 'первой полномасштабной' in q['explanation'][0]
    assert any(t == qe['key'] and off and 'is-correct' in css for t, off, css in q['options'])
    assert q['source'][0].startswith('Перечитать:') and q['source'][1:] == [False, TARGET]
    assert land['focus'] == 'sec-systematics' and land['heading']['box']['hit'] and not land['learning']
    assert len(paragraph['paragraphs']) == 1
    p = paragraph['paragraphs'][0]
    assert p['box']['hit'] and 'Называть его первым трудом такого рода среди всех баптистов было бы неточно' in p['text']
    assert 'Грэнтем' in p['text'] and '1678 году' in p['text']
    for x in (land, paragraph, r['quizReturn']):
        assert x['quiz'] == q and x['doc'] == start['doc'] and x['url'] == TARGET
        assert x['history'] == start['history'] + 1

    initial = r['openA']['rawNotes']
    ids = [x['id'] for x in initial]
    k1, k2 = r['keys']['first'], r['keys']['second']
    assert ids == ([k2, k1] if arm == 'distinct' else [k1]) and len(set(ids)) == len(ids)
    assert all(n['url'] == ORIGIN + A and n['articleTitle'] == initial[0]['articleTitle']
               and n['savedAt'] > 0 and n['quoteText'] == '' for n in initial)
    assert [n['text'] for n in initial] == ([words['second'], words['base']] if k2 else [words['base']])
    verify_state(r['openB'], initial)
    assert r['openB']['url'] == B and r['openB']['doc'] != start['doc']
    deleted = arm == 'delete'
    if not deleted:
        peer, text = (k2, words['peerSecond']) if k2 else (k1, words['peer'])
        before = patch(initial, peer, text)
        assert r['draftB']['editor']['value'] == text and r['draftB']['editor']['visible']
        assert r['peerAction']['status']['text'] == 'Заметка обновлена.'
    else:
        peer, text, before = k1, None, []
        assert r['peerAction']['status']['text'].startswith('Запись удалена')
    assert r['peerAction']['rawNotes'] == before
    after = patch(before, k1, words['mine'])

    for stage, expected in ((r['openA'], initial), (r['before']['a'], before), (r['preSubmit'], before)):
        verify_state(stage, expected, hidden=True)
        assert stage['doc'] == start['doc'] and stage['url'] == TARGET
        assert stage['editor'] == {'visible': True, 'value': words['mine'], 'enabled': True}
        assert stage['markdownAvailable'] and not stage['jsonMenuAvailable']
    verify_state(r['before']['b'], before)
    md_before = verify_pair(r['beforeExport']['b'], before)
    assert verify_markdown(r['beforeExport']['aMarkdown'], before) == md_before
    verify_state(r['attempt'], after)
    assert r['attempt']['status'] == {'text': 'Заметка обновлена.', 'visible': True, 'error': False}
    assert not r['attempt']['editor']['visible']
    md_after = []
    for stage in (r['immediate']['a'], r['immediate']['b'], r['reloadB']):
        verify_state(stage['s'], after)
        md_after.append(verify_pair(stage['files'], after))
    assert md_after.count(md_after[0]) == 3
    verify_state(r['aAfterReloadB'], after)
    assert r['aAfterReloadB']['doc'] == start['doc'] and r['aAfterReloadB']['url'] == TARGET
    assert r['quizReturn']['learning'] and not r['quizReturn']['library']
    reload, old = (r['reloadB'][k] for k in ('s', 'before'))
    assert reload['nav'] == 'reload' and reload['url'] == old['url'] == B
    assert reload['history'] == old['history'] and reload['doc'] != old['doc'] == r['openB']['doc']

    events = r['events']
    assert all(e['trusted'] for e in events if e['kind'] in ('click', 'storage', 'submit'))
    assert [(e['tab'], e['doc']) for e in events if e['kind'] == 'pageshow' and e['persisted'] is False] == [
        ('A', start['doc']), ('B', old['doc']), ('B', reload['doc'])]
    assert [e['label'] for e in events if e.get('action') == 'answer'] == [qe['key']]
    assert [(e['tab'], e['href']) for e in events if e.get('action') == 'source'] == [('A', TARGET)]
    assert [(e['tab'], e['id']) for e in events if e.get('action') == 'edit'] == [('A', k1)] + ([] if deleted else [('B', peer)])
    assert [(e['tab'], e['id']) for e in events if e.get('action') == 'delete'] == ([('B', k1)] if deleted else [])
    storage = [(e['tab'], e['source'], e['old'], e['next']) for e in events if e['kind'] == 'storage']
    assert storage == [('A', ORIGIN + B, initial, before)] + ([] if deleted else [('B', ORIGIN + TARGET, before, after)])
    submits = [('A', words['base'])] + ([('A', words['second'])] if k2 else []) + ([] if deleted else [('B', text)]) + [('A', words['mine'])]
    assert [(e['tab'], e['value']) for e in events if e['kind'] == 'submit'] == submits
    s = next(i for i, e in enumerate(events) if e['kind'] == 'storage' and e['tab'] == 'A')
    a = next(i for i, e in enumerate(events) if e['kind'] == 'submit' and e['value'] == words['mine'])
    assert s < a and events[s]['doc'] == events[a]['doc'] == start['doc']
    assert events[s]['ageMs'] <= r['preSubmit']['ageMs'] <= events[a]['ageMs']
    assert any(e['tab'] == 'B' and e.get('action') == 'backup' for e in events[s:a])
    order = [('A', MD), ('B', MD), ('B', JSON), ('A', MD), ('A', JSON), ('B', MD), ('B', JSON), ('B', MD), ('B', JSON)]
    assert r['downloads'] == [list(x) for x in order if not deleted or x[1] == JSON]
    assert len([e for e in events if e.get('action') == 'markdown']) == 5

    return {
        'id': r['id'], 'beforeA_Texts': [x['text'] for x in before], 'afterA_Texts': [x['text'] for x in after],
        'restoredInB': [x['text'] for x in reload['rawNotes']], 'markdownBeforeSha256': md_before,
        'markdownAfterSha256': md_after[0], 'downloadCount': len(r['downloads']),
        'markdownClicksWithoutDownload': 5 if deleted else 0,
        'qe': {'fragment': TARGET, 'question': q['question'], 'key': qe['key'], 'verdict': q['verdict'][0],
               'explanation': q['explanation'][0], 'paragraph': p['text']},
    }


def main(argv):
    if len(argv) != 5:
        raise SystemExit('check-comment-replays.py RUN_A RUN_B DIST OLD_QNL_JSON RECEIPT')
    ra, rb, dist, previous, out = map(Path, argv)
    runs = [load(d / WITNESS) for d in (ra, rb)]
    results, ids, counts = [], [], []
    for w in runs:
        assert w['anchor'] == ANCHOR and len(w['rows']) == len(CASES) and {r['id'] for r in w['rows']} == CASES
        results.append([verify_case(r, w['words']) for r in w['rows']])
        ids.append({n['id'] for r in w['rows'] for n in r['openA']['rawNotes']})
        counts.append(Counter(name for r in w['rows'] for _, name in r['downloads']))
    assert not ids[0] & ids[1] and min(map(len, ids)) == 8
    assert results[0] == results[1]
    for key in ('chromium', 'node', 'playwright', 'method', 'words', 'distSha256'):
        assert runs[0][key] == runs[1][key]
    assert counts[0] == counts[1] == {MD: 20, JSON: 24}

    old = load(previous)
    assert old['anchor'] == ANCHOR
    pins = runs[0]['distSha256']
    assert {A[1:] + 'index.html', B[1:] + 'index.html', 'js/highlights.js', 'js/reader-library-v3.js',
            'js/reader-library-presenter.js', 'css/highlights-runtime.css'} <= pins.keys()
    assert any(k.startswith('_astro/GillLearningSheet.astro_') for k in pins)
    for asset, pin in (pins | old['distSha256']).items():
        assert digest((dist / asset).read_bytes()) == pin, asset
    shared = pins.keys() & old['distSha256'].keys()
    assert all(pins[name] == old['distSha256'][name] for name in shared)

    images_a, images_b = [{p.name: digest(p.read_bytes()) for p in sorted(d.glob('*.png'))} for d in (ra, rb)]
    assert images_a.keys() == images_b.keys() and len(images_a) == 7
    image_receipts = {k: {'runA': v, 'runB': images_b[k], 'equal': v == images_b[k]} for k, v in images_a.items()}
    receipt = {
        'anchor': ANCHOR, 'result': 'reproduced witness outcomes, not fixed Product',
        'replay': {'perRunCases': len(CASES), 'distinctCreatedIdsByRun': [len(x) for x in ids],
                   'witnessSha256': [digest((d / WITNESS).read_bytes()) for d in (ra, rb)],
                   'perRunDownloads': dict(counts[0]), 'perRunMarkdownClicksWithoutDownload': 10},
        'pins': {'distAandB': len(pins), 'previousQnlRechecked': len(old['distSha256']), 'previousQnlShared': len(shared)},
        'cases': results[0], 'screens': image_receipts,
    }
    out.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'PASS {len(CASES)}+{len(CASES)}; {len(pins)} dist pins; {len(shared)} shared with previous QNL; '
          f'{sum(x["equal"] for x in image_receipts.values())}/{len(image_receipts)} PNG byte-identical')


if __name__ == '__main__':
    main(sys.argv[1:])
