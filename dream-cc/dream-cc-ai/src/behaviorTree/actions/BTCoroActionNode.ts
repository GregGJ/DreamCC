import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTActionNode } from "./BTActionNode";



export abstract class BTCoroActionNode extends BTActionNode {

    private yield: boolean = false;

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    setStatusRunningAndYield() {
        this.status = BTNodeStatus.RUNNING;
        this.yield = true;
    }

    evaluate(): BTNodeStatus {
        if (!this.yield) {
            this.status = this.tick() as BTNodeStatus;
        }
        return this.status;
    }

    halt() {
        this.yield = false;
    }
}
