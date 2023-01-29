import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const baseConfig = path => ({
  input: [`./packages/${path}/tdist/index.js`],
  output: [{ dir: `./packages/${path}/dist`, format: 'es' }],
})

const vanillaConfig = path => ({
  ...baseConfig(path),
  plugins: [terser(), typescript()],
})

const typeConfig = path => ({
  input: [`./packages/${path}/tdist/index.d.ts`],
  output: [{ file: `./packages/${path}/dist/index.d.ts`, format: 'es' }],
  plugins: [dts()],
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
    typescript(),
  ]
})

export default [
  vanillaConfig('icons'),
  vanillaConfig('util'),
  typeConfig('util'),
  reactConfig('react'),
  typeConfig('react'),
  reactConfig('util-react'),
  typeConfig('util-react'),
]