import esbuild from 'esbuild';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Local workspace packages always ship as separate bundles and stay external.
const workspacePackages = [
    'dream-cc-core',
    'dream-cc-ecs',
    'dream-cc-ai',
    'dream-cc-gui',
    'dream-cc-pathfinding',
    'fairygui-cc',
];

/**
 * Build one package:
 *   JS bundle via esbuild, bundled declarations via rollup-plugin-dts.
 * Entry point and externals are derived from the package itself.
 */
export async function buildPackage(pkgDir, options = {}) {
    // sourcemaps on by default; set DREAM_CC_SOURCEMAP=0 to disable
    const sourcemap = options.sourcemap ?? process.env.DREAM_CC_SOURCEMAP !== '0';
    const pkgJson = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
    const name = pkgJson.name;

    // entry: ./src/index.ts, or ./src/<package-name>.ts
    const entry = ['src/index.ts', `src/${name}.ts`]
        .map((f) => path.join(pkgDir, f))
        .find((f) => existsSync(f));
    if (!entry) {
        throw new Error(`${name}: no entry found in src/`);
    }

    // `cc` (Cocos Creator runtime) and local workspace packages are external.
    const external = [
        'cc',
        'cc/env',
        ...Object.keys(pkgJson.dependencies || {}).filter((dep) => workspacePackages.includes(dep)),
    ];
    const externalSet = new Set(external);

    const distDir = path.join(pkgDir, '..', 'dist');
    const outfile = path.join(distDir, `${name}.mjs`);
    const dtsFile = path.join(distDir, `${name}.d.ts`);

    // 1) JS bundle
    await esbuild.build({
        entryPoints: [entry],
        outfile,
        bundle: true,
        sourcemap,
        format: 'esm',
        external,
        target: ['es6'],
    });

    // 2) declarations (tsconfig is discovered from the package directory)
    //    explicit `external` keeps `cc` / workspace imports as real imports in
    //    the d.ts bundle instead of relying on unresolved-import fallback.
    const bundle = await rollup({
        input: entry,
        external,
        plugins: [dts({ compilerOptions: { preserveSymlinks: false } })],
        onwarn(warning, warn) {
            if (warning.code === 'UNRESOLVED_IMPORT' && warning.id && externalSet.has(warning.id)) {
                return; // expected: `cc` / local workspace packages are external
            }
            warn(warning);
        },
    });
    await bundle.write({ format: 'esm', file: dtsFile });
    await bundle.close();

    return { name, outfile, dtsFile };
}

// CLI entry: node ../scripts/build-pkg.mjs  (runs against the current directory)
const isCli = process.argv[1]
    && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
    buildPackage(process.cwd())
        .then(({ name, outfile, dtsFile }) => {
            console.log(`[build] ${name}: ${path.basename(outfile)} + ${path.basename(dtsFile)}`);
        })
        .catch((error) => {
            console.error('[build] failed:', error && error.message ? error.message : error);
            process.exit(1);
        });
}
