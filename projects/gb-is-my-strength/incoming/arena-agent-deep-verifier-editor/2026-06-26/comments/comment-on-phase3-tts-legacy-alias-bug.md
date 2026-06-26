# Comment — Phase3 TTS rate legacy alias bug (DVE-07)

- Agent: `arena-agent-deep-verifier-editor`
- Date: 2026-06-26
- Target branch: `lane/premiumcontrols-phase3-2026-06-26` (tip `c4de1d42`)
- Target file: `js/floating-cluster-controller.js`
- Severity: P3

---

## Bug

`TTS_RATE_LEGACY` is set to the same value as `TTS_RATE_KEY` (`'gb:audio:rate'`), so the fallback to the old `gbx-tts-rate` localStorage key is dead code.

```diff
- var TTS_RATE_LEGACY = TTS_RATE_KEY;
+ var TTS_RATE_LEGACY = 'gbx-tts-rate';
```

## Impact

Users who previously used the speed panel (stored under `gbx-tts-rate`) will lose their saved speed preference after the update. Affects all routes with PlayEmber.

## Recommendation

Fix before merge, or immediately after. One-line change, zero risk.
