import { execSync } from 'child_process';
import { analyzeMetafile, build } from 'esbuild';
import { postcssModules, sassPlugin } from 'esbuild-sass-plugin';
import { copyFileSync } from 'fs';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const isDevelopment = args.some((arg) => arg === '--dev');
  const isProduction = !isDevelopment;
  const isAnalyze = args.some((arg) => arg === '--stat');

  const GOROOT = execSync('go env GOROOT').toString().trim();

  copyFileSync('src/index.html', 'dist/index.html');
  copyFileSync(
    `${GOROOT}/misc/wasm/wasm_exec.js`,
    'src/lib/pixlet/wasm_exec.js',
  );

  const result = await build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    color: true,
    outdir: 'dist',
    format: 'cjs',
    metafile: isAnalyze,
    minify: isProduction,
    plugins: [
      sassPlugin({
        transform: postcssModules({
          localsConvention: 'camelCaseOnly',
        }),
      }),
    ],
    sourcemap: isProduction,
    target: ['esnext'],
    watch: isDevelopment,
  });

  if (result.metafile) {
    const text = await analyzeMetafile(result.metafile);

    console.log(text);
  }
}

main();
