import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTControlNode } from "./BTControlNode";

/**
 * 是IfThenElseNode的reactive版本。
 * reactive体现在每次tick()都会执行node1，即检查if条件的变化。
 * 若node1返回值有SUCCESS、FAILURE的切换变化，就会打断node2或node3的执行，重新选择对应的node。
 */
export class BTWhileDoElseNode extends BTControlNode {

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }
    
    tick(): BTNodeStatus {
        if (this.numChildren != 2 && this.numChildren != 3) {
            throw new Error(this.name + "IfThenElseNode:the number of children must be 2 or 3")
        }
        this.status = BTNodeStatus.RUNNING;
        // 每次tick()都会先执行第1个节点，即判断条件，reactive体现在此，及时响应外界变化
        const condition_status = this.$children[0].evaluate();
        if (condition_status == BTNodeStatus.RUNNING) {
            return condition_status;
        }
        let status = BTNodeStatus.IDLE;
        // 根据第1个节点的返回值，执行对应节点，并终止另外的节点
        if (condition_status == BTNodeStatus.SUCCESS) {
            this.haltChild(2);
            status = this.$children[1].evaluate();
        } else if (condition_status == BTNodeStatus.FAILURE) {
            this.haltChild(1);;
            status = this.$children[2].evaluate();
        }

        if (status == BTNodeStatus.RUNNING) {
            return BTNodeStatus.RUNNING;
        } else {
            this.haltChildren();
            return status;
        }
    }
}