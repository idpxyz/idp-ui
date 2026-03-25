import { defineConfig, type Options } from 'tsup';

/**
 * Shared tsup base config for all @idpxyz/ui-* packages.
 * Each package's tsup.config.ts extends this with its own entry.
 */
export const baseConfig: Options = {
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  external: ['react', 'react-dom', 'lucide-react'],
};
