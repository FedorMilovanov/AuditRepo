#!/usr/bin/env node
/**
 * Read-only forensic inventory for AuditRepo Git refs and pull-request heads.
 *
 * The permanent reviewed PR dispositions live in
 * projects/gb-is-my-strength/verified/closed-unmerged-pr-dispositions.json.
 * Branch recoverability is proved by exact-SHA archive refs discovered from the
 * live Git graph. New branches and PRs are still discovered from the live Git
 * graph and GitHub API.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORTS = path.join(ROOT, 'reports');
const LEDGER_PATH = path.join(
  ROOT,
  'projects/gb-is-my-strength/verified/closed-unmerged-pr-dispositions.json',
);
const REPOSITORY = process.env.GITHUB_REPOSITORY || 'FedorMilovanov/AuditRepo';
const TOKEN = process.env.GITHUB_TOKEN || '';
const API = process.env.GITHUB_API_URL || 'https://api.github.com';
const STRICT = process.argv.includes('--strict');
const problems = [];

export const STRICT_ZERO_SUMMARY_KEYS = Object.freeze([
  'inaccessibleClosedHeads',
  'manualReviewCandidates',
  'unexplainedRemoteBranches',
]);

export function strictSummaryProblems(summary) {
  return STRICT_ZERO_SUMMARY_KEYS.flatMap((key) => {
    const value = summary?.[key];
    if (!Number.isInteger(value) || value < 0) {
      return [`Strict history summary ${key} must be a non-negative integer; observed ${String(value)}`];
    }
    return value === 0
      ? []
      : [`Strict history summary requires ${key}=0; observed ${value}`];
  });
}

function git(args, { allowFailure = false } = {}) {
  const result = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0 && !allowFailure) {
    throw new Error(`git ${args.join(' ')} failed (${result.status}): ${result.stderr || result.stdout}`);
  }
  return {
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

async function request(apiPath, { allowNotFound = false } = {}) {
  const response = await fetch(`${API}${apiPath}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      'User-Agent': 'auditrepo-history-forensic-audit',
    },
  });
  if (allowNotFound && response.status === 404) return null;
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${apiPath} failed ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.json();
}

async function listPaged(apiPath) {
  const items = [];
  for (let page = 1; ; page += 1) {
    const separator = apiPath.includes('?') ? '&' : '?';
    const batch = await request(`${apiPath}${separator}per_page=100&page=${page}`);
    if (!Array.isArray(batch)) throw new Error(`Expected array from ${apiPath}`);
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items;
}

function loadLedger() {
  const parsed = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
  if (parsed.schemaVersion !== 1 || !parsed.pullRequests || typeof parsed.pullRequests !== 'object') {
    throw new Error('Unsupported closed-unmerged disposition ledger');
  }
  return parsed;
}

function evidenceText(pr, comments = []) {
  return [pr.title || '', pr.body || '', ...comments.map((comment) => comment.body || '')].join('\n');
}

function classifyClosedPr(pr, comments = []) {
  const text = evidenceText(pr, comments);
  if (/(?:superseded|replaced|replacement|rebuilt|duplicate|stale duplicate|замен(?:ён|ен|ена|ено)|пересобран|дубликат|уже\s+слит[а-я]*\s+(?:pr\s*)?#?\d+)/i.test(text)) {
    return 'superseded';
  }
  if (/(?:prototype|прототип|showcase)/i.test(text)) return 'prototype';
  if (/(?:do not merge|must not be merged|not\s+(?:a\s+)?(?:merge\s+)?candidate|evidence[- ]lane|evidence[- ]only|не\s+кандидат\s+на\s+merge|не\s+сливать|diagnostic|диагност|\bprobe\b|trigger[- ]only|event[- ]only|temporary|временн(?:ый|ая|ое)|verification\s+only|read[- ]only\s+verification)/i.test(text)) {
    return 'diagnostic';
  }
  if (/(?:parked|deferred|\bon hold\b|follow[- ]?up|recreate\s+from\s+fresh\s+main|запаркован|отложен|не\s+готов)/i.test(text)) {
    return 'parked';
  }
  return 'unclassified';
}

function referencedPrNumbers(pr, comments = [], disposition = null) {
  const own = Number(pr.number);
  const found = [...evidenceText(pr, comments).matchAll(/#(\d+)/g)]
    .map((match) => Number(match[1]));
  const configured = disposition?.replacementPrs || [];
  return [...new Set([...found, ...configured])]
    .filter((number) => Number.isInteger(number) && number !== own)
    .sort((a, b) => a - b);
}

function currentPathExists(filename) {
  return fs.existsSync(path.join(ROOT, filename));
}

function missingPathKind(filename) {
  if (/^projects\/[^/]+\/(?:verified|reverify|verification|working)\//.test(filename)) return 'governed-evidence';
  if (/^projects\/[^/]+\/incoming\//.test(filename)) return 'raw-intake';
  if (/^projects\/[^/]+\/archive\//.test(filename)) return 'archive-evidence';
  if (/^\.github\/workflows\//.test(filename)) return 'workflow';
  if (/^scripts\//.test(filename)) return 'audit-or-tooling';
  if (/(?:trigger|materializ|reconcile|proof|witness|diagnostic|verification)(?:\.|-|\/)/i.test(filename)) return 'temporary-transaction';
  return 'other';
}

function associatedPrSnapshot(pr, closedByNumber) {
  const closed = closedByNumber.get(pr.number);
  return {
    number: pr.number,
    title: pr.title,
    state: pr.state,
    mergedAt: pr.merged_at || null,
    category: closed?.category || null,
    ledgerResolved: Boolean(closed?.ledgerDisposition),
    url: pr.html_url,
  };
}

export function reconcileBranch(branch, archivedRefsBySha = new Map()) {
  const archiveRefs = [...(archivedRefsBySha.get(branch.sha) || [])]
    .filter((name) => name !== branch.name)
    .sort();

  let reconciliation = 'orphan-branch';
  if (branch.name === 'origin/main') reconciliation = 'main';
  else if (branch.name.startsWith('origin/archive/')) reconciliation = 'archived-recovery-branch';
  else if (branch.mergedIntoMain) reconciliation = 'git-ancestor-of-main';
  else if (branch.associatedPrs.some((pr) => pr.mergedAt)) reconciliation = 'merged-pr-head-squash-or-rebase';
  else if (branch.associatedPrs.some((pr) => pr.state === 'open')) reconciliation = 'open-pr-head';
  else if (branch.associatedPrs.some((pr) => pr.category === 'superseded')) reconciliation = 'closed-superseded-pr-head';
  else if (branch.associatedPrs.some((pr) => pr.category === 'diagnostic')) reconciliation = 'closed-diagnostic-pr-head';
  else if (branch.associatedPrs.some((pr) => pr.category === 'prototype')) reconciliation = 'closed-prototype-pr-head';
  else if (branch.associatedPrs.some((pr) => pr.category === 'archived')) reconciliation = 'closed-archived-pr-head';
  else if (archiveRefs.length) reconciliation = 'archived-source-ref';
  else if (branch.associatedPrs.some((pr) => pr.category === 'parked')) reconciliation = 'closed-parked-pr-head';
  else if (branch.associatedPrs.length) reconciliation = 'closed-unclassified-pr-head';
  else if (/(?:trigger|materializ|diagnostic|verification|reconcile|_temp|temp-)/i.test(`${branch.name} ${branch.subject || ''}`)) {
    reconciliation = 'diagnostic-transaction-branch';
  }

  return { reconciliation, archiveRefs };
}

function branchInventory(prs, closedByNumber) {
  const byHeadRef = new Map();
  const byHeadSha = new Map();
  for (const pr of prs) {
    if (pr.head?.repo?.full_name !== REPOSITORY) continue;
    if (pr.head?.ref) {
      const key = `origin/${pr.head.ref}`;
      const list = byHeadRef.get(key) || [];
      list.push(pr);
      byHeadRef.set(key, list);
    }
    if (pr.head?.sha) {
      const list = byHeadSha.get(pr.head.sha) || [];
      list.push(pr);
      byHeadSha.set(pr.head.sha, list);
    }
  }

  const rows = git([
    'for-each-ref',
    '--format=%(refname:short)\t%(objectname)\t%(committerdate:iso8601-strict)\t%(subject)',
    'refs/remotes/origin',
  ]).stdout.split(/\r?\n/).filter(Boolean);

  const branches = rows
    .map((row) => {
      const [name, sha, committedAt, ...subjectParts] = row.split('\t');
      return { name, sha, committedAt, subject: subjectParts.join('\t') };
    })
    .filter((branch) => branch.name !== 'origin/HEAD');

  const archivedRefsBySha = new Map();
  for (const branch of branches.filter((item) => item.name.startsWith('origin/archive/'))) {
    const refs = archivedRefsBySha.get(branch.sha) || [];
    refs.push(branch.name);
    archivedRefsBySha.set(branch.sha, refs);
  }

  return branches
    .map((branch) => {
      const mergedIntoMain = git(['merge-base', '--is-ancestor', branch.sha, 'origin/main'], { allowFailure: true }).status === 0;
      const counts = git(['rev-list', '--left-right', '--count', `origin/main...${branch.sha}`], { allowFailure: true });
      let mainOnly = null;
      let branchOnly = null;
      if (counts.status === 0) [mainOnly, branchOnly] = counts.stdout.split(/\s+/).map(Number);

      const associated = new Map();
      for (const pr of [...(byHeadRef.get(branch.name) || []), ...(byHeadSha.get(branch.sha) || [])]) {
        associated.set(pr.number, pr);
      }
      const associatedPrs = [...associated.values()]
        .map((pr) => associatedPrSnapshot(pr, closedByNumber))
        .sort((a, b) => b.number - a.number);

      const { reconciliation, archiveRefs } = reconcileBranch(
        { ...branch, mergedIntoMain, associatedPrs },
        archivedRefsBySha,
      );

      return {
        ...branch,
        mergedIntoMain,
        mainOnly,
        branchOnly,
        reconciliation,
        archiveRefs,
        associatedPrs,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function closedUnmergedInventory(prs, prsByNumber, ledger) {
  const candidates = prs.filter((pr) => pr.state === 'closed' && !pr.merged_at);
  const results = [];

  for (const pr of candidates) {
    const [comments, files] = await Promise.all([
      listPaged(`/repos/${REPOSITORY}/issues/${pr.number}/comments`),
      listPaged(`/repos/${REPOSITORY}/pulls/${pr.number}/files`),
    ]);
    const headSha = pr.head?.sha || null;
    const commit = headSha
      ? await request(`/repos/${REPOSITORY}/commits/${headSha}`, { allowNotFound: true })
      : null;
    const disposition = ledger.pullRequests[String(pr.number)] || null;
    const category = disposition?.category || classifyClosedPr(pr, comments);
    const references = referencedPrNumbers(pr, comments, disposition);
    const referencedPullRequests = references
      .map((number) => prsByNumber.get(number))
      .filter(Boolean)
      .map((referenced) => ({
        number: referenced.number,
        title: referenced.title,
        state: referenced.state,
        mergedAt: referenced.merged_at || null,
        url: referenced.html_url,
      }));

    const normalizedFiles = files.map((file) => ({
      filename: file.filename,
      previousFilename: file.previous_filename || null,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      existsInMain: currentPathExists(file.filename),
    }));
    const missingIntroduced = normalizedFiles
      .filter((file) => ['added', 'renamed'].includes(file.status) && !file.existsInMain)
      .map((file) => ({ filename: file.filename, kind: missingPathKind(file.filename) }));

    const headAccessible = Boolean(commit);
    if (!headAccessible) {
      problems.push(`PR #${pr.number}: head commit ${headSha || '(missing sha)'} is not accessible through GitHub`);
    }

    let reviewPriority = 0;
    if (!headAccessible) reviewPriority += 100;
    if (!disposition && ['unclassified', 'parked'].includes(category)) {
      reviewPriority += category === 'unclassified' ? 10 : 8;
      reviewPriority += missingIntroduced.length * 2;
      if (!references.length) reviewPriority += 3;
    }

    results.push({
      number: pr.number,
      title: pr.title,
      url: pr.html_url,
      createdAt: pr.created_at,
      closedAt: pr.closed_at,
      headRef: pr.head?.ref || null,
      headRepo: pr.head?.repo?.full_name || null,
      headSha,
      headAccessible,
      category,
      ledgerDisposition: disposition,
      closureComments: comments.map((comment) => ({
        createdAt: comment.created_at,
        author: comment.user?.login || null,
        body: comment.body || '',
      })),
      referencedPullRequests,
      files: normalizedFiles,
      missingIntroduced,
      missingIntroducedPaths: missingIntroduced.map((item) => item.filename),
      reviewPriority,
    });
  }

  return results.sort((a, b) => b.reviewPriority - a.reviewPriority || b.number - a.number);
}

function validateLedger(ledger, prsByNumber, closedUnmerged) {
  const closedNumbers = new Set(closedUnmerged.map((pr) => String(pr.number)));
  for (const [number, disposition] of Object.entries(ledger.pullRequests)) {
    const pr = prsByNumber.get(Number(number));
    if (!pr) problems.push(`Disposition ledger references missing PR #${number}`);
    else if (pr.state !== 'closed' || pr.merged_at) problems.push(`Disposition ledger PR #${number} is no longer closed-unmerged`);
    if (!closedNumbers.has(number)) problems.push(`Disposition ledger PR #${number} was not inventoried`);

    for (const replacement of disposition.replacementPrs || []) {
      const replacementPr = prsByNumber.get(Number(replacement));
      if (!replacementPr?.merged_at) problems.push(`PR #${number}: configured replacement #${replacement} is not merged`);
    }
    for (const commit of disposition.landedCommits || []) {
      if (git(['cat-file', '-e', `${commit}^{commit}`], { allowFailure: true }).status !== 0) {
        problems.push(`PR #${number}: configured landed commit ${commit} is not present in fetched history`);
      } else if (git(['merge-base', '--is-ancestor', commit, 'origin/main'], { allowFailure: true }).status !== 0) {
        problems.push(`PR #${number}: configured landed commit ${commit} is not an ancestor of origin/main`);
      }
    }
    if (disposition.archiveRef) {
      if (git(['show-ref', '--verify', '--quiet', `refs/remotes/origin/${disposition.archiveRef}`], { allowFailure: true }).status !== 0) {
        problems.push(`PR #${number}: configured archive ref ${disposition.archiveRef} is missing`);
      }
    }
  }
}

function markdown(report) {
  const archiveRows = report.branches
    .filter((branch) => branch.reconciliation === 'archived-source-ref')
    .flatMap((branch) => branch.archiveRefs.map((archiveRef) =>
      `| \`${branch.name}\` | \`${archiveRef}\` | \`${branch.sha}\` |`,
    ));
  const branchRows = report.branches
    .filter((branch) => branch.name !== 'origin/main' && !['git-ancestor-of-main', 'merged-pr-head-squash-or-rebase', 'archived-recovery-branch', 'archived-source-ref'].includes(branch.reconciliation))
    .map((branch) => `| \`${branch.name}\` | ${branch.reconciliation} | ${branch.branchOnly ?? '?'} | ${branch.mainOnly ?? '?'} | ${branch.associatedPrs.map((pr) => `#${pr.number}`).join(', ') || '—'} |`);
  const prRows = report.closedUnmerged.map((pr) =>
    `| #${pr.number} | ${pr.category} | ${pr.ledgerDisposition ? 'yes' : 'no'} | ${pr.headAccessible ? 'yes' : '**NO**'} | ${pr.missingIntroducedPaths.length} | ${pr.referencedPullRequests.filter((item) => item.mergedAt).map((item) => `#${item.number}`).join(', ') || '—'} | ${pr.reviewPriority} | ${pr.title.replace(/\|/g, '\\|')} |`,
  );
  const candidateRows = report.closedUnmerged
    .filter((pr) => pr.reviewPriority > 0)
    .map((pr) => `- PR #${pr.number} [${pr.category}, priority ${pr.reviewPriority}]: ${pr.title}`);

  return [
    '# AuditRepo repository history forensic audit',
    '',
    `- Repository: \`${report.repository}\``,
    `- Main SHA: \`${report.mainSha}\``,
    `- Disposition ledger: \`${report.dispositionLedger}\``,
    `- Remote branches: ${report.summary.remoteBranches}`,
    `- Reconciled merged refs: ${report.summary.reconciledMergedBranches}`,
    `- Archived recovery refs: ${report.summary.archivedRecoveryBranches}`,
    `- Source refs preserved at an exact-SHA archive ref: ${report.summary.archivedSourceBranches}`,
    `- Open PR refs: ${report.summary.openPrBranches}`,
    `- Explained closed/transaction refs: ${report.summary.explainedClosedBranches}`,
    `- Orphan or unclassified refs: ${report.summary.unexplainedRemoteBranches}`,
    `- Pull requests: ${report.summary.pullRequests}`,
    `- Closed without merge: ${report.summary.closedUnmergedPrs}`,
    `- Inaccessible closed heads: ${report.summary.inaccessibleClosedHeads}`,
    `- Manual review candidates: ${report.summary.manualReviewCandidates}`,
    '',
    '## Exact-SHA archive preservation',
    '',
    '| Source ref | Archive ref | Exact SHA |',
    '|---|---|---|',
    ...(archiveRows.length ? archiveRows : ['| — | — | — |']),
    '',
    '## Remote refs not fully reconciled by ancestry/archive/open-or-reviewed PR',
    '',
    '| Branch | Reconciliation | Branch-only | Main-only | Associated PRs |',
    '|---|---|---:|---:|---|',
    ...(branchRows.length ? branchRows : ['| — | fully reconciled | 0 | 0 | — |']),
    '',
    '## Closed-unmerged PR heads',
    '',
    '| PR | Category | Ledger | Head accessible | Missing introduced paths | Merged PR candidates | Priority | Title |',
    '|---:|---|---|---|---:|---|---:|---|',
    ...prRows,
    '',
    '## Manual recovery/review candidates',
    '',
    ...(candidateRows.length ? candidateRows : ['- None']),
    '',
    '## Interpretation boundary',
    '',
    '- Reachable head SHA proves pushed work is recoverable; it does not prove the work should be merged.',
    '- An archived source ref is reconciled only while a distinct `origin/archive/*` ref resolves to the same exact commit SHA.',
    '- The reviewed disposition ledger is traceable to the immutable closed-unmerged report and is validated against current PR/commit/ref state.',
    '- Commits that were never pushed cannot be found by a remote forensic audit.',
    '- This report does not advance source or production authority.',
    '',
  ].join('\n');
}

async function main() {
  const ledger = loadLedger();
  git(['fetch', '--prune', 'origin', '+refs/heads/*:refs/remotes/origin/*']);
  const mainSha = git(['rev-parse', 'origin/main']).stdout;
  const prs = await listPaged(`/repos/${REPOSITORY}/pulls?state=all&sort=created&direction=asc`);
  const prsByNumber = new Map(prs.map((pr) => [pr.number, pr]));
  const closedUnmerged = await closedUnmergedInventory(prs, prsByNumber, ledger);
  validateLedger(ledger, prsByNumber, closedUnmerged);
  const closedByNumber = new Map(closedUnmerged.map((pr) => [pr.number, pr]));
  const branches = branchInventory(prs, closedByNumber);

  const reconciledMerged = new Set(['main', 'git-ancestor-of-main', 'merged-pr-head-squash-or-rebase']);
  const explainedClosed = new Set([
    'closed-superseded-pr-head',
    'closed-diagnostic-pr-head',
    'closed-prototype-pr-head',
    'closed-archived-pr-head',
    'diagnostic-transaction-branch',
  ]);
  const summary = {
    remoteBranches: branches.length,
    reconciledMergedBranches: branches.filter((branch) => reconciledMerged.has(branch.reconciliation)).length,
    archivedRecoveryBranches: branches.filter((branch) => branch.reconciliation === 'archived-recovery-branch').length,
    archivedSourceBranches: branches.filter((branch) => branch.reconciliation === 'archived-source-ref').length,
    openPrBranches: branches.filter((branch) => branch.reconciliation === 'open-pr-head').length,
    explainedClosedBranches: branches.filter((branch) => explainedClosed.has(branch.reconciliation)).length,
    unexplainedRemoteBranches: branches.filter((branch) => ['orphan-branch', 'closed-parked-pr-head', 'closed-unclassified-pr-head'].includes(branch.reconciliation)).length,
    pullRequests: prs.length,
    mergedPrs: prs.filter((pr) => Boolean(pr.merged_at)).length,
    closedUnmergedPrs: closedUnmerged.length,
    openPrs: prs.filter((pr) => pr.state === 'open').length,
    inaccessibleClosedHeads: closedUnmerged.filter((pr) => !pr.headAccessible).length,
    missingIntroducedPaths: closedUnmerged.reduce((sum, pr) => sum + pr.missingIntroducedPaths.length, 0),
    manualReviewCandidates: closedUnmerged.filter((pr) => pr.reviewPriority > 0).length,
  };
  if (STRICT) problems.push(...strictSummaryProblems(summary));

  const report = {
    generatedAt: new Date().toISOString(),
    repository: REPOSITORY,
    mainSha,
    dispositionLedger: path.relative(ROOT, LEDGER_PATH),
    summary,
    branches,
    openPullRequests: prs.filter((pr) => pr.state === 'open').map((pr) => ({
      number: pr.number,
      title: pr.title,
      headRef: pr.head?.ref || null,
      headSha: pr.head?.sha || null,
      url: pr.html_url,
    })),
    closedUnmerged,
    problems,
  };

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(path.join(REPORTS, 'repository-history-forensic-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(REPORTS, 'repository-history-forensic-audit.md'), markdown(report));

  console.log(`AuditRepo history: ${report.summary.remoteBranches} branches, ${report.summary.pullRequests} PRs, ${report.summary.closedUnmergedPrs} closed-unmerged PRs`);
  console.log(`Recoverability: ${report.summary.inaccessibleClosedHeads} inaccessible heads; ${report.summary.manualReviewCandidates} manual candidates`);
  console.log(`Branch reconciliation: ${report.summary.unexplainedRemoteBranches} unexplained refs`);
  for (const problem of problems) console.error(`ERROR ${problem}`);
  if (STRICT && problems.length) process.exit(1);
  console.log('✅ AuditRepo repository history forensic inventory completed');
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
