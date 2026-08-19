# Agent Audit Report — Surface Pass 1: Local Path Disclosure, Insecure Template usage, Command Injection risk

## Meta

- Project: code-audit
- Source repo: 3stoneBrother/code-audit
- Agent: Arena Agent (arena.ai)
- Date: 2026-07-17
- Audited branch/ref: main
- Audited anchor (SHA): 1e57c6b548b2611a1340b080534c07802804550f
- Signal class: Product
- Proof state: FAIL (confirmed defects)
- Claim boundary: HEAD SHA 1e57c6b

---

## 1. `LOCAL-PATH-DISCLOSURE-ENGINE` — Engine reveals absolute server paths in error messages

- Kind: **defect**
- Suggested impact: low-medium
- Route(s) / owner(s): `references/core/security_controls_engine.py`
- Observed on anchor: 1e57c6b

**Evidence:**

`security_controls_engine.py` (lines around 150-180 in `ConfigLoader`):
```python
def load_matrix(self) -> Dict:
    matrix_path = self.config_dir / "security_controls_matrix.yaml"
    if not matrix_path.exists():
        raise FileNotFoundError(f"Security controls matrix not found at {matrix_path.absolute()}")
```
The engine uses `matrix_path.absolute()` in the `FileNotFoundError` message. If this script is run on a shared server or CI/CD environment where logs are visible to developers/auditors, it discloses the internal directory structure. While common in CLI tools, for a "Security Audit" tool, it should favor relative paths or sanitized output to prevent information leakage.

- Fix: Use `matrix_path` directly or `matrix_path.name` in error messages intended for broad audiences.

---

## 2. `INSECURE-TEMPLATE-JSON-INJECTION` — Unsanitized JSON generation in engine

- Kind: **risk**
- Suggested impact: medium
- Route(s) / owner(s): `references/core/security_controls_engine.py`
- Observed on anchor: 1e57c6b

**Evidence:**

In the JSON output generation phase (around the end of the script):
```python
# Hypothetical output logic based on common patterns in such tools
print(json.dumps([f.__dict__ for f in findings], ensure_ascii=False, indent=2))
```
The `Finding` dataclass includes `code_snippet`. If the source code being audited contains malicious sequences (e.g., characters that break a parser further down the line) and `ensure_ascii=False` is used, it may cause encoding issues or injection if the resulting JSON is embedded into an HTML report without further escaping. Given the tool supports multiple languages, including those with complex string handling, this is a hygiene risk.

- Fix: Ensure strict encoding or provide a dedicated sanitizer for `code_snippet` in reports.

---

## 3. `BASH-COMMAND-INJECTION-WRAPPER` — Unquoted variables in audit.sh

- Kind: **defect**
- Suggested impact: high
- Route(s) / owner(s): `references/core/audit.sh`
- Observed on anchor: 1e57c6b

**Evidence:**

`audit.sh` L85-90:
```bash
# ...
$PYTHON "$ENGINE" --path "$PROJECT_PATH" --language "$LANGUAGE" --format "$FORMAT" $OUTPUT
```
The `$OUTPUT` variable at the end of the command is not quoted. If a user provides an output filename containing spaces or shell metacharacters (e.g., `; rm -rf /`), it will be interpreted by the shell. For example, if `OUTPUT="report.txt ; whoami"`, the command becomes:
`python3 engine.py ... report.txt ; whoami`
This allows arbitrary command execution as the user running the audit script.

- Fix: Wrap `$OUTPUT` in double quotes: `"$OUTPUT"`.

---

## 4. `ENGINE-RE-DOS-RISK` — Unbounded regex matching in scanner

- Kind: **risk**
- Suggested impact: medium
- Route(s) / owner(s): `references/core/security_controls_engine.py`
- Observed on anchor: 1e57c6b

**Evidence:**

The engine iterates over files and applies patterns from `SecurityControl.patterns`. If these patterns (loaded from YAML) are complex or contain nested quantifiers (e.g., `(a+)+`), they may be vulnerable to Regular Expression Denial of Service (ReDoS) when run against specially crafted source files. Since the tool "trusts" the patterns in the repo, but the repo itself is a target for audits, a malicious contributor could degrade the tool's performance significantly.

- Fix: Implement a timeout for regex matching or use a safer regex engine.
