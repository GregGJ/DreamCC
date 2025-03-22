import { TooltipPosMode } from "./TooltipPosMode";

/**
 * 提示数据
 */
export class ITooltipData{
    /**
     * 数据
     */
    data: any;
    /**
     * 提示类
     */
    tooltipType:string;
    /**
     * 显示位置模式
     */
    posMode: TooltipPosMode;
}