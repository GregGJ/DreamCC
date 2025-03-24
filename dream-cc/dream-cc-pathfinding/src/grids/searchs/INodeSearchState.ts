import { GraphNode } from "../graphs/GraphNode";



export interface INodeSearchState {
    node: GraphNode;
    parent: INodeSearchState;
    closed: boolean;
    open: number;
    distanceToSource: number;
    fScore: number;
    heapIndex: number;
}