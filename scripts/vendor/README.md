# Vendored runtime dependencies

`pyyaml_6_0_3/` is the pure-Python source from PyYAML 6.0.3, retained under
its MIT licence. `pyyaml_6_0_3.manifest.json` records every shipped file and
SHA-256 digest.

It is vendored only for the workflow bootstrap preflight. That check must be
able to parse a broken workflow on a cold runner without downloading a parser
from PyPI or GitHub Releases. The preflight verifies the manifest before it
imports the package.
