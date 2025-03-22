import { ITooltipView } from "./ITooltipView";
/**
 * tooltip管理器
 */
export interface ITooltipManager {
    /**
     * 提示层
     */
    tooltipLayer: string;
    /**
     * 注册
     * @param type
     * @param value
     */
    register(type: string, value: ITooltipView): void;
    /**
     * 注销
     * @param type
     */
    unregister(type: string): void;
    /**
     * 显示
     * @param data
     */
    show(data?: any): void;
    /**
     * 隐藏
     */
    hide(): void;
}
