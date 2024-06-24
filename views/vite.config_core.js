import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    // cssInjectedByJsPlugin(),
    // viteCompression({
    //   deleteOriginFile: true,
    //   algorithm: "gzip",
    //   threshold: 1,
    // }),],
  build: {
    // minify: true,
    lib: {
      // "amd", "cjs", "system", "es", "iife" or "umd".
      formats: ['cjs'],
      name: "FFFFFFF",
      entry: 'src_core/core.js',
      fileName: () => 'core.js'
    }
  }
})
