import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/index.ts'],
  splitting: true,
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
