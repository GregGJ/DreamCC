import { BTBlackboard } from "../BTBlackboard";
import { BTNode } from "../BTNode";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTNodeType } from "../BTNodeType";
import { IBTControlNode } from "../interfaces/IBTControlNode";
import { IBTNode } from "../interfaces/IBTNode";


/**
 * 控制节点
 */
export abstract class BTControlNode extends BTNode implements IBTControlNode {

    protected $children: IBTNode[] = [];

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
        this.$children = [];
    }

    addChild(child: IBTNode) {
        if (this.$children.indexOf(child) > -1) {
            throw new Error("child already exists");
        }
        this.$children.push(child);
        child.parent = this;
    }

    getChild(idx: number): IBTNode {
        if (idx < 0 || idx >= this.$children.length) {
            throw new Error("index out of range");
        }
        return this.$children[idx];
    }

    halt(): void {
        this.haltChildren();
        this.status = BTNodeStatus.IDLE;
    }

    haltChild(idx: number): void {
        if (idx < 0 || idx >= this.$children.length) {
            throw new Error("index out of range");
        }
        const child = this.$children[idx];
        if (child.status === BTNodeStatus.RUNNING) {
            child.halt();
        }
        child.status = BTNodeStatus.IDLE;
    }

    haltChildren(start: number = 0): void {
        for (let i = start; i < this.$children.length; ++i) {
            this.haltChild(i);
        }
    }

    destroy(): void {
        this.haltChildren();
        for (let i = 0; i < this.$children.length; ++i) {
            const child = this.$children[i];
            child.destroy();
        }
        super.destroy();
    }

    get numChildren(): number {
        return this.$children.length;
    }

    get type(): BTNodeType {
        return BTNodeType.CONTROL;
    }
}