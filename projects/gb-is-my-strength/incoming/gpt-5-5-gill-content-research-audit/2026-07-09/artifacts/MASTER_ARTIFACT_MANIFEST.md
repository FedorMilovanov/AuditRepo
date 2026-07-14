# Master artifact manifest — Gill content / research audit

## Authoritative artifact

```text
GILL_SERIES_FINAL_MASTER_AUDIT_ALL_FINDINGS_2026-07-09.md
```

## Integrity

- Format: UTF-8 Markdown
- Size: `431460` bytes
- Lines: `11557`
- Canonical finding IDs: `GILL-CONTENT-001…480`
- Missing canonical IDs: none
- Duplicate canonical headings: none
- SHA-256:

```text
86834ecb1f90775de6876c91cafab054450914b521291ad3dd7522823c612f14
```

## Compressed reference

- Codec: bzip2 level 9
- Compressed size: `85495` bytes
- Compressed SHA-256:

```text
d9123d8d8e0932fd97e7d2c95e8ae5b848e0613f6cdb44836c76a47a35a9e95b
```

## Repository transport note

The GitHub connector used for this intake accepts UTF-8 content strings but does not accept a mounted local file parameter. The 431 KB master was generated and integrity-checked locally; attempts to transport it as a large encoded payload were blocked by the connector safety layer. No partial or corrupt payload is retained in the branch.

The official intake therefore contains:

1. `REPORT.md` — governed verifier handoff and umbrella findings;
2. `working/GILL_CONTENT_RESEARCH_MATRIX_2026-07-09.md` — map/matrix;
3. proposal for canonical matrix integration;
4. this manifest with exact artifact identity and checksums.

The complete Markdown artifact was delivered to the repository owner as the downloadable ChatGPT artifact associated with this audit. A future agent with normal git/file upload access can place the byte-identical file at:

```text
projects/gb-is-my-strength/incoming/gpt-5-5-gill-content-research-audit/2026-07-09/artifacts/GILL_SERIES_FINAL_MASTER_AUDIT_ALL_FINDINGS_2026-07-09.md
```

and verify it with:

```bash
sha256sum projects/gb-is-my-strength/incoming/gpt-5-5-gill-content-research-audit/2026-07-09/artifacts/GILL_SERIES_FINAL_MASTER_AUDIT_ALL_FINDINGS_2026-07-09.md
```

Expected SHA-256:

```text
86834ecb1f90775de6876c91cafab054450914b521291ad3dd7522823c612f14
```

## No hidden status promotion

The artifact is an evidence corpus, not a canonical ledger. Its 480 findings include confirmed current-source defects, Research-only contradictions, source upgrades, disputed interpretations and HOLD items. Canonical promotion must follow the verifier proposal in this intake.
