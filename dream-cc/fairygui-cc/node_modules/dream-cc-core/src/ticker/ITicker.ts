



/**
 * 心跳接口
 */
export interface ITicker {
    /**
     * 心跳函数
     * @param dt 
     */
    tick(dt: number): void;
}