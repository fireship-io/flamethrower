// vite.config.js
import { copyFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'Flamethrower',
      fileName: 'flamethrower',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          
        }
      }
    }
  },
  plugins: [
    copyToExample()
  ],
})

function copyToExample() {
    return {
      closeBundle: () => {
        const build = './dist/flamethrower.js';
        const example = './example/flamethrower.js';
        copyFileSync(build, example);
        console.log(`copied bundle to example`);
      }
    }
  }