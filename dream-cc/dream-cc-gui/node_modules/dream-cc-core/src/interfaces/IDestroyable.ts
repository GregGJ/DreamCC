


/**
 * 可销毁对象的接口。
 * 实现此接口的类应提供一个 destroy 方法，用于执行对象销毁时的清理操作。
 */
export interface IDestroyable {
    /**
     * 销毁对象，执行必要的清理操作。
     */
    destroy(): boolean;
}