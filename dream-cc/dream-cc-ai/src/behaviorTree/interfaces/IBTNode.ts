import { BTNodeStatus } from "../BTNodeStatus";
import { BTNodeType } from "../BTNodeType";



/**
 * 节点接口
 */
export interface IBTNode {
    /**名称 */
    name: string;
    /**父节点 */
    parent: IBTNode | null;
    /**黑板 */
    blackboard: any;
    /**状态 */
    status: BTNodeStatus;
    /**初始化 */
    init(data: any): void;
    /**评估*/
    evaluate(): BTNodeStatus;
    /**执行*/
    tick(): BTNodeStatus | Promise<BTNodeStatus>;
    /**停止*/
    halt(): void;
    /**销毁 */
    destroy(): void;
    /**类型 */
    readonly type: BTNodeType;
}