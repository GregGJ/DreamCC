/**
 * 可销毁对象的接口。
 * 实现此接口的类应提供一个 destroy 方法，用于执行对象销毁时的清理操作。
 */
interface IDestroyable {
    /**
     * 销毁对象，执行必要的清理操作。
     */
    destroy(): boolean;
}

/**
 * 可重用对象接口
 */
interface IPoolable extends IDestroyable {
    /**
     * 重置对象到初始状态
     */
    reset(): void;
}

/**
 * 资源URL类型
 */
type ResURL = string | {
    url: string;
    type: any;
    bundle: string;
    isSub: boolean;
};

/**
 * 事件类型
 */
type EventType = number | string;

/**
 * 事件对象
 */
declare class Event implements IPoolable {
    static readonly START: string;
    static readonly PROGRESS: string;
    static readonly COMPLETE: string;
    static readonly ERROR: string;
    static readonly SHOW: string;
    static readonly HIDE: string;
    static readonly ADD: string;
    static readonly REMOVE: string;
    static readonly UPDATE: string;
    static readonly CLEAR: string;
    static readonly STATE_CHANGED: string;
    static readonly VALUE_CHANGED: string;
    static readonly ADD_CHILD: string;
    static readonly REMOVE_CHILD: string;
    static readonly CHILD_VALUE_CHANGED: string;
    /**
     * 事件类型
     */
    type?: EventType;
    /**
     * 事件数据
     */
    data?: any;
    /**
     * 资源地址
     */
    url?: ResURL;
    /**
     * 错误信息
     */
    err?: Error;
    /**
     * 进入百分比(0-1)
     */
    progress?: number;
    /**
     * 事件是否停止
     */
    propagationStopped: boolean;
    constructor();
    /**
     * 初始化
     * @param type
     * @param data
     * @param err
     * @param progress
     * @param url
     */
    init(type: EventType, data?: any, err?: Error, progress?: number, url?: ResURL): void;
    reset(): void;
    destroy(): boolean;
    release(): void;
    /**
     * 创建事件对象
     * @param type
     * @param data
     * @param err
     * @param url
     * @param progress
     * @returns
     */
    static create(type: EventType, data?: any, err?: Error, progress?: number, url?: ResURL): Event;
}

/**
 * 事件派发器接口
 */
interface IEventDispatcher extends IDestroyable {
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
    emit(type: EventType, data?: any, err?: Error, progress?: number, url?: ResURL): void;
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

/**
 * 事件派发器
 */
declare class EventDispatcher implements IEventDispatcher {
    /**
     * 全局事件派发起
     */
    static Main: EventDispatcher;
    /**
     * 事件是否异步处理
     */
    eventAync: boolean;
    /**
     * 需要派发的事件
     */
    private __needEmit;
    private __listeners;
    private __callers;
    constructor();
    /**
     * 添加事件监听
     * @param type      事件类型
     * @param handler   事件回调函数
     * @param caller    回调函数this指针
     * @param priority  优先级
     */
    on(type: EventType, handler: (e: Event) => void, caller?: any, priority?: number): void;
    /**
     * 删除事件监听
     * @param type      事件类型
     * @param handler   事件回调函数
     * @param caller    回调函数this指针
     * @returns
     */
    off(type: EventType, handler: (e: Event) => void, caller?: any): void;
    /**
     * 删除指定对象所有的事件监听
     * @param caller
     * @returns
     */
    offByCaller(caller: any): void;
    /**
     * 删除所有事件监听
     */
    offAllEvent(): void;
    /**
     * 派发事件
     * @param type
     * @param data
     * @param err
     * @param progress
     * @param url
     * @returns
     */
    emit(type: EventType, data?: any, err?: Error, progress?: number, url?: ResURL): void;
    private __emit;
    hasEvent(type: EventType): boolean;
    hasEventHandler(type: EventType, handler: (e: Event) => void, caller: any): boolean;
    destroy(): boolean;
}

/**
 * 简易注入器
 */
declare class Injector {
    /**类型字典*/
    private static __injectedMap;
    /**实例字典*/
    private static __instanceMap;
    /**
     * 注入
     * @param key
     * @param clazz   类型或实例
     */
    static inject(customKey: string, clazz: any): void;
    /**
     * 获取已注入的类型实例
     */
    static getInject(customKey: string): any | null;
}

export { Event, EventDispatcher, EventType, IDestroyable, IEventDispatcher, Injector };
