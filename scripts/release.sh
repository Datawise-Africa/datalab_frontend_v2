#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# Release Bump Script (language-agnostic)
# Bumps version, generates categorized release
# notes, commits, and tags.
#
# Supports: package.json, pyproject.toml, setup.cfg
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
      echo ""
      echo "Supported version files (searched in order):"
      echo "  package.json          Node.js / JavaScript projects"
      echo "  pyproject.toml        Python projects (PEP 621 / Poetry)"
      echo "  setup.cfg             Python projects (setuptools)"
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
CHANGELOG="$PROJECT_ROOT/CHANGELOG.md"

# ─────────────────────────────────────────────
# Detect version file
# ─────────────────────────────────────────────
VERSION_FILE=""
VERSION_FILE_TYPE=""

if [[ -f "$PROJECT_ROOT/package.json" ]]; then
  VERSION_FILE="$PROJECT_ROOT/package.json"
  VERSION_FILE_TYPE="package.json"
elif [[ -f "$PROJECT_ROOT/pyproject.toml" ]]; then
  VERSION_FILE="$PROJECT_ROOT/pyproject.toml"
  VERSION_FILE_TYPE="pyproject.toml"
elif [[ -f "$PROJECT_ROOT/setup.cfg" ]]; then
  VERSION_FILE="$PROJECT_ROOT/setup.cfg"
  VERSION_FILE_TYPE="setup.cfg"
else
  echo "Error: No supported version file found (package.json, pyproject.toml, setup.cfg)."
  exit 1
fi

echo "Detected version file: $VERSION_FILE_TYPE"

# ─────────────────────────────────────────────
# Version file read/write helpers
# ─────────────────────────────────────────────
read_version() {
  case "$VERSION_FILE_TYPE" in
    package.json)
      grep -oP '"version"\s*:\s*"\K[^"]+' "$VERSION_FILE" | head -1
      ;;
    pyproject.toml)
      grep -oP '^version\s*=\s*"\K[^"]+' "$VERSION_FILE" | head -1
      ;;
    setup.cfg)
      grep -oP '^version\s*=\s*\K\S+' "$VERSION_FILE" | head -1
      ;;
  esac
}

write_version() {
  local new_version="$1"
  case "$VERSION_FILE_TYPE" in
    package.json)
      sed -i "s/\"version\"\s*:\s*\"[^\"]*\"/\"version\": \"$new_version\"/" "$VERSION_FILE"
      ;;
    pyproject.toml)
      sed -i "s/^version\s*=\s*\"[^\"]*\"/version = \"$new_version\"/" "$VERSION_FILE"
      ;;
    setup.cfg)
      sed -i "s/^version\s*=\s*\S\+/version = $new_version/" "$VERSION_FILE"
      ;;
  esac
}

# ─────────────────────────────────────────────
# 1. Read current version
# ─────────────────────────────────────────────
CURRENT_VERSION=$(read_version)
if [[ -z "$CURRENT_VERSION" ]]; then
  CURRENT_VERSION="0.0.0"
fi
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
LOG_FORMAT="%s (%h)"

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
    commits=$(git log "$RANGE" --pretty=format:"$LOG_FORMAT" --no-merges | grep -iE "^$pattern" | sed -E "s/^$pattern: ?//i" || true)
  else
    commits=$(git log --pretty=format:"$LOG_FORMAT" --no-merges | grep -iE "^$pattern" | sed -E "s/^$pattern: ?//i" || true)
  fi

  if [[ -n "$commits" ]]; then
    echo ""
    echo "### $title"
    echo ""
    while IFS= read -r line; do
      echo "- $line"
    done <<< "$commits"
  fi
  return 0
}

generate_jira_section() {
  local commits

  if [[ -n "$RANGE" ]]; then
    commits=$(git log "$RANGE" --pretty=format:"$LOG_FORMAT" --no-merges | grep -E "^ENG-[0-9]+([: ])" || true)
  else
    commits=$(git log --pretty=format:"$LOG_FORMAT" --no-merges | grep -E "^ENG-[0-9]+([: ])" || true)
  fi

  if [[ -n "$commits" ]]; then
    echo ""
    echo "### Jira Tickets"
    echo ""
    while IFS= read -r line; do
      echo "- $line"
    done <<< "$commits"
  fi
  return 0
}

generate_uncategorized() {
  local commits

  if [[ -n "$RANGE" ]]; then
    commits=$(git log "$RANGE" --pretty=format:"$LOG_FORMAT" --no-merges | grep -ivE "^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:" | grep -vE "^ENG-[0-9]+([: ])" || true)
  else
    commits=$(git log --pretty=format:"$LOG_FORMAT" --no-merges | grep -ivE "^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:" | grep -vE "^ENG-[0-9]+([: ])" || true)
  fi

  if [[ -n "$commits" ]]; then
    echo ""
    echo "### Other Changes"
    echo ""
    while IFS= read -r line; do
      echo "- $line"
    done <<< "$commits"
  fi
  return 0
}

# Build the release notes
RELEASE_NOTES=$(cat <<NOTES_EOF
## [v$NEXT_VERSION] — $TODAY
$(generate_section "Features" "feat(\(.+\))?")
$(generate_section "Bug Fixes" "fix(\(.+\))?")
$(generate_section "Documentation" "docs(\(.+\))?")
$(generate_section "Style" "style(\(.+\))?")
$(generate_section "Performance" "perf(\(.+\))?")
$(generate_section "Refactoring" "refactor(\(.+\))?")
$(generate_section "Tests" "test(\(.+\))?")
$(generate_section "Build & CI" "(build|ci)(\(.+\))?")
$(generate_section "Reverts" "revert(\(.+\))?")
$(generate_section "Chores" "chore(\(.+\))?")
$(generate_jira_section)
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
# 5. Update version file
# ─────────────────────────────────────────────
write_version "$NEXT_VERSION"
echo "Updated $VERSION_FILE_TYPE to v$NEXT_VERSION"

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
git add "$VERSION_FILE" "$CHANGELOG"
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
