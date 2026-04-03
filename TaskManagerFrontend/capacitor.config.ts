import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taskmanager.app',
  appName: 'TaskManager',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Keyboard: {
      resize: 'body',
    },
    Preferences: {
      group: 'com.taskmanager.app',
    },
  },
};

export default config;
