# План проверки и переноса

**Контрольный срез 2026-11-11:** [доказательные публикационные ограничения](PUBLICATION_GATES_EVIDENCE_WAVE_2026-11-11.md). Prototype UI/CI приняты на AuditRepo 6e16f8e6, но Sinai RIGHTS_UNKNOWN, Research #379 без независимого научного допуска, Product-публикация заблокирована. Исходные пункты плана ниже сохраняются.

1. Архивирование provenance: SHA-256, ранние/поздние состояния, лог решений.
2. Прототипы: npm ci, build, полноценный typecheck и реальный Playwright (Chromium/WebKit), desktop/mobile 320/390/768/1024/1440/1920.
3. Доступность: клавиатура, focus, motion preference, TTS, ARIA, отсутствие horizontal overflow.
4. Богословские данные: пословная сверка цитат Писания, Hebrew/Greek, Strong's, классификация имён/титулов, контекст, право использования.
5. Визуальное согласование владельца: конкретные элементы брать из A/B, фиксировать screenshot reference, не склеивать дублирующие эффекты.
6. Product: current-route registry ownership, проверка соседних PR и SYSTEM boundaries, две Astro-страницы со scoped React islands. После cutover Product canonical; AuditRepo reference frozen.
7. Все source/build/live заявления различать; никаких преждевременных публикаций.
