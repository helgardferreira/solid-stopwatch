import tailwindcss from '@tailwindcss/vite';
import { defineConfig as defineViteConfig, mergeConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { defineConfig as defineVitestConfig } from 'vitest/config';

const viteConfig = defineViteConfig({
  plugins: [solidPlugin(), tailwindcss()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});

const vitestConfig = defineVitestConfig({
  plugins: [solidPlugin()],
  define: {
    /*
     * solid-testing-library relies on "process" which is not shimmed by default
     */
    'process.env.STL_SKIP_AUTO_CLEANUP': 'false',
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    exclude: ['e2e'],
    globals: true,
  },
});

export default mergeConfig(viteConfig, vitestConfig);
