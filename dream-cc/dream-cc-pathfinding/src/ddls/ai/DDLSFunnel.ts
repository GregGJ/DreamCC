import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSVertex } from "../data/DDLSVertex";
import { DDLSGeom2D } from "../data/math/DDLSGeom2D";
import { DDLSPoint2D } from "../data/math/DDLSPoint2D";

export class DDLSFunnel {

	private _radius: number = 0;
	private _radiusSquared: number = 0;
	private _numSamplesCircle: number = 16;
	private _sampleCircle: Array<DDLSPoint2D>;
	private _sampleCircleDistanceSquared: number;

	// public debugSurface: Sprite;


	constructor() {
		this._poolPoints = new Array<DDLSPoint2D>();
		for (var i: number = 0; i < this._poolPointsSize; i++) {
			this._poolPoints.push(new DDLSPoint2D());
		}
	}

	dispose(): void {
		this._sampleCircle = null;
	}


	private _poolPointsSize: number = 3000;
	private _poolPoints: Array<DDLSPoint2D>;
	private _currPoolPointsIndex: number = 0;
	private __point: DDLSPoint2D;
	getPoint(x: number = 0, y: number = 0): DDLSPoint2D {
		this.__point = this._poolPoints[this._currPoolPointsIndex];
		this.__point.setTo(x, y);

		this._currPoolPointsIndex++;
		if (this._currPoolPointsIndex == this._poolPointsSize) {
			this._poolPoints.push(new DDLSPoint2D());
			this._poolPointsSize++;
		}

		return this.__point;
	}
	getCopyPoint(pointToCopy: DDLSPoint2D): DDLSPoint2D {
		return this.getPoint(pointToCopy.x, pointToCopy.y);
	}

	get radius(): number {
		return this._radius;
	}

	set radius(value: number) {
		this._radius = Math.max(0, value);
		this._radiusSquared = this._radius * this._radius;
		this._sampleCircle = new Array<DDLSPoint2D>();
		if (this._radius == 0)
			return;

		for (var i: number = 0; i < this._numSamplesCircle; i++) {
			this._sampleCircle.push(new DDLSPoint2D(this._radius * Math.cos(-2 * Math.PI * i / this._numSamplesCircle), this._radius * Math.sin(-2 * Math.PI * i / this._numSamplesCircle)));
		}

		this._sampleCircleDistanceSquared = (this._sampleCircle[0].x - this._sampleCircle[1].x) * (this._sampleCircle[0].x - this._sampleCircle[1].x) + (this._sampleCircle[0].y - this._sampleCircle[1].y) * (this._sampleCircle[0].y - this._sampleCircle[1].y);
	}

