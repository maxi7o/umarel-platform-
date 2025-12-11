#!/bin/bash

# Umarel Auto-Sync Script
# Usage: ./scripts/git_sync.sh "Commit message"

MSG="${1:-Auto-save by Umarel Agent}"

echo "🚀 Syncing to GitHub..."
git add .
git commit -m "$MSG"
git push origin main

echo "✅ Done!"
