import { EventDispatcher } from 'dream-cc-core';
import { ECSComponent, ECSSystem, ECSEntity } from 'dream-cc-ecs';

/**
 * 行为树黑板
 */
declare class BTBlackboard extends EventDispatcher {
    private __datas;
    constructor();
    /**
     * 获取数据
     * @param key
     * @returns
     */
    get<T>(key: any): T;
    /**
     * 判断是否存在数据
     * @param key
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
    /**
     * 清理数据
     */
    clear(): void;
    /**
     * 销毁
     * @returns
     */
    destroy(): boolean;
}

/**
 * 节点状态
 */
declare enum BTNodeStatus {
    /**初始状态 */
    IDLE = 0,
    /**失败 */
    FAILURE = 1,
    /**成功 */
    SUCCESS = 2,
    /**运行中 */
    RUNNING = 3
}

/**
 * 节点类型
 */
declare enum BTNodeType {
    ERROR = 0,
    CONTROL = 1,
    DECORATOR = 2,
    ACTION = 3,
    CONDITION = 4
}

/**
 * 节点接口
 */
interface IBTNode {
    /**名称 */
    name: string;
    /**父节点 */
    parent: IBTNode | null;
    /**黑板 */
    blackboard: any;
    /**状态 */
    status: BTNodeStatus;
    /**初始化 */
    init(data: any): void;
    /**评估*/
    evaluate(): BTNodeStatus;
    /**执行*/
    tick(): BTNodeStatus | Promise<BTNodeStatus>;
    /**停止*/
    halt(): void;
    /**销毁 */
    destroy(): void;
    /**类型 */
    readonly type: BTNodeType;
}

interface IBTNodeConfig {
    name: string;
    type: string;
    children?: IBTNodeConfig[];
}

declare abstract class BTNode implements IBTNode {
    /**名称 */
    name: string;
    /**父节点*/
    parent: IBTNode | null;
    /**黑板 */
    blackboard: BTBlackboard;
    /**状态 */
    protected $status: BTNodeStatus;
    constructor(name: string, blackboard: BTBlackboard);
    init(data: IBTNodeConfig): void;
    evaluate(): BTNodeStatus;
    abstract tick(): BTNodeStatus | Promise<BTNodeStatus>;
    abstract halt(): void;
    destroy(): void;
    /**获取状态*/
    get status(): BTNodeStatus;
    set status(value: BTNodeStatus);
    get type(): BTNodeType;
}

/**
 * 动作节点基础类
 */
declare abstract class BTActionNode extends BTNode {
    constructor(name: string, blackboard: BTBlackboard);
    get type(): BTNodeType;
}

/**
* 异步动作节点基础类
*/
declare abstract class BTAsyncActionNode extends BTActionNode {
    private halt_requested;
    constructor(name: string, blackboard: BTBlackboard);
    evaluate(): BTNodeStatus;
    isHaltRequested(): boolean;
    halt(): void;
}

declare abstract class BTCoroActionNode extends BTActionNode {
    private yield;
    constructor(name: string, blackboard: BTBlackboard);
    setStatusRunningAndYield(): void;
    evaluate(): BTNodeStatus;
    halt(): void;
}

declare class BTSimpleActionNode extends BTAsyncActionNode {
    protected tickFunctor: (node: IBTNode) => BTNodeStatus;
    constructor(name: string, blackboard: BTBlackboard, tickFunctor: (node: IBTNode) => BTNodeStatus);
    tick(): BTNodeStatus;
}

/**
 * 状态类动作节点
 */
declare abstract class BTStatefulActionNode extends BTActionNode {
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
    halt(): void;
    /**进入*/
    abstract onEnter(): BTNodeStatus;
    /**tick */
    abstract onTick(): BTNodeStatus;
    /**退出 */
    abstract onExit(): void;
    /**被打断 */
    onHalted(): void;
}

/**
* 同步动作节点
*/
declare abstract class BTSyncActionNode extends BTActionNode {
    constructor(name: string, blackboard: BTBlackboard);
    evaluate(): BTNodeStatus;
    halt(): void;
}

/**
* 条件节点
*/
declare abstract class BTConditionNode extends BTNode {
    constructor(name: string, blackboard: BTBlackboard);
    halt(): void;
    get type(): BTNodeType;
}

