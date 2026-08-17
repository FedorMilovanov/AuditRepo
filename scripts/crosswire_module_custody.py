#!/usr/bin/env python3
"""Acquire one official CrossWire raw ZIP and produce a fail-closed custody receipt.

The verifier does not import module text into Product. It proves package transport,
archive identity, embedded configuration equality against the official live
configuration object, expected authority fields, and a per-file manifest.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import sys
import urllib.parse
import urllib.request
import zipfile

ALLOWED_HOSTS = {"crosswire.org", "www.crosswire.org", "ftp.crosswire.org"}
MAX_BYTES = 32 * 1024 * 1024
USER_AGENT = "AuditRepo-CrossWire-Custody/1.0 (+https://github.com/FedorMilovanov/AuditRepo)"


def _safe_https_crosswire(url: str) -> None:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or (parsed.hostname or "").lower() not in ALLOWED_HOSTS:
        raise RuntimeError(f"URL must be HTTPS on an official CrossWire host: {url}")


def _download(url: str) -> tuple[bytes, dict[str, str]]:
    _safe_https_crosswire(url)
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    with urllib.request.urlopen(request, timeout=60) as response:  # noqa: S310 - host allowlisted above
        final_url = response.geturl()
        _safe_https_crosswire(final_url)
        data = response.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise RuntimeError(f"response exceeded {MAX_BYTES} bytes: {url}")
        headers = {
            "source_url": url,
            "final_url": final_url,
            "content_type": response.headers.get("Content-Type", ""),
            "content_length_header": response.headers.get("Content-Length", ""),
            "last_modified": response.headers.get("Last-Modified", ""),
            "etag": response.headers.get("ETag", ""),
        }
        return data, headers


def _normalize_text(data: bytes) -> str:
    return data.decode("utf-8-sig").replace("\r\n", "\n").replace("\r", "\n").strip() + "\n"


def _parse_sword_conf(text: str) -> tuple[str, dict[str, list[str]]]:
    section = ""
    values: dict[str, list[str]] = {}
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or line.startswith(";"):
            continue
        if line.startswith("[") and line.endswith("]"):
            if section:
                raise RuntimeError("expected exactly one SWORD module section")
            section = line[1:-1].strip()
            continue
        if "=" not in line:
            raise RuntimeError(f"unparsed configuration line: {raw!r}")
        key, value = line.split("=", 1)
        values.setdefault(key.strip(), []).append(value.strip())
    if not section:
        raise RuntimeError("module configuration has no section")
    return section, values


def _single(values: dict[str, list[str]], key: str) -> str:
    observed = values.get(key, [])
    if len(observed) != 1:
        raise RuntimeError(f"expected exactly one {key}= value; observed {observed!r}")
    return observed[0]


def _safe_member(name: str) -> None:
    path = PurePosixPath(name)
    if path.is_absolute() or ".." in path.parts or "" in path.parts:
        raise RuntimeError(f"unsafe ZIP member path: {name!r}")


def verify(package_url: str, conf_url: str, module: str, output_dir: Path) -> dict[str, object]:
    package, package_transport = _download(package_url)
    official_conf_bytes, conf_transport = _download(conf_url)
    if not package.startswith(b"PK"):
        raise RuntimeError("official package response is not a ZIP payload")

    output_dir.mkdir(parents=True, exist_ok=True)
    package_path = output_dir / f"{module}.zip"
    package_path.write_bytes(package)

    members: list[dict[str, object]] = []
    embedded_conf_candidates: list[tuple[str, bytes]] = []
    with zipfile.ZipFile(package_path) as archive:
        bad_member = archive.testzip()
        if bad_member:
            raise RuntimeError(f"ZIP CRC validation failed at {bad_member!r}")
        infos = archive.infolist()
        if not infos:
            raise RuntimeError("official package is empty")
        for info in infos:
            _safe_member(info.filename)
            if info.is_dir():
                continue
            payload = archive.read(info)
            members.append(
                {
                    "path": info.filename,
                    "size": len(payload),
                    "crc32": f"{info.CRC:08x}",
                    "sha256": hashlib.sha256(payload).hexdigest(),
                }
            )
            if info.filename.lower().endswith(f"mods.d/{module.lower()}.conf"):
                embedded_conf_candidates.append((info.filename, payload))

    if len(embedded_conf_candidates) != 1:
        raise RuntimeError(
            f"expected one embedded mods.d/{module.lower()}.conf; "
            f"observed {[name for name, _ in embedded_conf_candidates]!r}"
        )

    embedded_conf_name, embedded_conf_bytes = embedded_conf_candidates[0]
    embedded_conf = _normalize_text(embedded_conf_bytes)
    official_conf = _normalize_text(official_conf_bytes)
    if embedded_conf != official_conf:
        raise RuntimeError("embedded module configuration differs from the official live config object")

    section, values = _parse_sword_conf(official_conf)
    if section.lower() != module.lower():
        raise RuntimeError(f"unexpected module section [{section}], expected [{module}]")

    expected = {
        "Version": "1.9.1",
        "DistributionLicense": "Public Domain",
        "Versification": "Synodal",
        "SourceType": "OSIS",
        "Encoding": "UTF-8",
    }
    authority: dict[str, str] = {}
    for key, wanted in expected.items():
        observed = _single(values, key)
        if observed != wanted:
            raise RuntimeError(f"{key} mismatch: expected {wanted!r}, observed {observed!r}")
        authority[key] = observed

    data_members = [m for m in members if str(m["path"]).lower().startswith("modules/")]
    if not data_members:
        raise RuntimeError("package contains no module data files under modules/")

    receipt: dict[str, object] = {
        "schema_version": 1,
        "conclusion": "success",
        "module": module,
        "package": {
            **package_transport,
            "bytes": len(package),
            "sha256": hashlib.sha256(package).hexdigest(),
        },
        "official_conf": {
            **conf_transport,
            "bytes": len(official_conf_bytes),
            "sha256": hashlib.sha256(official_conf_bytes).hexdigest(),
        },
        "embedded_conf": {
            "path": embedded_conf_name,
            "sha256": hashlib.sha256(embedded_conf_bytes).hexdigest(),
            "normalized_equal_to_official": True,
        },
        "authority": authority,
        "member_count": len(members),
        "module_data_member_count": len(data_members),
        "members": sorted(members, key=lambda item: str(item["path"]).lower()),
    }

    (output_dir / "receipt.json").write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (output_dir / "official-russynodal.conf").write_text(official_conf, encoding="utf-8")
    (output_dir / "embedded-russynodal.conf").write_text(embedded_conf, encoding="utf-8")

    package_info = receipt["package"]
    assert isinstance(package_info, dict)
    markdown = [
        "# CrossWire RusSynodal package custody receipt",
        "",
        f"- Conclusion: **{receipt['conclusion']}**",
        f"- Module: `{module}`",
        f"- Official package URL: `{package_transport['source_url']}`",
        f"- Final package URL: `{package_transport['final_url']}`",
        f"- Package bytes: `{package_info['bytes']}`",
        f"- Package SHA-256: `{package_info['sha256']}`",
        f"- Embedded config: `{embedded_conf_name}`",
        "- Embedded config equals official live config after newline normalization: **yes**",
        f"- Version: `{authority['Version']}`",
        f"- DistributionLicense: `{authority['DistributionLicense']}`",
        f"- Versification: `{authority['Versification']}`",
        f"- SourceType: `{authority['SourceType']}`",
        f"- Encoding: `{authority['Encoding']}`",
        f"- ZIP file members: `{len(members)}`",
        f"- Module data members: `{len(data_members)}`",
        "",
        "This receipt proves byte identity and package/config custody only. It does not perform Product import, canonical mapping, verse-level semantic validation, or authorize any protected corpus.",
        "",
    ]
    (output_dir / "receipt.md").write_text("\n".join(markdown), encoding="utf-8")
    return receipt


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--package-url", required=True)
    parser.add_argument("--conf-url", required=True)
    parser.add_argument("--module", default="RusSynodal")
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    try:
        receipt = verify(args.package_url, args.conf_url, args.module, args.output_dir)
    except Exception as exc:  # fail closed with a compact CI diagnostic
        print(f"CROSSWIRE MODULE CUSTODY: FAIL: {exc}", file=sys.stderr)
        return 1
    package = receipt["package"]
    assert isinstance(package, dict)
    print(
        "CROSSWIRE MODULE CUSTODY: PASS "
        f"({args.module}; sha256={package['sha256']}; members={receipt['member_count']})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
