import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

export default [
  // ...config('icons', { flavor: 'vanilla' }),
  // ...config('util', { flavor: 'vanilla' }),
  // ...config('dom-util', { flavor: 'vanilla' }),
  // ...config('react-core-util', { flavor: 'vanilla' }),
  // ...config('react-util', { flavor: 'vanilla' }),
  // ...config('react', { flavor: 'react' }),
  // ...config('react-native-util', { flavor: 'vanilla' }),
  // ...config('react-native', { flavor: 'react' }),
  ...config('svelte-util', { flavor: 'svelte' }),
  // ...config('svelte', { flavor: 'svelte' }),
]

const config = (path, { flavor }) => [
  typeConfig(path),
  flavor === 'react' ? reactConfig(path)
    : flavor === 'svelte' ? svelteConfig(path)
    : vanillaConfig(path),
]

const typeConfig = path => ({
  input: [`./packages/${path}/_dist/index.d.ts`],
  output: [{ file: `./packages/${path}/dist/index.d.ts`, format: 'cjs' }],
  plugins: [dts()],
})

const svelteConfig = path => ({
  ...baseConfig(path),
  external: ['svelte'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-svelte']
    }),
    terser(),
    typescript(),
  ]
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

const vanillaConfig = path => ({
  ...baseConfig(path),
  plugins: [terser(), typescript()],
})

const baseConfig = path => ({
  input: [`./packages/${path}/_dist/index.js`],
  output: [{ dir: `./packages/${path}/dist`, format: 'cjs' }],
})