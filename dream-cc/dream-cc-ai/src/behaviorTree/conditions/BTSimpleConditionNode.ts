import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { IBTNode } from "../interfaces/IBTNode";
import { BTConditionNode } from "./BTConditionNode";




/**
* 简单条件节点
*/
export class BTSimpleConditionNode extends BTConditionNode {

    protected tick_functor: (node: IBTNode) => BTNodeStatus;

    constructor(name: string, blackboard: BTBlackboard, tick_functor: (node: IBTNode) => BTNodeStatus) {
        super(name, blackboard);
        this.tick_functor = tick_functor;
    }

    tick(): BTNodeStatus {
        return this.tick_functor(this);
    }
}