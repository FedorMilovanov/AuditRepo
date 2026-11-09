#!/usr/bin/env python3
"""
profile_and_matrix.py — классификация профилей + генерация строк матрицы багов.

Вход:  corpus dir (*.mdx), metrics TSV от corpus_audit.py
Выход: TSV с находками в формате баг-записи (см. CRITERIA_CATALOG.md §9)

Профили (см. CRITERIA_CATALOG.md §0.1):
  P4 reference   — справочники, атласы, хронологии
  P2 pastoral    — душепопечительские/родительские (короткие абзацы допустимы)
  P3 exegetical  — экзегетические (плотность библейских ссылок)
  P1 historical  — исторические монографии и лонгриды (самый строгий)
  P5 note        — прочее/короткое

Пороги берутся строго из каталога. Скрипт НЕ выносит вердикт об авторстве.
"""

from __future__ import annotations

import argparse
import csv
import glob
import os
import re
import sys

# --- пороги по профилям ------------------------------------------------------
TH = {
    "P1": {"pct_1sent": 12, "cv": 0.75, "words_per_h2": (350, 500), "pct_lt15": 15, "min_words": 900},
    "P2": {"pct_1sent": 25, "cv": 0.65, "words_per_h2": (250, 500), "pct_lt15": 30, "min_words": 700},
    "P3": {"pct_1sent": 18, "cv": 0.75, "words_per_h2": (300, 500), "pct_lt15": 20, "min_words": 900},
    "P4": {"pct_1sent": 35, "cv": 0.55, "words_per_h2": (150, 500), "pct_lt15": 40, "min_words": 500},
    "P5": {"pct_1sent": 35, "cv": 0.55, "words_per_h2": (150, 600), "pct_lt15": 40, "min_words": 300},
}

PAT_REF = re.compile(r"^(spravochnik|atlas|karty|slovar|hronolog|index)", re.I)
PAT_PAST = re.compile(r"(podrostok|rebenok|rebenka|roditel|doch|syn-|semya|brak|soglasie|sovershennoletie|vzroslyy)", re.I)
BIBLE_REF = re.compile(r"\b(1|2|3)?\s?(Пет|Кор|Тим|Фес|Ин|Мф|Мар|Лк|Рим|Евр|Гал|Еф|Флп|Кол|Иак|Иуд|Откр|Пс|Притч|Ис|Иер|Иез|Дан|Быт|Исх|Лев|Числ|Втор|Нав|Суд|Руф|Цар|Пар|Езд|Неем|Есф|Иов|Еккл|Песн|Плач|Ам|Авд|Ион|Мих|Наум|Авв|Соф|Агг|Зах|Мал)\.?\s?\d+:\d+")

SERIES_P1 = {"russian-baptism", "dzhon-gill"}


