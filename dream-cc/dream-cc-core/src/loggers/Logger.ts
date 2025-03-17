import { Injector } from "../utils/Injector";
import { ILogger } from "./ILogger";
import { LoggerImpl } from "./LoggerImpl";


enum LogType {
    ALL = "all",
    NET = "net",
    RES = "res",
    Module = "module",
}


/**
 * 日志系统
 */
export class Logger {

    /**
     * 日志类型
     */
    static TYPE: typeof LogType = LogType;

    static KEY: string = "Logger";
    /**
     * 最大保存条数
     */
    static MaxCount: number = 1000;

    /**
     * 设置显示过滤
     * @param key 
     * @param isOpen 
     */
    static show(type: string, isOpen: boolean) {
        this.impl.show(type, isOpen);
    }

    /**
     * 设置保存过滤
     * @param type 
     * @param isSave 
     */
    static save(type: string, isSave: boolean): void {
        this.impl.save(type, isSave);
    }

    /**
     * 获取已保存的日志
     * @param type 
     * @returns 
     */
    static getLogs(type?: string): Array<string> | undefined {
        return this.impl.getLogs(type);
    }

    static log(msg: any, type?: string): void {
        this.impl.log(msg, type);
    }

    static error(msg: any, type?: string) {
        this.impl.error(msg, type);
    }

    static warn(msg: any, type?: string) {
        this.impl.warn(msg, type);
    }

    static info(msg: any, type?: string) {
        this.impl.info(msg, type);
    }

    private static __impl: ILogger;
    private static get impl(): ILogger {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new LoggerImpl();
        }
        return this.__impl;
    }
}