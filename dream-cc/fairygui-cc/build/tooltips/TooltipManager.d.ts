import { ITooltipManager } from "./ITooltipManager";
import { ITooltipView } from "./ITooltipView";
export declare class TooltipManager {
    static KEY: string;
    /**提示层 */
    static tooltipLayer: string;
    constructor();
    /**
     * 注册
     * @param type
     * @param value
     */
    static register(type: string, value: ITooltipView): void;
    /**
     * 注销
     * @param type
     */
    static unregister(type: string): void;
    /**
     * 显示
     * @param data
     */
    static show(data?: any): void;
    /**
     * 隐藏
     */
    static hide(): void;
    private static __impl;
    static get impl(): ITooltipManager;
}
