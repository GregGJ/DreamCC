import { GraphNode } from "./GraphNode";
import { GraphLink } from "./GraphLink";
import { GraphOptions } from "./GraphOptions";
import { Event, EventDispatcher } from "dream-cc-core";

/**
 * 
 */
export class Graph extends EventDispatcher {

    private __options: GraphOptions;
    private __nodes: Map<string, GraphNode>;
    private __links: Map<string, GraphLink>;
    private __multiEdges: { [key: string]: number };
    private createLink: (fromId: string, toId: string, data?: any) => GraphLink;

    constructor(options: GraphOptions) {
        super();
        this.__options = options;
        this.__nodes = new Map<string, GraphNode>();
        this.__links = new Map<string, GraphLink>();
        this.__multiEdges = {};
        if (this.__options.multigraph === undefined) {
            this.__options.multigraph = false;
        }
        this.createLink = this.__options.multigraph ? this.__createUniqueLink : this.__createSingleLink;
    }

    addNode(id: string, data?: any): GraphNode {
        if (id == undefined) {
            throw new Error("Invalid node identifier.");
        }
        let node = this.__nodes.get(id);
        if (!node) {
            node = new GraphNode(id, data);
            this.emit(Event.ADD, node);
        } else {
            node.data = data;
            this.emit(Event.UPDATE, node);
        }
        this.__nodes.set(id, node);
        return node;
    }

    getNode(id: string): GraphNode {
        return this.__nodes.get(id);
    }

    removeNode(id: string): boolean {
        let node = this.getNode(id);
        if (!node) {
            return false;
        }
        let prevLinks = node.links;
        if (prevLinks) {
            node.links = null;
            for (let index = 0; index < prevLinks.length; index++) {
                const link = prevLinks[index];
                this.removeLink(link);
            }
        }
        this.__nodes.delete(id);
        this.emit(Event.REMOVE, node);
        return true;
    }

    addLink(fromId: string, toId: string, data: any): GraphLink {
        let link_id = this.__makeLinkId(fromId, toId);
        if (this.__links.has(link_id)) {
            return this.__links.get(link_id);
        }
        let fromNode = this.getNode(fromId) || this.addNode(fromId);
        let toNode = this.getNode(toId) || this.addNode(toId);

        let link = this.createLink(fromId, toId, data);
        this.__links.set(link_id, link);

        // TODO: this is not cool. On large graphs potentially would consume more memory.
        this.addLinkToNode(fromNode, link);
        if (fromId !== toId) {
            // make sure we are not duplicating links for self-loops
            this.addLinkToNode(toNode, link);
        }
        this.emit(Event.ADD, link);
        return link;
    }

    getLink(fromId: string, toId: string): GraphLink {
        let node = this.getNode(fromId);
        if (!node || !node.links) {
            return null;
        }
        for (let index = 0; index < node.links.length; index++) {
            const link = node.links[index];
            if (link.fromId === fromId && link.toId === toId) {
                return link;
            }
        }
        return null;
    }

    removeLink(link: GraphLink): boolean {
        if (!link) {
            return false;
        }
        if (this.__links.has(link.id)) {
            return false;
        }
        this.__links.delete(link.id);
        let fromNode = this.getNode(link.fromId);
        let toNode = this.getNode(link.toId);
        if (fromNode) {
            const idx = fromNode.links.indexOf(link);
            if (idx >= 0) {
                fromNode.links.splice(idx, 1);
            }
        }
        if (toNode) {
            const idx = toNode.links.indexOf(link);
            if (idx >= 0) {
                toNode.links.splice(idx, 1);
            }
        }
        this.emit(Event.REMOVE, link);
        return true;
    }

    private addLinkToNode(node: GraphNode, link: GraphLink) {
        if (node.links) {
            node.links.push(link);
        } else {
            node.links = [link];
        }
    }

    private __createUniqueLink(fromId: string, toId: string, data?: any): GraphLink {
        var linkId = this.__makeLinkId(fromId, toId);
        var isMultiEdge = this.__multiEdges.hasOwnProperty(linkId);
        if (isMultiEdge || this.getLink(fromId, toId)) {
            if (!isMultiEdge) {
                this.__multiEdges[linkId] = 0;
            }
            var suffix = '@' + (++this.__multiEdges[linkId]);
            linkId = this.__makeLinkId(fromId + suffix, toId + suffix);
        }
        return new GraphLink(fromId, toId, data, linkId);
    }

    private __createSingleLink(fromId: string, toId: string, data?: any): GraphLink {
        var linkId = this.__makeLinkId(fromId, toId);
        return new GraphLink(fromId, toId, data, linkId);
    }

    get nodeCount(): number {
        return this.__nodes.size;
    }

    get linkCount(): number {
        return this.__links.size;
    }

    /**
     * 获取节点链接
     * @param id 
     * @returns 
     */
    getLinks(id: string): Array<GraphLink> {
        let node = this.getNode(id);
        return node ? node.links : null;
    }

    clear(): void {
        while (this.__nodes.size > 0) {
            this.removeNode(this.__nodes.keys().next().value);
        }
        this.__nodes.clear();
        this.__links.clear();
        this.__multiEdges = {};
    }

    forEachNode(callback: (node: GraphNode) => boolean): boolean {
        if (callback == null || callback == undefined) {
            return;
        }
        let values_iterator = this.__nodes.values();
        let next_value = values_iterator.next();
        while (!next_value.done) {
            if (callback(next_value.value)) {
                return true;
            }
            next_value = values_iterator.next();
        }
    }

    forEachLink(callback: (link: GraphLink) => boolean): void {
        if (callback == null || callback == undefined) {
            return;
        }
        let values_iterator = this.__links.values();
        let next_value = values_iterator.next();
        while (!next_value.done) {
            callback(next_value.value);
            next_value = values_iterator.next();
        }
    }

    forEachLinkedNode(nodeId: string, callback: (node: GraphNode, link: GraphLink) => boolean, oriented: boolean): boolean {
        let node = this.getNode(nodeId);
        if (oriented) {
            return this.forEachOrientedLink(node.links, nodeId, callback);
        } else {
            return this.forEachNonOrientedLink(node.links, nodeId, callback);
        }
    }

    forEachNonOrientedLink(links: Array<GraphLink>, nodeId: string, callback: (node: GraphNode, link: GraphLink) => boolean): boolean {
        for (let index = 0; index < links.length; index++) {
            const link = links[index];
            const lined_node_id = link.fromId === nodeId ? link.toId : link.fromId;
            const quit_fast = callback(this.getNode(lined_node_id), link);
            if (quit_fast) {
                return true;
            }
        }
    }

    forEachOrientedLink(links: Array<GraphLink>, nodeId: string, callback: (node: GraphNode, link: GraphLink) => boolean): boolean {
        for (var i = 0; i < links.length; ++i) {
            const link = links[i];
            if (link.fromId === nodeId) {
                const quitFast = callback(this.getNode(link.toId), link)
                if (quitFast) {
                    return true;
                }
            }
        }
    }

    private __makeLinkId(fromId: string, toId: string): string {
        return fromId.toString() + '👉 ' + toId.toString();
    }
}