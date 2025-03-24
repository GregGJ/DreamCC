import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTActionNode } from "./BTActionNode";


/**
* 同步动作节点
*/
export abstract class BTSyncActionNode extends BTActionNode {

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    // throws if the derived class return RUNNING.
    public evaluate(): BTNodeStatus {
        const stat = super.evaluate();
        if (stat === BTNodeStatus.RUNNING) {
            throw new Error('SyncActionNode MUST never return RUNNING');
        }
        return stat;
    }

    public halt() {
        this.status = BTNodeStatus.IDLE;
    }
}