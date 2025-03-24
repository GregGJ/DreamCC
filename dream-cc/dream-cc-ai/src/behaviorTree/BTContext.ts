import { BTNodeKeys } from "./BTNodeKeys";
import { BTNodeType } from "./BTNodeType";
import { BTControlNode } from "./controls/BTControlNode";
import { BTFallbackNode } from "./controls/BTFallbackNode";
import { BTIfThenElseNode } from "./controls/BTIfThenElseNode";
import { BTParallelNode } from "./controls/BTParallelNode";
import { BTReactiveFallback } from "./controls/BTReactiveFallback";
import { BTReactiveSequence } from "./controls/BTReactiveSequence";
import { BTSequenceNode } from "./controls/BTSequenceNode";
import { BTSequenceStarNode } from "./controls/BTSequenceStarNode";
import { BTWhileDoElseNode } from "./controls/BTWhileDoElseNode";
import { BTDecoratorNode } from "./decorators/BTDecoratorNode";
import { BTDelayNode } from "./decorators/BTDelayNode";
import { BTForceFailureNode } from "./decorators/BTForceFailureNode";
import { BTForceSuccessNode } from "./decorators/BTForceSuccessNode";
import { BTInverterNode } from "./decorators/BTInverterNode";
import { BTKeepRunningUntilFailureNode } from "./decorators/BTKeepRunningUntilFailureNode";
import { BTRepeatNode } from "./decorators/BTRepeatNode";
import { BTRetryNode } from "./decorators/BTRetryNode";
import { BTTimeOutNode } from "./decorators/BTTimeOutNode";
import { IBTNode } from "./interfaces/IBTNode";
import { IBTNodeConfig } from "./interfaces/IBTNodeConfig";



export class BTContext {

    private class_map = new Map<string, new (name: string, blackboard: any) => IBTNode>();

    constructor() {
        this.$init();
    }


    protected $init(): void {
        //controls
        this.register(BTNodeKeys.SEQUENCE, BTSequenceNode);
        this.register(BTNodeKeys.ReactiveSequence, BTReactiveSequence);
        this.register(BTNodeKeys.SequenceStar, BTSequenceStarNode);
        this.register(BTNodeKeys.IfThenElseNode, BTIfThenElseNode);
        this.register(BTNodeKeys.WhileDoElseNode, BTWhileDoElseNode);

        this.register(BTNodeKeys.PARALLEL, BTParallelNode);
        this.register(BTNodeKeys.FALLBACK, BTFallbackNode);
        this.register(BTNodeKeys.ReactiveFallback, BTReactiveFallback);

        this.register(BTNodeKeys.Delay, BTDelayNode);
        this.register(BTNodeKeys.ForceFailure, BTForceFailureNode);
        this.register(BTNodeKeys.ForceSuccess, BTForceSuccessNode);
        this.register(BTNodeKeys.KeepRunningUntilFailure, BTKeepRunningUntilFailureNode);
        this.register(BTNodeKeys.Inverter, BTInverterNode);
        this.register(BTNodeKeys.Repeat, BTRepeatNode);
        this.register(BTNodeKeys.Retry, BTRetryNode);
        this.register(BTNodeKeys.TimeOut, BTTimeOutNode);
    }

    /**
     * 注册节点类
     * @param name 
     * @param clazz 
     */
    register(name: string, clazz: new (name: string, blackboard: any) => IBTNode): void {
        this.class_map.set(name.toLocaleLowerCase(), clazz);
    }

    /**
     * 注销节点类
     * @param name 
     */
    unregister(name: string): void {
        this.class_map.delete(name.toLocaleLowerCase());
    }

    /**
     * 创建节点
     * @param data 
     * @returns 
     */
    createNode<T>(data: IBTNodeConfig, blackboard: any): IBTNode {
        const clazz = this.class_map.get(data.type.toLocaleLowerCase());
        if (!clazz) {
            throw new Error(`${data.name, data.type}节点不存在`);
        }
        let result = new clazz(data.name, blackboard);
        result.init(data);
        const isControl = result.type == BTNodeType.CONTROL;
        const isDecorator = result.type == BTNodeType.DECORATOR;
        if (data.children) {
            for (let index = 0; index < data.children.length; index++) {
                const child_data = data.children[index];
                if (isControl) {
                    const control = result as BTControlNode;
                    control.addChild(this.createNode(child_data, blackboard));
                }
                if (isDecorator) {
                    const decorator = result as BTDecoratorNode;
                    if (index > 0) {
                        throw new Error("装饰节点只能有一个子节点=>" + data);
                    }
                    decorator.setChild(this.createNode(child_data, blackboard));
                }
            }
        }
        return result;
    }

    /**
     * 清理
     */
    clear(): void {
        this.class_map.clear();
    }

    destroy(): void {
        this.clear();
    }
}