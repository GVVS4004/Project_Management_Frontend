// Environment variable configuration
// Vite exposes env variables via import.meta.env

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ENABLE_FILE_UPLOAD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Task Management Platform',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  features: {
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    fileUpload: import.meta.env.VITE_ENABLE_FILE_UPLOAD === 'true',
  },
} as const;
