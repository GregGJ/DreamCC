# AGENTS.md — Client3（塔防游戏客户端）

本文件是 Codex 等 AI 编程助手在本仓库工作的入口。**开始任何任务前，先阅读：**

1. [docs/AI_DEV_GUIDE.md](./docs/AI_DEV_GUIDE.md) —— 开发流程、代码约定、API 速查、常见陷阱、当前 WIP 状态
2. [docs/TECHNICAL.md](./docs/TECHNICAL.md) —— 完整技术文档（架构、模块、配置、战斗系统）

## 项目一句话

Cocos Creator 3.8.8 + TypeScript + dream-cc（core/gui/ecs/ai/pathfinding）+ FairyGUI 的 Kingdom Rush 风格塔防游戏客户端。git 仓库根在 `D:\DreamCC`，本目录是其中的 `clients/Client3`。

## 关键路径

- 游戏代码：`assets/src/games/`（入口、常量、配置、资源加载器）
- UI 模块：`assets/src/modules/<Name>/`（Binder 生成 + Mediator + ViewCreator）
- 存档模型：`assets/src/models/`、`assets/src/models_exi/`（生成）
- 配置 JSON：`assets/res/configs/`；Excel 源：`D:\DreamCC\configs\`
- 框架成品：`assets/libs/*.mjs` + `*.d.ts`；框架源码：`D:\DreamCC\dream-cc\`
- 编辑器扩展：`extensions/dream-cc-plugin/`；FairyGUI 源工程：`D:\DreamCC\ui_project`

## 常用命令

```powershell
# 配置导出（Excel -> JSON + TS 存取器）
.\build_excel.bat

# 模型接口导出（models -> models_exi）
.\build_exi.bat

# git（仓库根在上级目录，需 safe.directory）
git -c safe.directory=D:/DreamCC status
git -c safe.directory=D:/DreamCC log --oneline -20
```

## 硬性规则

1. **不要手工修改生成文件**：`*Binder.ts`、`assets/src/models_exi/*`、`assets/src/games/configs/ConfigKeys.ts`、`Configs.d.ts`。需要时改源头并重新生成。
2. 源码统一 UTF-8 无 BOM；注释用中文；私有成员用 `__` 前缀。
3. 新 UI 界面必须遵循 Mediator + ViewCreator + Binder 模式，并在 `assets/res/configs/guiconfig.json` 与 `assets/src/games/consts/GUIKeys.ts` 注册。
4. 新配置表必须完整走：Excel 源 → `build_excel.bat` → `ConfigKeys.ts` → `assets/src/games/inits/ConfigInitTask.ts` 注册 → `ConfigManager.getAccessor` 使用。
5. 修改 `assets/libs/` 框架成品前，先确认 `D:\DreamCC\dream-cc\` 下的源码是否需要同步修改并重新构建。
6. 战斗玩法主要在 `assets/src/modules/Battle/`（FSM + ECS）中实现；时间推进用 `Timeline.single`，资源请求要 `dispose()`。
7. 提交前检查 `git status`，只提交本次相关改动（monorepo 根在 `D:\DreamCC`，勿误提交其他客户端/工具链的无关内容）。
8. 当前工作区存在未提交 WIP（Binder 重构 + 战斗逻辑），任务开始前先确认基线，避免覆盖他人改动。

## 技术栈速查

- 引擎：Cocos Creator 3.8.8，设计分辨率 1920x1080，`strict: false`
- UI：FairyGUI（`fairygui-cc`），运行时加载 `ui/*.bin` + 图集
- 框架：dream-cc-core / gui / ecs / ai（FSM）/ pathfinding（DDLS）
- 配置工具：`D:\DreamCC\tools\dream_cli`（Rust）
- 入口：`assets/loadingViews/Main.ts` → `assets/src/games/Entrance.ts`
