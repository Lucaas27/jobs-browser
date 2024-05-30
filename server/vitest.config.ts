// eslint-disable-next-line import/extensions
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reporter: ['text', 'html'],
      provider: 'v8',
      clean: true,
      reportsDirectory: `${__dirname}/tests/coverage`,
    },
  },
});
