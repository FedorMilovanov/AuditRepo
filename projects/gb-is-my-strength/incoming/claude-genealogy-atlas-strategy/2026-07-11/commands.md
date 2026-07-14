# Аудит-команды (gb-is-my-strength @ 47cdf86, ветка claude/biblical-genealogy-svg-6l6qb8)

# Поиск генеалогических материалов по обоим репо
grep -ril 'генеалог|родослов|genealog|rodoslov|family.?tree|GEDCOM' /home/user/gb-is-my-strength
grep -ril 'генеалог|родослов|genealog|rodoslov' /home/user/AuditRepo

# Инвентаризация кода
wc -l src/components/genealogy/* src/components/rodosloviye/* src/pages/rodosloviye/* rodosloviye/index.html

# Данные
python3 -c "import json; d=json.load(open('data/genealogy/genealogy.json')); ..."  # persons/lineage/role/era stats

# Route-статус
python3 -c "... migration/page-ownership.json ..."   # /rodosloviye/ -> production-dist
cat data/route-profiles/rodosloviye.json              # strict-native-app
grep -c rodosloviye sitemap.xml data/public-content-baseline.json data/search-manifest.json

# Discoverability (входящие ссылки) — пусто
grep -rl 'rodosloviye' index.html karty/index.html articles/index.html src/pages/index.astro src/components/ | grep -v 'components/rodosloviye|components/genealogy'

# Build-evidence
npm ci --no-audit --no-fund
npx astro build            # 54 pages OK; dist/rodosloviye/index.html emitted
ls dist/_astro/ | grep -i genealogy
du -h dist/_astro/GenealogyTree.*.js dist/_astro/client.*.js   # 248K/180K raw; 80KB/56KB gz
du -h dist/rodosloviye/index.html                              # 128K (props inlined)

# Зависимости
grep -E '"(react|react-dom|@xyflow/react|@dagrejs/dagre|@astrojs/react|astro)"' package.json

# Веб-исследование: deep-research workflow (6 углов x WebSearch -> WebFetch -> 3-vote adversarial verify),
# результаты в artifacts/web-research-sources-2026-07-11.md

# Dataset feasibility probe (2026-07-11, тот же сеанс)
curl -sSL -o theographic-people.json "https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/master/json/people.json"   # 5 072 606 b
python3 - <<'PY'   # 3 067 записей; поля: father 1584, children 963, siblings 944, mother 200, partners 173, memberOf 736, eastons 1816
import json, collections
d = json.load(open('theographic-people.json')); print(len(d))
PY
curl -sSL -o tipnr.txt "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Proper%20Nouns/TIPNR%20-%20Translators%20Individualised%20Proper%20Names%20with%20all%20References%20-%20STEPBible.org%20CC%20BY.txt"   # 8 611 754 b
python3 - <<'PY'   # $-records 4269; топ-строк 4233; Parents заполнено 3329; Offspring 2047; Partners 1249
# (см. evidence/dataset-feasibility-probe-2026-07-11.md)
PY

# probe-2: извлечение русских имён (2026-07-11)
curl -sSL -o ru_synodal.json "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/ru_synodal.json"   # 5 924 506 b, 66 книг
# Секционный парсер TIPNR (PERSON top-lines, gender M/F): 3 056 персон
# Случайная выборка 60 рефов Book.ch.v -> Синодальный JSON: 60/60 разрешились
# Ручное выравнивание 9 персон (Peleg/Seth/Enosh/Aaron/Zerubbabel/Boaz/Methuselah/Rahab/Jesse):
#   8/9 нашли русское имя в стихе первого упоминания; Jesse@Rut.4.17 — сдвиг версификации (текст 4:18)
# (полный скрипт — в истории сессии; переписывается начисто в Phase 1 как scripts/genealogy-build/)
