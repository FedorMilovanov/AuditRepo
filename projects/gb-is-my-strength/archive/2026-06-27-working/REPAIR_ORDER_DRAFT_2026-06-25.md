# Repair order draft — gb-is-my-strength — 2026-06-25

**Status:** draft for verifier / implementation lead  
**Source:** incoming Arena Agent intake, 2026-06-25

## Proposed order

### Phase A — shared runtime first
1. Fix shared premium controller runtime crash (`qs is not defined`)
2. Re-run production-like browser verification on all affected premium routes

### Phase B — shared markup integrity
3. Remove duplicate IDs on Gill reusable controls (`gbsTheme`, `gbsSearch`)
4. Re-test mobile/desktop Gill pages after duplicate-ID cleanup

### Phase C — partial rollout ownership
5. Decide heart-series strategy:
   - either load premium controller,
   - or remove/disable premium markers until rollout is complete
6. Verify no legacy TTS suppression trap remains

### Phase D — route-level content/meta bugs
7. Remove Hermeneutics stray tail hash
8. Fix Hermeneutics hidden Pagefind readTime drift (`35` vs `50`)

### Phase E — audit/tooling cleanup
9. Update `interactive-audit` selectors for new premium theme controls
10. Update `interactive-audit` Gill context shell assumptions

### Phase F — source-layer hygiene
11. Resolve legacy/root cache-bust drift for `floating-cluster-controller.js`

## Important constraint

Do **not** start by fixing audit false positives before Phase A.
Many downstream audit lines are polluted by the shared runtime failure.
