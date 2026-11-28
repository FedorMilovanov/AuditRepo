# HOREB W18 — редактируемый 3D-персонаж матери Моисея

**ENGINEERING PASS / PREMIUM ART HOLD / NO PRODUCT, NO RELEASE.** Это вымышленный художественный образ взрослой женщины, НЕ установленная внешность Иохаведы и не археологически проверенный костюм.

## Реальный производственный результат

- `source/build_mother_pilot.py`: Blender 4.5.16 LTS с изолированным MPFB 2.0.18; женский параметр `gender=.02` (0 — female, 1 — male), анатомическая сетка MakeHuman и настоящий 53-костный игровой риг.
- `source/horeb_mother_rig_pilot.blend`: редактируемые скелет, тело, оригинальная свободная льняная туника, рукава, временное головное покрытие; два оригинальных NLA-клипа `Mother_QuietIdle` и `Mother_GestureTowardsBasket`.
- `../../public/artlab/horeb_mother_rig_pilot.glb`: действительный GLB glTF 2.0, импортируемый в Three.js через `GLTFLoader`, деформация через `SkinnedMesh` и `AnimationMixer`. Бинарный GLB и BLEND имеют `.artifact.json` со строгими SHA-256, длиной, правами и удержанием.
- `../../actorlab.html`, `../../src/imena-boga-horeb-3d/ui/MotherArtLab.tsx`: отдельная неигровая студия контроля четырёх камер, переключения и паузы клипов. Не заменяет W15.
- `../../tests/verify-mother-asset.mjs`: статическая проверка структуры GLB, рига, двух клипов и хэшей в CI; `../../tests/browser-mother-artlab.cjs`: реальные Chrome 1440×900 + 390×844 с кадрами.

**Лицензии:** базовая геометрия MakeHuman — CC0; код аддона MPFB — GPL, используется лишь как инструмент создания в Blender и не включён в браузерное приложение. Костюм и анимации — оригинальная авторская работа для HOREB. Чужие игровые модели, лица и неясные текстуры не брались. Полный объём официальных MakeHuman skin-материалов **пока не загружен и в результат не входит**.

Источники: https://www.makehumancommunity.org/content/license.html ; https://extensions.blender.org/add-ons/mpfb/ ; https://github.com/makehumancommunity/mpfb2/blob/master/docs/entities/objectproperties.md ; UCL Digital Egypt https://www.ucl.ac.uk/museums-static/digitalegypt/textil/dress.html.

## Воспроизведение на изолированном компьютере

Установить официальный MPFB 2.0.18 как Blender extension в профиль, изолированный от других художников; официальный ZIP SHA-256 `c075b3e9b94b8e5556a5f03f4653602d02ea306de08126e8f55ed6dee28a2dad`.

```powershell
$env:BLENDER_USER_RESOURCES='H:\HOREB_ArtPipeline\blender-user'
$env:HOREB_ART_PIPELINE_ROOT="$PWD\art-lab\mother"
& 'H:\HOREB_ArtPipeline\tools\blender-4.5.16-windows-x64\blender.exe' --background --python art-lab\mother\source\build_mother_pilot.py
Copy-Item art-lab\mother\export\horeb_mother_rig_pilot.glb public\artlab\horeb_mother_rig_pilot.glb
# После каждого переэкспорта обновлять бинарные sidecars, до commit:
node tests\verify-mother-asset.mjs
```

**Локальная студия:** http://127.0.0.1:5192/actorlab.html (только компьютер с запущенным Vite). Браузерная проверка: `node tests/browser-mother-artlab.cjs` с переменными `HOREB_ARTLAB_BASE_URL`, `HOREB_BROWSER_PATH`. Оригинальные кадры `H:\HOREB_ArtPipeline\evidence\w18-mother-*.png`.

## Независимая визуальная оценка: ART HOLD

Проверены настоящие кадры, не рендер-превью из исходников. Сначала камера была внутри стены, человек скрыт, а фартук выглядел рваным. Исправлено: отдельная студия фигуры, камера лица/рук, удалён бракованный фартук, посажено головное покрытие вместо висящей над головой детали. Однако **лицо/глаза и кожа выглядят схематично; покрой рукавов жёсткий, головное покрытие неубедительное, жест ещё слабый**. Материалы тела временны, профессиональной PBR кожи и лицевой анимации нет. Результат **не 8–9/10 и не релиз**.

Следующая волна: оригинальный качественный facial/eye/skin/lookdev с понятным лицензированием, специалист по тканям и аниматор рук. Требовать реальные сравнительные кадры в одном ракурсе; лишь после независимой ART-приёмки заменить *одного* NPC в W15 и проверить реальную производительность и доступность. Исх. 1:15–22 и 2:1–10 не подменять выдуманными цитатами или исходами; отображение Бога запрещено. Все Product/Research/rights/release — HOLD.
