import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { BTActionNode } from "./BTActionNode";

/**
 * 状态类动作节点
 */
export abstract class BTStatefulActionNode extends BTActionNode {


    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
    }

    tick(): BTNodeStatus {
        const initial_status = this.status;
        if (initial_status === BTNodeStatus.IDLE) {
            const new_status = this.onEnter();
            if (new_status === BTNodeStatus.IDLE) {
                throw new Error('AsyncActionNode2::onStart() must not return IDLE');
            }
            if (new_status != BTNodeStatus.RUNNING) {
                this.onExit();
            }
            return new_status;
        }

        if (initial_status === BTNodeStatus.RUNNING) {
            const new_status = this.onTick();
            if (new_status === BTNodeStatus.IDLE) {
                throw new Error('AsyncActionNode2::onRunning() must not return IDLE');
            }
            if (new_status != BTNodeStatus.RUNNING) {
                this.onExit();
            }
            return new_status;
        }
        return initial_status;
    }



    halt(): void {
        if (this.status === BTNodeStatus.RUNNING) {
            this.onHalted();
        }
        this.status = BTNodeStatus.IDLE;
    }

    /**进入*/
    abstract onEnter(): BTNodeStatus;

    /**tick */
    abstract onTick(): BTNodeStatus;

    /**退出 */
    abstract onExit(): void;

    /**被打断 */
    onHalted(): void {
        this.onExit();
    }
}