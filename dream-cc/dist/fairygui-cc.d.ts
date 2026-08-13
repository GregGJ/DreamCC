import { Color, Vec2, Component, Node, Mask, Constructor, EventTarget, Event as Event$1, Size, Sprite, Rect, SpriteFrame, AssetManager, Asset, dragonBones, UITransform, UIOpacity, Graphics, AudioClip, Label, Font, HorizontalTextAlignment, VerticalTextAlignment, RichText, EditBox, sp } from 'cc';
import { ResURL } from 'dream-cc-core';

declare class ByteBuffer {
    stringTable: Array<string>;
    version: number;
    littleEndian: boolean;
    protected _view: DataView;
    protected _bytes: Uint8Array;
    protected _pos: number;
    protected _length: number;
    constructor(buffer: ArrayBuffer, offset?: number, length?: number);
    get data(): Uint8Array;
    get position(): number;
    set position(value: number);
    skip(count: number): void;
    private validate;
    readByte(): number;
    readBool(): boolean;
    readShort(): number;
    readUshort(): number;
    readInt(): number;
    readUint(): number;
    readFloat(): number;
    private static TxtDecoder;
    readString(len?: number): string;
    readS(): string;
    readSArray(cnt: number): Array<string>;
    writeS(value: string): void;
    readColor(hasAlpha?: boolean): Color;
    readChar(): string;
    readBuffer(): ByteBuffer;
    seek(indexTablePos: number, blockIndex: number): boolean;
}

interface IHitTest {
    hitTest(pt: Vec2, globalPt: Vec2): boolean;
}
declare class PixelHitTestData {
    pixelWidth: number;
    scale: number;
    pixels: Uint8Array;
    constructor(ba: ByteBuffer);
}

declare enum ButtonMode {
    Common = 0,
    Check = 1,
    Radio = 2
}
declare enum AutoSizeType {
    None = 0,
    Both = 1,
    Height = 2,
    Shrink = 3
}
declare enum AlignType {
    Left = 0,
    Center = 1,
    Right = 2
}
declare enum VertAlignType {
    Top = 0,
    Middle = 1,
    Bottom = 2
}
declare enum LoaderFillType {
    None = 0,
    Scale = 1,
    ScaleMatchHeight = 2,
    ScaleMatchWidth = 3,
    ScaleFree = 4,
    ScaleNoBorder = 5
}
declare enum ListLayoutType {
    SingleColumn = 0,
    SingleRow = 1,
    FlowHorizontal = 2,
    FlowVertical = 3,
    Pagination = 4
}
declare enum ListSelectionMode {
    Single = 0,
    Multiple = 1,
    Multiple_SingleClick = 2,
    None = 3
}
declare enum OverflowType {
    Visible = 0,
    Hidden = 1,
    Scroll = 2
}
declare enum PackageItemType {
    Image = 0,
    MovieClip = 1,
    Sound = 2,
    Component = 3,
    Atlas = 4,
    Font = 5,
    Swf = 6,
    Misc = 7,
    Unknown = 8,
    Spine = 9,
    DragonBones = 10
}
declare enum ObjectType {
    Image = 0,
    MovieClip = 1,
    Swf = 2,
    Graph = 3,
    Loader = 4,
    Group = 5,
    Text = 6,
    RichText = 7,
    InputText = 8,
    Component = 9,
    List = 10,
    Label = 11,
    Button = 12,
    ComboBox = 13,
    ProgressBar = 14,
    Slider = 15,
    ScrollBar = 16,
    Tree = 17,
    Loader3D = 18
}
declare enum ProgressTitleType {
    Percent = 0,
    ValueAndMax = 1,
    Value = 2,
    Max = 3
}
declare enum ScrollBarDisplayType {
    Default = 0,
    Visible = 1,
    Auto = 2,
    Hidden = 3
}
declare enum ScrollType {
    Horizontal = 0,
    Vertical = 1,
    Both = 2
}
declare enum FlipType {
    None = 0,
    Horizontal = 1,
    Vertical = 2,
    Both = 3
}
declare enum ChildrenRenderOrder {
    Ascent = 0,
    Descent = 1,
    Arch = 2
}
declare enum GroupLayoutType {
    None = 0,
    Horizontal = 1,
    Vertical = 2
}
declare enum PopupDirection {
    Auto = 0,
    Up = 1,
    Down = 2
}
declare enum RelationType {
    Left_Left = 0,
    Left_Center = 1,
    Left_Right = 2,
    Center_Center = 3,
    Right_Left = 4,
    Right_Center = 5,
    Right_Right = 6,
    Top_Top = 7,
    Top_Middle = 8,
    Top_Bottom = 9,
    Middle_Middle = 10,
    Bottom_Top = 11,
    Bottom_Middle = 12,
    Bottom_Bottom = 13,
    Width = 14,
    Height = 15,
    LeftExt_Left = 16,
    LeftExt_Right = 17,
    RightExt_Left = 18,
    RightExt_Right = 19,
    TopExt_Top = 20,
    TopExt_Bottom = 21,
    BottomExt_Top = 22,
    BottomExt_Bottom = 23,
    Size = 24
}
declare enum FillMethod {
    None = 0,
    Horizontal = 1,
    Vertical = 2,
    Radial90 = 3,
    Radial180 = 4,
    Radial360 = 5
}
declare enum FillOrigin {
    Top = 0,
    Bottom = 1,
    Left = 2,
    Right = 3
}
declare enum ObjectPropID {
    Text = 0,
    Icon = 1,
    Color = 2,
    OutlineColor = 3,
    Playing = 4,
    Frame = 5,
    DeltaTime = 6,
    TimeScale = 7,
    FontSize = 8,
    Selected = 9
}

declare class Margin {
    left: number;
    right: number;
    top: number;
    bottom: number;
    constructor();
    copy(source: Margin): void;
    isNone(): boolean;
}

declare class GScrollBar extends GComponent {
    private _grip;
    private _arrowButton1;
    private _arrowButton2;
    private _bar;
    private _target;
    private _vertical;
    private _scrollPerc;
    private _fixedGripSize;
    private _dragOffset;
    private _gripDragging;
    constructor();
    setScrollPane(target: ScrollPane, vertical: boolean): void;
    setDisplayPerc(value: number): void;
    setScrollPerc(val: number): void;
    get minSize(): number;
    get gripDragging(): boolean;
    protected constructExtension(buffer: ByteBuffer): void;
    private onGripTouchDown;
    private onGripTouchMove;
    private onGripTouchEnd;
    private onClickArrow1;
    private onClickArrow2;
    private onBarTouchBegin;
}