	findPath(fromX: number, fromY: number
		, toX: number, toY: number
		, listFaces: Array<DDLSFace>
		, listEdges: Array<DDLSEdge>
		, resultPath: Array<{ x: number, y: number }>): void {

		this._currPoolPointsIndex = 0;

		// we check the start and goal
		if (this._radius > 0) {
			var checkFace: DDLSFace = listFaces[0];
			var distanceSquared: number;
			var distance: number;
			var p1: DDLSPoint2D;
			var p2: DDLSPoint2D;
			var p3: DDLSPoint2D;
			p1 = checkFace.edge.originVertex.pos;
			p2 = checkFace.edge.destinationVertex.pos;
			p3 = checkFace.edge.nextLeftEdge.destinationVertex.pos;
			distanceSquared = (p1.x - fromX) * (p1.x - fromX) + (p1.y - fromY) * (p1.y - fromY);
			if (distanceSquared <= this._radiusSquared) {
				distance = Math.sqrt(distanceSquared);
				fromX = this._radius * 1.01 * ((fromX - p1.x) / distance) + p1.x;
				fromY = this._radius * 1.01 * ((fromY - p1.y) / distance) + p1.y;
			}
			else {
				distanceSquared = (p2.x - fromX) * (p2.x - fromX) + (p2.y - fromY) * (p2.y - fromY);
				if (distanceSquared <= this._radiusSquared) {
					distance = Math.sqrt(distanceSquared);
					fromX = this._radius * 1.01 * ((fromX - p2.x) / distance) + p2.x;
					fromY = this._radius * 1.01 * ((fromY - p2.y) / distance) + p2.y;
				}
				else {
					distanceSquared = (p3.x - fromX) * (p3.x - fromX) + (p3.y - fromY) * (p3.y - fromY);
					if (distanceSquared <= this._radiusSquared) {
						distance = Math.sqrt(distanceSquared);
						fromX = this._radius * 1.01 * ((fromX - p3.x) / distance) + p3.x;
						fromY = this._radius * 1.01 * ((fromY - p3.y) / distance) + p3.y;
					}
				}
			}
			//
			checkFace = listFaces[listFaces.length - 1];
			p1 = checkFace.edge.originVertex.pos;
			p2 = checkFace.edge.destinationVertex.pos;
			p3 = checkFace.edge.nextLeftEdge.destinationVertex.pos;
			distanceSquared = (p1.x - toX) * (p1.x - toX) + (p1.y - toY) * (p1.y - toY);
			if (distanceSquared <= this._radiusSquared) {
				distance = Math.sqrt(distanceSquared);
				toX = this._radius * 1.01 * ((toX - p1.x) / distance) + p1.x;
				toY = this._radius * 1.01 * ((toY - p1.y) / distance) + p1.y;
			}
			else {
				distanceSquared = (p2.x - toX) * (p2.x - toX) + (p2.y - toY) * (p2.y - toY);
				if (distanceSquared <= this._radiusSquared) {
					distance = Math.sqrt(distanceSquared);
					toX = this._radius * 1.01 * ((toX - p2.x) / distance) + p2.x;
					toY = this._radius * 1.01 * ((toY - p2.y) / distance) + p2.y;
				}
				else {
					distanceSquared = (p3.x - toX) * (p3.x - toX) + (p3.y - toY) * (p3.y - toY);
					if (distanceSquared <= this._radiusSquared) {
						distance = Math.sqrt(distanceSquared);
						toX = this._radius * 1.01 * ((toX - p3.x) / distance) + p3.x;
						toY = this._radius * 1.01 * ((toY - p3.y) / distance) + p3.y;
					}
				}
			}
		}



		// we build starting and ending points
		var startPoint: DDLSPoint2D;
		var endPoint: DDLSPoint2D;
		startPoint = new DDLSPoint2D(fromX, fromY);
		endPoint = new DDLSPoint2D(toX, toY);

		if (listFaces.length == 1) {
			// resultPath.push(startPoint.x);
			// resultPath.push(startPoint.y);
			// resultPath.push(endPoint.x);
			// resultPath.push(endPoint.y);
			resultPath.push(startPoint.clone());
			resultPath.push(endPoint.clone());
			return;
		}

		// useful
		var i: number;
		var j: number;
		var k: number;
		var currEdge: DDLSEdge;
		var currVertex: DDLSVertex;
		var direction: number;

		// first we skip the first face and first edge if the starting point lies on the first interior edge:
		if (listEdges[0] == DDLSGeom2D.isInFace(fromX, fromY, listFaces[0])) {
			listEdges.shift();
			listFaces.shift();
		}

		// our funnels, inited with starting point
		var funnelLeft: Array<DDLSPoint2D> = new Array<DDLSPoint2D>();
		var funnelRight: Array<DDLSPoint2D> = new Array<DDLSPoint2D>();
		funnelLeft.push(startPoint);
		funnelRight.push(startPoint);

		// useful to keep track of done vertices and compare the sides
		var verticesDoneSide = new Map<number,number>();

		// we extract the vertices positions and sides from the edges list
		var pointsList: Array<DDLSPoint2D> = new Array<DDLSPoint2D>();
		var pointSides = new Map<number,number>();
		// we keep the successor relation in a dictionnary
		var pointSuccessor = new Map<number,DDLSPoint2D>();
		//
		pointSides.set(startPoint.id, 0);
		// we begin with the vertices in first edge
		currEdge = listEdges[0];
		var relativPos: number = DDLSGeom2D.getRelativePosition2(fromX, fromY, currEdge);
		var prevPoint: DDLSPoint2D;
		var newPointA: DDLSPoint2D;
		var newPointB: DDLSPoint2D;
		newPointA = this.getCopyPoint(currEdge.destinationVertex.pos);
		newPointB = this.getCopyPoint(currEdge.originVertex.pos);

		pointsList.push(newPointA);
		pointsList.push(newPointB);
		pointSuccessor.set(startPoint.id, newPointA);
		pointSuccessor.set(newPointA.id, newPointB);
		prevPoint = newPointB;
		if (relativPos == 1) {
			pointSides.set(newPointA.id, 1);
			pointSides.set(newPointB.id, -1);
			verticesDoneSide.set(currEdge.destinationVertex.id, 1);
			verticesDoneSide.set(currEdge.originVertex.id, -1);
		}
		else if (relativPos == -1) {
			pointSides.set(newPointA.id, -1);
			pointSides.set(newPointB.id, 1);
			verticesDoneSide.set(currEdge.destinationVertex.id, -1);
			verticesDoneSide.set(currEdge.originVertex.id, 1);
		}

		// then we iterate through the edges
		var fromVertex: DDLSVertex = listEdges[0].originVertex;
		var fromFromVertex: DDLSVertex = listEdges[0].destinationVertex;
		for (i = 1; i < listEdges.length; i++) {
			// we identify the current vertex and his origin vertex
			currEdge = listEdges[i];
			if (currEdge.originVertex == fromVertex) {
				currVertex = currEdge.destinationVertex;
			}
			else if (currEdge.destinationVertex == fromVertex) {
				currVertex = currEdge.originVertex;
			}
			else if (currEdge.originVertex == fromFromVertex) {
				currVertex = currEdge.destinationVertex;
				fromVertex = fromFromVertex;
			}
			else if (currEdge.destinationVertex == fromFromVertex) {
				currVertex = currEdge.originVertex;
				fromVertex = fromFromVertex;
			}
			else {
				console.log("IMPOSSIBLE TO IDENTIFY THE VERTEX !!!");
			}

			newPointA = this.getCopyPoint(currVertex.pos);
			pointsList.push(newPointA);
			direction = - verticesDoneSide.get(fromVertex.id);
			pointSides.set(newPointA.id, direction);
			pointSuccessor.set(prevPoint.id, newPointA);
			verticesDoneSide.set(currVertex.id, direction);
			prevPoint = newPointA;
			fromFromVertex = fromVertex;
			fromVertex = currVertex;
		}
		// we then we add the end point
		pointSuccessor.set(prevPoint.id, endPoint);
		pointSides.set(endPoint.id, 0);

		/*
		debugSurface.graphics.clear();
		debugSurface.graphics.lineStyle(1, 0x0000FF);
		var ppp1:Point = startPoint;
		var ppp2:Point = pointSuccessor[ppp1];
		while (ppp2)
		{
			debugSurface.graphics.moveTo(ppp1.x, ppp1.y+2);
			debugSurface.graphics.lineTo(ppp2.x, ppp2.y+2);
			debugSurface.graphics.drawCircle(ppp2.x, ppp2.y, 3);
			ppp1 = ppp2;
			ppp2 = pointSuccessor[ppp2];
		}
		
		debugSurface.graphics.lineStyle(1, 0x00FF00);
		for (i=1 ; i<pointsList.length ; i++)
		{
			debugSurface.graphics.moveTo(pointsList[i-1].x+2, pointsList[i-1].y);
			debugSurface.graphics.lineTo(pointsList[i].x+2, pointsList[i].y);
		}
		*/

		// we will keep the points and funnel sides of the optimized path
		var pathPoints: Array<DDLSPoint2D> = new Array<DDLSPoint2D>();
		var pathSides = new Map<number,number>();
		pathPoints.push(startPoint);
		pathSides.set(startPoint.id, 0);

		// now we process the points by order
		var currPos: DDLSPoint2D;
		for (i = 0; i < pointsList.length; i++) {
			currPos = pointsList[i];

			// we identify the current vertex funnel's position by the position of his origin vertex
			if (pointSides.get(currPos.id) == -1) {
				// current vertex is at right
				//trace("current vertex is at right");
				for (j = funnelLeft.length - 2; j >= 0; j--) {
					direction = DDLSGeom2D.getDirection(funnelLeft[j].x, funnelLeft[j].y, funnelLeft[j + 1].x, funnelLeft[j + 1].y, currPos.x, currPos.y);
					if (direction != -1) {
						//trace("funnels are crossing");

						funnelLeft.shift();
						for (k = 0; k <= j - 1; k++) {
							pathPoints.push(funnelLeft[0]);
							pathSides.set(funnelLeft[0].id, 1);
							funnelLeft.shift();
						}
						pathPoints.push(funnelLeft[0]);
						pathSides.set(funnelLeft[0].id, 1);
						funnelRight.splice(0, funnelRight.length);
						funnelRight.push(funnelLeft[0], currPos);
						break;
						continue;
					}
				}

				funnelRight.push(currPos);
				for (j = funnelRight.length - 3; j >= 0; j--) {
					direction = DDLSGeom2D.getDirection(funnelRight[j].x, funnelRight[j].y, funnelRight[j + 1].x, funnelRight[j + 1].y, currPos.x, currPos.y);
					if (direction == -1)
						break;
					else {
						funnelRight.splice(j + 1, 1);
					}
				}
			}
			else {
				// current vertex is at left
				for (j = funnelRight.length - 2; j >= 0; j--) {
					direction = DDLSGeom2D.getDirection(funnelRight[j].x, funnelRight[j].y, funnelRight[j + 1].x, funnelRight[j + 1].y, currPos.x, currPos.y);
					if (direction != 1) {
						funnelRight.shift();
						for (k = 0; k <= j - 1; k++) {
							pathPoints.push(funnelRight[0]);
							pathSides.set(funnelRight[0].id, -1);
							funnelRight.shift();
						}
						pathPoints.push(funnelRight[0]);
						pathSides.set(funnelRight[0].id, -1);
						funnelLeft.splice(0, funnelLeft.length);
						funnelLeft.push(funnelRight[0], currPos);
						break;
						continue;
					}
				}

				funnelLeft.push(currPos);
				for (j = funnelLeft.length - 3; j >= 0; j--) {
					direction = DDLSGeom2D.getDirection(funnelLeft[j].x, funnelLeft[j].y, funnelLeft[j + 1].x, funnelLeft[j + 1].y, currPos.x, currPos.y);
					if (direction == 1)
						break;
					else {
						funnelLeft.splice(j + 1, 1);
					}
				}
			}
		}

		// check if the goal is blocked by one funnel's right vertex
		var blocked: boolean = false;
		//trace("check if the goal is blocked by one funnel right vertex");
		for (j = funnelRight.length - 2; j >= 0; j--) {
			direction = DDLSGeom2D.getDirection(funnelRight[j].x, funnelRight[j].y, funnelRight[j + 1].x, funnelRight[j + 1].y, toX, toY);
			//trace("dir", funnelRight[j].x, funnelRight[j].y, funnelRight[j+1].x, funnelRight[j+1].y, toX, toY);
			if (direction != 1) {
				//trace("goal access right blocked");
				// access blocked
				funnelRight.shift();
				for (k = 0; k <= j; k++) {
					pathPoints.push(funnelRight[0]);
					pathSides.set(funnelRight[0].id, -1);
					funnelRight.shift();
				}
				pathPoints.push(endPoint);
				pathSides.set(endPoint.id, 0);
				blocked = true;
				break;
			}
		}

		if (!blocked) {
			// check if the goal is blocked by one funnel's left vertex
			//trace("check if the goal is blocked by one funnel left vertex");
			for (j = funnelLeft.length - 2; j >= 0; j--) {
				direction = DDLSGeom2D.getDirection(funnelLeft[j].x, funnelLeft[j].y, funnelLeft[j + 1].x, funnelLeft[j + 1].y, toX, toY);
				//trace("dir", funnelLeft[j].x, funnelLeft[j].y, funnelLeft[j+1].x, funnelLeft[j+1].y, toX, toY);
				if (direction != -1) {
					//trace("goal access left blocked");
					// access blocked
					funnelLeft.shift();
					for (k = 0; k <= j; k++) {
						pathPoints.push(funnelLeft[0]);
						pathSides.set(funnelLeft[0].id, 1);
						funnelLeft.shift();
					}

					pathPoints.push(endPoint);
					pathSides.set(endPoint.id, 0);
					blocked = true;
					break;
				}
			}
		}

		// if not blocked, we consider the direct path
		if (!blocked) {
			pathPoints.push(endPoint);
			pathSides.set(endPoint.id, 0);
			blocked = true;
		}

		// if radius is non zero
		if (this.radius > 0) {
			var adjustedPoints: Array<DDLSPoint2D> = new Array<DDLSPoint2D>();
			var newPath: Array<DDLSPoint2D> = new Array<DDLSPoint2D>();

			if (pathPoints.length == 2) {
				this.adjustWithTangents(pathPoints[0], false, pathPoints[1], false, pointSides, pointSuccessor, newPath, adjustedPoints);
			}
			else if (pathPoints.length > 2) {
				// tangent from start point to 2nd point
				this.adjustWithTangents(pathPoints[0], false, pathPoints[1], true, pointSides, pointSuccessor, newPath, adjustedPoints);

				// tangents for intermediate points
				if (pathPoints.length > 3) {
					for (i = 1; i <= pathPoints.length - 3; i++) {
						this.adjustWithTangents(pathPoints[i], true, pathPoints[i + 1], true, pointSides, pointSuccessor, newPath, adjustedPoints);
					}
				}

				// tangent from last-1 point to end point
				var pathLength: number = pathPoints.length;
				this.adjustWithTangents(pathPoints[pathLength - 2], true, pathPoints[pathLength - 1], false, pointSides, pointSuccessor, newPath, adjustedPoints);
			}

			newPath.push(endPoint);

			// adjusted path can have useless tangents, we check it
			this.checkAdjustedPath(newPath, adjustedPoints, pointSides);

			var smoothPoints: Array<DDLSPoint2D> = new Array<DDLSPoint2D>();
			for (i = newPath.length - 2; i >= 1; i--) {
				this.smoothAngle(adjustedPoints[i * 2 - 1], newPath[i], adjustedPoints[i * 2], pointSides.get(newPath[i].id), smoothPoints);
				while (smoothPoints.length) {
					adjustedPoints.splice(i * 2, 0, smoothPoints.pop());
				}
			}
		}
		else {
			adjustedPoints = pathPoints;
		}

		// extract coordinates
		for (i = 0; i < adjustedPoints.length; i++) {
			// resultPath.push(adjustedPoints[i].x);
			// resultPath.push(adjustedPoints[i].y);
			resultPath.push(adjustedPoints[i].clone());
		}
	}

