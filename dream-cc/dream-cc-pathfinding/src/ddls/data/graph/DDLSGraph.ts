import { DDLSGraphEdge } from "./DDLSGraphEdge";
import { DDLSGraphNode } from "./DDLSGraphNode";


export class DDLSGraph {

	private static INC: number = 0;
	private _id: number;

	private _node: DDLSGraphNode;
	private _edge: DDLSGraphEdge;

	constructor() {
		this._id = DDLSGraph.INC;
		DDLSGraph.INC++;
	}

	get id(): number {
		return this._id;
	}

	dispose(): void {
		while (this._node) {
			this.deleteNode(this._node);
		}
	}

	get edge(): DDLSGraphEdge {
		return this._edge;
	}

	get node(): DDLSGraphNode {
		return this._node;
	}

	insertNode(): DDLSGraphNode {
		let node: DDLSGraphNode = new DDLSGraphNode();
		if (this._node) {
			node.next = this._node;
			this._node.prev = node;
		}
		this._node = node;

		return node;
	}

	deleteNode(node: DDLSGraphNode): void {
		while (node.outgoingEdge) {
			if (node.outgoingEdge.oppositeEdge) {
				this.deleteEdge(node.outgoingEdge.oppositeEdge);
			}
			this.deleteEdge(node.outgoingEdge);
		}

		let otherNode: DDLSGraphNode = this._node;
		let incomingEdge: DDLSGraphEdge;
		while (otherNode) {
			incomingEdge = otherNode.successorNodes.get(node.id);
			if (incomingEdge) {
				this.deleteEdge(incomingEdge);
			}
			otherNode = otherNode.next;
		}

		if (this._node == node) {
			if (node.next) {
				node.next.prev = null;
				this._node = node.next;
			}
			else {
				this._node = null;
			}
		}
		else {
			if (node.next) {
				node.prev.next = node.next;
				node.next.prev = node.prev;
			}
			else {
				node.prev.next = null;
			}
		}

		node.dispose();
	}

	insertEdge(fromNode: DDLSGraphNode, toNode: DDLSGraphNode): DDLSGraphEdge {
		if (fromNode.successorNodes.has(toNode.id))
			return null;

		let edge: DDLSGraphEdge = new DDLSGraphEdge();
		if (this._edge) {
			this._edge.prev = edge;
			edge.next = this._edge;
		}
		this._edge = edge;

		edge.sourceNode = fromNode;
		edge.destinationNode = toNode;
		fromNode.successorNodes.set(toNode.id, edge);
		if (fromNode.outgoingEdge) {
			fromNode.outgoingEdge.rotPrevEdge = edge;
			edge.rotNextEdge = fromNode.outgoingEdge;
			fromNode.outgoingEdge = edge;
		}
		else {
			fromNode.outgoingEdge = edge;
		}

		let oppositeEdge: DDLSGraphEdge = toNode.successorNodes.get(fromNode.id);
		if (oppositeEdge) {
			edge.oppositeEdge = oppositeEdge;
			oppositeEdge.oppositeEdge = edge;
		}

		return edge;
	}

	deleteEdge(edge: DDLSGraphEdge): void {
		edge.sourceNode.successorNodes.delete(edge.destinationNode.id);

		if (this._edge == edge) {
			if (edge.next) {
				edge.next.prev = null;
				this._edge = edge.next;
			}
			else {
				this._edge = null;
			}
		}
		else {
			if (edge.next) {
				edge.prev.next = edge.next;
				edge.next.prev = edge.prev;
			}
			else {
				edge.prev.next = null;
			}
		}

		if (edge.sourceNode.outgoingEdge == edge) {
			if (edge.rotNextEdge) {
				edge.rotNextEdge.rotPrevEdge = null;
				edge.sourceNode.outgoingEdge = edge.rotNextEdge;
			}
			else {
				edge.sourceNode.outgoingEdge = null;
			}
		}
		else {
			if (edge.rotNextEdge) {
				edge.rotPrevEdge.rotNextEdge = edge.rotNextEdge;
				edge.rotNextEdge.rotPrevEdge = edge.rotPrevEdge;
			}
			else {
				edge.rotPrevEdge.rotNextEdge = null;
			}
		}

		edge.dispose();
	}

}