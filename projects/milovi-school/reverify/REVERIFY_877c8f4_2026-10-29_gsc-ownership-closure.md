# MS-GSC-OWNERSHIP-001 current closure

**Product main:** `877c8f47ef54277bdb0edb4b0b9f03b888ecb170`  
**Product issue:** `FedorMilovanov/Milovi_School#32` — CLOSED 2026-10-28

The owner closure receipt supersedes the September ownership-blocked state:

- direct Search Console API reads now succeed for `https://french.milovicake.ru/`;
- homepage URL Inspection is PASS / Submitted and indexed;
- 28-day performance data is readable;
- all 166 unique sitemap URLs were inspected without API failure: 127 PASS/indexed and 39 NEUTRAL/crawled-not-indexed;
- live robots advertises the live sitemap index, which points to a 166-URL child sitemap;
- explicit sitemap mutation remains unavailable to the connector's readonly OAuth scope, but Google documents robots discovery as the free fallback and that contract is already live.

The original root was Search Console ownership/read access. It is closed. The 39 crawled-not-indexed URLs are an editorial/indexing outcome, not proof that ownership or crawl delivery remains broken; they require a new current necessity witness before admission.
