import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// build order follows the dependency graph:
// core -> ecs / pathfinding / fairygui-cc -> ai / gui
const order = [
    'dream-cc-core',
    'dream-cc-ecs',
    'dream-cc-pathfinding',
    'fairygui-cc',
    'dream-cc-ai',
    'dream-cc-gui',
];

// run the local npm CLI with node directly to avoid shell-escaping issues
const npmCli = process.env.npm_execpath
    ? path.resolve(process.env.npm_execpath)
    : 'npm';

for (const pkg of order) {
    console.log(`\n===== build ${pkg} =====`);
    const result = spawnSync(process.execPath, [npmCli, 'run', 'build', '--workspace', pkg], {
        stdio: 'inherit',
    });
    if (result.status !== 0) {
        console.error(`[build] ${pkg} failed (exit ${result.status})`);
        process.exit(result.status ?? 1);
    }
}

console.log('\nAll packages built.');

// single consolidated copy to the client after all packages are built
const copy = spawnSync(process.execPath, [path.join(root, 'scripts', 'copy-libs.mjs')], {
    stdio: 'inherit',
});
if (copy.status !== 0) {
    console.error(`[copy] failed (exit ${copy.status})`);
    process.exit(copy.status ?? 1);
}
