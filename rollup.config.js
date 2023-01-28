import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: './packages/icons/src/index.js',
    output: [{ file: './packages/icons/dist/index.js', format: 'cjs' }],
    plugins: [terser()]
  },
  {
    input: './packages/react/src/index.js',
    output: [{ file: './packages/react/dist/index.js', format: 'cjs' }],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react']
      }),
      external(),
      resolve(),
      terser()
    ]
  },
  {
    input: './packages/util/src/index.js',
    output: [{ file: './packages/util/dist/index.js', format: 'cjs' }],
    plugins: [terser()]
  },
  {
    input: './packages/util-react/src/index.js',
    output: [{ file: './packages/util-react/dist/index.js', format: 'cjs' }],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react']
      }),
      external(),
      resolve(),
      terser()
    ]
  },
]