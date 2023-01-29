import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const baseConfig = path => ({
  input: `./packages/${path}/src/index.ts`,
  output: [{ dir: `./packages/${path}/dist`, format: 'es' }],
})

const vanillaConfig = path => ({
  ...baseConfig(path),
  plugins: [terser(), typescript({ outputToFilesystem: true })],
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
    typescript({ outputToFilesystem: true }),
  ]
})

export default [
  vanillaConfig('icons'),
  vanillaConfig('util'),
  reactConfig('react'),
  reactConfig('util-react'),
]