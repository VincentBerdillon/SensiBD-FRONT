/// <reference types="vite/client" />
// Typage de la variable d'environnement
interface ImportMetaEnv {
  VITE_APP_TITLE: string;
  VITE_APP_GOOGLE_MAPS_API_KEY: string;
}

interface ImportMeta {
  env: {
    VITE_GOOGLE_API_KEY: string;
    // Add other environment variables as needed
  };
}
