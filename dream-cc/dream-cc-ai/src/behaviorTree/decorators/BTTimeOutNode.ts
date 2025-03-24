import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { IBTNodeConfig } from "../interfaces/IBTNodeConfig";
import { BTDecoratorNode } from "./BTDecoratorNode";

/**
 * 在设置的msec 毫秒内，返回子节点执行的状态。
 * 若子节点返回FAILURE或SUCCESS，不再执行。
 * 如果超时，终止子节点执行，并返回FAILURE。
 */
export class BTTimeOutNode extends BTDecoratorNode {

    private timerHandler: number | undefined;
    private child_halted: boolean;
    private msec: number = 0;
    private timeout_started: boolean;

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
        this.child_halted = false;
        this.timeout_started = false;
    }

    init(data: IBTNodeConfig): void {
        if (data.hasOwnProperty('msec')) {
            // @ts-ignore
            this.msec = data['msec'];
        }
    }

    tick(): BTNodeStatus {
        if (!this.timeout_started) {
            this.timeout_started = true;
            this.status = BTNodeStatus.RUNNING;
            this.child_halted = false;

            if (this.msec > 0) {
                this.timerHandler = setTimeout(() => {
                    if (this.getChild()!.status == BTNodeStatus.RUNNING) {
                        this.child_halted = true;
                        this.haltChild();
                    }
                }, this.msec);
            }
        }

        if (this.child_halted) {
            this.timeout_started = false;
            return BTNodeStatus.FAILURE;
        } else {
            const child_status = this.getChild()!.evaluate();
            if (child_status != BTNodeStatus.RUNNING) {
                this.timeout_started = false;
                if (this.timerHandler) {
                    clearTimeout(this.timerHandler);
                    this.timerHandler = undefined;
                }
            }
            return child_status;
        }
    }
}
