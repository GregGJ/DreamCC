import { BTBlackboard } from "../BTBlackboard";
import { BTNodeStatus } from "../BTNodeStatus";
import { IBTNodeConfig } from "../interfaces/IBTNodeConfig";
import { BTControlNode } from "./BTControlNode";

/**
 * 当返回SUCCESS的子节点个数>=THRESHOLD_SUCCESS时，返回SUCCESS。
 * 当返回FAILURE的子节点个数>=THRESHOLD_FAILURE时，返回FAILURE。
 * 当程序判断绝不可能SUCCESS时，返回FAILURE。如 failure_children_num > children_count - success_threshold_。
 */
export class BTParallelNode extends BTControlNode {

    private success_threshold: number = 0;
    private failure_threshold: number = 1;
    private __skip_list: Map<number,number>;

    constructor(name: string, blackboard: BTBlackboard) {
        super(name, blackboard);
        this.__skip_list = new Map<number,number>();
    }

    init(data: IBTNodeConfig): void {
        if (data.hasOwnProperty('success')) {
            //@ts-ignore
            this.success_threshold = data["success"];
        }
        if (data.hasOwnProperty('failure')) {
            //@ts-ignore
            this.failure_threshold = data["failure"];
        }
        this.success_threshold = Math.max(this.success_threshold, 0);
        this.failure_threshold = Math.max(this.failure_threshold, 1);
    }

    tick(): BTNodeStatus {
        let success_childred_num = 0;
        let failure_childred_num = 0;

        const children_count = this.$children.length;

        if (children_count < this.success_threshold) {
            throw new Error('Number of children is less than threshold. Can never succeed.');
        }

        if (children_count < this.failure_threshold) {
            throw new Error('Number of children is less than threshold. Can never fail.');
        }

        // Routing the tree according to the sequence node's logic:
        for (let i = 0; i < children_count; i++) {
            const child_node = this.$children[i];

            const in_skip_list = this.__skip_list.has(i);

            let child_status: BTNodeStatus;
            if (in_skip_list) {
                child_status = child_node.status;
            } else {
                child_status = child_node.evaluate();
            }

            switch (child_status) {
                case BTNodeStatus.SUCCESS:
                    {
                        if (!in_skip_list) {
                            this.__skip_list.set(i, i);
                        }
                        success_childred_num++;

                        if (success_childred_num == this.success_threshold) {
                            this.__skip_list.clear();
                            this.haltChildren();
                            return BTNodeStatus.SUCCESS;
                        }
                    }
                    break;
                case BTNodeStatus.FAILURE:
                    {
                        if (!in_skip_list) {
                            this.__skip_list.set(i, i);
                        }
                        failure_childred_num++;

                        // It fails if it is not possible to succeed anymore or if
                        // number of failures are equal to failure_threshold_
                        if (
                            failure_childred_num > children_count - this.success_threshold ||
                            failure_childred_num == this.failure_threshold
                        ) {
                            this.__skip_list.clear();
                            this.haltChildren();
                            return BTNodeStatus.FAILURE;
                        }
                    }
                    break;
                case BTNodeStatus.RUNNING:
                    {
                        // do nothing
                    }
                    break;
                default: {
                    throw new Error('A child node must never return IDLE');
                }
            }
        }
        return BTNodeStatus.RUNNING;
    }

    halt(): void {
        this.__skip_list.clear();
        super.halt();
    }

    destroy(): void {
        this.__skip_list.clear();
        super.destroy();
    }
}