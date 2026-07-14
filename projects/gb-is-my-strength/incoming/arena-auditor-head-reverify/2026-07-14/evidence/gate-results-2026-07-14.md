# Gate results @ source `2ca2af3b` — 2026-07-14

| Command | Exit | Summary |
|---|---|---|
| editorial-metadata-registry.js --check | 1 | 25 eligible / 20 records; 5 missing article routes |
| css-layer-validator site.css --ceiling=202 | 1 | !important 210 > 202; layered 21.2% |
| validate-map-routes.js | 1 | 25 issues (hub 10 missing vs stat 9; nachalo schema; avraam/shoftim stats) |
| avraam-map-audit.js | 1 | 25/27; places 22 vs 19 HTML set |
| check-route-profiles.js --strict | 0 | with legacy HTML trees present |
| check-page-ownership.js | 0 | with trees |
| check-map-publication-status.js | 0 | consistent |
| gill:series:data:consistency:audit | 0 | ALL CHECKS PASSED |
| mdx:structure:audit | 0 | 48 MDX files |
| tokens:check | 0 | OK |
| editorial:lint (root-html) | 0 | OK |

## Editorial missing routes
- /articles/dzhon-gill-chast-4-ekzeget/
- /articles/chto-bibliya-nazyvaet-serdcem/
- /articles/novoe-serdce/
- /articles/serdce-i-duh/
- /articles/serdce-spravochnik/

## Hub arithmetic
- route.json maps: 11
- featured on hub HTML: avraam only
- missing clickable cards: 10
- hero stat «на аудите»: 9  → exception fails

## CI
- deploy 29338523013: fail Static publication gates
- indexnow 29338522715: fail Validate registry structure
- visual parity 29338522526: fail
- last green deploy: 29138555390 @ 007b67def5 (2026-07-11)
