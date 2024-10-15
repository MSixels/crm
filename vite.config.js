import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild', // Usa o minificador mais rápido e eficiente
    target: 'esnext',  // Reduz a sobrecarga de transformações
    chunkSizeWarningLimit: 1000, // Ajusta o limite de tamanho de chunks
  },
})
