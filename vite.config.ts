import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const sdkPkg = JSON.parse(
  readFileSync(resolve(__dirname, 'node_modules/@asseteragmbh/metakyc/package.json'), 'utf-8')
);

export default defineConfig({
  plugins: [react()],
  define: {
    __SDK_VERSION__: JSON.stringify(sdkPkg.version),
  },
  server: {
    port: 3000,
  },
});
