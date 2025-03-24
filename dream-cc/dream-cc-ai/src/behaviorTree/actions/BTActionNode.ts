import { BTBlackboard } from "../BTBlackboard";
import { BTNode } from "../BTNode";
import { BTNodeType } from "../BTNodeType";

/**
 * 动作节点基础类
 */
export abstract class BTActionNode extends BTNode {

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    get type():BTNodeType{
        return BTNodeType.ACTION;
    }
}