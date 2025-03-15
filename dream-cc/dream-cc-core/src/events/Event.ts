import { IPoolable } from "../pools/IPoolable";
import { Pool } from "../pools/Pool";
import { ResURL } from "../res/ResURL";
import { EventType } from "./EventType";


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
    propagationStopped: boolean = false;

    constructor() {

    }

    /**
     * 初始化
     * @param type 
     * @param data 
     * @param err 
     * @param progress 
     * @param url 
     */
    init(type: EventType, data?: any, err?: Error, progress?: number, url?: ResURL): void {
        this.type = type;
        this.data = data;
        this.err = err;
        this.url = url;
        this.progress = progress;
    }

    reset(): void {
        this.type = undefined;
        this.data = null;
        this.err = undefined;
        this.url = undefined;
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
     * @param data 
     * @param err 
     * @param url 
     * @param progress 
     * @returns 
     */
    static create(type: EventType, data?: any, err?: Error, progress?: number, url?: ResURL): Event {
        let result = Pool.acquire(Event);
        result.init(type, data, err, progress, url);
        return result;
    }
}