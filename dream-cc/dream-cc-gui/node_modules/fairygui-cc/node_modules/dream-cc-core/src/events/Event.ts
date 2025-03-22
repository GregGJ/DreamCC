import { IPoolable } from "../pools/IPoolable";
import { Pool } from "../pools/Pool";
import { EventType } from "./EventType";
import { IEventDispatcher } from "./IEventDispatcher";


/**
 * 事件对象
 */
export class Event implements IPoolable {

    static readonly START: string = "START";
    static readonly PROGRESS: string = "PROGRESS";
    static readonly COMPLETE: string = "COMPLETE";
    static readonly ERROR: string = "ERROR";

    static readonly SHOW: string = "SHOW";
    static readonly HIDE: string = "HIDE";
    static readonly ADD: string = "ADD";
    static readonly REMOVE: string = "REMOVE";
    static readonly UPDATE: string = "UPDATE";
    static readonly CLEAR: string = "CLEAR";
    static readonly STATE_CHANGED: string = "STATE_CHANGED";
    static readonly VALUE_CHANGED: string = "VALUE_CHANGED";
    static readonly ADD_CHILD: string = "ADD_CHILD";
    static readonly REMOVE_CHILD: string = "REMOVE_CHILD";
    static readonly CHILD_VALUE_CHANGED: string = "CHILD_VALUE_CHANGED";

    /**
     * 事件类型
     */
    type?: EventType;
    /**
     * 事件派发对象
     */
    target?: IEventDispatcher;
    /**
     * 事件数据
     */
    data?: any;
    /**
     * 错误信息
     */
    error?: Error;
    /**
     * 进入百分比(0-1)
     */
    progress: number = 0;
    /**
     * 事件是否停止
     */
    propagationStopped: boolean = false;

    constructor() {

    }

    /**
     * 初始化
     * @param type 
     * @param taraget
     * @param data 
     * @param err 
     * @param progress 
     */
    init(type: EventType, taraget: IEventDispatcher, data?: any, err?: Error, progress: number = 0): void {
        this.type = type;
        this.target = taraget;
        this.data = data;
        this.error = err;
        this.progress = progress;
    }

    reset(): void {
        this.type = undefined;
        this.target = undefined;
        this.data = null;
        this.error = undefined;
        this.progress = 0;
    }

    destroy(): boolean {
        this.reset();
        return true;
    }

    release(): void {
        Pool.release(Event, this);
    }

    /**
     * 创建事件对象
     * @param type
     * @param target
     * @param data 
     * @param err 
     * @param progress 
     * @returns 
     */
    static create(type: EventType, target: IEventDispatcher, data?: any, err?: Error, progress?: number): Event {
        let result = Pool.acquire(Event);
        result.init(type, target, data, err, progress);
        return result;
    }
}