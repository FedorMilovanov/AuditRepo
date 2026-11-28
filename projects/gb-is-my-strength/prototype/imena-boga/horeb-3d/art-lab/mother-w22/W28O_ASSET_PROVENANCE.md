# W28o eyelid asset provenance

Verified 2026-11-26 against upstream MPFB v2.0.18. Sections C and D of the [versioned license](https://github.com/makehumancommunity/mpfb2/blob/v2.0.18/LICENSE.md) cover morph targets and graphical output as CC0 assets; program logic remains GPLv3. The independent HOREB generator consumes only six external morph data files, not MPFB code. The six local compressed files were fetched independently from the exact upstream tag and SHA-256 matched 6/6. The generator now rejects mismatched assets.

Upstream directory: [expression units](https://github.com/makehumancommunity/mpfb2/tree/v2.0.18/src/mpfb/data/targets/expression/units).

| Asset path (relative to MPFB) | SHA-256 |
|---|---|
| `data/targets/expression/units/african/eye-left-closure.target.gz` | `2d358745e955ead9d73f85ed224568a8d347f3f3b897c26cbd412faf2bfa9f3a` |
| `data/targets/expression/units/asian/eye-left-closure.target.gz` | `0d52fee2d66b933ece83f3c7aa48e85bfe85e8adbed0931dbd37025866a1a67d` |
| `data/targets/expression/units/caucasian/eye-left-closure.target.gz` | `ff0d21ceb6da55fe51e03b48a7562a650924fea9bef0c686fcd7aa44d16422ed` |
| `data/targets/expression/units/african/eye-right-closure.target.gz` | `c1b0c3609d9fb59a97dabe8ace10622da58969f4566125b38f47285afef320d5` |
| `data/targets/expression/units/asian/eye-right-closure.target.gz` | `0c99a5f559a1d67f630a329b9724fe3742a2c35709b8baa8a6d37903f35b9b77` |
| `data/targets/expression/units/caucasian/eye-right-closure.target.gz` | `2b7be6bc65845d77e5f83b7bf852090854747e448644997795fa59b6cf76122d` |

The immutable W28o manifest records the original pre-review HOLD. This note resolves that specific source-license/provenance check, not artistic or production acceptance. No upstream binary files or generated actor are committed.
