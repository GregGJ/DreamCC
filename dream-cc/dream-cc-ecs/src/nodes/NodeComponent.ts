import { Node } from "cc";
import { ECSEntity } from "../core/ECSEntity";
import { ECSWorld } from "../core/ECSWorld";
import { IECSComponent } from "../core/IECSComponent";
import { TickerManager } from "dream-cc-core";




export class NodeComponent extends Node implements IECSComponent {

    world: ECSWorld | null = null;
    entity: ECSEntity | null = null;
    dirtySignal: (() => void) | null = null;

    constructor() {
        super();
    }

    enable(): void {
        this.name = this.entity.toString();
    }

    markDirtied(): void {
        TickerManager.callNextFrame(this.nextFrame, this);
    }

    private nextFrame(): void {
        this.dirtySignal && this.dirtySignal();
    }

    reset(): void {
        TickerManager.clearNextFrame(this.nextFrame, this);
        this.dirtySignal = null;
        this.world = null;
        this.entity = -1;
        this.active = true;
        this.setPosition(0, 0, 0);
        this.setScale(1, 1, 1);
        this.setRotationFromEuler(0, 0, 0);
        //从父节点中删除
        if (this.parent) {
            this.removeFromParent();
        }
        //清理自身内容
        this.removeAllChildren();
    }
}