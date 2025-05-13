#!/bin/bash

# Set the root directory, default to current dir if none given
ROOT_DIR=${1:-.}

echo "Starting conversion in directory: $ROOT_DIR"

# Find all .js files and rename them to .ts
find "$ROOT_DIR" -type f -name "*.js" | while read -r file; do
  new_file="${file%.js}.ts"
  mv "$file" "$new_file"
  echo "Renamed: $file -> $new_file"
done

echo "Conversion complete."
