import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { IBTNode } from "../interfaces/IBTNode";
import { BTAsyncActionNode } from "./BTAsyncActionNode";


export class BTSimpleActionNode extends BTAsyncActionNode {

   protected tickFunctor: (node: IBTNode) => BTNodeStatus;

   constructor(name: string, blackboard: BTBlackboard, tickFunctor: (node: IBTNode) => BTNodeStatus) {
       super(name, blackboard);
       this.tickFunctor = tickFunctor;
   }
   
   tick(): BTNodeStatus {
       let prevStatuc = this.status;
       if (prevStatuc === BTNodeStatus.IDLE) {
           this.status = BTNodeStatus.RUNNING;
           prevStatuc = BTNodeStatus.RUNNING;
       }
       let status = this.tickFunctor(this);
       if (status !== prevStatuc) {
           this.status = status;
       }
       return status;
   }
}