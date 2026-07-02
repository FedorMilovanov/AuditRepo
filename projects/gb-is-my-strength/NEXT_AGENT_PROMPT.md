# ПРОМПТ ДЛЯ СЛЕДУЮЩЕГО АГЕНТА: Deep Audit для gospod-bog.ru

## 🎯 МИССИЯ

Ты — **Deep Auditor** для проекта gospod-bog.ru. Твоя задача — найти баги, неточности, слабости проверок, устаревшие проверки, недофакторинг. Ты работаешь в AuditRepo (https://github.com/FedorMilovanov/AuditRepo) и исходном репозитории (https://github.com/FedorMilovanov/gb-is-my-strength).

## 📚 ЧТО ПРОЧИТАТЬ ПЕРВЫМ

1. **AGENTS.md** в gb-is-my-strength — контракт проекта, правила, protected subsystems
2. **AuditRepo README.md** — как работать с audit repo, шаблоны отчётов
3. **SANDBOX-ENV-2026-06-21.md** в AuditRepo — особенности среды Arena
4. **VERIFIED_BUG_MATRIX_FINAL.md** в AuditRepo — текущая верифицированная матрица (26 багов)

## 🔍 ЧТО ДЕЛАТЬ

### 1. Pull свежих изменений
```bash
cd /home/user/AuditRepo
git pull origin main

cd /home/user/gb-is-my-strength
git pull origin main
```

### 2. Продолжить аудит с Pass 7+
Предыдущий аудитор сделал 6 проходов (26 верифицированных багов). Начни с Pass 7.

#### Области для проверки (Pass 7):

**A. Security headers (найдено в предыдущих проходах):**
- ❌ Нет `Strict-Transport-Security` (HSTS) — критично для HTTPS
- ❌ Нет `X-Frame-Options` — защита от clickjacking
- Проверь все статьи: `grep -r "Strict-Transport-Security\|X-Frame-Options" articles/`
- Если найдены статьи без этих заголовков — добавь как **NEW-28 [P2]**

**B. Performance optimization:**
- Проверь, есть ли Lighthouse/performance скрипты: `grep -r "lighthouse\|performance" package.json`
- Если нет — предложи добавить как **NEW-29 [P3]**

**C. TypeScript типы:**
- Найди все .ts/.tsx файлы: `find src -name "*.ts" -o -name "*.tsx"`
- Проверь, есть ли tsconfig.json и правильная ли конфигурация
- Проверь TypeScript ошибки: `npm run astro:check` (если есть)
- Если найдены ошибки — добавь как баги

**D. Cross-reference с другими агентами:**
- Прочитай отчёты в `AuditRepo/projects/gb-is-my-strength/incoming/`
- Сравни свои находки с другими агентами
- Избегай дублирования

### 3. Верифицировать существующую матрицу

Проверь каждый из 26 багов:
- **BUG-001** (P1): Memory leak в floating-cluster-controller.js
  - Проверь: `grep -c 'addEventListener' js/floating-cluster-controller.js`
  - Проверь: `grep -c 'removeEventListener' js/floating-cluster-controller.js`
  - Если counts изменились — обнови статус
  
- **BUG-002** (P1): 44 компонента с duplication
  - Проверь: `find src/components -name "*PageHead.astro" -o -name "*PostArticle.astro"`
  - Если количество изменилось — обнови
  
- **BUG-003** (P1): SW precache gate orchestration
  - Проверь: `grep "sw:dist:audit" package.json`
  - Если добавлен в validate:static-publication — закрой баг

### 4. Очистить матрицу от мусора

Для каждого бага проверь:
- **False positive?** Может быть, это intentional design?
- **Актуален ли?** Возможно, уже исправлен?
- **Можно ли объединить?** Есть ли дубликаты?
- **Правильная ли severity?** Может быть P2 → P3 или наоборот?

### 5. Создать отчёт

Используй шаблон из `AuditRepo/projects/_templates/AGENT_REPORT_TEMPLATE.md`

Структура:
```markdown
# Agent Work Report — gb-is-my-strength

## Meta
- Agent: [твоё имя]
- Date: [дата]
- HEAD: [git rev-parse HEAD]
- Mode: free-intake

## 1. New Findings
### NEW-28 [P2]
- Title: ...
- File: ...
- Evidence: ...
- Recommendation: ...

## 2. Matrix Updates
### BUG-001 — Status Update
- Previous: ✅ Confirmed
- Current: ❌ Fixed / ✅ Still present
- Evidence: ...

### BUG-002 — Severity Change
- Previous: P1
- Proposed: P2
- Reason: ...

## 3. Removed (False Positives)
### BUG-XXX
- Reason: ...

## 4. Positive Checks
✅ ...
✅ ...
```

### 6. Commit и push

```bash
cd /home/user/AuditRepo
git add projects/gb-is-my-strength/
git commit -m "audit: pass 7 — [краткое описание]"
git push origin main
```

## 🎯 ПРИОРИТЕТЫ

### P1 (Critical) — исправить немедленно
- Memory leaks
- Data loss risks
- Security vulnerabilities
- CI/CD blockers

### P2 (High) — исправить в ближайшем релизе
- Performance issues
- SEO problems
- Data inconsistency
- Code duplication

### P3 (Medium) — исправить позже
- Dead code
- Minor UX issues
- Documentation gaps

### S0 (Low) — опционально
- Style issues
- Minor docs improvements

## ⚠️ ЧТО НЕ ДЕЛАТЬ

1. **Не фиксить баги** — только находить и документировать
2. **Не менять исходный код** — только отчёты в AuditRepo
3. **Не создавать дубликаты** — проверь существующую матрицу
4. **Не завышать severity** — будь объективен
5. **Не игнорировать positive checks** — документируй что работает хорошо

## ✅ ЧТО ПРОВЕРИТЬ ОБЯЗАТЕЛЬНО

### Positive Checks (должны быть ✅):
- [ ] Все скрипты валидны: `node --check scripts/*.js`
- [ ] Все image references валидны
- [ ] Все JSON-LD валидны
- [ ] Все canonical URLs совпадают с og:url
- [ ] Нет duplicate titles
- [ ] Все route.json валидны
- [ ] CSS brace balance = 0
- [ ] Нет eval()/Function() в production
- [ ] Нет http:// mixed content
- [ ] deploy.yml в правильном порядке
- [ ] notify-on-failure.yml watches все workflows
- [ ] Все MDX имеют readingTime
- [ ] cache-bust покрывает все файлы

### Known Issues (должны быть в матрице):
- [ ] BUG-001: Memory leak
- [ ] BUG-002: Component duplication
- [ ] BUG-003: SW gate orchestration
- [ ] BUG-005: CSS duplication (277KB)
- [ ] BUG-006: site.js слишком большой (162KB)
- [ ] BUG-010: CSS breakpoint chaos (20 breakpoints)

## 📊 КАК ИЗМЕРЯТЬ УСПЕХ

- **Хорошо:** Нашёл 3-5 новых багов, верифицировал 2-3 старых, удалил 1 false positive
- **Отлично:** Нашёл 5+ новых багов, верифицировал все старые, очистил матрицу
- **Превосходно:** Нашёл критический баг (P1), который пропустили другие

## 🔗 ССЫЛКИ

- Исходный репо: https://github.com/FedorMilovanov/gb-is-my-strength
- AuditRepo: https://github.com/FedorMilovanov/AuditRepo
- Текущая матрица: `AuditRepo/projects/gb-is-my-strength/verified/VERIFIED_BUG_MATRIX_FINAL.md`
- Шаблоны: `AuditRepo/projects/_templates/`

## 💡 СОВЕТЫ

1. **Будь методичным** — проверяй по одной области за раз
2. **Документируй evidence** — grep outputs, line counts, file sizes
3. **Cross-reference** — сравнивай с другими агентами
4. **Не спеши** — лучше найти 3 точных бага, чем 10 неточных
5. **Обновляй матрицу** — не создавай новые отчёты, обновляй существующую

---

**Удачи! Проект большой и сложный, но ты справишься. 🚀**
