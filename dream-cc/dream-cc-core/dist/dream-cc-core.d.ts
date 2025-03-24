import { Component, Node } from 'cc';

/**
 * 资源URL类型
 */
type ResURL = string | {
    url: string;
    type: any;
    bundle: string;
    isSub?: boolean;
    data?: any;
};

/**
 * 音频通道
 */
interface IAudioChannel {
    readonly isPlaying: boolean;
    readonly url: ResURL;
    readonly curVolume: number;
    /**
     * 音量
     */
    volume: number;
    mute: boolean;
    /**
     * 播放
     * @param url
     * @param playedComplete
     * @param volume
     * @param fade
     * @param loop
     * @param speed
     */
    play(url: ResURL, playedComplete: () => void, volume: number, fade: {
        time: number;
        startVolume: number;
        complete?: Function;
    }, loop: boolean, speed: number): void;
    /**
     * 停止
     */
    stop(): void;
    /**
     * 淡入
     * @param time          过度时间(秒为单位)
     * @param startVolume
     * @param endVolume
     * @param complete
     * @param completeStop  结束后是否停止播放
     */
    fade(time: number, endVolume: number, startVolume?: number, complete?: Function, completeStop?: boolean): void;
    /**
     * 心跳
     * @param dt
     */
    tick(dt: number): void;
    /**
     * 暂停
     */
    pause(): void;
    /**
     * 继续播放
     */
    resume(): void;
}

/**
 * 音频管理器
 */
declare class AudioManager {
    /**
     * 全局唯一注入KEY
     */
    static KEY: string;
    /**
     * 最大音频轨道数量
     */
    static MAX_SOUND_CHANNEL_COUNT: number;
    /**
     * 总音量
     */
    static get volume(): number;
    static set volume(value: number);
    /**
     * 音乐音量
     */
    static get musicVolume(): number;
    static set musicVolume(value: number);
    /**
     * 声音音量
     */
    static get soundVolume(): number;
    static set soundVolume(value: number);
    /**
     * 静音总开关
     */
    static get mute(): boolean;
    static set mute(value: boolean);
    /**
     * 音乐静音开关
     */
    static get muteMusic(): boolean;
    static set muteMusic(value: boolean);
    /**
     * 声音静音开关
     */
    static get muteSound(): boolean;
    static set muteSound(value: boolean);
    /**
     * 播放音乐
     * @param value
     */
    static playMusic(url: ResURL, volume?: number, speed?: number): void;
    /**
     * 停止音乐
     */
    static stopMusic(): void;
    /**
     * 暂停
     */
    static pauseMusic(): void;
    /**
     * 继续播放
     */
    static resumeMusic(): void;
    /**
     * 播放声音
     * @param value
     */
    static playSound(url: ResURL, playedCallBack?: () => void, volume?: number, speed?: number, loop?: boolean): void;
    /**
     * 获取正在播放指定音频的轨道
     * @param url
     */
    static getPlaying(url: ResURL): IAudioChannel;
    private static __impl;
    private static get impl();
}

/**
 * 音频组
 */
