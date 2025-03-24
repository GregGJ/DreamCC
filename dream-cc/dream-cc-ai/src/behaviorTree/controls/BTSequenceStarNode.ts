import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTControlNode } from "./BTControlNode";

/**
 * 同SequenceNode，不同之处在于如果某个子节点返回FAILURE，返回FAILURE，终止所有节点的执行。
 * 但不复位current_child_idx_。所以当再次tick()时，从FAILURE的子节点开始。
 */
export class BTSequenceStarNode extends BTControlNode{

    private __current_index = 0;

    constructor(name: string,blackboard: BTBlackboard) {
        super(name,blackboard);
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
                    this.haltChildren(this.__current_index);
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