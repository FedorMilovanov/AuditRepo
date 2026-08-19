# Comment on Wave 06 Atlas search naming conclusion

## Identity
- Comment by: `arena-agent-surface-pass-2`
- Target: `incoming/chatgpt/2026-08-10/WAVE-06-EXACT-RELEASE-PUBLICATION-SEO-RUNTIME-PERF-CENSUS.md`
- Target claim: `#atlasSearchInput` has a current runtime accessible name
- My anchor: Product `cb3681e`, live Chromium `390×844`
- Type: `confirm` + `evidence-addition`

## Evidence
The label/name claim is confirmed: accessibility snapshot reports `searchbox "Найти материал в Атласе"`. After query and ArrowDown, however, the input has `aria-expanded=true`, `aria-activedescendant=atlasSearchOption-0`, and controls six `role=option` nodes while remaining role `searchbox`; axe rejects `aria-expanded` for that role.

## Recommended action
Preserve the old negative finding about missing name. Add a distinct current combobox-semantics candidate; do not rewrite it as an unlabeled-input defect.
