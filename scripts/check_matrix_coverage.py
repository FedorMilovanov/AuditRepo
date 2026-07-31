#!/usr/bin/env python3
"""Compatibility CLI for the canonical matrix coverage engine."""

from tmp_abf1_reconcile_artifact import generate
from matrix_coverage_lib import main


if __name__ == "__main__":
    generate()
    raise SystemExit(main())
