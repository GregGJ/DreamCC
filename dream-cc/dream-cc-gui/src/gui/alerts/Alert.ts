import { Injector } from "dream-cc-core";
import { IAlert } from "./IAlert";




export class Alert {


    static KEY: string = "Alert";

    /**
     * 显示一个警告框
     * @param msg 
     * @param title 
     * @param buttons 
     * @param callback 
     * @param buttonSkins 
     */
    static show(msg: string, title?: string, buttons?: string[], callback?: (btnIdx: number) => void, buttonSkins?: string[]): void {
        this.impl.show(msg, title, buttons, callback, buttonSkins);
    }

    private static __impl: IAlert;
    static get impl(): IAlert {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error("未注入：" + this.KEY);
        }
        return this.__impl;
    }
}