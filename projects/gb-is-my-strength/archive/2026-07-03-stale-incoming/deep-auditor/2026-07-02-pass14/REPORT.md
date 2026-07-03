# Pass 14: Cross-Agent Verification + Core Web Vitals + Performance

**Дата:** 2026-07-02  
**HEAD:** d5d9388b  
**Фокус:** Верификация находок других агентов + Core Web Vitals + Performance

---

## 🔍 Часть 1: Cross-Agent Verification

### SEO-001 (от arena-deep-auditor) — FALSE POSITIVE для production

**Заявлено:** 5 из 10 статей имеют JSON-LD БЕЗ Article schema (вся серия Gill)

**Верификация:**
- ✅ Astro компоненты GillPart1PageHead.astro ИМЕЮТ полный Article schema
- ✅ JSON-LD в Astro содержит: Organization, WebSite, Article, Person, WebPage, SpeakableSpecification, BreadcrumbList
- ✅ Все Gill статьи имеют owner=astro в page-ownership.json
- ✅ На проде используется Astro-generated HTML (из dist/), а НЕ legacy HTML

**Root cause ложной тревоги:** Агент проверял legacy HTML файлы в `articles/dzhon-gill-*/index.html`, которые:
- Имеют пустые `<script type="application/ld+json"></script>` tags
- НЕ используются на проде (потому что owner=astro)
- Являются артефактами старой генерации

**Заключение:** ❌ **SEO-001 — FALSE POSITIVE для production**

На проде Astro build генерирует правильный HTML с полным Article schema из GillPart1PageHead.astro.

---

### BUG-032 (наше) — ПОДТВЕРЖДЁН

**Заявлено:** 40 изображений без alt attributes

**Верификация:**
- ✅ 39 `<img>` без alt в src/components/
- ✅ 1 `<img>` без alt в src/pages/
- ✅ 18 `<img>` без alt в legacy HTML
- ❌ SEO агент проверял ТОЛЬКО legacy HTML и нашёл "0 missing alt"

**Заключение:** ✅ **BUG-032 — VALID**

SEO агент проверял только legacy HTML, а не Astro источники. В Astro компонентах действительно есть 40 изображений без alt.

---

## 🆕 Часть 2: Новые находки (Pass 14)

### NEW-43 [P2] — 65 изображений без width/height (CLS issue)

**Проблема:** 65 `<img>` в Astro компонентах не имеют атрибутов width/height

**Impact:** Cumulative Layout Shift (CLS) — Core Web Vital
- Браузер не может зарезервировать место для изображения до загрузки
- Контент сдвигается при появлении изображения
- Плохой пользовательский опыт

**Распределение:**
```
  7  src/components/home/HomeSections/Publications.astro
  7  src/components/articles/ArticlesPublicationsSection.astro
  5  src/components/nagornaya/seriya/NagornayaSeriyaMainShell.astro
  5  src/components/nagornaya/seriya/NagornayaSeriyaBody.astro
  2  src/components/home/HomeSections/Refutations.astro
  1  src/components/pastor-series/PastorSeriesPageHead.astro
  ... (ещё 38 компонентов)
```

**Recommendation:** Добавить width/height ко всем изображениям. Для responsive images использовать aspect-ratio или CSS container.

---

### NEW-44 [P3] — 59 изображений без loading attribute

**Проблема:** 59 `<img>` не имеют атрибута loading

**Impact:** Performance
- Изображения без loading загружаются немедленно
- Увеличивается время до интерактивности (TTI)
- Тратится bandwidth на изображения вне viewport

**Статистика:**
- ✅ 133 images с loading="lazy" (хорошо)
- ✅ 24 images с loading="eager" (hero images, хорошо)
- ⚠️ 59 images БЕЗ loading attribute

**Recommendation:** Добавить loading="lazy" ко всем изображениям ниже fold. Оставить loading="eager" только для LCP hero images.

---

### NEW-45 [P3] — 0 prefetch links (missed optimization)

**Проблема:** Сайт не использует `<link rel="prefetch">` для критических ресурсов

**Impact:** Performance
- Нет предзагрузки ресурсов для следующих navigations
- Пользователь ждёт загрузки при переходе на новую страницу

**Статистика:**
- ✅ 78 preload links (для текущей страницы)
- ❌ 0 prefetch links (для следующих navigations)

