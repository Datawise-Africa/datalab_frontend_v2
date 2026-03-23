#!/usr/bin/env node

/**
 * Release Bump Script
 *
 * Bumps version in package.json, generates categorized release notes
 * in CHANGELOG.md, commits, and tags — all locally.
 *
 * Usage:
 *   node scripts/release.mjs patch
 *   node scripts/release.mjs minor
 *   node scripts/release.mjs major
 *   node scripts/release.mjs patch --prerelease beta
 *   node scripts/release.mjs minor --dry-run
 *   node scripts/release.mjs --help
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function run(cmd) {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

function runSafe(cmd) {
  try {
    return run(cmd);
  } catch {
    return '';
  }
}

function log(msg) {
  console.log(msg);
}

function error(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

function divider(title) {
  log('');
  log('═══════════════════════════════════════');
  log(`  ${title}`);
  log('═══════════════════════════════════════');
  log('');
}

// ─────────────────────────────────────────────
// Parse arguments
// ─────────────────────────────────────────────

const VALID_BUMPS = ['patch', 'minor', 'major'];
const args = process.argv.slice(2);

let bumpType = '';
let prerelease = '';
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (VALID_BUMPS.includes(arg)) {
    bumpType = arg;
  } else if (arg === '--prerelease') {
    prerelease = args[++i];
    if (!prerelease) {
      error('--prerelease requires a tag (e.g., beta, rc)');
    }
  } else if (arg === '--dry-run') {
    dryRun = true;
  } else if (arg === '-h' || arg === '--help') {
    log(`Usage: node scripts/release.mjs <patch|minor|major> [options]

Arguments:
  patch|minor|major     Version bump type (required)

Options:
  --prerelease <tag>    Pre-release tag (e.g., beta, rc)
  --dry-run             Preview changes without committing or tagging
  -h, --help            Show this help message

Examples:
  node scripts/release.mjs patch
  node scripts/release.mjs minor --prerelease beta
  node scripts/release.mjs major --dry-run`);
    process.exit(0);
  } else {
    error(`Unknown argument '${arg}'. Run with --help for usage.`);
  }
}

if (!bumpType) {
  error('Bump type is required (patch, minor, or major). Run with --help for usage.');
}

// ─────────────────────────────────────────────
// Pre-flight checks
// ─────────────────────────────────────────────

const isGitRepo = runSafe('git rev-parse --is-inside-work-tree');
if (isGitRepo !== 'true') {
  error('Not inside a git repository.');
}

const dirty = runSafe('git status --porcelain');
if (dirty) {
  error('Working tree is not clean. Commit or stash your changes first.');
}

// ─────────────────────────────────────────────
// 1. Read current version
// ─────────────────────────────────────────────

const projectRoot = run('git rev-parse --show-toplevel');
const packageJsonPath = resolve(projectRoot, 'package.json');
const changelogPath = resolve(projectRoot, 'CHANGELOG.md');

const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const currentVersion = pkg.version || '0.0.0';

log(`Current version: v${currentVersion}`);

// ─────────────────────────────────────────────
// 2. Calculate next version
// ─────────────────────────────────────────────

const base = currentVersion.replace(/-.*/, '');
let [major, minor, patch] = base.split('.').map(Number);

switch (bumpType) {
  case 'major':
    major++;
    minor = 0;
    patch = 0;
    break;
  case 'minor':
    minor++;
    patch = 0;
    break;
  case 'patch':
    patch++;
    break;
}

let nextVersion = `${major}.${minor}.${patch}`;
if (prerelease) {
  nextVersion = `${nextVersion}-${prerelease}`;
}

log(`Next version:    v${nextVersion}`);
log('');

// ─────────────────────────────────────────────
// 3. Generate release notes
// ─────────────────────────────────────────────

const previousTag = runSafe('git describe --tags --abbrev=0');
const today = new Date().toISOString().split('T')[0];

const range = previousTag ? `${previousTag}..HEAD` : '';
if (previousTag) {
  log(`Generating changelog from ${previousTag} to HEAD...`);
} else {
  log('No previous tag found. Generating changelog from all commits...');
}

function getCommits() {
  const logCmd = range
    ? `git log ${range} --pretty=format:"%s (%h)" --no-merges`
    : `git log --pretty=format:"%s (%h)" --no-merges`;
  return runSafe(logCmd).split('\n').filter(Boolean);
}

const commits = getCommits();

const SECTIONS = [
  { title: 'Features', pattern: /^feat(\(.+\))?:\s*/i },
  { title: 'Bug Fixes', pattern: /^fix(\(.+\))?:\s*/i },
  { title: 'Documentation', pattern: /^docs(\(.+\))?:\s*/i },
  { title: 'Performance', pattern: /^perf(\(.+\))?:\s*/i },
  { title: 'Refactoring', pattern: /^refactor(\(.+\))?:\s*/i },
  { title: 'Tests', pattern: /^test(\(.+\))?:\s*/i },
  { title: 'Build & CI', pattern: /^(build|ci)(\(.+\))?:\s*/i },
  { title: 'Chores', pattern: /^chore(\(.+\))?:\s*/i },
];

const ALL_TYPES_PATTERN = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:/i;

const categorized = new Set();
const sections = [];

for (const { title, pattern } of SECTIONS) {
  const matching = commits.filter((c) => pattern.test(c));
  if (matching.length > 0) {
    sections.push(`\n### ${title}\n`);
    for (const commit of matching) {
      sections.push(`- ${commit.replace(pattern, '')}`);
      categorized.add(commit);
    }
  }
}

// Uncategorized commits
const uncategorized = commits.filter(
  (c) => !categorized.has(c) && !ALL_TYPES_PATTERN.test(c),
);
if (uncategorized.length > 0) {
  sections.push(`\n### Other Changes\n`);
  for (const commit of uncategorized) {
    sections.push(`- ${commit}`);
  }
}

const releaseNotes = [`## [v${nextVersion}] — ${today}`, ...sections].join('\n');

divider('Release Notes');
log(releaseNotes);

// ─────────────────────────────────────────────
// 4. Dry run — stop here
// ─────────────────────────────────────────────

if (dryRun) {
  divider('DRY RUN — no changes made');
  process.exit(0);
}

// ─────────────────────────────────────────────
// 5. Update package.json
// ─────────────────────────────────────────────

pkg.version = nextVersion;
writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
log(`Updated package.json to v${nextVersion}`);

// ─────────────────────────────────────────────
// 6. Update CHANGELOG.md
// ─────────────────────────────────────────────

if (existsSync(changelogPath)) {
  const existing = readFileSync(changelogPath, 'utf-8');
  const lines = existing.split('\n');
  const header = lines.slice(0, 2).join('\n');
  const body = lines.slice(2).join('\n');
  writeFileSync(changelogPath, `${header}\n\n${releaseNotes}\n${body}`);
} else {
  writeFileSync(
    changelogPath,
    `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n${releaseNotes}\n`,
  );
}
log('Updated CHANGELOG.md');

// ─────────────────────────────────────────────
// 7. Commit and tag
// ─────────────────────────────────────────────

run(`git add "${packageJsonPath}" "${changelogPath}"`);
run(`git commit -m "chore(release): v${nextVersion}"`);
run(`git tag -a "v${nextVersion}" -m "Release v${nextVersion}"`);

const currentBranch = run('git branch --show-current');

divider(`Released v${nextVersion}`);
log('Next steps:');
log(`  git push origin ${currentBranch}`);
log(`  git push origin v${nextVersion}`);
log('');
