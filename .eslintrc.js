module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'], //prettier always last
  plugins: ['@typescript-eslint'],
  rules: {
    //see: https://www.npmjs.com/package/eslint-plugin-prettier
    //'prettier/prettier': 1,//Let format issues be prompted via ESLINT. The experience is mediocre unless you are serious
    //---------------------------------------------------------
    'linebreak-style': [1, 'unix'],
    'no-var': 2,
    'no-eval': 2,
    'prefer-const': 1,
    'no-new-object': 0,
    'object-shorthand': [1, 'always', { avoidQuotes: true }],
    'no-loop-func': 2,
    'no-param-reassign': 2,
    'prefer-destructuring': [
      2,
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    eqeqeq: 1,
    'no-multi-str': 2,
    'no-self-compare': 2,
    'no-unmodified-loop-condition': 2,
    'no-useless-concat': 2,
    'no-unneeded-ternary': 2,
    'new-cap': 2,
    'operator-assignment': 2,
    'no-duplicate-imports': 0,
    //==================================================typescript
    '@typescript-eslint/consistent-type-imports': 1,
    '@typescript-eslint/consistent-type-exports': 1,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-comment': [1, { 'ts-expect-error': 'allow-with-description' }],
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
  },
}
