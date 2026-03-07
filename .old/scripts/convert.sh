#!/bin/bash

# Set the root directory, default to current dir if none given
ROOT_DIR=${1:-.}
echo "Using root directory: $ROOT_DIR"
# Prompt for conversion direction
echo "Select conversion direction:"
echo "1) JS to TS (Convert .js to .ts and .jsx to .tsx)"
echo "2) TS to JS (Convert .ts to .js and .tsx to .jsx)"
read -p "Enter your choice (1 or 2): " CHOICE

if [ "$CHOICE" = "1" ]; then
  echo "Starting JS to TS conversion in directory: $ROOT_DIR"
  
  # Convert .js files to .ts
  find "$ROOT_DIR" -type f -name "*.js" | while read -r file; do
    new_file="${file%.js}.ts"
    mv "$file" "$new_file"
    echo "Renamed: $file -> $new_file"
  done
  
  # Convert .jsx files to .tsx
  find "$ROOT_DIR" -type f -name "*.jsx" | while read -r file; do
    new_file="${file%.jsx}.tsx"
    mv "$file" "$new_file"
    echo "Renamed: $file -> $new_file"
  done
  
  echo "JS to TS conversion complete."
  
elif [ "$CHOICE" = "2" ]; then
  echo "Starting TS to JS conversion in directory: $ROOT_DIR"
  
  # Convert .ts files to .js
  find "$ROOT_DIR" -type f -name "*.ts" | grep -v ".d.ts" | while read -r file; do
    new_file="${file%.ts}.js"
    mv "$file" "$new_file"
    echo "Renamed: $file -> $new_file"
  done
  
  # Convert .tsx files to .jsx
  find "$ROOT_DIR" -type f -name "*.tsx" | while read -r file; do
    new_file="${file%.tsx}.jsx"
    mv "$file" "$new_file"
    echo "Renamed: $file -> $new_file"
  done
  
  echo "TS to JS conversion complete."
  
else
  echo "Invalid choice. Please run the script again and select 1 or 2."
  exit 1
fi
