import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.tripchefbuddy',
  appName: 'trip-chef-buddy',
  webDir: 'dist',
  server: {
    url: 'https://117018ce-1259-44c0-81f9-b28db4e12ee3.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
};

export default config;
