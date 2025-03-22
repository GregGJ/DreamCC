import { GUIMediator, SubGUIMediator } from "dream-cc-gui";
import { UI_Map } from "../MapBinder";
import { Rect, Vec2, view } from "cc";
import { FGUIEvent, GComponent } from "fairygui-cc";



/**
 * 拖拽逻辑
 */
export class DragMeditor extends SubGUIMediator {

    constructor(ui: GComponent | null, owner: GUIMediator | null) {
        super(ui, owner);
        this.init();
    }

    init(): void {
        //拖拽
        this.bindEvent(this.view.m_mapView, FGUIEvent.TOUCH_BEGIN, this.__mapViewTouchEvent, this);
    }

    show(data: any): void {
        super.show(data);
        this.__calculateDragRect();
    }

    showedUpdate(data?: any): void {
        super.showedUpdate(data);

    }

    hide(): void {
        super.hide();

    }

    //计算拖拽范围
    private __calculateDragRect(): void {
        let viewport = view.getVisibleSize();
        if (viewport.width < this.view.m_mapView.width) {
            this.__dragRect.x = 0 - (this.view.m_mapView.width - viewport.width);
            this.__dragRect.xMax = 0;
            this.__xCenter = -1;
        } else {
            //居中
            this.__xCenter = (viewport.width - this.view.m_mapView.width) * 0.5;
        }
        if (viewport.height < this.view.m_mapView.width) {
            this.__dragRect.y = 0 - (this.view.m_mapView.height - viewport.height);
            this.__dragRect.yMax = 0;
            this.__yCenter = -1;
        } else {
            //居中
            this.__yCenter = (viewport.height - this.view.m_mapView.height) * 0.5;
        }
    }

    //拖拽逻辑
    private __dragRect: Rect = new Rect();
    private __startPos: Vec2 = new Vec2();
    private __start: Vec2 = new Vec2();
    private __xCenter: number = -1;
    private __yCenter: number = -1;
    private __mapViewTouchEvent(e: FGUIEvent): void {
        let end = e.pos;
        switch (e.type) {
            case FGUIEvent.TOUCH_BEGIN:
                this.__start.x = e.pos.x;
                this.__start.y = e.pos.y;
                this.__startPos.x = this.view.m_mapView.x;
                this.__startPos.y = this.view.m_mapView.y;
                e.captureTouch();
                this.view.m_mapView.on(FGUIEvent.TOUCH_MOVE, this.__mapViewTouchEvent, this);
                this.view.m_mapView.on(FGUIEvent.TOUCH_END, this.__mapViewTouchEvent, this);
                break;
            case FGUIEvent.TOUCH_MOVE:
                let x: number = this.__startPos.x + end.x - this.__start!.x;
                let y: number = this.__startPos.y + end.y - this.__start!.y;
                this.__moveTo(x, y);
                break;
            case FGUIEvent.TOUCH_END:
                this.view.m_mapView.off(FGUIEvent.TOUCH_MOVE, this.__mapViewTouchEvent, this);
                this.view.m_mapView.off(FGUIEvent.TOUCH_END, this.__mapViewTouchEvent, this);
                break;
            default:
                break;
        }
    }

    /**
     * 移动到指定位置
     * @param x 
     * @param y 
     */
    private __moveTo(x: number, y: number): void {
        if (this.__xCenter < 0) {
            x = x < this.__dragRect.x ? this.__dragRect.x : x;
            x = x > this.__dragRect.xMax ? this.__dragRect.xMax : x;
        } else {
            x = this.__xCenter;
        }
        if (this.__yCenter < 0) {
            y = y < this.__dragRect.y ? this.__dragRect.y : y;
            y = y > this.__dragRect.yMax ? this.__dragRect.yMax : y;
        } else {
            y = this.__yCenter;
        }
        this.view.m_mapView.x = x;
        this.view.m_mapView.y = y;
    }

    private get view(): UI_Map {
        return this.ui as UI_Map;
    }
}