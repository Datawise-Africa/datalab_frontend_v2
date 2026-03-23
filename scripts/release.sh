#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# Release Bump Script
# Bumps version in package.json, generates
# release notes, commits, and tags.
# ─────────────────────────────────────────────
# Usage:
#   ./scripts/release.sh patch
#   ./scripts/release.sh minor
#   ./scripts/release.sh major
#   ./scripts/release.sh patch --prerelease beta
#   ./scripts/release.sh minor --dry-run
# ─────────────────────────────────────────────

BUMP_TYPE=""
PRERELEASE=""
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    patch|minor|major)
      BUMP_TYPE="$1"
      shift
      ;;
    --prerelease)
      PRERELEASE="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 <patch|minor|major> [--prerelease <tag>] [--dry-run]"
      echo ""
      echo "Arguments:"
      echo "  patch|minor|major     Version bump type (required)"
      echo "  --prerelease <tag>    Pre-release tag (e.g., beta, rc)"
      echo "  --dry-run             Preview changes without committing or tagging"
      exit 0
      ;;
    *)
      echo "Error: Unknown argument '$1'"
      echo "Run '$0 --help' for usage."
      exit 1
      ;;
  esac
done

if [[ -z "$BUMP_TYPE" ]]; then
  echo "Error: Bump type is required (patch, minor, or major)"
  echo "Run '$0 --help' for usage."
  exit 1
fi

# Ensure we're in a git repo
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "Error: Not inside a git repository."
  exit 1
fi

# Ensure working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: Working tree is not clean. Commit or stash your changes first."
  exit 1
fi

# Get project root
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
PACKAGE_JSON="$PROJECT_ROOT/package.json"
CHANGELOG="$PROJECT_ROOT/CHANGELOG.md"

# ─────────────────────────────────────────────
# 1. Read current version
# ─────────────────────────────────────────────
CURRENT_VERSION=$(node -p "require('$PACKAGE_JSON').version || '0.0.0'")
echo "Current version: v$CURRENT_VERSION"

# ─────────────────────────────────────────────
# 2. Calculate next version
# ─────────────────────────────────────────────
BASE=$(echo "$CURRENT_VERSION" | sed 's/-.*//')
IFS='.' read -r MAJOR MINOR PATCH <<< "$BASE"

case "$BUMP_TYPE" in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
esac

NEXT_VERSION="$MAJOR.$MINOR.$PATCH"
if [[ -n "$PRERELEASE" ]]; then
  NEXT_VERSION="$NEXT_VERSION-$PRERELEASE"
fi

echo "Next version:    v$NEXT_VERSION"
echo ""

# ─────────────────────────────────────────────
# 3. Generate release notes
# ─────────────────────────────────────────────
PREVIOUS_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
TODAY=$(date +%Y-%m-%d)

# Collect commits grouped by conventional commit type
if [[ -n "$PREVIOUS_TAG" ]]; then
  RANGE="$PREVIOUS_TAG..HEAD"
  echo "Generating changelog from $PREVIOUS_TAG to HEAD..."
else
  RANGE=""
  echo "No previous tag found. Generating changelog from all commits..."
fi

generate_section() {
  local title="$1"
  local pattern="$2"
  local commits

  if [[ -n "$RANGE" ]]; then
    commits=$(git log "$RANGE" --pretty=format:"%s (%h)" --no-merges | grep -iE "^$pattern" | sed -E "s/^$pattern: ?//i" || true)
  else
    commits=$(git log --pretty=format:"%s (%h)" --no-merges | grep -iE "^$pattern" | sed -E "s/^$pattern: ?//i" || true)
  fi

  if [[ -n "$commits" ]]; then
    echo ""
    echo "### $title"
    echo ""
    while IFS= read -r line; do
      echo "- $line"
    done <<< "$commits"
  fi
}

generate_uncategorized() {
  local commits

  if [[ -n "$RANGE" ]]; then
    commits=$(git log "$RANGE" --pretty=format:"%s (%h)" --no-merges | grep -ivE "^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:" || true)
  else
    commits=$(git log --pretty=format:"%s (%h)" --no-merges | grep -ivE "^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:" || true)
  fi

  if [[ -n "$commits" ]]; then
    echo ""
    echo "### Other Changes"
    echo ""
    while IFS= read -r line; do
      echo "- $line"
    done <<< "$commits"
  fi
}

# Build the release notes
RELEASE_NOTES=$(cat <<NOTES_EOF
## [v$NEXT_VERSION] — $TODAY
$(generate_section "Features" "feat(\(.+\))?")
$(generate_section "Bug Fixes" "fix(\(.+\))?")
$(generate_section "Documentation" "docs(\(.+\))?")
$(generate_section "Performance" "perf(\(.+\))?")
$(generate_section "Refactoring" "refactor(\(.+\))?")
$(generate_section "Tests" "test(\(.+\))?")
$(generate_section "Build & CI" "(build|ci)(\(.+\))?")
$(generate_section "Chores" "chore(\(.+\))?")
$(generate_uncategorized)
NOTES_EOF
)

# Clean up empty lines
RELEASE_NOTES=$(echo "$RELEASE_NOTES" | sed '/^$/N;/^\n$/d')

echo ""
echo "═══════════════════════════════════════"
echo "  Release Notes"
echo "═══════════════════════════════════════"
echo ""
echo "$RELEASE_NOTES"
echo ""

# ─────────────────────────────────────────────
# 4. Dry run — stop here
# ─────────────────────────────────────────────
if [[ "$DRY_RUN" == true ]]; then
  echo "═══════════════════════════════════════"
  echo "  DRY RUN — no changes made"
  echo "═══════════════════════════════════════"
  exit 0
fi

# ─────────────────────────────────────────────
# 5. Update package.json
# ─────────────────────────────────────────────
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('$PACKAGE_JSON', 'utf8'));
  pkg.version = '$NEXT_VERSION';
  fs.writeFileSync('$PACKAGE_JSON', JSON.stringify(pkg, null, 2) + '\n');
"
echo "Updated package.json to v$NEXT_VERSION"

# ─────────────────────────────────────────────
# 6. Update CHANGELOG.md
# ─────────────────────────────────────────────
if [[ -f "$CHANGELOG" ]]; then
  # Insert new release notes after the header
  EXISTING=$(cat "$CHANGELOG")
  HEADER=$(echo "$EXISTING" | head -n 2)
  BODY=$(echo "$EXISTING" | tail -n +3)
  cat > "$CHANGELOG" <<EOF
$HEADER

$RELEASE_NOTES
$BODY
EOF
else
  cat > "$CHANGELOG" <<EOF
# Changelog

All notable changes to this project will be documented in this file.

$RELEASE_NOTES
EOF
fi
echo "Updated CHANGELOG.md"

# ─────────────────────────────────────────────
# 7. Commit and tag
# ─────────────────────────────────────────────
git add "$PACKAGE_JSON" "$CHANGELOG"
git commit -m "chore(release): v$NEXT_VERSION"
git tag -a "v$NEXT_VERSION" -m "Release v$NEXT_VERSION"

echo ""
echo "═══════════════════════════════════════"
echo "  Released v$NEXT_VERSION"
echo "═══════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  git push origin $(git branch --show-current)"
echo "  git push origin v$NEXT_VERSION"
