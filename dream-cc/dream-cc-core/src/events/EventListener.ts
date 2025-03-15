import { IPoolable } from "../pools/IPoolable";
import { Event } from "./Event";
import { EventType } from "./EventType";



/**
 * 监听者
 */
export class EventListener implements IPoolable {
    /**
     * 事件类型
     */
    type?: EventType;
    /**
     * 事件回调函数this指针
     */
    caller: any | null;
    /**
     * 事件的回调函数
     */
    handler?: (e: Event) => void;
    /**
     * 事件优先级，默认为255
     */
    priority: number = 255;

    constructor(type: EventType, caller: any, handler: (e: Event) => void, priority: number = 255) {
        this.type = type;
        this.caller = caller;
        this.handler = handler;
        this.priority = priority;
    }

    reset(): void {
        this.type = undefined;
        this.caller = undefined;
        this.handler = undefined;
        this.priority = 255;
    }
    
    destroy(): boolean {
        this.reset();
        return true;
    }

    equal(target: EventListener): boolean {
        if (this.type === target.type && this.caller === target.caller && this.handler === target.handler) {
            return true;
        }
        return false;
    }

    equals(type: EventType, handler: (e: Event) => void, caller: any): boolean {
        if (this.type === type && this.handler === handler && this.caller === caller) {
            return true;
        }
        return false;
    }
}