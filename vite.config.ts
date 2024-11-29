import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      VITE_ARCGIS_API_KEY: process.env.VITE_ARCGIS_API_KEY,
    },
  },
});
