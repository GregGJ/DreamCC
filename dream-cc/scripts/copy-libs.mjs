import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const distDir = path.join(root, 'dist');

const clientLibs = process.env.DREAM_CC_CLIENT_LIBS
    || path.join('D:\\', 'DreamCC', 'clients', 'Client3', 'assets', 'libs');

if (process.env.DREAM_CC_SKIP_COPY === '1') {
    console.log('[copy] skipped (DREAM_CC_SKIP_COPY=1)');
    process.exit(0);
}

if (!existsSync(distDir)) {
    console.log(`[copy] ${distDir} not found, skip`);
    process.exit(0);
}

mkdirSync(clientLibs, { recursive: true });
let copied = 0;
for (const file of readdirSync(distDir)) {
    // only ship runtime code + typings; never .map or intermediates
    if (!/\.(mjs|d\.ts)$/.test(file)) continue;
    copyFileSync(path.join(distDir, file), path.join(clientLibs, file));
    copied++;
}
console.log(`[copy] ${copied} file(s) -> ${clientLibs}`);
