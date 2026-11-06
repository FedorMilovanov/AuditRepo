# Next agent — continue from durable V26, without re-opening old regressions

1. Read V26 README, reference HTML, DECISIONS, BUGS-AND-QA and PRODUCT-ROLLOUT. V25 and earlier are historical only, not latest visual truth.
2. Recheck Product HEAD, open PRs, lane locks, release witness and canonical scripts. Last snapshot: Product main 717efc5, Library V3 #2283 merged/CI green, independent print #2269 and deps #2268; never assume immutable status.
3. Reproduce the two user-visible V26 defects on V25 if useful: short TOC **14px at 900×300** and browser Back to blank hash retaining wrong section. V26 has ≈109px + restored selection. Confirm five footer actions and same-height toggles; final Chromium test 146/146 standalone checks.
4. Before Product mutation, record real-reader screenshot/DOM/anchor baselines for standalone, Gill and Baptists plus unchanged mobile. Protect four VERTICAL SVGs, original Gill ribbons and exact slugs/anchors.
5. First Product PR = pure typed adapter and tests. Second, after approval = ONE desktop-only reversible feature-flag pilot. Do not install second library, search, theme, TTS, overlay or scroll owner. Never copy demo paragraphs/storage/hash engine into production.
6. Demand current production-like Astro build and Chromium/Firefox/WebKit green at exact PR head, visual compare & reload/backup proof, then staged wider rollout. Update AuditRepo again only with newly verified evidence and Product SHA; do not create proliferating branches.

**If you find a new issue, reproduce it before styling around it. Save measurements and a focused regression test.**
