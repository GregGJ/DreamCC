import { Event as CCEvent, Vec2 } from 'cc';
import { GObject } from '../GObject';
export class FGUIEvent extends CCEvent {
    constructor(type, bubbles) {
        super(type, bubbles);
        this.pos = new Vec2();
        this.touchId = 0;
        this.clickCount = 0;
        this.button = 0;
        this.keyModifiers = 0;
        this.mouseWheelDelta = 0;
    }
    get sender() {
        return GObject.cast(this.currentTarget);
    }
    get isShiftDown() {
        return false;
    }
    get isCtrlDown() {
        return false;
    }
    captureTouch() {
        let obj = GObject.cast(this.currentTarget);
        if (obj)
            this._processor.addTouchMonitor(this.touchId, obj);
    }
}
FGUIEvent.TOUCH_BEGIN = "fui_touch_begin";
FGUIEvent.TOUCH_MOVE = "fui_touch_move";
FGUIEvent.TOUCH_END = "fui_touch_end";
FGUIEvent.CLICK = "fui_click";
FGUIEvent.ROLL_OVER = "fui_roll_over";
FGUIEvent.ROLL_OUT = "fui_roll_out";
FGUIEvent.MOUSE_WHEEL = "fui_mouse_wheel";
FGUIEvent.DISPLAY = "fui_display";
FGUIEvent.UNDISPLAY = "fui_undisplay";
FGUIEvent.GEAR_STOP = "fui_gear_stop";
FGUIEvent.LINK = "fui_text_link";
FGUIEvent.Submit = "editing-return";
FGUIEvent.TEXT_CHANGE = "text-changed";
FGUIEvent.STATUS_CHANGED = "fui_status_changed";
FGUIEvent.XY_CHANGED = "fui_xy_changed";
FGUIEvent.SIZE_CHANGED = "fui_size_changed";
FGUIEvent.SIZE_DELAY_CHANGE = "fui_size_delay_change";
FGUIEvent.DRAG_START = "fui_drag_start";
FGUIEvent.DRAG_MOVE = "fui_drag_move";
FGUIEvent.DRAG_END = "fui_drag_end";
FGUIEvent.DROP = "fui_drop";
FGUIEvent.SCROLL = "fui_scroll";
FGUIEvent.SCROLL_END = "fui_scroll_end";
FGUIEvent.PULL_DOWN_RELEASE = "fui_pull_down_release";
FGUIEvent.PULL_UP_RELEASE = "fui_pull_up_release";
FGUIEvent.CLICK_ITEM = "fui_click_item";
var eventPool = new Array();
export function borrowEvent(type, bubbles) {
    let evt;
    if (eventPool.length) {
        evt = eventPool.pop();
        evt.type = type;
        evt.bubbles = bubbles;
    }
    else {
        evt = new FGUIEvent(type, bubbles);
    }
    return evt;
}
export function returnEvent(evt) {
    evt.initiator = null;
    evt.unuse();
    eventPool.push(evt);
}
