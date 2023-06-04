import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const baseConfig = path => ({
  input: [`./packages/${path}/_dist/index.js`],
  output: [{ dir: `./packages/${path}/dist`, format: 'cjs' }],
})

const vanillaConfig = path => ({
  ...baseConfig(path),
  plugins: [terser(), typescript()],
})

const typeConfig = path => ({
  input: [`./packages/${path}/_dist/index.d.ts`],
  output: [{ file: `./packages/${path}/dist/index.d.ts`, format: 'cjs' }],
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
  vanillaConfig('react-core-util'),
  vanillaConfig('react-native-util'),
  vanillaConfig('react-util'),

  reactConfig('react'),

  typeConfig('icons'),
  typeConfig('util'),
  typeConfig('react-core-util'),
  typeConfig('react-native-util'),
  typeConfig('react-util'),
  typeConfig('react'),
]