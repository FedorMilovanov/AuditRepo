#!/usr/bin/env python3
"""
metric3_prose_only.py — третья итерация метрики: ТОЛЬКО проза, для MDX-статей.

Зачем. metric-2 (METRIC2_LISTS_AND_DRIVE_FUNNEL.md) установила: пункты списков —
не абзацы. Но `prose_product_metrics.analyse_mdx` по-прежнему разбивает список
на «абзацы» (в коде так и написано). Значит `short_pct` и `med_para` у 28 MDX
считаны по конспекту, а не по прозе.

Второй дефект той же функции: `h2 = h2n if h2n else h3n`, где h2n — только
markdown `##`. MDX-статьи, написанные HTML-разметкой (`<h2 id=...>`), получают
h2 = 2 (два `##`, один из них «Коротко»), хотя реально у них 20–28 разделов.
Это дало ложный критерий «разделов мало» и ложный P0.

Третий: `## Коротко` шёл в счёт разделов. Это резюме, не раздел.

Что делает скрипт:
  * убирает frontmatter, script/style, summary-card;
  * выбрасывает ЦЕЛИКОМ блоки списков (и markdown, и HTML `<ul>/<ol>/<li>`);
  * абзац = блок прозы ≥ 25 слов;
  * h2 = markdown `##` + HTML `<h2`, минус «Коротко»;
  * считает те же поля, что metric-2, плюс число пунктов отдельной колонкой.

Запуск:  PROD_ROOT=/path/to/product python3 metric3_prose_only.py [out.tsv]
"""
import csv
import os
import re
import sys
import glob
import statistics

ROOT = os.environ.get('PROD_ROOT') or os.getcwd()
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_TSV = os.path.join(HERE, 'data', 'product_prose_metrics.tsv')


def words_of(s):
    return len(re.findall(r'[А-Яа-яЁёA-Za-z0-9]+(?:[-’\']\w+)*', s))


def clean(t):
    t = re.sub(r'^---.*?---', '', t, count=1, flags=re.S)
    t = re.sub(r'<(script|style)\b.*?</\1>', '', t, flags=re.S | re.I)
    t = re.sub(r'```.*?```', '', t, flags=re.S)
    # резюме — не проза статьи
    t = re.sub(r'<section[^>]*summary-card[^>]*>.*?</section>', '', t, flags=re.S)
    # HTML-списки целиком: их пункты — не абзацы
    t = re.sub(r'<(ul|ol)\b[^>]*>.*?</\1>', '\n\n', t, flags=re.S | re.I)
    return t


def headings(t):
    md = len(re.findall(r'^##\s', t, re.M))
    md -= len(re.findall(r'^##\s*Коротк', t, re.M))
    html = len(re.findall(r'<h2\b', t))
    html -= len(re.findall(r'<h2[^>]*>\s*Коротк', t))
    return md + html


def prose_blocks(t):
    """Блоки прозы. Пункт списка (markdown) выбрасывается вместе со всей строкой."""
    out, buf = [], []
    for line in t.split('\n'):
        s = line.strip()
        is_item = bool(re.match(r'^(?:[-*+]|\d+[.)])\s+', s))
        is_head = bool(re.match(r'^#{1,6}\s', s))
        is_tag = s.startswith('<')
        if is_item:
            if buf:
                out.append(' '.join(buf))
                buf = []
            continue
        if is_head or is_tag or s in ('', '---'):
            if buf:
                out.append(' '.join(buf))
                buf = []
            continue
        buf.append(s)
    if buf:
        out.append(' '.join(buf))

    res = []
    for b in out:
        b = re.sub(r'<[^>]+>', ' ', b)
        b = re.sub(r'\{[^{}]*\}', ' ', b)
        b = re.sub(r'&[a-z]+;', ' ', b)
        b = re.sub(r'\s+', ' ', b).strip()
        if words_of(b) >= 25:
            res.append(b)
    return res


def measure(path):
    raw = open(path, encoding='utf-8').read()
    body = clean(raw)
    paras = prose_blocks(body)
    if not paras:
        return None
    lens = [words_of(p) for p in paras]
    text = ' '.join(paras)
    low = text.lower()
    items = len(re.findall(r'^(?:[-*+]|\d+[.)])\s+', body, re.M))
    mean = sum(lens) / len(lens)
    sd = (sum((x - mean) ** 2 for x in lens) / len(lens)) ** 0.5
    one_sent = sum(1 for p in paras if len(re.findall(r'[.!?…](?:\s|$)', p)) <= 1)
    return {
        'words': sum(lens),
        'paras': len(paras),
        'med_para': int(statistics.median(lens)),
        'short_pct': round(100 * sum(1 for n in lens if n < 40) / len(lens)),
        'h2': headings(body),
        'slogan_pct': round(100 * sum(1 for p, n in zip(paras, lens)
                                    if n < 25 and not re.search(r'[.!?…]\s', p)) / len(paras)),
        'para_cv': round(sd / mean, 2) if mean else 0,
        'one_sentence_pct': round(100 * one_sent / len(paras)),
        'colon_pct': round(100 * sum(1 for p in paras if p.rstrip().endswith(':')) / len(paras)),
        'ne_a_na': round(10000 * len(re.findall(r'\bне\s+[^.;,]{1,30},?\s+а\s+', low)) / max(sum(lens), 1), 1),
        'list_items': items,
        'quote_pct': round(100 * sum(1 for p in paras if re.search(r'\((?:[1-3]\s*)?[А-ЯЁ][а-яё]+\.?\s*\d+[:–-]\d+', p)) / len(paras)),
    }


def main():
    base = list(csv.DictReader(open(BASE_TSV, encoding='utf-8'), delimiter='\t'))
    rows, changed = [], []
    for r in base:
        if r['kind'] != 'mdx':
            rows.append(r)
            continue
        path = os.path.join(ROOT, r['path'])
        if not os.path.exists(path):
            rows.append(r)
            continue
        m = measure(path)
        if not m:
            rows.append(r)
            continue
        new = dict(r)
        new.update({k: str(v) for k, v in m.items()})
        rows.append(new)
        changed.append((r['slug'], float(r['med_para']), m['med_para'],
                        float(r['short_pct']), m['short_pct'],
                        float(r['h2']), m['h2'], r['words'] and float(r['words']), m['words']))

    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'data', 'product_prose_metrics_v3.tsv')
    keys = list(base[0].keys())
    for k in ('list_items', 'quote_pct'):
        if k not in keys:
            keys.append(k)
    with open(out, 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=keys, delimiter='\t', extrasaction='ignore')
        w.writeheader()
        w.writerows(rows)

    print(f"{'slug':46} {'мед':>13} {'коротких %':>13} {'h2':>11}")
    for s, om, nm, os_, ns, oh, nh, ow, nw in changed:
        print(f"{s[:46]:46} {om:5.0f}→{nm:<6.0f} {os_:9.0f}→{ns:<6.0f} {oh:7.0f}→{nh:<6.0f}")
    print(f"\nMDX перемерено: {len(changed)};  файл: {out}")


if __name__ == '__main__':
    main()
