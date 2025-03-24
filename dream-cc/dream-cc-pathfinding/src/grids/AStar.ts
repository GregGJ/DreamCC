import { DefaultSettings } from "./DefaultSettings";
import { Graph } from "./graphs/Graph";
import { GraphLink } from "./graphs/GraphLink";
import { GraphNode } from "./graphs/GraphNode";
import { NodeHeap } from "./NodeHeap";
import { INodeSearchState } from "./searchs/INodeSearchState";
import { ISearchStatePool } from "./searchs/ISearchStatePool";
import { SearchStatePool } from "./searchs/SearchStatePool";


export class IAStarOptions {
    oriented?: boolean;
    blocked?: (a: GraphNode, b: GraphNode, link: GraphLink) => boolean;
    heuristic?: (a: GraphNode, b: GraphNode) => number;
    distance?: (a: GraphNode, b: GraphNode, link: GraphLink) => number;
}

/**
 * A* 算法
 */
export class AStar {

    private __graph: Graph;

    private __searchPool: ISearchStatePool;

    private __nodeState: Map<string, INodeSearchState>;

    private __openSet: NodeHeap;

    private __oriented: boolean = false;

    private __blocked: (a: GraphNode, b: GraphNode, link: GraphLink) => boolean;
    private __heuristic: (a: GraphNode, b: GraphNode) => number;
    private __distance: (a: GraphNode, b: GraphNode, link: GraphLink) => number;

    constructor(graph: Graph, options: IAStarOptions) {
        this.__oriented = options.oriented || false;
        this.__blocked = options.blocked || DefaultSettings.blocked;
        this.__heuristic = options.heuristic || DefaultSettings.heuristic;
        this.__distance = options.distance || DefaultSettings.distance;
        this.__graph = graph;

        this.__searchPool = new SearchStatePool();

        this.__nodeState = new Map<string, INodeSearchState>();

        this.__openSet = new NodeHeap({
            setNodeId: DefaultSettings.setHeapIndex,
            compare: DefaultSettings.compareFScore
        });
    }
    
    find(fromId: string, toId: string): Array<GraphNode> | null {
        let from = this.__graph.getNode(fromId);
        if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
        let to = this.__graph.getNode(toId);
        if (!to) throw new Error('toId is not defined in this graph: ' + toId);
        this.__searchPool.reset();

        let startNode = this.__searchPool.createNewState(from);
        this.__nodeState.set(from.id, startNode);

        startNode.fScore = this.__heuristic(from, to);

        startNode.distanceToSource = 0;

        this.__openSet.push(startNode);
        startNode.open = 1;

        let cameFrom: INodeSearchState;

        let self = this;
        let visitNeighbour = function (otherNode: GraphNode, link: GraphLink): boolean {
            let other_search_state = self.__nodeState.get(otherNode.id);
            if (!other_search_state) {
                other_search_state = self.__searchPool.createNewState(otherNode);
                self.__nodeState.set(otherNode.id, other_search_state);
            }

            if (other_search_state.closed) {
                return false;
            }

            if (other_search_state.open == 0) {
                self.__openSet.push(other_search_state);
                other_search_state.open = 1;
            }

            if (self.__blocked(otherNode, cameFrom.node, link)) {
                return false;
            }

            let tentativeDistance = cameFrom.distanceToSource + self.__distance(otherNode, cameFrom.node, link);
            if (tentativeDistance >= other_search_state.distanceToSource) {
                return false;
            }

            other_search_state.parent = cameFrom;
            other_search_state.distanceToSource = tentativeDistance;
            other_search_state.fScore = tentativeDistance + self.__heuristic(other_search_state.node, to);

            self.__openSet.updateItem(other_search_state.heapIndex);
        }
        while (this.__openSet.length > 0) {
            cameFrom = this.__openSet.pop();
            if (this.goalReached(cameFrom, to)) {
                return this.reconstructPath(cameFrom);
            }
            cameFrom.closed = true;
            this.__graph.forEachLinkedNode(cameFrom.node.id, visitNeighbour, this.__oriented);
        }
        return null;
    }

    private goalReached(searchState: INodeSearchState, targetNode: GraphNode): boolean {
        return searchState.node === targetNode;
    }

    private reconstructPath(searchState: INodeSearchState): Array<GraphNode> {
        let path = [searchState.node];
        let parent = searchState.parent;
        while (parent) {
            path.push(parent.node);
            parent = parent.parent;
        }
        return path;
    }
}