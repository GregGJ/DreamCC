import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTDecoratorNode } from "./BTDecoratorNode";

/**
 * 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回SUCCESS，即强制返回成功状态。
 */
export class BTForceSuccessNode extends BTDecoratorNode {

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    tick(): BTNodeStatus {
        this.status = BTNodeStatus.RUNNING;

        const child_state = this.getChild()!.evaluate();

        switch (child_state) {
            case BTNodeStatus.FAILURE:
            case BTNodeStatus.SUCCESS: {
                return BTNodeStatus.SUCCESS;
            }
            case BTNodeStatus.RUNNING: {
                return BTNodeStatus.RUNNING;
            }
        }
        return this.status;
    }
}