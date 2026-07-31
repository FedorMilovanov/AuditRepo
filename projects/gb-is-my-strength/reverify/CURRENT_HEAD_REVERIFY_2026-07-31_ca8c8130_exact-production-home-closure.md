# CURRENT HEAD REVERIFY — exact production and homepage closure

**Date:** 2026-07-31
**Source repository:** `FedorMilovanov/gb-is-my-strength`
**Exact source main:** `ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1`
**Source owner PR:** `#624`
**AuditRepo base:** `3213e449b41041a71c59bf581c276bb0a26d0c67`
**AuditRepo synchronization PR:** `#108`
**Status:** `SOURCE = RELEASE = CONTROL PLANE = LIVE = TTS`

## 1. Scope and authority

This reverify closes only the current-head source/deploy boundary and the stale AuditRepo SSOT. It does not modify source product code, does not continue Astro 7 or Pixelmatch work and does not expand the merged A04/Baptist scopes and does not reinterpret historical bug counts.

The source repository exact `main` was checked before acceptance and remained `ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1`. PR #624 is the exact merged owner of this SHA.

## 2. Homepage result

The native premium `/` route is complete in current ancestry. Its accepted chain includes:

- premium responsive index rebuild;
- five canonical direction objects and native component ownership;
- safe marginalia rails and mobile odd-card behavior;
- reduced-motion suppression;
- semantic authored H1 dash;
- source-language/citation corrections;
- one semantic About lead with CSS `::first-letter` ownership;
- final marginal references to Synodal Ps. 22:1 and 2 Cor. 6:18.

The later Actions/Node commits, Baptist research merge and current A04 policy/test merge changed control-plane, research or tooltip-contract surfaces, not the homepage design or visual baselines. Therefore MAIN INDEX is not an unfinished implementation lane.

## 3. Exact immutable release

| Field | Exact value |
|---|---|
| Release SHA | `ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1` |
| Control-plane SHA | `ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1` |
| Deploy run | `30651535224` attempt `1` |
| Candidate ID | `ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1:30651535224-1` |
| Candidate tree digest | `sha256:ed25db05618922ab271e85ff883ac965388c39d4c99eb66d38051916a56c7942` |
| Candidate files | `1150` |
| Candidate bytes | `81201894` |
| Immutable path | `/deployments/ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1/30651535224-1.json` |
| Source ledger comment | `5145907989` on PR `#624` |

### Transport and live artifacts

| Artifact | ID | Digest | Bytes |
|---|---:|---|---:|
| `pages-release-candidate-30651535224-1` | `8802022675` | `sha256:629e3f7c8dc0140219406f258a401aeb3c1bae33045f70afa8a88d9c0e385ead` | `81453230` |
| `release-live-deployment-30651535224` | `8802032844` | `sha256:a99e9627f1a6480cdf76924d64f53a21d075dbe1dc7af30ab02b3dded171887a` | `1402` |
| `tts-live-deployment-30651535224` | `8802033419` | `sha256:112b0235b525a77bae118ffc38533f60e863dc2f0a2c0016612c2843a3387072` | `1298` |

## 4. Independent live readback

The writer fetched the public pointer with cache bypass and then fetched its SHA/run-addressed immutable manifest.

Pointer evidence:

```json
{
  "schemaVersion": 3,
  "repository": "FedorMilovanov/gb-is-my-strength",
  "releaseSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
  "controlPlaneSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
  "immutablePath": "/deployments/ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1/30651535224-1.json",
  "workflow": {
    "name": "Deploy to GitHub Pages",
    "stage": "readiness",
    "controlPlaneSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
    "runId": 30651535224,
    "runAttempt": 1,
    "eventName": "push"
  },
  "artifact": {
    "candidateId": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1:30651535224-1",
    "digest": "sha256:ed25db05618922ab271e85ff883ac965388c39d4c99eb66d38051916a56c7942"
  }
}
```

Selected immutable-manifest evidence:

