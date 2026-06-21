import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@craftjs/core', '@craftjs/utils'],
    include: [
      'lodash',
      'lodash/isEqualWith',
      'lodash/debounce',
      'lodash/throttle',
      'lodash/cloneDeep',
      'lodash/merge',
      'lodash/omit',
      'lodash/pick',
      'lodash/isFunction',
      'debounce',
      'tiny-invariant',
      'immer',
      'nanoid',
      'shallowequal',
    ],
  },
})
