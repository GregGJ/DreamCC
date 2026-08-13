import { GComponent, ITooltipManager, ITooltipView } from 'fairygui-cc';
import { EventDispatcher, ILoader, ResURL, Resource, Binder, Module, ResRequest, IEnginePlugin } from 'dream-cc-core';
import { Color, Node } from 'cc';

interface IAlert {
    /**
     * 显示一个警告框
     * @param msg       文本内容
     * @param title     标题
     * @param buttons   按钮文本
     * @param callback  点击按钮后的回调函数
     * @param buttonSkins 按钮皮肤
     */
    show(msg: string, title?: string, buttons?: string[], callback?: (btnIdx: number) => void, buttonSkins?: string[]): void;
}

declare class Alert {
    static KEY: string;
    /**
     * 显示一个警告框
     * @param msg
     * @param title
     * @param buttons
     * @param callback
     * @param buttonSkins
     */
    static show(msg: string, title?: string, buttons?: string[], callback?: (btnIdx: number) => void, buttonSkins?: string[]): void;
    private static __impl;
    static get impl(): IAlert;
}

/**
 * UI层接口
 */
interface ILayer {
    addChild(child: any): void;
    addChildAt(child: any, index: number): void;
    removeChild(child: any): void;
    removeChildAt(index: number): void;
    /**
     * 获取指定索引内容
     * @param index
     */
    getChildAt(index: number): any;
    /**
     * 当前层拥有的子对象数量
     */
    getCount(): number;
}

/**
 * 层管理器接口
 */
interface ILayerManager {
    /**
     * 添加层
     * @param key
     * @param layer
     */
    addLayer(key: string, layer: ILayer): void;
    /**
     * 删除层
     * @param key
     */
    removeLayer(key: string): void;
    /**
     * 获取层对象
     * @param key
     */
    getLayer(key: string): ILayer | undefined;
    /**
     * 获得所有层
     */
    getAllLayer(): ILayer[];
}

/**
 * 层级类
 */
declare class Layer extends GComponent implements ILayer {
    /**
     * 是否是全屏层
     */
    isFullScrene: boolean;
    /**
     * 开启记录
     */
    openRecord: Array<string>;
    constructor(name: string, isFullScrene?: boolean);
    getCount(): number;
}

/**
 * 层管理器
 */
declare class LayerManager {
    static KEY: string;
    /**
     * 添加一个层
     * @param key
     * @param layer
     */
    static addLayer(key: string, layer: ILayer): void;
    /**
     * 删除层
     * @param key
     */
    static removeLayer(key: string): void;
    /**
     * 获取层对象
     * @param key
     */
    static getLayer(key: string): ILayer | undefined;
    /**
     * 获得所有层
     */
    static getAllLayer(): ILayer[];
    private static __impl;
    private static get impl();
}

/**
 * 加载界面
 */
interface ILoadingView {
    /**
     * 更新
     * @param data
     */
    changeData(...args: any[]): void;
    /**
     * 显示
     */
    show(): void;
    /**
     * 隐藏
     */
    hide(): void;
}

/**
 * 加载界面
 */
declare class LoadingView {
    static KEY: string;
    static show(): void;
    static hide(): void;
    static changeData(...args: any[]): void;
    private static __impl;
    static get impl(): ILoadingView;
}

/**
 * 位置模式
 */
declare enum TooltipPosMode {
    Touch = 0,
    Left = 1,
    Right = 2
}

/**
 * 提示数据
 */
declare class ITooltipData {
    /**
     * 数据
     */
    data: any;
    /**
     * 提示类
     */
    tooltipType: string;
    /**
     * 显示位置模式
     */
    posMode: TooltipPosMode;
}

/**
 * tooltip 管理类
 */
declare class TooltipManagerImpl implements ITooltipManager {
    private __tooltipMap;
    private __currentTooltip;
    /**
     * 提示层
     */
    tooltipLayer: string;
    constructor();
    register(type: string, value: ITooltipView): void;
    unregister(type: string): void;
    show(data: ITooltipData): void;
    private __layout;
    hide(): void;
    get isShowing(): boolean;
}

/**
 * UI关联数据列表
 */
interface IRelationList {
    /**
     * 要显示的UI列表
     */
    show: Array<string>;
    /**
     * 要隐藏的UI列表
     */
    hide: Array<string>;
}

/**
 * UI关联数据
 */
interface IRelationInfo {
    /**
     * 显示时的关联
     */
    show: IRelationList;
    /**
     * 隐藏时的关联
     */
    hide: IRelationList;
}

