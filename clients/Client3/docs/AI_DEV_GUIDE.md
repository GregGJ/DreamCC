# AI 开发指南（面向 Codex）

> 本指南用于 Codex（或任何 AI 编程助手）在 `D:\DreamCC\clients\Client3` 上继续开发时快速进入状态。
> 完整技术背景请先读 [TECHNICAL.md](./TECHNICAL.md)，本文件是"怎么干活"的操作手册。

## 1. 30 秒速览

- 这是 **Cocos Creator 3.8.8 + TypeScript** 的塔防游戏客户端，UI 用 **FairyGUI**，玩法逻辑用 **dream-cc** 框架（GUI / ECS / AI-FSM / 寻路）。
- 代码入口：`assets/loadingViews/Main.ts` → `assets/src/games/Entrance.ts`。
- 一个 UI 界面 = 一个模块目录 `assets/src/modules/<Name>/`，内含 `Binder`（生成）+ `Mediator` + `ViewCreator`，并在 `assets/res/configs/guiconfig.json` 与 `GUIKeys.ts` 注册。
- 配置数据来自 `D:\DreamCC\configs\*.xlsx`，用 `build_excel.bat` 导出；存档模型用 `build_exi.bat` 导出接口。
- git 仓库根在 `D:\DreamCC`（不是 Client3），执行 git 需 `-c safe.directory=D:/DreamCC`。
- 当前仓库有**未提交的 WIP**（Binder 重构 + 战斗逻辑调整），动手前先看第 9 节。

## 2. 常用命令

| 操作 | 命令 |
| --- | --- |
| 导出配置（Excel → JSON + TS 存取器） | `build_excel.bat`（双击或在项目根执行） |
| 导出模型接口（models → models_exi） | `build_exi.bat` |
| 编译编辑器扩展 | 在 `extensions/dream-cc-plugin` 下 `npm run build`（先 `npm install`） |
| 刷新资源库（编辑器运行中） | `curl http://localhost:7456/asset-db/refresh` |
| 查看 git 状态/日志 | `git -c safe.directory=D:/DreamCC status` / `git -c safe.directory=D:/DreamCC log --oneline -20` |

> 注意：`build_excel.bat` 中的 `dream_cli.exe` 路径是 `D:\DreamCC\tools\dream_cli\target\release\dream_cli.exe`，若工具重编译过，先确认该 exe 存在。

## 3. 代码目录速查

