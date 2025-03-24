import { Node } from "cc";
import { LevelMode } from "./LevelMode";
import { LevelStatus } from "./LevelStatus";
import { Event, EventDispatcher } from "dream-cc-core";
import { ECSWorld } from "../core/ECSWorld";


/**
 * 关卡
 */
export class Level extends EventDispatcher {
    /**
     * 关卡世界KEY
     */
    key: string;
    private __status: LevelStatus;
    private __world_root: Node;
    private __world: ECSWorld;
    private __mode: LevelMode;
    private __entered: boolean = false;
    constructor() {
        super();
        this.__status = new LevelStatus();
    }

    /**
     * 初始化
     * @param root 
     * @param entity_max_count  最大实体数量
     */
    init(root: Node, entity_max_count: number = 1024): void {
        let old = this.__world;
        if (old) {
            old.clearAll();
            old.destroy();
        }
        this.__world = new ECSWorld(entity_max_count);
        this.__world_root = root;
    }

    /**
     * 进入关卡
     * @param mode          玩法模式
     * @param mode_data     玩法数据
     */
    enter(mode: LevelMode, ...mode_data: any[]): void {
        let old = this.__mode;
        if (old) {
            old.destroy();
            this.world.clearAll();
        }
        this.__mode = mode;
        this.__mode.level = this;
        this.__mode.on(Event.COMPLETE, this.__enterComplete, this);
        this.__mode.init(...mode_data);
    }

    private __enterComplete(e: Event): void {
        this.__mode.off(Event.COMPLETE, this.__enterComplete, this);
        this.__entered = true;
    }

    /**
     * 关卡心跳统一接口
     * @param dt 
     */
    tick(dt: number): void {
        if (this.__entered) {
            this.__world.tick(dt);
            this.__mode.tick(dt);
        }
    }

    /**
     * 退出关卡
     */
    exit(): void {
        this.__entered = false;
        //清理世界中的所有内容
        this.__world.clearAll();
        //销毁模式
        this.__mode.destroy();
        this.__mode = null;
        this.status.clear();
    }

    /**
     * 根节点
     */
    get root(): Node {
        return this.__world_root;
    }

    /**
     * 世界
     */
    get world(): ECSWorld {
        return this.__world;
    }

    /**
     * 模式
     */
    get mode(): LevelMode {
        return this.__mode;
    }

    /**
     * 状态(用于记录一下对于关卡中的一些"全局"状态信息)")
     */
    get status(): LevelStatus {
        return this.__status;
    }
}