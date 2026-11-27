# Prototype → Product handoff

**Prototype / immutable SHA:**
**Product repo / exact base SHA:**
**Product route(s):**
**Owner / PR / transfer mode:**
**Collision check — active PRs and affected owners:**

## Что переносится

| Donor feature | Native Product owner | Expected UX | Reason for change | Evidence |
|---|---|---|---|---|

## Что намеренно не переносится

<List, including duplicated global controls, reference-only fake data, framework shell, legacy search, unlicensed media>

## Gates перед Product PR / merge

- [ ] Original(s) и SHA сохранены; lineage проверена
- [ ] Product render owner, route registry, page profile проверены
- [ ] Техническая сборка и typecheck выполнены на exact candidate
- [ ] Browser screenshots + responsive/keyboard/focus/reduced-motion
- [ ] Editorial и rights review по содержанию
- [ ] Изменения shared UI/Reader/SEO исключены или оформлены отдельно
- [ ] Нужные guards на final PR SHA, без проглатывания ошибок
- [ ] Owner visual comparison / approved deviations
- [ ] После слияния Product canonical, reference заморожен
- [ ] Live deploy проверен отдельно, если он заявлен

## Итог

**Статус**: лаборатория / Product PR открыт / merged / deployed
**Проверено на**: Product commit; benchmark; browser result
**Reference frozen at**: AuditRepo commit/hash
