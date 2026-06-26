# PlayEmber Speed Morph — UI spec v2.0

Reference images:
- `../screenshots/speed-pill-desktop.png` — Desktop / single-anchor
- `../screenshots/speed-pill-mobile-gbs.png` — Mobile / GBS / Gill-rail

Replaces all chat screenshots, PDF pages, and v16 probe visuals.

---

## 1. Desktop — single-anchor / series-lite

Visual: horizontal gold pill, Play circle on the RIGHT edge.

```
┌──────────────────────────────────────────────────┐  ┐
│  0.75×  1×  1.25×  1.5×  [1.75×]  2×       [▶]  │  │ pill
└──────────────────────────────────────────────────┘  ┘
  ← speed buttons expand LEFT from Play circle
```

- Pill background: `#faf8f3` / dark `#1e1c19`
- Gold border: `1.5px solid rgba(200,165,110,.55)`
- Shadow: `0 8px 28px rgba(0,0,0,.13), 0 2px 6px rgba(0,0,0,.06)`
- Backdrop-blur: `10px`
- Border-radius: `999px` (full pill), Play circle slightly protrudes
- Speed buttons: pill shape, `border: 1px solid rgba(0,0,0,.08)`, active = `background: linear-gradient(135deg, #c9a16a, #b8874a); color: #fff; font-weight: 600`
- Play circle: `48×48px`, white bg, `box-shadow: 0 2px 10px rgba(0,0,0,.12)`, glyph `▶` 14px
- Spacing: pill padding `10px 56px 10px 14px` (right padding reserves Play circle)
- Animation open: `clip-path: circle(24px at calc(100% - 28px) 50%) → clip-path: inset(0 round 999px)`, `260ms cubic-bezier(.2,.8,.2,1)`
- Speed buttons cascade: `opacity 0→1 + translateX(8px→0)`, stagger 25ms right-to-left
- Close: reverse, 180ms

States:
- **idle**: Play `▶`, ring `--p:0`, `aria-label="Озвучка"`
- **playing**: Pause `❙❙`, ring animates `--p: 0..1`, `aria-label="Пауза"`
- **paused**: Play `▶`, ring frozen at current `--p`, `aria-label="Продолжить озвучку"`
- **complete**: Check `✓`, ring `--p:1`, `aria-label="Прослушано"`

Progress ring:
- SVG: `<circle r="45" stroke-dasharray="283" stroke-dashoffset="283 * (1-p)">`
- CSS: `.gb-ember__ring-progress { stroke-dashoffset: calc(283 * (1 - var(--p, 0))); transition: stroke-dashoffset .15s linear }`
- Color: `var(--ring-color, #d8aa6d)`

---

## 2. Mobile / GBS / Gill-rail (< 900px)

No horizontal space in sidebar → pill expands **UP**.

```
    ┌────────────────────────┐
    │ 0.75× 1× 1.25×        │
    │ 1.5× [1.75×] 2×       │
    └──────────┬─────────────┘
               [▶]
```

- Same gold styling, backdrop-blur 16px
- Scrim behind: `background: rgba(0,0,0,.12); backdrop-filter: blur(2px)`
- Panel: `position: absolute; bottom: calc(100% + 8px); right: 0; max-width: min(92vw, 100vw - 32px)`
- Clip-path: `circle(24px at 50% calc(100% - 24px)) → inset(0 round 20px)`
- Speed buttons wrap to 2 rows if < 360px
- Runtime viewport guard: rAF shift left if panel would overflow right edge
- Tap outside / Esc → close

All other states / ARIA / storage identical to desktop.

---

## 3. ARIA / keyboard

```html
<button class="gb-ember"
  data-fc-action="play"
  data-state="idle"
  aria-label="Озвучка"
  aria-haspopup="true"
  aria-expanded="false"
  aria-controls="gb-ember-speed-{uid}">
  <!-- ring SVG + glyphs -->
</button>

<div id="gb-ember-speed-{uid}" class="gb-ember-expand" role="dialog" aria-label="Скорость озвучки" hidden>
  <button role="radio" aria-checked="false" data-speed="0.75">0.75×</button>
  <button role="radio" aria-checked="false" data-speed="1">1×</button>
  <button role="radio" aria-checked="false" data-speed="1.25">1.25×</button>
  <button role="radio" aria-checked="false" data-speed="1.5">1.5×</button>
  <button role="radio" aria-checked="true"  data-speed="1.75">1.75×</button>
  <button role="radio" aria-checked="false" data-speed="2">2×</button>
</div>
```

Keyboard:
- Play focused, Enter/Space → open
- ← / → : change speed
- Enter / Space on speed button → apply + close
- Esc → close, focus returns to Play
- Tab traps inside panel while open

---

## 4. Storage / events

```js
const TTS_RATE_KEY = 'gb:audio:rate'
const TTS_RATE_LEGACY = 'gbx-tts-rate'

function getRate() {
  return parseFloat(
    localStorage.getItem(TTS_RATE_KEY) ??
    localStorage.getItem(TTS_RATE_LEGACY) ?? '1'
  ) || 1
}
function setRate(r) {
  localStorage.setItem(TTS_RATE_KEY, String(r))
  document.dispatchEvent(new CustomEvent('gb:tts-rate-change', {detail:{rate:r}}))
}
```

---

## 5. TTS engine

- `window.speechSynthesis`
- `lang = 'ru-RU'`
- Chunk text: split by `/(?<=[.!?])\s+/`, buffer ≤ 220 chars
- `utterance.rate = getRate()`
- `onend`: `spokenChars += chunk.length; progress = spokenChars / totalChars; nextChunk()`
- Rate change mid-playback: `speechSynthesis.cancel(); speakNextChunk()` — no position loss
- Pause/Resume: `speechSynthesis.pause()` / `.resume()`
- Stop: `speechSynthesis.cancel(); progress = 0; state = idle`

Fallback chain:
1. `window.GBAudio.toggle()` if exists
2. `window.speechSynthesis`
3. toast "Браузер не поддерживает озвучку" — only this, never "Озвучка ещё не подключена"

---

## 6. Visual parity checklist

- [ ] Desktop pill: gold border, backdrop-blur, Play right, 0.75×..2× left-to-right, active gold fill
- [ ] Open animation: morph from Play circle, 260ms, cascade stagger
- [ ] Pause state: ❙❙ glyph, ring progresses 0..1
- [ ] Mobile: pill up, blur scrim, wraps at 360px, viewport guard
- [ ] No "Озвучка ещё не подключена" toast on any click path
- [ ] Speed persists `gb:audio:rate`, legacy `gbx-tts-rate` read
- [ ] ARIA attributes coherent at all times
- [ ] Matches `speed-pill-desktop.png` / `speed-pill-mobile-gbs.png` within 4px

---

Source of truth. No other screenshots valid.
