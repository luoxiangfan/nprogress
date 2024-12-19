import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: 'src/index.ts',
    output: [
      {
        file: './index.js',
        format: 'umd',
        name: 'Cookies',
        noConflict: true,
        banner: ';'
      }
    ],
    plugins: [
      typescript()
    ]
})