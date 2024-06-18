import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const typeConfig = (path, format = 'cjs') => ({
  input: [`./packages/${path}/_dist/index.d.ts`],
  output: [{ file: `./packages/${path}/dist/index.d.ts`, format }],
  plugins: [dts()],
})


const baseConfig = (path, format = 'cjs') => ({
  input: [`./packages/${path}/_dist/index.js`],
  output: [{ dir: `./packages/${path}/dist`, format }],
})

const vanillaConfig = path => ({
  ...baseConfig(path),
  plugins: [terser(), typescript()],
})

const reactConfig = (path, format) => ({
  ...baseConfig(path, format),
  external: ['react'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
    }),
    terser(),
    typescript(),
  ]
})

const config = (path, { flavor, format }) => [
  typeConfig(path, format),
  flavor === 'react' ? reactConfig(path, format)
    : vanillaConfig(path, format),
]

export default [
  // ...config('icons', { flavor: 'vanilla' }),
  // ...config('util', { flavor: 'vanilla' }),
  ...config('dom-util', { flavor: 'vanilla' }),
  // ...config('image-core', { flavor: 'vanilla' }),
  // ...config('react-util', { flavor: 'vanilla' }),
  // ...config('react', { flavor: 'react' }),
  // ...config('react-image', { flavor: 'react' }),
  // ...config('react-openlayers', { flavor: 'react', format: 'es' }),
]