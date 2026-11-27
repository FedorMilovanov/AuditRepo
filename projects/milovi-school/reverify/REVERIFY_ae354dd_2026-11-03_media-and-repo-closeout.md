# Reverify — Milovi School media, release and repository closure (2026-11-03)

**Attested at:** `2026-11-03T18:07:10Z`  
**Product authority:** `FedorMilovanov/Milovi_School` `main@ae354ddfd56c4193e72d46186c562c02421c2c5e`  
**Production:** https://french.milovicake.ru/  
**AuditRepo owner:** `projects/milovi-school/` (this reverify, evidence-bound snapshot).  
**Related Product PR:** [#51](https://github.com/FedorMilovanov/Milovi_School/pull/51) (merged); the preceding dependency advisory [#52](https://github.com/FedorMilovanov/Milovi_School/pull/52) was merged separately.

## Independent closure witnesses

1. **Product source and CI:** [exact-main CI run 41688838173](https://github.com/FedorMilovanov/Milovi_School/actions/runs/41688838173) returned `completed / success`. Protected `main`, merged #51, zero open Product PRs and zero open Product issues at the check.
2. **Release:** [deploy run 41688838125](https://github.com/FedorMilovanov/Milovi_School/actions/runs/41688838125) returned `completed / success`, including build of the exact source, deployed live-SHA proof, release-proof status publication and IndexNow notification. Independently retrieved `https://french.milovicake.ru/release.json` from the owner's Windows host: `sha=ae354ddfd56c4193e72d46186c562c02421c2c5e`.
3. **Live image artifact identity:** direct HTTP 200 byte-stream SHA-256 checks on the deployed image paths (cache-busted requests; no downloaded file left on the machine):

| Live asset | Bytes | SHA-256 matched |
|---|---:|---|
| `/images/articles/recipe-savarin.webp` | 230,750 | `7600421D88C6C9AF69EF045D1EE3B20F1203E0A1F6065193B796F437CBF2A687` |
| `/images/articles/recipe-pain-perdu.webp` | 261,036 | `A0C9F8D0319A7DB8B71CA32CBE9104C65B5C13C0BE98DBDA0D774DEC0074E7BB` |
| `/images/articles/michalak-fantastik.webp` | 89,854 | `D6C5BAFB74994AC55FF7ACBEBA6457E0B3DAD7AEA508F36186EF37A89047E259` |

4. **Actual browser:** three article routes `/articles/recipe-savarin/`, `/articles/recipe-pain-perdu/`, `/articles/michalak-fantastik/` each returned HTTP 200 in Chromium, resolved the named `img`, decoded `naturalWidth > 0` at expected dimensions (1695×928, 1695×928, 1280×800). All three accessible names explicitly identify the image as editorial AI illustration. **Browser failures 0/3**.
5. **Image corpus:** first-pass contact-sheet review of all 248 rasters under `public/images` plus six `src/assets` editorial JPEGs; two browser/PWA icons are additional non-dessert rasters. **256 source/build-time raster assets** overall, including the deliberately ignored, hash-pinned Canon gateway hero materialized from committed chunks. **223/223** article image dimension registry records matched files and actual image sizes. See the [Product audit report](https://github.com/FedorMilovanov/Milovi_School/blob/ae354ddfd56c4193e72d46186c562c02421c2c5e/docs/IMAGE_SEMANTIC_AUDIT_2026-11-03.md), which carefully limits the scope of claims: this is not 256 individually authenticated photographs of original chef creations.
6. **Security:** after Product #52, full `npm audit` on the updated dependency lockfile returned exit code 0: `info=0, low=0, moderate=0, high=0, critical=0, total=0`. No forced incompatible package upgrade.

## Branch and local-disk hygiene

- Removed **14 identical fully ancestral Canon refs** (all identical at `5eb9b78...`) and **three redundant React-ref aliases** while preserving their unique historical SHA through one canonical React archive.
- GitHub automatically removed the merged image PR branch. Remaining Product refs at this snapshot: `main`, historical `agent/editorial-zero-defects`, and historical `fix/react-19-ssr-root-cause-final`. Their unique old commits are *not* treated as an active code defect or deleted without forensic evidence.
- Forensic screening reconstructed the August editorial archive: an intact XZ patch (expected SHA-256 `c638595c175d13afbfcb742721743cecca3ad813f3c46ff5b3b71afe10e9a36c`) targeting old dependency files and article content. Of 254 significant added lines, **227** had exact current-source matches; the remaining 27 require semantic/contextual comparison if salvage is undertaken, not blind application to the modern Product. The old React compressed payload did not validate as a current usable tar archive. Preserve both distinct historical branches; their existence is not evidence of a current bug.
- Original Windows project `C:\Users\Fedor\Projects\Milovi_School` was fast-forwarded to the exact released SHA, clean worktree. Temporary Git worktrees, audit contact sheets, transfer images/scripts and validation logs created for this work were removed. No global Node switch was forced.

## Search Console and conclusion

`MS-GSC-OWNERSHIP-001` remains closed by the already recorded 2026-10-28 successful API reads and 166-URL inspection ([earlier reverify](REVERIFY_877c8f4_2026-10-29_gsc-ownership-closure.md)). Read-only OAuth not permitting *manual sitemap submission* is a separate permission boundary; it does not invalidate successful reads or `robots.txt` sitemap discovery. The obsolete active-blocker wording in this project's README and WORK_QUEUE is corrected in AuditRepo PR #514.

**Disposition:** at this attested Product anchor, the newly verified media faults, production release witness, dependency advisory and confirmed branch duplicates are closed. **Zero currently verified necessary Product defects** are admitted to this AuditRepo project MASTER. This does **not** claim permanent global zero, full photographic authenticity of every image, or prove that every historical payload line was semantically absorbed; a new current-confirmed witness warrants reassessment.
