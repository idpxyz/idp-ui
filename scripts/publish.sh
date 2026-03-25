#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}[publish]${NC} $*"; }
ok()   { echo -e "${GREEN}[  ok  ]${NC} $*"; }
warn() { echo -e "${YELLOW}[ warn ]${NC} $*"; }
fail() { echo -e "${RED}[ fail ]${NC} $*"; exit 1; }

BUMP="${1:-patch}"
case "$BUMP" in
  patch|minor|major) ;;
  *) fail "Usage: $0 [patch|minor|major]  (default: patch)" ;;
esac

log "IDP UI Package Publisher"
log "Version bump: ${YELLOW}${BUMP}${NC}"
echo ""

if ! command -v pnpm &>/dev/null; then
  fail "pnpm not found. Install: npm install -g pnpm"
fi

log "Step 1/4: Bumping versions..."
for pkg in packages/*/package.json; do
  dir="$(dirname "$pkg")"
  name="$(node -p "require('./$pkg').name")"
  old_ver="$(node -p "require('./$pkg').version")"

  IFS='.' read -r major minor patch <<< "$old_ver"
  case "$BUMP" in
    patch) patch=$((patch + 1)) ;;
    minor) minor=$((minor + 1)); patch=0 ;;
    major) major=$((major + 1)); minor=0; patch=0 ;;
  esac
  new_ver="${major}.${minor}.${patch}"

  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$pkg', 'utf8'));
    pkg.version = '$new_ver';
    fs.writeFileSync('$pkg', JSON.stringify(pkg, null, 2) + '\n');
  "
  ok "$name: $old_ver -> $new_ver"
done
echo ""

log "Step 2/4: Installing dependencies..."
pnpm install --no-frozen-lockfile --silent
ok "Dependencies installed"
echo ""

log "Step 3/4: Building all packages..."
pnpm build:packages
ok "Build complete"
echo ""

log "Step 4/4: Publishing to GitHub Packages..."
pnpm publish:all
ok "Published successfully!"
echo ""

NEW_VER="$(node -p "require('./packages/ui-workspace/package.json').version")"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} All packages published at v${NEW_VER}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "To update BIP workbench:"
echo "  cd /workspace/idp/idp-bip/apps/workbench"
echo "  npm install @idpxyz/ui-workspace@${NEW_VER} @idpxyz/ui-theme-runtime@${NEW_VER}"
