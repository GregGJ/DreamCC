import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { IBTNodeConfig } from "../interfaces/IBTNodeConfig";
import { BTDecoratorNode } from "./BTDecoratorNode";


/**
 * 重复执行子节点NUM_CYCLES 次，若每次都返回 SUCCESS，该节点返回SUCCESS；
 * 若子节点某次返回FAILURE，该节点不再重复执行子节点，立即返回FAILURE；
 * 若子节点返回RUNNING，该节点也返回RUNNING。
 */
export class BTRepeatNode extends BTDecoratorNode {
    private num_cycles: number = -1;
    private try_index: number;

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
        this.try_index = 0;
    }

    init(data: IBTNodeConfig): void {
        if (data.hasOwnProperty('num')) {
            // @ts-ignore
            this.num_cycles = data['num'] || 1;
        }
        this.num_cycles = isNaN(this.num_cycles) ? -1 : this.num_cycles;
    }

    tick(): BTNodeStatus {
        this.status = BTNodeStatus.RUNNING;

        while (this.try_index < this.num_cycles || this.num_cycles == -1) {
            const child_state = this.getChild()!.evaluate();

            switch (child_state) {
                case BTNodeStatus.SUCCESS:
                    this.try_index++;
                    this.haltChild();
                    break;
                case BTNodeStatus.FAILURE:
                    this.try_index = 0;
                    this.haltChild();
                    return BTNodeStatus.FAILURE;

                case BTNodeStatus.RUNNING:
                    return BTNodeStatus.RUNNING;

                default:
                    throw new Error('A child node must never return IDLE');
            }
        }
        this.try_index = 0;
        return BTNodeStatus.SUCCESS;
    }

    halt() {
        this.try_index = 0;
        super.halt();
    }
}