	private adjustWithTangents(p1: DDLSPoint2D, applyRadiusToP1: boolean
		, p2: DDLSPoint2D, applyRadiusToP2: boolean
		, pointSides: Map<number,number>, pointSuccessor: Map<number,DDLSPoint2D>
		, newPath: Array<DDLSPoint2D>
		, adjustedPoints: Array<DDLSPoint2D>): void {
		// we find the tangent T between the points pathPoints[i] - pathPoints[i+1]
		// then we check the unused intermediate points between pathPoints[i] and pathPoints[i+1]
		// if a point P is too close from the segment, we replace T by 2 tangents T1, T2, between the points pathPoints[i] P and P - pathPoints[i+1]

		//trace("adjustWithTangents");

		var tangentsResult: Array<number> = new Array<number>();

		var side1: number = pointSides.get(p1.id);
		var side2: number = pointSides.get(p2.id);

		var pTangent1: DDLSPoint2D;
		var pTangent2: DDLSPoint2D;

		// if no radius application
		if (!applyRadiusToP1 && !applyRadiusToP2) {
			//trace("no radius applied");
			pTangent1 = p1;
			pTangent2 = p2;
		}
		// we apply radius to p2 only
		else if (!applyRadiusToP1) {
			//trace("! applyRadiusToP1");
			DDLSGeom2D.tangentsPointToCircle(p1.x, p1.y, p2.x, p2.y, this._radius, tangentsResult);
			// p2 lies on the left funnel
			if (side2 == 1) {
				pTangent1 = p1;
				pTangent2 = this.getPoint(tangentsResult[2], tangentsResult[3]);
			}
			// p2 lies on the right funnel
			else {
				pTangent1 = p1;
				pTangent2 = this.getPoint(tangentsResult[0], tangentsResult[1]);
			}
		}
		// we apply radius to p1 only
		else if (!applyRadiusToP2) {
			//trace("! applyRadiusToP2");
			DDLSGeom2D.tangentsPointToCircle(p2.x, p2.y, p1.x, p1.y, this._radius, tangentsResult);
			// p1 lies on the left funnel
			if (side1 == 1) {
				pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
				pTangent2 = p2;
			}
			// p1 lies on the right funnel
			else {
				pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
				pTangent2 = p2;
			}
		}
		// we apply radius to both points
		else {
			//trace("we apply radius to both points");
			// both points lie on left funnel
			if (side1 == 1 && side2 == 1) {
				DDLSGeom2D.tangentsParalCircleToCircle(this._radius, p1.x, p1.y, p2.x, p2.y, tangentsResult);
				// we keep the points of the right tangent
				pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
				pTangent2 = this.getPoint(tangentsResult[4], tangentsResult[5]);
			}
			// both points lie on right funnel
			else if (side1 == -1 && side2 == -1) {
				DDLSGeom2D.tangentsParalCircleToCircle(this._radius, p1.x, p1.y, p2.x, p2.y, tangentsResult);
				// we keep the points of the left tangent
				pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
				pTangent2 = this.getPoint(tangentsResult[6], tangentsResult[7]);
			}
			// 1st point lies on left funnel, 2nd on right funnel
			else if (side1 == 1 && side2 == -1) {
				if (DDLSGeom2D.tangentsCrossCircleToCircle(this._radius, p1.x, p1.y, p2.x, p2.y, tangentsResult)) {
					// we keep the points of the right-left tangent
					pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
					pTangent2 = this.getPoint(tangentsResult[6], tangentsResult[7]);
				}
				else {
					// NO TANGENT BECAUSE POINTS TOO CLOSE
					// A* MUST CHECK THAT !
					console.log("NO TANGENT, points are too close for radius");
					return;
				}
			}
			// 1st point lies on right funnel, 2nd on left funnel
			else {
				if (DDLSGeom2D.tangentsCrossCircleToCircle(this._radius, p1.x, p1.y, p2.x, p2.y, tangentsResult)) {
					// we keep the points of the left-right tangent
					pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
					pTangent2 = this.getPoint(tangentsResult[4], tangentsResult[5]);
				}
				else {
					// NO TANGENT BECAUSE POINTS TOO CLOSE
					// A* MUST CHECK THAT !
					console.log("NO TANGENT, points are too close for radius");
					return;
				}
			}
		}

		var successor: DDLSPoint2D = pointSuccessor.get(p1.id);
		var distance: number;
		while (successor != p2) {
			distance = DDLSGeom2D.distanceSquaredPointToSegment(successor.x, successor.y, pTangent1.x, pTangent1.y, pTangent2.x, pTangent2.y);
			if (distance < this._radiusSquared) {
				this.adjustWithTangents(p1, applyRadiusToP1, successor, true, pointSides, pointSuccessor, newPath, adjustedPoints);
				this.adjustWithTangents(successor, true, p2, applyRadiusToP2, pointSides, pointSuccessor, newPath, adjustedPoints);
				return;
			}
			else {
				successor = pointSuccessor.get(successor.id);
			}
		}

		// we check distance in order to remove useless close points due to straight line subdivision
		/*if ( adjustedPoints.length > 0 )
		{
			var distanceSquared:number;
			var lastPoint:Point = adjustedPoints[adjustedPoints.length-1];
			distanceSquared = (lastPoint.x - pTangent1.x)*(lastPoint.x - pTangent1.x) + (lastPoint.y - pTangent1.y)*(lastPoint.y - pTangent1.y);
			if (distanceSquared <= QEConstants.EPSILON_SQUARED)
			{
				adjustedPoints.pop();
				adjustedPoints.push(pTangent2);
				return;
			}
		}*/
		adjustedPoints.push(pTangent1, pTangent2);
		newPath.push(p1);
	}

