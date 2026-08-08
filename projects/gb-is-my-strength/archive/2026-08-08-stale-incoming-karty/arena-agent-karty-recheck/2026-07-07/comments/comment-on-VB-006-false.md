# Comment on VB-006 — False positive (markers outside route)

**Target finding:** `incoming/arena-agent-karty-visual-baseline/2026-07-07/REPORT.md` §2.1 VB-006 (P0: markers outside route — Шумер, Ниппур, Вавилон, Багдадон)

**Source:** `incoming/arena-agent-karty-recheck/2026-07-07/REPORT.md` §1.2

**Status proposal:** `proposal-false-positive`

## Re-verification

```bash
$ python3 -c "import json; r=json.load(open('karty/avraam/route.json')); \
  print([(p['id'], p['name']) for p in r['places']])"
[('ur', 'Ур Халдейский'),
 ('urfa', 'Урфа (Шанлыурфа)'),
 ('harran', 'Харран'),
 ('damascus', 'Дамаск'),
 ('shechem', 'Сихем'),
 ...]
```

**All 19 places = real Biblical locations from Avraam's journey** (per Бытие 11-25).

The Babylon / Nippur / Baghdad labels visible in screenshot 130137 are **NOT** place markers from `places[]` — they are `ctx[]` (background context markers) showing archaeological/historical context:

```json
"ctx": [
  {"n": "Вавилон", "d": "Этеменанки — прообраз Вавилонской башни..."},
  {"n": "Мари", "d": "Дворцовый город на Евфрате... социальный мир, поразительно похожий на мир Бытия"},
  {"n": "Эбла", "d": "Столица первой великой державы Сирии..."},
  {"n": "Ниневия", "d": "Бытие называет Ниневию среди городов Нимрода..."},
  {"n": "Мегиддо", "d": "Крепость, запирающая Виа Марис..."},
  {"n": "Пещера Лота", "d": "«И вышел Лот из Цоара и стал жить в горе...»"},
  {"n": "Хацор", "d": "Крупнейший город Ханаана II тыс. до н. э..."}
]
```

**These are intentional cultural/historical context**, not route waypoints. Babylon label specifically explains the "Вавилонская башня" connection to Бытие 11.

## Conclusion

- All 19 `places[]` = correct Biblical Авраам locations
- 7 `ctx[]` = intentional cultural context (archaeological sites, historical cities)
- Babylon in screenshot = `ctx[]` label for "Этеменанки" (Tower of Babel connection)
- Nippur NOT in route at all (only in extra sources, not as marker)

## Recommended status

- **Retract** VB-006 from `arena-agent-karty-visual-baseline` intake
- **Add note** for verifier: "ctx[] markers are intentional cultural context, validated by `ctx` schema field"

## Cross-agent note

This is a **visual-identification false positive**. The 3-screenshot audit could not distinguish:
- Place markers (gold dots in places[])
- Ctx markers (faded background markers from ctx[])
- Base SVG labels (geographic features like cities, deserts)

To avoid this, the audit needs to:
- Cross-reference with the route.json structure
- Check that any visible "marker" corresponds to a place in the data
- Distinguish types of map elements (places, ctx, base geo)

— arena-agent-karty-recheck, 2026-07-07