**Recommendation:** Добавить prefetch для:
- CSS/JS следующих вероятных navigations
- Критических изображений следующих страниц
- Шрифтов, которые используются на внутренних страницах

---

## 📊 Часть 3: Core Web Vitals Assessment

### LCP (Largest Contentful Paint)

**Положительно:**
- ✅ 54 preload font tags (критические шрифты загружаются рано)
- ✅ Gill Part 3 hero имеет fetchpriority="high" и loading="eager"
- ✅ Hero images имеют правильные dimensions (width/height)

**Проблемы:**
- ⚠️ site.js = 163KB (уже в BUG-006)
- ⚠️ 59 images без loading attribute

**Оценка:** 🟡 **7/10** — хорошая база, но есть оптимизации

---

### CLS (Cumulative Layout Shift)

**Положительно:**
- ✅ Gill hero images имеют width/height
- ✅ Font loading с font-display: swap (уже проверено)

**Проблемы:**
- ❌ 65 images без width/height (NEW-43)
- ⚠️ Potential layout shifts при загрузке изображений

**Оценка:** 🔴 **5/10** — серьёзная проблема с dimensions

---

### INP (Interaction to Next Paint)

**Положительно:**
- ✅ 18 DOMContentLoaded listeners (умеренно)
- ✅ Passive event listeners для scroll/wheel (уже проверено)

**Проблемы:**
- ⚠️ 188 элементов с tabindex=0 (много интерактивных элементов)
- ⚠️ floating-cluster-controller.js = 58KB с 38 event listeners

**Оценка:** 🟡 **7/10** — приемлемо, но есть потенциал для оптимизации

---

## 📊 Часть 4: PWA Assessment

### manifest.json — ПОЛНЫЙ

✅ Все обязательные поля present:
- name, short_name, start_url, display
- 4 icons (разных размеров)
- theme_color, background_color

**Оценка:** ✅ **10/10**

---

### Service Worker — ХОРОШО (уже проверено в Pass 10)

✅ Cache strategies sound
✅ Offline fallback to 404.html
✅ Precache 26 assets

**Оценка:** ✅ **9/10** (минус 1 за in-memory LRU из BUG-036)

---

## 📊 Часть 5: Performance Assessment

### Bundle Size

**JavaScript:**
- site.js: 163KB (BUG-006)
- floating-cluster-controller.js: 58KB
- enhancements.js: 47KB
- search.js: 33KB
- **Total: ~345KB JS**

**CSS:**
- site.css: 283KB
- site-layered.css: 278KB (BUG-005 — dead file)
- floating-cluster.css: 106KB
- **Total: ~667KB CSS**

**Оценка:** 🔴 **5/10** — большие bundles, нужна оптимизация

---

### Lazy Loading

**Положительно:**
- ✅ 133 images с loading="lazy"

**Проблемы:**
- ⚠️ 59 images без loading attribute (NEW-44)

**Оценка:** 🟡 **7/10**

---

### Prefetching/Preloading

**Положительно:**
- ✅ 78 preload links
- ✅ 54 font preload tags

**Проблемы:**
- ❌ 0 prefetch links (NEW-45)

**Оценка:** 🟡 **6/10**

---

## 🏆 Итоговая матрица Pass 14

### Новые баги:
- **NEW-43 [P2]:** 65 images без width/height (CLS)
- **NEW-44 [P3]:** 59 images без loading attribute
- **NEW-45 [P3]:** 0 prefetch links

### Верификация:
- ❌ SEO-001 — FALSE POSITIVE для production
- ✅ BUG-032 — VALID (40 images без alt)

---

## 📈 Обновлённая мастер-матрица

**Всего багов:** 45 (было 42)

| Severity | Count | Change |
|----------|-------|--------|
| 🔴 P1 | 4 | unchanged |
| 🟡 P2 | 24 | +1 (NEW-43) |
| 🔵 P3 | 14 | +2 (NEW-44, NEW-45) |
| ⚪ S0 | 3 | unchanged |
| **Total** | **45** | **+3** |

---

## ✅ Positive Checks (Pass 14)

| # | Check | Status |
|---|-------|--------|
| 65 | manifest.json complete | ✅ |
| 66 | Service Worker strategies sound | ✅ |
| 67 | 133 images с loading="lazy" | ✅ |
| 68 | 78 preload links | ✅ |
| 69 | 54 font preload tags | ✅ |
| 70 | Gill hero images оптимизированы | ✅ |

---

**Commit:** pending
