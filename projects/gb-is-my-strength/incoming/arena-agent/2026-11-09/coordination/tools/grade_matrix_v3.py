#!/usr/bin/env python3
"""
grade_matrix.py — градуированная оценка статей по продукту.

Не бинарно «дефект/норма», а три ступени на каждый критерий:
  A — норма (0 баллов)
  B — допустимо в редких случаях, помечается (1 балл)
  C — дефект (2 балла)

Итог: сумма баллов → класс P0/P1/P2/P3. Печатает матрицу по всем статьям.
"""
import csv, sys, os, statistics as st
from collections import defaultdict

TSV = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   'data', 'product_prose_metrics_v3.tsv')

# (ключ, подпись, (граница A/B, граница B/C), направление)
# dir='low' — чем меньше, тем лучше; 'high' — чем больше, тем лучше
CRITERIA = [
    ('words',        'объём',              (1500, 900),      'high'),
    ('med_para',     'медиана абзаца',     (30, 18),         'high'),
    ('short_pct',    'коротких абзацев %', (60, 80),         'low'),
    ('slogan_pct',   'лозунгов %',         (35, 60),         'low'),
    ('one_sentence_pct', 'абзац = 1 фраза %', (45, 70),     'low'),
    ('h2',           'разделов',           (5, 3),           'high'),
    ('para_cv',      'разброс абзацев',    (0.35, 0.25),     'high'),
    ('cliche',       'клише/1000',         (3, 6),           'low'),
]

WEIGHT = {'P0': 4, 'P1': 3, 'P2': 2, 'P3': 1}


def grade(value, bounds, direction):
    a, b = bounds
    if direction == 'high':
        if value >= a:
            return 0
        return 1 if value >= b else 2
    else:
        if value <= a:
            return 0
        return 1 if value <= b else 2


# Страницы-хабы и служебные разделы: не статьи, в оценку качества не входят
NON_ARTICLE = {
    'genesis-6', 'seriya', 'istochniki', 'nakhodki',
}


def main():
    rows = [r for r in csv.DictReader(open(TSV, encoding='utf-8'), delimiter='\t')
            if r['slug'] not in NON_ARTICLE]
    for r in rows:
        for k, _, _, _ in CRITERIA:
            r[k] = float(r[k])

    out = []
    for r in rows:
        per = {}
        score = 0
        for key, label, bounds, direction in CRITERIA:
            g = grade(r[key], bounds, direction)
            per['g_' + key] = g
            score += g
        # класс: сколько критериев в C
        c_count = sum(1 for v in per.values() if v == 2)
        if c_count >= 4:
            cls = 'P0'
        elif c_count >= 3:
            cls = 'P1'
        elif c_count >= 1:
            cls = 'P2'
        else:
            cls = 'P3'
        out.append({'slug': r['slug'], 'kind': r['kind'], 'words': r['words'],
                    'score': score, 'c_count': c_count, 'cls': cls, **per})

    out.sort(key=lambda x: (-x['c_count'], -x['score']))

    print(f"{'СТАТЬЯ':44} {'сл':>6} {'C':>2} {'бал':>3}  класс  что в C")
    print('-' * 118)
    order = [k for k, *_ in CRITERIA]
    short = {'words': 'объём', 'med_para': 'абзац', 'short_pct': 'коротк',
             'slogan_pct': 'лозунг', 'one_sentence_pct': '1фраза',
             'h2': 'разделы', 'para_cv': 'разброс', 'cliche': 'клише'}
    for o in out:
        if o['cls'] == 'P3' and o['c_count'] == 0:
            continue
        bad = [short[k] for k in order if o['g_' + k] == 2]
        print(f"{o['slug'][:44]:44} {o['words']:>6.0f} {o['c_count']:>2} {o['score']:>3}  "
              f"{o['cls']}    {', '.join(bad)}")

    print()
    cls_count = defaultdict(int)
    for o in out:
        cls_count[o['cls']] += 1
    print("КЛАССЫ:", dict(sorted(cls_count.items())))
    print(f"всего статей: {len(out)}")
    clean = [o for o in out if o['cls'] == 'P3']
    print(f"без замечаний (P3, 0 в C): {len(clean)}")

    # запись матрицы
    with open(os.path.join(os.path.dirname(TSV), 'grade_matrix.tsv'), 'w',
              newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(out[0].keys()), delimiter='\t')
        w.writeheader()
        w.writerows(out)


if __name__ == '__main__':
    main()