/**
* GUI 关联关系
*/
declare class RelationManager {
    static DEBUG: boolean;
    private static __map;
    constructor();
    /**
     * 添加UI关联关系
     * @param key
     * @param value
     */
    static addRelation(key: string, value: IRelationInfo): void;
    static removeRelation(key: string): void;
    /**
     * 检测合法性
     * @param value
     */
    private static __checkValidity;
    static getRelation(key: string): IRelationInfo;
}

declare class FGUILoader extends EventDispatcher implements ILoader {
    url: ResURL;
    constructor();
    load(url: ResURL): void;
    private loadUIPackge;
    reset(): void;
}

declare class FGUIResource extends Resource {
    constructor();
    /**
     * 销毁
     */
    destroy(): boolean;
}

/**
 * 基础Mediator类
 */
declare class BaseMediator extends Binder {
    /**UI组件 */
    ui: GComponent | null;
    /**外部传参*/
    data: any;
    constructor();
    init(): void;
    tick(dt: number): void;
    show(data: any): void;
    showedUpdate(data?: any): void;
    hide(): void;
    /**
     * 根据名称或路径获取组件
     * @param path
     * @returns
     */
    getUIComponent(path: string): any;
}

/**
 * 界面状态
 */
declare enum GUIState {
    /**
     * 未使用状态
     */
    Null = 0,
    /**
     * 显示处理中
     */
    Showing = 1,
    /**
     * 已显示
     */
    Showed = 2,
    /**
     * 关闭处理中
     */
    Closeing = 3,
    /**
     * 已关闭
     */
    Closed = 4
}

/**
     * GUI 管理器
     */
declare class GUIManager {
    static KEY: string;
    /**
     * 在界面关闭后多长时间不使用则销毁(秒)
     */
    static GUI_GC_INTERVAL: number;
    /**
     * 注册
     * @param info
     * @returns
     */
    static register(info: {
        key: string;
    }): void;
    /**
     * 注销
     * @param key
     * @returns
     */
    static unregister(key: string): void;
    /**
     * 打开指定UI界面
     * @param key
     * @param data
     */
    static open(key: string, data?: any): void;
    /**
     * 关闭
     * @param key
     * @param checkLayer 是否检查全屏记录
     */
    static close(key: string, checkLayer?: boolean): void;
    /**
     * 关闭所有界面
     */
    static closeAll(): void;
    /**
     * 获取界面状态
     * @param key
     * @returns  0 未显示  1显示中
     */
    static getGUIState(key: string): GUIState;
    /**
     * 是否已打开或再打开中
     * @param key
     * @returns
     */
    static isOpen(key: string): boolean;
    /**
     * 获取GUI中的某个组件
     * @param key    界面全局唯一KEY
     * @param path   组件名称/路径
     */
    static getUIComponent(key: string, path: string): any;
    private static __impl;
    private static get impl();
}

interface IGUIInfo {
    /**
     * UI 全局唯一KEY
     */
    key: string;
    /**
     * 是否永久存在
     */
    permanence: boolean;
    /**
     * UI所在层
     */
    layer: string;
    /**
     * 是否使用遮罩
     */
    modal: boolean;
    /**
     * 点击蒙版时时候关闭界面
     */
    modalClose: boolean;
    /**
     * 资源包
     */
    bundleName: string;
    /**
     * UIPackage名称
     */
    packageName: string;
    /**
     * FGUI 组件名
     */
    comName: string;
    /**UI所属状态 */
    state: GUIState;
    /**
     * 遮罩是否全透明
     */
    maskAlpha: boolean;
}

interface IViewComponent {
    /**
     * 可见性
     */
    visible: boolean;
}

interface IGUIMediator {
    info: any;
    /**
     * 依赖的配置
     */
    configs: Array<string>;
    /**
     * 依赖的资源
     */
    assets: Array<ResURL>;
    /**
     * 依赖的模块
     */
    modules: Array<string>;
    /**
     * 是否显示进度条
     */
    showLoadingView: boolean;
    /**
     * 显示界面时是否关闭进度条
     */
    closeLoadingView: boolean;
    /**
     * 界面准备时汇报总比值
     */
    loadingViewTotalRatio: number;
    /**初始化完毕 */
    inited: boolean;
    /**
     * 显示节点
     */
    viewComponent: IViewComponent | null;
    /**
     * 播放显示动画
     * @param complete
     */
    playShowAnimation?: (complete: () => void) => void;
    /**
     * 界面关闭时播放的动画
     * @param complete
     */
    playHideAnimation?: (complete: () => void) => void;
    /**
     * 创建UI
     * @param info
     * @param created
     */
    createUI(info: any, created: Function): void;
    /**
     * 初始化
     */
    init(): void;
    /**
     * 心跳
     * @param dt
     */
    tick(dt: number): void;
    /**
     * 显示(内部接口，请勿调用)
     * @param data
     */
    show(data?: any): void;
    /**
     * 当已经处在显示中 GUIManager.call时 则调用该方法而不调用showedUpdate
     * @param data
     */
    showedUpdate(data?: any): void;
    /**
     * 隐藏(内部接口，请勿调用)
     * @param info
     */
    hide(): void;
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 获取组件
     * @param path
     */
    getUIComponent(path: string): any;
}

