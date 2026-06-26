# Evidence — P0: TTS has NO mouse-click start path

**Agent:** arena-agent-deep-verifier-editor  
**Date:** 2026-06-26  
**Source SHA:** `5d53913d`

---

## Bug description

There is **no way to start TTS playback via mouse click**. The Play button only opens/closes the speed panel. Speed selection only stores the rate. Neither action calls `handlePlayClick()` or `startTts()`.

## Click flow trace

```
1. User clicks gb-ember (Play button)
   → initPlayExpand handler fires (line 782)
   → e.preventDefault() + e.stopPropagation()
   → openPanel() — speed panel appears
   → handlePlayClick() is NEVER reached (blocked by stopPropagation)

2. User selects speed (e.g. 1.75×)
   → panel click handler fires (line 788)
   → localStorage.setItem('gb:audio:rate', speed) — rate stored
   → dispatches 'gb:tts-rate-change' CustomEvent
   → BUT gb:tts-rate-change listener (line 350) checks:
     if (!ttsState.utterance || ...) return;
   → Since TTS is idle, utterance is null → listener RETURNS immediately
   → setTimeout(closePanel, 240) — panel closes
   → startTts() is NEVER called

3. User clicks Play AGAIN
   → SAME flow: panel opens again
   → Infinite loop: click → panel → select → close → nothing plays
```

## Why handlePlayClick() is unreachable via click

```
initPlayExpand:    ember.addEventListener('click', ...) → e.stopPropagation()
initCluster:       root.addEventListener('click', ...)  → checks data-fc-action="play" → handlePlayClick()
```

`initPlayExpand` fires first (direct target) and calls `e.stopPropagation()`, preventing the event from bubbling to `initCluster`'s root handler. So `initCluster` never sees the click and never calls `handlePlayClick()`.

## Only paths to start TTS

1. **Keyboard shortcut 'T'** → `handlePlayClick()` → `startTts()`
   - But on pages without `data-fc-root` (Krajne/Rimlyanam root HTML), `initKeyboard()` is SKIPPED due to early return at line 582.
2. No other path exists.

## Impact

**ALL pages with speed panel**: clicking Play never starts TTS. User sees a beautiful speed panel, selects speed, but nothing plays. The feature is visually complete but functionally dead for mouse users.

## Fix (2 options)

### Option A: Speed select starts TTS if idle (minimal change)
Add after `setTimeout(closePanel, 240)` in panel click handler:
```javascript
var currentState = (qs('.gb-ember') || {}).dataset || {};
if (currentState.state === 'idle' || !currentState.state) {
  setTimeout(handlePlayClick, 280);
}
```

### Option B: First click starts TTS, long-press/second click opens panel
More complex but better UX: single tap toggles play/pause, double-tap or long-press opens speed panel.

### Option C: Speed panel stays open during playback
Click Play → open panel AND start TTS simultaneously. Panel shows progress ring while playing.

**Recommended:** Option A (smallest change, fixes the bug without UI redesign).

## Verification

After fix, verify:
1. Click Play → panel opens
2. Select speed → panel closes + TTS starts speaking
3. Click Play during playback → panel opens (speed change available)
4. Click Play with panel open during playback → panel closes (playback continues)
