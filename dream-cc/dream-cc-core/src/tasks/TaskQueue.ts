import { Event } from "../events/Event";
import { ITask } from "./ITask";
import { Task } from "./Task";


/**
 * 任务队列
 */
export class TaskQueue extends Task {

    private __taskList: Array<ITask>;
    private __index: number = 0;
    private __data: any;
    constructor() {
        super();
        this.__taskList = [];
    }

    addTask(value: ITask | Array<ITask>): void {
        if (Array.isArray(value)) {
            for (let index = 0; index < value.length; index++) {
                const element = value[index];
                this.__addTask(element);
            }
        } else {
            this.__addTask(value);
        }
    }

    private __addTask(value: ITask): void {
        if (this.__taskList.indexOf(value) >= 0) {
            throw new Error("重复添加！");
        }
        this.__taskList.push(value);
    }

    removeTask(value: ITask): void {
        let index: number = this.__taskList.indexOf(value);
        if (index < 0) {
            throw new Error("未找到要删除的内容！");
        }
        this.__taskList.splice(index, 1);
    }

    start(data?: any): void {
        this.__data = data;
        this.__index = 0;
        this.__tryNext();
    }

    private __tryNext(): void {
        if (this.__index < this.__taskList.length) {
            let task: ITask = this.__taskList[this.__index];
            task.on(Event.COMPLETE, this.__subTaskEventHandler, this);
            task.on(Event.PROGRESS, this.__subTaskEventHandler, this);
            task.on(Event.ERROR, this.__subTaskEventHandler, this);
            task.start(this.__data);
        } else {
            //结束
            this.emit(Event.COMPLETE);
        }
    }

    private __subTaskEventHandler(e: Event): void {
        if (e.type == Event.PROGRESS) {
            let progress: number = (this.__index + e.progress) / this.__taskList.length;
            this.emit(Event.PROGRESS, undefined, undefined, progress);
            return;
        }
        e.target.offAllEvent();
        if (e.type == Event.ERROR) {
            this.emit(Event.ERROR, undefined, e.error);
            return;
        }
        e.target.destroy();
        this.__index++;
        this.__tryNext();
    }

    destroy(): boolean {
        this.__taskList.length = 0;
        this.__index = 0;
        return super.destroy();
    }
}