import { BTBlackboard } from "../BTBlackboard";
import { BTNode } from "../BTNode";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTNodeType } from "../BTNodeType";
import { IBTNode } from "../interfaces/IBTNode";


/**
 * 装饰节点
 */
export abstract class BTDecoratorNode extends BTNode {

    protected $child: IBTNode | null = null;

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    /**
     * 设置子节点
     * @param child 
     */
    setChild(child: IBTNode) {
        if (this.$child != null) {
            throw new Error("Child already set");
        }
        this.$child = child;
    }

    getChild(): IBTNode | null {
        return this.$child;
    }

    halt(): void {
        this.haltChild();
        this.status = BTNodeStatus.IDLE;
    }

    haltChild(): void {
        if (!this.$child) {
            return;
        }
        if (this.$child.status == BTNodeStatus.RUNNING) {
            this.$child.halt();
        }
        this.$child.status = BTNodeStatus.IDLE;
    }

    destroy(): void {
        super.destroy();
        if (this.$child) {
            if (this.$child.status == BTNodeStatus.RUNNING) {
                this.$child.halt();
            }
            this.$child.destroy();
            this.$child = null;
        }
    }

    get type(): BTNodeType {
        return BTNodeType.DECORATOR;
    }
}