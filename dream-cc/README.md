# dream-cc

基于 **Cocos Creator + FairyGUI** 的游戏开发框架，采用 npm workspaces 管理的 monorepo。

## 包结构

| 包 | 版本 | 说明 | 依赖 |
| --- | --- | --- | --- |
| `dream-cc-core` | 1.0.9 | 框架核心：模块管理、资源加载、事件、网络、音频、配置、数据序列化、工具集与引擎入口 | — |
| `dream-cc-ecs` | 1.0.9 | ECS：World / Entity / Component / System，含阵营、变换、节点层级、显示与关卡 | `dream-cc-core` |
| `dream-cc-ai` | 1.0.9 | 行为树（BehaviorTree）+ 有限状态机（FSM），支持 ECS 集成 | `dream-cc-core`, `dream-cc-ecs` |
| `dream-cc-gui` | 1.0.9 | GUI 层：Mediator / Proxy、层级管理、弹窗、加载视图、Tab、Tooltip，基于 FairyGUI | `dream-cc-core`, `fairygui-cc` |
| `dream-cc-pathfinding` | 1.0.9 | 寻路：网格图 A* 与 DDLS 导航网格寻路（多边形网格 + 漏斗算法） | `dream-cc-core` |
| `fairygui-cc` | 1.2.1 | FairyGUI 的 Cocos Creator 运行时（含 tween、滚动、关系、加载器等） | `dream-cc-core` |

另有：

- `fgui-dream-cc` — FairyGUI 编辑器插件（TypeScript / puerts），发布时接管代码生成，为 dream-cc 框架输出 UI 代码。
- `libs/` — Cocos Creator 类型声明（`cc.d.ts`、`cc.env.d.ts`），供各包编译与类型检查使用。

## 环境要求

- Node.js（建议与 `package.json` 中 `packageManager` 声明一致，当前为 `npm@12.0.2`）
- npm（workspaces + Turborepo）

## 安装

```bash
npm install
```

## 构建命令

| 命令 | 说明 |
| --- | --- |
| `npm run build` | 默认入口：Turborepo 并行构建 + 缓存（推荐） |
| `npm run build:local` | 进程内并行全量构建，不经过 turbo；构建前自动清空 `dist/` |
| `npm run dev` | 监听模式：改动源码后自动重建受影响的包及其下游，并拷贝到客户端 |
| `npm run typecheck` | Turborepo 并行增量类型检查 |
| `npm run typecheck:local` | 逐包串行 `tsc --noEmit` |
| `npm run copy` | 将 `dist/` 产物拷贝到客户端 |
| `npm run clean` | 清空 `dist/` |

构建产物输出到 `dist/`，每个包一份：

```text
dist/
├── dream-cc-core.mjs / .d.ts / .mjs.map
├── dream-cc-ecs.mjs / .d.ts / .mjs.map
├── dream-cc-ai.mjs / .d.ts / .mjs.map
├── dream-cc-gui.mjs / .d.ts / .mjs.map
├── dream-cc-pathfinding.mjs / .d.ts / .mjs.map
└── fairygui-cc.mjs / .d.ts / .mjs.map
```

`npm run copy`（以及 `dev` 模式）默认把 `.mjs`、`.d.ts`、`.mjs.map` 增量拷贝到：

```text
D:\DreamCC\clients\Client3\assets\libs
```

可通过环境变量覆盖目标目录（见下）。

## 环境变量

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `DREAM_CC_SOURCEMAP` | 开 | 设为 `0` 关闭 sourcemap 输出 |
| `DREAM_CC_SKIP_MAPS` | — | 设为 `1` 时拷贝跳过 `.map` 文件 |
| `DREAM_CC_CLIENT_LIBS` | `D:\DreamCC\clients\Client3\assets\libs` | 自定义客户端拷贝目录 |
| `DREAM_CC_SKIP_COPY` | — | 设为 `1` 跳过拷贝步骤 |

## 构建细节

- **依赖图**：`core → {ecs, pathfinding, fairygui-cc} → {ai, gui}`，构建按拓扑分层并行。
- **JS 打包**：esbuild，`ESM` / `target ES6`；`cc`、`cc/env` 与本地工作区包保持 external，各包独立成 bundle。
- **类型声明**：rollup-plugin-dts 生成单文件 `.d.ts`，声明中同样保留对外部包的真实 import。
- **Turborepo 缓存**：每包使用独立的输出通配（`../dist/<pkg>.*`）避免缓存快照互相覆盖；`scripts/**`、`package.json`、`tsconfig.base.json` 变更会自动失效全部缓存。缓存与日志位于各包 `.turbo/` 与 `node_modules/.cache/`，均已 gitignore。
- **TypeScript 配置**：统一继承 `tsconfig.base.json`；类型检查启用 `incremental`，增量信息写入 `node_modules/.cache/tsc/`。
- `dist/` 为构建产物（仓库内已跟踪）；`*.map` 与 `*.tsbuildinfo` 不纳入版本控制。

## 在 Cocos Creator 中使用

将 `dist/`（或拷贝到客户端的 `assets/libs`）中的 `.mjs` 作为 ESM 模块引入，类型声明使用对应 `.d.ts`。各包之间的依赖通过包名解析，例如：

```ts
import { Engine } from "dream-cc-core";
import { ECSWorld } from "dream-cc-ecs";
```

## fgui-dream-cc 插件

`fgui-dream-cc` 是 FairyGUI 编辑器的发布插件：发布 UI 包时接管默认代码生成（见 `main.ts` / `GenCode_TS.ts`），生成符合 dream-cc 框架规范的 TypeScript UI 代码，并输出到 `exportPath\<包名>\ui`。

## License

MIT
