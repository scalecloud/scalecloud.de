import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^src\/(.*)$/,
        replacement: fileURLToPath(new URL('./src/$1', import.meta.url)),
      },
    ],
  },
  test: {
    ui: true,
  },
});