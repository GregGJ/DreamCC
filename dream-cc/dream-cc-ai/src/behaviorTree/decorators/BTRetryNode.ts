import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { IBTNodeConfig } from "../interfaces/IBTNodeConfig";
import { BTDecoratorNode } from "./BTDecoratorNode";

/**
 * 如果子节点执行后返回RUNNING，该节点返回RUNNING；
 * 如果子节点执行后返回SUCCESS，该节点返回SUCCESS，不再执行；
 * 如果子节点执行后返回FAILURE，该节点再次尝试执行子节点，直到尝试了num_attempts次；
 */
export class BTRetryNode extends BTDecoratorNode {

    private max_attempts_: number = 1;

    private try_index: number;

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
        this.try_index = 0;
    }

    init(data: IBTNodeConfig): void {
        if (data.hasOwnProperty('num')) {
            // @ts-ignore
            this.max_attempts_ = data['num'];
        }
    }

    halt() {
        this.try_index = 0;
        super.halt();
    }

    tick(): BTNodeStatus {
        this.status = BTNodeStatus.RUNNING;
        while (this.try_index < this.max_attempts_ || this.max_attempts_ == -1) {
            const child_state = this.getChild()!.evaluate();
            switch (child_state) {
                case BTNodeStatus.SUCCESS: {
                    this.try_index = 0;
                    this.haltChild();
                    return BTNodeStatus.SUCCESS;
                }
                case BTNodeStatus.FAILURE:
                    this.try_index++;
                    this.haltChild();
                    break;
                case BTNodeStatus.RUNNING:
                    return BTNodeStatus.RUNNING;
                default:
                    throw new Error('A child node must never return IDLE');
            }
        }

        this.try_index = 0;
        return BTNodeStatus.FAILURE;
    }
}
