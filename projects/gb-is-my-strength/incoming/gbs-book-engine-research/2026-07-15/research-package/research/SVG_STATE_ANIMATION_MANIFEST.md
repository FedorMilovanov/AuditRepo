# SVG / State / Animation Manifest

**Назначение:** не допустить переноса неполного прототипа в production. Каждый элемент связан с реальным источником в `gb-is-my-strength` или AuditRepo.

## 1. SVG inventory

| Элемент | Канонический источник | Контракт | Статус прототипа |
|---|---|---|---|
| Back | `GillSeriesMobileBar.astro` | `M19 12H5 / M12 19l-7-7 7-7` | ✅ |
| Home | `GillSeriesMobileBar.astro` | крыша + дом + дверь | ✅ |
| Help | owner-правка поверх learning slot | SVG circle + `?`, текст «Справка» | ✅ |
| Sun | `SingleArticleCluster.astro`, v2.9 | circle `r=4.5` + 8 лучей | ✅ |
| Moon | те же | `M21 12.8A9...` | ✅ |
| Search | `SingleArticleCluster.astro` | circle `r=7` + handle | ✅ |
| Play | `PlayEmber.astro` | `M7 4.8v14.4L18.5 12...` | ✅ |
| Pause | `PlayEmber.astro` | `M9 6v12M15 6v12` | ✅ |
| Complete | `PlayEmber.astro` | `M5 12.5l4.2 4.1L19 7` | ✅ |
| Play ring | `PlayEmber.astro` | SVG 100×100, `r=45`, C≈283, stroke 1.5 | ✅ |
| Save | `SaveButton.astro` | `M19 21l-7-5-7 5V5...` | ✅ |
| Settings | `GillSeriesMobileBar.astro` | canonical gear | ✅ |
| Share | `GillSeriesMobileBar.astro` | 3 nodes + 2 links | ✅ |
| Print/PDF | `mobile-toc-accordion-v5.html` | printer polyline/rect | ✅ |
| Previous/Next audio | player adapter | previous/next track SVG | ✅ |
| Dual progress | `GillSeriesMobileBar.astro` | outer `r=16`, inner `r=12.5` | ✅ |
| Chevron | TOC reference | `M6 9l6 6 6-6` | ✅ |
| Close | settings/reference sheets | crossed lines | ✅ |

## 2. PlayEmber state matrix

| State | Ring | Glyph | Motion | aria |
|---|---|---|---|---|
| `idle` | track visible | Play | none | «Озвучка» |
| `loading` | track visible | Play | `gb-ember-breathe` | «Подключение озвучки» при source landing |
| `playing` | animated progress | Pause | progress interpolation | «Пауза» |
| `paused` | retained progress | Play/Pause per source controller | no progress advance | «Продолжить озвучку» при source landing |
| `complete` | 100% | Check | `gbEmberIconPop` | «Озвучено» |

Прототип моделирует `idle → playing → complete`. Source landing сохраняет реальные `loading/paused` из controller.

## 3. Speed controls

### Mobile

Source: `GillSeriesMobileBar.astro` + v2.9.

```text
Help slot visible
  ↓ tap 1× badge
Help fades/slides left
Speed rail slides from right
Buttons enter with 20/50/80/110/140/170 ms cascade
  ↓ select/outside tap
Speed rail closes, Help returns
```

Touch target сохраняется ≥44 px через pseudo hit-area, визуальный размер остаётся компактным.

### Desktop

Source: `[data-gill-v16] .gbs-theme-corner .gb-ember-expand`.

- numbers bloom left from Play;
- no pill background;
- no chip borders;
- active rate uses accent colour;
- staggered spring entry;
- outside click closes.

## 4. Save states

Source: `SaveButton.astro` / `floating-cluster.css`.

| State | SVG | Motion |
|---|---|---|
| default | stroke only | none |
| saved | gold fill/stroke | `gb-save-bounce` + `gb-save-burst` |
| confirmation | bookmark toast | fade + spring translate |

Toast автоматически скрывается при открытии TOC/Help/Settings, чтобы не перекрывать sheets.

## 5. Theme states

| Theme | Quick icon | Settings | Surface |
|---|---|---|---|
| light | Sun | outlined active «День» | canonical paper |
| sepia | Sun (quick toggle остаётся binary) | outlined active «Сепия» | scoped sepia tokens |
| dark | Moon | outlined active «Ночь» | `html.dark` tokens |

Quick toggle — только Day/Night. Sepia — только Settings, как в source.

## 6. Sheet lifecycle

Общий прототипный helper моделирует source lifecycle:

1. сохранить trigger;
2. закрыть конкурирующий sheet;
3. `aria-hidden=false`;
4. scroll lock;
5. fade backdrop;
6. spring panel transition;
7. focus first control;
8. Tab/Shift+Tab trap;
9. Escape/backdrop close;
10. restore focus;
11. unlock scroll.

Применяется к Book TOC, Help и Settings.

## 7. Accordion motion

### Chapter

- grid-row `0fr → 1fr`;
- chevron rotation;
- current chapter tonal surface;
- scroll nearest after expansion.

### Article

- only one article expanded inside a chapter;
- nested TOC `0fr → 1fr`;
- article chevron rotation;
- current article progress subtitle.

### Section progress

- outer article nodes and nested section nodes use separate axes;
- center delta tested at 390/1440: `0 px`;
- passed nodes fill;
- current node gains minimal 2 px halo;
- line fill interpolates with scrollspy;
- `prefers-reduced-motion` removes transition.

## 8. Mobile chrome motion

Source: `initGillMobileTopBarAutoHide`.

- scroll down past 80 px hides top bar;
- scroll up reveals;
- top bar pinned while Play is active;
- pinned while Help/Settings/TOC is open;
- pinned while speed rail is open;
- pinned while focus remains inside top bar;
- scrolled state adds only a subtle hairline/depth cue.

## 9. Engine-specific negative contracts

### `series/flat`

Must not render chapter→article hierarchy.

### `series/book`

Must not create a second Play, Settings, theme or mobile runtime.

### `article`

Must not receive dual progress, Series TOC or Roman series marks.

### `page`

Must not receive Help, playback, save or reading progress by default.

## 10. Verification status

Current standalone prototype checks:

- required SVG presence;
- mobile speed morph and rate sync;
- desktop speed bloom;
- Save state + toast;
- modal scroll lock/unlock;
- theme SVG swap;
- mobile auto-hide/reveal;
- nested chapter/article/section accordions;
- outer and nested node/line axis alignment;
- queue player;
- no page errors.

Latest combined browser check: **PASS**.

## 11. Landing rule

Do not copy prototype CSS/JS wholesale. Port behaviours into existing owners:

```text
PlayEmber.astro
SaveButton.astro
GillSeriesMobileBar.astro
GillPartTocOverlay.astro
GillLearningSheet.astro
GillReaderSettingsSheet.astro
floating-cluster.css
floating-cluster-controller.js
```

Every ported state must gain a static contract or browser assertion before merge.
