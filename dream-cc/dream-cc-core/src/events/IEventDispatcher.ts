import { IDestroyable } from "../interfaces/IDestroyable";
import { ResURL } from "../res/ResURL";
import { Event } from "./Event";
import { EventType } from "./EventType";




/**
 * 事件派发器接口
 */
export interface IEventDispatcher extends IDestroyable {

    /**
     * 添加事件
     * @param type 
     * @param caller 
     * @param handler 
     * @param priority 优先级 数字越小优先级越高 
     */
    on(type: EventType, handler: (e: Event) => void, caller?: any, priority?: number): void;

    /**
     * 删除事件监听
     * @param type 
     * @param caller 
     * @param handler 
     */
    off(type: EventType, handler: (e: Event) => void, caller?: any): void;

    /**
     * 删除指定对象所有的事件处理
     * @param caller 
     */
    offByCaller(caller: any): void;

    /**
     * 删除所有事件监听
     */
    offAllEvent(): void;

    /**
     * 派发事件
     * @param type 事件类型
     * @param data 事件数据
     * @param err  错误信息
     * @param progress 进度信息(0-1)
     */
    emit(type: EventType, data?: any, err?: Error, progress?: number,url?:ResURL): void;

    /**
     * 是否有事件监听
     * @param type 
     */
    hasEvent(type: EventType): boolean;

    /**
     * 是否包含指定函数事件监听
     * @param type 
     * @param caller 
     * @param handler 
     */
    hasEventHandler(type: EventType, handler: (e: Event) => void, caller?: any): boolean;
}