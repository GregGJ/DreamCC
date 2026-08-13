import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync } from 'node:fs';
import { buildPackage } from './build-pkg.mjs';
import { buildLevels } from './packages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const levels = buildLevels();

async function main() {
    // clean dist first so renamed/removed packages never leave stale outputs
    const distDir = path.join(root, 'dist');
    rmSync(distDir, { recursive: true, force: true });

    const t0 = Date.now();
    for (const level of levels) {
        const results = await Promise.all(
            level.map(async (pkg) => {
                console.log(`===== build ${pkg} =====`);
                try {
                    return await buildPackage(path.join(root, pkg));
                } catch (error) {
                    throw new Error(`[build] ${pkg} failed: ${error.message}`);
                }
            }),
        );
        for (const { name, outfile, dtsFile } of results) {
            console.log(`[build] ${name}: ${path.basename(outfile)} + ${path.basename(dtsFile)}`);
        }
    }
    console.log(`\nAll packages built in ${((Date.now() - t0) / 1000).toFixed(1)}s.`);
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
