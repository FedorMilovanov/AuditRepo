# Аудит-отчет: Валидация багов RODOSLOVIYE-OG-IMAGE и GENEALOGY-ID-INVALID-SPACE

## Контекст
- **Целевой репозиторий**: `FedorMilovanov/gb-is-my-strength`
- **Анализируемый коммит**: `cb3681e1a`

## 1. Валидация RODOSLOVIYE-OG-IMAGE
🔴 **Подтверждено (Source-confirmed)**

**Анализ кода**:
В компоненте `src/components/rodosloviye/RodosloviyePageHead.astro` прописаны следующие мета-теги:
```html
<meta property="og:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/webp" />
<meta property="og:image:alt" content="Родословие от Адама до Христа — интерактивное древо" />
```
Также для Twitter:
```html
<meta name="twitter:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />
```

**Вывод**: Описание (`og:image:alt`) однозначно говорит о родословии от Адама до Христа, однако сама картинка (asset) жестко указывает на `og-karty-1200x630.webp`, которая относится к разделу карт. Таким образом, изображение не соответствует контексту страницы. Баг полностью подтверждён в исходном коде.

## 2. Валидация GENEALOGY-ID-INVALID-SPACE
🔴 **Подтверждено (Source-confirmed)**

**Анализ кода**:
В файле `data/genealogy/genealogy.json` найден идентификатор с ошибочным ведущим пробелом `" lud_shem"`. 

1. Ссылка в массиве детей Сима (`id: "shem"`, строка 403):
```json
      "children": [
        "arphaxad",
        "elam",
        "asshur",
        " lud_shem",
        "aram"
      ],
```

2. Определение самой сущности (строка 1395):
```json
    {
      "id": " lud_shem",
      "name": {
        "ru": "Луд",
        "he": "לוּד"
      },
```

**Вывод**: Ошибка самосогласована (пробел есть и в ссылке, и в определении), поэтому приложение не падает на этапе сборки/рендеринга (`Map` успешно матчит ключ). Однако это нарушает инварианты целостности графа и стандарты именования ID (отсутствие пробелов). Баг является латентным (скрытым) и полностью подтверждён в `HEAD cb3681e`.
