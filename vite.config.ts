import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createAskNowProxy } from 'asknow-react/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'ASKNOW_');
  const proxy = createAskNowProxy({
    target: env.ASKNOW_API_ORIGIN || 'https://asknow-uat.hdfcbankuat.com',
    sessionCookies: env.ASKNOW_SESSION_COOKIES,
    allowInsecureTls: env.ASKNOW_ALLOW_INSECURE_TLS === 'true',
  });
  return {
    plugins: [react()],
    resolve: { dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'] },
    server: { proxy },
    preview: { proxy },
  };
});
