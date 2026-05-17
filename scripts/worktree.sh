#!/usr/bin/env bash
set -e

BRANCH="${1:?Usage: wtf <branch-name>}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKTREES="$(dirname "$REPO")/finsight-worktrees"
TARGET="$WORKTREES/$BRANCH"

mkdir -p "$WORKTREES"

git -C "$REPO" worktree add -b "$BRANCH" "$TARGET"

if [ -f "$REPO/.env.local" ]; then
  cp "$REPO/.env.local" "$TARGET/.env.local"
  echo "  Copied .env.local"
fi

if [ -d "$REPO/.claude" ]; then
  cp -r "$REPO/.claude" "$TARGET/.claude"
  echo "  Copied .claude/"
fi

echo ""
echo "Worktree ready:"
echo "  Path:   $TARGET"
echo "  Branch: $BRANCH"
echo ""
echo "  cd $TARGET"
