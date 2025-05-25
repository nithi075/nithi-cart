import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: `import React from 'react'`,
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  build: {
    outDir: 'dist', // Ensures the output folder is correctly set
    rollupOptions: {
    input: 'src/main.jsx' // Ensures entry point is correct
    }
  }
});

})
