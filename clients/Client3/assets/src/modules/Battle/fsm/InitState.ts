import { SpriteFrame, Vec2 } from "cc";
import { DEBUG } from "cc/env";
import { FSMSystem } from "dream-cc-ai";
import { Event, TaskQueue } from "dream-cc-core";
import { AddToParentSystem, DisplayComponent, DisplaySystem, ParentComponent, TransformComponent } from "dream-cc-ecs";
import { LoadingView } from "dream-cc-gui";
import { DDLSPathFinder, DDLSRectMeshFactory, Polygon } from "dream-cc-pathfinding";
import { GamePath } from "../../../games/GamePath";
import { DDLSDebugComponent } from "../ecs/display/DDLSDebugComponent";
import { ImageComponent } from "../ecs/display/ImageComponent";
import { UintAnimationSystem } from "../ecs/display/UnitAnimationSystem";
import { LoadCommonTask } from "../inits/LoadCommonTask";
import { LoadTerrainTask } from "../inits/LoadTerrainTask";
import { LoadTowerTask } from "../inits/LoadTowerTask";
import { LoadWaveTask } from "../inits/LoadWaveTask";
import { BattleEntityFactory } from "../levels/BattleEntityFactory";
import { BattleEntitys } from "../levels/BattleEntitys";
import { BaseState } from "./BaseState";
import { FSMStates } from "./FSMStates";
import { Timeline } from "../utils/Timeline";
import { PathMovementSystem } from "../ecs/movments/PathMovementSystem";





/**
 * 初始化状态
 */
export class InitState extends BaseState {

    private __taskQueue: TaskQueue;

    constructor(level: string) {
        super("InitState", level);
    }

    enter(data?: any): void {
        super.enter(data);
        //清理
        this.__clear();
        //关卡数据更新
        this.model.init(data);
        this.__initSystems();
        this.__initWorld();
        this.__initAssets();
    }

    private __clear(): void {
        this.world.clearAll();
        Timeline.single.reset();
    }

    private __initWorld(): void {
        //世界
        BattleEntityFactory.createEntity(this.world, BattleEntitys.World, this.level.root);
        //静态层
        BattleEntityFactory.createEntity(this.world, BattleEntitys.StaticLayer, BattleEntitys.World);
        BattleEntityFactory.createEntity(this.world, BattleEntitys.StaticEffectLayer, BattleEntitys.World);
        //动态层
        BattleEntityFactory.createEntity(this.world, BattleEntitys.DynamicEffectLayer, BattleEntitys.World);
        BattleEntityFactory.createEntity(this.world, BattleEntitys.DynamicLayer, BattleEntitys.World);

        if (DEBUG) {
            BattleEntityFactory.createEntity(this.world, BattleEntitys.DebugView, BattleEntitys.World, DDLSDebugComponent);
        }
    }

    private __initSystems(): void {
        this.world.addSystems([
            PathMovementSystem,
            UintAnimationSystem,
            AddToParentSystem,
            DisplaySystem,
        ]);
    }

    private __initAssets(): void {
        this.__taskQueue = new TaskQueue();
        this.__taskQueue.addEventHandler(this.__taskEventHandler, this);

        this.__taskQueue.addTask(new LoadCommonTask());
        this.__taskQueue.addTask(new LoadTerrainTask());
        this.__taskQueue.addTask(new LoadWaveTask());
        this.__taskQueue.addTask(new LoadTowerTask());
        //开始任务
        this.__taskQueue.start();
    }

    private __taskEventHandler(e: Event): void {
        switch (e.type) {
            case Event.PROGRESS:
                LoadingView.changeData({ progress: 0.5 + e.progress * 0.2 });
                break;
            case Event.ERROR:
                LoadingView.changeData({ label: e.error.message });
                break;
            case Event.COMPLETE:
                this.__taskQueue.destroy();
                this.__taskQueue = null;
                //数据清理
                this.model.clear();
                
                this.__initBackground();
                this.__initNavigation();

                //位置修改
                let trans = this.world.getComponent(BattleEntitys.World, TransformComponent);
                trans.setPosition(-this.model.terrainConfig.navWidth, -this.model.terrainConfig.navHeight);
                //切换到空闲状态
                this.fsm.switchState(FSMStates.Idle);
                break;
        }
    }

    private __initBackground(): void {
        //根据配置创建背景
        let images = this.model.terrainConfig!.images;
        for (let index = 0; index < images.length; index++) {
            const imageUrl = images[index];
            const url = GamePath.battleURL("levels/images/" + imageUrl.image.replace(".png", ""), SpriteFrame);

            const entity = "bg_" + index;
            this.world.createEntity(entity);
            let trans = this.world.addComponent(entity, TransformComponent);

            let parent = this.world.addComponent(entity, ParentComponent);
            parent.parent = BattleEntitys.StaticLayer;

            let image_com = this.world.addComponent(entity, ImageComponent);
            image_com.url = url;
            trans.x = imageUrl.x;
            trans.y = imageUrl.y;
        }
    }

    private __initNavigation(): void {
        //构建导航网格
        this.model.navMesh = DDLSRectMeshFactory.buildRectangle(
            this.model.terrainConfig!.width + this.model.terrainConfig!.navWidth * 2,
            this.model.terrainConfig!.height + this.model.terrainConfig!.navHeight * 2);

        for (let index = 0; index < this.model.terrainConfig!.areas.length; index++) {
            const element = this.model.terrainConfig!.areas[index];
            //普通区域
            if (element.type == 0) {
                this.model.navMesh!.insertConstraintShape(element.points);
            } else if (element.type == 1) {//结束区域
                this.model.end = new Polygon(element.points);
            }
        }
        this.model.pathfinder = new DDLSPathFinder();
        this.model.pathfinder.mesh = this.model.navMesh!;

        //路径
        this.model.paths = new Map<string, Array<Vec2>>();
        for (let key in this.model.terrainConfig!.paths) {
            const pathsConfig: Array<number> = this.model.terrainConfig!.paths[key];
            let paths: Array<Vec2> = [];
            for (let index = 0; index < pathsConfig.length; index += 2) {
                paths.push(new Vec2(pathsConfig[index], pathsConfig[index + 1]));
            }
            this.model.paths!.set(key, paths);
        }

        //debug
        if (DEBUG) {
            let debug_com = this.world.getAddComponent(BattleEntitys.DebugView, DDLSDebugComponent);
            debug_com.view.drawMesh(this.model.navMesh);
            for (let key in this.model.terrainConfig!.paths) {
                const paths = this.model.terrainConfig!.paths[key];
                debug_com.view.drawPath(paths, false);
            }
        }
    }
}