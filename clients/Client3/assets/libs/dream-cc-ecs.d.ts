import { IPoolable, EventDispatcher, ResRequest, IDestroyable } from 'dream-cc-core';
import { Vec3, Quat, Node, Graphics } from 'cc';

/**
 * 只是一个ID
 */
type ECSEntity = number | string;

interface IECSComponent {
    /**所属世界 */
    world: ECSWorld | null;
    /**所属entity*/
    entity: ECSEntity | null;
    /**脏数据标记回调*/
    dirtySignal: (() => void) | null;
    /**标记该组件数据为脏*/
    markDirtied(): void;
    /**启用 */
    enable(): void;
    /**重置*/
    reset(): void;
    /**销毁 */
    destroy(): boolean;
}

/**
 * 匹配器
 */
declare class ECSMatcher {
    /**
     * 全部包含或任意包含
     */
    matcher: MatcherAllOf | MatcherAnyOf | undefined;
    /**
     * 可选任意包含
     */
    matcherAnyOf: MatcherAnyOf | undefined;
    /**
     * 不能包含的
     */
    matcherNoneOf: MatcherNoneOf | undefined;
    /**
     * 编组所匹配的元素(内部接口)
     */
    private __entitys;
    /**
     * 关联组件
     */
    _dependencies: Set<new () => IECSComponent>;
    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, matcherAnyOf?: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf);
    get entitys(): Set<ECSEntity>;
    has(entity: ECSEntity): boolean;
    add(entity: ECSEntity): void;
    remove(entity: ECSEntity): void;
    clear(): void;
    destroy(): void;
}
/**
 * 匹配器
 */
declare class Matcher {
    types: Array<new () => IECSComponent>;
    constructor(types: Array<new () => IECSComponent>);
}
/**
 * 必须所有成立
 */
declare class MatcherAllOf extends Matcher {
}
/**
 * 任意一个成立
 */
declare class MatcherAnyOf extends Matcher {
}
/**
 * 不能包含
 */
declare class MatcherNoneOf extends Matcher {
}

/**
 * 系统
 */
declare abstract class ECSSystem {
    private static HELP_ENTITY_LIST;
    /**是否使用脏数据*/
    useDirty: boolean;
    /**匹配器 */
    _matcher: ECSMatcher;
    /**所属世界 */
    private __world;
    /**
     * 系统
     * @param allOrAny  匹配所有或任意一个
     * @param none      不能包含
     * @param useDirty  是否使用脏数据机制
     */
    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, matcherAnyOf?: MatcherAnyOf, none?: MatcherNoneOf, useDirty?: boolean);
    /**设置所属世界 */
    setWorld(v: ECSWorld): void;
    /**心跳 */
    tick(dt: number): void;
    hasEntity(entity: ECSEntity): boolean;
    removeEntity(entity: ECSEntity): void;
    addEntity(entity: ECSEntity): void;
    /**所属世界 */
    get world(): ECSWorld;
    protected $tick(entitys: Set<ECSEntity>, dt: number): void;
    /**销毁 */
    destory(): void;
}

/**
 * 世界
 */
