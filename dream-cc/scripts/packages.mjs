// Single source of truth for the workspace dependency graph.
// core -> {ecs, pathfinding, fairygui-cc} -> {ai, gui}
export const graph = {
    'dream-cc-core': [],
    'dream-cc-ecs': ['dream-cc-core'],
    'dream-cc-pathfinding': ['dream-cc-core'],
    'fairygui-cc': ['dream-cc-core'],
    'dream-cc-ai': ['dream-cc-core', 'dream-cc-ecs'],
    'dream-cc-gui': ['dream-cc-core', 'fairygui-cc'],
};

export const packages = Object.keys(graph);

// group packages into parallelizable levels (Kahn's algorithm)
export function buildLevels(deps = graph) {
    const remaining = new Map(Object.entries(deps));
    const levels = [];
    while (remaining.size > 0) {
        const level = [...remaining.entries()]
            .filter(([, depsOf]) => depsOf.every((dep) => !remaining.has(dep)))
            .map(([name]) => name);
        if (level.length === 0) {
            throw new Error(`[build] circular dependency: ${[...remaining.keys()].join(', ')}`);
        }
        levels.push(level);
        for (const name of level) remaining.delete(name);
    }
    return levels;
}

export function dependentsOf(name, deps = graph) {
    return packages.filter((pkg) => deps[pkg].includes(name));
}
