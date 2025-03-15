import { ITicker } from "./ITicker";




/**
 * 心跳驱动器接口
 */
export interface ITickerManager {
    
    /**
     * 心跳驱动函数
     * @param dt 
     */
    tick(dt: number): void;

    /**
     * 添加心跳
     * @param value 
     */
    addTicker(value: ITicker): void;

    /**
     * 删除心跳
     * @param value 
     */
    removeTicker(value: ITicker): void;

    /**
     * 下一帧回调
     * @param value 
     * @param caller 
     */
    callNextFrame(value: Function, caller: any): void;

    /**
     * 清理下一帧回调请求(如果存在的话)
     * @param value 
     * @param caller 
     */
    clearNextFrame(value: Function, caller: any): void;
}