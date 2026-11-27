#!/usr/bin/env python3
"""
measure_baptisty_prose.py — воспроизводимые метрики прозы для серии «Баптисты России».

Назначение
----------
Измеряет структурные характеристики статей (абзацность, лозунговость,
дробление подзаголовками, плотность, метаданные readingTime), а также
сравнивает объём опубликованной статьи с объёмом её research-досье.

Метод не читает «на глаз»: все числа — счётчики по регулярным выражениям
и статистика по длинам абзацев.

Использование
-------------
    python3 measure_baptisty_prose.py <articles_dir> [research_dir]

    articles_dir  — каталог с *.mdx (например, src/content/articles из Product repo)
    research_dir  — (опционально) каталог с research-досье *.md

Вывод: таблицы в stdout. Формат стабилен для диффа.

Ограничения (важно, см. §5 отчёта)
----------------------------------
- Не измеряет смысл, качество фактов и достоверность. Только структуру.
- «Абзац» определяется по разбиению на пустые строки после нормализации
  блочных HTML-тегов в статьи/разделители.
- CV (коэффициент вариации) длины абзаца — мера ритмической вариативности.
  Высокий CV = неровный живой ритм. Понижение CV при неизменном авторе —
  сигнал унификации, но само по себе не доказывает машинное происхождение.
- Сравнение с research-досье ЖАНРОВО ОГРАНИЧЕНО: досье — рабочие заметки
  со списками, это не эталон «хорошей прозы». См. отчёт §3.4.
"""

from __future__ import annotations

import argparse
import glob
import os
import re
import statistics
import sys

# --- нормализация -----------------------------------------------------------

BLOCK_TAGS = r"(h1|h2|h3|h4|ul|ol|li|section|blockquote|figure|table|tr)"


def strip_frontmatter(text: str) -> str:
    return re.sub(r"^---.*?^---", "", text, flags=re.S)