/**
* 简单条件节点
*/
declare class BTSimpleConditionNode extends BTConditionNode {
    protected tick_functor: (node: IBTNode) => BTNodeStatus;
    constructor(name: string, blackboard: BTBlackboard, tick_functor: (node: IBTNode) => BTNodeStatus);
    tick(): BTNodeStatus;
}

/**
 * 控制节点接口
 */
interface IBTControlNode extends IBTNode {
    /**
     * 子节点数量
     */
    readonly numChildren: number;
    /**
     * 添加一个节点
     * @param child
     */
    addChild(child: IBTNode): void;
    /**
     * 获取指定节点
     * @param idx
     */
    getChild(idx: number): IBTNode;
    /**
     * 停止一个节点
     * @param idx
     */
    haltChild(idx: number): void;
    /**
     * 停止所有子节点
     */
    haltChildren(): void;
}

/**
 * 控制节点
 */
declare abstract class BTControlNode extends BTNode implements IBTControlNode {
    protected $children: IBTNode[];
    constructor(name: string, blackboard: BTBlackboard);
    addChild(child: IBTNode): void;
    getChild(idx: number): IBTNode;
    halt(): void;
    haltChild(idx: number): void;
    haltChildren(start?: number): void;
    destroy(): void;
    get numChildren(): number;
    get type(): BTNodeType;
}

/**
 * 在勾选第一个子节点之前，节点状态变为RUNNING。
 * 如果一个子节点返回FAILURE，则回退标记下一个子节点。
 * 如果最后一个子进程也返回FAILURE，那么所有的子进程都停止，回退进程返回FAILURE。
 * 如果子进程返回SUCCESS，则停止并返回SUCCESS。所有的孩子都停下来了。
 */
declare class BTFallbackNode extends BTControlNode {
    private __current_child_idx;
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
    halt(): void;
}

/**
 * 有2或3个子节点，node1就是if判断的条件。
 * 如果node1返回SUCCESS，那么node2执行；
 * 否则，node3执行。
 * 如果没有node3，返回FAILURE。
 * 该结点not reactive，
 * 体现在一旦node1不返回RUNNING了，就进入了node2或node3的执行，以后tick()不会再执行node1了，也即不会再检查if条件的变化。
 */
declare class BTIfThenElseNode extends BTControlNode {
    private __child_idx;
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
    halt(): void;
}

/**
 * 当返回SUCCESS的子节点个数>=THRESHOLD_SUCCESS时，返回SUCCESS。
 * 当返回FAILURE的子节点个数>=THRESHOLD_FAILURE时，返回FAILURE。
 * 当程序判断绝不可能SUCCESS时，返回FAILURE。如 failure_children_num > children_count - success_threshold_。
 */
declare class BTParallelNode extends BTControlNode {
    private success_threshold;
    private failure_threshold;
    private __skip_list;
    constructor(name: string, blackboard: BTBlackboard);
    init(data: IBTNodeConfig): void;
    tick(): BTNodeStatus;
    halt(): void;
    destroy(): void;
}

/**
 * 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点会再次执行，reactive所在。
 * 如果某个子节点返回SUCCESS，不再执行，且返回SUCCESS。
 * 如果某个子节点返回FAILURE，立即执行下一个子节点（不会等下一次tick()）。如果所有子节点返回FAILURE，返回FAILURE。
 */
declare class BTReactiveFallback extends BTControlNode {
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
}

/**
 * 按从左到右的顺序依次执行子节点。
 * 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点不会再执行。
 * 如果某个子节点返回SUCCESS，立即执行下一个子节点（不会等下一次tick()）。
 * 如果所有子节点返回SUCCESS，返回SUCCESS。
 */
declare class BTSequenceNode extends BTControlNode {
    private __current_index;
    constructor(name: string, blackboard: BTBlackboard);
    halt(): void;
    tick(): BTNodeStatus;
}

/**
 * 同SequenceNode，不同之处在于如果某个子节点返回FAILURE，返回FAILURE，终止所有节点的执行。
 * 但不复位current_child_idx_。所以当再次tick()时，从FAILURE的子节点开始。
 */
declare class BTSequenceStarNode extends BTControlNode {
    private __current_index;
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
}

