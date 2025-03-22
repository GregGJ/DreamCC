import { IDestroyable } from "../interfaces/IDestroyable";


/**
 * 可重用对象接口
 */
export interface IPoolable extends IDestroyable {
    /**
     * 重置对象到初始状态
     */
    reset(): void;
}