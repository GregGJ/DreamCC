import { DDLSGraphNode } from "./DDLSGraphNode";

export class DDLSGraphEdge {

	private static INC: number = 0;
	private _id: number;

	private _prev: DDLSGraphEdge;
	private _next: DDLSGraphEdge;

	private _rotPrevEdge: DDLSGraphEdge;
	private _rotNextEdge: DDLSGraphEdge;
	private _oppositeEdge: DDLSGraphEdge;
	private _sourceNode: DDLSGraphNode;
	private _destinationNode: DDLSGraphNode;

	private _data: { sumDistancesSquared: number, length: number, nodesCount: number };

	constructor() {
		this._id = DDLSGraphEdge.INC;
		DDLSGraphEdge.INC++;
	}

	get id(): number {
		return this._id;
	}

	dispose(): void {
		this._prev = null;
		this._next = null;
		this._rotNextEdge = null;
		this._rotNextEdge = null;
		this._oppositeEdge = null;
		this._sourceNode = null;
		this._destinationNode;
		this._data = null;
	}

	get prev(): DDLSGraphEdge {
		return this._prev;
	}

	set prev(value: DDLSGraphEdge) {
		this._prev = value;
	}

	get next(): DDLSGraphEdge {
		return this._next;
	}

	set next(value: DDLSGraphEdge) {
		this._next = value;
	}

	get rotPrevEdge(): DDLSGraphEdge {
		return this._rotPrevEdge;
	}

	set rotPrevEdge(value: DDLSGraphEdge) {
		this._rotPrevEdge = value;
	}

	get rotNextEdge(): DDLSGraphEdge {
		return this._rotNextEdge;
	}

	set rotNextEdge(value: DDLSGraphEdge) {
		this._rotNextEdge = value;
	}

	get oppositeEdge(): DDLSGraphEdge {
		return this._oppositeEdge;
	}

	set oppositeEdge(value: DDLSGraphEdge) {
		this._oppositeEdge = value;
	}

	get sourceNode(): DDLSGraphNode {
		return this._sourceNode;
	}

	set sourceNode(value: DDLSGraphNode) {
		this._sourceNode = value;
	}

	get destinationNode(): DDLSGraphNode {
		return this._destinationNode;
	}

	set destinationNode(value: DDLSGraphNode) {
		this._destinationNode = value;
	}

	get data(): { sumDistancesSquared: number, length: number, nodesCount: number } {
		return this._data;
	}

	set data(value: { sumDistancesSquared: number, length: number, nodesCount: number }) {
		this._data = value;
	}
}
