#!/bin/bash
cd /Users/romansuslin_1/Downloads/All_Code/barista-course
git add open-coffeeshop/
git diff --cached --stat
if git diff --cached --quiet; then
  echo "Already up to date — nothing to commit"
else
  git commit -m "feat: open-coffeeshop — tilda-blocks 8 blocks, CONTEXT.md, smooth scroll, SEO"
  git push origin main
  echo "PUSHED OK"
fi
