#!/usr/bin/env python3
"""
corpus_audit.py — корпусный аудит прозы + типографики для репо «Господь Бог».

Задача: дать двум другим агентам ОДИН воспроизводимый инструмент, чтобы
результаты были сравнимы, а не «у каждого своя правда».

Что измеряется
--------------
1. Абзацность: CV длины абзаца, медиана, доля абзацев из 1 предложения,
   доля абзацев < 15 слов.
2. Дробление: число h2, слов на h2, доля заголовков <= 4 слов.
3. «Коротко» (S17/CQS): число пунктов summary-card (норма 4–6).
4. readingTime vs фактический объём.
5. Типографика: прямые кавычки в теле, короткое тире, дефис вместо тире.
6. Проверяемость фактов: даты и имена статьи, отсутствующие в research-досье
   (прокси для галлюцинаций; НЕ доказательство — см. ограничения).

Использование
-------------
    python3 corpus_audit.py <articles_dir> [--dossier-dir DIR] [--tsv OUT]

Пример
------
    python3 corpus_audit.py /tmp/all --dossier-dir /tmp/research --tsv metrics.tsv

Критерии (пороговые) — см. CRITERIA_CATALOG.md, раздел «Сводный каталог».
Скрипт НЕ выносит вердикт «ИИ/человек». Он выдаёт числа для каталога критериев.
"""

from __future__ import annotations

import argparse
import glob
import os
import re
import statistics
import sys

BLOCK = r"(h1|h2|h3|h4|ul|ol|li|section|blockquote|figure|table|tr|div)"

# --- нормализация -----------------------------------------------------------

def strip_fm(t: str) -> str:
    """Убрать YAML frontmatter (точно, только в начале файла)."""
    return re.sub(r"\A\s*---.*?\n---\s*", "", t, flags=re.S)


def body_text(raw: str) -> str:
    """Тело без frontmatter и без HTML-тегов."""
    t = strip_fm(raw)
    t = re.sub(r"<[^>]+>", " ", t)
    return t


def html_body(raw: str) -> str:
    """Тело legacy HTML-статьи: article/main без script/style/nav."""
    t = re.sub(r"<(script|style|nav|header|footer|head)[^>]*>.*?</\1>", "", raw, flags=re.S | re.I)
    m = re.search(r"<(article|main)[^>]*>(.*?)</\1>", t, flags=re.S | re.I)
    return m.group(2) if m else t


def paragraphs_html(raw: str) -> list[str]:
    body = html_body(raw)
    b = re.sub(r"<(h2|h3|ul|ol|li|section|blockquote|figure|p)[^>]*>", "\n\n", body, flags=re.I)
    b = re.sub(r"</(h2|h3|ul|ol|li|section|blockquote|figure|p)>", "\n\n", b, flags=re.I)
    b = re.sub(r"<[^>]+>", " ", b)
    out = []
    for p in re.split(r"\n\s*\n", b):
        p = " ".join(p.split())
        if len(p.split()) > 5 and not p.startswith(("-", "*", "|", "#")):
            out.append(p)
    return out


