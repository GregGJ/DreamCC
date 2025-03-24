import { GraphNode } from "../graphs/GraphNode";
import { INodeSearchState } from "./INodeSearchState";



export interface ISearchStatePool {

    /**
     * 创建
     * @param node 
     */
    createNewState(node: GraphNode): INodeSearchState;
    /**
     * 重置
     */
    reset(): void;
}