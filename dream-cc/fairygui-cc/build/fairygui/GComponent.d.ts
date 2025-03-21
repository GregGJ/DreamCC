import { Mask, Vec2, Node, Constructor } from "cc";
import { Controller } from "./Controller";
import { IHitTest } from "./event/HitTest";
import { ChildrenRenderOrder, OverflowType } from "./FieldTypes";
import { GGroup } from "./GGroup";
import { GObject } from "./GObject";
import { Margin } from "./Margin";
import { ScrollPane } from "./ScrollPane";
import { Transition } from "./Transition";
import { ByteBuffer } from "./utils/ByteBuffer";
export declare class GComponent extends GObject {
    hitArea?: IHitTest;
    private _sortingChildCount;
    private _opaque;
    private _applyingController?;
    private _rectMask?;
    private _maskContent?;
    private _invertedMask?;
    private _containerUITrans;
    protected _margin: Margin;
    protected _trackBounds: boolean;
    protected _boundsChanged: boolean;
    protected _childrenRenderOrder: ChildrenRenderOrder;
    protected _apexIndex: number;
    _buildingDisplayList: boolean;
    _children: Array<GObject>;
    _controllers: Array<Controller>;
    _transitions: Array<Transition>;
    _container: Node;
    _scrollPane?: ScrollPane;
    _alignOffset: Vec2;
    _customMask?: Mask;
    constructor();
    dispose(): void;
    get displayListContainer(): Node;
    addChild(child: GObject): GObject;
    addChildAt(child: GObject, index: number): GObject;
    private getInsertPosForSortingChild;
    removeChild(child: GObject, dispose?: boolean): GObject;
    removeChildAt(index: number, dispose?: boolean): GObject;
    removeChildren(beginIndex?: number, endIndex?: number, dispose?: boolean): void;
    getChildAt<T extends GObject>(index: number, classType?: Constructor<T>): T;
    getChild<T extends GObject>(name: string, classType?: Constructor<T>): T;
    getChildByPath<T extends GObject>(path: String, classType?: Constructor<T>): T;
    getVisibleChild(name: string): GObject;
    getChildInGroup(name: string, group: GGroup): GObject;
    getChildById(id: string): GObject;
    getChildIndex(child: GObject): number;
    setChildIndex(child: GObject, index: number): void;
    setChildIndexBefore(child: GObject, index: number): number;
    private _setChildIndex;
    swapChildren(child1: GObject, child2: GObject): void;
    swapChildrenAt(index1: number, index2: number): void;
    get numChildren(): number;
    isAncestorOf(child: GObject): boolean;
    addController(controller: Controller): void;
    getControllerAt(index: number): Controller;
    getController(name: string): Controller;
    removeController(c: Controller): void;
    get controllers(): Array<Controller>;
    private onChildAdd;
    private buildNativeDisplayList;
    applyController(c: Controller): void;
    applyAllControllers(): void;
    adjustRadioGroupDepth(obj: GObject, c: Controller): void;
    getTransitionAt(index: number): Transition;
    getTransition(transName: string): Transition;
    isChildInView(child: GObject): boolean;
    getFirstChildInView(): number;
    get scrollPane(): ScrollPane;
    get opaque(): boolean;
    set opaque(value: boolean);
    get margin(): Margin;
    set margin(value: Margin);
    get childrenRenderOrder(): ChildrenRenderOrder;
    set childrenRenderOrder(value: ChildrenRenderOrder);
    get apexIndex(): number;
    set apexIndex(value: number);
    get mask(): GObject;
    set mask(value: GObject);
    setMask(value: GObject, inverted: boolean): void;
    private onMaskReady;
    private onMaskContentChanged;
    get _pivotCorrectX(): number;
    get _pivotCorrectY(): number;
    get baseUserData(): string;
    protected setupScroll(buffer: ByteBuffer): void;
    protected setupOverflow(overflow: OverflowType): void;
    protected handleAnchorChanged(): void;
    protected handleSizeChanged(): void;
    protected handleGrayedChanged(): void;
    handleControllerChanged(c: Controller): void;
    protected _hitTest(pt: Vec2, globalPt: Vec2): GObject;
    setBoundsChangedFlag(): void;
    private refresh;
    ensureBoundsCorrect(): void;
    protected updateBounds(): void;
    setBounds(ax: number, ay: number, aw: number, ah?: number): void;
    get viewWidth(): number;
    set viewWidth(value: number);
    get viewHeight(): number;
    set viewHeight(value: number);
    getSnappingPosition(xValue: number, yValue: number, resultPoint?: Vec2): Vec2;
    childSortingOrderChanged(child: GObject, oldValue: number, newValue?: number): void;
    constructFromResource(): void;
    constructFromResource2(objectPool: Array<GObject>, poolIndex: number): void;
    protected constructExtension(buffer: ByteBuffer): void;
    protected onConstruct(): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    protected onEnable(): void;
    protected onDisable(): void;
}
