import { Event } from "../events/Event";
import { ITask } from "./ITask";
import { Task } from "./Task";


/**
 * 任务序列（并行）
 */
export class TaskSequence extends Task {

    private __taskList: Array<ITask> = new Array<ITask>();
    private __index: number = 0;
    constructor() {
        super();
    }

    addTask(value: ITask): void {
        if (this.__taskList.indexOf(value) >= 0) {
            throw new Error("重复添加！");
        }
        this.__taskList.push(value);
    }

    removeTask(value: ITask): void {
        let index: number = this.__taskList.indexOf(value);
        if (index < 0) {
            throw new Error("找不到要删除的内容!");
        }
        this.__taskList.splice(index, 1);
    }

    start(data?: any): void {
        for (let index = 0; index < this.__taskList.length; index++) {
            const element = this.__taskList[index];
            element.on(Event.COMPLETE, this.__subTaskEventHandler, this);
            element.on(Event.ERROR, this.__subTaskEventHandler, this);
            element.on(Event.PROGRESS, this.__subTaskEventHandler, this);
            element.start(data);
        }
    }

    private __subTaskEventHandler(e: Event): void {
        if (e.type == Event.PROGRESS) {
            this.emit(Event.PROGRESS, undefined, undefined, this.__index / this.__taskList.length);
            return;
        }
        e.target.offAllEvent();
        if (e.type == Event.ERROR) {
            this.emit(Event.ERROR, undefined, e.error);
            return;
        }
        this.__index++;
        if (this.__index < this.__taskList.length) {
            return;
        }
        e.target.destroy();
        //完成
        this.emit(Event.COMPLETE);
    }

    destroy(): boolean {
        this.__taskList.length = 0;
        this.__index = 0;
        return super.destroy();
    }
}