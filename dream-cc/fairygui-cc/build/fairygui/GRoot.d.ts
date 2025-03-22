import { Vec2, AudioClip, Node } from "cc";
import { InputProcessor } from "./event/InputProcessor";
import { PopupDirection } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { GGraph } from "./GGraph";
import { GObject } from "./GObject";
import { Window } from "./Window";
export declare class GRoot extends GComponent {
    private _modalLayer;
    private _popupStack;
    private _justClosedPopups;
    private _modalWaitPane;
    private _tooltipWin;
    private _defaultTooltipWin;
    private _volumeScale;
    private _inputProcessor;
    private _thisOnResized;
    private audioEngine;
    private static _inst;
    static get inst(): GRoot;
    static create(root?: Node): GRoot;
    constructor();
    protected onDestroy(): void;
    getTouchPosition(touchId?: number): Vec2;
    get touchTarget(): GObject;
    get inputProcessor(): InputProcessor;
    showWindow(win: Window): void;
    hideWindow(win: Window): void;
    hideWindowImmediately(win: Window): void;
    bringToFront(win: Window): void;
    showModalWait(msg?: string): void;
    closeModalWait(): void;
    closeAllExceptModals(): void;
    closeAllWindows(): void;
    getTopWindow(): Window;
    get modalLayer(): GGraph;
    get hasModalWindow(): boolean;
    get modalWaiting(): boolean;
    getPopupPosition(popup: GObject, target?: GObject, dir?: PopupDirection | boolean, result?: Vec2): Vec2;
    showPopup(popup: GObject, target?: GObject | null, dir?: PopupDirection | boolean): void;
    togglePopup(popup: GObject, target?: GObject, dir?: PopupDirection | boolean): void;
    hidePopup(popup?: GObject): void;
    get hasAnyPopup(): boolean;
    private closePopup;
    showTooltips(msg: string): void;
    showTooltipsWin(tooltipWin: GObject): void;
    hideTooltips(): void;
    get volumeScale(): number;
    set volumeScale(value: number);
    playOneShotSound(clip: AudioClip, volumeScale?: number): void;
    private adjustModalLayer;
    private onTouchBegin_1;
    onWinResize(): void;
    handlePositionChanged(): void;
}
