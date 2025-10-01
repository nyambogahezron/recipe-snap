#!/bin/bash

# Delete all node_modules directories
echo "Cleaning up node_modules and dist directories, and bun.lock files..."
find . -type d -name "node_modules" -prune -exec rm -rf '{}' +

# Delete all dist directories
find . -type d -name "dist" -prune -exec rm -rf '{}' +

# Delete all bun.lock files
find . -type f -name "bun.lock" -exec rm -f '{}' +
echo "Cleanup complete."