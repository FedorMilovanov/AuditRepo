# INCOMING EVIDENCE — CSS Layer Validation Breadth Residual

- Date: 2026-07-17
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Auditor: Arena Agent
- Component: `scripts/css-layer-validator.js` and `package.json`

## Finding

The `css:layer:validate` script currently runs:
`"css:layer:validate": "node scripts/css-layer-validator.js css/site.css --ceiling=200"`

It only validates `css/site.css`. However, other core CSS files in the project also utilize the `@layer` architecture (specifically `css/home.css` and `css/floating-cluster.css`). Because these files are not passed to the validator, they bypass the layer order statement validation, unclosed brace checks, and `!important` ceiling checks.

This is a known residual (historically tracked as `D-2`) that was lost from the active matrix.

## Current Exact Source Witness
At current Product head:
1. `css/home.css` contains `@layer reset,base,components,utilities;`
2. `css/floating-cluster.css` contains `@layer components {`
3. `package.json` does not include these files in `css:layer:validate`.

## Recommendation
Add the validation of `css/home.css` and `css/floating-cluster.css` (or all CSS files using layers) to the `css:layer:validate` command, and potentially adjust the ceiling values as appropriate. This should enter the `MASTER_BUG_MATRIX.md` as a Narrowed Residual.