declare class ScrollPane extends Component {
    private _owner;
    private _container;
    private _maskContainer;
    private _maskContainerUITrans;
    private _scrollType;
    private _scrollStep;
    private _mouseWheelStep;
    private _decelerationRate;
    private _scrollBarMargin;
    private _bouncebackEffect;
    private _touchEffect;
    private _scrollBarDisplayAuto?;
    private _vScrollNone;
    private _hScrollNone;
    private _needRefresh;
    private _refreshBarAxis;
    private _displayOnLeft?;
    private _snapToItem?;
    private _snappingPolicy?;
    _displayInDemand?: boolean;
    private _mouseWheelEnabled;
    private _pageMode?;
    private _inertiaDisabled?;
    private _floating?;
    private _dontClipMargin?;
    private _xPos;
    private _yPos;
    private _viewSize;
    private _contentSize;
    private _overlapSize;
    private _pageSize;
    private _containerPos;
    private _beginTouchPos;
    private _lastTouchPos;
    private _lastTouchGlobalPos;
    private _velocity;
    private _velocityScale;
    private _lastMoveTime;
    private _isHoldAreaDone;
    private _aniFlag;
    _loop: number;
    private _headerLockedSize;
    private _footerLockedSize;
    private _refreshEventDispatching;
    private _dragged;
    private _hover;
    private _tweening;
    private _tweenTime;
    private _tweenDuration;
    private _tweenStart;
    private _tweenChange;
    private _pageController?;
    private _hzScrollBar?;
    private _vtScrollBar?;
    private _header?;
    private _footer?;
    static draggingPane: ScrollPane;
    setup(buffer: ByteBuffer): void;
    protected onDestroy(): void;
    hitTest(pt: Vec2, globalPt: Vec2): GObject;
    get owner(): GComponent;
    get hzScrollBar(): GScrollBar;
    get vtScrollBar(): GScrollBar;
    get header(): GComponent;
    get footer(): GComponent;
    get bouncebackEffect(): boolean;
    set bouncebackEffect(sc: boolean);
    get touchEffect(): boolean;
    set touchEffect(sc: boolean);
    set scrollStep(val: number);
    get decelerationRate(): number;
    set decelerationRate(val: number);
    get scrollStep(): number;
    get snapToItem(): boolean;
    set snapToItem(value: boolean);
    get snappingPolicy(): number;
    set snappingPolicy(value: number);
    get mouseWheelEnabled(): boolean;
    set mouseWheelEnabled(value: boolean);
    get isDragged(): boolean;
    get percX(): number;
    set percX(value: number);
    setPercX(value: number, ani?: boolean): void;
    get percY(): number;
    set percY(value: number);
    setPercY(value: number, ani?: boolean): void;
    get posX(): number;
    set posX(value: number);
    setPosX(value: number, ani?: boolean): void;
    get posY(): number;
    set posY(value: number);
    setPosY(value: number, ani?: boolean): void;
    get contentWidth(): number;
    get contentHeight(): number;
    get viewWidth(): number;
    set viewWidth(value: number);
    get viewHeight(): number;
    set viewHeight(value: number);
    get currentPageX(): number;
    set currentPageX(value: number);
    get currentPageY(): number;
    set currentPageY(value: number);
    setCurrentPageX(value: number, ani?: boolean): void;
    setCurrentPageY(value: number, ani?: boolean): void;
    get isBottomMost(): boolean;
    get isRightMost(): boolean;
    get pageController(): Controller;
    set pageController(value: Controller);
    get scrollingPosX(): number;
    get scrollingPosY(): number;
    scrollTop(ani?: boolean): void;
    scrollBottom(ani?: boolean): void;
    scrollUp(ratio?: number, ani?: boolean): void;
    scrollDown(ratio?: number, ani?: boolean): void;
    scrollLeft(ratio?: number, ani?: boolean): void;
    scrollRight(ratio?: number, ani?: boolean): void;
    scrollToView(target: any, ani?: boolean, setFirst?: boolean): void;
    isChildInView(obj: GObject): boolean;
    cancelDragging(): void;
    lockHeader(size: number): void;
    lockFooter(size: number): void;
    onOwnerSizeChanged(): void;
    handleControllerChanged(c: Controller): void;
    private updatePageController;
    adjustMaskContainer(): void;
    setSize(aWidth: number, aHeight: number): void;
    setContentSize(aWidth: number, aHeight: number): void;
    changeContentSizeOnScrolling(deltaWidth: number, deltaHeight: number, deltaPosX: number, deltaPosY: number): void;
    private handleSizeChanged;
    private posChanged;
    private refresh;
    private refresh2;
    private onTouchBegin;
    private onTouchMove;
    private onTouchEnd;
    private onRollOver;
    private onRollOut;
    private onMouseWheel;
    private updateScrollBarPos;
    updateScrollBarVisible(): void;
    private updateScrollBarVisible2;
    private __barTweenComplete;
    private getLoopPartSize;
    private loopCheckingCurrent;
    private loopCheckingTarget;
    private loopCheckingTarget2;
    private loopCheckingNewPos;
    private alignPosition;
    private alignByPage;
    private updateTargetAndDuration;
    private updateTargetAndDuration2;
    private fixDuration;
    private startTween;
    private killTween;
    private checkRefreshBar;
    protected update(dt: number): boolean;
    private runTween;
}

declare class Transition {
    name: string;
    private _owner;
    private _ownerBaseX;
    private _ownerBaseY;
    private _items;
    private _totalTimes;
    private _totalTasks;
    private _playing;
    private _paused?;
    private _onComplete?;
    private _options;
    private _reversed?;
    private _totalDuration;
    private _autoPlay?;
    private _autoPlayTimes;
    private _autoPlayDelay;
    private _timeScale;
    private _startTime;
    private _endTime;
    constructor(owner: GComponent);
    play(onComplete?: (() => void) | null, times?: number, delay?: number, startTime?: number, endTime?: number): void;
    playReverse(onComplete?: (() => void) | null, times?: number, delay?: number): void;
    changePlayTimes(value: number): void;
    setAutoPlay(value: boolean, times?: number, delay?: number): void;
    private _play;
    stop(setToComplete?: boolean, processCallback?: boolean): void;
    private stopItem;
    setPaused(paused: boolean): void;
    dispose(): void;
    get playing(): boolean;
    setValue(label: string, ...args: any[]): void;
    setHook(label: string, callback: (label?: string) => void): void;
    clearHooks(): void;
    setTarget(label: string, newTarget: GObject): void;
    setDuration(label: string, value: number): void;
    getLabelTime(label: string): number;
    get timeScale(): number;
    set timeScale(value: number);
    updateFromRelations(targetId: string, dx: number, dy: number): void;
    onEnable(): void;
    onDisable(): void;
    private onDelayedPlay;
    private internalPlay;
    private playItem;
    private skipAnimations;
    private onDelayedPlayItem;
    private onTweenStart;
    private onTweenUpdate;
    private onTweenComplete;
    private onPlayTransCompleted;
    private callHook;
    private checkAllComplete;
    private applyValue;
    setup(buffer: ByteBuffer): void;
    private decodeValue;
}

