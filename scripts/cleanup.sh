#!/bin/bash

# Delete all node_modules directories
echo "Cleaning up node_modules and dist directories, and pnpm-lock.yaml files..."
find . -type d -name "node_modules" -prune -exec rm -rf '{}' +

# Delete all dist directories
find . -type d -name "dist" -prune -exec rm -rf '{}' +

# Delete all pnpm-lock.yaml files
find . -type f -name "pnpm-lock.yaml" -exec rm -f '{}' +
echo "Cleanup complete."