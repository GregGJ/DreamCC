import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

// Safety: only ever remove the repo-local dist directory.
const resolved = path.resolve(distDir);
if (path.dirname(resolved) !== root || path.basename(resolved) !== 'dist') {
    console.error(`[clean] refusing to remove unexpected path: ${resolved}`);
    process.exit(1);
}

rmSync(resolved, { recursive: true, force: true });
console.log(`[clean] removed ${resolved}`);
