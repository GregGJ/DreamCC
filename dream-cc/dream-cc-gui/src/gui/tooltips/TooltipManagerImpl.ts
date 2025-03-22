import { Vec2 } from "cc";
import { ITooltipData } from "./ITooltipData";
import { TooltipPosMode } from "./TooltipPosMode";
import { LayerManager } from "../layer/LayerManager";
import { ILayer } from "../layer/ILayer";
import { GComponent, GRoot, ITooltipManager, ITooltipView } from "fairygui-cc";



/**
 * tooltip 管理类
 */
export class TooltipManagerImpl implements ITooltipManager {

    private __tooltipMap: Map<string, ITooltipView>;

    private __currentTooltip: ITooltipView | null;

    /**
     * 提示层
     */
    tooltipLayer: string = "Tooltip";

    constructor() {
        this.__tooltipMap = new Map<string, ITooltipView>();
    }


    register(type: string, value: ITooltipView): void {
        this.__tooltipMap.set(type, value);
    }

    unregister(type: string): void {
        this.__tooltipMap.delete(type);
    }

    show(data: ITooltipData): void {
        if (this.isShowing) {
            this.hide();
        }
        let tData: any;
        let posMode: TooltipPosMode;
        if (typeof data == "string") {
            tData = data;
            posMode = TooltipPosMode.Touch;
            this.__currentTooltip = this.__tooltipMap.get("default");
        } else if (data instanceof ITooltipData) {
            tData = data.data;
            posMode = data.posMode;
            //如果存在老的
            if (this.__tooltipMap.has(data.tooltipType)) {
                this.__currentTooltip = this.__tooltipMap.get(data.tooltipType);
            } else {
                throw new Error("未注册tooltip Type:" + data.tooltipType);
            }
        }
        this.__currentTooltip.update(tData);
        let layer: ILayer = LayerManager.getLayer(this.tooltipLayer);
        layer.addChild(this.__currentTooltip.viewComponent);
        this.__layout(posMode);
    }

    private __layout(posMode: TooltipPosMode): void {
        let view: GComponent = this.__currentTooltip.viewComponent;
        let pos: Vec2;
        //定位
        switch (posMode) {
            case TooltipPosMode.Touch:
                pos = GRoot.inst.getTouchPosition();
                break;
            case TooltipPosMode.Left:
            case TooltipPosMode.Right:
                pos = new Vec2();
                if (posMode == TooltipPosMode.Left) {
                    pos.x = GRoot.inst.width * 0.25 - view.width * 0.5;
                    pos.y = (GRoot.inst.height - view.height) * 0.5
                } else {
                    pos.x = GRoot.inst.width - GRoot.inst.width * 0.25 - view.width * 0.5;
                    pos.y = (GRoot.inst.height - view.height) * 0.5
                }
                break;
            default:
                throw new Error("Tooltip 未知定位类型！");
                break;
        }
        //超出屏幕检测
        if (pos.x < 0) {
            pos.x = 0;
        } else if (pos.x + view.width > GRoot.inst.width) {
            pos.x = GRoot.inst.width - view.width;
        }
        if (pos.y < 0) {
            pos.y = 0;
        } else if (pos.y + view.height > GRoot.inst.height) {
            pos.y = GRoot.inst.height - view.height;
        }
        view.x = pos.x;
        view.y = pos.y;
    }

    hide(): void {
        if (!this.isShowing) {
            return;
        }
        let layer: ILayer = LayerManager.getLayer(this.tooltipLayer);
        layer.removeChild(this.__currentTooltip.viewComponent);
        this.__currentTooltip = null;
    }

    get isShowing(): boolean {
        return this.__currentTooltip != null;
    }
}