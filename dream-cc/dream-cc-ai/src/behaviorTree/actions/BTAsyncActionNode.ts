import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTActionNode } from "./BTActionNode";


/**
* 异步动作节点基础类
*/
export abstract class BTAsyncActionNode extends BTActionNode {

   private halt_requested: boolean;

   constructor(name: string, blackboard: BTBlackboard) {
       super(name,blackboard);
       this.halt_requested = false;
   }
       
   evaluate(): BTNodeStatus {
       if (this.status === BTNodeStatus.IDLE) {
           this.status = BTNodeStatus.RUNNING;
           this.halt_requested = false;
           (async () => {
               try {
                   // this.waiting = true;
                   this.status = await this.tick();
                   // this.waiting = false;
               } catch (error) {
                   // this.waiting = false;
                   throw new Error(error as any);
               }
           })();
       }
       return this.status;
   }

   public isHaltRequested(): boolean {
       return this.halt_requested;
   }

   halt() {
       this.halt_requested = true;
       // while (this.waiting) {}
       // this.setStatus(NodeStatus.IDLE);
   }
}