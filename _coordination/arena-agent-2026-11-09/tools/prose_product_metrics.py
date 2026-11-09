#!/usr/bin/env python3
"""
prose_product_metrics.py — прозовые метрики ПО ПРОДУКТУ.

Меряет не MDX и не HTML-тени (они не доходят до прода), а реальные
компоненты, которые рендерит маршрут: Body.astro (напрямую или через
MainShell).

Метрики:
  words        — объём текста (без кода, стилей, служебных строк)
  paras        — число абзацев <p>
  med_para     — медианная длина абзаца, слов
  short_pct    — доля абзацев короче 40 слов, %
  h2           — число разделов <h2>
  slogan_pct   — доля абзацев-лозунгов (1 предложение, < 25 слов), %
  cliche       — клише на 1000 слов
"""
import re, os, sys, glob, json, statistics

ROOT = os.environ.get('PROD_ROOT') or os.getcwd()

# Обслуживающие строки, которые не должны считаться прозой
SKIP_P = re.compile(
    r'^(История ·|История ЕХБ|Серия|Часть [IVX]|Глава [IVX]|Справочник$|Автор|Редактор|'
    r'Обновлено|Опубликовано|Перевод|Под редакцией|Ред\.|Читать|Слушать|Поделиться|'
    r'Полный|Источник|Источники|См\.|Смотрите)'
)
# абзац-ссылочный аппарат: цепочка книг Библии через «;»
SCRIPTURE = re.compile(r'^(?:[1-3]\s*)?[А-ЯЁ][а-яё]+\.\s*\d+[:–-]\d+')

CLICHES = [
    'не просто', 'это не просто', 'важно отметить', 'важно понимать', 'стоит отметить',
    'следует отметить', 'в современном мире', 'в наше время', 'играет важную роль',
    'играет ключевую роль', 'является ключевым', 'ключевой момент', 'в конечном счёте',
    'по сути', 'по сути дела', 'в определённом смысле', 'не секрет', 'как известно',
    'давайте', 'давайте разберёмся', 'стоит задуматься', 'задумаемся',
    'в этой статье', 'в данной статье', 'мы рассмотрим', 'мы увидим',
    'в заключение', 'подводя итог', 'таким образом', 'в целом',
]


def strip_component(text):
    """Убрать frontmatter, import/export, <script>, <style> — оставить разметку."""
    text = re.sub(r'^---.*?---', '', text, count=1, flags=re.S)
    text = re.sub(r'<(script|style)\b.*?</\1>', '', text, flags=re.S | re.I)
    text = re.sub(r'^\s*(import|export)\s.*$', '', text, flags=re.M)
    # выражения Astro {…} — грубо, но соблюдая вложенность не требуется для текста
    return text


