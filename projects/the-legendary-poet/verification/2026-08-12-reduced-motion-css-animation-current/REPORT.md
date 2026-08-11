# Current Verification — reduced-motion CSS animation contract

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

No competing open Product issue was found for this motion-preference mechanism.

## Accessibility authority and severity boundary

The application already treats the operating-system reduced-motion preference as a product contract:

- root `MotionConfig` uses `reducedMotion="user"` for Framer Motion;
- `TiltCard` explicitly disables pointer-driven tilt when `(prefers-reduced-motion: reduce)` matches;
- View Transition animations are disabled under reduced motion;
- reading-chrome transitions are explicitly removed under reduced motion.

W3C documents `prefers-reduced-motion` as a technique for suppressing non-essential CSS/JavaScript motion for users who request it. WCAG 2.2 also requires a pause/stop/hide mechanism for certain automatically starting motion/blinking that lasts more than five seconds unless essential.

Official references:

- https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- https://www.w3.org/TR/WCAG22/#pause-stop-hide

This report does **not** claim every spinner or status pulse is automatically a WCAG failure. It records an inconsistent current product preference contract, with the clearest defect being non-essential perpetual decoration that ignores the same preference respected by the rest of the motion system.

## 1. CONFIRMED — Tailwind animation utilities bypass the app’s reduced-motion owners

### Poet cards

Every `PoetCard` renders the editorial-rating star as:

```tsx
<Star ... className="text-luxury-gold fill-luxury-gold animate-pulse" />
```

The pulse is:

- automatic;
- decorative emphasis rather than required state communication;
- present while the card remains rendered;
- not gated by `motion-reduce:*` or a `prefers-reduced-motion` media rule.

`TiltCard`, immediately around the same card, correctly disables its more complex pointer motion for reduced-motion users. The star therefore continues moving inside a card whose main animation system has intentionally been flattened.

This is a direct current preference mismatch.

### Audio surfaces

`GlobalMiniPlayer` and `FeaturedTrackPlayer` also use unguarded Tailwind animations:

- playing status dot: `animate-pulse`;
- loading icon: `animate-spin`.

The playing pulse is tied to a meaningful playback state and can indirectly stop when playback is paused, so it is not treated as identical to the always-decorative PoetCard star. The loader communicates an active operation and may also be legitimately animated.

However both demonstrate the architectural gap: **Tailwind/CSS animation utilities live outside the reduced-motion contract used by Framer, TiltCard and View Transitions.** There is no shared rule that distinguishes essential state feedback from suppressible decoration.

## 2. Existing reduced-motion work is good but incomplete

`src/index.css` explicitly disables:

- site-header/mobile-dock/reading-progress/ScrollToTop/palette/section-chip transitions under reduce;
- all View Transition snapshot animations under reduce.

`TiltCard` reads the media query in JavaScript and resets transforms when reduce becomes active.

The defect is therefore not “reduced motion is unimplemented”. It is **split ownership**: framework-driven and hand-authored motion respects the preference, utility-driven CSS animation may not.

## 3. Root cause

**Motion capability is decided independently by multiple styling/runtime systems.** Framer Motion, pointer tilt and selected CSS transitions have reduced-motion owners, while generic Tailwind animation utilities have no fail-closed policy.

That makes future `animate-*` additions easy to ship outside the accessibility preference contract.

## 4. Disposition

New active root: **`TLP-A11Y-MOTION-001` / P3**.

Required terminal outcome:

- define one motion-policy contract for CSS utilities as well as Framer/JS motion;
- non-essential infinite/persistent decoration must become static when reduced motion is requested;
- essential state communication must remain understandable without relying solely on animation and should use the least motion necessary;
- prefer opt-in animation under `motion-safe:` / `prefers-reduced-motion: no-preference` or a global semantic animation token rather than auditing class strings forever;
- ensure a runtime preference change also settles any JS-owned motion already in progress.

Minimum current fixes should cover:

1. PoetCard rating-star pulse;
2. audio playing-status pulse;
3. loading spinners, with an explicit decision that their state remains perceivable if animation is suppressed.

## 5. Audit-harness impact

Existing **`TLP-AUDIT-004`** should gain a reduced-motion browser contract that checks computed animation state, not only screenshots or Framer configuration:

- emulate `prefers-reduced-motion: reduce`;
- open `/poets` and assert the rating star has no continuing animation;
- start a playable track and assert non-essential playback decoration is static while textual status still communicates `Сейчас звучит`;
- force a loading state and verify the control remains understandable with reduced/suppressed loader motion;
- retain current checks that View Transitions and pointer tilt are suppressed.

The validator should target semantic motion roles rather than forbid every CSS animation globally.

## 6. Explicit non-promotions

- Framer Motion route/page effects are not a defect here; root `MotionConfig reducedMotion="user"` already owns them.
- TiltCard is not a defect; it explicitly handles reduced motion and forced colors.
- View Transitions are not a defect; reduce-mode CSS disables them.
- A transient loading spinner is not automatically classified as an independent WCAG failure by this report.
- This root is P3 because the clearest current witness is accessibility preference inconsistency/non-essential persistent motion, not loss of core functionality.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| PoetCard perpetual decorative `animate-pulse` ignores reduce | new `TLP-A11Y-MOTION-001` / P3 |
| Audio status `animate-pulse`/loader `animate-spin` outside shared policy | same root, severity/context differs |
| Framer reducedMotion user | good current owner, not defect |
| TiltCard reduce handling | good current owner, not defect |
| View Transition reduce handling | good current owner, not defect |
| no computed CSS-animation reduced-motion regression | strengthen `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 1 P3.
- Existing root strengthened: `TLP-AUDIT-004`.
