import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTControlNode } from "./BTControlNode";

/**
 * 有2或3个子节点，node1就是if判断的条件。
 * 如果node1返回SUCCESS，那么node2执行；
 * 否则，node3执行。
 * 如果没有node3，返回FAILURE。
 * 该结点not reactive，
 * 体现在一旦node1不返回RUNNING了，就进入了node2或node3的执行，以后tick()不会再执行node1了，也即不会再检查if条件的变化。
 */
export class BTIfThenElseNode extends BTControlNode{

    private __child_idx:number=0;

    constructor(name:string,blackboard:BTBlackboard){
        super(name,blackboard);
    }

    tick(): BTNodeStatus {
        if(this.numChildren!=2&&this.numChildren!=3){
            throw new Error(this.name+"IfThenElseNode:the number of children must be 2 or 3")
        }
        this.status=BTNodeStatus.RUNNING;
        if(this.__child_idx==0){
            const condition_status=this.$children[0].evaluate();
            if(condition_status==BTNodeStatus.RUNNING){
                return condition_status;
            }else if(condition_status==BTNodeStatus.SUCCESS){
                this.__child_idx=1;
            }else if(condition_status==BTNodeStatus.FAILURE){
                if(this.numChildren==3){
                    this.__child_idx=2;
                }else{
                    return condition_status;
                }
            }
        }
        if(this.__child_idx>0){
            const child_status=this.$children[this.__child_idx].evaluate();
            if(child_status==BTNodeStatus.RUNNING){
                return BTNodeStatus.RUNNING;
            }else{
                this.haltChildren();
                this.__child_idx=0;
                return child_status;
            }
        }
        throw new Error(this.name+"Something unexpected happened in IfThenElseNode")
    }

    halt():void{
        this.__child_idx = 0;
        super.halt();
    }
}