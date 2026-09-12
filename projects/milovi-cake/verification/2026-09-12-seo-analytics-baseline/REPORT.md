# Milovi Cake — SEO / analytics current verification — 2026-09-12

## Exact anchors

- Product `main`: `b65c5329e1c8a7bedf366697074db98e277fee42`
- Production release witness: live `release.json` matched the same SHA.
- Product tracking issues: #82 (analytics key event), #84 (wedding-page settled-data review).

## Verified repair closed in this wave

The suburb sitemap-freshness problem was repaired at its owner rather than by one-off timestamp edits:

- authoritative per-suburb `lastmod` now lives in `prigorody/_cities.csv`;
- fail-closed source↔sitemap synchronization is part of QA;
- 13 stale suburb entries were corrected to substantive source-change date `2026-09-06`;
- Murino remained `2026-09-12`;
- exact GitHub CI passed before merge;
- GitHub Pages production deployed the exact merged SHA;
- production IndexNow submission of all 29 URLs returned success from IndexNow, Bing and Yandex.

This root is closed and therefore absent from MASTER.

## Search baseline

Full URL Inspection tracker coverage: 29/29 production sitemap URLs.

At the audited boundary:
- 16 indexed;
- 7 `Discovered - currently not indexed`;
- 5 `URL is unknown to Google`;
- 1 `Crawled - currently not indexed`.

These states are not automatically page-code defects. Sampled current pages had healthy terminal URLs, self-canonicals and indexable robots state.

## Analytics baseline

GA4 property `537251354` is aligned with production Measurement ID `G-94ZZ5B8YNY`, web stream `14860814056`, hostname `milovicake.ru`.

For the audited 180-day window GA4 reported 853 sessions, 744 active users and 3,676 events. Production now emits `generate_lead`, but no real `generate_lead` event had appeared by the final 2026-09-12 check. Therefore Product #82 remains measurement/control-plane follow-up rather than a current code defect.

## Disposition

- Mandatory current Product defects admitted to MASTER: **0**.
- Measurement/wait-state items: parked in `WORK_QUEUE.md`.
- Future promotion requires fresh exact-current evidence.
