# CURRENT HEAD REVERIFY — exact production and homepage closure

**Date:** 2026-07-31
**Source repository:** `FedorMilovanov/gb-is-my-strength`
**Exact source main:** `a7b2f2b514a9745102ca88579bc0caad9a28754e`
**Source owner PR:** `#551`
**AuditRepo base:** `3213e449b41041a71c59bf581c276bb0a26d0c67`
**AuditRepo synchronization PR:** `#108`
**Status:** `SOURCE = RELEASE = CONTROL PLANE = LIVE = TTS`

## 1. Scope and authority

This reverify closes the current-head source/deploy boundary and stale AuditRepo SSOT. It does not modify source product code, continue Astro 7, rewrite visual baselines or reinterpret historical bug counts.

Source `main` was checked immediately before acceptance and remained `a7b2f2b514a9745102ca88579bc0caad9a28754e`. PR #551 is the exact merged owner of this SHA.

## 2. Homepage result

The native premium `/` route is complete in current ancestry. Its accepted chain includes the premium responsive index, canonical direction artwork, safe marginalia rails, mobile odd-card behavior, reduced-motion suppression, the authored H1 dash, source-language/citation corrections and the semantic About drop cap.

PR #551 changed exactly the Pixelmatch dependency/lockfile, migration documentation, functional contract and controlled dynamic import path. `checkerboard: false` preserves the approved Pixelmatch 5 alpha semantics; every visual baseline was retained. MAIN INDEX is not an unfinished implementation lane.

## 3. Exact immutable release

| Field | Exact value |
|---|---|
| Release SHA | `a7b2f2b514a9745102ca88579bc0caad9a28754e` |
| Control-plane SHA | `a7b2f2b514a9745102ca88579bc0caad9a28754e` |
| Deploy run | `30652948250` attempt `1` |
| Candidate ID | `a7b2f2b514a9745102ca88579bc0caad9a28754e:30652948250-1` |
| Candidate tree digest | `sha256:4b7b6e432e26ac1bdcbc62f56907309a5c3e2eb81cbd1abdafade960b6081e2f` |
| Candidate files | `1150` |
| Candidate bytes | `81201894` |
| Immutable path | `/deployments/a7b2f2b514a9745102ca88579bc0caad9a28754e/30652948250-1.json` |
| Source ledger comment | `5146092545` on PR `#551` |

### Transport and live artifacts

| Artifact | ID | Digest | Bytes |
|---|---:|---|---:|
| `pages-release-candidate-30652948250-1` | `8802579827` | `sha256:b4fa81fb2a95cc11b37f37fbc7655f69254f270466f221a388b13abf5f47b5ed` | `81453230` |
| `release-live-deployment-30652948250` | `8802590967` | `sha256:ec3dd58f7b584eb9b02763e2efdf0cf0029745c53ea25741f39b0cde6645abe0` | `1399` |
| `tts-live-deployment-30652948250` | `8802591444` | `sha256:4057921a4b9da740720f5aa5466a4181ef66d0d9f0ddbb760982744885baa066` | `1296` |

## 4. Independent live readback

The AuditRepo writer fetched the public current pointer with cache bypass and then fetched the SHA/run-addressed immutable manifest.

```json
{
  "schemaVersion": 3,
  "repository": "FedorMilovanov/gb-is-my-strength",
  "releaseSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
  "controlPlaneSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
  "immutablePath": "/deployments/a7b2f2b514a9745102ca88579bc0caad9a28754e/30652948250-1.json",
  "workflow": {
    "name": "Deploy to GitHub Pages",
    "stage": "readiness",
    "controlPlaneSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
    "runId": 30652948250,
    "runAttempt": 1,
    "eventName": "push"
  },
  "artifact": {
    "candidateId": "a7b2f2b514a9745102ca88579bc0caad9a28754e:30652948250-1",
    "digest": "sha256:4b7b6e432e26ac1bdcbc62f56907309a5c3e2eb81cbd1abdafade960b6081e2f"
  }
}
```

Selected immutable-manifest evidence:

