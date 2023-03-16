'use strict'

/** @type {import('prettier').Config} */
const config = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  htmlWhitespaceSensitivity: 'ignore',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  arrowParens: 'avoid',
}

module.exports = config