declare class GComponent extends GObject {
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

declare class Controller extends EventTarget {
    private _selectedIndex;
    private _previousIndex;
    private _pageIds;
    private _pageNames;
    private _actions?;
    name: string;
    parent: GComponent;
    autoRadioGroupDepth?: boolean;
    changing?: boolean;
    constructor();
    dispose(): void;
    get selectedIndex(): number;
    set selectedIndex(value: number);
    onChanged<TFunction extends (...any: any[]) => void>(callback: TFunction, thisArg?: any): void;
    offChanged<TFunction extends (...any: any[]) => void>(callback: TFunction, thisArg?: any): void;
    setSelectedIndex(value: number): void;
    get previsousIndex(): number;
    get selectedPage(): string;
    set selectedPage(val: string);
    setSelectedPage(value: string): void;
    get previousPage(): string;
    get pageCount(): number;
    getPageName(index: number): string;
    addPage(name?: string): void;
    addPageAt(name?: string, index?: number): void;
    removePage(name: string): void;
    removePageAt(index: number): void;
    clearPages(): void;
    hasPage(aName: string): boolean;
    getPageIndexById(aId: string): number;
    getPageIdByName(aName: string): string | null;
    getPageNameById(aId: string): string | null;
    getPageId(index: number): string | null;
    get selectedPageId(): string | null;
    set selectedPageId(val: string | null);
    set oppositePageId(val: string | null);
    get previousPageId(): string | null;
    runActions(): void;
    setup(buffer: ByteBuffer): void;
}

declare enum BlendMode {
    Normal = 0,
    None = 1,
    Add = 2,
    Multiply = 3,
    Screen = 4,
    Erase = 5,
    Mask = 6,
    Below = 7,
    Off = 8,
    Custom1 = 9,
    Custom2 = 10,
    Custom3 = 11
}

declare class GPathPoint {
    x: number;
    y: number;
    control1_x: number;
    control1_y: number;
    control2_x: number;
    control2_y: number;
    curveType: number;
    constructor();
    static newPoint(x: number, y: number, curveType: number): GPathPoint;
    static newBezierPoint(x: number, y: number, control1_x: number, control1_y: number): GPathPoint;
    static newCubicBezierPoint(x: number, y: number, control1_x: number, control1_y: number, control2_x: number, control2_y: number): GPathPoint;
    clone(): GPathPoint;
}

declare class GPath {
    private _segments;
    private _points;
    private _fullLength;
    constructor();
    get length(): number;
    create2(pt1: GPathPoint, pt2: GPathPoint, pt3?: GPathPoint, pt4?: GPathPoint): void;
    create(points: Array<GPathPoint>): void;
    private createSplineSegment;
    clear(): void;
    getPointAt(t: number, result?: Vec2): Vec2;
    get segmentCount(): number;
    getAnchorsInSegment(segmentIndex: number, points?: Array<Vec2>): Array<Vec2>;
    getPointsInSegment(segmentIndex: number, t0: number, t1: number, points?: Array<Vec2>, ts?: Array<number>, pointDensity?: number): Array<Vec2>;
    getAllPoints(points?: Array<Vec2>, ts?: Array<number>, pointDensity?: number): Array<Vec2>;
    private onCRSplineCurve;
    private onBezierCurve;
}

declare class TweenValue {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor();
    get color(): number;
    set color(value: number);
    getField(index: number): number;
    setField(index: number, value: number): void;
    setZero(): void;
}

declare class GTweener {
    _target: any;
    _propType: any;
    _killed: boolean;
    _paused: boolean;
    private _delay;
    private _duration;
    private _breakpoint;
    private _easeType;
    private _easeOvershootOrAmplitude;
    private _easePeriod;
    private _repeat;
    private _yoyo;
    private _timeScale;
    private _snapping;
    private _userData;
    private _path;
    private _onUpdate;
    private _onStart;
    private _onComplete;
    private _onUpdateCaller;
    private _onStartCaller;
    private _onCompleteCaller;
    private _startValue;
    private _endValue;
    private _value;
    private _deltaValue;
    private _valueSize;
    private _started;
    private _ended;
    private _elapsedTime;
    private _normalizedTime;
    constructor();
    setDelay(value: number): GTweener;
    get delay(): number;
    setDuration(value: number): GTweener;
    get duration(): number;
    setBreakpoint(value: number): GTweener;
    setEase(value: number): GTweener;
    setEasePeriod(value: number): GTweener;
    setEaseOvershootOrAmplitude(value: number): GTweener;
    setRepeat(repeat: number, yoyo?: boolean): GTweener;
    get repeat(): number;
    setTimeScale(value: number): GTweener;
    setSnapping(value: boolean): GTweener;
    setTarget(value: any, propType?: any): GTweener;
    get target(): any;
    setPath(value: GPath): GTweener;
    setUserData(value: any): GTweener;
    get userData(): any;
    onUpdate(callback: Function, target?: any): GTweener;
    onStart(callback: Function, target?: any): GTweener;
    onComplete(callback: Function, target?: any): GTweener;
    get startValue(): TweenValue;
    get endValue(): TweenValue;
    get value(): TweenValue;
    get deltaValue(): TweenValue;
    get normalizedTime(): number;
    get completed(): boolean;
    get allCompleted(): boolean;
    setPaused(paused: boolean): GTweener;
    /**
     * seek position of the tween, in seconds.
     */
    seek(time: number): void;
    kill(complete?: boolean): void;
    _to(start: number, end: number, duration: number): GTweener;
    _to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener;
    _to3(start: number, start2: number, start3: number, end: number, end2: number, end3: number, duration: number): GTweener;
    _to4(start: number, start2: number, start3: number, start4: number, end: number, end2: number, end3: number, end4: number, duration: number): GTweener;
    _toColor(start: number, end: number, duration: number): GTweener;
    _shake(startX: number, startY: number, amplitude: number, duration: number): GTweener;
    _init(): void;
    _reset(): void;
    _update(dt: number): void;
    private update;
    private callStartCallback;
    private callUpdateCallback;
    private callCompleteCallback;
}

declare class GearBase {
    static disableAllTweenEffect?: boolean;
    _owner: GObject;
    protected _controller: Controller;
    protected _tweenConfig: GearTweenConfig;
    dispose(): void;
    get controller(): Controller;
    set controller(val: Controller);
    get tweenConfig(): GearTweenConfig;
    protected get allowTween(): boolean;
    setup(buffer: ByteBuffer): void;
    updateFromRelations(dx: number, dy: number): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    protected init(): void;
    apply(): void;
    updateState(): void;
}
declare class GearTweenConfig {
    tween: boolean;
    easeType: number;
    duration: number;
    delay: number;
    _displayLockToken: number;
    _tweener: GTweener;
    constructor();
}

declare class GearLook extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    private __tweenUpdate;
    private __tweenComplete;
    updateState(): void;
}

declare class GearSize extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    private __tweenUpdate;
    private __tweenComplete;
    updateState(): void;
    updateFromRelations(dx: number, dy: number): void;
}

declare class GearXY extends GearBase {
    positionsInPercent: boolean;
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    addExtStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    private __tweenUpdate;
    private __tweenComplete;
    updateState(): void;
    updateFromRelations(dx: number, dy: number): void;
}

declare class InputProcessor extends Component {
    private _owner;
    private _touchListener;
    private _touchPos;
    private _touches;
    private _rollOutChain;
    private _rollOverChain;
    _captureCallback: (evt: FGUIEvent) => void;
    constructor();
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    getAllTouches(touchIds?: Array<number>): Array<number>;
    getTouchPosition(touchId?: number): Vec2;
    getTouchTarget(): GObject;
    addTouchMonitor(touchId: number, target: GObject): void;
    removeTouchMonitor(target: GObject): void;
    cancelClick(touchId: number): void;
    simulateClick(target: GObject): void;
    private touchBeginHandler;
    private touchMoveHandler;
    private touchEndHandler;
    private touchCancelHandler;
    private mouseDownHandler;
    private mouseUpHandler;
    private mouseMoveHandler;
    private mouseWheelHandler;
    private updateInfo;
    private getInfo;
    private setBegin;
    private setEnd;
    private clickTest;
    private handleRollOver;
    private getEvent;
}

declare class FGUIEvent extends Event$1 {
    static TOUCH_BEGIN: string;
    static TOUCH_MOVE: string;
    static TOUCH_END: string;
    static CLICK: string;
    static ROLL_OVER: string;
    static ROLL_OUT: string;
    static MOUSE_WHEEL: string;
    static DISPLAY: string;
    static UNDISPLAY: string;
    static GEAR_STOP: string;
    static LINK: string;
    static Submit: string;
    static TEXT_CHANGE: string;
    static STATUS_CHANGED: string;
    static XY_CHANGED: string;
    static SIZE_CHANGED: string;
    static SIZE_DELAY_CHANGE: string;
    static DRAG_START: string;
    static DRAG_MOVE: string;
    static DRAG_END: string;
    static DROP: string;
    static SCROLL: string;
    static SCROLL_END: string;
    static PULL_DOWN_RELEASE: string;
    static PULL_UP_RELEASE: string;
    static CLICK_ITEM: string;
    initiator: GObject;
    pos: Vec2;
    touchId: number;
    clickCount: number;
    button: number;
    keyModifiers: number;
    mouseWheelDelta: number;
    _processor: InputProcessor;
    constructor(type: string, bubbles: boolean);
    get sender(): GObject | null;
    get isShiftDown(): boolean;
    get isCtrlDown(): boolean;
    captureTouch(): void;
}

declare class GObjectPool {
    private _pool;
    private _count;
    constructor();
    clear(): void;
    get count(): number;
    getObject(url: string): GObject;
    returnObject(obj: GObject): void;
}

