import { IBTNode } from "./IBTNode";



/**
 * 控制节点接口
 */
export interface IBTControlNode extends IBTNode {

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