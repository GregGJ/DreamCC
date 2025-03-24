import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTControlNode } from "./BTControlNode";

/**
 * 在勾选第一个子节点之前，节点状态变为RUNNING。
 * 如果一个子节点返回FAILURE，则回退标记下一个子节点。
 * 如果最后一个子进程也返回FAILURE，那么所有的子进程都停止，回退进程返回FAILURE。
 * 如果子进程返回SUCCESS，则停止并返回SUCCESS。所有的孩子都停下来了。
 */
export class BTFallbackNode extends BTControlNode {

    private __current_child_idx: number;
    constructor(name: string,blackboard: BTBlackboard) {
        super(name,blackboard);
        this.__current_child_idx = 0;
    }

    tick(): BTNodeStatus {
        const child_count = this.numChildren;
        this.status = BTNodeStatus.RUNNING;
        while (this.__current_child_idx < child_count) {
            const child_node = this.$children[this.__current_child_idx];
            const child_status = child_node.evaluate();

            switch (child_status) {
                case BTNodeStatus.RUNNING:
                    return child_status
                case BTNodeStatus.SUCCESS:
                    this.haltChildren();
                    this.__current_child_idx = 0;
                    return child_status;
                case BTNodeStatus.FAILURE:
                    this.__current_child_idx++;
                    break;
                case BTNodeStatus.IDLE:
                    throw new Error("NodeStatus.IDLE is not allowed in FallbackNode");
                default:
                    throw new Error("Unknown NodeStatus");
            }
        }
        if (this.__current_child_idx == child_count) {
            this.haltChildren();
            this.__current_child_idx = 0;
        }
        return BTNodeStatus.FAILURE;
    }

    halt(): void {
        this.__current_child_idx = 0;
        super.halt();
    }
}