type ListItemRenderer = (index: number, item: GObject) => void;
declare class GList extends GComponent {
    itemRenderer: ListItemRenderer;
    itemProvider: (index: number) => string;
    backToPool: (item: GObject) => void;
    scrollItemToViewOnClick: boolean;
    foldInvisibleItems: boolean;
    private _layout;
    private _lineCount;
    private _columnCount;
    private _lineGap;
    private _columnGap;
    private _defaultItem;
    private _autoResizeItem;
    private _selectionMode;
    private _align;
    private _verticalAlign;
    private _selectionController?;
    private _lastSelectedIndex;
    private _pool;
    private _virtual?;
    private _loop?;
    private _numItems;
    private _realNumItems;
    private _firstIndex;
    private _curLineItemCount;
    private _curLineItemCount2;
    private _itemSize?;
    private _virtualListChanged;
    private _virtualItems?;
    private _eventLocked?;
    private itemInfoVer;
    constructor();
    dispose(): void;
    get layout(): ListLayoutType;
    set layout(value: ListLayoutType);
    get lineCount(): number;
    set lineCount(value: number);
    get columnCount(): number;
    set columnCount(value: number);
    get lineGap(): number;
    set lineGap(value: number);
    get columnGap(): number;
    set columnGap(value: number);
    get align(): AlignType;
    set align(value: AlignType);
    get verticalAlign(): VertAlignType;
    set verticalAlign(value: VertAlignType);
    get virtualItemSize(): Size;
    set virtualItemSize(value: Size);
    get defaultItem(): string | null;
    set defaultItem(val: string | null);
    get autoResizeItem(): boolean;
    set autoResizeItem(value: boolean);
    get selectionMode(): ListSelectionMode;
    set selectionMode(value: ListSelectionMode);
    get selectionController(): Controller;
    set selectionController(value: Controller);
    get itemPool(): GObjectPool;
    getFromPool(url?: string): GObject;
    returnToPool(obj: GObject): void;
    addChildAt(child: GObject, index: number): GObject;
    addItem(url?: string): GObject;
    addItemFromPool(url?: string): GObject;
    removeChildAt(index: number, dispose?: boolean): GObject;
    removeChildToPoolAt(index: number): void;
    removeChildToPool(child: GObject): void;
    removeChildrenToPool(beginIndex?: number, endIndex?: number): void;
    get selectedIndex(): number;
    set selectedIndex(value: number);
    getSelection(result?: number[]): number[];
    addSelection(index: number, scrollItToView?: boolean): void;
    removeSelection(index: number): void;
    clearSelection(): void;
    private clearSelectionExcept;
    selectAll(): void;
    selectNone(): void;
    selectReverse(): void;
    handleArrowKey(dir: number): void;
    private onClickItem;
    protected dispatchItemEvent(item: GObject, evt: FGUIEvent): void;
    private setSelectionOnEvent;
    resizeToFit(itemCount?: number, minSize?: number): void;
    getMaxItemWidth(): number;
    protected handleSizeChanged(): void;
    handleControllerChanged(c: Controller): void;
    private updateSelectionController;
    getSnappingPosition(xValue: number, yValue: number, resultPoint?: Vec2): Vec2;
    scrollToView(index: number, ani?: boolean, setFirst?: boolean): void;
    getFirstChildInView(): number;
    childIndexToItemIndex(index: number): number;
    itemIndexToChildIndex(index: number): number;
    setVirtual(): void;
    setVirtualAndLoop(): void;
    private _setVirtual;
    get numItems(): number;
    set numItems(value: number);
    refreshVirtualList(): void;
    private checkVirtualList;
    private setVirtualListChangedFlag;
    private _refreshVirtualList;
    private __scrolled;
    private getIndexOnPos1;
    private getIndexOnPos2;
    private getIndexOnPos3;
    private handleScroll;
    private static pos_param;
    private handleScroll1;
    private handleScroll2;
    private handleScroll3;
    private handleArchOrder1;
    private handleArchOrder2;
    private handleAlign;
    protected updateBounds(): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    protected readItems(buffer: ByteBuffer): void;
    protected setupItem(buffer: ByteBuffer, obj: GObject): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GTree extends GList {
    treeNodeRender: (node: GTreeNode, obj: GComponent) => void;
    treeNodeWillExpand: (node: GTreeNode, expanded: boolean) => void;
    private _indent;
    private _clickToExpand;
    private _rootNode;
    private _expandedStatusInEvt;
    constructor();
    get rootNode(): GTreeNode;
    get indent(): number;
    set indent(value: number);
    get clickToExpand(): number;
    set clickToExpand(value: number);
    getSelectedNode(): GTreeNode;
    getSelectedNodes(result?: Array<GTreeNode>): Array<GTreeNode>;
    selectNode(node: GTreeNode, scrollItToView?: boolean): void;
    unselectNode(node: GTreeNode): void;
    expandAll(folderNode?: GTreeNode): void;
    collapseAll(folderNode?: GTreeNode): void;
    private createCell;
    _afterInserted(node: GTreeNode): void;
    private getInsertIndexForNode;
    _afterRemoved(node: GTreeNode): void;
    _afterExpanded(node: GTreeNode): void;
    _afterCollapsed(node: GTreeNode): void;
    _afterMoved(node: GTreeNode): void;
    private getFolderEndIndex;
    private checkChildren;
    private hideFolderNode;
    private removeNode;
    private __cellMouseDown;
    private __expandedStateChanged;
    protected dispatchItemEvent(item: GObject, evt: FGUIEvent): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    protected readItems(buffer: ByteBuffer): void;
}

declare class GTreeNode {
    data?: any;
    private _parent;
    private _children;
    private _expanded;
    private _level;
    private _tree;
    _cell: GComponent;
    _resURL?: string;
    constructor(hasChild?: boolean, resURL?: string);
    set expanded(value: boolean);
    get expanded(): boolean;
    get isFolder(): boolean;
    get parent(): GTreeNode;
    get text(): string | null;
    set text(value: string | null);
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get cell(): GComponent;
    get level(): number;
    _setLevel(value: number): void;
    addChild(child: GTreeNode): GTreeNode;
    addChildAt(child: GTreeNode, index: number): GTreeNode;
    removeChild(child: GTreeNode): GTreeNode;
    removeChildAt(index: number): GTreeNode;
    removeChildren(beginIndex?: number, endIndex?: number): void;
    getChildAt(index: number): GTreeNode;
    getChildIndex(child: GTreeNode): number;
    getPrevSibling(): GTreeNode;
    getNextSibling(): GTreeNode;
    setChildIndex(child: GTreeNode, index: number): void;
    swapChildren(child1: GTreeNode, child2: GTreeNode): void;
    swapChildrenAt(index1: number, index2: number): void;
    get numChildren(): number;
    expandToRoot(): void;
    get tree(): GTree;
    _setTree(value: GTree): void;
}

declare class Image extends Sprite {
    private _flip;
    private _fillMethod;
    private _fillOrigin;
    private _fillAmount;
    private _fillClockwise;
    constructor();
    get flip(): FlipType;
    set flip(value: FlipType);
    get fillMethod(): FillMethod;
    set fillMethod(value: FillMethod);
    get fillOrigin(): FillOrigin;
    set fillOrigin(value: FillOrigin);
    get fillClockwise(): boolean;
    set fillClockwise(value: boolean);
    get fillAmount(): number;
    set fillAmount(value: number);
    private setupFill;
}

interface Frame {
    rect: Rect;
    addDelay: number;
    texture: SpriteFrame | null;
}
declare class MovieClip extends Image {
    interval: number;
    swing: boolean;
    repeatDelay: number;
    timeScale: number;
    private _playing;
    private _frameCount;
    private _frames;
    private _frame;
    private _start;
    private _end;
    private _times;
    private _endAt;
    private _status;
    private _callback;
    private _smoothing;
    private _frameElapsed;
    private _reversed;
    private _repeatedCount;
    constructor();
    get frames(): Array<Frame>;
    set frames(value: Array<Frame>);
    get frameCount(): number;
    get frame(): number;
    set frame(value: number);
    get playing(): boolean;
    set playing(value: boolean);
    get smoothing(): boolean;
    set smoothing(value: boolean);
    rewind(): void;
    syncStatus(anotherMc: MovieClip): void;
    advance(timeInSeconds: number): void;
    setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: (() => void) | null): void;
    protected update(dt: number): void;
    private drawFrame;
}

