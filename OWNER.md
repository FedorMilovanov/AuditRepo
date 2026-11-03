# Ownership, contributor credit and authority boundaries

**Repository maintainer:** [FedorMilovanov](https://github.com/FedorMilovanov). This repository coordinates verification and work-selection artifacts for multiple projects, including material produced by independent auditors and AI agents.

## Attribution

- The maintainer owns the **workflow and curation** of the evidence workspace, its canonical operating process and repository integration decisions. Human-directed AI tooling is used; GitHub ownership does not mean every report or source line was written personally.
- Raw contributions retain attribution to their original auditor, tool, source, document or artifact where known. An agent's report is evidence to evaluate, **not automatically a confirmed Product fact**.
- Third-party software, archives, images and quoted documents retain their rights. The source repository and current release/CI authority remain with the Product owner; AuditRepo does not acquire them by mirroring an observation.
- Current user/provider data, credentials and private operational records must not be used as public portfolio examples. See [SECURITY.md](SECURITY.md).

## Who controls which facts

| Concern | Primary authority |
|---|---|
| Evidence lifecycle, active matrix, retirement rules | [AUDITREPO_OPERATING_MODEL.md](AUDITREPO_OPERATING_MODEL.md) |
| Independent witnesses and confidence | [MULTI_WITNESS_VERIFICATION_PROTOCOL.md](MULTI_WITNESS_VERIFICATION_PROTOCOL.md) |
| Safe concurrent multi-agent editing | [CONCURRENT_EDIT_PROTOCOL.md](CONCURRENT_EDIT_PROTOCOL.md) |
| Active project boundaries | [PROJECT_REGISTRY.md](PROJECT_REGISTRY.md) and individual project `DOC_MAP.md` |
| Evidence retention, archival/admission | [CLEANUP_RETENTION_POLICY.md](CLEANUP_RETENTION_POLICY.md) |
| Verified Product code, PRs, deployment and live facts | **Corresponding Product repository and its current source/CI**, never a stale AuditRepo report |
| Portfolio framing and limitations | [CASE_STUDY.md](CASE_STUDY.md) |

This document does not grant a new public license or change any research/audit authority. Report counts, agent counts, success percentages and deployment outcomes must have reproducible dated evidence before appearing as achievements.
