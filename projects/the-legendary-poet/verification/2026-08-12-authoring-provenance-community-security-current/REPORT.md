# Current Verification — authoring provenance and community SQL security

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

This wave intentionally tests two surfaces that can produce false positives if read incompletely:

1. whether the documented new-poet producer path actually closes image existence/provenance before publication;
2. whether the public community Supabase schema exposes base tables or stable `voter_id` values directly to anonymous clients.

## 1. CONFIRMED manifestation — new-poet workflow has no portrait existence/provenance release gate

### Root provenance policy exists and is meaningful

`public/images/PROVENANCE.yml` declares `scope: public/images` and distinguishes:

- archival originals;
- local project/editorial artwork;
- restoration/reconstruction;
- `PENDING-GENERATION-RECORD` as an honest follow-up state rather than rights clearance.

For selected approved essay reconstructions the project has a strong fail-closed pattern: `validate-essay-covers.ts` pins path, byte count, SHA-256, alt/credit and requires the matching asset/SHA to appear in root provenance.

That is a good internal reference.

### But canonical poet production uses a different weaker path

`scripts/new-poet.ts` scaffolds:

```ts
photo: '/images/${id}.jpg', // TODO: add image to public/images/
```

After generating the module it tells the author to:

- add import/catalog registration;
- follow `POET_AUTHORING_GUIDE.md` §9;
- run `validate-library.ts`.

The guide’s publication checklist requires only:

`Изображение существует по указанному пути либо отсутствие сознательно обработано`

It does not require:

- a provenance row;
- origin class;
- source/rights/credit record;
- SHA-256;
- reconstruction/editorial classification.

`validate-library.ts` is weaker still: it validates identity, dates, prose, poem text, ratings, testimonies and references, but does **not** validate `poet.photo` existence or provenance at all.

Thus the standard documented new-poet flow can add a canonical portrait path and satisfy its printed `validate-library` step without proving either that the file exists or how the visual should be classified.

### `validate-poet-authority` compounds producer drift

`validate-poet-authority.ts` hardcodes the current ten canonical poet imports/files and requires published poet count to equal that hardcoded list.

A new poet therefore needs an additional manual validator edit that `new-poet.ts` does not mention in its printed next steps. This is already part of the broader producer/consumer contradiction represented by the active authoring root.

### Disposition

No new ID. Absorb into existing **`TLP-AUTHORING-ID-001`**, broadening its terminal contract from identity alone to the complete canonical authoring release boundary:

- deterministic valid IDs/files/routes/community identity;
- exact required editorial fields;
- portrait existence;
- portrait provenance classification/credit/source or explicit local-editorial record;
- canonical-authority registration without a hidden hardcoded second catalog;
- one documented command/check path that exercises all required consumers.

Do not claim current canonical poet portraits are AI/reconstructions. This wave proves only that the producer/release system cannot machine-classify or require their origin.

## 2. RETRACTED — anonymous clients do not have direct base-table read/write access in the current SQL source

A superficial read of the public guest community API can suggest that anonymous users may query or mutate base tables. The complete current schema disproves that.

`docs/community-schema.sql`:

- enables RLS on `tlp_ratings`, `tlp_comments`, `tlp_comment_votes`;
- `revoke all` on all three base tables from `anon, authenticated`;
- revokes default/public execute on the three write functions;
- grants anonymous/authenticated users only:
  - `select` on three deliberately shaped public views;
  - `execute` on the three security-definer RPCs.

The public views do not expose `voter_id`:

- `tlp_ratings_public` selects id/target/scores/created_at;
- `tlp_comments_public` selects published comment content/helpful count without voter identity;
- feedback summary is aggregate-only.

Therefore the following candidate findings are **invalid on current source** and must not enter MASTER:

- “anon can directly insert/update/delete base feedback tables”;
- “public read API exposes the stable voter UUID”;
- “RLS is absent from community tables”.

Guest RPC execution itself is intentional product behavior and not a privilege bug merely because registration is not required.

## 3. Existing community security roots remain real and separate

The good privilege boundary does not close known application-level integrity defects already owned elsewhere:

### `TLP-COMM-ABUSE-001`

The write RPCs still accept caller-provided `p_voter_id`, and target IDs are syntax-checked rather than checked against a canonical published target registry. The comment rate-limit check is also a separate SELECT-before-INSERT window rather than an atomic throttle.

Those remain abuse/integrity problems despite correct table privileges.

### `TLP-COMM-DELIVERY-001`

`tlp_submit_comment` checks the 20-second voter rate limit **before** the final insert with `on conflict (id) do nothing`. A genuine retry of the same logical comment can therefore be rejected by the rate-limit path before its idempotency/no-op insert is reached. This remains delivery/idempotency ordering, not a privilege issue.

Client/server Unicode/length semantics and retry state remain owned by the same delivery root.

## 4. Audit-harness gap — current community hardening test does not certify SQL privileges

`validate-community-hardening.ts` is useful, but its current scope is client/store behavior:

- repair malformed local voter identity;
- discard malformed persisted operation;
- flush a valid operation behind poison state;
- preserve rating baseline semantics across pending edits;
- verify deferred poem community reads.

It does not parse/assert `docs/community-schema.sql` privilege invariants such as:

- RLS enabled on all three base tables;
- `revoke all` from anon/authenticated on base tables;
- public views omit `voter_id`;
- execute is granted only on intended RPCs;
- security-definer functions retain a fixed safe search path.

The current SQL source is good on these points, but the regression harness would not detect an accidental future privilege widening.

### Disposition

Strengthen existing **`TLP-AUDIT-004`**, not Product bug count:

- add source/schema privilege-contract validation;
- ideally also exercise a disposable database/Supabase test environment when one becomes available, proving anon cannot select/insert base tables while public views/RPCs still work;
- never infer deployed database grants from repository SQL alone — deployed Supabase state remains an external evidence boundary.

## 5. Provenance completeness policy boundary

Several current project artwork rows are explicitly `PENDING-GENERATION-RECORD`. The provenance policy itself says this is an honest queue and **not** rights clearance.

This audit does not reclassify those assets as illegally published or fabricated evidence. For project-created artwork, the file records `source_use: not_primary_evidence`; approved essay reconstructions are separately pinned.

The real engineering gap is producer completeness for canonical poet visuals, not the existence of the `PENDING` state itself.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| `new-poet` creates portrait path but no provenance step | existing `TLP-AUTHORING-ID-001` |
| authoring guide requires existence but not provenance | same authoring root |
| `validate-library` does not validate `poet.photo` existence/provenance | same authoring root |
| `validate-poet-authority` hardcodes ten files and new-poet does not mention update | same authoring root |
| approved essay reconstruction provenance is strongly pinned | good reference, not defect |
| current PENDING project-artwork provenance rows | honest queue, not promoted |
| anon direct base-table access | **retracted / false on current source** |
| public voter_id exposure | **retracted / false on current source** |
| caller-controlled voter identity / target spam | existing `TLP-COMM-ABUSE-001` |
| rate-limit-before-idempotency retry issue | existing `TLP-COMM-DELIVERY-001` |
| no permanent SQL privilege regression | strengthen `TLP-AUDIT-004` |
| actual deployed Supabase grants/state | evidence boundary, not inferred from repo SQL |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: **0**.
- Existing roots strengthened: `TLP-AUTHORING-ID-001`, `TLP-AUDIT-004`.
- Security false positives explicitly retired: direct anon base-table access, public voter UUID exposure, missing RLS.
