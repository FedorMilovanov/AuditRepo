#!/usr/bin/env python3
"""Compatibility runner for the reviewed current-matrix reconciliation.

Existing reviewed dispositions win when they have the same semantic status and
canonical target as the transaction proposal. This makes the transaction
idempotent across harmless wording improvements without accepting conflicting
classification changes.
"""

from __future__ import annotations

import json

import reconcile_current_matrix as transaction


def semantic_signature(record: object) -> tuple[object, object]:
    if not isinstance(record, dict):
        return (record, None)
    return (record.get("status", "alias"), record.get("canonical"))


def preserve_compatible_dispositions() -> None:
    data = json.loads(transaction.ALIASES.read_text(encoding="utf-8"))
    existing_aliases = data.get("aliases", {})
    for finding_id, proposed in list(transaction.DISPOSITIONS.items()):
        existing = existing_aliases.get(finding_id)
        if existing is None or existing == proposed:
            continue
        if semantic_signature(existing) != semantic_signature(proposed):
            raise RuntimeError(
                f"conflicting reviewed disposition for {finding_id}: "
                f"{existing!r} != {proposed!r}"
            )
        transaction.DISPOSITIONS[finding_id] = existing


def main() -> int:
    preserve_compatible_dispositions()
    return transaction.main()


if __name__ == "__main__":
    raise SystemExit(main())
