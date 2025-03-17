



/**
 * 计时器接口
 */
export interface ITimer {
    /**
     * 当前时间(毫秒)推荐使用
     */
    readonly currentTime: number;
    /**
     * 绝对时间(毫秒)注意效率较差，不推荐使用！
     */
    readonly absTime: number;
    /**
     * 帧间隔时间(毫秒)
     */
    readonly deltaTime: number;
    /**
     * 重新校准
     */
    reset(time?: number): void;
}