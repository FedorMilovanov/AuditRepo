# Proposal — SD-14 GATE + DRAW verdicts on 2273b8c9

- Target: GATE-P1-01, GATE-P1-03, GATE-P1-04, DRAW-P1-02
- Proposal type: reverify triage (data-sync / matrix-freshness; SHA-first)
- Current state (direct source on 2273b8c9):
  - GATE-P1-01 PARTIALLY FIXED: validate-map-routes.js now checks meta.id/era, duplicate place/story ids,
    coord bounds (x<-250|x>2200, y<-250|y>1600), stage outside stages[], signatures. Data-level
    false-greens largely addressed; browser JS-crash detection unchanged (smoke:maps -> map-browser-smoke.js).
  - GATE-P1-04 FIXED candidate: dist-smoke-audit.js has ignoreLocalNoise() filtering CSP/yandex/favicon.
  - DRAW-P1-02 STILL OPEN: base-geo.svg has 5 duplicate path 'd' values (doubled river-line effect).
  - GATE-P1-03 browser/CI class (no standalone atlas:gate npm target; needs CI/browser reverify).
- Proposed action: verifier closes GATE-P1-04 with evidence; reclassify GATE-P1-01 (data-level fixed,
  keep browser JS-crash part open or split); keep DRAW-P1-02 open (browser confirm); GATE-P1-03 into
  browser reverify lane.
- Evidence: `../evidence/sd14_gate_draw.txt`
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
