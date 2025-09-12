import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      // Permitir todos os subdomínios do ngrok
      '.ngrok-free.app',
      '.ngrok.io',
      '.ngrok.app'
    ],
    host: '0.0.0.0',
    port: 4200
  }
});
