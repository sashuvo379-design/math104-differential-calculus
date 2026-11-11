import { execFileSync } from 'node:child_process';
import path from 'node:path';

const buildScript = path.join(process.cwd(), 'scripts', 'build.mjs');
execFileSync(process.execPath, [buildScript], { stdio: 'inherit' });

const previewScript = path.join(process.cwd(), 'scripts', 'preview.mjs');
process.env.PORT = process.env.PORT || '5173';
await import(`file://${previewScript.replace(/\\/g, '/')}`);
