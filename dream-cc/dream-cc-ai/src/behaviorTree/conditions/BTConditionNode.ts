import { BTBlackboard } from "../BTBlackboard";
import { BTNode } from "../BTNode";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTNodeType } from "../BTNodeType";

/**
* 条件节点
*/
export abstract class BTConditionNode extends BTNode {

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    halt(): void {
        this.status = BTNodeStatus.IDLE;
    }

    get type(): BTNodeType {
        return BTNodeType.CONDITION;
    }
}