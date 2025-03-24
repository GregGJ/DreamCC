import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTControlNode } from "./BTControlNode";

/**
 * 尝试依次执行其所有子节点，并且每个子节点只有在成功执行后才会继续到下一个。
 * 如果任何一个子节点失败，整个序列失败。
 */
export class BTReactiveSequence extends BTControlNode {

    constructor(name: string,blackboard: BTBlackboard) {
        super(name,blackboard);
    }

    tick(): BTNodeStatus {
        let success_count = 0;
        let running_count = 0;

        for (let index = 0; index < this.numChildren; index++) {
            const child_node = this.$children[index];
            const child_status = child_node.evaluate();
            switch (child_status) {
                case BTNodeStatus.RUNNING:
                    running_count++;
                    this.haltChildren(index + 1);
                    return BTNodeStatus.RUNNING;
                case BTNodeStatus.FAILURE:
                    this.haltChildren();
                    return BTNodeStatus.FAILURE;
                case BTNodeStatus.SUCCESS:
                    success_count++;
                    break;
                case BTNodeStatus.IDLE:
                    throw new Error("ReactiveSequence: child node is idle");
                default:
                    throw new Error("ReactiveSequence: child node status is invalid");
            }
        }
        if (success_count == this.numChildren) {
            this.haltChildren();
            return BTNodeStatus.SUCCESS;
        }
        return BTNodeStatus.RUNNING;
    }
}