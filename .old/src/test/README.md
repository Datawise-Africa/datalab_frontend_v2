# DataLab Frontend Testing Guide

This document provides guidelines for testing in the DataLab Frontend project.

## Testing Structure

- **Unit & Component Tests**: Located next to the component they test with the `.test.tsx` extension
- **Test Setup**: Common test utilities are in the `src/test` directory
- **E2E Tests**: End-to-end tests using Playwright are in the `e2e` directory

## Test Types

### Unit & Component Tests (Vitest)

For testing individual components and functions. These tests are fast and provide quick feedback.

```bash
# Run all unit/component tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests (Playwright)

For testing full user flows across the application.

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Testing Guidelines

### Component Tests

1. Each component should have a corresponding `.test.tsx` file in the same directory
2. Focus on testing component functionality, not implementation details
3. Use the custom `render` function from `src/test/test-utils.tsx` which provides the necessary providers

### E2E Tests

1. Focus on user flows and critical paths
2. Tests should be resilient to UI changes (use roles, labels, and test IDs)
3. Group related tests using `test.describe`
4. Store page objects in the `e2e/pages` directory for reusable page interactions

## Testing Best Practices

1. Write tests that test behavior, not implementation
2. Keep tests independent and isolated
3. Use descriptive test names that explain the expected behavior
4. Follow the AAA pattern: Arrange, Act, Assert
5. Prefer using user-centric queries like `getByRole` or `getByText` over implementation-specific queries

## Test Outputs and Cleanup

Testing creates various output directories that are excluded from version control:

- `test-results/`: Playwright test result files
- `playwright-report/`: HTML reports for Playwright tests
- `coverage/`: Code coverage reports
- `node_modules/.vitest/`: Vitest cache
- `.nyc_output/`: NYC code coverage output
- `html/`: HTML coverage reports

You can clean up these directories using:

```bash
# Clean up all test outputs
npm run clean:tests
```

These directories are ignored in:

- `.gitignore`: Prevents them from being tracked by git
- `.eslintignore`: Prevents ESLint from linting them
- `.prettierignore`: Prevents Prettier from formatting them
- `.dockerignore`: Prevents them from being included in Docker images
- `.npmignore`: Prevents them from being published to npm