/**
 * 子UI 逻辑划分
 */
declare class SubGUIMediator extends BaseMediator {
    /**所属GUI*/
    owner: GUIMediator | null;
    constructor(ui: GComponent | null, owner: GUIMediator | null);
    /**
     * 子类必须在构造函数中调用
     */
    init(): void;
    show(data: any): void;
    hide(): void;
    destroy(): void;
}

interface ITabPage {
    /**
     * UI
     */
    ui: any;
    /**
     * 所属的Mediator
     */
    owner: any;
    /**
     * 初始化
     */
    init(): void;
    /**
     * 显示
     * @param data
     */
    show(data?: any): void;
    showedUpdate(data?: any): void;
    /**
     * 隐藏
     */
    hide(): void;
    /**
     * 销毁
     */
    destroy(): void;
}

/**
 * 页签容器组件
 */
declare class TabContainer extends Binder {
    /**Tab容器 */
    ui: GComponent;
    /**所属*/
    owner: any;
    private __pageInstanceMap;
    /**当前页签索引 */
    currentIndex: number;
    /**当前页签 */
    currentPage: ITabPage;
    /**页签创建函数*/
    private __createPage;
    private __showing;
    constructor(content: GComponent, createPage: (index: number) => ITabPage, owner: any);
    /**切换到某个页签 */
    switchPage(index: number, data?: any): void;
    init(): void;
    show(data?: any): void;
    showedUpdate(data?: any): void;
    hide(): void;
    private getPage;
    destroy(): void;
}

/**
 * UI逻辑类
 */
declare class GUIMediator extends BaseMediator implements IGUIMediator {
    info: IGUIInfo | null;
    /**依赖的配置表（构造函数中赋值）*/
    configs: Array<string>;
    /**依赖的资源（构造函数中赋值）*/
    assets: Array<ResURL>;
    /**依赖的模块（构造函数中赋值）*/
    modules: Array<string>;
    /**是否显示进度界面 */
    showLoadingView: boolean;
    /**显示界面时是否关闭进度条*/
    closeLoadingView: boolean;
    /**界面从开始加载到底层调用Show方法之前的进度总比值 */
    loadingViewTotalRatio: number;
    /**根节点 */
    viewComponent: GComponent | null;
    /**页签容器*/
    tabContainer: TabContainer;
    /**
     * 播放显示动画
     * @param complete
     */
    playShowAnimation?: (complete: () => void) => void;
    /**
     * 界面关闭时播放的动画
     * @param complete
     */
    playHideAnimation?: (complete: () => void) => void;
    /**遮罩 */
    private __mask;
    /**创建UI完成回调*/
    private __createdCallBack;
    /**子Mediator(用于代码拆分),记住只能在Init函数中赋值*/
    protected $subMediators: Array<SubGUIMediator>;
    constructor();
    /**
     * 创建UI
     * @param info
     * @param created
     */
    createUI(info: any, created: () => void): void;
    private __asyncCreator;
    private __createUI;
    private __uiCreated;
    protected _maskClickHandler(): void;
    init(): void;
    show(data?: any): void;
    showedUpdate(data?: any): void;
    hide(): void;
    /**
     * 关闭
     * @param checkLayer 是否检查全屏层记录
     */
    close(checkLayer?: boolean): void;
    tick(dt: number): void;
    /**
     * 获取模块
     * @param key
     * @returns
     */
    getModule(key: string): Module | undefined;
    destroy(): void;
}

/**
 * GUI代理，将资源加载和Mediator逻辑隔离开
 */
