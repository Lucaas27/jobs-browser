import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';
// eslint-disable-next-line import/extensions
import { defineWorkspace } from 'vitest/config';
export const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '.env.test.local'),
});
export default defineWorkspace([
  {
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {
        '@/*': path.resolve(__dirname, 'src/*'),
      },
    },
    test: {
      setupFiles: [path.resolve(__dirname, 'tests/globalSetup.ts')],
      environment: 'node',
      include: ['**/*.test.ts'],
      hookTimeout: 30000,
      poolOptions: {
        threads: {
          singleThread: true,
        },
      },
    },
  },
]);
