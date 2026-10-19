#!/usr/bin/env bash
# Build for GitHub Pages and publish out/ to the gh-pages branch.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf out
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/cube-supper-club npx next build
python scripts/flatten-rsc.py out
touch out/.nojekyll
cd out
git init -q -b gh-pages
git add -A
git commit -qm "Deploy $(date +%Y-%m-%d)"
git push -q -f https://github.com/OlekCodeTech/cube-supper-club.git gh-pages
rm -rf .git
echo "Deployed: https://olekcodetech.github.io/cube-supper-club/"
