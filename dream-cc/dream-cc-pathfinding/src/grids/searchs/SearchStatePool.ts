import { GraphNode } from "../graphs/GraphNode";
import { INodeSearchState } from "./INodeSearchState";
import { NodeSearchState } from "./NodeSearchState";


export class SearchStatePool {
    
    currentInCache: number = 0;
    nodeCache: INodeSearchState[] = [];

    createNewState(node: GraphNode): NodeSearchState {
        let cached = this.nodeCache[this.currentInCache];
        if (cached) {
            cached.node = node;
            cached.parent = null;
            cached.closed = false;
            cached.open = 0;

            cached.distanceToSource = Number.POSITIVE_INFINITY;
            // the f(n) = g(n) + h(n) value
            cached.fScore = Number.POSITIVE_INFINITY;
            cached.heapIndex = -1;
        } else {
            cached = new NodeSearchState(node);
            this.nodeCache[this.currentInCache] = cached;
        }
        this.currentInCache++;
        return cached;
    }

    reset(): void {
        this.currentInCache = 0;
    }
}