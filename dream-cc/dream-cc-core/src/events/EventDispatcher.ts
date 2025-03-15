import { ResURL } from "../res/ResURL";
import { TickerManager } from "../ticker/TickerManager";
import { Event } from "./Event";
import { EventListener } from "./EventListener";
import { EventType } from "./EventType";
import { IEventDispatcher } from "./IEventDispatcher";



/**
 * 事件派发器
 */
export class EventDispatcher implements IEventDispatcher {

    /**
     * 全局事件派发起
     */
    static Main: EventDispatcher = new EventDispatcher();

    /**
     * 事件是否异步处理
     */
    eventAync: boolean = false;

    /**
     * 需要派发的事件
     */
    private __needEmit: Array<Event> = [];

    private __listeners: Map<EventType, Array<EventListener>>;
    private __callers: Map<any, Array<EventListener>>;

    constructor() {
        this.__listeners = new Map<EventType, Array<EventListener>>();
        this.__callers = new Map<any, Array<EventListener>>();
    }

    /**
     * 添加事件监听
     * @param type      事件类型
     * @param handler   事件回调函数
     * @param caller    回调函数this指针
     * @param priority  优先级
     */
    on(type: EventType, handler: (e: Event) => void, caller?: any, priority?: number): void {
        let listeners = this.__listeners.get(type);
        if (!listeners) {
            listeners = [];
            this.__listeners.set(type, listeners);
        }
        //检测是否重复
        for (const element of listeners) {
            if (element.equals(type, handler, caller)) {
                throw new Error(`重复添加事件监听：${type} ${handler} ${caller}`);
            }
        }
        //添加事件监听
        const listener = new EventListener(type, handler, caller, priority);
        listeners.push(listener);
        listeners.sort((a, b) => a.priority - b.priority);
        //添加到caller分组
        let callerListeners = this.__callers.get(caller);
        if (!callerListeners) {
            callerListeners = [];
            this.__callers.set(caller, callerListeners);
        }
        callerListeners.push(listener);
    }

    /**
     * 删除事件监听
     * @param type      事件类型
     * @param handler   事件回调函数
     * @param caller    回调函数this指针
     * @returns 
     */
    off(type: EventType, handler: (e: Event) => void, caller?: any): void {
        let listeners = this.__listeners.get(type);
        if (!listeners) {
            return;
        }
        let index = listeners.findIndex((element) => element.equals(type, handler, caller));
        if (index < 0) {
            return;
        }
        listeners.splice(index, 1);
        //从caller分组中删除
        let callerListeners = this.__callers.get(caller);
        if (!callerListeners) {
            return;
        }
        index = callerListeners.findIndex((element) => element.equals(type, handler, caller));
        if (index < 0) {
            return;
        }
        callerListeners.splice(index, 1);
    }

    /**
     * 删除指定对象所有的事件监听
     * @param caller    
     * @returns 
     */
    offByCaller(caller: any): void {
        let callerListeners = this.__callers.get(caller);
        if (!callerListeners) {
            return;
        }
        while (callerListeners.length > 0) {
            let listener = callerListeners[0];
            this.off(listener.type!, listener.handler!, listener.caller);
        }
    }

    /**
     * 删除所有事件监听
     */
    offAllEvent(): void {
        this.__listeners.forEach(list => {
            list.forEach(element => {
                element.destroy();
            });
        });
        this.__listeners.clear();
        this.__callers.clear();
    }

    /**
     * 派发事件
     * @param type 
     * @param data 
     * @param err 
     * @param progress 
     * @param url 
     * @returns 
     */
    emit(type: EventType, data?: any, err?: Error, progress?: number, url?: ResURL): void {
        if (this.__listeners.has(type)) {
            return;
        }
        const event = Event.create(type, data, err, progress, url);
        this.__needEmit.push(event);
        if (this.eventAync) {
            TickerManager.callNextFrame(this.__emit, this);
        } else {
            this.__emit();
        }
    }

    private __emit(): void {
        for (let index = 0; index < this.__needEmit.length; index++) {
            const event = this.__needEmit[index];
            //有人关心且事件没有被停止
            if (this.hasEvent(event.type!) && event.propagationStopped == false) {
                let list: EventListener[] = this.__listeners.get(event.type!)!;
                let listener: EventListener;
                for (let index = 0; index < list.length; index++) {
                    listener = list[index];
                    //事件是否被停止
                    if (event.propagationStopped) {
                        break;
                    }
                    listener.handler!.apply(listener.caller, [event]);
                }
            }
            //事件退还
            event.release();
        }
        this.__needEmit.splice(0, this.__needEmit.length);
    }

    hasEvent(type: EventType): boolean {
        return this.__listeners.has(type);
    }

    hasEventHandler(type: EventType, handler: (e: Event) => void, caller: any): boolean {
        if (this.__listeners.has(type) == false) {
            return false;
        }
        let infoList: EventListener[] = this.__listeners.get(type)!;
        let info: EventListener;
        for (let index = 0; index < infoList.length; index++) {
            info = infoList[index];
            if (info.equals(type, handler, caller)) {
                return true;
            }
        }
        return false;
    }

    destroy(): boolean {
        this.__listeners.clear();
        this.__callers.clear();
        return true;
    }
}