#!/bin/bash
set -e

# Fix permissions for Vite binary
chmod +x node_modules/.bin/vite 2>/dev/null || true

# Run the build
npx vite build