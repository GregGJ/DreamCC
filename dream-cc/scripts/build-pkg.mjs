import esbuild from 'esbuild';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Builds the package in the current working directory:
//   JS bundle via esbuild, declarations via rollup-plugin-dts.
// Entry point and external modules are derived from the package itself.
const pkgDir = process.cwd();
const pkgJson = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
const name = pkgJson.name;

// local workspace packages are always external (they ship as separate bundles)
const workspacePackages = new Set([
    'dream-cc-core',
    'dream-cc-ecs',
    'dream-cc-ai',
    'dream-cc-gui',
    'dream-cc-pathfinding',
    'fairygui-cc',
]);

// entry: ./src/index.ts, or ./src/<package-name>.ts
const entry = ['src/index.ts', `src/${name}.ts`]
    .map((f) => path.join(pkgDir, f))
    .find((f) => existsSync(f));
if (!entry) {
    console.error(`[build] ${name}: no entry found in src/`);
    process.exit(1);
}

const external = [
    'cc',
    'cc/env',
    ...Object.keys(pkgJson.dependencies || {}).filter((dep) => workspacePackages.has(dep)),
];

const distDir = path.join(pkgDir, '..', 'dist');
const outfile = path.join(distDir, `${name}.mjs`);
const dtsFile = path.join(distDir, `${name}.d.ts`);

async function main() {
    // 1) JS bundle
    await esbuild.build({
        entryPoints: [entry],
        outfile,
        bundle: true,
        sourcemap: process.env.DREAM_CC_SOURCEMAP === '1',
        format: 'esm',
        external,
        target: ['es6'],
    });

    // 2) declarations (tsconfig is discovered from the package directory)
    const bundle = await rollup({
        input: entry,
        plugins: [dts({ compilerOptions: { preserveSymlinks: false } })],
    });
    await bundle.write({ format: 'esm', file: dtsFile });
    await bundle.close();

    console.log(`[build] ${name}: ${path.basename(outfile)} + ${path.basename(dtsFile)}`);
}

main().catch((error) => {
    console.error(`[build] ${name} failed:`, error && error.message ? error.message : error);
    process.exit(1);
});
