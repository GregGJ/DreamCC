import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
import { ITask } from "./ITask";


/**
 * 任务
 */
export class Task extends EventDispatcher implements ITask {

    /**
     * 开始
     * @param data 
     */
    start(data?: any): void {

    }

    addEventHandler(handler: (e: Event) => void, caller: any): void {
        this.on(Event.PROGRESS, handler, caller);
        this.on(Event.COMPLETE, handler, caller);
        this.on(Event.ERROR, handler, caller);
    }

    removeEventHandler(handler: (e: Event) => void, caller: any): void {
        this.off(Event.PROGRESS, handler, caller);
        this.off(Event.COMPLETE, handler, caller);
        this.off(Event.ERROR, handler, caller);
    }

    /**
     * 销毁
     */
    destroy(): boolean {
        this.offAllEvent();
        return super.destroy();
    }
}