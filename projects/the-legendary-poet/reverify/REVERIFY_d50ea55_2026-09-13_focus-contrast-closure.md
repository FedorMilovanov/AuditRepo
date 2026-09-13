# Reverify — TLP-A11Y-FOCUS-CONTRAST-001 closure — 2026-09-13

## Scope

Terminal closure of the current light-theme non-text focus-contrast residual discovered by the real keyboard browser outcome while Product #507 was being certified.

- Original current-main witness: `cff9b0f6cbe986a4d8dc79e22661b331a1207592`.
- Dedicated bounded repair PR: Product #508, exact head `a041d4475c133cc04b039b44f07b21cb615d7a0c`.
- Integrated certified head: Product #507 `b7d179f31304f41df05c98c93e01ae78851f10fd`.
- Resulting Product main: `d50ea5588b0c2de4cbb7071ba3a9c4fd23e11d34`.
- Tested/resulting tree: `867565ba01d6cac20c3dd742e3a3bbd7fd81d2c8` (identical).

## Root cause and repair

The unchanged browser contract measured the real keyboard-visible community textarea focus indicator at `1.626282818611112:1` in light theme against the required `>=3:1`. The global translucent cyan focus outline was suitable on dark surfaces but insufficient against the light `#fffaf0` surface.

The repair introduces one theme-owned `--tlp-focus-ring` authority:

- dark theme retains the existing cyan focus treatment;
- light theme uses `#075f75`;
- the global `:focus-visible` rule consumes that token;
- no keyboard path, contrast threshold, focus method or browser assertion was weakened.

## Certification

Dedicated Product #508 exact head completed successfully:

- Manual Browser QA `34747531546`;
- CI `34747531559`;
- Project contracts `34747531535`;
- Site route integrity `34747531582`;
- Brand deep reference/motion `34747531540`;
- Merge certification `34747531574`.

Product #507 then carried the identical two-file repair while closing the independent Discovery residual. Its exact head completed Manual Browser QA `34747534680` and all source/route/merge gates successfully.

Because #507 merged first, Product #508 was deliberately closed unmerged as superseded rather than duplicating the same patch. Verification against resulting `main@d50ea55` confirms both focus-ring theme values and global token consumption are present.

Resulting-main proof:

- Manual Browser QA `34760300012`: success, including Chromium/Android keyboard outcomes, fresh-process iPhone Safari, premium iPhone, WebKit HOME, premium HOME and analytics-route lanes;
- CI `34760299984`: success;
- Pages `34760299947`: success;
- Site route integrity `34760299920`: success;
- Brand deep `34760299928` and Brand raster `34760299950`: success.

## Disposition

`TLP-A11Y-FOCUS-CONTRAST-001` is retired.

Matrix movement: P1 stays 1, P2 `3 -> 2`, P3 stays 0, total active `4 -> 3`.

Independent boundaries preserved: live human-backed community adversarial proof and external GA4 property/web-stream authority.
