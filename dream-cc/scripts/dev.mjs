import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPackage } from './build-pkg.mjs';
import { copyLibs } from './copy-libs.mjs';
import { packages, buildLevels, dependentsOf } from './packages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const levels = buildLevels();

const pkgDir = (name) => path.join(root, name);
const srcDir = (name) => path.join(pkgDir(name), 'src');

let timer = null;
let busy = false;
const pending = new Set();

async function rebuild(batch) {
    // a change in one package invalidates everything that depends on it
    const affected = new Set(batch);
    for (const pkg of [...affected]) {
        for (const dep of dependentsOf(pkg)) affected.add(dep);
    }

    const names = [...affected];
    const t0 = Date.now();
    console.log(`\n[dev] rebuild: ${names.join(', ')}`);

    let failed = false;
    for (const level of levels) {
        const tasks = level.filter((pkg) => affected.has(pkg));
        if (tasks.length === 0) continue;

        await Promise.all(
            tasks.map(async (pkg) => {
                try {
                    const { outfile, dtsFile } = await buildPackage(pkgDir(pkg));
                    console.log(`[dev] ${pkg}: ${path.basename(outfile)} + ${path.basename(dtsFile)}`);
                } catch (error) {
                    failed = true;
                    console.error(`[dev] build ${pkg} failed: ${error.message}`);
                }
            }),
        );
    }

    if (failed) {
        console.error('[dev] copy skipped because some builds failed\n');
    } else {
        await copyLibs();
        console.log(`[dev] rebuilt in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
    }
}

function schedule(pkg) {
    pending.add(pkg);
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
        timer = null;
        if (busy) return; // the running loop picks up `pending` afterwards
        busy = true;
        try {
            while (pending.size > 0) {
                const batch = new Set(pending);
                pending.clear();
                await rebuild(batch);
            }
        } finally {
            busy = false;
        }
    }, 150);
}

function watchSrc(name) {
    watch(srcDir(name), { recursive: true }, (_event, filename) => {
        if (!filename) return;
        if (!/\.(ts|mts|cts)$/.test(filename.toString())) return;
        schedule(name);
    });

    // rebuild when the package manifest / tsconfig changes too
    for (const file of ['package.json', 'tsconfig.json']) {
        watch(path.join(pkgDir(name), file), () => schedule(name));
    }
}

async function main() {
    console.log('[dev] initial build...');
    await rebuild(new Set(packages));

    for (const name of packages) watchSrc(name);
    console.log(`[dev] watching ${packages.length} packages (Ctrl+C to stop)`);
}

main().catch((error) => {
    console.error('[dev] failed:', error.message);
    process.exit(1);
});