type PackageDependency = {
    id: string;
    name: string;
};
declare class UIPackage {
    private _id;
    private _name;
    private _path;
    private _items;
    private _itemsById;
    private _itemsByName;
    private _sprites;
    private _dependencies;
    private _branches;
    _branchIndex: number;
    private _bundle;
    constructor();
    static get branch(): string | null;
    static set branch(value: string | null);
    static getVar(key: string): string | null;
    static setVar(key: string, value: string | null): void;
    static getById(id: string): UIPackage;
    static getByName(name: string): UIPackage;
    /**
     * 注册一个包。包的所有资源必须放在resources下，且已经预加载。
     * @param path 相对 resources 的路径。
     */
    static addPackage(path: string): UIPackage;
    /**
     * 载入一个包。包的资源从Asset Bundle加载.
     * @param bundle Asset Bundle 对象.
     * @param path 资源相对 Asset Bundle 目录的路径.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(bundle: AssetManager.Bundle, path: string, onComplete?: (error: any, pkg: UIPackage) => void): void;
    /**
     * 载入一个包。包的资源从Asset Bundle加载.
     * @param bundle Asset Bundle 对象.
     * @param path 资源相对 Asset Bundle 目录的路径.
     * @param onProgress 加载进度回调.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(bundle: AssetManager.Bundle, path: string, onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void, onComplete?: (error: any, pkg: UIPackage) => void): void;
    /**
     * 载入一个包。包的资源从resources加载.
     * @param path 资源相对 resources 的路径.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(path: string, onComplete?: (error: any, pkg: UIPackage) => void): void;
    /**
     * 载入一个包。包的资源从resources加载.
     * @param path 资源相对 resources 的路径.
     * @param onProgress 加载进度回调.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(path: string, onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void, onComplete?: (error: Error, pkg: UIPackage) => void): void;
    static removePackage(packageIdOrName: string): void;
    static createObject(pkgName: string, resName: string, userClass?: new () => GObject): GObject;
    static createObjectFromURL(url: string, userClass?: new () => GObject): GObject;
    static getItemURL(pkgName: string, resName: string): string;
    static getItemByURL(url: string): PackageItem;
    static normalizeURL(url: string): string;
    static setStringsSource(source: string): void;
    private loadPackage;
    dispose(): void;
    get id(): string;
    get name(): string;
    get path(): string;
    get dependencies(): Array<PackageDependency>;
    createObject(resName: string, userClass?: new () => GObject): GObject;
    internalCreateObject(item: PackageItem, userClass?: new () => GObject): GObject;
    getItemById(itemId: string): PackageItem;
    getItemByName(resName: string): PackageItem;
    getItemAssetByName(resName: string): Asset;
    getItemAsset(item: PackageItem): Asset;
    getItemAssetAsync(item: PackageItem, onComplete?: (err: Error, item: PackageItem) => void): void;
    loadAllAssets(): void;
    private loadMovieClip;
    private loadFont;
    private loadSpine;
    private loadDragonBones;
}

declare class PackageItem {
    owner: UIPackage;
    type: PackageItemType;
    objectType?: ObjectType;
    id: string;
    name: string;
    width: number;
    height: number;
    file: string;
    decoded?: boolean;
    loading?: Array<Function>;
    rawData?: ByteBuffer;
    asset?: Asset;
    highResolution?: Array<string>;
    branches?: Array<string>;
    scale9Grid?: Rect;
    scaleByTile?: boolean;
    tileGridIndice?: number;
    smoothing?: boolean;
    hitTestData?: PixelHitTestData;
    interval?: number;
    repeatDelay?: number;
    swing?: boolean;
    frames?: Array<Frame>;
    extensionType?: any;
    skeletonAnchor?: Vec2;
    atlasAsset?: dragonBones.DragonBonesAtlasAsset;
    constructor();
    load(): Asset;
    getBranch(): PackageItem;
    getHighResolution(): PackageItem;
    toString(): string;
}

declare class Relations {
    private _owner;
    private _items;
    handling: GObject | null;
    sizeDirty: boolean;
    constructor(owner: GObject);
    add(target: GObject, relationType: number, usePercent?: boolean): void;
    remove(target: GObject, relationType?: number): void;
    contains(target: GObject): boolean;
    clearFor(target: GObject): void;
    clearAll(): void;
    copyFrom(source: Relations): void;
    dispose(): void;
    onOwnerSizeChanged(dWidth: number, dHeight: number, applyPivot: boolean): void;
    ensureRelationsSizeCorrect(): void;
    get empty(): boolean;
    setup(buffer: ByteBuffer, parentToChild: boolean): void;
}

declare class GObject {
    data?: any;
    packageItem?: PackageItem;
    static draggingObject: GObject | null;
    protected _x: number;
    protected _y: number;
    protected _alpha: number;
    protected _visible: boolean;
    protected _touchable: boolean;
    protected _grayed?: boolean;
    protected _draggable?: boolean;
    protected _skewX: number;
    protected _skewY: number;
    protected _pivotAsAnchor?: boolean;
    protected _sortingOrder: number;
    protected _internalVisible: boolean;
    protected _handlingController?: boolean;
    protected _tooltips?: any;
    protected _blendMode: BlendMode;
    protected _pixelSnapping?: boolean;
    protected _dragTesting?: boolean;
    protected _dragStartPos?: Vec2;
    protected _relations: Relations;
    protected _group: GGroup | null;
    protected _gears: GearBase[];
    protected _node: Node;
    protected _dragBounds?: Rect;
    sourceWidth: number;
    sourceHeight: number;
    initWidth: number;
    initHeight: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    _parent: GComponent | null;
    _width: number;
    _height: number;
    _rawWidth: number;
    _rawHeight: number;
    _id: string;
    _name: string;
    _underConstruct: boolean;
    _gearLocked?: boolean;
    _sizePercentInGroup: number;
    _touchDisabled?: boolean;
    _partner: GObjectPartner;
    _treeNode?: GTreeNode;
    _uiTrans: UITransform;
    _uiOpacity: UIOpacity;
    private _hitTestPt?;
    constructor();
    get id(): string;
    get name(): string;
    set name(value: string);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    setPosition(xv: number, yv: number): void;
    get xMin(): number;
    set xMin(value: number);
    get yMin(): number;
    set yMin(value: number);
    get pixelSnapping(): boolean;
    set pixelSnapping(value: boolean);
    center(restraint?: boolean): void;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    setSize(wv: number, hv: number, ignorePivot?: boolean): void;
    makeFullScreen(): void;
    ensureSizeCorrect(): void;
    get actualWidth(): number;
    get actualHeight(): number;
    get scaleX(): number;
    set scaleX(value: number);
    get scaleY(): number;
    set scaleY(value: number);
    setScale(sx: number, sy: number): void;
    get skewX(): number;
    get pivotX(): number;
    set pivotX(value: number);
    get pivotY(): number;
    set pivotY(value: number);
    setPivot(xv: number, yv: number, asAnchor?: boolean): void;
    get pivotAsAnchor(): boolean;
    get touchable(): boolean;
    set touchable(value: boolean);
    get grayed(): boolean;
    set grayed(value: boolean);
    get enabled(): boolean;
    set enabled(value: boolean);
    get rotation(): number;
    set rotation(value: number);
    get alpha(): number;
    set alpha(value: number);
    get visible(): boolean;
    set visible(value: boolean);
    get _finalVisible(): boolean;
    get internalVisible3(): boolean;
    get sortingOrder(): number;
    set sortingOrder(value: number);
    requestFocus(): void;
    get tooltips(): any | null;
    set tooltips(value: any | null);
    get blendMode(): BlendMode;
    set blendMode(value: BlendMode);
    get onStage(): boolean;
    get resourceURL(): string | null;
    set group(value: GGroup);
    get group(): GGroup;
    getGear(index: number): GearBase;
    protected updateGear(index: number): void;
    checkGearController(index: number, c: Controller): boolean;
    updateGearFromRelations(index: number, dx: number, dy: number): void;
    addDisplayLock(): number;
    releaseDisplayLock(token: number): void;
    private checkGearDisplay;
    get gearXY(): GearXY;
    get gearSize(): GearSize;
    get gearLook(): GearLook;
    get relations(): Relations;
    addRelation(target: GObject, relationType: number, usePercent?: boolean): void;
    removeRelation(target: GObject, relationType: number): void;
    get node(): Node;
    get parent(): GComponent;
    removeFromParent(): void;
    findParent(): GObject;
    get asCom(): GComponent;
    static cast(obj: Node): GObject;
    get text(): string | null;
    set text(value: string | null);
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get treeNode(): GTreeNode;
    get isDisposed(): boolean;
    dispose(): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected onUpdate(): void;
    protected onDestroy(): void;
    onClick(listener: Function, target?: any): void;
    onceClick(listener: Function, target?: any): void;
    offClick(listener: Function, target?: any): void;
    clearClick(): void;
    hasClickListener(): boolean;
    on(type: string, listener: Function, target?: any): void;
    once(type: string, listener: Function, target?: any): void;
    off(type: string, listener?: Function, target?: any): void;
    hasEventHandler(type: string, listener?: Function, target?: any): boolean;
    get draggable(): boolean;
    set draggable(value: boolean);
    get dragBounds(): Rect;
    set dragBounds(value: Rect);
    startDrag(touchId?: number): void;
    stopDrag(): void;
    get dragging(): boolean;
    localToGlobal(ax?: number, ay?: number, result?: Vec2): Vec2;
    globalToLocal(ax?: number, ay?: number, result?: Vec2): Vec2;
    localToGlobalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: Rect): Rect;
    globalToLocalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: Rect): Rect;
    handleControllerChanged(c: Controller): void;
    protected handleAnchorChanged(): void;
    handlePositionChanged(): void;
    protected handleSizeChanged(): void;
    protected handleGrayedChanged(): void;
    handleVisibleChanged(): void;
    hitTest(globalPt: Vec2, forTouch?: boolean): GObject;
    protected _hitTest(pt: Vec2, globalPt: Vec2): GObject;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    constructFromResource(): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    private onRollOver;
    private onRollOut;
    private initDrag;
    private dragBegin;
    private dragEnd;
    private onTouchBegin_0;
    private onTouchMove_0;
    private onTouchEnd_0;
}
declare class GObjectPartner extends Component {
    _emitDisplayEvents?: boolean;
    callLater(callback: any, delay?: number): void;
    onClickLink(evt: Event, text: string): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected update(dt: number): void;
    protected onDestroy(): void;
}

declare class GGroup extends GObject {
    private _layout;
    private _lineGap;
    private _columnGap;
    private _excludeInvisibles;
    private _autoSizeDisabled;
    private _mainGridIndex;
    private _mainGridMinSize;
    private _boundsChanged;
    private _percentReady;
    private _mainChildIndex;
    private _totalSize;
    private _numChildren;
    _updating: number;
    constructor();
    dispose(): void;
    get layout(): number;
    set layout(value: number);
    get lineGap(): number;
    set lineGap(value: number);
    get columnGap(): number;
    set columnGap(value: number);
    get excludeInvisibles(): boolean;
    set excludeInvisibles(value: boolean);
    get autoSizeDisabled(): boolean;
    set autoSizeDisabled(value: boolean);
    get mainGridMinSize(): number;
    set mainGridMinSize(value: number);
    get mainGridIndex(): number;
    set mainGridIndex(value: number);
    setBoundsChangedFlag(positionChangedOnly?: boolean): void;
    private _ensureBoundsCorrect;
    ensureSizeCorrect(): void;
    ensureBoundsCorrect(): void;
    private updateBounds;
    private handleLayout;
    moveChildren(dx: number, dy: number): void;
    resizeChildren(dw: number, dh: number): void;
    handleAlphaChanged(): void;
    handleVisibleChanged(): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GGraph extends GObject {
    _content: Graphics;
    private _type;
    private _lineSize;
    private _lineColor;
    private _fillColor;
    private _cornerRadius?;
    private _sides?;
    private _startAngle?;
    private _polygonPoints?;
    private _distances?;
    private _hasContent;
    constructor();
    drawRect(lineSize: number, lineColor: Color, fillColor: Color, corner?: Array<number>): void;
    drawEllipse(lineSize: number, lineColor: Color, fillColor: Color): void;
    drawRegularPolygon(lineSize: number, lineColor: Color, fillColor: Color, sides: number, startAngle?: number, distances?: number[]): void;
    drawPolygon(lineSize: number, lineColor: Color, fillColor: Color, points: Array<number>): void;
    get distances(): number[];
    set distances(value: number[]);
    clearGraphics(): void;
    get type(): number;
    get color(): Color;
    set color(value: Color);
    private updateGraph;
    private drawPath;
    protected handleSizeChanged(): void;
    protected handleAnchorChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    protected _hitTest(pt: Vec2): GObject;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GImage extends GObject {
    _content: Image;
    constructor();
    get color(): Color;
    set color(value: Color);
    get flip(): FlipType;
    set flip(value: FlipType);
    get fillMethod(): FillMethod;
    set fillMethod(value: FillMethod);
    get fillOrigin(): FillOrigin;
    set fillOrigin(value: FillOrigin);
    get fillClockwise(): boolean;
    set fillClockwise(value: boolean);
    get fillAmount(): number;
    set fillAmount(value: number);
    constructFromResource(): void;
    protected handleGrayedChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GMovieClip extends GObject {
    _content: MovieClip;
    constructor();
    get color(): Color;
    set color(value: Color);
    get playing(): boolean;
    set playing(value: boolean);
    get frame(): number;
    set frame(value: number);
    get timeScale(): number;
    set timeScale(value: number);
    rewind(): void;
    syncStatus(anotherMc: GMovieClip): void;
    advance(timeInSeconds: number): void;
    setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: (() => void) | null): void;
    protected handleGrayedChanged(): void;
    protected handleSizeChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    constructFromResource(): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

interface IUISource {
    fileName: string;
    loaded: boolean;
    load(callback: () => void, target: any): void;
}
declare class Window extends GComponent {
    private _contentPane;
    private _modalWaitPane;
    private _closeButton;
    private _dragArea;
    private _contentArea;
    private _frame;
    private _modal;
    private _uiSources?;
    private _inited?;
    private _loading?;
    protected _requestingCmd: number;
    bringToFontOnClick: boolean;
    constructor();
    addUISource(source: IUISource): void;
    set contentPane(val: GComponent);
    get contentPane(): GComponent;
    get frame(): GComponent;
    get closeButton(): GObject;
    set closeButton(value: GObject);
    get dragArea(): GObject;
    set dragArea(value: GObject);
    get contentArea(): GObject;
    set contentArea(value: GObject);
    show(): void;
    showOn(root: GRoot): void;
    hide(): void;
    hideImmediately(): void;
    centerOn(r: GRoot, restraint?: boolean): void;
    toggleStatus(): void;
    get isShowing(): boolean;
    get isTop(): boolean;
    get modal(): boolean;
    set modal(val: boolean);
    bringToFront(): void;
    showModalWait(requestingCmd?: number): void;
    protected layoutModalWaitPane(): void;
    closeModalWait(requestingCmd?: number): boolean;
    get modalWaiting(): boolean;
    init(): void;
    protected onInit(): void;
    protected onShown(): void;
    protected onHide(): void;
    protected doShowAnimation(): void;
    protected doHideAnimation(): void;
    private __uiLoadComplete;
    private _init;
    dispose(): void;
    protected closeEventHandler(evt: Event): void;
    protected onEnable(): void;
    protected onDisable(): void;
    private onTouchBegin_1;
    private onDragStart_1;
}

declare class GRoot extends GComponent {
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

declare class GTextField extends GObject {
    _label: Label;
    protected _font: string;
    protected _realFont: string | Font;
    protected _fontSize: number;
    protected _color: Color;
    protected _strokeColor?: Color;
    protected _shadowOffset?: Vec2;
    protected _shadowColor?: Color;
    protected _leading: number;
    protected _text: string;
    protected _ubbEnabled: boolean;
    protected _templateVars?: {
        [index: string]: string;
    };
    protected _autoSize: AutoSizeType;
    protected _updatingSize: boolean;
    protected _sizeDirty: boolean;
    constructor();
    protected createRenderer(): void;
    set text(value: string | null);
    get text(): string | null;
    get font(): string | null;
    set font(value: string | null);
    get fontSize(): number;
    set fontSize(value: number);
    get color(): Color;
    set color(value: Color);
    get align(): HorizontalTextAlignment;
    set align(value: HorizontalTextAlignment);
    get verticalAlign(): VerticalTextAlignment;
    set verticalAlign(value: VerticalTextAlignment);
    get leading(): number;
    set leading(value: number);
    get letterSpacing(): number;
    set letterSpacing(value: number);
    get underline(): boolean;
    set underline(value: boolean);
    get bold(): boolean;
    set bold(value: boolean);
    get italic(): boolean;
    set italic(value: boolean);
    get singleLine(): boolean;
    set singleLine(value: boolean);
    get stroke(): number;
    set stroke(value: number);
    get strokeColor(): Color;
    set strokeColor(value: Color);
    get shadowOffset(): Vec2;
    set shadowOffset(value: Vec2);
    get shadowColor(): Color;
    set shadowColor(value: Color);
    set ubbEnabled(value: boolean);
    get ubbEnabled(): boolean;
    set autoSize(value: AutoSizeType);
    get autoSize(): AutoSizeType;
    protected parseTemplate(template: string): string;
    get templateVars(): {
        [index: string]: string;
    };
    set templateVars(value: {
        [index: string]: string;
    });
    setVar(name: string, value: string): GTextField;
    flushVars(): void;
    get textWidth(): number;
    ensureSizeCorrect(): void;
    protected updateText(): void;
    protected assignFont(label: any, value: string | Font): void;
    protected assignFontColor(label: any, value: Color): void;
    protected updateFont(): void;
    protected updateFontColor(): void;
    protected updateStrokeColor(): void;
    protected updateShadowColor(): void;
    protected updateFontSize(): void;
    protected updateOverflow(): void;
    protected markSizeChanged(): void;
    protected onLabelSizeChanged(): void;
    protected handleSizeChanged(): void;
    protected handleGrayedChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GRichTextField extends GTextField {
    _richText: RichText;
    private _bold;
    private _italics;
    private _underline;
    linkUnderline: boolean;
    linkColor: string;
    constructor();
    protected createRenderer(): void;
    get align(): HorizontalTextAlignment;
    set align(value: HorizontalTextAlignment);
    get underline(): boolean;
    set underline(value: boolean);
    get bold(): boolean;
    set bold(value: boolean);
    get italic(): boolean;
    set italic(value: boolean);
    protected markSizeChanged(): void;
    protected updateText(): void;
    private replaceHtmlColor;
    protected updateFont(): void;
    protected updateFontColor(): void;
    protected updateFontSize(): void;
    protected updateOverflow(): void;
    protected handleSizeChanged(): void;
}

declare class GTextInput extends GTextField {
    _editBox: EditBox;
    private _promptText;
    constructor();
    protected createRenderer(): void;
    set editable(val: boolean);
    get editable(): boolean;
    set maxLength(val: number);
    get maxLength(): number;
    set promptText(val: string | null);
    get promptText(): string | null;
    set restrict(value: string | null);
    get restrict(): string | null;
    get password(): boolean;
    set password(val: boolean);
    get align(): HorizontalTextAlignment;
    set align(value: HorizontalTextAlignment);
    get verticalAlign(): VerticalTextAlignment;
    set verticalAlign(value: VerticalTextAlignment);
    get singleLine(): boolean;
    set singleLine(value: boolean);
    requestFocus(): void;
    protected markSizeChanged(): void;
    protected updateText(): void;
    protected updateFont(): void;
    protected updateFontColor(): void;
    protected updateFontSize(): void;
    protected updateOverflow(): void;
    private onTextChanged;
    private onTouchEnd1;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GLoader extends GObject {
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

declare class GLoader3D extends GObject {
    private _url;
    private _align;
    private _verticalAlign;
    private _autoSize;
    private _fill;
    private _shrinkOnly;
    private _playing;
    private _frame;
    private _loop;
    private _animationName;
    private _skinName;
    private _color;
    private _contentItem;
    private _container;
    private _content;
    private _updatingLayout;
    constructor();
    dispose(): void;
    get url(): string | null;
    set url(value: string | null);
    get icon(): string | null;
    set icon(value: string | null);
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
    get animationName(): string | null;
    set animationName(value: string | null);
    get skinName(): string | null;
    set skinName(value: string | null);
    get loop(): boolean;
    set loop(value: boolean);
    get color(): Color;
    set color(value: Color);
    get content(): sp.Skeleton | dragonBones.ArmatureDisplay;
    protected loadContent(): void;
    protected loadFromPackage(itemURL: string): void;
    private onLoaded;
    setSpine(asset: sp.SkeletonData, anchor: Vec2, pma?: boolean): void;
    freeSpine(): void;
    setDragonBones(asset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset, anchor: Vec2, pma?: boolean): void;
    freeDragonBones(): void;
    private onChange;
    private onChangeSpine;
    private onChangeDragonBones;
    protected loadExternal(): void;
    private onLoaded2;
    private updateLayout;
    private clearContent;
    protected handleSizeChanged(): void;
    protected handleAnchorChanged(): void;
    protected handleGrayedChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GLabel extends GComponent {
    protected _titleObject: GObject;
    protected _iconObject: GObject;
    private _sound;
    private _soundVolumeScale;
    constructor();
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get title(): string | null;
    set title(value: string | null);
    get text(): string | null;
    set text(value: string | null);
    get titleColor(): Color;
    set titleColor(value: Color);
    get titleFontSize(): number;
    set titleFontSize(value: number);
    set editable(val: boolean);
    get editable(): boolean;
    getTextField(): GTextField;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    protected constructExtension(buffer: ByteBuffer): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    private onClick_1;
}

declare class GButton extends GComponent {
    protected _titleObject: GObject;
    protected _iconObject: GObject;
    private _mode;
    private _selected;
    private _title;
    private _selectedTitle;
    private _icon;
    private _selectedIcon;
    private _sound;
    private _soundVolumeScale;
    private _buttonController;
    private _relatedController?;
    private _relatedPageId;
    private _changeStateOnClick;
    private _linkedPopup?;
    private _downEffect;
    private _downEffectValue;
    private _downColor?;
    private _downScaled?;
    private _down;
    private _over;
    static UP: string;
    static DOWN: string;
    static OVER: string;
    static SELECTED_OVER: string;
    static DISABLED: string;
    static SELECTED_DISABLED: string;
    constructor();
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get selectedIcon(): ResURL | null;
    set selectedIcon(value: ResURL | null);
    get title(): string | null;
    set title(value: string | null);
    get text(): string | null;
    set text(value: string | null);
    get selectedTitle(): string | null;
    set selectedTitle(value: string | null);
    get titleColor(): Color;
    set titleColor(value: Color);
    get titleFontSize(): number;
    set titleFontSize(value: number);
    get sound(): string | null;
    set sound(val: string | null);
    get soundVolumeScale(): number;
    set soundVolumeScale(value: number);
    set selected(val: boolean);
    get selected(): boolean;
    get mode(): ButtonMode;
    set mode(value: ButtonMode);
    get relatedController(): Controller;
    set relatedController(val: Controller);
    get relatedPageId(): string | null;
    set relatedPageId(val: string | null);
    get changeStateOnClick(): boolean;
    set changeStateOnClick(value: boolean);
    get linkedPopup(): GObject;
    set linkedPopup(value: GObject);
    getTextField(): GTextField;
    fireClick(): void;
    protected setState(val: string): void;
    protected setCurrentState(): void;
    handleControllerChanged(c: Controller): void;
    protected handleGrayedChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    protected constructExtension(buffer: ByteBuffer): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    private onRollOver_1;
    private onRollOut_1;
    private onTouchBegin_1;
    private onTouchEnd_1;
    private onClick_1;
}

declare class GComboBox extends GComponent {
    dropdown: GComponent;
    protected _titleObject: GObject;
    protected _iconObject: GObject;
    protected _list: GList;
    private _items;
    private _values;
    private _icons?;
    private _visibleItemCount;
    private _itemsUpdated;
    private _selectedIndex;
    private _buttonController;
    private _popupDirection;
    private _selectionController;
    private _over;
    private _down;
    constructor();
    get text(): string | null;
    set text(value: string | null);
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get titleColor(): Color;
    set titleColor(value: Color);
    get titleFontSize(): number;
    set titleFontSize(value: number);
    get visibleItemCount(): number;
    set visibleItemCount(value: number);
    get popupDirection(): PopupDirection;
    set popupDirection(value: PopupDirection);
    get items(): Array<string>;
    set items(value: Array<string>);
    get icons(): Array<string>;
    set icons(value: Array<string>);
    get values(): Array<string>;
    set values(value: Array<string>);
    get selectedIndex(): number;
    set selectedIndex(val: number);
    get value(): string | null;
    set value(val: string | null);
    get selectionController(): Controller;
    set selectionController(value: Controller);
    getTextField(): GTextField;
    protected setState(val: string): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    protected constructExtension(buffer: ByteBuffer): void;
    handleControllerChanged(c: Controller): void;
    private updateSelectionController;
    dispose(): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    protected showDropdown(): void;
    private onPopupClosed;
    private onClickItem;
    private onClickItem2;
    private onRollOver_1;
    private onRollOut_1;
    private onTouchBegin_1;
    private onTouchEnd_1;
}

declare class GSlider extends GComponent {
    private _min;
    private _max;
    private _value;
    private _titleType;
    private _reverse;
    private _wholeNumbers;
    private _titleObject;
    private _barObjectH;
    private _barObjectV;
    private _barMaxWidth;
    private _barMaxHeight;
    private _barMaxWidthDelta;
    private _barMaxHeightDelta;
    private _gripObject;
    private _clickPos;
    private _clickPercent;
    private _barStartX;
    private _barStartY;
    changeOnClick: boolean;
    canDrag: boolean;
    constructor();
    get titleType(): ProgressTitleType;
    set titleType(value: ProgressTitleType);
    get wholeNumbers(): boolean;
    set wholeNumbers(value: boolean);
    get min(): number;
    set min(value: number);
    get max(): number;
    set max(value: number);
    get value(): number;
    set value(value: number);
    update(): void;
    private updateWithPercent;
    protected constructExtension(buffer: ByteBuffer): void;
    protected handleSizeChanged(): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    private onGripTouchBegin;
    private onGripTouchMove;
    private onBarTouchBegin;
}

declare class GProgressBar extends GComponent {
    private _min;
    private _max;
    private _value;
    private _titleType;
    private _reverse;
    private _titleObject;
    private _aniObject;
    private _barObjectH;
    private _barObjectV;
    private _barMaxWidth;
    private _barMaxHeight;
    private _barMaxWidthDelta;
    private _barMaxHeightDelta;
    private _barStartX;
    private _barStartY;
    constructor();
    get titleType(): ProgressTitleType;
    set titleType(value: ProgressTitleType);
    get min(): number;
    set min(value: number);
    get max(): number;
    set max(value: number);
    get value(): number;
    set value(value: number);
    tweenValue(value: number, duration: number): GTweener;
    update(newValue: number): void;
    private setFillAmount;
    protected constructExtension(buffer: ByteBuffer): void;
    protected handleSizeChanged(): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class PopupMenu {
    protected _contentPane: GComponent;
    protected _list: GList;
    constructor(url?: string);
    dispose(): void;
    addItem(caption: string, callback?: (item?: GObject, evt?: Event) => void): GButton;
    addItemAt(caption: string, index: number, callback?: (item?: GObject, evt?: Event) => void): GButton;
    addSeperator(): void;
    getItemName(index: number): string;
    setItemText(name: string, caption: string): void;
    setItemVisible(name: string, visible: boolean): void;
    setItemGrayed(name: string, grayed: boolean): void;
    setItemCheckable(name: string, checkable: boolean): void;
    setItemChecked(name: string, checked: boolean): void;
    isItemChecked(name: string): boolean;
    removeItem(name: string): boolean;
    clearItems(): void;
    get itemCount(): number;
    get contentPane(): GComponent;
    get list(): GList;
    show(target?: GObject | null, dir?: PopupDirection | boolean): void;
    private onClickItem;
    private onClickItem2;
    private onDisplay;
}

declare class UIObjectFactory {
    static counter: number;
    static extensions: {
        [index: string]: new () => GComponent;
    };
    static loaderType: new () => GLoader;
    constructor();
    static setExtension(url: string, type: new () => GComponent): void;
    static setLoaderExtension(type: new () => GLoader): void;
    static resolveExtension(pi: PackageItem): void;
    static newObject(type: number | PackageItem, userClass?: new () => GObject): GObject;
}

declare class UIConfig {
    constructor();
    static defaultFont: string;
    static windowModalWaiting: string;
    static globalModalWaiting: string;
    static modalLayerColor: Color;
    static buttonSound: string;
    static buttonSoundVolumeScale: number;
    static horizontalScrollBar: string;
    static verticalScrollBar: string;
    static defaultScrollStep: number;
    static defaultScrollDecelerationRate: number;
    static defaultScrollBarDisplay: number;
    static defaultScrollTouchEffect: boolean;
    static defaultScrollBounceEffect: boolean;
    static popupMenu: string;
    static popupMenu_seperator: string;
    static loaderErrorSign: string;
    static tooltipsWin: string;
    static defaultComboBoxVisibleItemCount: number;
    static touchScrollSensitivity: number;
    static loaderAssetsBundleName: string;
    static touchDragSensitivity: number;
    static clickDragSensitivity: number;
    static bringWindowToFrontOnClick: boolean;
    static frameTimeForAsyncUIConstruction: number;
    static linkUnderline: boolean;
    static defaultUILayer: number;
}
declare function registerFont(name: string, font: Font | string, bundle?: AssetManager.Bundle): void;

declare class DragDropManager {
    private _agent;
    private _sourceData;
    private static _inst;
    static get inst(): DragDropManager;
    constructor();
    get dragAgent(): GObject;
    get dragging(): boolean;
    startDrag(source: GObject, icon: string | null, sourceData?: any, touchId?: number): void;
    cancel(): void;
    private onDragEnd;
}

declare class AsyncOperation {
    callback: (obj: GObject) => void;
    private _node;
    createObject(pkgName: string, resName: string): void;
    createObjectFromURL(url: string): void;
    cancel(): void;
    private internalCreateObject;
    private completed;
}

declare class TranslationHelper {
    static strings: {
        [index: string]: {
            [index: string]: string;
        };
    };
    static loadFromXML(source: string): void;
    static translateComponent(item: PackageItem): void;
}

declare class GearAnimation extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GearColor extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GearDisplay extends GearBase {
    pages: string[];
    private _visible;
    private _displayLockToken;
    protected init(): void;
    addLock(): number;
    releaseLock(token: number): void;
    get connected(): boolean;
    apply(): void;
}

declare class GearDisplay2 extends GearBase {
    pages: string[];
    condition: number;
    private _visible;
    protected init(): void;
    apply(): void;
    evaluate(connected: boolean): boolean;
}

declare class GearFontSize extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GearIcon extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GearText extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GTween {
    static catchCallbackExceptions: boolean;
    static to(start: number, end: number, duration: number): GTweener;
    static to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener;
    static to3(start: number, start2: number, start3: number, end: number, end2: number, end3: number, duration: number): GTweener;
    static to4(start: number, start2: number, start3: number, start4: number, end: number, end2: number, end3: number, end4: number, duration: number): GTweener;
    static toColor(start: number, end: number, duration: number): GTweener;
    static delayedCall(delay: number): GTweener;
    static shake(startX: number, startY: number, amplitude: number, duration: number): GTweener;
    static isTweening(target: any, propType?: any): Boolean;
    static kill(target: any, complete?: boolean, propType?: any): void;
    static getTween(target: any, propType?: any): GTweener;
}

declare enum EaseType {
    Linear = 0,
    SineIn = 1,
    SineOut = 2,
    SineInOut = 3,
    QuadIn = 4,
    QuadOut = 5,
    QuadInOut = 6,
    CubicIn = 7,
    CubicOut = 8,
    CubicInOut = 9,
    QuartIn = 10,
    QuartOut = 11,
    QuartInOut = 12,
    QuintIn = 13,
    QuintOut = 14,
    QuintInOut = 15,
    ExpoIn = 16,
    ExpoOut = 17,
    ExpoInOut = 18,
    CircIn = 19,
    CircOut = 20,
    CircInOut = 21,
    ElasticIn = 22,
    ElasticOut = 23,
    ElasticInOut = 24,
    BackIn = 25,
    BackOut = 26,
    BackInOut = 27,
    BounceIn = 28,
    BounceOut = 29,
    BounceInOut = 30,
    Custom = 31
}

declare class UBBParser {
    private _text;
    private _readPos;
    protected _handlers: {
        [index: string]: (tagName: string, end: boolean, attr: string) => string;
    };
    lastColor: string;
    lastSize: string;
    linkUnderline: boolean;
    linkColor: string;
    constructor();
    protected onTag_URL(tagName: string, end: boolean, attr: string): string;
    protected onTag_IMG(tagName: string, end: boolean, attr: string): string;
    protected onTag_Simple(tagName: string, end: boolean, attr: string): string;
    protected onTag_COLOR(tagName: string, end: boolean, attr: string): string;
    protected onTag_FONT(tagName: string, end: boolean, attr: string): string;
    protected onTag_SIZE(tagName: string, end: boolean, attr: string): string;
    protected getTagText(remove?: boolean): string;
    parse(text: string, remove?: boolean): string;
}

interface ITooltipView {
    /**
     * view
     */
    viewComponent: any;
    /**
     * 更新数据
     * @param data
     */
    update(data?: any): void;
    /**
     * 销毁
     */
    destroy(): void;
}

