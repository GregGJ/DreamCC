import { Injector } from "dream-cc-core";
import { ITooltipManager } from "./ITooltipManager";
import { ITooltipView } from "./ITooltipView";


export class TooltipManager {

    static KEY = "TooltipsManager";

    /**提示层 */
    public static tooltipLayer: string = "Tooltip";

    constructor() {

    }

    /**
     * 注册
     * @param type 
     * @param value 
     */
    static register(type: string, value: ITooltipView): void {
        if (this.impl) {
            this.impl.register(type, value);
        }
    }

    /**
     * 注销
     * @param type
     */
    static unregister(type: string): void {
        if (this.impl) {
            this.impl.unregister(type);
        }
    }

    /**
     * 显示
     * @param data 
     */
    static show(data?: any): void {
        if (this.impl) {
            this.impl.show(data);
        }
    }

    /**
     * 隐藏
     */
    static hide(): void {
        if (this.impl) {
            this.impl.hide();
        }
    }

    private static __impl: ITooltipManager;

    static get impl(): ITooltipManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(`${this.KEY} 未注入`);
        }
        return this.__impl;
    }
}