import { BTBlackboard } from "./BTBlackboard";
import { BTNodeStatus } from "./BTNodeStatus";
import { BTNodeType } from "./BTNodeType";
import { IBTNode } from "./interfaces/IBTNode";
import { IBTNodeConfig } from "./interfaces/IBTNodeConfig";


export abstract class BTNode implements IBTNode {

    /**名称 */
    name: string;

    /**父节点*/
    parent: IBTNode | null = null;

    /**黑板 */
    blackboard: BTBlackboard;

    /**状态 */
    protected $status: BTNodeStatus = BTNodeStatus.IDLE;

    constructor(name: string, blackboard: BTBlackboard) {
        this.name = name;
        this.blackboard = blackboard;
    }

    init(data: IBTNodeConfig): void {

    }

    evaluate(): BTNodeStatus {
        this.status = this.tick() as BTNodeStatus;
        return this.status;
    }

    abstract tick(): BTNodeStatus | Promise<BTNodeStatus>;

    abstract halt(): void;

    destroy(): void {
        this.parent = null;
        this.blackboard = null;
    }

    /**获取状态*/
    get status(): BTNodeStatus {
        return this.$status;
    }

    set status(value: BTNodeStatus) {
        this.$status = value;
    }

    get type(): BTNodeType {
        return BTNodeType.ERROR;
    }
}