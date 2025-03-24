import { DDLSObject } from "../data/DDLSObject";


export class DDLSEntityAI {

	private static NUM_SEGMENTS: number = 6;

	private _radius: number;
	private _radiusSquared: number;
	private _x: number;
	private _y: number;
	private _dirNormX: number;
	private _dirNormY: number;
	private _angleFOV: number;
	private _radiusFOV: number;
	private _radiusSquaredFOV: number;
	private _approximateObject: DDLSObject;


	constructor() {
		this._radius = 10;
		this._x = this._y = 0;
		this._dirNormX = 1;
		this._dirNormY = 0;
		this._angleFOV = 60;
	}

	buildApproximation(): void {
		this._approximateObject = new DDLSObject();
		this._approximateObject.matrix.translate(this.x, this.y);
		let coordinates: Array<number> = new Array<number>();
		this._approximateObject.coordinates = coordinates;

		if (this._radius == 0)
			return;

		for (let i = 0; i < DDLSEntityAI.NUM_SEGMENTS; i++) {
			coordinates.push(this._radius * Math.cos(2 * Math.PI * i / DDLSEntityAI.NUM_SEGMENTS));
			coordinates.push(this._radius * Math.sin(2 * Math.PI * i / DDLSEntityAI.NUM_SEGMENTS));
			coordinates.push(this._radius * Math.cos(2 * Math.PI * (i + 1) / DDLSEntityAI.NUM_SEGMENTS));
			coordinates.push(this._radius * Math.sin(2 * Math.PI * (i + 1) / DDLSEntityAI.NUM_SEGMENTS));
		}

	}

	get approximateObject(): DDLSObject {
		this._approximateObject.matrix.identity();
		this._approximateObject.matrix.translate(this.x, this.y);
		return this._approximateObject;
	}

	get radiusFOV(): number {
		return this._radiusFOV;
	}

	set radiusFOV(value: number) {
		this._radiusFOV = value;
		this._radiusSquaredFOV = this._radiusFOV * this._radiusFOV;
	}

	get angleFOV(): number {
		return this._angleFOV;
	}

	set angleFOV(value: number) {
		this._angleFOV = value;
	}

	get dirNormY(): number {
		return this._dirNormY;
	}

	set dirNormY(value: number) {
		this._dirNormY = value;
	}

	get dirNormX(): number {
		return this._dirNormX;
	}

	set dirNormX(value: number) {
		this._dirNormX = value;
	}

	get y(): number {
		return this._y;
	}

	set y(value: number) {
		this._y = value;
	}

	get x(): number {
		return this._x;
	}

	set x(value: number) {
		this._x = value;
	}

	get radius(): number {
		return this._radius;
	}

	get radiusSquared(): number {
		return this._radiusSquared;
	}

	set radius(value: number) {
		this._radius = value;
		this._radiusSquared = this._radius * this._radius;
	}
}
