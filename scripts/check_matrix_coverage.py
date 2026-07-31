#!/usr/bin/env python3
"""Compatibility CLI for the canonical matrix coverage engine."""

import tmp_abf1_reconcile_artifact as artifact
from matrix_coverage_lib import main


def generate_reconciliation_artifact() -> None:
    original_get_json = artifact.get_json

    def get_json_with_legacy_tts_alias(url: str, *, bust: bool = False):
        value = original_get_json(url, bust=bust)
        if isinstance(value, dict) and "tts" not in value:
            extensions = value.get("extensions")
            if isinstance(extensions, dict) and isinstance(extensions.get("tts"), dict):
                value = dict(value)
                value["tts"] = extensions["tts"]
        return value

    artifact.get_json = get_json_with_legacy_tts_alias
    artifact.generate()


if __name__ == "__main__":
    generate_reconciliation_artifact()
    raise SystemExit(main())
