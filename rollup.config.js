// node-resolve will resolve all the node dependencies
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
// Convert CJS modules to ES6, so they can be included in a bundle
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import postcssModules from 'postcss-modules'
import json from 'rollup-plugin-json'

const cssExportMap = {}

export default {
  input: 'src/index.js',
  output: [{
    file: pkg.main,
    format: 'es'
  }],
  // All the used libs needs to be here
  external: [
    'react', 
    'react-dom',
    'react-proptypes',
    'lodash',
    '@material-ui/core',
    'react-datetime',
    'axios'
  ],
  plugins: [
    resolve({ preferBuiltins: false }),
    postcss({
      plugins: [
        postcssModules({
          getJSON (id, exportTokens) {
            cssExportMap[id] = exportTokens;
          }
        })
      ],
      getExportNamed: false,
      getExport (id) {
        return cssExportMap[id];
      },
      extract: 'dist/styles.css',
    }),
    json({
      'include': 'node_modules/**'
    }),
    babel({
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-proposal-class-properties",  "@babel/plugin-proposal-export-default-from"],
      exclude: [
        'node_modules/**'
      ]
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-is/index.js': ['ForwardRef', 'isValidElementType']
      }
    })
  ]
}