def to_paragraphs_mdx(text: str) -> list[str]:
    """Абзацы статьи: блочные теги -> разделители, инлайн-теги -> пробел."""
    t = strip_frontmatter(text)
    t = re.sub(rf"<{BLOCK_TAGS}[^>]*>", "\n\n", t, flags=re.I)
    t = re.sub(rf"</{BLOCK_TAGS}>", "\n\n", t, flags=re.I)
    t = re.sub(r"<p[^>]*>", "\n\n", t, flags=re.I)
    t = re.sub(r"</p>", "", t, flags=re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    out = []
    for p in re.split(r"\n\s*\n", t):
        p = " ".join(p.split())
        if len(p.split()) > 5 and not p.startswith(("-", "*", "|", "#")):
            out.append(p)
    return out


def to_paragraphs_md(text: str) -> list[str]:
    """Абзацы markdown-заметки: списки/таблицы/заголовки исключаются."""
    keep = []
    for line in text.split("\n"):
        s = line.strip()
        if not s:
            keep.append("")
            continue
        if re.match(r"^([-*+]\s|\d+[.)]\s|\||#|>|```|---)", s):
            continue
        keep.append(s)
    t = "\n".join(keep)
    return [p.strip() for p in re.split(r"\n\s*\n", t) if len(p.strip().split()) > 5]


def sentences(p: str) -> int:
    return len(re.findall(r"[.!?](?:\s|$)", p))


# --- метрики ----------------------------------------------------------------

def para_metrics(paras: list[str]) -> dict:
    if not paras:
        return {}
    lengths = [len(p.split()) for p in paras]
    mean = statistics.mean(lengths)
    sd = statistics.pstdev(lengths)
    return {
        "paras": len(paras),
        "words": sum(lengths),
        "median": statistics.median(lengths),
        "cv": (sd / mean) if mean else 0.0,
        "single_sentence_pct": 100 * sum(1 for p in paras if sentences(p) <= 1) / len(paras),
        "under15_pct": 100 * sum(1 for n in lengths if n < 15) / len(lengths),
    }


def heading_metrics(raw: str) -> dict:
    body = strip_frontmatter(raw)
    heads = re.findall(r"<h2[^>]*>(.*?)</h2>", body, flags=re.S | re.I)
    heads = [re.sub(r"<[^>]+>", "", h).strip() for h in heads]
    lens = [len(h.split()) for h in heads]
    return {
        "h2": len(heads),
        "h2_per_1000w": 0.0,  # заполняется вызывающим кодом
        "short_h2": sum(1 for n in lens if n <= 4),
        "colon_h2": sum(1 for h in heads if ":" in h),
        "heads": heads,
    }


CLICHES = {
    "в современном мире": r"в современном мире",
    "важно отметить": r"важно отметить",
    "стоит отметить": r"стоит отметить",
    "таким образом": r"таким образом",
    "более того": r"более того",
    "играет ключевую роль": r"играет ключевую роль",
    "не просто": r"не просто",
    "не только": r"не только",
    "именно поэтому/здесь/так": r"[Ии]менно (поэтому|здесь|так)",
    "риторический вопрос": r"\?",
}


def cliche_counts(body: str) -> dict[str, int]:
    return {k: len(re.findall(v, body, flags=re.I)) for k, v in CLICHES.items()}


# --- отчёт ------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("articles_dir")
    ap.add_argument("research_dir", nargs="?")
    args = ap.parse_args()

    files = sorted(glob.glob(os.path.join(args.articles_dir, "*.mdx")))
    if not files:
        print(f"нет *.mdx в {args.articles_dir}", file=sys.stderr)
        return 1

    print("## 1. Абзацность и лозунговость (по статьям)\n")
    hdr = f"{'статья':26} {'слов':>5} {'абз':>4} {'мед':>4} {'CV':>5} {'1предл':>7} {'<15сл':>6}"
    print(hdr)
    print("-" * len(hdr))
    totals = {"words": 0, "h2": 0}
    allcv, allsingle = [], []
    for f in files:
        raw = open(f, encoding="utf-8").read()
        m = para_metrics(to_paragraphs_mdx(raw))
        if not m:
            continue
        allcv.append(m["cv"])
        allsingle.append(m["single_sentence_pct"])
        totals["words"] += m["words"]
        print(
            f"{os.path.basename(f)[:-4]:26} {m['words']:5} {m['paras']:4} "
            f"{m['median']:4.0f} {m['cv']:5.2f} {m['single_sentence_pct']:6.0f}% {m['under15_pct']:5.0f}%"
        )
    if allcv:
        print(f"\nсредний CV={statistics.mean(allcv):.2f}  "
              f"средняя доля одно-предложенческих абзацев={statistics.mean(allsingle):.0f}%")

    print("\n## 2. Дробление подзаголовками\n")
    hdr = f"{'статья':26} {'h2':>3} {'слов/h2':>8} {'h2 на 1000':>11} {'h2<=4сл':>8} {'с двоеточием':>13}"
    print(hdr)
    print("-" * len(hdr))
    for f in files:
        raw = open(f, encoding="utf-8").read()
        m = para_metrics(to_paragraphs_mdx(raw))
        h = heading_metrics(raw)
        totals["h2"] += h["h2"]
        per1000 = h["h2"] / m["words"] * 1000 if m.get("words") else 0
        print(f"{os.path.basename(f)[:-4]:26} {h['h2']:3} "
              f"{m['words']/max(h['h2'],1):8.0f} {per1000:11.1f} "
              f"{h['short_h2']:8} {h['colon_h2']:13}")
    if totals["h2"]:
        print(f"\nВСЕГО {totals['words']} слов, {totals['h2']} h2 "
              f"→ 1 подзаголовок на {totals['words']/totals['h2']:.0f} слов")

    print("\n## 3. ИИ-типичные клише (на 1000 слов)\n")
    agg: dict[str, int] = {}
    words = 0
    for f in files:
        raw = open(f, encoding="utf-8").read()
        body = re.sub(r"<[^>]+>", " ", strip_frontmatter(raw))
        words += len(body.split())
        for k, v in cliche_counts(body).items():
            agg[k] = agg.get(k, 0) + v
    for k, v in agg.items():
        print(f"  {k:30} {v:5}  ({v/max(words,1)*1000:.2f}/1000)")

    print("\n## 4. readingTime vs объём\n")
    print(f"{'статья':26} {'слов':>5} {'readingTime':>11} {'слов/мин':>9}")
    for f in files:
        raw = open(f, encoding="utf-8").read()
        m = para_metrics(to_paragraphs_mdx(raw))
        rt = re.search(r"readingTime:\s*(\d+)", raw)
        rt = int(rt.group(1)) if rt else 0
        rate = m["words"] / rt if rt else 0
        print(f"{os.path.basename(f)[:-4]:26} {m['words']:5} {rt:11} {rate:9.0f}")

    print("\n## 5. Базовая линия: research-досье (жанрово ограничено)\n")
    if args.research_dir:
        dossiers = sorted(glob.glob(os.path.join(args.research_dir, "*.md")))
        cvs, singles, meds = [], [], []
        for f in dossiers:
            m = para_metrics(to_paragraphs_md(open(f, encoding="utf-8").read()))
            if not m or m["paras"] < 8:
                continue
            cvs.append(m["cv"])
            singles.append(m["single_sentence_pct"])
            meds.append(m["median"])
        if cvs:
            print(f"  ДОСЬЕ  n={len(cvs)} CV={statistics.mean(cvs):.2f} "
                  f"мед={statistics.mean(meds):.0f}сл 1-предл={statistics.mean(singles):.0f}%")
            print(f"  СТАТЬИ n={len(allcv)} CV={statistics.mean(allcv):.2f} "
                  f"1-предл={statistics.mean(allsingle):.0f}%")
            print("\n  ПРЕДУПРЕЖДЕНИЕ: досье — заметки со списками. Разница CV между")
            print("  жанрами НЕ является доказательством машинного происхождения прозы.")
    else:
        print("  (каталог досье не передан — шаг пропущен)")

    return 0


if __name__ == "__main__":
    def _under15_pct(lengths):
        return 100 * sum(1 for n in lengths if n < 15) / len(lengths)

    # локальная ссылка для читаемости метрики
    sys.exit(main())
