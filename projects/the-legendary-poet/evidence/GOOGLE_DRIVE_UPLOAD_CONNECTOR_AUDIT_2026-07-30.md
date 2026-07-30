# Google Drive upload connector audit — 2026-07-30

## Status

**Google Drive replication is not completed.** The project archives remain protected in ChatGPT Library and GitHub manifests while the Drive connector is unavailable.

## Evidence reviewed

- ChatGPT Google Drive plugin settings screenshots;
- Google Account third-party connection screenshots for `oldpoet2025@gmail.com`;
- live ChatGPT connector calls;
- Research PR #52 and its 46-link official-source audit;
- OpenAI Help/Status and Google Drive/OAuth documentation;
- actual small-file, large-ZIP and Library transfer behavior during the archive build.

## Confirmed facts

1. Google Drive has an app-specific ChatGPT permission override: **Allow all actions**.
2. The Google account screenshot confirms the identity `oldpoet2025@gmail.com`.
3. The Google third-party connection summary lists only account linkage and basic profile information; it does not list access to Drive files.
4. Therefore the screenshot is consistent with Google sign-in/basic-profile OAuth and does not prove a live Drive-file scope.
5. The current Google Drive tool fails before folder search or upload with a system-level disabled-tool response.
6. No Google API request, Drive quota check or destination-folder lookup occurs in that failure path.
7. A 336 MB aggregate ZIP was too large for one intermediary transfer, while individual PDFs were successfully stored in ChatGPT Library.
8. Google Drive itself documents resumable uploads and file limits far above 336 MB; the practical large-file issue is in the intermediary connector/runtime, not Drive's maximum size.
9. Research CI checked 46 official OpenAI and Google URLs: 46 HTTP 200, zero request failures and zero dead setup/documentation links.

## Root-cause ranking

| Rank | Cause | Confidence |
|---:|---|---|
| 1 | No active Drive-file OAuth grant is visible for the connected Google account | High |
| 2 | Google Drive connector runtime is disabled/unavailable in the active ChatGPT session | High |
| 3 | OAuth connection predates the 2026 unified Drive write scopes and needs reconnection | High |
| 4 | Plus-plan, rollout, region or surface capability gate | Medium |
| 5 | Stale/revoked OAuth token while the connection remains listed | Medium |
| 6 | Temporary connector/files/Library infrastructure fault | Medium |
| 7 | Large-file single-request proxy timeout or transfer cap | Medium for large ZIPs |
| 8 | Google Drive storage quota | Low for the observed disabled-tool response |

## Permission-layer distinction

The following are independent and must not be conflated:

- plugin installed;
- plugin assigned/available to the user;
- ChatGPT confirmation policy set to Allow all actions;
- Google account linked for sign-in;
- Google Drive OAuth scopes granted;
- connector runtime enabled;
- live file reference available;
- provider upload accepted.

The current screenshots prove only some of these layers.

## Required recovery test

After disconnecting and reconnecting Google Drive, the Google consent/connection summary must explicitly include Drive file access. Then test:

1. list My Drive root;
2. create `CHATGPT DRIVE WRITE TEST`;
3. upload a 1 KB text file;
4. upload a 1 MB ZIP;
5. rename/move the text file;
6. delete the test folder.

Do not start bulk replication until all six steps pass.

## Safe archival state

- 40-PDF strict corpus: stored in ChatGPT Library with rights/SHA manifests.
- 63-item approved ephemera corpus: stored in ChatGPT Library.
- 45 approved core-poet portrait references: stored in ChatGPT Library.
- second 40-PDF editorial corpus: being stored as individual PDFs because the 336 MB aggregate ZIP failed.
- GitHub: reproducible code, manifests, source URLs, rights decisions and audits.
- Google Drive: pending connector recovery.

## Governing decision

Do not report Google Drive upload as completed until a Drive file ID and parent folder ID are returned by a successful write action. A connected-account screenshot or permissive ChatGPT action setting is insufficient evidence.
