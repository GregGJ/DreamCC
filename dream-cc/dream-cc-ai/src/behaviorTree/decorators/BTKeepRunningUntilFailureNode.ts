import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTDecoratorNode } from "./BTDecoratorNode";

/**
 * 如果子节点执行后返回RUNNING或SUCCESS，下次tick()继续执行子节点，直到子节点返回FAILURE。
 */
export class BTKeepRunningUntilFailureNode extends BTDecoratorNode {


    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    tick(): BTNodeStatus {
        this.status = BTNodeStatus.RUNNING;

        const child_state = this.getChild()!.evaluate();

        switch (child_state) {
            case BTNodeStatus.FAILURE: {
                return BTNodeStatus.FAILURE;
            }
            case BTNodeStatus.SUCCESS:
            case BTNodeStatus.RUNNING: {
                return BTNodeStatus.RUNNING;
            }
        }
        return this.status;
    }
}