declare class ECSWorld {
    /**组件优先级（用于控制entity删除时component销毁的调用优先级） */
    static COMPONENT_PRIORITY: (com_type: new () => any) => number;
    static HELP_SYSTEM_LIST: Array<new () => ECSSystem>;
    static HELP_ENTITY_LIST: Array<ECSEntity>;
    private __maxCount;
    /**等待删除的entity*/
    private __waitFree;
    private __storage;
    private __systems;
    /**组件关联的系统 */
    private __componentSystems;
    /**系统排序 */
    private __system_priority;
    /**标记系统需要排序 */
    private __need_sort_systems;
    /**
     * 当前删除正在删除的entity
     */
    private __currentRemoveEntity;
    /**
     * 初始化
     * @param maxCount
     */
    constructor(maxCount: number);
    /**系统排序（用于控制system.tick的调用顺序） */
    set system_priority(fn: (sys_type: ECSSystem) => number);
    get system_priority(): (sys: ECSSystem) => number;
    /**
     * 心跳
     * @param dt
     */
    tick(dt: number): void;
    /**
     * 创建
     */
    createEntity(entity: ECSEntity): void;
    /**
     * 查询是否包含entity
     * @param entity
     * @returns
     */
    hasEntity(entity: ECSEntity): boolean;
    /**
     * 删除entity
     * @param entity
     * @returns
     */
    removeEntity(entity: ECSEntity): void;
    /**
    * 立刻删除entity
    * @param entity
    */
    private __removeEntity;
    /**
     * 添加组件
     * @param entity
     * @param type
     * @returns
     */
    addComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T;
    /**
     * 查询entity是否包含组件
     * @param entity
     * @param type
     * @param check_instance    是否检查继承关系
     * @returns
     */
    hasComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): boolean;
    /**
     * 删除组件
     * @param entity
     * @param type
     * @returns
     */
    removeComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T;
    /**
     * 删除entity上的所有组件
     * @param entity
     */
    removeComponents(entity: ECSEntity): void;
    /**
     * 获取组件在entity上的实例类型
     * @param entity
     * @param type
     * @returns
     */
    private __getComponentType;
    /**
     * 删除组件
     * @param entity
     * @param type
     * @returns
     */
    removeComponentIf<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T | null;
    /**
     * 通过组件实例进行删除
     * @param entity
     * @param com
     * @returns
     */
    removeComponentBy<T extends IECSComponent>(entity: ECSEntity, com: IECSComponent): T;
    /**
     * 获取组件
     * @param entity
     * @param type
     * @returns
     */
    getComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T | null;
    /**
     * 获取entity上某个类型组件的列表
     * @param entity
     * @param type
     * @returns
     */
    getComponentList<T extends IECSComponent>(entity: ECSEntity, type: new () => T): Array<T>;
    /**
     * 通过类型获取组件列表
     * @param type
     * @param check_instance 是否开启instanceof检测，默认关闭
     * @returns
     */
    getComponents<T extends IECSComponent>(type: new () => T, check_instance?: boolean): Array<T>;
    /**
     * 获取组件，如果没有则添加
     * @param entity
     * @param type
     * @returns
     */
    getAddComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T;
    /**
     * 添加多个系统
     * @param sys_list
     */
    addSystems(sys: Array<new () => ECSSystem>): void;
    /**
     * 添加系统
     */
    addSystem(sysClass: new () => ECSSystem): void;
    /**
     * 是否包含该系统
     * @param key
     * @returns
     */
    hasSystem(key: new () => ECSSystem): boolean;
    /**
     * 获取系统
     * @param key
     * @returns
     */
    getSystem(key: new () => ECSSystem): ECSSystem | undefined;
    /**
     * 删除系统
     * @param value
     */
    removeSystem(value: ECSSystem): void;
    /**
     * 清理所有元素
     */
    clearAll(): void;
    destroy(): void;
    /**标记组件脏了 */
    private __componentDirty;
    /**将所有entity跟系统进行匹配 */
    private __matcherAll;
    private __matcher;
    private __matcherEntity;
    private __matcherComponents;
}

/**
 * 组件抽象类
 */
declare abstract class ECSComponent implements IECSComponent {
    /**所属世界 */
    world: ECSWorld;
    /**所属entity*/
    entity: ECSEntity;
    /**脏数据标记回调*/
    dirtySignal: (() => void);
    constructor();
    /**
     * 启用组件
     */
    enable(): void;
    /**标记该组件数据为脏*/
    markDirtied(): void;
    private __nextFrame;
    /**重置*/
    reset(): void;
    destroy(): boolean;
}

declare class ECSStorage<T extends IPoolable> {
    private __uidMapping;
    private __values;
    private __entitySets;
    private __poolRecord;
    private __sparseSet;
    private __freelist;
    private __entityIndex;
    constructor(maxCount: number);
    /**
     * 添加
     * @param id
     */
    add(id: ECSEntity): void;
    /**
     * 是否包含
     * @param id
     * @returns
     */
    has(id: ECSEntity): boolean;
    /**
     * 删除
     * @param id
     * @returns
     */
    remove(id: ECSEntity): void;
    /**
     * 获取
     * @param id
     * @param type
     * @returns
     */
    getValue(id: ECSEntity, type: new () => T): T | null;
    /**
     * 添加
     * @param id
     * @param type
     * @returns
     */
    addValue(id: ECSEntity, type: new () => T): T;
    /**
     * 是否包含Value
     * @param id
     * @param type
     */
    hasValue(id: ECSEntity, type: new () => T): boolean;
    /**
     * 删除
     * @param id
     * @param type
     * @returns
     */
    removeValue(id: ECSEntity, type: new () => T): T;
    /**
     * 根据类型获取列表
     * @param type
     * @returns
     */
    getValues(type: new () => T): Array<T>;
    getEntitySet(id: ECSEntity): Set<new () => T> | null;
    /**
     * 清理
     */
    clear(): void;
    /**销毁 */
    destroy(): void;
    /**无效值 */
    get invalid(): number;
    getIDList(result?: Array<ECSEntity>): Array<ECSEntity>;
    get values(): Map<new () => any, Array<T | null>>;
}

/**
 * 稀疏集合
 */
