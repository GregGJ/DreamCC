import { TickerManager } from "dream-cc-core";
import { ECSEntity } from "./ECSEntity";
import { ECSWorld } from "./ECSWorld";
import { IECSComponent } from "./IECSComponent";



/**
 * 组件抽象类
 */
export abstract class ECSComponent implements IECSComponent {

    /**所属世界 */
    world: ECSWorld;

    /**所属entity*/
    entity: ECSEntity;

    /**脏数据标记回调*/
    dirtySignal: (() => void);

    constructor() {

    }

    /**
     * 启用组件
     */
    enable(): void {

    }

    /**标记该组件数据为脏*/
    markDirtied(): void {
        TickerManager.callNextFrame(this.__nextFrame, this);
    }


    private __nextFrame(): void {
        this.dirtySignal && this.dirtySignal();
    }

    /**重置*/
    reset(): void {
        TickerManager.clearNextFrame(this.__nextFrame, this);
        this.dirtySignal = null;
        this.world = null;
        this.entity = undefined;
    }

    destroy(): boolean {
        this.reset();
        return true;
    }
}