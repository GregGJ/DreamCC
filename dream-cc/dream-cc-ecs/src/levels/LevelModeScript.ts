import { ECSWorld } from "../core/ECSWorld";
import { LevelMode } from "./LevelMode";

/**
 * 关卡模式脚本(用于拆分和重用逻辑)
 */
export abstract class LevelModeScript {
    /**
     * 模式
     */
    mode: LevelMode;

    constructor() {

    }

    /**
     * 初始化
     */
    abstract init(): void;
    /**
     * 销毁
     */
    abstract destroy(): void;

    tick(dt: number): void {

    }

    /**
     * 世界
     */
    get world(): ECSWorld {
        return this.mode.world;
    }
}