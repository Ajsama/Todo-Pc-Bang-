import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      workspaceRoot: __dirname,
    })
  ],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    disabled: true
  }
});
