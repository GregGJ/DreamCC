import { DDLSPoint2D } from "../math/DDLSPoint2D";
import { DDLSGraphEdge } from "./DDLSGraphEdge";


export class DDLSGraphNode {

	private static INC: number = 0;
	private _id: number;

	private _prev: DDLSGraphNode;
	private _next: DDLSGraphNode;

	private _outgoingEdge: DDLSGraphEdge;
	private _successorNodes: Map<number,DDLSGraphEdge>;

	private _data: { index: number, point: DDLSPoint2D };

	constructor() {
		this._id = DDLSGraphNode.INC;
		DDLSGraphNode.INC++;

		this._successorNodes = new Map<number,DDLSGraphEdge>();
	}

	get id(): number {
		return this._id;
	}

	dispose(): void {
		this._prev = null;
		this._next = null;
		this._outgoingEdge = null;
		this._successorNodes = null;
		this._data = null;
	}

	get prev(): DDLSGraphNode {
		return this._prev;
	}

	set prev(value: DDLSGraphNode) {
		this._prev = value;
	}

	get next(): DDLSGraphNode {
		return this._next;
	}

	set next(value: DDLSGraphNode) {
		this._next = value;
	}

	get outgoingEdge(): DDLSGraphEdge {
		return this._outgoingEdge;
	}

	set outgoingEdge(value: DDLSGraphEdge) {
		this._outgoingEdge = value;
	}

	get successorNodes(): Map<number,DDLSGraphEdge> {
		return this._successorNodes;
	}

	set successorNodes(value: Map<number,DDLSGraphEdge>) {
		this._successorNodes = value;
	}

	get data(): { index: number, point: DDLSPoint2D } {
		return this._data;
	}

	set data(value: { index: number, point: DDLSPoint2D }) {
		this._data = value;
	}
}