/**
 * 是IfThenElseNode的reactive版本。
 * reactive体现在每次tick()都会执行node1，即检查if条件的变化。
 * 若node1返回值有SUCCESS、FAILURE的切换变化，就会打断node2或node3的执行，重新选择对应的node。
 */
declare class BTWhileDoElseNode extends BTControlNode {
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
}

/**
 * 装饰节点
 */
declare abstract class BTDecoratorNode extends BTNode {
    protected $child: IBTNode | null;
    constructor(name: string, blackboard: BTBlackboard);
    /**
     * 设置子节点
     * @param child
     */
    setChild(child: IBTNode): void;
    getChild(): IBTNode | null;
    halt(): void;
    haltChild(): void;
    destroy(): void;
    get type(): BTNodeType;
}

/**
 * 延迟指定时间后执行子节点
 */
declare class BTDelayNode extends BTDecoratorNode {
    private delay_started;
    private delay_complete;
    private delay_aborted;
    /**定时器句柄*/
    time_handler: number | undefined;
    /**延迟时间 */
    private delayTime;
    constructor(name: string, blackboard: BTBlackboard);
    init(data: IBTNodeConfig): void;
    tick(): BTNodeStatus;
    /**
     * 延迟结束
     */
    private __timeOut;
    halt(): void;
}

/**
 * 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回FAILURE，即强制返回失败状态。
 */
declare class BTForceFailureNode extends BTDecoratorNode {
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
}

/**
 * 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回SUCCESS，即强制返回成功状态。
 */
declare class BTForceSuccessNode extends BTDecoratorNode {
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
}

/**
 * 如果子节点执行后返回RUNNING，该节点返回RUNNING；
 * 如果子节点执行后返回SUCCESS，该节点返回FAILURE；
 * 如果子节点执行后返回FAILURE，该节点返回SUCCESS；
 * 即对子节点的执行结果取反。
 */
declare class BTInverterNode extends BTDecoratorNode {
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
}

/**
 * 如果子节点执行后返回RUNNING或SUCCESS，下次tick()继续执行子节点，直到子节点返回FAILURE。
 */
declare class BTKeepRunningUntilFailureNode extends BTDecoratorNode {
    constructor(name: string, blackboard: BTBlackboard);
    tick(): BTNodeStatus;
}

/**
 * 重复执行子节点NUM_CYCLES 次，若每次都返回 SUCCESS，该节点返回SUCCESS；
 * 若子节点某次返回FAILURE，该节点不再重复执行子节点，立即返回FAILURE；
 * 若子节点返回RUNNING，该节点也返回RUNNING。
 */
declare class BTRepeatNode extends BTDecoratorNode {
    private num_cycles;
    private try_index;
    constructor(name: string, blackboard: BTBlackboard);
    init(data: IBTNodeConfig): void;
    tick(): BTNodeStatus;
    halt(): void;
}

/**
 * 如果子节点执行后返回RUNNING，该节点返回RUNNING；
 * 如果子节点执行后返回SUCCESS，该节点返回SUCCESS，不再执行；
 * 如果子节点执行后返回FAILURE，该节点再次尝试执行子节点，直到尝试了num_attempts次；
 */
declare class BTRetryNode extends BTDecoratorNode {
    private max_attempts_;
    private try_index;
    constructor(name: string, blackboard: BTBlackboard);
    init(data: IBTNodeConfig): void;
    halt(): void;
    tick(): BTNodeStatus;
}

/**
 * 在设置的msec 毫秒内，返回子节点执行的状态。
 * 若子节点返回FAILURE或SUCCESS，不再执行。
 * 如果超时，终止子节点执行，并返回FAILURE。
 */
declare class BTTimeOutNode extends BTDecoratorNode {
    private timerHandler;
    private child_halted;
    private msec;
    private timeout_started;
    constructor(name: string, blackboard: BTBlackboard);
    init(data: IBTNodeConfig): void;
    tick(): BTNodeStatus;
}

/**
 * 行为树
 */
declare class BTUtils {
    /**
     * 递归遍历行为树节点，并对每个节点执行指定函数。
     *
     * @param root 行为树根节点。
     * @param visitor 访问函数，用于处理每个节点。
     * @throws 当根节点为null时，抛出异常。
     */
    static applyRecursiveVisitor<T>(root: IBTNode, visitor: (node: IBTNode) => void): void;
    /**
     * 递归打印树形结构
     *
     * @param root 树的根节点
     * @returns 返回树的字符串表示
     */
    static printTreeRecursively<T>(root: IBTNode): string;
}

