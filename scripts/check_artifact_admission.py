#!/usr/bin/env python3
"""Fail-closed admission for changed binary/archive evidence.

Historical evidence is not rescanned into failure. The gate applies to paths in the
current transaction and prevents new opaque archives, oversized unowned blobs and
exact binary duplication.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
ARTIFACT_EXTENSIONS = {
    '.7z', '.aac', '.aiff', '.bmp', '.flac', '.gif', '.gz', '.jpeg', '.jpg',
    '.m4a', '.mov', '.mp3', '.mp4', '.ogg', '.opus', '.patch', '.pdf', '.png',
    '.tar', '.tgz', '.wav', '.webm', '.webp', '.woff', '.woff2', '.zip',
}
ARCHIVE_EXTENSIONS = {'.7z', '.gz', '.tar', '.tgz', '.zip'}
LARGE_BYTES = 2 * 1024 * 1024


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda: source.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def manifest_errors(root: Path, relative: str, size: int, digest: str) -> list[str]:
    sidecar = root / f'{relative}.artifact.json'
    if not sidecar.is_file():
        return [f'{relative}: requires sidecar {relative}.artifact.json']
    try:
        data = json.loads(sidecar.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error:
        return [f'{relative}: invalid artifact sidecar: {error}']
    expected = {'schemaVersion', 'path', 'sha256', 'sizeBytes', 'purpose', 'provenance', 'retention'}
    missing = sorted(expected - data.keys())
    errors = [f'{relative}: sidecar missing fields {missing}'] if missing else []
    if data.get('schemaVersion') != 1:
        errors.append(f'{relative}: sidecar schemaVersion must be 1')
    if data.get('path') != relative or data.get('sha256') != digest or data.get('sizeBytes') != size:
        errors.append(f'{relative}: sidecar identity does not match path/hash/size')
    for field in ('purpose', 'provenance', 'retention'):
        if not isinstance(data.get(field), str) or not data[field].strip():
            errors.append(f'{relative}: sidecar {field} must be non-empty text')
    return errors


def artifact_admission_errors(root: Path, changed: list[str], tracked: list[str]) -> list[str]:
    changed_artifacts = [p for p in changed if Path(p).suffix.lower() in ARTIFACT_EXTENSIONS and (root / p).is_file()]
    if not changed_artifacts:
        return []

    hashes: dict[tuple[int, str], list[str]] = {}
    for relative in tracked:
        path = root / relative
        if Path(relative).suffix.lower() not in ARTIFACT_EXTENSIONS or not path.is_file():
            continue
        size = path.stat().st_size
        digest = sha256(path)
        hashes.setdefault((size, digest), []).append(relative)

    errors: list[str] = []
    for relative in changed_artifacts:
        path = root / relative
        size = path.stat().st_size
        digest = sha256(path)
        if any(character.isspace() for character in relative):
            errors.append(f'{relative}: artifact path must not contain whitespace')
        duplicates = sorted(item for item in hashes.get((size, digest), []) if item != relative)
        if duplicates:
            errors.append(f'{relative}: exact artifact duplicate of {duplicates}')
        if path.suffix.lower() in ARCHIVE_EXTENSIONS or size > LARGE_BYTES:
            errors.extend(manifest_errors(root, relative, size, digest))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--changed-paths', required=True, type=Path)
    args = parser.parse_args()
    changed = [line.strip() for line in args.changed_paths.read_text(encoding='utf-8').splitlines() if line.strip()]
    tracked = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT).decode().split('\0')
    errors = artifact_admission_errors(ROOT, changed, [item for item in tracked if item])
    if errors:
        print('AUDITREPO ARTIFACT ADMISSION: FAIL')
        for error in errors:
            print('-', error)
        return 1
    print('AUDITREPO ARTIFACT ADMISSION: PASS')
    return 0


if __name__ == '__main__':
    sys.exit(main())