def classify(slug: str, raw: str, words: int) -> str:
    fm = raw[:1500]
    series = re.search(r'^series:\s*"?([a-z0-9\-]+)"?', fm, re.M)
    if series and series.group(1) in SERIES_P1:
        return "P1"
    if PAT_REF.search(slug):
        return "P4"
    if PAT_PAST.search(slug):
        return "P2"
    body = re.sub(r"<[^>]+>", " ", re.sub(r"\A\s*---.*?\n---\s*", "", raw, flags=re.S))
    refs = len(BIBLE_REF.findall(body))
    per1000 = refs / max(words, 1) * 1000
    if per1000 >= 6 or "ekzegez" in body[:2000].lower():
        return "P3"
    if words >= 1500:
        return "P1"
    return "P5"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("corpus_dir")
    ap.add_argument("metrics_tsv")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    metrics = {}
    with open(a.metrics_tsv, encoding="utf-8") as fh:
        for row in csv.DictReader(fh, delimiter="\t"):
            metrics[row["article"]] = row

    findings = []
    profiles = {}

    # один slug = одна запись: .html и metadata-only .mdx дублируют друг друга
    seen: dict[str, int] = {}
    for path in sorted(glob.glob(os.path.join(a.corpus_dir, "*.mdx")) +
                       glob.glob(os.path.join(a.corpus_dir, "*.html"))):
        slug = os.path.splitext(os.path.basename(path))[0]
        raw = open(path, encoding="utf-8").read()
        m = metrics.get(slug)
        if not m:
            continue
        w = int(float(m["words"]))
        if w == 0:
            profiles[slug] = "UNMEASURED"
            continue
        if slug in seen:
            continue          # уже обработали этот slug из другого источника
        seen[slug] = 1
        prof = classify(slug, raw, w)
        profiles[slug] = prof
        t = TH[prof]

        def add(crit, measured, norm, severity, note=""):
            findings.append({
                "profile": prof, "article": slug, "criterion": crit,
                "measured": measured, "norm": norm, "severity": severity, "note": note,
            })

        p1 = float(m["pct_1sent"])
        if p1 > t["pct_1sent"]:
            add("B-01", f"{p1:.0f}%", f"<={t['pct_1sent']}%",
                "P1" if p1 > t["pct_1sent"] * 1.5 else "P2")

        cv = float(m["cv"])
        if cv < t["cv"]:
            add("B-02", f"{cv:.2f}", f">={t['cv']}", "P2")

        lt15 = float(m["pct_lt15"])
        if lt15 > t["pct_lt15"]:
            add("B-04", f"{lt15:.0f}%", f"<={t['pct_lt15']}%", "P3")

        if w < t["min_words"]:
            add("D-01", f"{w} сл", f">={t['min_words']}", "P1",
                "ниже тира " + ("Мост" if t["min_words"] == 900 else "минимума профиля"))

        h2 = int(m["h2"])
        lo, hi = t["words_per_h2"]
        if h2 == 0:
            add("C-05", "0", ">0", "P2", "нет h2-каркаса")
        else:
            wph = w / h2
            if wph < lo:
                add("C-01", f"{wph:.0f} сл/h2", f"{lo}-{hi}", "P2")
            elif wph > hi * 1.5:
                add("C-01", f"{wph:.0f} сл/h2", f"{lo}-{hi}", "P3", "секции слишком длинные")

        si = int(m["summary_items"])
        if 0 < si < 4:
            add("C-06", f"{si}", "4-6", "P2", "«Коротко» короче нормы")

        rt = int(m["readingTime"])
        wpm = float(m["words_per_min"])
        if rt and not (150 <= wpm <= 230):
            add("D-06", f"{wpm:.0f} сл/мин", "150-230", "P3", f"readingTime={rt}")

        if int(m.get("straight_quotes", 0)) > 0:
            add("E-02", m["straight_quotes"], "0", "P2", "прямые кавычки в теле")

    with open(a.out, "w", encoding="utf-8") as fh:
        cols = ["profile", "article", "criterion", "measured", "norm", "severity", "note"]
        fh.write("\t".join(cols) + "\n")
        for r in findings:
            fh.write("\t".join(str(r[c]) for c in cols) + "\n")

    # сводка
    from collections import Counter
    print(f"статей: {len(profiles)}  находок: {len(findings)}\n")
    print("профили:", dict(sorted(Counter(profiles.values()).items())))
    print("\nпо критериям:")
    for k, v in sorted(Counter(f["criterion"] for f in findings).items()):
        print(f"  {k:6} {v:3}")
    print("\nпо тяжести:", dict(sorted(Counter(f["severity"] for f in findings).items())))
    print(f"\nTSV: {a.out}")

    with open(a.out.replace(".tsv", "_profiles.tsv"), "w", encoding="utf-8") as fh:
        fh.write("article\tprofile\twords\n")
        for s, p in sorted(profiles.items()):
            fh.write(f"{s}\t{p}\t{metrics[s]['words']}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