def paragraphs(raw: str) -> list[str]:
    t = strip_fm(raw)
    t = re.sub(rf"<{BLOCK}[^>]*>", "\n\n", t, flags=re.I)
    t = re.sub(rf"</{BLOCK}>", "\n\n", t, flags=re.I)
    t = re.sub(r"<p[^>]*>", "\n\n", t, flags=re.I)
    t = re.sub(r"</p>", "", t, flags=re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    out = []
    for p in re.split(r"\n\s*\n", t):
        p = " ".join(p.split())
        if len(p.split()) > 5 and not p.startswith(("-", "*", "|", "#")):
            out.append(p)
    return out


def n_sent(p: str) -> int:
    return len(re.findall(r"[.!?](?:\s|$)", p))


# --- метрики ----------------------------------------------------------------

def _markdown_summary_items(text: str):
    """Пункты блока "## Коротко" в markdown-виде. None = блока нет."""
    lines = text.split("\n")
    start = None
    for i, line in enumerate(lines):
        if re.match(r"^##\s*Коротко\s*$", line.strip()):
            start = i + 1
            break
    if start is None:
        return None
    n = 0
    stopped = False
    for line in lines[start:]:
        st = line.strip()
        if not st:
            continue
        # конец блока: заголовок в любом виде (markdown или HTML)
        if re.match(r"^#{1,2}\s", st) or re.match(r"^<h[12][\s>]", st, re.I):
            break
        # после первого не-пункта блок закончился (защита от списков в теле)
        if re.match(r"^(\d+[.)]|[-*])\s+\S", st):
            if stopped:
                break
            n += 1
        else:
            stopped = True
    return n


def measure(path: str) -> dict:
    raw = open(path, encoding="utf-8").read()
    is_html = path.endswith(".html")
    ps = paragraphs_html(raw) if is_html else paragraphs(raw)
    L = [len(p.split()) for p in ps] or [0]
    mean = statistics.mean(L) or 1
    sd = statistics.pstdev(L)
    body = re.sub(r"<[^>]+>", " ", html_body(raw) if is_html else body_text(raw))

    heads = re.findall(r"<h2[^>]*>(.*?)</h2>", strip_fm(raw), flags=re.S | re.I)
    heads = [re.sub(r"<[^>]+>", "", h).strip() for h in heads]

    # два варианта блока: HTML summary-card и markdown "## Коротко"
    sm = re.search(r"summary-card(.{0,12000}?)</section>", strip_fm(raw), re.S)
    if sm:
        summary_items = len(re.findall(r"summary-card__item", sm.group(1)))
        summary_kind = "html"
    else:
        items = _markdown_summary_items(strip_fm(raw))
        if items is None:
            summary_items, summary_kind = 0, "none"
        else:
            summary_items, summary_kind = items, "markdown"

    rt = re.search(r"readingTime:\s*(\d+)", raw)
    rt = int(rt.group(1)) if rt else 0
    w = sum(L)

    Q = chr(34)
    return {
        "article": os.path.splitext(os.path.basename(path))[0],
        "words": w,
        "paras": len(ps),
        "cv": sd / mean,
        "median": statistics.median(L),
        "pct_1sent": 100 * sum(1 for p in ps if n_sent(p) <= 1) / max(len(ps), 1),
        "pct_lt15": 100 * sum(1 for n in L if n < 15) / len(L),
        "h2": len(heads),
        "words_per_h2": (w / len(heads)) if heads else 0,  # 0 = нет h2 (отдельный флаг)
        "no_h2": 1 if not heads else 0,
        "short_h2": sum(1 for h in heads if len(h.split()) <= 4),
        "summary_items": summary_items,
        "summary_kind": summary_kind,
        "readingTime": rt,
        "words_per_min": w / max(rt, 1),
        "straight_quotes": body.count(Q),
        "short_dash": body.count("\u2013"),
        "hyphen_dash": len(re.findall(r" - ", body)),
        "yo": body.count("\u0451") + body.count("\u0401"),
        "_years": set(re.findall(r"\b(1[5-9]\d\d|20[0-2]\d)\b", body)),
        "_names": {
            n for n in re.findall(r"\b([А-ЯЁ][а-яё]{3,})\b", body)
            if n not in {"Это", "Бог", "Церковь", "Господь", "Совет", "Союз",
                         "Глава", "Часть", "Поэтому", "Именно", "Тогда", "Также",
                         "Здесь", "После", "Редакционно", "Объединённое"}
        },
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("articles_dir")
    ap.add_argument("--dossier-dir")
    ap.add_argument("--tsv")
    a = ap.parse_args()

    files = sorted(glob.glob(os.path.join(a.articles_dir, "*.mdx")) +
                   glob.glob(os.path.join(a.articles_dir, "*.html")))
    if not files:
        print(f"нет *.mdx/*.html в {a.articles_dir}", file=sys.stderr)
        return 1

    rows = [measure(f) for f in files]

    # дедупликация: metadata-only .mdx и legacy .html дают один slug —
    # оставляем запись с реальным объёмом (sourceMode: "metadata-only")
    best: dict[str, dict] = {}
    for r in rows:
        cur = best.get(r["article"])
        if cur is None or r["words"] > cur["words"]:
            best[r["article"]] = r
    dedup_dropped = len(rows) - len(best)
    rows = sorted(best.values(), key=lambda r: r["article"])

    # --- факты против досье
    if a.dossier_dir:
        corpus = " ".join(
            open(f, encoding="utf-8").read()
            for f in glob.glob(os.path.join(a.dossier_dir, "*.md"))
        ).lower()
        dyears = set(re.findall(r"\b(1[5-9]\d\d|20[0-2]\d)\b", corpus))
        for r in rows:
            r["years_missing"] = len(r["_years"] - dyears)
            r["names_missing"] = sum(1 for n in r["_names"] if n.lower() not in corpus)

    # --- TSV
    cols = ["article", "words", "paras", "cv", "median", "pct_1sent", "pct_lt15",
            "h2", "words_per_h2", "no_h2", "short_h2", "summary_items", "summary_kind", "readingTime",
            "words_per_min", "straight_quotes", "short_dash", "hyphen_dash", "yo"]
    if a.dossier_dir:
        cols += ["years_missing", "names_missing"]

    if a.tsv:
        with open(a.tsv, "w", encoding="utf-8") as fh:
            fh.write("\t".join(cols) + "\n")
            for r in rows:
                fh.write("\t".join(str(round(r[c], 3)) if isinstance(r[c], float)
                                   else str(r[c]) for c in cols) + "\n")
        print(f"TSV записан: {a.tsv} ({len(rows)} статей)")

    # --- сводка
    def med(k):
        return statistics.median([r[k] for r in rows])

    print(f"\nстатей: {len(rows)}   слов: {sum(r['words'] for r in rows)}"
          + (f"   (убрано дублей mdx/html: {dedup_dropped})" if dedup_dropped else ""))
    print(f"медианный CV длины абзаца        : {med('cv'):.2f}")
    print(f"медианная доля 1-предл. абзацев  : {med('pct_1sent'):.0f}%")
    print(f"медианная доля абзацев <15 слов  : {med('pct_lt15'):.0f}%")
    withh2=[r for r in rows if r["h2"]]
    print(f"статей без h2                    : {len(rows)-len(withh2)}")
    print(f"медианно слов на h2 (где есть)   : {statistics.median([r['words_per_h2'] for r in withh2]) if withh2 else 0:.0f}")
    print(f"статей с 1-предл. >30%           : {sum(1 for r in rows if r['pct_1sent'] > 30)}")
    print(f"статей с CV < 0.55               : {sum(1 for r in rows if r['cv'] < 0.55)}")
    dense = sum(1 for r in rows if r["words_per_h2"] and r["words_per_h2"] < 150)
    print(f"статей со сл/h2 < 150            : {dense}")
    print(f"статей с «Коротко» <4 пунктов    : "
          f"{sum(1 for r in rows if 0 < r['summary_items'] < 4)} "
          f"(нет блока: {sum(1 for r in rows if r['summary_items'] == 0)})")
    print(f"«Коротко» HTML / markdown / нет  : "
          f"{sum(1 for r in rows if r['summary_kind']=='html')} / "
          f"{sum(1 for r in rows if r['summary_kind']=='markdown')} / "
          f"{sum(1 for r in rows if r['summary_kind']=='none')}")
    print(f"readingTime вне 150–230 сл/мин   : "
          f"{sum(1 for r in rows if r['readingTime'] and not 150 <= r['words_per_min'] <= 230)}")
    print(f"прямых кавычек в теле            : {sum(r['straight_quotes'] for r in rows)}")
    if a.dossier_dir:
        print(f"дат вне досье                    : {sum(r['years_missing'] for r in rows)}")
        print(f"имён вне досье (с падежами/FP)   : {sum(r['names_missing'] for r in rows)}")

    print("\nПРЕДУПРЕЖДЕНИЕ: это структурные метрики, не вердикт об авторстве.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
