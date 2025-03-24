import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTControlNode } from "./BTControlNode";


/**
 * 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点会再次执行，reactive所在。
 * 如果某个子节点返回SUCCESS，不再执行，且返回SUCCESS。
 * 如果某个子节点返回FAILURE，立即执行下一个子节点（不会等下一次tick()）。如果所有子节点返回FAILURE，返回FAILURE。
 */
export class BTReactiveFallback extends BTControlNode {

    constructor(name: string,blackboard: BTBlackboard) {
        super(name,blackboard);
    }

    tick(): BTNodeStatus {
        let failure_count: number = 0;
        for (let index = 0; index < this.numChildren; index++) {
            const child = this.$children[index];
            const child_status = child.evaluate();
            switch (child_status) {
                case BTNodeStatus.RUNNING:
                    this.haltChildren(index + 1);
                    return BTNodeStatus.RUNNING;
                case BTNodeStatus.FAILURE:
                    failure_count++;
                    break;
                case BTNodeStatus.SUCCESS:
                    this.haltChildren();
                    return BTNodeStatus.SUCCESS;
                case BTNodeStatus.IDLE:
                    throw new Error("ReactiveFallback: child node is idle");
                default:
                    throw new Error("ReactiveFallback: unknown child node status");
            }
        }
        if (failure_count == this.numChildren) {
            this.haltChildren();
            return BTNodeStatus.FAILURE;
        }
        return BTNodeStatus.RUNNING;
    }
}