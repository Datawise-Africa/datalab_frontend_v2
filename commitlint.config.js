/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce allowed types
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'revert',
      ],
    ],
    // Subject must be lowercase
    'subject-case': [2, 'always', 'lower-case'],
    // No period at end of subject
    'subject-full-stop': [2, 'never', '.'],
    // Subject max length
    'header-max-length': [2, 'always', 72],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Type must not be empty
    'type-empty': [2, 'never'],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
  },
};