declare class SparseSet {
    /**无效值 */
    invalid: number;
    private __maxCount;
    private __packed;
    private __index;
    private __sparse;
    constructor(maxCount: number);
    /**
     * 添加
     * @param id
     */
    add(id: number): void;
    /**
     * 是否包含
     * @param id
     * @returns
     */
    contains(id: number): boolean;
    /**
     * 删除
     * @param id
     */
    remove(id: number): void;
    /**
     * 清除所有
     */
    clear(): void;
    destroy(): void;
    /**
     * 获取packed的索引值
     * @param id
     * @returns
     */
    getPackedIdx(id: number): number;
    /**
     * 最后一个entity
     */
    get lastEntity(): number;
    get packed(): Uint32Array;
    get length(): number;
    get maxCount(): number;
}

/**
 * 阵营基础类
 */
declare class CampComponent extends ECSComponent {
    /**
     * 阵营
     */
    camp: number;
    constructor();
}

/**
 * 变换组件
 */
declare class TransformComponent extends ECSComponent {
    /**
     * 是否翻转Y轴
     */
    static YAxisFlip: boolean;
    private __position;
    private __rotation;
    private __angle;
    private __scale;
    private __direction;
    constructor();
    /**
     * 设置朝向
     * @param x
     * @param y
     * @param z
     */
    setDirection(x?: number, y?: number, z?: number): void;
    get direction(): Vec3;
    setPosition(x?: number, y?: number, z?: number): void;
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    get z(): number;
    set z(v: number);
    get position(): Vec3;
    set position(v: Vec3);
    /**
     * 设置旋转角度(0-360)
     * @param x
     * @param y
     * @param z
     */
    setAngle(x: number, y?: number, z?: number): void;
    get rotation(): Quat;
    set rotation(v: Quat);
    /**
     * 设置缩放比例
     * @param x
     * @param y
     * @param z
     */
    setScale(x?: number, y?: number, z?: number): void;
    /**
     * 缩放比例
     */
    set scale(v: Vec3);
    get scale(): Vec3;
    reset(): void;
}

declare class AddToParentQueueSystem extends ECSSystem {
    private nodes;
    private frame_count;
    constructor();
    tick(dt: number): void;
    protected $tick(entitys: Set<ECSEntity>, dt: number): void;
}

/**
 * 添加到父节点系统
 */
declare class AddToParentSystem extends ECSSystem {
    constructor();
    protected $tick(entitys: Set<ECSEntity>, dt: number): void;
}

declare class NodeComponent extends Node implements IECSComponent {
    world: ECSWorld | null;
    entity: ECSEntity | null;
    dirtySignal: (() => void) | null;
    constructor();
    enable(): void;
    markDirtied(): void;
    private nextFrame;
    reset(): void;
}

declare class NodeSystem extends ECSSystem {
    constructor();
    protected $tick(entitys: Set<ECSEntity>, dt: number): void;
}

/**
 * 设置父节点组件
 */
declare class ParentComponent extends ECSComponent {
    private __parent;
    constructor();
    set parent(v: ECSEntity | Node | null);
    get parent(): ECSEntity | Node | null;
    reset(): void;
}

/**
 * 大小记录组件(只用于记录大小)
 */
declare class SizeComponent extends ECSComponent {
    private __size;
    constructor();
    setSize(w: number, h: number): void;
    set width(v: number);
    get width(): number;
    set height(v: number);
    get height(): number;
    reset(): void;
}

/**
 * 显示组件
 */
declare class DisplayComponent extends ECSComponent {
    constructor();
    enable(): void;
    reset(): void;
    /**
     * 节点
     */
    get node(): Node | null;
    set name(v: string);
    get name(): string;
}

/**
 * 绘画组件
 */
declare class GraphicsComponent extends DisplayComponent {
    private __graphics;
    constructor();
    enable(): void;
    get graphics(): Graphics;
    reset(): void;
}

declare class DataComponent extends ECSComponent {
    private __data;
    constructor();
    reset(): void;
    set data(v: any);
    get data(): any;
}

/**
 * 链接组件
 */
declare class LinkComponent extends ECSComponent {
    /**链接目标 */
    target?: ECSEntity;
    constructor();
}

declare class LinkSystem extends ECSSystem {
    constructor();
    protected $tick(entitys: Set<ECSEntity>, dt: number): void;
}

/**
 * 3D世界中的2D渲染组件
 */
declare class RendererRoot2DComponent extends DisplayComponent {
    private __root2D;
    constructor();
    enable(): void;
    reset(): void;
}

/**
 * 关卡模式脚本(用于拆分和重用逻辑)
 */
declare abstract class LevelModeScript {
    /**
     * 模式
     */
    mode: LevelMode;
    constructor();
    /**
     * 初始化
     */
    abstract init(): void;
    /**
     * 销毁
     */
    abstract destroy(): void;
    tick(dt: number): void;
    /**
     * 世界
     */
    get world(): ECSWorld;
}