/**
 * tooltip管理器
 */
interface ITooltipManager {
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

declare class TooltipManager {
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

declare class SmartLoader extends GLoader {
    /**加载完成回调 */
    loadedCallback: (target: SmartLoader, err?: Error) => void;
    refKey: string;
    private __spriteFrame;
    private __resRequest;
    constructor();
    protected loadExternal(): void;
    protected freeExternal(texture: SpriteFrame): void;
}

export { AlignType, AsyncOperation, AutoSizeType, BlendMode, ButtonMode, ByteBuffer, ChildrenRenderOrder, Controller, DragDropManager, EaseType, FGUIEvent, FillMethod, FillOrigin, FlipType, GButton, GComboBox, GComponent, GGraph, GGroup, GImage, GLabel, GList, GLoader, GLoader3D, GMovieClip, GObject, GObjectPool, GProgressBar, GRichTextField, GRoot, GScrollBar, GSlider, GTextField, GTextInput, GTree, GTreeNode, GTween, GTweener, GearAnimation, GearBase, GearColor, GearDisplay, GearDisplay2, GearFontSize, GearIcon, GearLook, GearSize, GearText, GearXY, GroupLayoutType, Image, ListLayoutType, ListSelectionMode, LoaderFillType, MovieClip, ObjectPropID, ObjectType, OverflowType, PackageItem, PackageItemType, PopupDirection, PopupMenu, ProgressTitleType, RelationType, ScrollBarDisplayType, ScrollPane, ScrollType, SmartLoader, TooltipManager, Transition, TranslationHelper, UBBParser, UIConfig, UIObjectFactory, UIPackage, VertAlignType, Window, registerFont };
export type { Frame, ITooltipManager, ITooltipView, ListItemRenderer };
