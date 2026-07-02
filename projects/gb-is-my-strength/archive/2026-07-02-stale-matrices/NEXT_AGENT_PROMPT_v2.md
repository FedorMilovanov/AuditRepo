# 🚀 ПРОМПТ ДЛЯ СЛЕДУЮЩЕГО АГЕНТА: Deep Audit v2

## 🎯 МИССИЯ

Ты — **Deep Auditor v2** для проекта gospod-bog.ru. Предыдущий аудитор провёл 8 проходов и нашёл **31 верифицированный баг**. Твоя задача — продолжить аудит, верифицировать существующие баги и найти новые проблемы.

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ (Pass 1-8)

**Всего багов:** 31  
**HEAD:** d5d9388b  
**Дата последнего аудита:** 2026-07-02

### Критические баги (P1) — 3 шт:
1. **BUG-001:** Memory leak в floating-cluster-controller.js (38 addEventListener, 0 removeEventListener)
2. **BUG-002:** 44 компонента с duplication (39 PageHead + 5 PostArticle)
3. **BUG-003:** SW precache gate orchestration (validate:static-publication не включает sw:dist:audit)

### Высокий приоритет (P2) — 19 шт:
- Security headers missing (HSTS, X-Frame-Options)
- CSS duplication (277KB wasted)
- site.js слишком большой (162KB)
- CSS breakpoint chaos (20 breakpoints)
- И ещё 15 багов...

### Полный список: `AuditRepo/projects/gb-is-my-strength/verified/MATRIX_PASS8_UPDATED.md`

---

## 📚 ЧТО ПРОЧИТАТЬ ПЕРВЫМ

1. **AGENTS.md** в gb-is-my-strength — контракт проекта, правила
2. **AuditRepo README.md** — как работать с audit repo
3. **SANDBOX-ENV-2026-06-21.md** — особенности среды Arena
4. **MATRIX_PASS8_UPDATED.md** — текущая верифицированная матрица (31 баг)

---

## 🔍 ЧТО ДЕЛАТЬ

### 1. Pull свежих изменений
```bash
cd /home/user/AuditRepo && git pull origin main
cd /home/user/gb-is-my-strength && git pull origin main
```

### 2. Продолжить аудит с Pass 9+

#### Области для проверки (Pass 9):

**A. Build & Deploy:**
- Проверить GitHub Actions workflows coverage
- Проверить, все ли маршруты покрыты тестами
- Проверить cache invalidation strategy

**B. Runtime Errors:**
- Проверить error boundaries в Astro компонентах
- Проверить, есть ли глобальный error handler
- Проверить 404/500 страницы

**C. Cross-Browser Compatibility:**
- Проверить CSS fallbacks для старых браузеров
- Проверить polyfills для ES6+ фич
- Проверить vendor prefixes

**D. Internationalization:**
- Проверить hard-coded strings (167 файлов)
- Предложить i18n стратегию

### 3. Верифицировать существующую матрицу

Проверить каждый из 31 бага:
- **BUG-001:** `grep -c 'addEventListener' js/floating-cluster-controller.js` (должно быть 38)
- **BUG-002:** `find src/components -name "*PageHead.astro" | wc -l` (должно быть 39)
- **BUG-003:** `grep "sw:dist:audit" package.json` (должно быть 0)

### 4. Очистить матрицу от мусора

Для каждого бага проверить:
- **False positive?** Может быть, это intentional design?
- **Актуален ли?** Возможно, уже исправлен?
- **Правильная ли severity?** Может быть P2 → P3?

### 5. Создать отчёт

```markdown
# Agent Work Report — gb-is-my-strength

## Meta
- Agent: [твоё имя]
- Date: [дата]
- HEAD: [git rev-parse HEAD]
- Pass: 9

## 1. New Findings
### NEW-33 [P2]
- Title: ...
- File: ...
- Evidence: ...

## 2. Matrix Updates
### BUG-001 — Status Update
- Previous: ✅ Still present
- Current: ✅ Still present / ❌ Fixed
- Evidence: ...

## 3. Removed (False Positives)
### BUG-XXX
- Reason: ...

## 4. Positive Checks
✅ ...
```

### 6. Commit и push
```bash
cd /home/user/AuditRepo
git add projects/gb-is-my-strength/
git commit -m "audit: pass 9 — [краткое описание]"
git push origin main
```

---

## 🎯 ПРИОРИТЕТЫ

### P1 (Critical) — исправить немедленно
- Memory leaks
- Data loss risks
- Security vulnerabilities

### P2 (High) — исправить в ближайшем релизе
- Performance issues
- SEO problems
- Code duplication

### P3 (Medium) — исправить позже
- Dead code
- Minor UX issues
- Best practices

### S0 (Low) — опционально
- Documentation
- Style improvements

---

## ⚠️ ЧТО НЕ ДЕЛАТЬ

1. **Не фиксить баги** — только находить и документировать
2. **Не менять исходный код** — только отчёты в AuditRepo
3. **Не создавать дубликаты** — проверь существующую матрицу
4. **Не завышать severity** — будь объективен

---

## ✅ ЧТО ПРОВЕРИТЬ ОБЯЗАТЕЛЬНО

### Positive Checks:
- [ ] Все скрипты валидны: `node --check scripts/*.js`
- [ ] Все image references валидны
- [ ] Все JSON-LD валидны
- [ ] Все canonical URLs совпадают
- [ ] Нет duplicate titles
- [ ] Все route.json валидны
- [ ] CSS brace balance = 0
- [ ] Нет eval()/Function() в production
- [ ] deploy.yml в правильном порядке
- [ ] notify-on-failure.yml watches все workflows
- [ ] Все MDX имеют readingTime
- [ ] cache-bust покрывает все файлы
- [ ] Content-Security-Policy присутствует
- [ ] X-Content-Type-Options присутствует
- [ ] Skip links присутствуют
- [ ] ARIA labels присутствуют

### Known Issues (должны быть в матрице):
- [ ] BUG-001: Memory leak (38 addEventListener, 0 removeEventListener)
- [ ] BUG-002: 44 компонента с duplication
- [ ] BUG-003: SW precache gate orchestration
- [ ] NEW-28: Missing HSTS header
- [ ] NEW-29: Missing X-Frame-Options
- [ ] NEW-31: Missing Referrer-Policy
- [ ] NEW-32: Missing Permissions-Policy

---

## 🔗 ССЫЛКИ

- **Исходный репо:** https://github.com/FedorMilovanov/gb-is-my-strength
- **AuditRepo:** https://github.com/FedorMilovanov/AuditRepo
- **Текущая матрица:** `AuditRepo/projects/gb-is-my-strength/verified/MATRIX_PASS8_UPDATED.md`
- **Шаблоны:** `AuditRepo/projects/_templates/`

---

## 💡 СОВЕТЫ

1. **Будь методичным** — проверяй по одной области за раз
2. **Документируй evidence** — grep outputs, line counts, file sizes
3. **Cross-reference** — сравнивай с другими агентами
4. **Не спеши** — лучше найти 3 точных бага, чем 10 неточных
5. **Обновляй матрицу** — не создавай новые отчёты, обновляй существующую

---

## 🎯 КАК ИЗМЕРЯТЬ УСПЕХ

- **Хорошо:** Нашёл 2-3 новых бага, верифицировал 2-3 старых
- **Отлично:** Нашёл 5+ новых багов, верифицировал все старые, очистил матрицу
- **Превосходно:** Нашёл критический баг (P1), который пропустили другие

---

**Удачи! Проект большой и сложный, но ты справишься. 🚀**