/**
 * 关卡模式基类
 */
declare abstract class LevelMode extends EventDispatcher {
    level: Level;
    /**
     * 需要注册的配置表存取器
     */
    configs: Array<string>;
    reqeust: ResRequest | null;
    /**脚本 */
    private __scripts;
    /**数据 */
    protected $data: any;
    /**初始化数据*/
    protected $initData: any;
    /**初始化完成 */
    protected $inited: boolean;
    constructor();
    /**
     * 数据
     */
    get data(): any;
    /**
     * 初始化数据
     */
    get initData(): any;
    /**
     * 初始化
     */
    init(...arg: any[]): void;
    /**
     * 初始化,如果不调用super.$init的话，请在完成初始化后调用$initComplete()方法。
     */
    protected $init(): void;
    /**
     * 初始化完成
     */
    protected $initComplete(): void;
    /**
     * 心跳
     * @param dt
     */
    tick(dt: number): void;
    /**
     * 添加脚本
     * @param type
     */
    addScript<T extends LevelModeScript>(type: new () => T): T | null;
    /**
     * 删除脚本
     * @param type
     * @returns
     */
    removeScript<T extends LevelModeScript>(type: new () => T): T | null;
    /**
     * 移除所有脚本
     */
    removeAllScript(): void;
    /**
     * 获取脚本
     * @param type
     * @returns
     */
    getScript<T extends LevelModeScript>(type: new () => T): T | null;
    destroy(): boolean;
    /**
     * 世界
     */
    get world(): ECSWorld;
    /**
     * 根节点
     */
    get root(): Node;
}

/**
 * 关卡状态数据存放
 */
declare class LevelStatus implements IDestroyable {
    private __status;
    constructor();
    /**
     * 获取数据
     * @param key
     * @returns
     */
    get<T>(key: any): T;
    /**
     * 是否包含数据
     * @param key
     * @returns
     */
    has(key: any): boolean;
    /**
     * 设置数据
     * @param key
     * @param value
     */
    set(key: any, value: any): void;
    /**
     * 删除数据
     */
    delete(key: any): void;
    clear(): void;
    destroy(): boolean;
}

/**
 * 关卡
 */
declare class Level extends EventDispatcher {
    /**
     * 关卡世界KEY
     */
    key: string;
    private __status;
    private __world_root;
    private __world;
    private __mode;
    private __entered;
    constructor();
    /**
     * 初始化
     * @param root
     * @param entity_max_count  最大实体数量
     */
    init(root: Node, entity_max_count?: number): void;
    /**
     * 进入关卡
     * @param mode          玩法模式
     * @param mode_data     玩法数据
     */
    enter(mode: LevelMode, ...mode_data: any[]): void;
    private __enterComplete;
    /**
     * 关卡心跳统一接口
     * @param dt
     */
    tick(dt: number): void;
    /**
     * 退出关卡
     */
    exit(): void;
    /**
     * 根节点
     */
    get root(): Node;
    /**
     * 世界
     */
    get world(): ECSWorld;
    /**
     * 模式
     */
    get mode(): LevelMode;
    /**
     * 状态(用于记录一下对于关卡中的一些"全局"状态信息)")
     */
    get status(): LevelStatus;
}

declare class LevelManager {
    private __levels;
    constructor();
    /**
     * 初始化关卡
     * @param key
     * @param root
     * @param max_count
     */
    initLevel(key: string, root: Node, max_count?: number): Level;
    /**
     * 关卡是否存在
     * @param key
     * @returns
     */
    hasLevel(key: string): boolean;
    /**
     * 获取关卡实例
     * @param key
     * @returns
     */
    getLevel(key: string): Level;
    /**
     * 进入关卡
     * @param key
     * @param mode
     * @param data
     */
    enter(key: string, mode: LevelMode, ...data: any[]): void;
    /**
     * 心跳
     * @param dt
     */
    tick(dt: number): void;
    /**
     * 退出关卡
     * @param key
     */
    exit(key: string): void;
    /**
     * 销毁关卡
     * @param key
     */
    destroy(key: string): void;
    private static __instance;
    /**
     * 单例
     */
    static get single(): LevelManager;
}

export { AddToParentQueueSystem, AddToParentSystem, CampComponent, DataComponent, DisplayComponent, ECSComponent, ECSEntity, ECSMatcher, ECSStorage, ECSSystem, ECSWorld, GraphicsComponent, IECSComponent, Level, LevelManager, LevelMode, LevelModeScript, LevelStatus, LinkComponent, LinkSystem, MatcherAllOf, MatcherAnyOf, MatcherNoneOf, NodeComponent, NodeSystem, ParentComponent, RendererRoot2DComponent, SizeComponent, SparseSet, TransformComponent };