interface IAudioGroup {
    key: number;
    volume: number;
    mute: boolean;
    calculateVolume(): void;
    calculateMute(): void;
    tick(dt: number): void;
    play(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;
    getPlayingChannel(url: ResURL): IAudioChannel;
    stopAll(): void;
}

/**
 * 音频管理器
 */
interface IAudioManager {
    /**
     * 总音量
     */
    volume: number;
    /**
     * 音乐音量
     */
    musicVolume: number;
    /**
     * 声音音量
     */
    soundVolume: number;
    mute: boolean;
    muteMusic: boolean;
    muteSound: boolean;
    /**
     * 播放音乐
     * @param value
     */
    playMusic(url: ResURL, volume: number, speed: number): void;
    /**
     * 停止音乐
     */
    stopMusic(): void;
    /**
     * 暂停
     */
    pauseMusic(): void;
    /**
     * 继续播放
     */
    resumeMusic(): void;
    /**
     * 播放声音
     * @param value
     */
    playSound(url: ResURL, playedCallBack: () => void, volume: number, speed: number, loop: boolean): void;
    /**
     * 获取正在播放指定音频的轨道
     * @param url
     */
    getPlaying(url: ResURL): IAudioChannel;
}

/**
 * 可销毁对象的接口。
 * 实现此接口的类应提供一个 destroy 方法，用于执行对象销毁时的清理操作。
 */
interface IDestroyable {
    /**
     * 销毁对象，执行必要的清理操作。
     */
    destroy(): boolean;
}

/**
 * 可重用对象接口
 */
interface IPoolable extends IDestroyable {
    /**
     * 重置对象到初始状态
     */
    reset(): void;
}

/**
 * 处理器
 */
declare class Handler implements IPoolable {
    method?: Function;
    caller: any;
    constructor();
    reset(): void;
    destroy(): boolean;
    /**
     * 运行
     * @param args
     */
    run(...args: any[]): any;
    /**
     * 判断是否相同
     * @param value
     * @returns
     */
    equal(value: Handler): boolean;
    /**
     * 判断是否相同
     * @param method
     * @param caller
     * @returns
     */
    equals(method: Function, caller?: any): boolean;
}

/**
 * 绑定工具类
 */
declare class Binder {
    /**属性绑定记录 */
    private __bindRecords;
    /**方法绑定记录 */
    private __hookRecords;
    /**需要注册和删除的事件*/
    private __eventRecords;
    /**初始化标记 */
    inited: boolean;
    constructor();
    init(): void;
    /**
     * 数据绑定
     * @param source
     * @param property
     * @param targetOrCallBack
     * @param tPropertyKeyOrCaller
     */
    private __bind;
    /**
     * 取消绑定
     * @param source
     * @param property
     * @param targetOrCallBack
     * @param tPropertyKeyOrCaller
     */
    private __unbind;
    /**
     * 添加函数钩子
     * @param source
     * @param functionName
     * @param preHandles
     * @param laterHandlers
     */
    private __addHook;
    /**
     * 删除函数钩子
     * @param source
     * @param functionName
     * @param preHandle
     * @param laterHandler
     */
    private __removeHook;
    /**
     * 属性和属性的绑定
     * @param source            数据源
     * @param property          数据源属性名
     * @param target            目标对象
     * @param targetProperty    目标对象属性名
     */
    bindAA(source: any, property: string, target: any, targetProperty: string): void;
    /**
     * 取消属性和属性的绑定
     * @param source
     * @param property
     * @param target
     * @param targetProperty
     */
    unbindAA(source: any, property: string, target: any, targetProperty: string): void;
    /**
     * 属性和函数的绑定
     * @param source
     * @param property
     * @param callBack
     * @param caller
     */
    bindAM(source: any, property: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void;
    /**
     * 取消属性和函数的绑定
     * @param source
     * @param propertys
     * @param callBack
     * @param caller
     */
    unbidAM(source: any, propertys: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void;
    /**
     * 函数和函数的绑定
     * @param source
     * @param functionName  目标函数
     * @param preHandle     该函数将在目标函数调用前调用
     * @param laterHandler  该函数将在目标函数调用后调用
     */
    bindMM(source: any, functionName: string, preHandle: Handler, laterHandler?: Handler): void;
    /**
     * 取消方法和方法的绑定关系
     * @param source
     * @param functionName
     * @param preHandle
     * @param laterHandler
     */
    unbindMM(source: any, functionName: string, preHandle: Handler, laterHandler: Handler): void;
    /**
     * 绑定事件
     * @param target
     * @param type
     * @param handler
     * @param caller
     */
    bindEvent(target: any, type: number | string, handler: Function, caller: any): void;
    /**
     * 取消事件绑定
     * @param target
     * @param type
     * @param handler
     * @param caller
     */
    unbindEvent(target: any, type: number | string, handler: Function, caller: any): void;
    bindByRecords(): void;
    unbindByRecords(): void;
    /**
     * 销毁
     */
    destroy(): void;
}

declare class FunctionHook {
    data: any;
    /**
     * 已添加好钩子的方法
     */
    private __functions;
    private __preHandlerMap;
    private __laterHandlerMap;
    private __groupMap;
    constructor(data: any);
    /**
     * 添加钩子
     * @param group
     * @param functionName
     * @param preHandlers
     * @param laterHandlers
     */
    addHook(group: any, functionName: string, preHandler: Handler, laterHandler: Handler): void;
    /**
     * 删除钩子
     * @param group
     * @param functionName
     * @param preHandler
     * @param laterHandler
     * @returns
     */
    removeHook(group: any, functionName?: string, preHandler?: Handler, laterHandler?: Handler): void;
}

/**
 * 属性绑定器
 */
declare class PropertyBinder {
    data: any;
    /**
     * 代理过的数据
     */
    private __propertys;
    /**
     * 属性改变列表
     */
    private __changedPropertys;
    private __bindedMap;
    private __bindedGroupMap;
    constructor(data: any);
    /**
     * 绑定
     * @param group
     * @param property
     * @param targetOrCallBack
     * @param tPropertyOrCaller
     * @returns
     */
    bind(group: any, property: string | Array<string>, targetOrCallBack: any | Function, tPropertyOrCaller: string | any): void;
    /**
     * 取消绑定
     * @param group
     * @param property
     * @param targetOrCallBack
     * @param tPropertyOrCaller
     * @returns
     */
    unbind(group: any, property?: string | Array<string>, targetOrCallBack?: any | Function, tPropertyOrCaller?: string | any): void;
    /**
    * 检测属性
    * @param propertyKey
    */
    private __checkProperty;
    /**定义 */
    private __defineReactive;
    private __propertyChanged;
    private __nextFramePropertyUpdate;
    /**
     * 属性更新
     * @param pKey
     */
    private __updateProperty;
}

/**
 * 配置存取器接口
 */
interface IConfigAccessor {
    /**
     * 表名
     */
    sheetName: string;
    /**
     * 保存
     * @param value
     */
    save(value: any): boolean;
    /**
     * 获取所有元素
     */
    getElements<T>(): Array<T>;
    /**
     * 清理
     */
    destroy(): void;
}

/**
 * 配置存储器
 */
declare class ConfigStorage {
    key: string;
    keys: Array<string>;
    map: Map<string, any>;
    constructor(keys: Array<string>);
    save(value: any, sheet: string): void;
    get<T>(key: string): T | undefined;
    destroy(): void;
}

/**
 * 配置存取器基类
 */
declare class BaseConfigAccessor implements IConfigAccessor {
    /**
     * 表名
     */
    sheetName: string;
    protected $configs: Array<any>;
    protected $storages: Map<string, ConfigStorage>;
    constructor();
    /**
    * 子类构造函数中调用，增加存储方式
    * @param keys
    */
    protected addStorage(keys: Array<string>): void;
    save(value: any): boolean;
    /**
     * 通过单key单值获取项内容
     * @param key
     * @param value
     * @returns
     */
    getOne<T>(key: string, value: any): T;
    /**
      * 获取
      * @param keys
      * @param values
      * @returns
      */
    get<T>(keys?: Array<string>, values?: Array<any>): T | undefined;
    /**
     * 获取存储器
     * @param keys
     * @returns
     */
    getStorage(keys: Array<string>): ConfigStorage | undefined;
    /**
     * 获取
     * @param key
     * @param value
     * @returns
     */
    getElements<T>(): Array<T>;
    destroy(): void;
}

/**
 * 以id为key的配置存储器
 */
declare class IDConfigAccessor extends BaseConfigAccessor {
    constructor();
    /**
     * 通过ID获取配置项内容
     * @param id
     * @returns
     */
    getByID<T>(id: number): T;
}

/**
 * 事件类型
 */
type EventType$1 = number | string;

/**
 * 事件派发器接口
 */
interface IEventDispatcher extends IDestroyable {
    /**
     * 添加事件
     * @param type
     * @param caller
     * @param handler
     * @param priority 优先级 数字越小优先级越高
     */
    on(type: EventType$1, handler: (e: Event) => void, caller?: any, priority?: number): void;
    /**
     * 删除事件监听
     * @param type
     * @param caller
     * @param handler
     */
    off(type: EventType$1, handler: (e: Event) => void, caller?: any): void;
    /**
     * 删除指定对象所有的事件处理
     * @param caller
     */
    offByCaller(caller: any): void;
    /**
     * 删除所有事件监听
     */
    offAllEvent(): void;
    /**
     * 派发事件
     * @param type 事件类型
     * @param data 事件数据
     * @param err  错误信息
     * @param progress 进度信息(0-1)
     */
    emit(type: EventType$1, data?: any, err?: Error, progress?: number): void;
    /**
     * 是否有事件监听
     * @param type
     */
    hasEvent(type: EventType$1): boolean;
    /**
     * 是否包含指定函数事件监听
     * @param type
     * @param caller
     * @param handler
     */
    hasEventHandler(type: EventType$1, handler: (e: Event) => void, caller?: any): boolean;
}

/**
 * 事件对象
 */
declare class Event implements IPoolable {
    static readonly START: string;
    static readonly PROGRESS: string;
    static readonly COMPLETE: string;
    static readonly ERROR: string;
    static readonly SHOW: string;
    static readonly HIDE: string;
    static readonly ADD: string;
    static readonly REMOVE: string;
    static readonly UPDATE: string;
    static readonly CLEAR: string;
    static readonly STATE_CHANGED: string;
    static readonly VALUE_CHANGED: string;
    static readonly ADD_CHILD: string;
    static readonly REMOVE_CHILD: string;
    static readonly CHILD_VALUE_CHANGED: string;
    /**
     * 事件类型
     */
    type?: EventType$1;
    /**
     * 事件派发对象
     */
    target?: IEventDispatcher;
    /**
     * 事件数据
     */
    data?: any;
    /**
     * 错误信息
     */
    error?: Error;
    /**
     * 进入百分比(0-1)
     */
    progress: number;
    /**
     * 事件是否停止
     */
    propagationStopped: boolean;
    constructor();
    /**
     * 初始化
     * @param type
     * @param taraget
     * @param data
     * @param err
     * @param progress
     */
    init(type: EventType$1, taraget: IEventDispatcher, data?: any, err?: Error, progress?: number): void;
    reset(): void;
    destroy(): boolean;
    release(): void;
    /**
     * 创建事件对象
     * @param type
     * @param target
     * @param data
     * @param err
     * @param progress
     * @returns
     */
    static create(type: EventType$1, target: IEventDispatcher, data?: any, err?: Error, progress?: number): Event;
}

/**
 * 事件派发器
 */
declare class EventDispatcher implements IEventDispatcher {
    /**
     * 全局事件派发起
     */
    static Main: EventDispatcher;
    /**
     * 事件是否异步处理
     */
    eventAync: boolean;
    /**
     * 需要派发的事件
     */
    private __needEmit;
    private __listeners;
    private __callers;
    private __target;
    constructor(target?: IEventDispatcher);
    /**
     * 添加事件监听
     * @param type      事件类型
     * @param handler   事件回调函数
     * @param caller    回调函数this指针
     * @param priority  优先级
     */
    on(type: EventType$1, handler: (e: Event) => void, caller?: any, priority?: number): void;
    /**
     * 删除事件监听
     * @param type      事件类型
     * @param handler   事件回调函数
     * @param caller    回调函数this指针
     * @returns
     */
    off(type: EventType$1, handler: (e: Event) => void, caller?: any): void;
    /**
     * 删除指定对象所有的事件监听
     * @param caller
     * @returns
     */
    offByCaller(caller: any): void;
    /**
     * 删除所有事件监听
     */
    offAllEvent(): void;
    /**
     * 派发事件
     * @param type
     * @param data
     * @param err
     * @param progress
     * @param url
     * @returns
     */
    emit(type: EventType$1, data?: any, err?: Error, progress?: number): void;
    private __emitHelp;
    private __emit;
    hasEvent(type: EventType$1): boolean;
    hasEventHandler(type: EventType$1, handler: (e: Event) => void, caller: any): boolean;
    destroy(): boolean;
}

/**
 * 加载器接口
 * @event Event.COMPLETE 加载完成
 * @event Event.ERROR 加载错误
 * @event Event.PROGRESS 加载进度
 */
interface ILoader extends IEventDispatcher, IPoolable {
    /**
     * 加载
     * @param url
     */
    load(url: ResURL): void;
}

declare class LocalConfigLoader extends EventDispatcher implements ILoader {
    private __url;
    constructor();
    load(url: ResURL): void;
    private __load;
    private __parseConfig;
    reset(): void;
}

/**
 * 远程配置加载器
 */
declare class RemoteConfigLoader extends EventDispatcher implements ILoader {
    /**
     * 强制加载最新版本
     */
    static force: boolean;
    url?: ResURL;
    constructor();
    load(url: ResURL): void;
    private __parseConfig;
    reset(): void;
}

/**
 * 配置表管理器
 */
declare class ConfigManager {
    static KEY: string;
    /**
      * 注册存取器
      * @param sheet
      * @param accessors
      */
    static register(sheet: string, accessors: new () => IConfigAccessor): void;
    /**
     * 注销
     * @param sheet
     */
    static unregister(sheet: string): void;
    /**
     * 获取存取器类
     * @param sheet
     * @returns
     */
    static getAccessorClass(sheet: string): new () => IConfigAccessor;
    /**
     * 获取配置存取器
     * @param sheet
     */
    static getAccessor(sheet: string): IConfigAccessor;
    private static __impl;
    private static get impl();
}

/**
 * 配置管理器接口
 */
interface IConfigManager {
    /**
     * 注册存取器
     * @param sheet
     * @param accessors
     */
    register(sheet: string, accessors: new () => IConfigAccessor): void;
    /**
     * 注销
     * @param sheet
     */
    unregister(sheet: string): void;
    /**
     * 获取存取器类
     * @param sheet
     */
    getAccessorClass(sheet: string): new () => IConfigAccessor;
    /**
     * 获取配置存取器
     * @param sheet
     */
    getAccessor(sheet: string): IConfigAccessor;
}

/**
 * 字典
 */
declare class Dictionary<TKey, TValue> extends EventDispatcher {
    private __map;
    private __list;
    constructor();
    /**
     * 设置
     * @param key
     * @param value
     */
    set(key: TKey, value: TValue): void;
    /**
     * 是否拥有指定KEY的元素
     * @param key
     * @returns
     */
    has(key: TKey): boolean;
    /**
     * 获取指定元素
     * @param key
     * @returns
     */
    get(key: TKey): TValue | undefined;
    /**
     * 通过索引获取元素
     * @param index
     * @returns
     */
    getValue(index: number): TValue | undefined;
    /**
     * 删除指定元素
     * @param key
     * @returns
     */
    delete(key: TKey): TValue | undefined;
    /**
     * 清除所有元素
     */
    clear(): void;
    getKeys(result?: Array<TKey>): Array<TKey>;
    /**
    * 元素列表
    */
    get elements(): Array<TValue>;
    get size(): number;
    destroy(): boolean;
}

/**
 * 列表
 */
declare class List<T> extends EventDispatcher {
    private __element;
    /**
     * 是否保证元素的唯一性
     */
    private __only;
    /**
     * 元素数量(内部再增删时会修改这个参数，外部只做计算和绑定使用，切记不可做赋值操作！)
     */
    count: number;
    constructor(only?: boolean);
    /**
     * 添加到末尾(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     */
    push(value: T): boolean;
    /**
     * 添加到列表头部(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     * @returns
     */
    unshift(value: T): boolean;
    /**
     * 获取并删除最后一个元素
     * @returns
     */
    pop(): T;
    /**
     * 获取并删除第一个元素
     * @returns
     */
    shift(): T;
    /**
     * 删除指定索引的元素
     * @param index
     */
    removeAt(index: number): T;
    /**
     * 删除元素
     * @param value
     */
    remove(value: T): void;
    /**
     * 移除所有元素
     */
    clear(): void;
    /**
     * 判断是否包含
     * @param value
     * @returns
     */
    has(value: T): boolean;
    /**
     * 查找元素下标
     * @param value
     * @returns
     */
    find(value: T): number;
    /**
     * 查找元素下标
     * @param predicate
     * @returns
     */
    findIndex(predicate: (value: T, index: number, obj: T[]) => unknown): number;
    /**
     * 获取指定元素
     * @param index
     * @returns
     */
    get(index: number): T;
    /**
     * 源列表数据(注意不要直接进行增删操作，而是通过List.push....等接口进行操作)
     */
    get elements(): Array<T>;
}

declare class ChangedData {
    key: string;
    newValue: any;
    oldValue: any;
    constructor();
    static create(newValue?: any, oldValue?: any, key?: string): ChangedData;
}

interface IDeserialization {
    /**
     * 反序列化
     * @param target
     * @param data
     */
    decode(target: any, data: any): void;
}

interface ISerialization {
    /**
     * 序列化
     * @param target
     * @param data
     */
    encode(target: any, data: any): any;
}

/**
 * 序列化和反序列化模式
 */
declare enum SerDesMode {
    /**
     * JSON模式
     */
    JSON = 0
}

/**
 * 序列化和反序列化
 */
declare class SerDes {
    private static __serMap;
    private static __desMap;
    private static __inited;
    private static init;
    /**
     * 添加序列化器
     * @param type
     * @param ser
     */
    static addSer(type: SerDesMode, ser: ISerialization): void;
    /**
     * 添加反序列化器
     * @param type
     * @param des
     */
    static addDes(type: SerDesMode, des: IDeserialization): void;
    static getSerialization(type: SerDesMode): ISerialization;
    static getDeserialization(type: SerDesMode): IDeserialization;
}

declare class JSONDeserialization implements IDeserialization {
    /**
     * 解码
     * @param target
     * @param data
     */
    decode(target: any, data: any): void;
}

/**
 * 值接口
 */
interface ISerDesValue extends IEventDispatcher {
    /**
     * 值对象（用于绑定）
     */
    value: any;
    /**
     * 获取值
     */
    getValue(): any;
    /**
     * 设置值
     * @param value
     */
    setValue(value: any): void;
    /**
     * 对比函数
     * @param value
     */
    equality(value: ISerDesValue): boolean;
    /**
     * 编码
     * @param mode
     * @param data
     */
    encode(mode: SerDesMode, data: any): any;
    /**
     * 解码
     * @param mode
     * @param data
     */
    decode(mode: SerDesMode, data: any): void;
}

/**
 * 值抽象类
 */
declare class BaseValue extends EventDispatcher implements ISerDesValue {
    value: any;
    constructor();
    getValue(): any;
    setValue(value: any): void;
    protected sendEvent(newValue: any, oldValue: any): void;
    /**
     * 检测值是否合法
     * @param value
     */
    protected checkValue(value: any): boolean;
    /**
     * 反序列化
     * @param type
     * @param data
     */
    decode(type: number, data: any): void;
    /**
     * 序列化
     * @param type
     * @param data
     * @returns
     */
    encode(type: number, data?: any): any;
    equality(value: ISerDesValue): boolean;
}

/**
 * 数组型数值
 */
declare class ArrayValue extends BaseValue {
    constructor();
    protected checkValue(value: any): boolean;
    /**
     * 添加到指定位置
     * @param index
     * @param value
     */
    addAt(index: number, value: ISerDesValue): void;
    /**
     * 删除
     * @param value
     */
    remove(value: ISerDesValue): void;
    /**
     * 通过索引删除并返回元素
     * @param index
     */
    removeAt(index: number): ISerDesValue;
    /**
     * 添加到末尾
     * @param value
     */
    push(value: ISerDesValue): void;
    /**
     * 添加到头部
     * @param value
     */
    unshift(value: ISerDesValue): void;
    /**
     * 删除并返回第一个元素
     */
    shift(): ISerDesValue;
    /**
    * 删除并返回最后一个元素
    */
    pop(): ISerDesValue;
    /**
     * 通过索引获取元素
     * @param index
     */
    getAt(index: number): ISerDesValue;
    /**
     * 获取索引值
     * @param value
     */
    getChildIndex(value: ISerDesValue): number;
    /**
     * 检测时候包含该内容
     * @param value
     */
    contains(value: ISerDesValue): boolean;
    /**
     * 对比
     * @param value
     */
    equality(value: ISerDesValue): boolean;
    private childValueChanged;
    /**
     * 清除
     */
    clear(): void;
    /**
     * 列表长度
     */
    get length(): number;
    /**
     * 内容
     */
    get elements(): Array<ISerDesValue>;
}

/**
 * 属性接口
 */
interface ISerDesProperty extends ISerDesValue {
    /**
     * 属性KEY
     */
    key: string;
}

declare class ArrayProperty extends ArrayValue implements ISerDesProperty {
    key: string;
    constructor(key?: string, value?: any);
    protected sendEvent(newValue: any, oldValue: any): void;
    /**
     * 判断某个子内容的某个属性相同则返回true
     */
    containProperty(value: ISerDesProperty): Boolean;
}

/**
 * 对象类型数据
 */
declare class DictionaryValue extends BaseValue {
    constructor();
    /**
     * 添加属性
     * @param value
     */
    add(value: ISerDesProperty): ISerDesValue;
    /**
     * 删除属性
     * @param value
     */
    remove(value: ISerDesProperty): void;
    /**
     * 通过属性key删除并返回
     * @param key
     */
    removeByKey(key: string): ISerDesValue;
    /**
     * 查询是否存在
     * @param key
     * @returns
     */
    has(key: string): boolean;
    /**
     * 更新属性
     * @param key
     * @param data
     */
    update(key: string, data: any): void;
    /**
     * 更新多项属性
     * @param keys
     * @param values
     */
    multUpdate(keys: Array<string>, values: Array<any>): void;
    /**
     * 获取属性
     * @param key
     */
    get(key: string): ISerDesValue;
    /**
     * 对比
     * @param value
     */
    equality(value: ISerDesValue): boolean;
    /**
     * 清除
     */
    clear(): void;
    private childValueChanged;
    get elements(): Array<ISerDesValue>;
    private get map();
}

declare class DictionaryProperty extends DictionaryValue implements ISerDesProperty {
    key: string;
    constructor(key?: string, value?: any);
    protected sendEvent(newValue: any, oldValue: any): void;
}

/**
 * 数值类型值
 */
declare class NumberValue extends BaseValue {
    constructor();
    protected checkValue(value: any): boolean;
}

declare class NumberProperty extends NumberValue implements ISerDesProperty {
    key: string;
    constructor(key?: string, value?: any);
    protected sendEvent(newValue: any, oldValue: any): void;
}

/**
 * 字符串类型值
 */
declare class StringValue extends BaseValue {
    constructor();
    protected checkValue(value: any): boolean;
}

declare class StringProperty extends StringValue implements ISerDesProperty {
    key: string;
    constructor(key?: string, value?: any);
    protected sendEvent(newValue: any, oldValue: any): void;
}

declare class JSONSerialization implements ISerialization {
    /**
     * 编码
     * @param target
     * @param data
     * @returns
     */
    encode(target: any, data: any): any;
}

interface IRedPointData {
    /**
     * 全局唯一ID
     */
    id: number;
    children: Array<number | IRedPointData>;
}

/**
 * 心跳接口
 */
interface ITicker {
    /**
     * 心跳函数
     * @param dt
     */
    tick(dt: number): void;
}

/**
 * 红点节点
 */
declare class RedPointNode extends EventDispatcher {
    id: number;
    parent: RedPointNode | null;
    private __children;
    private __isActive;
    constructor(id: number);
    /**
     * 添加子节点
     * @param node
     */
    addChild(node: RedPointNode): void;
    /**
     * 删除子节点
     * @param node
     */
    removeChild(node: RedPointNode): void;
    get children(): RedPointNode[];
    set isActive(value: boolean);
    /**
     * 子节点改变
     */
    childrenChanged(): void;
    private __childrenChanged;
    get isActive(): boolean;
}

/**
 * 功能开放配置数据接口
 */
interface IFuncConfig {
    id: number;
    parent: number;
}

declare class RedPoint implements ITicker {
    /**每帧运行检测器数量 */
    static FRAME_RUN_COUNT: number;
    private __redPoints;
    private __detectors;
    private __waiting;
    private __frameRunList;
    constructor();
    tick(dt: number): void;
    /**
     * 注册红点检测器(内部接口，开发时请使用Module上的registerRedPoint方法)
     * @param id
     * @param detector
     */
    register(id: number, detector: () => boolean): void;
    /**
     * 注销红点检测器
     * @param id
     */
    unregister(id: number): void;
    /**
     * 请求检测
     * @param id
     */
    request(id: number): void;
    /**
     * 初始化红点结构体
     * @param config
     */
    createByConfig(configs: Array<IFuncConfig>): void;
    /**
     * 通过数据创建节点
     * @param data
     * @returns
     */
    createByData(data: IRedPointData): RedPointNode;
    /**
     * 创建节点
     * @param id
     * @param children
     * @returns
     */
    create(id: number, children: Array<number>): RedPointNode;
    /**
     * 创建叶子节点
     * @param id
     * @returns
     */
    private __createNode;
    /**
     * 检测循环引用
     * @param node
     * @param parents
     */
    checkCircularReference(node: RedPointNode, parents: Array<number>): void;
    /**
     * 获取红点节点
     * @param id
     * @returns
     */
    getNode(id: number): RedPointNode;
    private static __instance;
    static get single(): RedPoint;
}

/**
 * 功能开放服务器数据接口
 */
interface IFuncData {
    id: number;
}

/**
 * 功能开放叶子节点
 */
declare class FuncNode extends EventDispatcher {
    id: number;
    parent: FuncNode;
    config: IFuncConfig;
    server: IFuncData;
    private __isActive;
    private __children;
    constructor(id: number);
    addChild(node: FuncNode): void;
    removeChild(node: FuncNode): void;
    get children(): FuncNode[];
    update(server: IFuncData): void;
    set isActive(value: boolean);
    get isActive(): boolean;
}

/**
 * 功能开放
 */
declare class Func extends EventDispatcher {
    /**
     * 节点检测函数
     */
    checkFunc: (value: FuncNode) => boolean;
    private __funcs;
    constructor();
    /**
     * 初始化
     * @param configs
     */
    init(configs: Array<IFuncConfig>): void;
    /**
     * 更新
     * @param server
     */
    update(server: IFuncData | Array<IFuncData>): void;
    private __update;
    /**
     * 检测循环引用
     * @param node
     * @param parents
     */
    private __checkCircularReference;
    /**
     * 创建节点
     * @param id
     * @param config
     * @returns
     */
    private __createNode;
    /**
     * 获取功能节点
     * @param id
     */
    getNode(id: number): FuncNode;
    private static __instance;
    static get single(): Func;
}

/**
 * 引擎插件
 */
interface IEnginePlugin extends IEventDispatcher {
    /**
     * 插件名称
     */
    readonly name: string;
    /**
     * 初始化
     * @param args
     */
    init(...args: any[]): void;
    /**
     * 启动（派发Event.PROGRESS/Event.Error/Event.COMPONENT 来通知引擎，告知启动状态）
     */
    start(): void;
}

interface ILogger {
    /**
     * 设置显示过滤器，默认显示所有日志类型。
     * @param type
     * @param isOpen
     */
    show(type: string, isOpen: boolean): void;
    /**
     * 设置保存过滤器，默认不保存日志。
     * @param type
     * @param isSave
     */
    save(type: string, isSave: boolean): void;
    /**
     * 通过类型获取已保存的日志列表。
     * @param type
     */
    getLogs(type?: string): Array<string> | undefined;
    /**
     * 打印日志信息。
     * @param msg
     * @param type
     */
    log(msg: any, type?: string): void;
    /**
     * 打印错误信息。
     * @param msg
     * @param type
     */
    error(msg: any, type?: string): void;
    /**
     * 打印警告信息。
     * @param msg
     * @param type
     */
    warn(msg: any, type?: string): void;
    /**
     * 打印信息。
     * @param msg
     * @param type
     */
    info(msg: any, type?: string): void;
}

declare enum LogType {
    ALL = "all",
    NET = "net",
    RES = "res",
    Module = "module"
}
/**
 * 日志系统
 */
declare class Logger {
    /**
     * 日志类型
     */
    static TYPE: typeof LogType;
    static KEY: string;
    /**
     * 最大保存条数
     */
    static MaxCount: number;
    /**
     * 设置显示过滤
     * @param key
     * @param isOpen
     */
    static show(type: string, isOpen: boolean): void;
    /**
     * 设置保存过滤
     * @param type
     * @param isSave
     */
    static save(type: string, isSave: boolean): void;
    /**
     * 获取已保存的日志
     * @param type
     * @returns
     */
    static getLogs(type?: string): Array<string> | undefined;
    static log(msg: any, type?: string): void;
    static error(msg: any, type?: string): void;
    static warn(msg: any, type?: string): void;
    static info(msg: any, type?: string): void;
    private static __impl;
    private static get impl();
}

declare class ResRef implements IPoolable {
    /**
     * 资源全局唯一KEY
     */
    key: string;
    /**
     * 谁引用的
     */
    refKey: string;
    /**
     * 资源内容
     */
    content: any;
    private __isDisposed;
    constructor();
    reset(): void;
    /**
     * 是否已经释放
     */
    get isDisposed(): boolean;
    /**
     * 释放
     */
    dispose(): void;
    /**
     * 彻底销毁(内部接口，请勿调用)
     */
    destroy(): boolean;
}

declare enum State {
    ERROR = 0,
    SUCCESS = 1,
    LOADING = 2,
    POOL = 3
}
/**
 * 资源请求
 * @example
 *
 * if(this.request){
 *     this.request.dispose();
 *     this.request = null;
 * }
 * this.request = Res.create(
 *      url,
 *      refKey,
 *      (progress:number)=>{
 *          //加载进度
 *          console.log(progress);
 *      }
 *      (err)=>{
 *          if(err){
 *              console.error(err);
 *              request.dispose();
 *              request=null;
 *              return;
 *          }
 *          //加载完成，获取资源引用
 *          let ref=request.getRef();
 *      }
 * );
 * this.request.load();
 */
declare class ResRequest {
    /**
     * 状态
     */
    state: State;
    /**
     * 资源地址
     */
    urls: Array<ResURL>;
    /**
     * 引用KEY
     */
    refKey: string;
    /**
     * 完成回调
     */
    cb?: (err?: Error) => void;
    /**
     * 进度处理器
     */
    progress?: (progress: number) => void;
    private __loaded;
    private __loadProgress;
    private __resRefs;
    constructor();
    init(url: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void, cb?: (err?: Error) => void): void;
    load(): void;
    childComplete(resURL: ResURL): void;
    childProgress(resURL: ResURL, progress: number): void;
    childError(err: Error): void;
    updateProgress(): void;
    private checkComplete;
    private getLoaded;
    reset(): void;
    destroy(): boolean;
    /**
     * 释放
     */
    dispose(): void;
    /**
     * 获取资源引用
     * @returns
     */
    getRef(): ResRef;
    /**
     * 获取资源引用列表
     * @returns
     */
    getRefList(): Array<ResRef>;
    /**
     * 获取资源引用映射表
     * @param result
     * @returns
     */
    getRefMap(result?: Map<string, ResRef>): Map<string, ResRef>;
    private helpMap;
    /**
     * 去重
     * @param urls
     * @returns
     */
    private removeDuplicates;
}

/**
 * 模块脚本基础类(模块脚本子类必须使用@ccclass('XXXModule'))
 */
declare class Module extends Component implements IEventDispatcher {
    /**
     * 模块名称
     */
    module_name: string;
    /**
     * 引用的配置表
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
     * 永不删除
     */
    notReleased: boolean;
    /**
     * 资源请求对象
     */
    resRequest: ResRequest | null;
    /**
     * 是否初始化完毕
     */
    protected $inited: boolean;
    private __moduleIndex;
    private __eventProxy;
    private __redPoints;
    constructor();
    /**
     * 前置初始化
     */
    preInit(): void;
    private __otherModuleInitComplete;
    /**自身初始化(子类重写并在初始化完成后调用selfInitComplete) */
    protected selfInit(): void;
    /**
     * 自身初始化完成
     */
    protected selfInitComplete(): void;
    /**
     * 初始化
     */
    init(): void;
    /**
     * 获取配置存取器
     * @param config
     * @returns
     */
    getConfigAccessor(config: string): IConfigAccessor;
    /**
     * 获取模块
     * @param module_name
     * @returns
     */
    protected $getModule(module_name: string): Module;
    /**
     * 注册红点检测器
     * @param id
     * @param detector
     */
    registerRedPoint(id: number, detector: () => boolean): void;
    destroy(): boolean;
    /**
     * 获取是否已初始化
     */
    get inited(): boolean;
    on(key: number | string, handler: (e: Event) => void, caller: any, priority?: number): void;
    off(key: number | string, handler: (e: Event) => void, caller: any): void;
    offByCaller(caller: any): void;
    offAllEvent(): void;
    emit(key: number | string, data?: any): void;
    hasEvent(key: number | string): boolean;
    hasEventHandler(key: number | string, handler: (e: Event) => void, caller: any): boolean;
}

declare class ModuleProxy {
    module: Module;
    /**
     * 引用计数器
     */
    refCount: number;
    constructor(module: Module);
    addRef(): void;
    removeRef(): void;
    destroy(): boolean;
}

/**
 * 模块管理器
 */
declare class ModuleManager implements ITicker {
    /**
     * 模块节点(用于加载模块)
     */
    node: Node;
    /**
     * 最大启动线程
     */
    static MAX_LOADER_THREAD: number;
    /**
     * GC间隔时间
     */
    static GC_INTERVAL: number;
    /**
     * 已加载的模块
     */
    private __modules;
    /**
     * 加载模块请求列表
     */
    private __requests;
    /**
     * 等待删除的模块
     */
    private __waitDeletes;
    private __lastGCTime;
    constructor();
    tick(dt: number): void;
    /**
     * 加载
     * @param modules
     * @param progress
     * @param callback
     * @param isSub
     */
    load(modules: Array<string>, progress?: (progress: number) => void, callback?: (err: Error) => void, isSub?: boolean): void;
    childComplete(module_name: string, proxy: ModuleProxy): void;
    childError(module_name: string, err: Error): void;
    childProgress(module_name: string, progress: number): void;
    private __addRequest;
    private __removeRequest;
    /**
     * 获取代理(内部接口，请勿使用)
     * @param module_name
     * @returns
     */
    getModuleProxy(module_name: string): ModuleProxy;
    /**
     * 获取服务(内部接口，请勿使用)
     * @param module_name
     */
    getModule(module_name: string): Module | undefined;
    /**
     * 尝试销毁服务
     * @param clazz
     */
    dispose(module_name: string): void;
    private static __instance;
    static get single(): ModuleManager;
}

/**
 * http
 */
declare class Http {
    /**
     * get请求
     * @param url
     * @param param
     * @param callback
     * @param setRequestHeader
     */
    static get(url: string, param: Object, callback: (err?: Error, data?: any) => void, setRequestHeader?: (v: XMLHttpRequest) => void): void;
    /**
     * post 请求
     * @param url
     * @param param
     * @param callback
     * @param setRequestHeader
     */
    static post(url: string, param: Object, callback: (err?: Error, data?: any) => void, setRequestHeader?: (v: XMLHttpRequest) => void): void;
    private static http;
    private static isValidKey;
    /**
     * 设置http头
     * @param request XMLHttpRequest
     */
    private static setRequestHeader;
}

interface IProtocol {
    /**
     * 解析回调
     * @param code
     * @param data
     * @returns
     */
    parse_callback: ((code: number | string, data: any) => void) | null;
    /**
     * 解码
     * @param data
     */
    decode(data: any): void;
    /**
     * 编码
     * @param code
     * @param data
     */
    encode(code: number | string, data: any): any;
}

/**
 * 长连接接口
 */
interface ISocket extends IEventDispatcher {
    /**
     * 名称
     */
    name: string;
    isConected(): boolean;
    /**
     * 连接
     * @param url
     * @param arg
     */
    connect(url: string, ...arg: any[]): void;
    /**
     * 重连
     * @param type
     * @param url
     */
    reconnect(): void;
    /**
     * 发送消息
     * @param type
     * @param arg
     */
    send(...arg: any[]): void;
    /**
     * 删除并返回指定已缓存的消息
     * @param code
     */
    getCacheMsg(code: number | string): any;
    /**
     * 关闭
     */
    close(): void;
}

/**
 * 长链接管理接口
 */
interface ISocketManager {
    /**
     * 初始化socket
     * @param protocal
     * @param name
     */
    initSocket(protocal: IProtocol, name?: string): ISocket;
    /**
     * socket是否存在
     * @param name
     */
    hasSocket(name: string): boolean;
    /**
     * 获取指定socket
     * @param name
     */
    getSocket(name: string): ISocket;
}

declare class Socket extends EventDispatcher implements ISocket {
    /**名称 */
    name: string;
    /**
     * 最大允许错误次数
     */
    static MAX_ERROR_COUNT: number;
    /**
     * 当前错误次数
     */
    private error_count;
    private is_conected;
    web_socket: WebSocket;
    message_protocol: IProtocol;
    /**
     * 缓存的未处理消息
     */
    private cache_msgs;
    constructor(message_parser: IProtocol);
    getCacheMsg(code: number | string): any;
    isConected(): boolean;
    /**
     * 链接
     * @param url
     * @param binaryType
     */
    connect(url: string, binaryType?: BinaryType): void;
    /**
     * 重新链接
     * @returns
     */
    reconnect(): void;
    /**
     * 关闭
     */
    close(): void;
    private onopen;
    /**
     * 发送协议
     * @param code
     * @param data
     */
    send(code: number | string, data: any): void;
    private onmessage;
    private onMessageParseCallback;
    private onclose;
    private onerror;
}

declare enum EventType {
    SOCKET_CONNECTED = "SOCKET_CONNECTED",
    SOCKET_ERROR = "SOCKET_ERROR",
    SOCKET_CLOSE = "SOCKET_CLOSE"
}
/**
 * 长连接管理器
 */
declare class SocketManager {
    static KEY: string;
    /**
     * sokcet事件类型枚举
     */
    static EventType: typeof EventType;
    private static __default_socket;
    /**
     * 设置默认socket
     * @param type
     */
    static setDefaultSocket(type: string): void;
    /**
     * socket是否存在
     * @param name
     * @returns
     */
    static hasSocket(name: string): boolean;
    /**
     * 初始化socket
     * @param name
     * @param protocal
     * @returns
     */
    static initSocket(protocal: IProtocol, name?: string): ISocket;
    /**
     * 获取指定类型的长链接
     * @param name
     * @returns
     */
    static getSocket(name?: string): ISocket;
    private static __impl;
    private static get impl();
}

declare class SocketManagerImpl implements ISocketManager {
    private __socketMap;
    constructor();
    initSocket(protocal: IProtocol, name?: string): ISocket;
    /**
     * socket是否存在
     * @param name
     * @returns
     */
    hasSocket(name: string): boolean;
    /**
     * 获取指定类型的长链接
     * @param name
     */
    getSocket(name: string): ISocket;
}

/**
 * 对象池
 * @example
 * //从对象池获取一个实例
 * let item=Pool.acquire(MyClass);
 * //将对象还回对象池
 * Pool.release(MyClass,item);
 */
declare class Pool {
    /**
     * 对象池的集合
     */
    private static pools;
    /**
     * 从对象池中获取一个实例
     *
     * @param clazz 类的构造函数，该类需要实现 IPoolable 接口
     * @returns 返回从对象池中获取的实例
     */
    static acquire<T extends IPoolable>(clazz: new () => T): T;
    /**
     * 释放对象到指定类型的对象池中
     *
     * @param clazz 对象类型，必须实现 IPoolable 接口
     * @param item 要释放的对象
     * @throws 如果对象池不存在，则抛出错误
     */
    static release<T extends IPoolable>(clazz: new () => T, item: T): void;
    /**
     * 获取指定类的所有正在使用的对象
     * @param type
     * @param result
     * @returns
     */
    static getUsing<T extends IPoolable>(type: new () => T, result?: Array<T>): Array<T>;
    /**
     * 释放指定类的所有对象
     *
     * @param clazz 类构造函数，需要实现 IPoolable 接口
     * @throws Error 如果对象池不存在，则抛出错误
     */
    static releaseAll<T extends IPoolable>(clazz: new () => T): void;
    /**
     * 销毁指定类的对象池
     *
     * @param clazz 需要销毁对象池的类
     * @throws Error 如果对象池不存在，则抛出错误
     */
    static destroy<T extends IPoolable>(clazz: new () => T): void;
    static logStatus(): void;
}

/**
 * cocos 内置类型资源加载器
 */
declare class CCLoader extends EventDispatcher implements ILoader {
    private __url?;
    constructor();
    reset(): void;
    load(url: ResURL): void;
    private __load;
}

interface ILoaderManager {
    /**
     * 加载资源
     */
    load(reqeust: ResRequest): void;
    /**
     * 卸载
     * @param request
     */
    unload(request: ResRequest): void;
    /**加载进度汇报 */
    childComplete(url: ResURL): void;
    childError(url: ResURL, err: Error): void;
    childProgress(url: ResURL, progress: number): void;
}

declare class LoaderManager {
    static KEY: string;
    /**
     * 加载资源
     * @param reqeust
     */
    static load(reqeust: ResRequest): void;
    /**
     * 卸载
     * @param request
     */
    static unload(request: ResRequest): void;
    static childComplete(url: ResURL): void;
    static childError(url: ResURL, err: Error): void;
    static childProgress(url: ResURL, progress: number): void;
    private static __impl;
    private static get impl();
}

interface IRes {
    /**
     * url转key
     * @param url
     */
    url2Key(url: ResURL): string;
    /**
     * key转url
     * @param key
     */
    key2Url(key: string): ResURL;
    /**
     * url转资源路径
     * @param url
     */
    url2Path(url: ResURL): string;
    /**
     * url是否相同
     * @param a
     * @param b
     */
    urlEqual(a: ResURL | null, b: ResURL | null): boolean;
    /**
     * 设置加载器
     * @param key
     * @param loader
     */
    setLoader(key: any, loader: new () => ILoader): void;
    /**
     * 创建资源请求
     * @param url
     * @param refKey
     * @param progress
     * @param cb
     */
    create(url: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void, cb?: (err?: Error) => void): ResRequest;
    /**
     * 获取加载器
     * @param key
     */
    getLoader(key: any): new () => ILoader;
    /**
     * 获取AssetBundle
     * @param names
     */
    loadAssetBundles(names: string | Array<string>): Promise<void>;
}

/**
 * 资源接口
 */
interface IResource extends IDestroyable {
    /**
      * 资源全局唯一KEY
      */
    key: string;
    /**
     * 最后一次操作的时间点
     */
    lastOpTime: number;
    /**
     * 资源
     */
    content: any;
    /**
     * 资源引用数量
     */
    readonly refCount: number;
    /**
     * 资源引用列表长度
     */
    readonly refLength: number;
    /**
     * 添加一个引用
     * @param refKey
     */
    addRef(refKey?: string): ResRef;
    /**
     * 删除引用
     * @param value
     */
    removeRef(value: ResRef): void;
    /**
     * 资源的引用列表
     */
    readonly refList: Array<ResRef>;
}

/**
 * 资源管理器接口
 */
interface IResourceManager {
    /**
     * 添加一个资源
     * @param value
     */
    addRes(value: IResource): void;
    /**
     * 获取资源(内部接口)
     * @param key
     */
    getRes(key: string): IResource | undefined;
    /**
     * 是否包含该资源
     * @param key
     */
    hasRes(key: string): boolean;
    /**
     * 添加并返回一个资源引用
     * @param key
     * @param refKey
     */
    addRef(key: string, refKey?: string): ResRef;
    /**
     * 删除一个资源引用
     * @param value
     */
    removeRef(value: ResRef): void;
    /**
     * 资源清理
     */
    gc(ignoreTime?: boolean): void;
    /**
     * 资源列表
     */
    readonly resList: Array<IResource>;
}

/**
 * 资源
 */
declare class Resource implements IResource {
    /**
     * 资源全局唯一KEY
     */
    key: string;
    /**
     * 最后操作的时间电
     */
    lastOpTime: number;
    /**
     * 资源内容
     */
    content: any;
    private __refList;
    constructor();
    addRef(refKey?: string): ResRef;
    removeRef(value: ResRef): void;
    destroy(): boolean;
    /**
     * 资源引用列表
     */
    get refList(): ResRef[];
    /**
     * 引用数量
     */
    get refCount(): number;
    /**
     * 引用列表长度
     */
    get refLength(): number;
}

declare class ResourceManager {
    static KEY: string;
    /**
     * GC检查时间间隔(毫秒)
     */
    static GC_CHECK_TIME: number;
    /**
     * 资源保留长时间(毫秒)GC
     */
    static GC_TIME: number;
    /**
     * 自动清理
     */
    static AUTO_GC: boolean;
    /**
     * 添加一个资源
     * @param value
     */
    static addRes(value: IResource): void;
    /**
     * 是否包含该资源
     * @param key
     */
    static hasRes(key: string): boolean;
    /**
     * 获取资源（内部接口）
     * @param key
     * @returns
     */
    static getRes(key: string): IResource | undefined;
    /**
     * 添加并返回一个资源引用
     * @param key
     * @param refKey
     */
    static addRef(key: string, refKey?: string): ResRef;
    /**
     * 删除一个资源引用
     * @param value
     */
    static removeRef(value: ResRef): void;
    /**
     * 资源清理
     */
    static gc(ignoreTime?: boolean): void;
    /**
     * 资源列表
     * @returns
     */
    static get resList(): Array<IResource>;
    private static __impl;
    private static get impl();
}

declare enum ResType {
    FGUI = "fgui",
    CONFIG = "config"
}
/**
 * 资源入口类
 */
declare class Res {
    static readonly KEY: string;
    /**
     * 默认资源类型
     */
    static TYPE: typeof ResType;
    /**
     * 资源加载最大线程数
     */
    static MAX_LOADER_THREAD: number;
    /**
     * key转url
     * @param key
     * @returns
     */
    static key2Url(key: string): ResURL;
    /**
     * url转key
     * @param url
     * @returns
     */
    static url2Key(url: ResURL): string;
    /**
    * url转资源路径
    * @param url
    */
    static url2Path(url: ResURL): string;
    /**
     * url是否相同
     * @param a
     * @param b
     */
    static urlEqual(a: ResURL | null, b: ResURL | null): boolean;
    /**
     * 设置资源加载器
     * @param key
     * @param loader
     */
    static setLoader(key: any, loader: new () => ILoader): void;
    /**
     * 获取资源加载器
     * @param key
     * @returns
     */
    static getLoader(key: any): new () => ILoader;
    /**
     * 创建资源请求
     * @param url
     * @param refKey
     * @param progress
     * @param cb
     * @returns
     */
    static create(url: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void, cb?: (err?: Error) => void): ResRequest;
    /**
     * 加载AssetBundle
     * @param names
     * @returns
     */
    static loadAssetBundles(names: string | Array<string>): Promise<void>;
    private static __impl;
    private static get impl();
    /**
     * url转表名
     * @param url
     * @returns
     */
    static url2Sheet: (url: ResURL) => string;
    /**
     * 配置表名称转URL
     * @param sheet
     * @param type
     * @param bundle
     * @returns
     */
    static sheet2URL: ((sheet: string, type?: any, bundle?: string) => ResURL) | undefined;
}

/**
 * 任务接口
 */
interface ITask extends IEventDispatcher {
    /**
     * 开始
     * @param data
     */
    start(data?: any): void;
}

/**
 * 任务
 */
declare class Task extends EventDispatcher implements ITask {
    /**
     * 开始
     * @param data
     */
    start(data?: any): void;
    addEventHandler(handler: (e: Event) => void, caller: any): void;
    removeEventHandler(handler: (e: Event) => void, caller: any): void;
    /**
     * 销毁
     */
    destroy(): boolean;
}

/**
 * 任务队列
 */
declare class TaskQueue extends Task {
    private __taskList;
    private __index;
    private __data;
    constructor();
    addTask(value: ITask | Array<ITask>): void;
    private __addTask;
    removeTask(value: ITask): void;
    start(data?: any): void;
    private __tryNext;
    private __subTaskEventHandler;
    destroy(): boolean;
}

/**
 * 任务序列（并行）
 */
declare class TaskSequence extends Task {
    private __taskList;
    private __index;
    constructor();
    addTask(value: ITask): void;
    removeTask(value: ITask): void;
    start(data?: any): void;
    private __subTaskEventHandler;
    destroy(): boolean;
}

/**
 * 心跳驱动器接口
 */
interface ITickerManager {
    /**
     * 心跳驱动函数
     * @param dt
     */
    tick(dt: number): void;
    /**
     * 添加心跳
     * @param value
     */
    addTicker(value: ITicker): void;
    /**
     * 删除心跳
     * @param value
     */
    removeTicker(value: ITicker): void;
    /**
     * 下一帧回调
     * @param value
     * @param caller
     */
    callNextFrame(value: Function, caller: any): void;
    /**
     * 清理下一帧回调请求(如果存在的话)
     * @param value
     * @param caller
     */
    clearNextFrame(value: Function, caller: any): void;
}

/**
 * 心跳驱动器实现
 */
declare class TickerManager {
    static KEY: string;
    /**
     * 心跳驱动接口
     * @param dt
     */
    static tick(dt: number): void;
    /**
     * 添加一个心跳驱动
     * @param value
     */
    static addTicker(value: ITicker): void;
    /**
     * 删除一个心跳驱动
     * @param value
     */
    static removeTicker(value: ITicker): void;
    /**
     * 下一帧回调
     * @param value
     * @param caller
     */
    static callNextFrame(value: Function, caller: any): void;
    /**
     * 清理下一帧回调请求(如果存在的话)
     * @param value
     * @param value
     * @param caller
     */
    static clearNextFrame(value: Function, caller: any): void;
    private static __impl;
    static get impl(): ITickerManager;
}

/**
 * 计时器接口
 */
interface ITimer {
    /**
     * 当前时间(毫秒)推荐使用
     */
    readonly currentTime: number;
    /**
     * 绝对时间(毫秒)注意效率较差，不推荐使用！
     */
    readonly absTime: number;
    /**
     * 帧间隔时间(毫秒)
     */
    readonly deltaTime: number;
    /**
     * 重新校准
     */
    reset(time?: number): void;
}

declare class Timer {
    static KEY: string;
    private static __serverTime;
    private static __lastTime;
    /**
     * 服务器时间(毫秒)
     */
    static get serverTime(): number;
    /**
     * 当前时间(毫秒)
     */
    static get currentTime(): number;
    /**
     * 绝对时间(毫秒),注意效率较差，不推荐使用！
     */
    static get absTime(): number;
    /**
     * 重新校准
     * @param time  时间起点，如果不设置则获取系统当前时间点
     */
    static reset(time?: number): void;
    private static __impl;
    private static get impl();
}

/**
 * bit位操作
 */
declare class BitFlag {
    private __flags;
    private __elements;
    constructor();
    reset(): void;
    add(flag: number): void;
    remove(flag: number): void;
    /**
     * 是否包含
     * @param flag
     * @returns
     */
    has(flag: number): boolean;
    /**
     * 位码
     */
    get flags(): number;
    get elements(): Array<number>;
    destroy(): void;
    private static TYPES;
    private static BITS;
    private static TYPE_IDX;
    static getBit(value: new () => any): number;
    static getType(bit: number): new () => any;
}

declare class ClassUtils {
    /**
     * 获取单词指定位置单词
     * @param str
     * @param n
     * @returns
     */
    static getWord(str: string, n: number | Array<number>): string | Array<string>;
    static getContractName(code: string): string;
    static getFunctionName(code: string): string;
    static getClassName(value: any): string;
}

declare class I18N {
    /**
     * 多语言表名
     */
    static fileName: string;
    /**
     * 当前语言
     */
    static langenge: string;
    /**
     * 多语言项数据
     */
    static sheetItem: {
        key: string;
        value: string;
    };
    constructor();
    /**
     * 转换
     * @param value
     * @param rest
     * @returns
     */
    static tr(value: string, ...rest: any[]): string;
    /**
     * 多语言资源路径
     * @param url
     */
    static tr_res(url: string): string;
    static get sheetName(): string;
    static get defaultSheetName(): string;
}

/**
 * 简易注入器
 */
declare class Injector {
    /**类型字典*/
    private static __injectedMap;
    /**实例字典*/
    private static __instanceMap;
    /**
     * 注入
     * @param key
     * @param clazz   类型或实例
     */
    static inject(customKey: string, clazz: any): void;
    /**
     * 获取已注入的类型实例
     */
    static getInject(customKey: string): any | null;
}

declare class MathUtils {
    static readonly ZeroTolerance: number;
    static readonly Angle90: number;
    static readonly Rad2Angle: number;
    static readonly Angle2Rad: number;
    /**
     * 检测是否相等
     * @param a
     * @param b
     * @returns true 相等 false不相等
     */
    static equals(a: number, b: number): boolean;
    /**
     * 强制取整，去掉小数点后的数字
     * @param v
     * @returns
     */
    static int(v: number): number;
    /**
     * 求2条线段之间的交点
     * @param a
     * @param b
     * @param c
     * @param d
     * @param result
     * @returns
     */
    static getIntersectionPoint(a: {
        x: number;
        y: number;
    }, b: {
        x: number;
        y: number;
    }, c: {
        x: number;
        y: number;
    }, d: {
        x: number;
        y: number;
    }, result?: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    } | null;
    /**
     * 点到线段的垂点
     * @param px
     * @param py
     * @param sx
     * @param sy
     * @param ex
     * @param ey
     */
    static getPerpendicularPoint(px: number, py: number, sx: number, sy: number, ex: number, ey: number, result?: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
    /**
     * 点到线段的距离
     * @param P3
     * @param PA
     * @param PB
     * @return
     */
    static getNearestDistance(target: {
        x: number;
        y: number;
    }, pa: {
        x: number;
        y: number;
    }, pb: {
        x: number;
        y: number;
    }): number;
    /**
     * 向量点乘
     * @param ax
     * @param ay
     * @param bx
     * @param by
     * @returns   0 互相垂直 >0 向量夹角小于90度 <0向量夹角大于90度
     */
    static vectorDot(ax: number, ay: number, bx: number, by: number): number;
    /**
     * 向量叉乘
     * @param a
     * @param b
     * @param out
     */
    static vectorCross(ax: number, ay: number, bx: number, by: number): number;
    /**
     * 求两个向量之间的夹角
     * @param av        单位向量
     * @param bv        单位向量
     */
    static calculateAngle(ax: number, ay: number, bx: number, by: number): number;
    /**
    * 求两点之间距离
    * @param ax
    * @param ay
    * @param bx
    * @param by
    * @returns
    */
    static distance(ax: number, ay: number, bx: number, by: number): number;
    /**
     * 求距离的二次方
     * @param ax
     * @param ay
     * @param bx
     * @param by
     * @returns
     */
    static distanceSquared(ax: number, ay: number, bx: number, by: number): number;
    /**
     * 是否包含在圆内
     * @param x
     * @param y
     * @param ox
     * @param oy
     * @param r
     * @returns
     */
    static inTheCircle(x: number, y: number, ox: number, oy: number, r: number): boolean;
}

/**
 * 对象工具类
 */
declare class ObjectUtils {
    /**
     * 将source对象属性拷贝到target对象
     * @param source
     * @param target
     */
    static oto(source: any, target: any): void;
    /**
     * 深度克隆
     * @param source
     * @returns
     */
    static deepClone<T>(source: any): T;
    /**
     * 清理对象
     * @param obj
     */
    static clear(obj: any): void;
}

declare class StringUtils {
    /**
     * 判断字符串是否为空
     * @param str
     * @returns
     */
    static isEmpty(str: string): boolean;
    /**
     * 字符转二维数组
     * @param str
     * @returns
     */
    static str2NumArrList(str: string, separators?: Array<string>): number[][];
    /**
     * 字符串转二维数组
     * @param str
     * @param separators
     * @returns
     */
    static str2StringList(str: string, separators?: Array<string>): string[][];
    /**
     * 参数替换
     *  @param  str
     *  @param  rest
     *
     *  @example
     *
     *  let str:string = "你好{},这里是:{}";
     *  console.log(StringUtil.substitute2(str, "蝈蝈","蓝星"));
     *
     *  // 输出结果如下:
     *  // "你好蝈蝈,这里是:蓝星"
     */
    static substitute(str: string, ...rest: any[]): string;
    /**
     * 参数替换
     *  @param  str
     *  @param  rest
     *
     *  @example
     *
     *  let str:string = "here is some info '{0}' and {1}";
     *  console.log(StringUtil.substitute(str, 15.4, true));
     *
     *  // this will output the following string:
     *  // "here is some info '15.4' and true"
     */
    static substitute2(str: string, ...rest: any[]): string;
    /**
     * 获取资源父文件夹
     * @param url
     * @param separator
     * @returns
     */
    static getDir(url: string, separator?: string): string;
}

/**
 * 引擎入口
 */
declare class Engine {
    private static plugins;
    private static inited;
    /**
     * 启动引擎
     * @param plugins
     * @param progress
     * @param cb
     */
    static start(plugins: Array<IEnginePlugin>, progress: (v: number) => void, cb: (err: Error | null) => void): void;
    /**
     * 获取插件
     * @param name
     * @returns
     */
    static getPlugin(name: string): IEnginePlugin | undefined;
    /**
     * 心跳驱动
     * @param dt
     * @returns
     */
    static tick(dt: number): void;
}

export { ArrayProperty, ArrayValue, AudioManager, BaseConfigAccessor, BaseValue, Binder, BitFlag, CCLoader, ChangedData, ClassUtils, ConfigManager, ConfigStorage, Dictionary, DictionaryProperty, DictionaryValue, Engine, Event, EventDispatcher, EventType$1 as EventType, Func, FuncNode, FunctionHook, Handler, Http, I18N, IAudioChannel, IAudioGroup, IAudioManager, IConfigAccessor, IConfigManager, IDConfigAccessor, IDeserialization, IDestroyable, IEnginePlugin, IEventDispatcher, IFuncConfig, IFuncData, ILoader, ILoaderManager, ILogger, IPoolable, IProtocol, IRedPointData, IRes, IResource, IResourceManager, ISerDesProperty, ISerDesValue, ISerialization, ISocket, ISocketManager, ITask, ITicker, ITickerManager, ITimer, Injector, JSONDeserialization, JSONSerialization, List, LoaderManager, LocalConfigLoader, Logger, MathUtils, Module, ModuleManager, NumberProperty, NumberValue, ObjectUtils, Pool, PropertyBinder, RedPoint, RedPointNode, RemoteConfigLoader, Res, ResRef, ResRequest, ResURL, Resource, ResourceManager, SerDes, SerDesMode, Socket, SocketManager, SocketManagerImpl, StringProperty, StringUtils, StringValue, Task, TaskQueue, TaskSequence, TickerManager, Timer };