declare class BTContext {
    private class_map;
    constructor();
    protected $init(): void;
    /**
     * 注册节点类
     * @param name
     * @param clazz
     */
    register(name: string, clazz: new (name: string, blackboard: any) => IBTNode): void;
    /**
     * 注销节点类
     * @param name
     */
    unregister(name: string): void;
    /**
     * 创建节点
     * @param data
     * @returns
     */
    createNode<T>(data: IBTNodeConfig, blackboard: any): IBTNode;
    /**
     * 清理
     */
    clear(): void;
    destroy(): void;
}

/**
 * 节点KEY
 */
declare enum BTNodeKeys {
    /**
     * 按从左到右的顺序依次执行子节点。
     * 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点不会再执行。
     * 如果某个子节点返回SUCCESS，立即执行下一个子节点（不会等下一次tick()）。
     * 如果所有子节点返回SUCCESS，返回SUCCESS。
     */
    SEQUENCE = "sequence",
    /**
     * 尝试依次执行其所有子节点，并且每个子节点只有在成功执行后才会继续到下一个。
     * 如果任何一个子节点失败，整个序列失败。
     */
    ReactiveSequence = "reactiveSequence",
    /** 同SequenceNode，不同之处在于如果某个子节点返回FAILURE，返回FAILURE，终止所有节点的执行。
    * 但不复位current_child_idx_。所以当再次tick()时，从FAILURE的子节点开始。 */
    SequenceStar = "sequenceStar",
    /**
     * 当返回SUCCESS的子节点个数>=THRESHOLD_SUCCESS时，返回SUCCESS。
     * 当返回FAILURE的子节点个数>=THRESHOLD_FAILURE时，返回FAILURE。
     * 当程序判断绝不可能SUCCESS时，返回FAILURE。如 failure_children_num > children_count - success_threshold_。
     */
    PARALLEL = "parallel",
    /**
    * 在勾选第一个子节点之前，节点状态变为RUNNING。
    * 如果一个子节点返回FAILURE，则回退标记下一个子节点。
    * 如果最后一个子进程也返回FAILURE，那么所有的子进程都停止，回退进程返回FAILURE。
    * 如果子进程返回SUCCESS，则停止并返回SUCCESS。所有的孩子都停下来了。
    */
    FALLBACK = "fallback",
    /**
    * 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点会再次执行，reactive所在。
    * 如果某个子节点返回SUCCESS，不再执行，且返回SUCCESS。
    * 如果某个子节点返回FAILURE，立即执行下一个子节点（不会等下一次tick()）。如果所有子节点返回FAILURE，返回FAILURE。
    */
    ReactiveFallback = "reactiveFallback",
    /**
    * 有2或3个子节点，node1就是if判断的条件。
    * 如果node1返回SUCCESS，那么node2执行；
    * 否则，node3执行。
    * 如果没有node3，返回FAILURE。
    * 该结点not reactive，
    * 体现在一旦node1不返回RUNNING了，就进入了node2或node3的执行，以后tick()不会再执行node1了，也即不会再检查if条件的变化。
    */
    IfThenElseNode = "ifThenElse",
    /**
    * 是IfThenElseNode的reactive版本。
    * reactive体现在每次tick()都会执行node1，即检查if条件的变化。
    * 若node1返回值有SUCCESS、FAILURE的切换变化，就会打断node2或node3的执行，重新选择对应的node。
    */
    WhileDoElseNode = "whileDoElse",
    /**
     * 延迟指定时间后执行子节点
     */
    Delay = "delay",
    /**
    * 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回FAILURE，即强制返回失败状态。
    */
    ForceFailure = "forceFailure",
    /**
    * 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回SUCCESS，即强制返回成功状态。
    */
    ForceSuccess = "forceSuccess",
    /**
    * 如果子节点执行后返回RUNNING，该节点返回RUNNING；
    * 如果子节点执行后返回SUCCESS，该节点返回FAILURE；
    * 如果子节点执行后返回FAILURE，该节点返回SUCCESS；
    * 即对子节点的执行结果取反。
    */
    Inverter = "inverter",
    /**
    * 如果子节点执行后返回RUNNING或SUCCESS，下次tick()继续执行子节点，直到子节点返回FAILURE。
    */
    KeepRunningUntilFailure = "keepRunningUntilFailure",
    /**
    * 重复执行子节点NUM_CYCLES 次，若每次都返回 SUCCESS，该节点返回SUCCESS；
    * 若子节点某次返回FAILURE，该节点不再重复执行子节点，立即返回FAILURE；
    * 若子节点返回RUNNING，该节点也返回RUNNING。
    */
    Repeat = "repeat",
    /**
    * 如果子节点执行后返回RUNNING，该节点返回RUNNING；
    * 如果子节点执行后返回SUCCESS，该节点返回SUCCESS，不再执行；
    * 如果子节点执行后返回FAILURE，该节点再次尝试执行子节点，直到尝试了num_attempts次；
    */
    Retry = "retry",
    /**
    * 在设置的msec 毫秒内，返回子节点执行的状态。
    * 若子节点返回FAILURE或SUCCESS，不再执行。
    * 如果超时，终止子节点执行，并返回FAILURE。
    */
    TimeOut = "timeout"
}