| 想做什么 | 去哪里 |
| --- | --- |
| 改启动/初始化流程 | `assets/src/games/inits/`、`assets/src/games/Entrance.ts` |
| 加 UI 界面 | `assets/src/modules/<Name>/` + `guiconfig.json` + `GUIKeys.ts` |
| 改配置字段/加配置表 | `D:\DreamCC\configs\*.xlsx` → `build_excel.bat` → `assets/src/games/configs/` |
| 改存档 | `assets/src/models/playerPrefs/` → `build_exi.bat` → `assets/src/models_exi/` |
| 改战斗玩法 | `assets/src/modules/Battle/`（fsm、ecs、levels、inits、datas） |
| 改资源加载 | `assets/src/games/res/`（ani/tower 加载器）、`assets/src/games/GamePath.ts` |
| 改 UI 包结构 | FairyGUI 工程 `D:\DreamCC\ui_project`（导出到各模块 `ui/` 目录） |
| 改框架库 | `D:\DreamCC\dream-cc\<lib>\src\`，构建后把成品同步到 `assets/libs/` |
| 查框架 API | `assets/libs/*.d.ts`（类型声明最全） |

## 4. 开发流程

### 4.1 新增一个 UI 模块

1. 在 FairyGUI 工程（`D:\DreamCC\ui_project`）创建包与组件，导出二进制 + 图集到 `assets/src/modules/<Name>/ui/`；
2. 在 Cocos Creator 中把 `assets/src/modules/<Name>` 标记为 AssetBundle（`.meta` 的 `userData.isBundle = true`），并在 `Main.ts`/需要处加载该 bundle；
3. 在 `assets/res/configs/guiconfig.json` 添加条目（key/layer/bundleName/packageName/comName）；
4. 同步 `assets/src/games/consts/GUIKeys.ts` 添加枚举（也可用 dream-cc-plugin 的 GUI 面板）；
5. 用 FairyGUI 代码生成 Binder（`<Name>Binder.ts`，勿手写）；
6. 新建 `<Name>Mediator.ts`，按模板实现：

```ts
import { _decorator, Component } from 'cc';
import { IGUIMediator, IViewCreator, GUIMediator } from 'dream-cc-gui';
import { <Name>Binder, UI_<Name> } from './<Name>Binder';

const { ccclass, property } = _decorator;

@ccclass('<Name>ViewCreator')
export default class <Name>ViewCreator extends Component implements IViewCreator {
    createMediator(): IGUIMediator {
        <Name>Binder.bindAll();
        return new <Name>Mediator();
    }
}

export class <Name>Mediator extends GUIMediator {
    constructor() {
        super();
        // 可选：this.configs / this.assets / this.modules / this.showLoadingView
    }
    init() { super.init(); /* 绑定事件、绑定数据 */ }
    show(data?: any) { super.show(data); }
    showedUpdate(data?: any) {}
    hide() { super.hide(); }
    destroy() { super.destroy(); }
    private get view(): UI_<Name> { return this.ui as UI_<Name>; }
}
```

7. 打开/关闭：`GUIManager.open(GUIKeys.<Name>, data)`、`this.close(true)`。

### 4.2 新增/修改配置表

1. 编辑 `D:\DreamCC\configs\xxx.xlsx`（表结构：标题行/类型行/注释行/数据行，数组用 `,` 分隔）；
2. 项目根执行 `build_excel.bat`；
3. 核对 `assets/src/games/configs/ConfigKeys.ts` 出现新键、`Configs.d.ts` 出现新类型；
4. 如需业务查询方法，在对应 `*Accessor.ts` 中手写（如 `LevelAccessor.getLevel`）；
5. 在 `assets/src/games/inits/ConfigInitTask.ts` 用 `ConfigManager.register(ConfigKeys.Xxx_Xxx, XxxAccessor)` 注册；
6. 业务代码用 `ConfigManager.getAccessor(ConfigKeys.Xxx_Xxx)` 获取存取器。

### 4.3 新增/修改存档字段

1. 修改 `assets/src/models/playerPrefs/` 下模型或 `RecordPropertys.ts`；
2. 执行 `build_exi.bat` 重新生成 `assets/src/models_exi/EXI_Playerprefs.ts`；
3. 业务代码通过 `EXI_Playerprefs.Module_playerPrefs` 接口访问，字段读写走 `DictionaryProperty` / `ArrayProperty` / `NumberProperty`；
4. 保存后调用 `recordModule.save()`。

### 4.4 新增怪物/塔/技能（战斗扩展）

1. 配置侧：在 `monster.xlsx` / `tower.xlsx` / `skills.xlsx` 加行 → `build_excel.bat`；
2. 资源侧：怪物动画 JSON + 图集放 `assets/res/battles/entitys/monsters/<skin>/`；塔皮肤 JSON 放 `assets/res/battles/entitys/towers/<type>/`（元素引用 `images/` 与 `ani/`）；
3. 代码侧：
   - 怪物：`BattleEntityFactory.createMonster` 已按配置创建，必要时扩展 `MonsterVO` / 属性；
   - 塔：目前只有塔点（`TowerPointComponnent`），建造/升级/攻击系统尚未实现，参考 `LoadTowerTask` 已加载的塔皮肤资源；
   - 技能：`Skills` 配置已就绪但无运行时实现（见 TODO）。

### 4.5 修改 dream-cc 框架库

1. 改 `D:\DreamCC\dream-cc\<lib>\src\` 源码（例：core 的 `src/bindings/Binder.ts`）；
2. 在对应库目录执行构建（core 为 rollup，`rollup.config.js`；gui/ecs/ai 等各有构建脚本）；
3. 把构建产物（`.mjs` / `.d.ts` / `.map`）复制到 `assets/libs/`；
4. 同步更新 `import-map.json` / `tsconfig.json` 中对应映射（一般无需改，名字不变）；
5. 在 Cocos Creator 中刷新资源并重新编译验证。

## 5. 代码约定（必须遵守）

1. **生成文件绝不手改**：`*Binder.ts`、`models_exi/EXI_*.ts`、`games/configs/ConfigKeys.ts`、`games/configs/Configs.d.ts`。改完源头用工具重新生成；
2. 源码 UTF-8 无 BOM，中文注释；不要引入 BOM；
3. 私有成员/方法用 `__` 前缀（`__xxxClick`）；
4. Mediator 中事件绑定用 `this.bindEvent(obj, event, handler, this)`；列表复用项在回池时 `unbindEvent`；
5. 数据绑定用 `this.bindAA(source, prop, target, targetProp)`（属性→属性）、`this.bindAM(source, props, cb, this)`（属性→回调）；
6. 界面资源/配置/模块依赖在 Mediator 构造函数声明（`this.configs/assets/modules`），不要自行加载；
7. 战斗逻辑的时间推进统一走 `Timeline.single`，保证暂停正确；
8. `ResRequest` 用 `Res.create(url, refKey, progress, complete)` 创建，`load()` 后 `getRef()` 取资源，不需要时 `dispose()`；
9. 错误提示：`LoadingView.changeData({label: err.message})`；
10. 多语言文案用 `I18N.tr("KEY", ...args)`，不要硬编码用户可见文本。

## 6. API 速查

完整签名以 `assets/libs/*.d.ts` 为准，以下是常用姿势。

### dream-cc-core

```ts
import { Engine, Res, ConfigManager, ModuleManager, Task, TaskQueue, Event, EventDispatcher, I18N, AudioManager } from 'dream-cc-core';

// 引擎
Engine.start(plugins, onProgress, onComplete);
Engine.tick(dtMs);                       // 每帧驱动，Entrance.update 中调用

// 资源
Res.setLoader("ani", UnitAnimationLoader);
Res.loadAssetBundles(["games", "Basics"]);      // Promise
const req = Res.create(url, "refKey", (p) => {}, (err) => { req.getRef().content; req.dispose(); });
req.load();

// 配置
ConfigManager.register(ConfigKeys.Level_Level, LevelAccessor);
const acc = ConfigManager.getAccessor(ConfigKeys.Level_Level) as LevelAccessor;

// 模块（数据）
ModuleManager.single.getModule(ModuleKeys.Playerprefs);

// 任务
const queue = new TaskQueue();
queue.addTask([new TaskA(), new TaskB()]);
queue.addEventHandler(handler, this);   // Event.PROGRESS / ERROR / COMPLETE
queue.start(node);

// 其他
I18N.tr("KEY", arg1, arg2);
AudioManager.playMusic(GamePath.soundURL("MusicMap"));
AudioManager.playSound(GamePath.soundURL("Sound_Coins"));
```

### dream-cc-gui

```ts
import { GUIManager, GUIMediator, IViewCreator, IGUIMediator, SubGUIMediator } from 'dream-cc-gui';

GUIManager.open(GUIKeys.Map, data);              // data 传给 show(data)
GUIManager.close(GUIKeys.Battle, true);
this.close(true);                                // Mediator 内关闭
this.getModule(ModuleKeys.Playerprefs);          // Mediator 内取模块
this.$subMediators = [new SubX(this.ui, this)];  // 只在 init() 里赋值
```

### dream-cc-ecs

```ts
import { LevelManager, ECSWorld, ECSSystem, ECSComponent, TransformComponent, ParentComponent, DisplayComponent, DataComponent, CampComponent } from 'dream-cc-ecs';

LevelManager.single.initLevel(LevelKeys.Battle, root2D, 1000);  // 容量 1000
LevelManager.single.enter(LevelKeys.Battle, new BattleMode(), data);
LevelManager.single.exit(LevelKeys.Battle);
LevelManager.single.tick(dt);

const world = LevelManager.single.getLevel(LevelKeys.Battle).world;
world.createEntity("name");
world.addComponent(entity, TransformComponent);
world.getComponent(entity, TransformComponent);
world.getComponents(CampComponent);        // 全部实体某组件列表
world.addSystems([SystemA, SystemB]);      // 顺序敏感
world.removeEntity(entity);
world.clearAll();
```

自定义组件继承 `ECSComponent`（实现 `reset()`），系统继承 `ECSSystem`（构造传 `MatcherAllOf`，实现 `$tick(entitys, dt)`）。

### dream-cc-ai

```ts
import { FSM, FSMComponent, FSMSystem } from 'dream-cc-ai';

const fsm = new FSM(owner, "BattleFSM");
fsm.addState(FSMStates.Init, new InitState(LevelKeys.Battle));
fsm.switchState(FSMStates.Init, data);
fsm.tick(dt);
```

状态类实现 `IState`：`init(fsm)` / `enter(data)` / `tick(dt)` / `exit()` / `destroy()`。

### dream-cc-pathfinding

```ts
import { DDLSRectMeshFactory, DDLSPathFinder, Polygon } from 'dream-cc-pathfinding';

const mesh = DDLSRectMeshFactory.buildRectangle(width, height);
mesh.insertConstraintShape(points);          // 障碍
const end = new Polygon(points);             // 结束区域
const finder = new DDLSPathFinder(); finder.mesh = mesh;
```

## 7. 常见陷阱

1. **GUI 打不开**：先查 `guiconfig.json` 有没有条目、`GUIKeys.ts` 有没有枚举、模块目录是否 `isBundle=true`、Mediator 构造函数是否正确声明依赖；
2. **Binder 与 UI 不同步**：FairyGUI 改了包没重新生成 Binder，或改的是 `ui/*.bin` 但 bundle 未刷新；重新生成/刷新资源；
3. **配置读不到/类型不对**：`ConfigInitTask` 漏注册、`ConfigKeys` 没重新生成、xlsx 表头行/类型行与 dream_cli 参数不匹配（-v/-w/-x/-y）；
4. **存档字段丢失**：`Module_playerPrefs` 与 `EXI_Playerprefs` 不一致（改了模型没跑 `build_exi.bat`），或 `RecordPropertys` 键名变更；
5. **动画不播放/方向不对**：`UnitAnimationComponent` 需要 `Timeline` 在推进；方向由 `Direction8Utils` 计算，`ActionUtils.getResAction` 只支持 attack/idle/walking 三类动作；
6. **列表复用事件泄漏**：`itemRenderer` 里绑定的事件必须在 `backToPool` 中 `unbindEvent`（参考 HomeMediator）；
7. **暂停失效**：暂停时 `BattleModel.paused=true`，但 `Timeline` 与 `RunningState.tick` 都检查了 `paused`；如果新增逻辑绕过了这两个入口就会继续跑；
8. **资源泄漏**：`ResRequest` 不 `dispose()` 会导致缓存不释放；战斗资源统一登记到 `BattleModel.assets` 由 `clear()` 释放；
9. **直接改生成文件**：会被下次工具导出覆盖，务必改源头；
10. **编码问题**：如果编辑器/终端显示中文乱码，检查文件是否被保存成了 GBK 或带 BOM；仓库统一 UTF-8 无 BOM；
11. **误提交整个 monorepo**：git 根在 `D:\DreamCC`，提交前用 `git status` 确认只包含本次改动；不要动其他客户端与工具链的无关改动。

## 8. 调试与排障

- **编辑器预览**：Cocos Creator 预览默认 `http://localhost:7456`；VS Code 直接 F5（chrome 配置）调试；
- **资源刷新**：改完 `.ts`/资源后在编辑器触发编译；命令行可用 `curl http://localhost:7456/asset-db/refresh`；
- **加载进度**：`Entrance` 阶段进度 0~1（引擎+配置）；战斗 `InitState` 内进度 0.5~0.7（资源加载）；
- **战斗调试**：`DEBUG`（`cc/env`）下 Map 支持 L/D/M/S 键盘快捷改关卡/难度/模式/星级；`DDLSDebugComponent` 会绘制导航网格与路径；
- **类型声明**：`assets/src/games/configs/Configs.d.ts` 是配置类型真相源；找不到类型先跑 `build_excel.bat`；
- **框架报错**：`assets/libs/*.d.ts` 有全部 API 注释（中文）；框架源码在 `D:\DreamCC\dream-cc\`。

## 9. 当前工作区状态（2026-08 基线）

最近提交：

```text
587e496 1.添加属性表 2.战斗失败及结算逻辑梳理。
92f00a5 1.刷怪逻辑梳理 2.战斗流程(推出，重新开始，继续)逻辑调试
afd56f9 战斗流程梳理
4bb2016 增加库，梳理战斗界面逻辑
8ff10e1 增加AI库，寻路库和ecs库
```

未提交的 WIP（`git status`）：

- `assets/libs/dream-cc-core.*` 与 `D:\DreamCC\dream-cc\dream-cc-core\` 源码：**Binder 重构**（新增 `BinderUtils.ts`，`Binder.ts` 大改）；
- `assets/src/games/inits/EngineInitTask.ts`、`assets/src/games/configs/MonsterAccessor.ts`：小改动；
- 战斗相关：`UnitAnimationComponent`、`PathMovementComponent`、`InitState`、`RunningState`、`BattleEntityFactory`、`BattleMode`、新增 `ecs/states/`（血条组件/系统）；
- `assets/src/models_exi/EXI_Playerprefs.ts`：重新生成的模型接口；
- `tools/dream_cli`：导出逻辑微调（code_generater/datas/excel2json/utils）；
- 未跟踪：`Battle/ai.meta`、`Battle/ecs/states/`、`dream-cc-core/src/bindings/BinderUtils.ts`、`tools/cc_module_check/`。

含义：

- 当前分支 `main`，基线约停在 2025-03-30，之后的工作以 WIP 形式存在；
- **开始新任务前**：先 `git -c safe.directory=D:/DreamCC status` 确认工作区状态；涉及 `dream-cc-core` 的绑定 API（`bindAA/bindAM`）改动时，注意 Binder 重构可能影响所有 Mediator；
- 若新改动与上述 WIP 重叠，先询问用户是否先提交/暂存现有改动，避免互相覆盖。

## 10. 常见任务检查清单

### 新增界面

- [ ] FairyGUI 包与组件导出到 `modules/<Name>/ui/`
- [ ] 目录 `isBundle=true`
- [ ] `guiconfig.json` 条目
- [ ] `GUIKeys.ts` 枚举
- [ ] Binder 生成且 `bindAll()` 被调用
- [ ] Mediator 构造声明依赖、实现生命周期
- [ ] 业务入口 `GUIManager.open(...)` 验证

### 新增配置表

- [ ] xlsx 放入 `D:\DreamCC\configs\`
- [ ] `build_excel.bat` 成功
- [ ] `ConfigKeys.ts` / `Configs.d.ts` 更新
- [ ] `ConfigInitTask` 注册
- [ ] Accessor 提供查询方法
- [ ] 运行时验证 `getAccessor(...)` 可取到数据

### 战斗改动

- [ ] 明确改动落在 FSM（流程）、ECS（实体行为）、inits（加载）哪一层
- [ ] 使用 `Timeline` 而非裸 `dt` 累计
- [ ] 资源请求登记到 `BattleModel.assets` 并释放
- [ ] 系统加入 `InitState.__initSystems` 且顺序正确
- [ ] 暂停/重开/退出路径都验证（Settings state=2 回调）

## 11. 进一步了解

- 完整技术文档：[TECHNICAL.md](./TECHNICAL.md)
- 框架 API：`assets/libs/*.d.ts`
- 编辑器扩展源码：`extensions/dream-cc-plugin/src/`
- 配置工具源码：`D:\DreamCC\tools\dream_cli\src\`
- 作者联系方式（扩展 README）：QQ 群 706344417 / 微信 GregAs3
