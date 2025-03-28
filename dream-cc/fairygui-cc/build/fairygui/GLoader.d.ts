import { Color, SpriteFrame, Vec2 } from "cc";
import { MovieClip } from "./display/MovieClip";
import { AlignType, VertAlignType, LoaderFillType, FillMethod, FillOrigin } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
import { ByteBuffer } from "./utils/ByteBuffer";
import { ResURL } from "dream-cc-core";
export declare class GLoader extends GObject {
    _content: MovieClip;
    private _url;
    private _align;
    private _verticalAlign;
    private _autoSize;
    private _fill;
    private _shrinkOnly;
    private _showErrorSign;
    private _playing;
    private _frame;
    private _color;
    private _contentItem;
    private _container;
    private _errorSign?;
    private _content2?;
    private _updatingLayout;
    private _assetBundle;
    private _containerUITrans;
    private static _errorSignPool;
    constructor();
    dispose(): void;
    get url(): ResURL | null;
    set url(value: ResURL | null);
    /**
     * 设置图片
     * @param url
     * @param bundleStr 远程包名称
     */
    setUrlWithBundle(url: ResURL, bundleStr?: string): void;
    set bundle(val: string);
    get bundle(): string;
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get align(): AlignType;
    set align(value: AlignType);
    get verticalAlign(): VertAlignType;
    set verticalAlign(value: VertAlignType);
    get fill(): LoaderFillType;
    set fill(value: LoaderFillType);
    get shrinkOnly(): boolean;
    set shrinkOnly(value: boolean);
    get autoSize(): boolean;
    set autoSize(value: boolean);
    get playing(): boolean;
    set playing(value: boolean);
    get frame(): number;
    set frame(value: number);
    get color(): Color;
    set color(value: Color);
    get fillMethod(): FillMethod;
    set fillMethod(value: FillMethod);
    get fillOrigin(): FillOrigin;
    set fillOrigin(value: FillOrigin);
    get fillClockwise(): boolean;
    set fillClockwise(value: boolean);
    get fillAmount(): number;
    set fillAmount(value: number);
    get showErrorSign(): boolean;
    set showErrorSign(value: boolean);
    get component(): GComponent;
    get texture(): SpriteFrame;
    set texture(value: SpriteFrame);
    protected loadContent(): void;
    protected loadFromPackage(itemURL: string): void;
    protected loadExternal(): void;
    protected freeExternal(texture: SpriteFrame): void;
    protected onExternalLoadSuccess(texture: SpriteFrame): void;
    protected onExternalLoadFailed(): void;
    private setErrorState;
    private clearErrorState;
    private updateLayout;
    private clearContent;
    protected handleSizeChanged(): void;
    protected handleAnchorChanged(): void;
    protected handleGrayedChanged(): void;
    protected _hitTest(pt: Vec2, globalPt: Vec2): GObject;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}
