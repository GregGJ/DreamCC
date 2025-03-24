import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSVertex } from "../data/DDLSVertex";


export class IteratorFromVertexToIncomingEdges {

	private _fromVertex: DDLSVertex;
	private _nextEdge: DDLSEdge;

	constructor() {

	}

	set fromVertex(value: DDLSVertex) {
		this._fromVertex = value;
		this._nextEdge = this._fromVertex.edge;
		while (!this._nextEdge.isReal) {
			this._nextEdge = this._nextEdge.rotLeftEdge;
		}
	}

	private _resultEdge: DDLSEdge;

	next(): DDLSEdge {
		if (this._nextEdge) {
			this._resultEdge = this._nextEdge.oppositeEdge;
			do {
				this._nextEdge = this._nextEdge.rotLeftEdge;
				if (this._nextEdge == this._fromVertex.edge) {
					this._nextEdge = null;
					break;
				}
			}
			while (!this._nextEdge.isReal)
		}
		else {
			this._resultEdge = null;
		}

		return this._resultEdge;
	}

}