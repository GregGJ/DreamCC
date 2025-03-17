import { Dictionary } from "../containers/Dictionary";
import { ILogger } from "./ILogger";
import { Logger } from "./Logger";


export class LoggerImpl implements ILogger {

    private __logs: Dictionary<string, Array<string>>
    /**
     * 标记是否显示某类型的日志，默认为false不显示
     */
    private __showed: Map<string, boolean>
    /**
     * 标记是否保存某类型的日志，默认为false不保存
     */
    private __saves: Map<string, boolean>

    constructor() {
        this.__logs = new Dictionary<string, Array<string>>();
        this.__showed = new Map<string, boolean>();
        this.__saves = new Map<string, boolean>();
        this.__showed.set(Logger.TYPE.ALL, true);
        this.__saves.set(Logger.TYPE.ALL, false);
    }

    /**
     * 设置显示过滤
     * @param key 
     * @param isOpen 
     */
    show(key: string, isOpen: boolean) {
        this.__showed.set(key, isOpen);
    }

    /**
     * 设置保存过滤
     * @param key 
     * @param isSave 
     */
    save(key: string, isSave: boolean) {
        this.__saves.set(key, isSave);
    }

    /**
     * 获取已保存的日志
     * @param type 
     * @returns 
     */
    getLogs(type?: string): Array<string> | undefined {
        if (type == undefined || type == null) {
            type = Logger.TYPE.ALL;
        }
        if (this.__logs.has(type)) {
            return this.__logs.get(type)!;
        }
        return undefined;
    }

    private __save(type: string, logType: string, msg: string): string {
        let data: string = "[" + type.toUpperCase() + "]" + logType + ": " + msg;
        let list: Array<string>;
        //是否需要保存该类型的日志
        if (this.__saves.has(type)) {
            if (!this.__logs.has(type)) {
                list = [];
                this.__logs.set(type, list);
            } else {
                list = this.__logs.get(type)!;
            }
            //检测是否超出最大保存条数
            if (list.length >= Logger.MaxCount) {
                list.unshift();
            }
            list.push(data);
        }
        //保存到all
        if (!this.__logs.has(Logger.TYPE.ALL)) {
            list = [];
            this.__logs.set(Logger.TYPE.ALL, list);
        } else {
            list = this.__logs.get(Logger.TYPE.ALL)!;
        }
        if (list.length >= Logger.MaxCount) {
            list.unshift();//删除最顶上的那条
        }
        list.push(data);
        return data;
    }

    private isShow(type: string): boolean {
        let isAll = this.__showed.has(Logger.TYPE.ALL) ? this.__showed.get(Logger.TYPE.ALL)! : false;
        let isOpen = this.__showed.has(type) ? this.__showed.get(type)! : false;
        return isAll || isOpen;
    }

    log(msg: any, type?: string): void {
        type = type || Logger.TYPE.ALL;
        let data = this.__save(type, "Log", msg);
        if (this.isShow(type)) {
            console.log(data);
        }
    }

    error(msg: any, type?: string): void {
        type = type || Logger.TYPE.ALL;
        let data = this.__save(type, "Error", msg);
        if (this.isShow(type)) {
            console.error(data);
        }
    }

    warn(msg: any, type?: string): void {
        type = type || Logger.TYPE.ALL;
        let data = this.__save(type, "Warn", msg);
        if (this.isShow(type)) {
            console.warn(data);
        }
    }

    info(msg: any, type?: string): void {
        type = type || Logger.TYPE.ALL;
        let data = this.__save(type, "Info", msg);
        if (this.isShow(type)) {
            console.info(data);
        }
    }
}