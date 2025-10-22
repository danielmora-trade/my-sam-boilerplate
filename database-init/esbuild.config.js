const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['app.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  outdir: './',
  external: [
    '@aws-sdk/*',
    'aws-sdk',
    '/opt/nodejs'
  ],
  format: 'cjs',
  minify: true,
  sourcemap: true
}).catch(() => process.exit(1));
