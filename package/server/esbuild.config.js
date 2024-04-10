import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  platform: 'node',
  outdir: 'dist',
  sourcemap: true,
  format: 'esm',
  minify: true,
  target: 'ES2020',
  banner: {
    js: `
        import path from 'path';
        import { fileURLToPath } from 'url';
        import { createRequire as topLevelCreateRequire } from 'module';
        const require = topLevelCreateRequire(import.meta.url);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        `,
  },
})
