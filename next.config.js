require('dotenv').config()
const withTM = require('next-transpile-modules')([
    'react-markdown',
    'property-information',
    'space-separated-tokens',
    'comma-separated-tokens',
    'hast-util-whitespace',
    'vfile',
    'unist-util-stringify-position',
    'unist-util-visit',
    'unist-util-is',
    'remark-rehype',
    'mdast-util-to-hast',
    'unist-builder',
    'unist-util-position',
    'remark-parse',
    'mdast-util-definitions',
    'unist-util-generated',
    'decode-named-character-reference',
    'micromark-util-combine-extensions',
    'micromark-util-symbol',
    'micromark-util-resolve-all',
    'micromark-util-html-tag-name',
    'unified',
    'is-plain-obj',
    'bail',
    'trough',
])

module.exports = withTM({
    env: {
        SECRET_API_KEY: process.env.SECRET_API_KEY,
    },
    reactStrictMode: true,
})
