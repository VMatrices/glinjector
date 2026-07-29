import { defineConfig, loadEnv } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import viteCompression from 'vite-plugin-compression';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const env = loadEnv('', process.cwd())

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
      '^/(rpc|upload|img|\\w+\\.svg)': {
        target: env.VITE_PROXY_TARGET || 'http://127.0.0.1/',
        secure: false,
      }
    }
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
