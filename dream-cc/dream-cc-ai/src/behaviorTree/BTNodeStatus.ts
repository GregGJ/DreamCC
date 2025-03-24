

/**
 * 节点状态
 */
export enum BTNodeStatus {
    /**初始状态 */
    IDLE = 0,
    /**失败 */
    FAILURE,
    /**成功 */
    SUCCESS,
    /**运行中 */
    RUNNING
}