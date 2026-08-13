import { build } from 'tsdown';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// tsgo prints a one-time informational warning about the experimental TS7
// API when it initializes; filter it out (fires once per process, does not
// affect the generated declarations) while keeping real warnings visible.
const dtsLogger = {
    info: (...args) => {
        // one-time tsgo bootstrap notice (e.g. "Emit types with typescript@7.0.2")
        console.info(...args);
    },
    warn: (...args) => {
        console.warn(...args);
    },
    error: (...args) => console.error(...args),
};

/**
 * Build one package:
 *   JS bundle + bundled declarations in one tsdown pass (Rolldown).
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

    const distDir = path.join(pkgDir, '..', 'dist');
    const outfile = path.join(distDir, `${name}.mjs`);
    const dtsFile = path.join(distDir, `${name}.d.ts`);

    // tsdown:
    // - every bare import (`cc`, `cc/env`, local workspace packages) stays
    //   external as written via deps.neverBundle: true
    // - entry alias keeps the package name as the output basename
    // - outExtensions forces .mjs / .d.ts regardless of package.json type
    // - dts.tsconfig pins the per-package tsconfig so declarations resolve
    //   `../dist/*.d.ts` via its `paths` mapping
    await build({
        entry: { [name]: entry },
        outDir: distDir,
        format: 'esm',
        target: 'es2015',
        sourcemap,
        dts: {
            tsconfig: path.join(pkgDir, 'tsconfig.json'),
            cwd: pkgDir,
            // don't persist tsbuildinfo (parallel builds share dist; cache
            // management stays with tsc)
            incremental: false,
            // keep declarations plain .d.ts without declaration maps
            sourcemap: false,
        },
        outExtensions: () => ({ js: '.mjs', dts: '.d.ts' }),
        deps: { neverBundle: true },
        clean: false, // dist is cleaned once by build.mjs
        report: false,
        logLevel: 'warn',
    });

    // tsgo appends `//# sourceMappingURL=<name>.d.ts.map` to the bundled
    // declarations even though we don't emit declaration maps; drop the
    // dangling reference so the output matches the shipped artifacts.
    if (existsSync(dtsFile)) {
        const content = readFileSync(dtsFile, 'utf8');
        const cleaned = content.replace(/^\/\/# sourceMappingURL=.*\.d\.ts\.map\r?\n?/m, '');
        if (cleaned !== content) {
            writeFileSync(dtsFile, cleaned);
        }
    }

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