```json
{
  "schemaVersion": 4,
  "repository": "FedorMilovanov/gb-is-my-strength",
  "releaseSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
  "controlPlaneSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
  "immutablePath": "/deployments/ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1/30651535224-1.json",
  "workflow": {
    "name": "Deploy to GitHub Pages",
    "stage": "readiness",
    "controlPlaneSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
    "runId": 30651535224,
    "runAttempt": 1,
    "eventName": "push"
  },
  "artifact": {
    "candidateId": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1:30651535224-1",
    "algorithm": "sha256-canonical-pages-tree-v1",
    "digest": "sha256:ed25db05618922ab271e85ff883ac965388c39d4c99eb66d38051916a56c7942",
    "bytes": 81201894,
    "files": 1150
  },
  "build": {
    "node": "22.23.1",
    "npm": "10.9.8",
    "packageLockDigest": "sha256:0d6d3a6b7897ba3dd75f8db58f0018d1ff4a16b09c75445765bef512a2a2a537",
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

The readback matched the trusted machine envelope on SHA, run ID/attempt, candidate ID, digest, file/byte counts and immutable path. The manifest pins Node `22.23.1` and npm `10.9.8` and includes critical home/sitemap/feed/Pagefind/service-worker plus TTS asset records.

## 5. Machine release envelope

```json
{
  "schemaVersion": 3,
  "kind": "deployment-release-witness",
  "repository": "FedorMilovanov/gb-is-my-strength",
  "releaseSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
  "controlPlaneSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
  "deploy": {
    "workflow": "Deploy to GitHub Pages",
    "controlPlaneSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
    "runId": 30651535224,
    "runAttempt": 1,
    "event": "push",
    "url": "https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/30651535224"
  },
  "releaseCandidate": {
    "releaseSha": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1",
    "candidateId": "ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1:30651535224-1",
    "digest": "sha256:ed25db05618922ab271e85ff883ac965388c39d4c99eb66d38051916a56c7942",
    "bytes": 81201894,
    "files": 1150,
    "immutablePath": "/deployments/ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1/30651535224-1.json",
    "transportArtifact": {
      "id": 8802022675,
      "name": "pages-release-candidate-30651535224-1",
      "digest": "sha256:629e3f7c8dc0140219406f258a401aeb3c1bae33045f70afa8a88d9c0e385ead",
      "bytes": 81453230,
      "url": "https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/30651535224/artifacts/8802022675",
      "expiresAt": "2026-08-30T17:50:36Z"
    }
  },
  "liveWitnessArtifact": {
    "id": 8802032844,
    "name": "release-live-deployment-30651535224",
    "digest": "sha256:a99e9627f1a6480cdf76924d64f53a21d075dbe1dc7af30ab02b3dded171887a",
    "bytes": 1402,
    "url": "https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/30651535224/artifacts/8802032844",
    "expiresAt": "2026-08-30T17:51:02Z"
  },
  "live": {
    "currentPointer": "https://gospod-bog.ru/deployments/current.json",
    "runProvenance": "https://gospod-bog.ru/deployments/ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1/30651535224-1.json"
  },
  "build": {
    "node": "22.23.1",
    "npm": "10.9.8",
    "packageLockDigest": "sha256:0d6d3a6b7897ba3dd75f8db58f0018d1ff4a16b09c75445765bef512a2a2a537",
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
      "url": "https://gospod-bog.ru/?release_contract=ca8c8130a1ec-ca8c8130a1ec-1-critical-home-1785520262371",
      "bytes": 82990,
      "sha256": "sha256:82ad9d107fe830cef63323caf5aef5398b961fc0c15e2d5caa988fe83c5edc1c"
    },
    "sitemap": {
      "path": "/sitemap.xml",
      "url": "https://gospod-bog.ru/sitemap.xml?release_contract=ca8c8130a1ec-ca8c8130a1ec-1-critical-sitemap-1785520262395",
      "bytes": 21706,
      "sha256": "sha256:3ccf48274be9a7ef45f4417241b9c58740950cab2ef268be7292428702318f27"
    },
    "feed": {
      "path": "/feed.xml",
      "url": "https://gospod-bog.ru/feed.xml?release_contract=ca8c8130a1ec-ca8c8130a1ec-1-critical-feed-1785520262423",
      "bytes": 45447,
      "sha256": "sha256:a42fd83b0e9a1b1ce1d24a93a61f7f2888b08d8a5aa0dc6e3a4b2d650c7f032e"
    },
    "pagefind": {
      "path": "/pagefind/pagefind.js",
      "url": "https://gospod-bog.ru/pagefind/pagefind.js?release_contract=ca8c8130a1ec-ca8c8130a1ec-1-critical-pagefind-1785520262441",
      "bytes": 45555,
      "sha256": "sha256:252d272bd34d483d19a752060f6a065114d15ab12c42d8f905ca565e2768a009"
    },
    "serviceWorker": {
      "path": "/sw.js",
      "url": "https://gospod-bog.ru/sw.js?release_contract=ca8c8130a1ec-ca8c8130a1ec-1-critical-serviceWorker-1785520262463",
      "bytes": 5560,
      "sha256": "sha256:d401fc31ba1833c648d0136ada9bd86e3b5e6dce3e5088d992ff6e6e933090f1"
    }
  },
  "extensions": {
    "tts": {
      "result": "PASS",
      "witnessArtifact": {
        "id": 8802033419,
        "name": "tts-live-deployment-30651535224",
        "digest": "sha256:112b0235b525a77bae118ffc38533f60e863dc2f0a2c0016612c2843a3387072",
        "bytes": 1298,
        "url": "https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/30651535224/artifacts/8802033419",
        "expiresAt": "2026-08-30T17:51:03Z"
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
          "url": "https://gospod-bog.ru/sw.js?tts_deploy_contract=ca8c8130a1ec-ca8c8130a1ec-1-service-worker-1785520263763",
          "revision": "c5dae59c",
          "sha256": "d401fc31ba1833c648d0136ada9bd86e3b5e6dce3e5088d992ff6e6e933090f1",
          "lazyTtsPrecache": false
        }
      }
    }
  }
}
```

## 6. Active-lane exclusions

The following remain independent protected owners and were not modified or cleaned up by this lane:

- PR #549 — Astro 7;
- PR #551 — Pixelmatch 7;

## 7. Cleanup and final-tree contract

- source `main` contains no temporary Node migration writer/exporter/object-transfer files;
- temporary AuditRepo writer and workflow delete themselves before the final synchronization commit;
- final AuditRepo PR diff must contain exactly:
  - `projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md`;
  - `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`;
  - `projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-31_ca8c8130_exact-production-home-closure.md`;
- no counter changes are made;
- remote branch deletion is not used as a substitute for source, CI or production evidence.

## 8. Verdict

`PASS — exact current source, immutable release candidate, live current pointer, immutable manifest, generic live witness and TTS witness converge on ca8c8130a1ec7d9b12cc14e9274fe2ba855076a1. MAIN INDEX is complete; AuditRepo current authority is synchronized without touching active foreign lanes.`
