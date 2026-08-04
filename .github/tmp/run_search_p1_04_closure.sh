#!/usr/bin/env bash
set -euo pipefail

BASE_SHA="75cfcd54e080c3a07da7775f4082f399ae2a034b"
BRANCH="${HEAD_REF:-lane/search-p1-04-closure-20260804}"
MATRIX="projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
NEXT="projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md"
REVERIFY="projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-08-04_3fba1890_scripture-occurrence-search-closure.md"
HELPER=".github/tmp/apply_search_p1_04_closure.py"
RUNNER=".github/tmp/run_search_p1_04_closure.sh"
TEMP_WORKFLOW=".github/workflows/tmp-search-p1-04-closure.yml"

# Exact SSOT base and owner guards.
git fetch --no-tags origin main
test "$(git rev-parse origin/main)" = "${BASE_SHA}"
git merge-base --is-ancestor "${BASE_SHA}" HEAD
test "$(git rev-parse HEAD:${MATRIX})" = "b11c88bd4ebd8b878eb2126f1e5ad36a40c774c5"
test "$(git rev-parse HEAD:${NEXT})" = "ba6877110c43b1cf70a95ce927bd8ca0ff9cf735"
test "$(git rev-parse HEAD:${HELPER})" = "2f74af437c0c9a7dca0f322f3a57c193fba6431f"
test -f "${RUNNER}"
test -f "${TEMP_WORKFLOW}"

python3 -m py_compile "${HELPER}"
python3 "${HELPER}"

# Self-clean temporary control plane before validation.
rm -f "${HELPER}" "${RUNNER}" "${TEMP_WORKFLOW}"
rm -rf .github/tmp/__pycache__
git diff --check origin/main
{ git diff --name-only origin/main; git ls-files --others --exclude-standard; } | sort -u > "${RUNNER_TEMP}/changed.txt"
printf '%s\n' "${NEXT}" "${REVERIFY}" "${MATRIX}" | sort > "${RUNNER_TEMP}/expected.txt"
diff -u "${RUNNER_TEMP}/expected.txt" "${RUNNER_TEMP}/changed.txt"
cp "${RUNNER_TEMP}/changed.txt" "${RUNNER_TEMP}/auditrepo-changed-paths.txt"
export AUDITREPO_CHANGED_PATHS_FILE="${RUNNER_TEMP}/auditrepo-changed-paths.txt"

# Canonical structure and matrix validation.
python3 scripts/check_auditrepo_structure.py
python3 scripts/validate_audit_repo.py
python3 scripts/validate_audit_repo_regression_test.py
python3 -m py_compile \
  scripts/check_matrix_coverage.py \
  scripts/matrix_coverage_lib.py \
  scripts/matrix_coverage_contexts.py \
  scripts/matrix_coverage_regression_test.py
python3 scripts/matrix_coverage_regression_test.py
mkdir -p reports/matrix-coverage
python3 scripts/check_matrix_coverage.py \
  --verbose \
  --json-out reports/matrix-coverage/report.json \
  | tee reports/matrix-coverage/report.log
python3 scripts/matrix_coverage_contexts.py \
  --json-out reports/matrix-coverage/contexts.json \
  --markdown-out reports/matrix-coverage/contexts.md

# Full-history forensic witness.
git fetch --no-tags origin '+refs/heads/*:refs/remotes/origin/*'
node --check scripts/repository_history_forensic_audit.mjs
node -e "JSON.parse(require('node:fs').readFileSync('projects/gb-is-my-strength/verified/closed-unmerged-pr-dispositions.json', 'utf8'))"
GITHUB_TOKEN="${GITHUB_TOKEN}" node scripts/repository_history_forensic_audit.mjs --strict

# Generated diagnostics must not enter the permanent tree.
rm -rf reports/matrix-coverage scripts/__pycache__
rm -f reports/repository-history-forensic-audit.json reports/repository-history-forensic-audit.md
find . -type d -name __pycache__ -prune -exec rm -rf {} +
git diff --check origin/main
{ git diff --name-only origin/main; git ls-files --others --exclude-standard; } | sort -u > "${RUNNER_TEMP}/changed-after.txt"
diff -u "${RUNNER_TEMP}/expected.txt" "${RUNNER_TEMP}/changed-after.txt"

# Commit only the three already inventoried SSOT files and staged temp deletions.
git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git add -- "${MATRIX}" "${NEXT}" "${REVERIFY}" "${HELPER}" "${RUNNER}" "${TEMP_WORKFLOW}"
git diff --cached --quiet && { echo 'No AuditRepo closure candidate generated'; exit 1; }
git commit -m 'audit(search): close SEARCH-P1-04'
git push origin "HEAD:${BRANCH}"