```json
{
  "schemaVersion": 4,
  "repository": "FedorMilovanov/gb-is-my-strength",
  "releaseSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
  "controlPlaneSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
  "immutablePath": "/deployments/a7b2f2b514a9745102ca88579bc0caad9a28754e/30652948250-1.json",
  "workflow": {
    "name": "Deploy to GitHub Pages",
    "stage": "readiness",
    "controlPlaneSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
    "runId": 30652948250,
    "runAttempt": 1,
    "eventName": "push"
  },
  "artifact": {
    "candidateId": "a7b2f2b514a9745102ca88579bc0caad9a28754e:30652948250-1",
    "algorithm": "sha256-canonical-pages-tree-v1",
    "digest": "sha256:4b7b6e432e26ac1bdcbc62f56907309a5c3e2eb81cbd1abdafade960b6081e2f",
    "bytes": 81201894,
    "files": 1150
  },
  "build": {
    "node": "22.23.1",
    "npm": "10.9.8",
    "packageLockDigest": "sha256:c56460e4fce4fa566e2b26fddd3810edfba2fea202620fd0979e1cb9c7aa1635",
    "routeRegistryDigest": "sha256:f8ee305fe115c0c5a10703510aa02148112201f1f1781c1c3992f278fb77426b",
    "routeCounts": {
      "profiles": 84,
      "html": 83,
      "sitemap": 73
    },
    "pagefindDigest": "sha256:848a5cce62ab0f922d791f78883cbc886b2929d9a4632428fd3821dcbbb1d556",
    "pagefindFiles": 103,
    "sitemapDigest": "sha256:3ccf48274be9a7ef45f4417241b9c58740950cab2ef268be7292428702318f27",
    "feedDigest": "sha256:a42fd83b0e9a1b1ce1d24a93a61f7f2888b08d8a5aa0dc6e3a4b2d650c7f032e"
  },
  "criticalAssets": {
    "home": {
      "path": "/",
      "bytes": 82990,
      "sha256": "sha256:82ad9d107fe830cef63323caf5aef5398b961fc0c15e2d5caa988fe83c5edc1c"
    },
    "sitemap": {
      "path": "/sitemap.xml",
      "bytes": 21706,
      "sha256": "sha256:3ccf48274be9a7ef45f4417241b9c58740950cab2ef268be7292428702318f27"
    },
    "feed": {
      "path": "/feed.xml",
      "bytes": 45447,
      "sha256": "sha256:a42fd83b0e9a1b1ce1d24a93a61f7f2888b08d8a5aa0dc6e3a4b2d650c7f032e"
    },
    "pagefind": {
      "path": "/pagefind/pagefind.js",
      "bytes": 45555,
      "sha256": "sha256:252d272bd34d483d19a752060f6a065114d15ab12c42d8f905ca565e2768a009"
    },
    "serviceWorker": {
      "path": "/sw.js",
      "bytes": 5560,
      "sha256": "sha256:d401fc31ba1833c648d0136ada9bd86e3b5e6dce3e5088d992ff6e6e933090f1"
    }
  },
  "tts": {
    "assets": {
      "controller": {
        "path": "/js/floating-cluster-controller.js",
        "bytes": 120201,
        "sha256": "sha256:c0b5b1d45322c367022bdc21256af6bad63f5ce0c2b4d9e394ccd04c779cf85e"
      },
      "engine": {
        "path": "/js/vosk-tts-engine.js",
        "bytes": 40780,
        "sha256": "sha256:c3580317217d90be4f6246b5724773da4f971a4d3dd625562d9ad55f4402e95a"
      },
      "noticeCss": {
        "path": "/css/tts-download-notice.css",
        "bytes": 8217,
        "sha256": "sha256:69b47f9a1803d698cc2f150ed441fa9085b2f3f77eeedd4b4b330370d27ab51b"
      },
      "serviceWorker": {
        "path": "/sw.js",
        "bytes": 5560,
        "sha256": "sha256:d401fc31ba1833c648d0136ada9bd86e3b5e6dce3e5088d992ff6e6e933090f1"
      }
    },
    "lazyNoPrecache": [
      "css/tts-download-notice.css",
      "js/vosk-tts-engine.js"
    ]
  }
}
```

