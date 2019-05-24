// node-resolve will resolve all the node dependencies
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

// Convert CJS modules to ES6, so they can be included in a bundle
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import postcssModules from 'postcss-modules'

const cssExportMap = {}

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  // All the used libs needs to be here
  external: [
    'react', 
    'react-proptypes'
  ],
  plugins: [
    resolve(),
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
    babel({
      exclude: 'node_modules/**'
    })
  ]
}