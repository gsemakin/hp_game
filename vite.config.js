import Inspect from 'vite-plugin-inspect';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL)
      //__APP_ENV__: JSON.stringify(env.APP_ENV)
    },
    plugins: [Inspect()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname) + '/src/assets/'
      }
    }
  };
});
