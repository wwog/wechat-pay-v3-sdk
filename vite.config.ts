import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      outputDir: 'types',
      skipDiagnostics: false,
      insertTypesEntry: true,
      rollupTypes: true,
      staticImport: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'wwog-lib-name',
    },
  },
})
