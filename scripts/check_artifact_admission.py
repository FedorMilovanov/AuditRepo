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
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        return [f'{relative}: invalid artifact sidecar: {error}']
    if not isinstance(data, dict):
        return [f'{relative}: artifact sidecar must be a JSON object']
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
    # A sidecar is part of the evidence identity. Editing or removing only
    # the sidecar must still validate its surviving artifact. Unchanged
    # historical artifacts otherwise remain outside the prospective gate.
    sidecar_suffix = '.artifact.json'
    sidecar_artifacts = sorted({
        p[:-len(sidecar_suffix)] for p in changed if p.endswith(sidecar_suffix)
        and (root / p[:-len(sidecar_suffix)]).is_file()
        and Path(p[:-len(sidecar_suffix)]).suffix.lower() in ARTIFACT_EXTENSIONS
    } - set(changed_artifacts))
    errors: list[str] = []
    for relative in sidecar_artifacts:
        path = root / relative
        size = path.stat().st_size
        if path.suffix.lower() in ARCHIVE_EXTENSIONS or size > LARGE_BYTES or (root / f'{relative}{sidecar_suffix}').exists():
            errors.extend(manifest_errors(root, relative, size, sha256(path)))
    if not changed_artifacts:
        return errors

    hashes: dict[tuple[int, str], list[str]] = {}
    for relative in tracked:
        path = root / relative
        if Path(relative).suffix.lower() not in ARTIFACT_EXTENSIONS or not path.is_file():
            continue
        size = path.stat().st_size
        digest = sha256(path)
        hashes.setdefault((size, digest), []).append(relative)

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


def capture_changed_paths(root: Path, destination: Path) -> None:
    """Capture literal paths, including both sides of renames.

    The existing CI consumers share a UTF-8 line-oriented file. Refuse paths
    that cannot be represented in that format instead of silently losing them.
    """
    has_parent = subprocess.run(
        ['git', 'rev-parse', '--verify', 'HEAD^1'], cwd=root,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    ).returncode == 0
    if has_parent:
        command = ['git', 'diff', '--no-renames', '--name-only', '-z', 'HEAD^1', 'HEAD']
    else:
        command = ['git', 'diff-tree', '--root', '--no-commit-id', '--no-renames',
                   '--name-only', '-z', '-r', 'HEAD']
    raw = subprocess.check_output(command, cwd=root)
    if raw and not raw.endswith(b'\0'):
        raise ValueError('Git path list has no terminating NUL')
    paths = [entry.decode('utf-8') for entry in raw.split(b'\0') if entry]
    if any(path.splitlines() != [path] for path in paths):
        raise ValueError('Git path contains a line separator; cannot represent in CI path list')
    destination.write_bytes(''.join(f'{path}\n' for path in paths).encode('utf-8'))


def read_changed_paths(path: Path) -> list[str]:
    return [line for line in path.read_text(encoding='utf-8').split('\n') if line]


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--changed-paths', type=Path)
    mode.add_argument('--capture-changed-paths', type=Path)
    args = parser.parse_args()
    if args.capture_changed_paths is not None:
        try:
            capture_changed_paths(ROOT, args.capture_changed_paths)
        except (OSError, UnicodeError, ValueError, subprocess.CalledProcessError) as error:
            print(f'AUDITREPO CHANGED PATHS: FAIL: {error}', file=sys.stderr)
            return 1
        return 0
    changed = read_changed_paths(args.changed_paths)
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
