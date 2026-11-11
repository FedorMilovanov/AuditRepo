#!/usr/bin/env python3
"""
prose_guards.py — проверяемые охраны S58/S59 по всем маршрутам-статьям.

Заменяет оценочный S23 («живой литературный слог») четырьмя градуированными
проверками. Каждая — три ступени: A (норма) / B (допустимо) / C (дефект).

  G1  МЕДИАНА АБЗАЦА     40–80 слов — A; 30–40 или 80–110 — B; иначе C
  G2  КОРОТКИЕ АБЗАЦЫ    <40% — A; 40–60% — B; >60% — C
  G3  ДОЛЯ ПЕРЕЧНЯ       <20% — A; 20–33% — B; >33% — C
  G4  ОПОРА В АБЗАЦЕ     >=33% абзацев с опорой — A; 15–33% — B; <15% — C

«Опора» = ссылка на стих с locator, число, латинское/греческое слово,
имя с инициалами, или дата. Это не «умность», а проверяемость: утверждение
опирается на что-то, что можно проверить.

Важно про слои:
  * MDX-статья читается как есть;
  * Body.astro читается по <p>, а подсказки gtip ВЫРЕЗАЮТСЯ — иначе
    определение из 32 слов вклеивается в середину предложения
    (см. READING_KORTOKO_AND_GLOSSARY.md, 54 случая).

Запуск:  PROD_ROOT=/path/to/product python3 prose_guards.py [out.tsv] [-v]
"""
import csv
import os
import re
import sys
import glob
import statistics

ROOT = os.environ.get('PROD_ROOT') or os.getcwd()
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ROUTES = r'src/pages/(articles|hard-texts|baptisty-rossii|nagornaya|pastor-series|biografii|konfessii)/[^/]+/index\.astro$'
NON_ARTICLE = {'genesis-6', 'seriya', 'istochniki', 'nakhodki'}

SCRIPTURE = re.compile(r'\((?:[1-3]\s*)?[А-ЯЁ][а-яё]+\.?\s*\d+[:–-]\d+')
SCRIPTURE2 = re.compile(r'\b(?:[1-3]\s*)?(?:Быт|Исх|Лев|Числ|Втор|Нав|Суд|Руф|Цар|Пар|Езд|Неем|Есф|Иов|Пс|Притч|Еккл|Песн|Ис|Иер|Плач|Иез|Дан|Ос|Иоил|Ам|Авд|Иона|Мих|Наум|Авв|Соф|Агг|Зах|Мал|Мф|Мк|Лк|Ин|Деян|Рим|Кор|Гал|Еф|Флп|Кол|Фес|Тим|Тит|Флм|Евр|Иак|Пет|Иуд|Откр)\.?\s*\d+[:–-]\d+')
NUMBER = re.compile(r'\b\d{3,4}\b|\b\d+[.,]\d+\b')
GREEK = re.compile(r'[\u1F00-\u1FFF\u0370-\u03FF]{3,}')
DATE = re.compile(r'\b(1[0-9]{3}|20[0-2][0-9])\b')


def strip_astro(text):
    t = re.sub(r'^---.*?---', '', text, count=1, flags=re.S)
    t = re.sub(r'<(script|style)\b.*?</\1>', '', t, flags=re.S | re.I)
    t = re.sub(r'\{/\*.*?\*/\}', '', t, flags=re.S)
    return t


def drop_summary(t):
    t = re.sub(r'<section[^>]*summary-card[^>]*>.*?</section>', '', t, flags=re.S)
    return t


def drop_tooltips(t):
    """Подсказки глоссария: их текст не проза и не должен склеиваться с ней."""
    return re.sub(r'<span[^>]*class="[^"]*gtip[^"]*"[^>]*>.*?</span>', '', t, flags=re.S)


def collect_component(path, seen=None, depth=0):
    if seen is None:
        seen = set()
    path = os.path.normpath(path)
    if path in seen or depth > 5 or not os.path.exists(path):
        return ''
    seen.add(path)
    raw = open(path, encoding='utf-8').read()
    base = os.path.dirname(path)
    kids = re.findall(r"from\s+'\./([^']+\.astro)'", raw)
    parts = [raw]
    for k in kids:
        parts.append(collect_component(os.path.join(base, k), seen, depth + 1))
    return '\n'.join(parts)


def words(s):
    return len(re.findall(r'[А-Яа-яЁёA-Za-z0-9]+(?:[-’\']\w+)*', s))


def text_of_paragraph(raw):
    x = re.sub(r'<[^>]+>', ' ', raw)
    x = re.sub(r'\{[^{}]*\}', ' ', x)
    x = re.sub(r'&[a-z]+;', ' ', x)
    return re.sub(r'\s+', ' ', x).strip()


