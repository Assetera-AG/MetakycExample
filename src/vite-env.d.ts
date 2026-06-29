/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_METAKYC_API_KEY: string;
  readonly VITE_METAKYC_SECRET_KEY?: string;
  readonly VITE_TENANT_ID: string;
  readonly VITE_METAKYC_BASE_URL: string;
  readonly VITE_ENDPOINT_PATTERN: string;
  readonly VITE_SARDINAI_CLIENT_ID?: string;
  readonly VITE_SARDINAI_ENVIRONMENT?: string;
  readonly VITE_SARDINAI_REGION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
