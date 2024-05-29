import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import viteCompression from 'vite-plugin-compression';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    createVuePlugin(),
    cssInjectedByJsPlugin(),
    viteCompression({
      deleteOriginFile: true,
      algorithm: "gzip",
      threshold: 1,
    })
  ],
  server: {
    proxy: {
      '/rpc': {
        target: 'http://openwrt/'
      }
    },
  },
  build: {
    cssCodeSplit: false,
    lib: {
      formats: ['cjs'],
      entry: 'src/App.vue',
      fileName: () => 'app.common.js'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