	private checkAdjustedPath(newPath: Array<DDLSPoint2D>, adjustedPoints: Array<DDLSPoint2D>, pointSides: Map<number,number>): void {

		var needCheck: boolean = true;

		var point0: DDLSPoint2D;
		var point0Side: number;
		var point1: DDLSPoint2D;
		var point1Side: number;
		var point2: DDLSPoint2D;
		var point2Side: number;

		var pt1: DDLSPoint2D;
		var pt2: DDLSPoint2D;
		var pt3: DDLSPoint2D;
		var dot: number;

		var tangentsResult: Array<number> = new Array<number>();
		var pTangent1: DDLSPoint2D;
		var pTangent2: DDLSPoint2D;

		while (needCheck) {
			needCheck = false;
			for (var i: number = 2; i < newPath.length; i++) {
				point2 = newPath[i];
				point2Side = pointSides.get(point2.id);
				point1 = newPath[i - 1];
				point1Side = pointSides.get(point1.id);
				point0 = newPath[i - 2];
				point0Side = pointSides.get(point0.id);

				if (point1Side == point2Side) {
					pt1 = adjustedPoints[(i - 2) * 2];
					pt2 = adjustedPoints[(i - 1) * 2 - 1];
					pt3 = adjustedPoints[(i - 1) * 2];
					dot = (pt1.x - pt2.x) * (pt3.x - pt2.x) + (pt1.y - pt2.y) * (pt3.y - pt2.y)
					if (dot > 0) {
						//needCheck = true;
						//trace("dot > 0");
						// rework the tangent
						if (i == 2) {
							// tangent from start point
							DDLSGeom2D.tangentsPointToCircle(point0.x, point0.y, point2.x, point2.y, this._radius, tangentsResult);
							// p2 lies on the left funnel
							if (point2Side == 1) {
								pTangent1 = point0;
								pTangent2 = this.getPoint(tangentsResult[2], tangentsResult[3]);
							}
							else {
								pTangent1 = point0;
								pTangent2 = this.getPoint(tangentsResult[0], tangentsResult[1]);
							}
						}
						else if (i == newPath.length - 1) {
							// tangent to end point
							DDLSGeom2D.tangentsPointToCircle(point2.x, point2.y, point0.x, point0.y, this._radius, tangentsResult);
							// p1 lies on the left funnel
							if (point0Side == 1) {
								pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
								pTangent2 = point2;
							}
							// p1 lies on the right funnel
							else {
								pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
								pTangent2 = point2;
							}
						}
						else {
							// 1st point lies on left funnel, 2nd on right funnel
							if (point0Side == 1 && point2Side == -1) {
								//trace("point0Side == 1 && point2Side == -1");
								DDLSGeom2D.tangentsCrossCircleToCircle(this._radius, point0.x, point0.y, point2.x, point2.y, tangentsResult)
								// we keep the points of the right-left tangent
								pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
								pTangent2 = this.getPoint(tangentsResult[6], tangentsResult[7]);
							}
							// 1st point lies on right funnel, 2nd on left funnel
							else if (point0Side == -1 && point2Side == 1) {
								//trace("point0Side == -1 && point2Side == 1");
								DDLSGeom2D.tangentsCrossCircleToCircle(this._radius, point0.x, point0.y, point2.x, point2.y, tangentsResult)
								// we keep the points of the right-left tangent
								pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
								pTangent2 = this.getPoint(tangentsResult[4], tangentsResult[5]);
							}
							// both points lie on left funnel
							else if (point0Side == 1 && point2Side == 1) {
								//trace("point0Side == 1 && point2Side == 1");
								DDLSGeom2D.tangentsParalCircleToCircle(this._radius, point0.x, point0.y, point2.x, point2.y, tangentsResult);
								// we keep the points of the right tangent
								pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
								pTangent2 = this.getPoint(tangentsResult[4], tangentsResult[5]);
							}
							// both points lie on right funnel
							else if (point0Side == -1 && point2Side == -1) {
								//trace("point0Side == -1 && point2Side == -1");
								DDLSGeom2D.tangentsParalCircleToCircle(this._radius, point0.x, point0.y, point2.x, point2.y, tangentsResult);
								// we keep the points of the right tangent
								pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
								pTangent2 = this.getPoint(tangentsResult[6], tangentsResult[7]);
							}
						}
						adjustedPoints.splice((i - 2) * 2, 1, pTangent1);
						adjustedPoints.splice(i * 2 - 1, 1, pTangent2);

						// delete useless point
						newPath.splice(i - 1, 1);
						adjustedPoints.splice((i - 1) * 2 - 1, 2);

						tangentsResult.splice(0, tangentsResult.length);
						i--;
					}
				}

			}
		}
	}