def clean_mdx(t):
    t = drop_tooltips(drop_summary(strip_astro(t)))
    t = re.sub(r'```.*?```', '', t, flags=re.S)
    return t


def paras_mdx(t):
    """Абзац MDX = блок между пустыми строками.

    Раньше каждый непустой ПЕРЕНОС СТРОКИ считался абзацем. В MDX автор
    переносит строку внутри абзаца, поэтому «абзац» дробился на обрывки:
    у blagovestie-mertvym выходило 8 «абзацев» по 7 слов вместо 132 блоков
    по 9 слов. Теперь блок = абзац (стандарт Markdown).
    """
    out, buf = [], []

    def flush():
        if buf:
            x = text_of_paragraph(' '.join(buf))
            if words(x) >= 15:      # в MDX абзац часто сжат: порог ниже, чем в Astro
                out.append(x)
            buf.clear()

    in_code = False
    for line in t.split('\n'):
        s = line.strip()
        if s.startswith('```'):
            in_code = not in_code
            flush()
            continue
        if in_code:
            continue
        if re.match(r'^(?:[-*+]|\d+[.)])\s+', s) or re.match(r'^#{1,6}\s', s) or s.startswith('<'):
            flush()
            continue
        if not s:
            flush()
            continue
        buf.append(s)
    flush()
    for m in re.finditer(r'<p\b[^>]*>(.*?)</p>', t, re.S):
        x = text_of_paragraph(m.group(1))
        if words(x) >= 15:
            out.append(x)
    return out


def paras_astro(t):
    res = []
    for m in re.finditer(r'<p\b[^>]*>(.*?)</p>', t, re.S):
        x = text_of_paragraph(m.group(1))
        if words(x) >= 15:
            res.append(x)
    return res


APPARATUS = re.compile(r'^#{2,3}\s*(?:Примечани|Источник|Сноск|Литератур|Библиограф|Нашли неточность)', re.M | re.I)


def body_region(t):
    """Только тело статьи: без <nav>, <footer>, навигационных списков."""
    t = re.sub(r'<nav\b.*?</nav>', '', t, flags=re.S | re.I)
    t = re.sub(r'<footer\b.*?</footer>', '', t, flags=re.S | re.I)
    m = re.search(r'<article\b[^>]*>(.*?)</article>', t, re.S)
    return m.group(1) if m else t


def mdx_body(t):
    """MDX без разделов-аппарата: их перечни — не аргумент статьи."""
    return APPARATUS.split(t)[0]


def list_stats(t, is_mdx):
    if is_mdx:
        items = [l for l in t.split('\n') if re.match(r'^\s*(?:[-*+]|\d+[.)])\s+', l)]
    else:
        items = []
        for m in re.finditer(r'<li\b[^>]*>(.*?)</li>', t, re.S):
            items.append(re.sub(r'<[^>]+>', ' ', m.group(1)))
    phrases = 0
    for p in re.split(r'(?<=[.!?…])\s+', ' '.join(re.sub(r'<[^>]+>', ' ', x) for x in (paras_astro(t) if not is_mdx else []))):
        if words(p) >= 3:
            phrases += 1
    return len(items), phrases


def support(p):
    return bool(SCRIPTURE.search(p) or SCRIPTURE2.search(p) or GREEK.search(p)
                or DATE.search(p) or re.search(r'\b[А-ЯЁ]\.\s?[А-ЯЁ]\.', p))


def grade(value, a, b, direction):
    if value is None:
        return None
    if direction == 'high':
        return 0 if value >= a else (1 if value >= b else 2)
    return 0 if value <= a else (1 if value <= b else 2)


def routes():
    out = []
    for p in glob.glob(os.path.join(ROOT, 'src/pages/**/index.astro'), recursive=True):
        rel = os.path.relpath(p, ROOT).replace(os.sep, '/')
        if not re.match(ROUTES, rel):
            continue
        slug = rel.split('/')[-2]
        if slug in NON_ARTICLE:
            continue
        src = open(p, encoding='utf-8').read()
        m = re.search(r"from '@/content/articles/([a-z0-9-]+)\.mdx'", src)
        if m:
            out.append((slug, 'mdx', os.path.join(ROOT, 'src/content/articles', m.group(1) + '.mdx'), rel))
            continue
        cands = re.findall(r"from '@/(components/[^']+\.astro)'", src)
        pick = None
        for suf in ('Body.astro', 'MainShell.astro', 'PublishedPage.astro', 'ArticlePage.astro'):
            for c in cands:
                if c.endswith(suf):
                    pick = c
                    break
            if pick:
                break
        if pick:
            out.append((slug, 'body', os.path.join(ROOT, 'src/components', pick[len('components/'):]), rel))
    return sorted(out)


