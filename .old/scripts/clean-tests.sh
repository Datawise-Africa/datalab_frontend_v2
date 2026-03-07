#!/bin/zsh

# Script to clean up test output directories

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}Cleaning test output directories...${NC}"

# Remove test result directories
if [ -d "test-results" ]; then
  echo "${YELLOW}Removing test-results directory...${NC}"
  rm -rf test-results
fi

# Remove Playwright report
if [ -d "playwright-report" ]; then
  echo "${YELLOW}Removing playwright-report directory...${NC}"
  rm -rf playwright-report
fi

# Remove coverage reports
if [ -d "coverage" ]; then
  echo "${YELLOW}Removing coverage directory...${NC}"
  rm -rf coverage
fi

# Remove Vitest cache
if [ -d "node_modules/.vitest" ]; then
  echo "${YELLOW}Removing Vitest cache...${NC}"
  rm -rf node_modules/.vitest
fi

# Remove NYC output
if [ -d ".nyc_output" ]; then
  echo "${YELLOW}Removing .nyc_output directory...${NC}"
  rm -rf .nyc_output
fi

# Remove HTML reports
if [ -d "html" ]; then
  echo "${YELLOW}Removing html directory...${NC}"
  rm -rf html
fi

# Remove snapshot files
echo "${YELLOW}Removing snapshot files...${NC}"
find . -name "*.snap" -type f -delete

# Remove Vite Node cache
if [ -d ".vite-node" ]; then
  echo "${YELLOW}Removing .vite-node directory...${NC}"
  rm -rf .vite-node
fi

echo "${GREEN}Test output cleanup complete!${NC}"
