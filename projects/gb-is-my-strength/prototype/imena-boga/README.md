# Имена Бога — два Arena-эталона и ограниченная Prototype Lab

Этот каталог относится только к AuditRepo для проекта gb-is-my-strength (gospod-bog.ru). Он не меняет Product, не становится источником Production routes и не публикует непроверенный библейский корпус.

- originals/: четыре уникальных ZIP (пятый исходный ZIP совпадал с одним из них по распакованному содержимому); исходные бинарники и SHA не менялись.
- provenance/original-manifest.json: идентификаторы пяти оригинальных ZIP пользователя.
- reference/atlas и reference/sozvezdie: неизменённые поздние Arena оригиналы. Это художественные доноры, не проверенная теология.
- candidates/v12/: проверенная контрольная версия до эксперимента со шрифтами.
- candidates/v13/: единственный активный кандидат — Atlas с локальным Lora Variable и компактными остальными семействами, Constellation с ограниченными статическими подмножествами и WebP/JPEG Sinai.
- research/FONT_V13_LAB.md и FONT_V13_STATIC_VS_HYBRID.json: обоснование архитектуры, измерения и отвергнутые варианты.
- research/PROTO_CANDIDATE_HISTORY.md: история v07–v11, убранных из HEAD вместо постоянного дублирования исходников.

Обязательные границы: функциональный QA самостоятельного Vite не есть Product exact-head QA; 36 и 29 сущностей не объявлять 65 проверенными каноническими именами; Hebrew/Greek, первоисточники и права проверяются Research; фото Синая не публикационно разрешено; общее Reader/Search/SEO и архитектура маршрутов принадлежат Astro Product. WebGL/Canvas/React islands можно использовать точечно без полного переписывания сайта в React.

Prototype Lab workflow: AuditRepo PR #539. Ни один Draft PR автоматически не сливать из-за успешного browser smoke.
