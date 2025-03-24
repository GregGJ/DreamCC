import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTDecoratorNode } from "./BTDecoratorNode";


/**
 * 如果子节点执行后返回RUNNING，该节点返回RUNNING；
 * 如果子节点执行后返回SUCCESS，该节点返回FAILURE；
 * 如果子节点执行后返回FAILURE，该节点返回SUCCESS；
 * 即对子节点的执行结果取反。
 */
export class BTInverterNode extends BTDecoratorNode {

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    tick(): BTNodeStatus {
        this.status = BTNodeStatus.RUNNING;

        const child_state = this.getChild()!.evaluate();

        switch (child_state) {
            case BTNodeStatus.SUCCESS: {
                return BTNodeStatus.FAILURE;
            }
            case BTNodeStatus.FAILURE: {
                return BTNodeStatus.SUCCESS;
            }
            case BTNodeStatus.RUNNING: {
                return BTNodeStatus.RUNNING;
            }
            default: {
                throw new Error('A child node must never return IDLE');
            }
        }
    }
}