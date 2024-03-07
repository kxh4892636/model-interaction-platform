import path from 'path'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '@type': path.resolve(process.cwd(), '../type'),
    },
    coverage: {
      include: ['**/src/**'],
      exclude: [
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...configDefaults.coverage.exclude!,
        '**/type/**',
        '**/index.ts',
      ],
    },
    include: ['**/src/**/*.test.ts'],
  },
})
