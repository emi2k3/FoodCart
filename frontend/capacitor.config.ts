import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'frontend',
  webDir: 'dist/frontend/browser',
  server: {
    allowNavigation: ['10.4.201.213'],
  },
};

export default config;
