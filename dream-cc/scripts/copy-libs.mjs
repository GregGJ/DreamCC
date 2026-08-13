import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const defaultClientLibs = path.join('D:\\', 'DreamCC', 'clients', 'Client3', 'assets', 'libs');

/**
 * Copy built runtime + typings from dist/ to the Cocos client libs folder.
 * Only files that changed (size or mtime) are copied.
 */
export async function copyLibs(options = {}) {
    const distDir = path.resolve(options.distDir || path.join(root, 'dist'));
    const clientLibs = path.resolve(
        options.clientLibs || process.env.DREAM_CC_CLIENT_LIBS || defaultClientLibs,
    );

    if (process.env.DREAM_CC_SKIP_COPY === '1') {
        console.log('[copy] skipped (DREAM_CC_SKIP_COPY=1)');
        return { skipped: true };
    }

    if (!existsSync(distDir)) {
        console.log(`[copy] ${distDir} not found, skip`);
        return { notFound: true };
    }

    mkdirSync(clientLibs, { recursive: true });

    let copied = 0;
    let unchanged = 0;
    for (const file of readdirSync(distDir)) {
        // ship runtime code + typings + source maps (set DREAM_CC_SKIP_MAPS=1 to skip maps)
        if (process.env.DREAM_CC_SKIP_MAPS === '1' && /\.map$/.test(file)) continue;
        if (!/\.(mjs|d\.ts|map)$/.test(file)) continue;

        const src = path.join(distDir, file);
        const dest = path.join(clientLibs, file);
        const srcStat = statSync(src);
        const destStat = existsSync(dest) ? statSync(dest) : null;

        if (destStat && destStat.size === srcStat.size && destStat.mtimeMs >= srcStat.mtimeMs) {
            unchanged++;
            continue;
        }

        copyFileSync(src, dest);
        copied++;
    }

    console.log(`[copy] ${copied} copied, ${unchanged} unchanged -> ${clientLibs}`);
    return { copied, unchanged, clientLibs };
}

// CLI entry: node ./scripts/copy-libs.mjs
const isCli = process.argv[1]
    && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
    copyLibs().catch((error) => {
        console.error('[copy] failed:', error.message);
        process.exit(1);
    });
}
