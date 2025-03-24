import { ECSComponent } from "dream-cc-ecs";
import { BTContext } from "../BTContext";
import { IBTNode } from "../interfaces/IBTNode";
import { IBTNodeConfig } from "../interfaces/IBTNodeConfig";


/**
 * 行为树组件
 */
export class BehaviorTreeComponent extends ECSComponent {
    /**
     * 帧间隔
     */
    frameInterval: number = 50;

    lastTime: number = 0;

    debug: boolean = false;
    /**
     * 行为树的上下文
     */
    context: BTContext;
    /**行为树根节点 */
    root: IBTNode;

    constructor() {
        super();
    }

    /**
     * 初始化
     * @param context 
     */
    init(context: BTContext, data?: IBTNodeConfig, blackboard?: any) {
        this.context = context;
        if (data) {
            this.setData(data, blackboard);
        }
    }

    /**
     * 设置
     * @param data 
     * @param blackboard 
     */
    setData(data: IBTNodeConfig, blackboard: any): void {
        let old = this.root;
        let bb = blackboard ? blackboard : old.blackboard;
        this.root = this.context.createNode(data, bb);
        //清理老的
        if (old) {
            old.destroy();
        }
    }

    /**
     * 黑板
     */
    get blackboard(): any {
        if (!this.root) {
            return null;
        }
        return this.root.blackboard;
    }

    reset(): void {
        if (this.root) {
            this.root.destroy();
            this.root = null;
        }
    }

    destroy(): boolean {
        let result = super.destroy();
        if (this.root) {
            this.root.destroy();
            this.root = null;
        }
        this.context = null;
        return result;
    }
}