import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'

const baseConfig = path => ({
  input: `./packages/${path}/src/index.js`,
  output: [{ dir: `./packages/${path}/dist`, format: 'es' }],
})

const vanillaConfig = path => ({
  ...baseConfig(path),
  plugins: [terser()],
})

const reactConfig = path => ({
  ...baseConfig(path),
  external: ['react'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react']
    }),
    terser(),
  ]
})

export default [
  vanillaConfig('icons'),
  vanillaConfig('util'),
  reactConfig('react'),
  reactConfig('util-react'),
]