	private smoothAngle(prevPoint: DDLSPoint2D, pointToSmooth: DDLSPoint2D, nextPoint: DDLSPoint2D, side: number, encirclePoints: Array<DDLSPoint2D>): void {
		var angleType: number = DDLSGeom2D.getDirection(prevPoint.x, prevPoint.y
			, pointToSmooth.x, pointToSmooth.y
			, nextPoint.x, nextPoint.y);

		/*
		trace("smoothAngle");
		trace("angleType", angleType);
		trace("prevPoint", prevPoint);
		trace("pointToSmooth", pointToSmooth);
		trace("nextPoint", nextPoint);
		*/

		var distanceSquared: number = (prevPoint.x - nextPoint.x) * (prevPoint.x - nextPoint.x) + (prevPoint.y - nextPoint.y) * (prevPoint.y - nextPoint.y);
		if (distanceSquared <= this._sampleCircleDistanceSquared)
			return;

		var index: number = 0;
		var side1: number;
		var side2: number;
		var pointInArea: boolean;
		var xToCheck: number;
		var yToCheck: number;
		for (var i: number = 0; i < this._numSamplesCircle; i++) {
			pointInArea = false;
			xToCheck = pointToSmooth.x + this._sampleCircle[i].x;
			yToCheck = pointToSmooth.y + this._sampleCircle[i].y;
			side1 = DDLSGeom2D.getDirection(prevPoint.x, prevPoint.y, pointToSmooth.x, pointToSmooth.y, xToCheck, yToCheck);
			side2 = DDLSGeom2D.getDirection(pointToSmooth.x, pointToSmooth.y, nextPoint.x, nextPoint.y, xToCheck, yToCheck);

			// if funnel left
			if (side == 1) {
				//trace("funnel side is 1");
				// if angle is < 180
				if (angleType == -1) {
					//trace("angle type is -1");
					if (side1 == -1 && side2 == -1)
						pointInArea = true;
				}
				// if angle is >= 180
				else {
					//trace("angle type is 1")
					if (side1 == -1 || side2 == -1)
						pointInArea = true;
				}
			}
			// if funnel right
			else {
				// if angle is < 180
				if (angleType == 1) {
					if (side1 == 1 && side2 == 1)
						pointInArea = true;
				}
				// if angle is >= 180
				else {
					if (side1 == 1 || side2 == 1)
						pointInArea = true;
				}
			}
			if (pointInArea) {
				encirclePoints.splice(index, 0, new DDLSPoint2D(xToCheck, yToCheck));
				index++;
			}
			else
				index = 0;
			// points in sample circle are CCW
			// so we inverse the order for right funnel
		}
		if (side == -1)
			encirclePoints.reverse();
	}
}