The readback matched the trusted machine envelope on SHA, run ID/attempt, candidate ID, digest, file/byte counts and immutable path. The manifest pins Node `22.23.1` and npm `10.9.8` and includes critical home/sitemap/feed/Pagefind/service-worker and TTS asset records.

## 5. Machine release envelope

```json
{
  "schemaVersion": 3,
  "kind": "deployment-release-witness",
  "repository": "FedorMilovanov/gb-is-my-strength",
  "releaseSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
  "controlPlaneSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
  "deploy": {
    "workflow": "Deploy to GitHub Pages",
    "controlPlaneSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
    "runId": 30652948250,
    "runAttempt": 1,
    "event": "push",
    "url": "https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/30652948250"
  },
  "releaseCandidate": {
    "releaseSha": "a7b2f2b514a9745102ca88579bc0caad9a28754e",
    "candidateId": "a7b2f2b514a9745102ca88579bc0caad9a28754e:30652948250-1",
    "digest": "sha256:4b7b6e432e26ac1bdcbc62f56907309a5c3e2eb81cbd1abdafade960b6081e2f",
    "bytes": 81201894,
    "files": 1150,
    "immutablePath": "/deployments/a7b2f2b514a9745102ca88579bc0caad9a28754e/30652948250-1.json",
    "transportArtifact": {
      "id": 8802579827,
      "name": "pages-release-candidate-30652948250-1",
      "digest": "sha256:b4fa81fb2a95cc11b37f37fbc7655f69254f270466f221a388b13abf5f47b5ed",
      "bytes": 81453230,
      "url": "https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/30652948250/artifacts/8802579827",
      "expiresAt": "2026-08-30T18:12:52Z"
    }
  },
  "liveWitnessArtifact": {
    "id": 8802590967,
    "name": "release-live-deployment-30652948250",
    "digest": "sha256:ec3dd58f7b584eb9b02763e2efdf0cf0029745c53ea25741f39b0cde6645abe0",
    "bytes": 1399,
    "url": "https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/30652948250/artifacts/8802590967",
    "expiresAt": "2026-08-30T18:13:23Z"
  },
  "live": {
    "currentPointer": "https://gospod-bog.ru/deployments/current.json",
    "runProvenance": "https://gospod-bog.ru/deployments/a7b2f2b514a9745102ca88579bc0caad9a28754e/30652948250-1.json"
  },
  "build": {
    "node": "22.23.1",
    "npm": "10.9.8",
    "packageLockDigest": "sha256:c56460e4fce4fa566e2b26fddd3810edfba2fea202620fd0979e1cb9c7aa1635",
    "routeRegistryDigest": "sha256:f8ee305fe115c0c5a10703510aa02148112201f1f1781c1c3992f278fb77426b",
    "routeCounts": {
      "profiles": 84,
      "html": 83,
      "sitemap": 73
    },
    "pagefindDigest": "sha256:848a5cce62ab0f922d791f78883cbc886b2929d9a4632428fd3821dcbbb1d556",
    "pagefindFiles": 103,
    "sitemapDigest": "sha256:3ccf48274be9a7ef45f4417241b9c58740950cab2ef268be7292428702318f27",
    "feedDigest": "sha256:a42fd83b0e9a1b1ce1d24a93a61f7f2888b08d8a5aa0dc6e3a4b2d650c7f032e"
  },
  "criticalAssets": {
    "home": {
      "path": "/",
      "url": "https://gospod-bog.ru/?release_contract=a7b2f2b514a9-a7b2f2b514a9-1-critical-home-1785521603640",
      "bytes": 82990,
      "sha256": "sha256:82ad9d107fe830cef63323caf5aef5398b961fc0c15e2d5caa988fe83c5edc1c"
    },
    "sitemap": {
      "path": "/sitemap.xml",
      "url": "https://gospod-bog.ru/sitemap.xml?release_contract=a7b2f2b514a9-a7b2f2b514a9-1-critical-sitemap-1785521603670",
      "bytes": 21706,
      "sha256": "sha256:3ccf48274be9a7ef45f4417241b9c58740950cab2ef268be7292428702318f27"
    },
    "feed": {
      "path": "/feed.xml",
      "url": "https://gospod-bog.ru/feed.xml?release_contract=a7b2f2b514a9-a7b2f2b514a9-1-critical-feed-1785521603697",
      "bytes": 45447,
      "sha256": "sha256:a42fd83b0e9a1b1ce1d24a93a61f7f2888b08d8a5aa0dc6e3a4b2d650c7f032e"
    },
    "pagefind": {
      "path": "/pagefind/pagefind.js",
      "url": "https://gospod-bog.ru/pagefind/pagefind.js?release_contract=a7b2f2b514a9-a7b2f2b514a9-1-critical-pagefind-1785521603720",
      "bytes": 45555,
      "sha256": "sha256:252d272bd34d483d19a752060f6a065114d15ab12c42d8f905ca565e2768a009"
    },
    "serviceWorker": {
      "path": "/sw.js",
      "url": "https://gospod-bog.ru/sw.js?release_contract=a7b2f2b514a9-a7b2f2b514a9-1-critical-serviceWorker-1785521603748",
      "bytes": 5560,
      "sha256": "sha256:d401fc31ba1833c648d0136ada9bd86e3b5e6dce3e5088d992ff6e6e933090f1"
    }
  },
  "extensions": {
    "tts": {
      "result": "PASS",
      "witnessArtifact": {
        "id": 8802591444,
        "name": "tts-live-deployment-30652948250",
        "digest": "sha256:4057921a4b9da740720f5aa5466a4181ef66d0d9f0ddbb760982744885baa066",
        "bytes": 1296,
        "url": "https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/30652948250/artifacts/8802591444",
        "expiresAt": "2026-08-30T18:13:25Z"
      },
      "routes": [
        "/articles/dzhon-gill-chast-1-chelovek/",
        "/articles/20-antisovetov-pastoru/"
      ],
      "assets": {
        "controller": {
"path": "/js/floating-cluster-controller.js?v=2b92a1a5",
"revision": "2b92a1a5",
"sha256": "c0b5b1d45322c367022bdc21256af6bad63f5ce0c2b4d9e394ccd04c779cf85e"
        },
        "engine": {
"path": "/js/vosk-tts-engine.js?v=216b15fb",
"revision": "216b15fb",
"sha256": "c3580317217d90be4f6246b5724773da4f971a4d3dd625562d9ad55f4402e95a"
        },
        "noticeCss": {
"path": "/css/tts-download-notice.css?v=475abd4b",
"revision": "475abd4b",
"sha256": "69b47f9a1803d698cc2f150ed441fa9085b2f3f77eeedd4b4b330370d27ab51b"
        },
        "serviceWorker": {
"url": "https://gospod-bog.ru/sw.js?tts_deploy_contract=a7b2f2b514a9-a7b2f2b514a9-1-service-worker-1785521604982",
"revision": "c5dae59c",
"sha256": "d401fc31ba1833c648d0136ada9bd86e3b5e6dce3e5088d992ff6e6e933090f1",
"lazyTtsPrecache": false
        }
      }
    }
  }
}
```

## 6. Active-lane exclusion

PR #549 — Astro 7 — remains an independent protected owner. It was not modified, rebased, merged, closed or cleaned up by this lane.

## 7. Cleanup and final-tree contract

- source `main` contains no temporary Pixelmatch writer/exporter/bootstrap/reconcile workflow;
- this one-shot AuditRepo workflow deletes itself before the final commit;
- the superseded ca8 current-head reverify is removed rather than retained as a second current authority;
- final AuditRepo PR diff contains exactly `NEXT_AGENT_PROMPT.md`, `MASTER_BUG_MATRIX.md` and this reverify;
- historical raw intakes and remote refs are not silently deleted;
- matrix counters remain unchanged.

## 8. Verdict

`PASS — exact source main, immutable release candidate, live pointer, immutable manifest, generic live witness and TTS witness converge on a7b2f2b514a9745102ca88579bc0caad9a28754e. MAIN INDEX is complete; AuditRepo current authority is synchronized; temporary control-plane files are absent.`
