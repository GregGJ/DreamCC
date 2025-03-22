


export interface ILogger {
    /**
     * 设置显示过滤器，默认显示所有日志类型。
     * @param type 
     * @param isOpen 
     */
    show(type: string, isOpen: boolean): void;
    /**
     * 设置保存过滤器，默认不保存日志。
     * @param type 
     * @param isSave 
     */
    save(type: string, isSave: boolean): void;
    /**
     * 通过类型获取已保存的日志列表。
     * @param type 
     */
    getLogs(type?: string): Array<string> | undefined;
    /**
     * 打印日志信息。
     * @param msg 
     * @param type 
     */
    log(msg: any, type?: string): void;
    /**
     * 打印错误信息。
     * @param msg 
     * @param type 
     */
    error(msg: any, type?: string): void;
    /**
     * 打印警告信息。
     * @param msg 
     * @param type 
     */
    warn(msg: any, type?: string): void;
    /**
     * 打印信息。
     * @param msg 
     * @param type 
     */
    info(msg: any, type?: string): void;
}