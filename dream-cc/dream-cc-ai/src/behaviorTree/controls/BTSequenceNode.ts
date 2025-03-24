import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTControlNode } from "./BTControlNode";

/**
 * 按从左到右的顺序依次执行子节点。
 * 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点不会再执行。
 * 如果某个子节点返回SUCCESS，立即执行下一个子节点（不会等下一次tick()）。
 * 如果所有子节点返回SUCCESS，返回SUCCESS。
 */
export class BTSequenceNode extends BTControlNode {

    private __current_index: number = 0;
    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    halt(): void {
        this.__current_index = 0;
        super.halt();
    }

    tick(): BTNodeStatus {
        this.status = BTNodeStatus.RUNNING;
        while (this.__current_index < this.numChildren) {
            const child = this.$children[this.__current_index];
            const child_status = child.evaluate();
            switch (child_status) {
                case BTNodeStatus.RUNNING:
                    return child_status;
                case BTNodeStatus.FAILURE:
                    this.haltChildren();
                    this.__current_index = 0;
                    return child_status;
                case BTNodeStatus.SUCCESS:
                    this.__current_index++;
                    break;
                case BTNodeStatus.IDLE:
                    throw new Error("NodeStatus.IDLE is not a valid status");
                default:
                    throw new Error("Unknown NodeStatus");
            }
        }
        if (this.__current_index === this.numChildren) {
            this.haltChildren();
            this.__current_index = 0;
        }
        return BTNodeStatus.SUCCESS;
    }
}