import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { build, type Plugin } from 'esbuild';

const SDK = join(process.cwd(), 'node_modules', '@valence', 'plugin-sdk', 'src');

const sdkAlias: Plugin = {
  name: 'valence-sdk-alias',
  setup: (esbuild) => {
    esbuild.onResolve({ filter: /^@ValenceSDK\// }, (args) => ({
      path: `${SDK}/${args.path.slice('@ValenceSDK/'.length)}.ts`,
    }));
  },
};

await build({
  entryPoints: [join(SDK, 'cli', 'valencePlugin.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  outfile: join('.tools', 'valence-plugin.mjs'),
  plugins: [sdkAlias],
  logLevel: 'warning',
});

await build({
  entryPoints: ['src/plugin.ts'],
  bundle: true,
  platform: 'neutral',
  format: 'iife',
  target: 'es2023',
  minify: true,
  legalComments: 'none',
  outfile: 'dist/plugin.js',
  plugins: [sdkAlias],
  logLevel: 'warning',
});

execFileSync('node', [join('.tools', 'valence-plugin.mjs'), 'pack', '.', '--out', 'packages'], {
  stdio: 'inherit',
});
