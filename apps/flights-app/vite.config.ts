/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import * as URL from 'url';

const flightLabUrl = 'https://app.goflightlabs.com';

export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const API_KEY = process.env.VITE_FLIGHTS_API_KEY as string;

  return defineConfig({
    cacheDir: '../../node_modules/.vite/flights-app',

    server: {
      port: 4200,
      host: 'localhost',
      proxy: {
        '/api': {
          target: flightLabUrl,
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(/^\/api/, '');
            const url = new URL.URL(flightLabUrl + newPath);
            url.searchParams.append('access_key', API_KEY);
            return url.href.replace(flightLabUrl, '');
          },
        },
      },
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [
      react(),
      viteTsConfigPaths({
        root: '../../',
      }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../',
    //    }),
    //  ],
    // },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  });
};
