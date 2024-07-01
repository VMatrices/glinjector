import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [{
      name: 'wrap',
      enforce: 'post',
      apply: 'build',
      renderChunk(code, chunk, opt, meta) {
        return {
          code: `(()=>{${code}})()`
        }
      }
    }
  ],
  build: {
    // minify: false,
    emptyOutDir: false,
    lib: {
      formats: ['cjs'],
      entry: 'src_core/core.js',
      fileName: () => 'core.js'
    }
  }
})
