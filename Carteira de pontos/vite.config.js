import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Garante que os caminhos estão corretos para o Nginx
  build: {
    outDir: 'dist', // Pasta onde os arquivos finais serão gerados
  },
  server: {
    port: 3000, // Caso queira rodar localmente antes de subir
  },
});
