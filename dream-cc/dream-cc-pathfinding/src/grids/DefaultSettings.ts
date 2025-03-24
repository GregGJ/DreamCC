import { GraphLink } from "./graphs/GraphLink";
import { GraphNode } from "./graphs/GraphNode";
import { NodeSearchState } from "./searchs/NodeSearchState";


export class DefaultSettings {


    /**
    * 是否阻塞
    */
    static __blocked: (a: GraphNode, b: GraphNode, link: GraphLink) => boolean;
    static get blocked(): (a: GraphNode, b: GraphNode, link: GraphLink) => boolean {
        if (!this.__blocked) {
            return this.defaultBlocked;
        }
        return this.__blocked;
    }

    static set blocked(value: (a: GraphNode, b: GraphNode, link: GraphLink) => boolean) {
        this.__blocked = value;
    }

    private static defaultBlocked(a: GraphNode, b: GraphNode, link: GraphLink): boolean {
        return false;
    }


    static __heuristic: (a: GraphNode, b: GraphNode) => number;
    /**
     * 启发式代价函数
     */
    static get heuristic(): (a: GraphNode, b: GraphNode) => number {
        if (!this.__heuristic) {
            return this.defaultHeuristic;
        }
        return this.__heuristic;
    }

    static set heuristic(value: (a: GraphNode, b: GraphNode) => number) {
        this.__heuristic = value;
    }

    private static defaultHeuristic(a: GraphNode, b: GraphNode): number {
        return 0;
    }

    static __distance: (a: GraphNode, b: GraphNode, link: GraphLink) => number;
    /**
     * 路径距离函数
     */
    static get distance(): (a: GraphNode, b: GraphNode, link: GraphLink) => number {
        if (!this.__distance) {
            return this.defaultDistance;
        }
        return this.__distance;
    }

    static set distance(value: (a: GraphNode, b: GraphNode, link: GraphLink) => number) {
        this.__distance = value;
    }

    private static defaultDistance(a: GraphNode, b: GraphNode, link: GraphLink): number {
        return 1;
    }

    static __compareFScore: (a: NodeSearchState, b: NodeSearchState) => number;
    /**
     * 比较fScore
     */
    static get compareFScore(): (a: NodeSearchState, b: NodeSearchState) => number {
        if (!this.__compareFScore) {
            return this.defaultCompareFScore;
        }
        return this.__compareFScore;
    }

    static set compareFScore(value: (a: NodeSearchState, b: NodeSearchState) => number) {
        this.__compareFScore = value;
    }

    private static defaultCompareFScore(a: NodeSearchState, b: NodeSearchState): number {
        return a.fScore - b.fScore;
    }

    static __setHeapIndex: (state: NodeSearchState, heapIndex: number) => void;

    static get setHeapIndex(): (state: NodeSearchState, heapIndex: number) => void {
        if (!this.__setHeapIndex) {
            return this.defaultSetHeapIndex;
        }
        return this.__setHeapIndex;
    }

    static set setHeapIndex(value: (state: NodeSearchState, heapIndex: number) => void) {
        this.__setHeapIndex = value;
    }

    private static defaultSetHeapIndex(state: NodeSearchState, heapIndex: number): void {
        state.heapIndex = heapIndex;
    }
}