def clean_inline(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    s = re.sub(r'\{[^{}]*\}', ' ', s)
    s = re.sub(r'&[a-z]+;', ' ', s)
    s = re.sub(r'\s+', ' ', s)
    return s.strip()


def words_of(s):
    return len(re.findall(r'[А-Яа-яЁёA-Za-z0-9]+(?:[-’\']\w+)*', s))


def collect(path, seen=None, depth=0):
    """Рекурсивно собрать разметку компонента и всех его дочерних секций."""
    if seen is None:
        seen = set()
    path = os.path.normpath(path)
    if path in seen or depth > 4 or not os.path.exists(path):
        return ''
    seen.add(path)
    orig = open(path, encoding='utf-8').read()
    base = os.path.dirname(path)
    # импорты читаем ДО очистки — иначе strip_component удалит их вместе с прозой
    kids = re.findall(r"from\s+'\./([^']+\.astro)'", orig)
    parts = [strip_component(orig)]
    for k in kids:
        parts.append(collect(os.path.join(base, k), seen, depth + 1))
    return '\n'.join(parts)


def analyse(path):
    body = collect(path)

    paras = []
    for m in re.finditer(r'<p\b[^>]*>(.*?)</p>', body, re.S):
        t = clean_inline(m.group(1))
        if not t or SKIP_P.match(t):
            continue
        if len(t) < 25:            # подписи, метрики, «39 мин»
            continue
        if t.count(' · ') and words_of(t) < 8:
            continue               # служебная строка с разделителями
        if SCRIPTURE.match(t) and t.count(';') >= 2:
            continue               # перечень стихов, не проза
        if t.count(':') + t.count(';') > len(t) / 20:
            continue               # плотный аппарат ссылок
        paras.append(t)

    h2n = len(re.findall(r'<h2\b', body))
    h3n = len(re.findall(r'<h3\b', body))
    h2 = h2n if h2n else h3n   # у части статей разделы на h3 — структура есть

    all_text = ' '.join(paras)
    words = words_of(all_text)
    if not paras or words < 60:
        return None

    lens = [words_of(p) for p in paras]
    short = sum(1 for n in lens if n < 40)
    # лозунг: один абзац = одно предложение и короче 25 слов
    slog = sum(1 for p, n in zip(paras, lens)
               if n < 25 and len(re.findall(r'[.!?…](?:\s|$)', p)) <= 1)

    low = all_text.lower()
    cl = sum(low.count(c) for c in CLICHES)

    return {
        'path': os.path.relpath(path, ROOT),
        'words': words,
        'paras': len(paras),
        'med_para': int(statistics.median(lens)),
        'short_pct': round(100 * short / len(paras)),
        'h2': h2,
        'slogan_pct': round(100 * slog / len(paras)),
        'cliche': round(1000 * cl / words, 1),
    }


def route_map():
    """Body.astro → маршрут, с обходом MainShell (2 уровня)."""
    pages = glob.glob(os.path.join(ROOT, 'src/pages/**/index.astro'), recursive=True)
    used = set()
    for p in pages:
        t = open(p, encoding='utf-8').read()
        for m in re.finditer(r"from\s+'@/components/([^']+\.astro)'", t):
            comp = os.path.join(ROOT, 'src/components', m.group(1))
            if not os.path.exists(comp):
                continue
            used.add(os.path.normpath(comp))
            # второй уровень: MainShell → Body
            try:
                t2 = open(comp, encoding='utf-8').read()
            except OSError:
                continue
            base = os.path.dirname(comp)
            for m2 in re.finditer(r"from\s+'\./([^']+\.astro)'", t2):
                used.add(os.path.normpath(os.path.join(base, m2.group(1))))
    return used


def analyse_mdx(path):
    """MDX-статья: продукт там, где маршрут импортирует .mdx."""
    raw = open(path, encoding='utf-8').read()
    raw = re.sub(r'^---.*?---', '', raw, count=1, flags=re.S)
    raw = re.sub(r'<(script|style)\b.*?</\1>', '', raw, flags=re.S | re.I)
    raw = re.sub(r'^\s*(import|export)\s.*$', '', raw, flags=re.M)
    raw = re.sub(r'```.*?```', '', raw, flags=re.S)

    paras = []
    for block in re.split(r'\n\s*\n', raw):
        t = block.strip()
        if not t or t.startswith(('#', '|', '>')):
            continue
        # список: каждый пункт — отдельный абзац (иначе 180 слов склеиваются в один)
        if re.match(r'^(\s*[-*]\s+|\s*\d+[.)]\s+)', t, re.M):
            for line in t.split('\n'):
                line = re.sub(r'^\s*([-*]|\d+[.)])\s+', '', line).strip()
                if not line or line.startswith('#'):
                    continue
                lc = clean_inline(line)
                if len(lc) >= 25 and not (SCRIPTURE.match(lc) and lc.count(';') >= 2):
                    paras.append(lc)
            continue
        t = clean_inline(t)
        if len(t) < 25:
            continue
        if SCRIPTURE.match(t) and t.count(';') >= 2:
            continue
        paras.append(t)

    h2n = len(re.findall(r'^##\s', raw, re.M))
    h3n = len(re.findall(r'^###\s', raw, re.M))
    h2 = h2n if h2n else h3n   # у части статей разделы на h3 — структура есть
    all_text = ' '.join(paras)
    words = words_of(all_text)
    if not paras or words < 60:
        return None
    lens = [words_of(p) for p in paras]
    short = sum(1 for n in lens if n < 40)
    slog = sum(1 for p, n in zip(paras, lens)
               if n < 25 and len(re.findall(r'[.!?…](?:\s|$)', p)) <= 1)
    low = all_text.lower()
    cl = sum(low.count(c) for c in CLICHES)
    return {
        'path': os.path.relpath(path, ROOT),
        'words': words, 'paras': len(paras),
        'med_para': int(statistics.median(lens)),
        'short_pct': round(100 * short / len(paras)),
        'h2': h2,
        'slogan_pct': round(100 * slog / len(paras)),
        'cliche': round(1000 * cl / words, 1),
    }


def article_routes():
    """(slug, kind, компонент|mdx) для каждого маршрута-статьи."""
    import glob as g
    out = []
    pat = r'src/pages/(articles|hard-texts|baptisty-rossii|nagornaya|pastor-series|biografii)/[^/]+/index\.astro$'
    for p in g.glob(os.path.join(ROOT, 'src/pages/**/index.astro'), recursive=True):
        rel = os.path.relpath(p, ROOT).replace(os.sep, '/')
        if not re.match(pat, rel):
            continue
        slug = rel.split('/')[-2]
        t = open(p, encoding='utf-8').read()
        m = re.search(r"from '@/content/articles/([a-z0-9-]+)\.mdx'", t)
        if m:
            out.append((slug, 'mdx', os.path.join(ROOT, 'src/content/articles', m.group(1) + '.mdx')))
            continue
        # компонент-тело: приоритет *Body / *MainShell / *PublishedPage / *PageChrome
        cands = re.findall(r"from '@/(components/[^']+\.astro)'", t)
        pick = None
        for pat2 in ('Body.astro', 'MainShell.astro', 'PublishedPage.astro', 'Hub.astro', 'PageChrome.astro'):
            for c in cands:
                if c.endswith(pat2) and not c.split('/')[-1].startswith('GillSeries'):
                    pick = c
                    break
            if pick:
                break
        if pick:
            out.append((slug, 'body', os.path.join(ROOT, 'src/components', pick[len('components/'):])))
    return out


def main():
    rows = []
    seen = set()
    for slug, kind, path in article_routes():
        if not os.path.exists(path) or path in seen:
            continue
        seen.add(path)
        r = analyse_mdx(path) if kind == 'mdx' else analyse(path)
        if r:
            r['slug'] = slug
            r['kind'] = kind
            rows.append(r)
    rows.sort(key=lambda r: -r['words'])

    out = sys.argv[1] if len(sys.argv) > 1 else None
    if out:
        os.makedirs(os.path.dirname(out), exist_ok=True)
        import csv as _csv
        with open(out, 'w', newline='', encoding='utf-8') as f:
            w = _csv.DictWriter(f, fieldnames=list(rows[0].keys()), delimiter='\t')
            w.writeheader()
            w.writerows(rows)

    tot = sum(r['words'] for r in rows)
    print(f"статей (продукт): {len(rows)}")
    print(f"слов всего: {tot}")
    print(f"медиана объёма: {int(statistics.median([r['words'] for r in rows]))}")
    print(f"медиана абзаца: {int(statistics.median([r['med_para'] for r in rows]))} слов")
    print(f"коротких абзацев (<40 слов), медиана доли: {int(statistics.median([r['short_pct'] for r in rows]))}%")
    print(f"лозунгов, медиана доли: {int(statistics.median([r['slogan_pct'] for r in rows]))}%")
    print(f"h2, медиана: {int(statistics.median([r['h2'] for r in rows]))}")
    print(f"клише на 1000 слов, медиана: {statistics.median([r['cliche'] for r in rows]):.1f}")
    print()
    for r in rows[:10]:
        print(f"  {r['words']:>6} · абз {r['med_para']:>3} · кор {r['short_pct']:>3}% · "
              f"лоз {r['slogan_pct']:>3}% · h2 {r['h2']:>2} · кл {r['cliche']:>4} · {r['slug'][:40]}")


if __name__ == '__main__':
    main()