def measure(slug, kind, path, route=''):
    if not os.path.exists(path):
        return None
    if kind == 'mdx':
        t = mdx_body(clean_mdx(open(path, encoding='utf-8').read()))
        paras = paras_mdx(t)
        t = mdx_body(t)
        items = len([l for l in t.split('\n') if re.match(r'^\s*(?:[-*+]|\d+[.)])\s+', l)])
        phrases = 0
        for p in paras:
            phrases += max(1, len(re.findall(r'[.!?…](?:\s|$)', p)))
    else:
        t = drop_tooltips(drop_summary(collect_component(path)))
        t = body_region(t)
        paras = paras_astro(t)
        items = len(re.findall(r'<li\b', t))
        phrases = 0
        for p in paras:
            phrases += max(1, len(re.findall(r'[.!?…](?:\s|$)', p)))
    if len(paras) < 3:
        return None
    lens = [words(p) for p in paras]
    med = statistics.median(lens)
    short = 100 * sum(1 for n in lens if n < 40) / len(lens)
    total = items + phrases
    list_share = 100 * items / total if total else 0
    sup = 100 * sum(1 for p in paras if support(p)) / len(paras)
    genre = ('exegetical' if '/hard-texts/' in route
             else 'history' if '/baptisty-rossii/' in path.replace(os.sep, '/')
             else 'practical')
    return {
        'slug': slug, 'kind': kind, 'genre': genre,
        'words': sum(lens), 'paras': len(paras), 'items': items,
        'med_para': int(med), 'short_pct': round(short),
        'list_share': round(list_share), 'support_pct': round(sup),
        'G1': grade(med, 40, 30, 'high'),
        'G2': grade(short, 40, 60, 'low'),
        'G3': grade(list_share, 20, 33, 'low'),
        # G4 применим только к экзегетике: в практических и исторических
        # статьях «опора» — случай и дата, а не ссылка на стих. Один порог
        # на все жанры давал ложный C трём статьям пасторского цикла.
        'G4': grade(sup, 25, 10, 'high') if genre == 'exegetical' else None,
    }


def main():
    verbose = '-v' in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    rows = []
    for slug, kind, path, rel in routes():
        m = measure(slug, kind, path, rel)
        if m:
            rows.append(m)

    for r in rows:
        cs = [r[g] for g in ('G1', 'G2', 'G3', 'G4') if r[g] == 2]
        r['C'] = len(cs)
        r['class'] = 'P0' if r['C'] >= 3 else ('P1' if r['C'] == 2 else ('P2' if r['C'] == 1 else 'OK'))

    rows.sort(key=lambda r: (-r['C'], r['med_para']))

    hdr = f"{'СТАТЬЯ':44} {'сл':>6} {'абз':>4} {'мед':>4} {'кор':>4} {'пер':>4} {'опр':>4}  G1 G2 G3 G4  итог"
    print(hdr)
    print('-' * len(hdr))
    for r in rows:
        g = ' '.join(' -' if r[k] is None else (' ·' if r[k] == 0 else (' !' if r[k] == 1 else ' X'))
                     for k in ('G1', 'G2', 'G3', 'G4'))
        if not verbose and r['class'] == 'OK':
            continue
        print(f"{r['slug'][:44]:44} {r['words']:>6} {r['paras']:>4} {r['med_para']:>4} "
              f"{r['short_pct']:>4} {r['list_share']:>4} {r['support_pct']:>4}  {g}  {r['class']}")

    from collections import Counter
    print()
    print("СТАТЕЙ:", len(rows), dict(sorted(Counter(r['class'] for r in rows).items())))
    for k, label in (('G1', 'медиана абзаца'), ('G2', 'короткие'), ('G3', 'перечень'), ('G4', 'опора')):
        c = Counter(r[k] for r in rows)
        print(f"  {k} {label:16} A={c[0]:2}  B={c[1]:2}  C={c[2]:2}  n/a={c[None]:2}")

    out = args[0] if args else os.path.join(HERE, 'data', 'prose_guards.tsv')
    with open(out, 'w', encoding='utf-8', newline='') as f:
        keys = ['slug', 'kind', 'genre', 'words', 'paras', 'items', 'med_para', 'short_pct',
                'list_share', 'support_pct', 'G1', 'G2', 'G3', 'G4', 'C', 'class']
        w = csv.DictWriter(f, fieldnames=keys, delimiter='\t', extrasaction='ignore')
        w.writeheader()
        w.writerows(rows)
    print("файл:", out)


if __name__ == '__main__':
    main()
