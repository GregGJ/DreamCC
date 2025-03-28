import { Injector } from "../utils/Injector";
import { ITicker } from "./ITicker";
import { ITickerManager } from "./ITickerManager";
import { TickerManagerImpl } from "./TickerManagerImpl";



/**
 * 心跳驱动器实现
 */
export class TickerManager {

    static KEY: string = "TickerManager";

    /**
     * 心跳驱动接口
     * @param dt 
     */
    static tick(dt: number): void {
        this.impl.tick(dt);
    }

    /**
     * 添加一个心跳驱动
     * @param value 
     */
    static addTicker(value: ITicker): void {
        this.impl.addTicker(value);
    }

    /**
     * 删除一个心跳驱动
     * @param value 
     */
    static removeTicker(value: ITicker): void {
        this.impl.removeTicker(value);
    }

    /**
     * 下一帧回调
     * @param value 
     * @param caller 
     */
    static callNextFrame(value: Function, caller: any): void {
        this.impl.callNextFrame(value, caller);
    }

    /**
     * 清理下一帧回调请求(如果存在的话)
     * @param value
     * @param value 
     * @param caller 
     */
    static clearNextFrame(value: Function, caller: any): void {
        this.impl.clearNextFrame(value, caller);
    }

    private static __impl: ITickerManager;
    static get impl(): ITickerManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new TickerManagerImpl();
        }
        return this.__impl;
    }
}