declare class GUIProxy {
    /**用于Creator创建器的统一帮助节点 */
    private static createNode;
    info?: IGUIInfo;
    /**GUI中介*/
    mediator?: IGUIMediator;
    /**关闭时间*/
    closeTime: number;
    /**数据 */
    data: any;
    /**引用的资源 */
    urls: Array<ResURL>;
    assetsRequest: ResRequest;
    /**是否在显示中*/
    private __showing;
    /**加载状态 */
    private __loadState;
    constructor(info: IGUIInfo);
    /**
     * 加载AssetBundle
     */
    private __loadAssetBundle;
    /**
     * AssetBundle加载完成
     */
    private __assetBundleLoaded;
    private __loadAssets;
    /**
     * 创建UI
     */
    private __create_ui;
    /**
     * UI创建完成回调
     */
    private __create_ui_callback;
    private __add_to_layer;
    tick(dt: number): void;
    show(data?: any): void;
    showedUpdate(data: any): void;
    private __show;
    private __showAnimationPlayed;
    hide(): void;
    private __hideAnimationPlayed;
    private __hide;
    destroy(): void;
    private getLayerChildCount;
    private get layer();
    /**
     * 获取组件
     * @param path
     */
    getComponent(path: string): any;
}

/**
 * UI管理器接口
 */
interface IGUIManager {
    /**
     * 注册
     * @param key
     * @param mediatorClass
     * @param data
     */
    register(info: {
        key: string;
    }): void;
    /**
     * 注销
     * @param key
     */
    unregister(key: string): void;
    /**
     * 心跳
     * @param dt
     */
    tick(dt: number): void;
    /**
     * 打开
     * @param key
     * @param data
     */
    open(key: string, data?: any): void;
    /**
     * 关闭
     * @param key
     * @param checkLayer  是否检查全屏打开记录
     */
    close(key: string, checkLayer: boolean): void;
    /**
     * 关闭所有
     * @param key
     */
    closeAll(): void;
    /**
     * 是否已打开
     * @param key
     * @returns
     */
    getState(key: string): GUIState;
    /**
     * 获取GUI中的某个组件
     * @param key    界面全局唯一KEY
     * @param path   组件名称/路径
     */
    getUIComponent(key: string, path: string): any;
    /**
     * 是否已打开或打开中
     * @param key
     */
    isOpen(key: string): boolean;
}

interface IViewCreator {
    /**
     * 创建Mediator
     */
    createMediator(): IGUIMediator;
}

declare class TabData {
    page?: number;
    pageData?: TabData;
}

declare class TabPage extends Binder implements ITabPage {
    /**
     * UI
     */
    ui: any;
    /**
     * 所属的Mediator
     */
    owner: any;
    constructor();
    init(): void;
    show(data?: any): void;
    showedUpdate(data?: any): void;
    hide(): void;
    destroy(): void;
}

/**
 * GUI插件
 */
declare class GUIPlugin extends EventDispatcher implements IEnginePlugin {
    /**
     * 名称
     */
    readonly name = "GUIPlugin";
    /**
     * UI资源包URL
     * @param packname
     * @param type
     * @param bundle
     * @returns
     */
    static uiPackageURL: (packname: string, type?: any, bundle?: string) => ResURL;
    /**UI遮罩颜色值 */
    static MaskColor: Color;
    /**透明遮罩颜色 */
    static AlphaMaskColor: Color;
    private __root;
    private __guiconfig?;
    private __layer?;
    private __assets?;
    private __fonts?;
    private __language?;
    /**
     * 初始化
     * @param root          fgui根节点
     * @param guiconfig     UI配置
     * @param layer         层级配置
     * @param assets        公共资源
     * @param fonts         字体
     * @param language      fgui多语言xml文件
     */
    init(root: Node, guiconfig: ResURL, layer?: {
        layers: Array<string>;
        fullScrene: Array<string>;
    }, assets?: Array<ResURL>, fonts?: Array<{
        name: string;
        url: ResURL;
    }>, language?: ResURL): void;
    start(): void;
    private __InitLayer;
    private __loadCommonAssets;
    private __loadFonts;
    private __initUI;
    /**
     * 加载FGUI语言包
     * @param url
     * @param p_progress
     * @param cb
     */
    private __loadLangenge;
    private parseXML;
    private __onError;
    private __allComplete;
}

export { Alert, BaseMediator, FGUILoader, FGUIResource, GUIManager, GUIMediator, GUIPlugin, GUIProxy, GUIState, IAlert, IGUIInfo, IGUIManager, IGUIMediator, ILayer, ILayerManager, ILoadingView, IRelationInfo, IRelationList, ITabPage, ITooltipData, IViewComponent, IViewCreator, Layer, LayerManager, LoadingView, RelationManager, SubGUIMediator, TabContainer, TabData, TabPage, TooltipManagerImpl, TooltipPosMode };
