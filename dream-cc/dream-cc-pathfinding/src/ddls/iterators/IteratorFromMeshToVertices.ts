import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSVertex } from "../data/DDLSVertex";


export class IteratorFromMeshToVertices {

	private _fromMesh: DDLSMesh;
	private _currIndex: number;

	constructor() {

	}

	set fromMesh(value: DDLSMesh) {
		this._fromMesh = value;
		this._currIndex = 0;
	}

	private _resultVertex: DDLSVertex;

	next(): DDLSVertex {
		do {
			if (this._currIndex < this._fromMesh.__vertices.length) {
				this._resultVertex = this._fromMesh.__vertices[this._currIndex];
				this._currIndex++;
			}
			else {
				this._resultVertex = null;
				break;
			}
		}
		while (!this._resultVertex.isReal)

		return this._resultVertex;
	}

}