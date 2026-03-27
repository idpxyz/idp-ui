/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  /** Set `"true"` to keep mock data even when `VITE_API_BASE` is set (local dev against real API shape). */
  readonly VITE_USE_MOCKS?: string;
}
