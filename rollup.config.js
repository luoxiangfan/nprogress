import { readFileSync } from 'fs'
import { defineConfig } from 'rollup'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const loadJSON = (path) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url)).toString())

const pkg = loadJSON('./package.json')

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      // config for <script type="module">
      {
        file: pkg.module,
        format: 'esm'
      },
      // config for <script nomodule>
      {
        file: pkg.browser,
        format: 'umd',
        name: 'Cookies',
        noConflict: true,
        banner: ';'
      }
    ],
    plugins: [
      typescript()
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      // config for <script type="module">
      {
        file: pkg.module.replace('.mjs', '.min.mjs'),
        format: 'esm'
      },
      // config for <script nomodule>
      {
        file: pkg.browser.replace('.js', '.min.js'),
        format: 'umd',
        name: 'Cookies',
        noConflict: true
      }
    ],
    plugins: [
      terser(),
      typescript()
    ]
  }
])