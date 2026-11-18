import * as esbuild from 'esbuild';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(assetsDir, { recursive: true });

console.log('1/3 Building Tailwind CSS...');
const tailwindCli = path.join(rootDir, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
execFileSync(
  process.execPath,
  [tailwindCli, '-i', './src/index.css', '-o', './dist/assets/app.css', '--minify'],
  { stdio: 'inherit' }
);

console.log('2/3 Bundling React + TypeScript application with esbuild...');
await esbuild.build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'esm',
  target: ['es2020'],
  jsx: 'automatic',
  outfile: 'dist/assets/app.js',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

console.log('3/3 Generating production dist/index.html & dist/404.html...');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const universalBaseScript = `<script>
  (function () {
    var base = window.location.pathname.indexOf('/math104-differential-calculus') === 0
      ? '/math104-differential-calculus'
      : '';
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + '/assets/app.css';
    document.head.appendChild(link);
    window.__APP_BASE__ = base;
  })();
</script>`;
const universalScriptTag = `<script>
  (function () {
    var s = document.createElement('script');
    s.type = 'module';
    s.src = (window.__APP_BASE__ || '') + '/assets/app.js';
    document.body.appendChild(s);
  })();
</script>`;

const prodHtml = indexHtml
  .replace('<!-- APP_STYLES -->', universalBaseScript)
  .replace('<!-- APP_SCRIPT -->', universalScriptTag);

fs.writeFileSync(path.join(distDir, 'index.html'), prodHtml, 'utf-8');
fs.writeFileSync(path.join(distDir, '404.html'), prodHtml, 'utf-8');
// Create a .nojekyll file to prevent GitHub Pages from ignoring files
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');
console.log('Build completed successfully in ./dist');