/**
 * 行为树组件
 */
declare class BehaviorTreeComponent extends ECSComponent {
    /**
     * 帧间隔
     */
    frameInterval: number;
    lastTime: number;
    debug: boolean;
    /**
     * 行为树的上下文
     */
    context: BTContext;
    /**行为树根节点 */
    root: IBTNode;
    constructor();
    /**
     * 初始化
     * @param context
     */
    init(context: BTContext, data?: IBTNodeConfig, blackboard?: any): void;
    /**
     * 设置
     * @param data
     * @param blackboard
     */
    setData(data: IBTNodeConfig, blackboard: any): void;
    /**
     * 黑板
     */
    get blackboard(): any;
    reset(): void;
    destroy(): boolean;
}

/**
 * 行为树系统
 */
declare class BehaviorTreeSystem extends ECSSystem {
    constructor();
    protected $tick(entitys: Set<ECSEntity>, dt: number): void;
}

/**
 * 状态接口
 */
interface IState {
    name: string;
    /**初始化 */
    init(fsm: FSM): void;
    /**进入 */
    enter(data?: any): void;
    /**心跳 */
    tick(dt: number): void;
    /**退出 */
    exit(): void;
    /**销毁 */
    destroy(): void;
}

/**
 * 状态机
 */
declare class FSM extends EventDispatcher {
    /**所属*/
    owner: any;
    debug: boolean;
    private __current;
    private __state;
    private __states;
    private __name;
    constructor(owner: any, name: string);
    tick(dt: number): void;
    /**
     * 添加
     * @param key
     * @param v
     */
    addState(key: number, v: IState): void;
    /**
     * 切换状态
     * @param value
     * @param data
     * @returns
     */
    switchState(value: number, data?: any): void;
    get state(): number;
    get current(): IState;
    destroy(): boolean;
}

declare class FSMComponent extends ECSComponent {
    /**
     * 状态机
     */
    fsm: FSM;
    constructor();
    destroy(): boolean;
}

declare class FSMSystem extends ECSSystem {
    constructor();
    protected $tick(entitys: Set<ECSEntity>, dt: number): void;
}

export { BTActionNode, BTAsyncActionNode, BTBlackboard, BTConditionNode, BTContext, BTControlNode, BTCoroActionNode, BTDecoratorNode, BTDelayNode, BTFallbackNode, BTForceFailureNode, BTForceSuccessNode, BTIfThenElseNode, BTInverterNode, BTKeepRunningUntilFailureNode, BTNode, BTNodeKeys, BTNodeStatus, BTNodeType, BTParallelNode, BTReactiveFallback, BTRepeatNode, BTRetryNode, BTSequenceNode, BTSequenceStarNode, BTSimpleActionNode, BTSimpleConditionNode, BTStatefulActionNode, BTSyncActionNode, BTTimeOutNode, BTUtils, BTWhileDoElseNode, BehaviorTreeComponent, BehaviorTreeSystem, FSM, FSMComponent, FSMSystem, IBTControlNode, IBTNode, IBTNodeConfig, IState };
