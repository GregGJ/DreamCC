import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { IBTNodeConfig } from "../interfaces/IBTNodeConfig";
import { BTDecoratorNode } from "./BTDecoratorNode";

/**
 * 延迟指定时间后执行子节点
 */
export class BTDelayNode extends BTDecoratorNode {

    private delay_started: boolean;
    private delay_complete: boolean;
    private delay_aborted: boolean;
    /**定时器句柄*/
    public time_handler: number | undefined = undefined;
    /**延迟时间 */
    private delayTime: number = 0;

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
        this.delay_started = false;
        this.delay_aborted = false;
        this.delay_complete = false;
    }

    init(data: IBTNodeConfig): void {
        if (data.hasOwnProperty('delayTime')) {
            // @ts-ignore
            this.delayTime = data['delayTime'] || 0;
        }
        this.delayTime = Math.max(this.delayTime, 0);
    }

    tick(): BTNodeStatus {
        if (!this.delay_started) {
            this.delay_complete = false;
            this.delay_aborted = false;
            this.delay_started = true;
            this.status = BTNodeStatus.RUNNING;
            this.time_handler = setTimeout(this.__timeOut.bind(this), this.delayTime);
        }

        if (this.delay_aborted) {
            this.delay_aborted = false;
            this.delay_started = false;
            return BTNodeStatus.FAILURE;
        } else if (this.delay_complete) {
            this.delay_started = false;
            this.delay_aborted = false;
            const child_status = this.getChild()!.evaluate();
            return child_status;
        } else {
            return BTNodeStatus.RUNNING;
        }
    }

    /**
     * 延迟结束
     */
    private __timeOut(): void {
        this.delay_complete = true;
        this.time_handler = undefined;
    }

    halt(): void {
        this.delay_started = false;
        if (this.time_handler != undefined) {
            clearTimeout(this.time_handler!);
            this.time_handler = undefined;
            this.delay_aborted = true;
        }
        super.halt();
    }
}