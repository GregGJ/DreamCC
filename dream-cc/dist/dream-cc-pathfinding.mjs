// src/ddls/data/DDLSEdge.ts
var _DDLSEdge = class _DDLSEdge {
  constructor() {
    this.colorDebug = -1;
    this._id = _DDLSEdge.INC;
    _DDLSEdge.INC++;
    this._fromConstraintSegments = [];
  }
  get id() {
    return this._id;
  }
  get isReal() {
    return this._isReal;
  }
  get isConstrained() {
    return this._isConstrained;
  }
  setDatas(originVertex, oppositeEdge, nextLeftEdge, leftFace, isReal = true, isConstrained = false) {
    this._isConstrained = isConstrained;
    this._isReal = isReal;
    this._originVertex = originVertex;
    this._oppositeEdge = oppositeEdge;
    this._nextLeftEdge = nextLeftEdge;
    this._leftFace = leftFace;
  }
  addFromConstraintSegment(segment) {
    if (this._fromConstraintSegments.indexOf(segment) == -1)
      this._fromConstraintSegments.push(segment);
  }
  removeFromConstraintSegment(segment) {
    var index = this._fromConstraintSegments.indexOf(segment);
    if (index != -1)
      this._fromConstraintSegments.splice(index, 1);
  }
  set originVertex(value) {
    this._originVertex = value;
  }
  set nextLeftEdge(value) {
    this._nextLeftEdge = value;
  }
  set leftFace(value) {
    this._leftFace = value;
  }
  set isConstrained(value) {
    this._isConstrained = value;
  }
  get fromConstraintSegments() {
    return this._fromConstraintSegments;
  }
  set fromConstraintSegments(value) {
    this._fromConstraintSegments = value;
  }
  dispose() {
    this._originVertex = null;
    this._oppositeEdge = null;
    this._nextLeftEdge = null;
    this._leftFace = null;
    this._fromConstraintSegments = null;
  }
  get originVertex() {
    return this._originVertex;
  }
  get destinationVertex() {
    return this._oppositeEdge.originVertex;
  }
  get oppositeEdge() {
    return this._oppositeEdge;
  }
  get nextLeftEdge() {
    return this._nextLeftEdge;
  }
  get prevLeftEdge() {
    return this._nextLeftEdge.nextLeftEdge;
  }
  get nextRightEdge() {
    return this._oppositeEdge.nextLeftEdge.nextLeftEdge.oppositeEdge;
  }
  get prevRightEdge() {
    return this._oppositeEdge.nextLeftEdge.oppositeEdge;
  }
  get rotLeftEdge() {
    return this._nextLeftEdge.nextLeftEdge.oppositeEdge;
  }
  get rotRightEdge() {
    return this._oppositeEdge.nextLeftEdge;
  }
  get leftFace() {
    return this._leftFace;
  }
  get rightFace() {
    return this._oppositeEdge.leftFace;
  }
  toString() {
    return "edge " + this.originVertex.id + " - " + this.destinationVertex.id;
  }
};
_DDLSEdge.INC = 0;
var DDLSEdge = _DDLSEdge;

// src/ddls/data/DDLSFace.ts
var _DDLSFace = class _DDLSFace {
  constructor() {
    this.colorDebug = -1;
    this._id = _DDLSFace.INC;
    _DDLSFace.INC++;
  }
  get id() {
    return this._id;
  }
  get isReal() {
    return this._isReal;
  }
  setDatas(edge, isReal = true) {
    this._isReal = isReal;
    this._edge = edge;
  }
  dispose() {
    this._edge = null;
  }
  get edge() {
    return this._edge;
  }
};
_DDLSFace.INC = 0;
var DDLSFace = _DDLSFace;

// src/ddls/data/math/DDLSPoint2D.ts
var _DDLSPoint2D = class _DDLSPoint2D {
  constructor(x = 0, y = 0) {
    this._id = _DDLSPoint2D.INC;
    _DDLSPoint2D.INC++;
    this.setTo(x, y);
  }
  get id() {
    return this._id;
  }
  transform(matrix) {
    matrix.tranform(this);
  }
  setTo(x, y) {
    this._x = x;
    this._y = y;
  }
  clone() {
    return new _DDLSPoint2D(this._x, this._y);
  }
  substract(p) {
    this._x -= p.x;
    this._y -= p.y;
  }
  get length() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
  }
  normalize() {
    let norm = this.length;
    this.x /= norm;
    this.y /= norm;
  }
  scale(s) {
    this.x *= s;
    this.y *= s;
  }
  distanceTo(p) {
    var diffX = this.x - p.x;
    var diffY = this.y - p.y;
    return Math.sqrt(diffX * diffX + diffY * diffY);
  }
  distanceSquaredTo(p) {
    var diffX = this.x - p.x;
    var diffY = this.y - p.y;
    return diffX * diffX + diffY * diffY;
  }
};
_DDLSPoint2D.INC = 0;
var DDLSPoint2D = _DDLSPoint2D;

// src/ddls/data/DDLSVertex.ts
var _DDLSVertex = class _DDLSVertex {
  constructor() {
    this.colorDebug = -1;
    this._id = _DDLSVertex.INC;
    _DDLSVertex.INC++;
    this._pos = new DDLSPoint2D();
    this._fromConstraintSegments = [];
  }
  get id() {
    return this._id;
  }
  get isReal() {
    return this._isReal;
  }
  get pos() {
    return this._pos;
  }
  get fromConstraintSegments() {
    return this._fromConstraintSegments;
  }
  set fromConstraintSegments(value) {
    this._fromConstraintSegments = value;
  }
  setDatas(edge, isReal = true) {
    this._isReal = isReal;
    this._edge = edge;
  }
  addFromConstraintSegment(segment) {
    if (this._fromConstraintSegments.indexOf(segment) == -1)
      this._fromConstraintSegments.push(segment);
  }
  removeFromConstraintSegment(segment) {
    var index = this._fromConstraintSegments.indexOf(segment);
    if (index != -1)
      this._fromConstraintSegments.splice(index, 1);
  }
  dispose() {
    this._pos = null;
    this._edge = null;
    this._fromConstraintSegments = null;
  }
  get edge() {
    return this._edge;
  }
  set edge(value) {
    this._edge = value;
  }
  toString() {
    return "ver_id " + this._id;
  }
};
_DDLSVertex.INC = 0;
var DDLSVertex = _DDLSVertex;

// src/ddls/data/DDLSConstants.ts
var DDLSConstants = class {
};
DDLSConstants.EPSILON = 0.01;
DDLSConstants.EPSILON_SQUARED = 1e-4;

// src/ddls/data/math/DDLSRandGenerator.ts
var DDLSRandGenerator = class {
  constructor(seed = 1234, rangeMin = 0, rangeMax = 1) {
    this._originalSeed = this._currSeed = this.seed;
    this._rangeMin = this.rangeMin;
    this._rangeMax = this.rangeMax;
    this._numIter = 0;
  }
  set seed(value) {
    this._originalSeed = this._currSeed = value;
  }
  set rangeMin(value) {
    this._rangeMin = value;
  }
  set rangeMax(value) {
    this._rangeMax = value;
  }
  get seed() {
    return this._originalSeed;
  }
  get rangeMin() {
    return this._rangeMin;
  }
  get rangeMax() {
    return this._rangeMax;
  }
  reset() {
    this._currSeed = this._originalSeed;
    this._numIter = 0;
  }
  next() {
    this._tempString = "";
    this._tempString += this._currSeed * this._currSeed;
    while (this._tempString.length < 8) {
      this._tempString = "0" + this._tempString;
    }
    this._currSeed = Number(this._tempString.substr(1, 5));
    var res = Math.round(this._rangeMin + this._currSeed / 99999 * (this._rangeMax - this._rangeMin));
    if (this._currSeed == 0)
      this._currSeed = this._originalSeed + this._numIter;
    this._numIter++;
    if (this._numIter == 200)
      this.reset();
    return res;
  }
};

// src/ddls/iterators/IteratorFromVertexToHoldingFaces.ts
var IteratorFromVertexToHoldingFaces = class {
  constructor() {
  }
  set fromVertex(value) {
    this._fromVertex = value;
    this._nextEdge = this._fromVertex.edge;
  }
  next() {
    if (this._nextEdge) {
      do {
        this._resultFace = this._nextEdge.leftFace;
        this._nextEdge = this._nextEdge.rotLeftEdge;
        if (this._nextEdge == this._fromVertex.edge) {
          this._nextEdge = null;
          if (!this._resultFace.isReal)
            this._resultFace = null;
          break;
        }
      } while (!this._resultFace.isReal);
    } else {
      this._resultFace = null;
    }
    return this._resultFace;
  }
};

// src/ddls/iterators/IteratorFromFaceToInnerEdges.ts
var IteratorFromFaceToInnerEdges = class {
  constructor() {
  }
  set fromFace(value) {
    this._fromFace = value;
    this._nextEdge = this._fromFace.edge;
  }
  next() {
    if (this._nextEdge) {
      this._resultEdge = this._nextEdge;
      this._nextEdge = this._nextEdge.nextLeftEdge;
      if (this._nextEdge == this._fromFace.edge)
        this._nextEdge = null;
    } else {
      this._resultEdge = null;
    }
    return this._resultEdge;
  }
};

// src/ddls/data/math/DDLSGeom2D.ts
var _DDLSGeom2D = class _DDLSGeom2D {
  static locatePosition(x, y, mesh) {
    var closedVertex;
    if (!_DDLSGeom2D._randGen)
      _DDLSGeom2D._randGen = new DDLSRandGenerator();
    _DDLSGeom2D._randGen.seed = x * 10 + 4 * y;
    var i;
    this.__samples.splice(0, this.__samples.length);
    var numSamples = Math.pow(mesh.__vertices.length, 1 / 3);
    _DDLSGeom2D._randGen.rangeMin = 0;
    _DDLSGeom2D._randGen.rangeMax = mesh.__vertices.length - 1;
    for (i = 0; i < numSamples; i++)
      this.__samples.push(mesh.__vertices[_DDLSGeom2D._randGen.next()]);
    var currVertex;
    var currVertexPos;
    var distSquared;
    var minDistSquared = Number.MAX_VALUE;
    for (i = 0; i < numSamples; i++) {
      currVertex = this.__samples[i];
      currVertexPos = currVertex.pos;
      distSquared = (currVertexPos.x - x) * (currVertexPos.x - x) + (currVertexPos.y - y) * (currVertexPos.y - y);
      if (distSquared < minDistSquared) {
        minDistSquared = distSquared;
        closedVertex = currVertex;
      }
    }
    var currFace;
    var iterFace = new IteratorFromVertexToHoldingFaces();
    iterFace.fromVertex = closedVertex;
    currFace = iterFace.next();
    var faceVisited = {};
    var currEdge;
    var iterEdge = new IteratorFromFaceToInnerEdges();
    var objectContainer;
    var relativPos;
    var numIter = 0;
    while (faceVisited[currFace.id] || !(objectContainer = this.isInFace(x, y, currFace))) {
      faceVisited[currFace.id] = true;
      numIter++;
      if (numIter == 50) {
        console.warn("WALK TAKE MORE THAN 50 LOOP", "DDLS");
      }
      if (numIter == 1e3) {
        console.warn("WALK TAKE MORE THAN 1000 LOOP -> WE ESCAPE", "DDLS");
        objectContainer = null;
        break;
      }
      iterEdge.fromFace = currFace;
      do {
        currEdge = iterEdge.next();
        if (currEdge == null) {
          console.log("KILL PATH", "DDLS");
          return null;
        }
        relativPos = this.getRelativePosition(x, y, currEdge);
      } while (relativPos == 1 || relativPos == 0);
      currFace = currEdge.rightFace;
    }
    return objectContainer;
  }
  /**
   *  圆形是否与任何约束交叉
   * @param x
   * @param y
   * @param radius
   * @param mesh
   * @return
   */
  static isCircleIntersectingAnyConstraint(x, y, radius, mesh) {
    if (x <= 0 || x >= mesh.width || y <= 0 || y >= mesh.height)
      return true;
    var loc = _DDLSGeom2D.locatePosition(x, y, mesh);
    var face;
    if (loc instanceof DDLSVertex)
      face = loc.edge.leftFace;
    else if (loc instanceof DDLSEdge)
      face = loc.leftFace;
    else
      face = loc;
    var radiusSquared = radius * radius;
    var pos;
    var distSquared;
    pos = face.edge.originVertex.pos;
    distSquared = (pos.x - x) * (pos.x - x) + (pos.y - y) * (pos.y - y);
    if (distSquared <= radiusSquared) {
      return true;
    }
    pos = face.edge.nextLeftEdge.originVertex.pos;
    distSquared = (pos.x - x) * (pos.x - x) + (pos.y - y) * (pos.y - y);
    if (distSquared <= radiusSquared) {
      return true;
    }
    pos = face.edge.nextLeftEdge.nextLeftEdge.originVertex.pos;
    distSquared = (pos.x - x) * (pos.x - x) + (pos.y - y) * (pos.y - y);
    if (distSquared <= radiusSquared) {
      return true;
    }
    var edgesToCheck = [];
    edgesToCheck.push(face.edge);
    edgesToCheck.push(face.edge.nextLeftEdge);
    edgesToCheck.push(face.edge.nextLeftEdge.nextLeftEdge);
    var edge;
    var pos1;
    var pos2;
    var checkedEdges = {};
    var intersecting;
    while (edgesToCheck.length > 0) {
      edge = edgesToCheck.pop();
      checkedEdges[edge.id] = true;
      pos1 = edge.originVertex.pos;
      pos2 = edge.destinationVertex.pos;
      intersecting = this.intersectionsSegmentCircle(pos1.x, pos1.y, pos2.x, pos2.y, x, y, radius);
      if (intersecting) {
        if (edge.isConstrained)
          return true;
        else {
          edge = edge.oppositeEdge.nextLeftEdge;
          if (!checkedEdges[edge.id] && !checkedEdges[edge.oppositeEdge.id] && edgesToCheck.indexOf(edge) == -1 && edgesToCheck.indexOf(edge.oppositeEdge) == -1) {
            edgesToCheck.push(edge);
          }
          edge = edge.nextLeftEdge;
          if (!checkedEdges[edge.id] && !checkedEdges[edge.oppositeEdge.id] && edgesToCheck.indexOf(edge) == -1 && edgesToCheck.indexOf(edge.oppositeEdge) == -1) {
            edgesToCheck.push(edge);
          }
        }
      }
    }
    return false;
  }
  // return the relative direction from (x1,y1), to (x3,y3) through (x2, y2)
  // the function returns:
  // 0 if the path is a straight line
  // 1 if the path goes to the left
  // -1 if the path goes to the right
  static getDirection(x1, y1, x2, y2, x3, y3) {
    var dot = (x3 - x1) * (y2 - y1) + (y3 - y1) * (-x2 + x1);
    return dot == 0 ? 0 : dot > 0 ? 1 : -1;
  }
  // second version of getDirection. More accurate and safer version
  // return the relative direction from (x1,y1), to (x3,y3) through (x2, y2)
  // the function returns:
  // 0 if the path is a straight line
  // 1 if the path goes to the left
  // -1 if the path goes to the right
  static getDirection2(x1, y1, x2, y2, x3, y3) {
    var dot = (x3 - x1) * (y2 - y1) + (y3 - y1) * (-x2 + x1);
    if (dot == 0) {
      return 0;
    } else if (dot > 0) {
      if (this.distanceSquaredPointToLine(x3, y3, x1, y1, x2, y2) <= DDLSConstants.EPSILON_SQUARED)
        return 0;
      else
        return 1;
    } else {
      if (this.distanceSquaredPointToLine(x3, y3, x1, y1, x2, y2) <= DDLSConstants.EPSILON_SQUARED)
        return 0;
      else
        return -1;
    }
  }
  // eUp <an> seen infinite line splits the 2D space in 2 parts (left and right),
  // the function returns:
  //   0 if the (x, y) lies on the line
  //   1 if the (x, y) lies at left
  //   -1 if the (x, y) lies at right
  static getRelativePosition(x, y, eUp) {
    return this.getDirection(
      eUp.originVertex.pos.x,
      eUp.originVertex.pos.y,
      eUp.destinationVertex.pos.x,
      eUp.destinationVertex.pos.y,
      x,
      y
    );
  }
  static getRelativePosition2(x, y, eUp) {
    return this.getDirection2(
      eUp.originVertex.pos.x,
      eUp.originVertex.pos.y,
      eUp.destinationVertex.pos.x,
      eUp.destinationVertex.pos.y,
      x,
      y
    );
  }
  // the function checks by priority:
  // - if the (x, y) lies on a vertex of the polygon, it will return this vertex
  // - if the (x, y) lies on a edge of the polygon, it will return this edge
  // - if the (x, y) lies inside the polygon, it will return the polygon
  // - if the (x, y) lies outside the polygon, it will return null
  static isInFace(x, y, polygon) {
    var result;
    var e1_2 = polygon.edge;
    var e2_3 = e1_2.nextLeftEdge;
    var e3_1 = e2_3.nextLeftEdge;
    if (this.getRelativePosition(x, y, e1_2) >= 0 && this.getRelativePosition(x, y, e2_3) >= 0 && this.getRelativePosition(x, y, e3_1) >= 0) {
      var v1 = e1_2.originVertex;
      var v2 = e2_3.originVertex;
      var v3 = e3_1.originVertex;
      var x1 = v1.pos.x;
      var y1 = v1.pos.y;
      var x2 = v2.pos.x;
      var y2 = v2.pos.y;
      var x3 = v3.pos.x;
      var y3 = v3.pos.y;
      var v_v1squaredLength = (x1 - x) * (x1 - x) + (y1 - y) * (y1 - y);
      var v_v2squaredLength = (x2 - x) * (x2 - x) + (y2 - y) * (y2 - y);
      var v_v3squaredLength = (x3 - x) * (x3 - x) + (y3 - y) * (y3 - y);
      var v1_v2squaredLength = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
      var v2_v3squaredLength = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
      var v3_v1squaredLength = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
      var dot_v_v1v2 = (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1);
      var dot_v_v2v3 = (x - x2) * (x3 - x2) + (y - y2) * (y3 - y2);
      var dot_v_v3v1 = (x - x3) * (x1 - x3) + (y - y3) * (y1 - y3);
      var v_e1_2squaredLength = v_v1squaredLength - dot_v_v1v2 * dot_v_v1v2 / v1_v2squaredLength;
      var v_e2_3squaredLength = v_v2squaredLength - dot_v_v2v3 * dot_v_v2v3 / v2_v3squaredLength;
      var v_e3_1squaredLength = v_v3squaredLength - dot_v_v3v1 * dot_v_v3v1 / v3_v1squaredLength;
      var closeTo_e1_2 = v_e1_2squaredLength <= DDLSConstants.EPSILON_SQUARED;
      var closeTo_e2_3 = v_e2_3squaredLength <= DDLSConstants.EPSILON_SQUARED;
      var closeTo_e3_1 = v_e3_1squaredLength <= DDLSConstants.EPSILON_SQUARED;
      if (closeTo_e1_2) {
        if (closeTo_e3_1)
          result = v1;
        else if (closeTo_e2_3)
          result = v2;
        else
          result = e1_2;
      } else if (closeTo_e2_3) {
        if (closeTo_e3_1)
          result = v3;
        else
          result = e2_3;
      } else if (closeTo_e3_1)
        result = e3_1;
      else
        result = polygon;
    }
    return result;
  }
  // return:
  // - true if the segment is totally or partially in the triangle
  // - false if the segment is totally outside the triangle
  static clipSegmentByTriangle(s1x, s1y, s2x, s2y, t1x, t1y, t2x, t2y, t3x, t3y, pResult1 = null, pResult2 = null) {
    var side1_1;
    var side1_2;
    side1_1 = this.getDirection(t1x, t1y, t2x, t2y, s1x, s1y);
    side1_2 = this.getDirection(t1x, t1y, t2x, t2y, s2x, s2y);
    if (side1_1 <= 0 && side1_2 <= 0)
      return false;
    var side2_1;
    var side2_2;
    side2_1 = this.getDirection(t2x, t2y, t3x, t3y, s1x, s1y);
    side2_2 = this.getDirection(t2x, t2y, t3x, t3y, s2x, s2y);
    if (side2_1 <= 0 && side2_2 <= 0)
      return false;
    var side3_1;
    var side3_2;
    side3_1 = this.getDirection(t3x, t3y, t1x, t1y, s1x, s1y);
    side3_2 = this.getDirection(t3x, t3y, t1x, t1y, s2x, s2y);
    if (side3_1 <= 0 && side3_2 <= 0)
      return false;
    if (side1_1 >= 0 && side2_1 >= 0 && side3_1 >= 0 && (side1_2 >= 0 && side2_2 >= 0 && side3_2 >= 0)) {
      pResult1.x = s1x;
      pResult1.y = s1y;
      pResult2.x = s2x;
      pResult2.y = s2y;
      return true;
    }
    var n = 0;
    if (this.intersections2segments(s1x, s1y, s2x, s2y, t1x, t1y, t2x, t2y, pResult1, null)) {
      n++;
    }
    if (n == 0) {
      if (this.intersections2segments(s1x, s1y, s2x, s2y, t2x, t2y, t3x, t3y, pResult1, null)) {
        n++;
      }
    } else {
      if (this.intersections2segments(s1x, s1y, s2x, s2y, t2x, t2y, t3x, t3y, pResult2, null)) {
        if (-DDLSConstants.EPSILON > pResult1.x - pResult2.x || pResult1.x - pResult2.x > DDLSConstants.EPSILON || -DDLSConstants.EPSILON > pResult1.y - pResult2.y || pResult1.y - pResult2.y > DDLSConstants.EPSILON) {
          n++;
        }
      }
    }
    if (n == 0) {
      if (this.intersections2segments(s1x, s1y, s2x, s2y, t3x, t3y, t1x, t1y, pResult1, null)) {
        n++;
      }
    } else if (n == 1) {
      if (this.intersections2segments(s1x, s1y, s2x, s2y, t3x, t3y, t1x, t1y, pResult2, null)) {
        if (-DDLSConstants.EPSILON > pResult1.x - pResult2.x || pResult1.x - pResult2.x > DDLSConstants.EPSILON || -DDLSConstants.EPSILON > pResult1.y - pResult2.y || pResult1.y - pResult2.y > DDLSConstants.EPSILON) {
          n++;
        }
      }
    }
    if (n == 1) {
      if (side1_1 >= 0 && side2_1 >= 0 && side3_1 >= 0) {
        pResult2.x = s1x;
        pResult2.y = s1y;
      } else if (side1_2 >= 0 && side2_2 >= 0 && side3_2 >= 0) {
        pResult2.x = s2x;
        pResult2.y = s2y;
      } else {
        n = 0;
      }
    }
    if (n > 0)
      return true;
    else
      return false;
  }
  // test if the segment intersects or lies inside the triangle
  static isSegmentIntersectingTriangle(s1x, s1y, s2x, s2y, t1x, t1y, t2x, t2y, t3x, t3y) {
    var side1_1;
    var side1_2;
    side1_1 = this.getDirection(t1x, t1y, t2x, t2y, s1x, s1y);
    side1_2 = this.getDirection(t1x, t1y, t2x, t2y, s2x, s2y);
    if (side1_1 <= 0 && side1_2 <= 0)
      return false;
    var side2_1;
    var side2_2;
    side2_1 = this.getDirection(t2x, t2y, t3x, t3y, s1x, s1y);
    side2_2 = this.getDirection(t2x, t2y, t3x, t3y, s2x, s2y);
    if (side2_1 <= 0 && side2_2 <= 0)
      return false;
    var side3_1;
    var side3_2;
    side3_1 = this.getDirection(t3x, t3y, t1x, t1y, s1x, s1y);
    side3_2 = this.getDirection(t3x, t3y, t1x, t1y, s2x, s2y);
    if (side3_1 <= 0 && side3_2 <= 0)
      return false;
    if (side1_1 == 1 && side2_1 == 1 && side3_1 == 1)
      return true;
    if (side1_1 == 1 && side2_1 == 1 && side3_1 == 1)
      return true;
    var side1;
    var side2;
    if (side1_1 == 1 && side1_2 <= 0 || side1_1 <= 0 && side1_2 == 1) {
      side1 = this.getDirection(s1x, s1y, s2x, s2y, t1x, t1y);
      side2 = this.getDirection(s1x, s1y, s2x, s2y, t2x, t2y);
      if (side1 == 1 && side2 <= 0 || side1 <= 0 && side2 == 1) {
        return true;
      }
    }
    if (side2_1 == 1 && side2_2 <= 0 || side2_1 <= 0 && side2_2 == 1) {
      side1 = this.getDirection(s1x, s1y, s2x, s2y, t2x, t2y);
      side2 = this.getDirection(s1x, s1y, s2x, s2y, t3x, t3y);
      if (side1 == 1 && side2 <= 0 || side1 <= 0 && side2 == 1) {
        return true;
      }
    }
    if (side3_1 == 1 && side3_2 <= 0 || side3_1 <= 0 && side3_2 == 1) {
      side1 = this.getDirection(s1x, s1y, s2x, s2y, t3x, t3y);
      side2 = this.getDirection(s1x, s1y, s2x, s2y, t1x, t1y);
      if (side1 == 1 && side2 <= 0 || side1 <= 0 && side2 == 1) {
        return true;
      }
    }
    return false;
  }
  static isDelaunay(edge) {
    var vLeft = edge.originVertex;
    var vRight = edge.destinationVertex;
    var vCorner = edge.nextLeftEdge.destinationVertex;
    var vOpposite = edge.nextRightEdge.destinationVertex;
    this.getCircumcenter(vCorner.pos.x, vCorner.pos.y, vLeft.pos.x, vLeft.pos.y, vRight.pos.x, vRight.pos.y, this.__circumcenter);
    var squaredRadius = (vCorner.pos.x - this.__circumcenter.x) * (vCorner.pos.x - this.__circumcenter.x) + (vCorner.pos.y - this.__circumcenter.y) * (vCorner.pos.y - this.__circumcenter.y);
    var squaredDistance = (vOpposite.pos.x - this.__circumcenter.x) * (vOpposite.pos.x - this.__circumcenter.x) + (vOpposite.pos.y - this.__circumcenter.y) * (vOpposite.pos.y - this.__circumcenter.y);
    return squaredDistance >= squaredRadius;
  }
  static getCircumcenter(x1, y1, x2, y2, x3, y3, result = null) {
    if (!result) {
      result = new DDLSPoint2D();
    }
    var m1 = (x1 + x2) / 2;
    var m2 = (y1 + y2) / 2;
    var m3 = (x1 + x3) / 2;
    var m4 = (y1 + y3) / 2;
    var t1 = (m1 * (x1 - x3) + (m2 - m4) * (y1 - y3) + m3 * (x3 - x1)) / (x1 * (y3 - y2) + x2 * (y1 - y3) + x3 * (y2 - y1));
    result.x = m1 + t1 * (y2 - y1);
    result.y = m2 - t1 * (x2 - x1);
    return result;
  }
  static intersections2segments(s1p1x, s1p1y, s1p2x, s1p2y, s2p1x, s2p1y, s2p2x, s2p2y, posIntersection = null, paramIntersection = null, infiniteLineMode = false) {
    var t1;
    var t2;
    var result;
    var divisor = (s1p1x - s1p2x) * (s2p1y - s2p2y) + (s1p2y - s1p1y) * (s2p1x - s2p2x);
    if (divisor == 0) {
      result = false;
    } else {
      result = true;
      if (!infiniteLineMode || posIntersection || paramIntersection) {
        t1 = (s1p1x * (s2p1y - s2p2y) + s1p1y * (s2p2x - s2p1x) + s2p1x * s2p2y - s2p1y * s2p2x) / divisor;
        t2 = (s1p1x * (s2p1y - s1p2y) + s1p1y * (s1p2x - s2p1x) - s1p2x * s2p1y + s1p2y * s2p1x) / divisor;
        if (!infiniteLineMode && !(0 <= t1 && t1 <= 1 && 0 <= t2 && t2 <= 1))
          result = false;
      }
    }
    if (result) {
      if (posIntersection) {
        posIntersection.x = s1p1x + t1 * (s1p2x - s1p1x);
        posIntersection.y = s1p1y + t1 * (s1p2y - s1p1y);
      }
      if (paramIntersection) {
        paramIntersection.push(t1, t2);
      }
    }
    return result;
  }
  static intersections2edges(edge1, edge2, posIntersection = null, paramIntersection = null, infiniteLineMode = false) {
    return this.intersections2segments(
      edge1.originVertex.pos.x,
      edge1.originVertex.pos.y,
      edge1.destinationVertex.pos.x,
      edge1.destinationVertex.pos.y,
      edge2.originVertex.pos.x,
      edge2.originVertex.pos.y,
      edge2.destinationVertex.pos.x,
      edge2.destinationVertex.pos.y,
      posIntersection,
      paramIntersection,
      infiniteLineMode
    );
  }
  // a edge is convex if the polygon formed by the 2 faces at left and right of this edge is convex
  static isConvex(edge) {
    var result = true;
    var eLeft;
    var vRight;
    eLeft = edge.nextLeftEdge.oppositeEdge;
    vRight = edge.nextRightEdge.destinationVertex;
    if (this.getRelativePosition(vRight.pos.x, vRight.pos.y, eLeft) != -1) {
      result = false;
    } else {
      eLeft = edge.prevRightEdge;
      vRight = edge.prevLeftEdge.originVertex;
      if (this.getRelativePosition(vRight.pos.x, vRight.pos.y, eLeft) != -1) {
        result = false;
      }
    }
    return result;
  }
  static projectOrthogonaly(vertexPos, edge) {
    var a = edge.originVertex.pos.x;
    var b = edge.originVertex.pos.y;
    var c = edge.destinationVertex.pos.x;
    var d = edge.destinationVertex.pos.y;
    var e = vertexPos.x;
    var f = vertexPos.y;
    var t1 = (a * a - a * c - a * e + b * b - b * d - b * f + c * e + d * f) / (a * a - 2 * a * c + b * b - 2 * b * d + c * c + d * d);
    vertexPos.x = a + t1 * (c - a);
    vertexPos.y = b + t1 * (d - b);
  }
  static projectOrthogonalyOnSegment(px, py, sp1x, sp1y, sp2x, sp2y, result) {
    var a = sp1x;
    var b = sp1y;
    var c = sp2x;
    var d = sp2y;
    var e = px;
    var f = py;
    var t1 = (a * a - a * c - a * e + b * b - b * d - b * f + c * e + d * f) / (a * a - 2 * a * c + b * b - 2 * b * d + c * c + d * d);
    result.x = a + t1 * (c - a);
    result.y = b + t1 * (d - b);
  }
  // fill the result vector with 4 elements, with the form:
  // [intersect0.x, intersect0.y, intersect1.x, intersect1.y]
  // empty if no intersection
  static intersections2Circles(cx1, cy1, r1, cx2, cy2, r2, result = null) {
    var distRadiusSQRD = (cx2 - cx1) * (cx2 - cx1) + (cy2 - cy1) * (cy2 - cy1);
    if ((cx1 != cx2 || cy1 != cy2) && distRadiusSQRD <= (r1 + r2) * (r1 + r2) && distRadiusSQRD >= (r1 - r2) * (r1 - r2)) {
      var transcendPart = Math.sqrt(((r1 + r2) * (r1 + r2) - distRadiusSQRD) * (distRadiusSQRD - (r2 - r1) * (r2 - r1)));
      var xFirstPart = (cx1 + cx2) / 2 + (cx2 - cx1) * (r1 * r1 - r2 * r2) / (2 * distRadiusSQRD);
      var yFirstPart = (cy1 + cy2) / 2 + (cy2 - cy1) * (r1 * r1 - r2 * r2) / (2 * distRadiusSQRD);
      var xFactor = (cy2 - cy1) / (2 * distRadiusSQRD);
      var yFactor = (cx2 - cx1) / (2 * distRadiusSQRD);
      if (result) {
        result.push(
          xFirstPart + xFactor * transcendPart,
          yFirstPart - yFactor * transcendPart,
          xFirstPart - xFactor * transcendPart,
          yFirstPart + yFactor * transcendPart
        );
      }
      return true;
    } else
      return false;
  }
  static intersectionsSegmentCircle(p0x, p0y, p1x, p1y, cx, cy, r, result = null) {
    var p0xSQD = p0x * p0x;
    var p0ySQD = p0y * p0y;
    var a = p1y * p1y - 2 * p1y * p0y + p0ySQD + p1x * p1x - 2 * p1x * p0x + p0xSQD;
    var b = 2 * p0y * cy - 2 * p0xSQD + 2 * p1y * p0y - 2 * p0ySQD + 2 * p1x * p0x - 2 * p1x * cx + 2 * p0x * cx - 2 * p1y * cy;
    var c = p0ySQD + cy * cy + cx * cx - 2 * p0y * cy - 2 * p0x * cx + p0xSQD - r * r;
    var delta = b * b - 4 * a * c;
    var deltaSQRT;
    var t0;
    var t1;
    if (delta < 0) {
      return false;
    } else if (delta == 0) {
      t0 = -b / (2 * a);
      if (t0 < 0 || t0 > 1)
        return false;
      if (result)
        result.push(p0x + t0 * (p1x - p0x), p0y + t0 * (p1y - p0y), t0);
      return true;
    } else {
      deltaSQRT = Math.sqrt(delta);
      t0 = (-b + deltaSQRT) / (2 * a);
      t1 = (-b - deltaSQRT) / (2 * a);
      var intersecting = false;
      if (0 <= t0 && t0 <= 1) {
        if (result)
          result.push(p0x + t0 * (p1x - p0x), p0y + t0 * (p1y - p0y), t0);
        intersecting = true;
      }
      if (0 <= t1 && t1 <= 1) {
        if (result)
          result.push(p0x + t1 * (p1x - p0x), p0y + t1 * (p1y - p0y), t1);
        intersecting = true;
      }
      return intersecting;
    }
  }
  static intersectionsLineCircle(p0x, p0y, p1x, p1y, cx, cy, r, result) {
    var p0xSQD = p0x * p0x;
    var p0ySQD = p0y * p0y;
    var a = p1y * p1y - 2 * p1y * p0y + p0ySQD + p1x * p1x - 2 * p1x * p0x + p0xSQD;
    var b = 2 * p0y * cy - 2 * p0xSQD + 2 * p1y * p0y - 2 * p0ySQD + 2 * p1x * p0x - 2 * p1x * cx + 2 * p0x * cx - 2 * p1y * cy;
    var c = p0ySQD + cy * cy + cx * cx - 2 * p0y * cy - 2 * p0x * cx + p0xSQD - r * r;
    var delta = b * b - 4 * a * c;
    var deltaSQRT;
    var t0;
    var t1;
    if (delta < 0) {
      return false;
    } else if (delta == 0) {
      t0 = -b / (2 * a);
      result.push(p0x + t0 * (p1x - p0x), p0y + t0 * (p1y - p0y), t0);
    } else if (delta > 0) {
      deltaSQRT = Math.sqrt(delta);
      t0 = (-b + deltaSQRT) / (2 * a);
      t1 = (-b - deltaSQRT) / (2 * a);
      result.push(p0x + t0 * (p1x - p0x), p0y + t0 * (p1y - p0y), t0, p0x + t1 * (p1x - p0x), p0y + t1 * (p1y - p0y), t1);
    }
    return true;
  }
  // based on intersections2Circles method
  // fill the result vector with 4 elements, with the form:
  // [point_tangent1.x, point_tangent1.y, point_tangent2.x, point_tangent2.y]
  // empty if no tangent
  static tangentsPointToCircle(px, py, cx, cy, r, result) {
    var c2x = (px + cx) / 2;
    var c2y = (py + cy) / 2;
    var r2 = 0.5 * Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
    this.intersections2Circles(c2x, c2y, r2, cx, cy, r, result);
  }
  // <!!!> CIRCLES MUST HAVE SAME RADIUS
  static tangentsCrossCircleToCircle(r, c1x, c1y, c2x, c2y, result) {
    var distance = Math.sqrt((c1x - c2x) * (c1x - c2x) + (c1y - c2y) * (c1y - c2y));
    var radius = distance / 4;
    var centerX = c1x + (c2x - c1x) / 4;
    var centerY = c1y + (c2y - c1y) / 4;
    if (this.intersections2Circles(c1x, c1y, r, centerX, centerY, radius, result)) {
      var t1x = result[0];
      var t1y = result[1];
      var t2x = result[2];
      var t2y = result[3];
      var midX = (c1x + c2x) / 2;
      var midY = (c1y + c2y) / 2;
      var dotProd = (t1x - midX) * (c2y - c1y) + (t1y - midY) * (-c2x + c1x);
      var tproj = dotProd / (distance * distance);
      var projx = midX + tproj * (c2y - c1y);
      var projy = midY - tproj * (c2x - c1x);
      var t4x = 2 * projx - t1x;
      var t4y = 2 * projy - t1y;
      var t3x = t4x + t2x - t1x;
      var t3y = t2y + t4y - t1y;
      result.push(t3x, t3y, t4x, t4y);
      return true;
    } else {
      return false;
    }
  }
  // <!!!> CIRCLES MUST HAVE SAME RADIUS
  static tangentsParalCircleToCircle(r, c1x, c1y, c2x, c2y, result) {
    var distance = Math.sqrt((c1x - c2x) * (c1x - c2x) + (c1y - c2y) * (c1y - c2y));
    var t1x = c1x + r * (c2y - c1y) / distance;
    var t1y = c1y + r * (-c2x + c1x) / distance;
    var t2x = 2 * c1x - t1x;
    var t2y = 2 * c1y - t1y;
    var t3x = t2x + c2x - c1x;
    var t3y = t2y + c2y - c1y;
    var t4x = t1x + c2x - c1x;
    var t4y = t1y + c2y - c1y;
    result.push(t1x, t1y, t2x, t2y, t3x, t3y, t4x, t4y);
  }
  // squared distance from point p to infinite line (a, b)
  static distanceSquaredPointToLine(px, py, ax, ay, bx, by) {
    var a_b_squaredLength = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
    var dotProduct = (px - ax) * (bx - ax) + (py - ay) * (by - ay);
    var p_a_squaredLength = (ax - px) * (ax - px) + (ay - py) * (ay - py);
    return p_a_squaredLength - dotProduct * dotProduct / a_b_squaredLength;
  }
  // squared distance from point p to finite segment [a, b]
  static distanceSquaredPointToSegment(px, py, ax, ay, bx, by) {
    var a_b_squaredLength = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
    var dotProduct = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / a_b_squaredLength;
    if (dotProduct < 0) {
      return (px - ax) * (px - ax) + (py - ay) * (py - ay);
    } else if (dotProduct <= 1) {
      var p_a_squaredLength = (ax - px) * (ax - px) + (ay - py) * (ay - py);
      return p_a_squaredLength - dotProduct * dotProduct * a_b_squaredLength;
    } else {
      return (px - bx) * (px - bx) + (py - by) * (py - by);
    }
  }
  static distanceSquaredVertexToEdge(vertex, edge) {
    return this.distanceSquaredPointToSegment(
      vertex.pos.x,
      vertex.pos.y,
      edge.originVertex.pos.x,
      edge.originVertex.pos.y,
      edge.destinationVertex.pos.x,
      edge.destinationVertex.pos.y
    );
  }
  static pathLength(path) {
    var sumDistance = 0;
    var fromX = path[0];
    var fromY = path[1];
    var nextX;
    var nextY;
    var x;
    var y;
    var distance;
    for (var i = 2; i < path.length; i += 2) {
      nextX = path[i];
      nextY = path[i + 1];
      x = nextX - fromX;
      y = nextY - fromY;
      distance = Math.sqrt(x * x + y * y);
      sumDistance += distance;
      fromX = nextX;
      fromY = nextY;
    }
    return sumDistance;
  }
};
// return one the following, in priority order:
// - an existant vertex (if (x, y) lies on this vertex)
// or 
// - an existant edge (if (x, y) lies on this edge )
// or
// - an existant face (if (x, y) lies on this face )
// or
// - null if outside mesh
// YOU SHOULD USE THIS FUNCTION ONLY FOR COORDINATES INSIDE SAFE AREA
_DDLSGeom2D.__samples = [];
_DDLSGeom2D.__circumcenter = new DDLSPoint2D();
var DDLSGeom2D = _DDLSGeom2D;

// src/ddls/ai/DDLSAStar.ts
var DDLSAStar = class {
  constructor() {
    this.__iterEdge = new IteratorFromFaceToInnerEdges();
  }
  dispose() {
    this._mesh = null;
    this.__closedFaces = null;
    this.__sortedOpenedFaces = null;
    this.__openedFaces = null;
    this.__entryEdges = null;
    this.__entryX = null;
    this.__entryY = null;
    this.__scoreF = null;
    this.__scoreG = null;
    this.__scoreH = null;
    this.__predecessor = null;
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    this._radius = value;
    this._radiusSquared = this._radius * this._radius;
    this._diameter = this._radius * 2;
    this._diameterSquared = this._diameter * this._diameter;
  }
  set mesh(value) {
    this._mesh = value;
  }
  findPath(fromX, fromY, toX, toY, resultListFaces, resultListEdges) {
    this.__closedFaces = {};
    this.__sortedOpenedFaces = [];
    this.__openedFaces = {};
    this.__entryEdges = {};
    this.__entryX = {};
    this.__entryY = {};
    this.__scoreF = {};
    this.__scoreG = {};
    this.__scoreH = {};
    this.__predecessor = {};
    var loc;
    var locEdge;
    var locVertex;
    var distance;
    var p1;
    var p2;
    var p3;
    loc = DDLSGeom2D.locatePosition(fromX, fromY, this._mesh);
    locVertex = loc instanceof DDLSVertex ? loc : null;
    if (locVertex) {
      return;
    } else if (locEdge = loc instanceof DDLSEdge ? loc : null) {
      if (locEdge.isConstrained)
        return;
      this.__fromFace = locEdge.leftFace;
    } else {
      this.__fromFace = loc instanceof DDLSFace ? loc : null;
    }
    loc = DDLSGeom2D.locatePosition(toX, toY, this._mesh);
    locVertex = loc instanceof DDLSVertex ? loc : null;
    if (locVertex)
      this.__toFace = locVertex.edge.leftFace;
    else if (locEdge = loc instanceof DDLSEdge ? loc : null)
      this.__toFace = locEdge.leftFace;
    else
      this.__toFace = loc instanceof DDLSFace ? loc : null;
    this.__sortedOpenedFaces.push(this.__fromFace);
    this.__entryEdges[this.__fromFace.id] = null;
    this.__entryX[this.__fromFace.id] = fromX;
    this.__entryY[this.__fromFace.id] = fromY;
    this.__scoreG[this.__fromFace.id] = 0;
    this.__scoreH[this.__fromFace.id] = Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));
    this.__scoreF[this.__fromFace.id] = this.__scoreH[this.__fromFace.id] + this.__scoreG[this.__fromFace.id];
    var innerEdge;
    var neighbourFace;
    var f;
    var g;
    var h;
    var fromPoint = new DDLSPoint2D();
    var entryPoint = new DDLSPoint2D();
    var distancePoint = new DDLSPoint2D();
    var fillDatas;
    while (true) {
      if (this.__sortedOpenedFaces.length == 0) {
        this.__curFace = null;
        break;
      }
      this.__curFace = this.__sortedOpenedFaces.pop();
      if (this.__curFace == this.__toFace) {
        break;
      }
      this.__iterEdge.fromFace = this.__curFace;
      innerEdge = this.__iterEdge.next();
      while (innerEdge) {
        if (innerEdge.isConstrained) {
          innerEdge = this.__iterEdge.next();
          continue;
        }
        neighbourFace = innerEdge.rightFace;
        if (!this.__closedFaces[neighbourFace.id]) {
          if (this.__curFace != this.__fromFace && this._radius > 0 && !this.isWalkableByRadius(this.__entryEdges[this.__curFace.id], this.__curFace, innerEdge)) {
            innerEdge = this.__iterEdge.next();
            continue;
          }
          fromPoint.x = this.__entryX[this.__curFace.id];
          fromPoint.y = this.__entryY[this.__curFace.id];
          entryPoint.x = (innerEdge.originVertex.pos.x + innerEdge.destinationVertex.pos.x) / 2;
          entryPoint.y = (innerEdge.originVertex.pos.y + innerEdge.destinationVertex.pos.y) / 2;
          distancePoint.x = entryPoint.x - toX;
          distancePoint.y = entryPoint.y - toY;
          h = distancePoint.length;
          distancePoint.x = fromPoint.x - entryPoint.x;
          distancePoint.y = fromPoint.y - entryPoint.y;
          g = this.__scoreG[this.__curFace.id] + distancePoint.length;
          f = h + g;
          fillDatas = false;
          if (!this.__openedFaces[neighbourFace.id]) {
            this.__sortedOpenedFaces.push(neighbourFace);
            this.__openedFaces[neighbourFace.id] = true;
            fillDatas = true;
          } else if (this.__scoreF[neighbourFace.id] > f) {
            fillDatas = true;
          }
          if (fillDatas) {
            this.__entryEdges[neighbourFace.id] = innerEdge;
            this.__entryX[neighbourFace.id] = entryPoint.x;
            this.__entryY[neighbourFace.id] = entryPoint.y;
            this.__scoreF[neighbourFace.id] = f;
            this.__scoreG[neighbourFace.id] = g;
            this.__scoreH[neighbourFace.id] = h;
            this.__predecessor[neighbourFace.id] = this.__curFace;
          }
        }
        innerEdge = this.__iterEdge.next();
      }
      this.__openedFaces[this.__curFace.id] = null;
      this.__closedFaces[this.__curFace.id] = true;
      this.__sortedOpenedFaces.sort(
        // faces with low distance value are at the end of the array
        (a, b) => {
          if (this.__scoreF[a.id] == this.__scoreF[b.id])
            return 0;
          else if (this.__scoreF[a.id] < this.__scoreF[b.id])
            return 1;
          else
            return -1;
        }
      );
    }
    if (!this.__curFace)
      return;
    resultListFaces.push(this.__curFace);
    while (this.__curFace != this.__fromFace) {
      resultListEdges.unshift(this.__entryEdges[this.__curFace.id]);
      this.__curFace = this.__predecessor[this.__curFace.id];
      resultListFaces.unshift(this.__curFace);
    }
  }
  isWalkableByRadius(fromEdge, throughFace, toEdge) {
    var vA;
    var vB;
    var vC;
    if (fromEdge.originVertex == toEdge.originVertex) {
      vA = fromEdge.destinationVertex;
      vB = toEdge.destinationVertex;
      vC = fromEdge.originVertex;
    } else if (fromEdge.destinationVertex == toEdge.destinationVertex) {
      vA = fromEdge.originVertex;
      vB = toEdge.originVertex;
      vC = fromEdge.destinationVertex;
    } else if (fromEdge.originVertex == toEdge.destinationVertex) {
      vA = fromEdge.destinationVertex;
      vB = toEdge.originVertex;
      vC = fromEdge.originVertex;
    } else if (fromEdge.destinationVertex == toEdge.originVertex) {
      vA = fromEdge.originVertex;
      vB = toEdge.destinationVertex;
      vC = fromEdge.destinationVertex;
    }
    var dot;
    var result;
    var distSquared;
    dot = (vC.pos.x - vA.pos.x) * (vB.pos.x - vA.pos.x) + (vC.pos.y - vA.pos.y) * (vB.pos.y - vA.pos.y);
    if (dot <= 0) {
      distSquared = (vC.pos.x - vA.pos.x) * (vC.pos.x - vA.pos.x) + (vC.pos.y - vA.pos.y) * (vC.pos.y - vA.pos.y);
      if (distSquared >= this._diameterSquared)
        return true;
      else
        return false;
    }
    dot = (vC.pos.x - vB.pos.x) * (vA.pos.x - vB.pos.x) + (vC.pos.y - vB.pos.y) * (vA.pos.y - vB.pos.y);
    if (dot <= 0) {
      distSquared = (vC.pos.x - vB.pos.x) * (vC.pos.x - vB.pos.x) + (vC.pos.y - vB.pos.y) * (vC.pos.y - vB.pos.y);
      if (distSquared >= this._diameterSquared)
        return true;
      else
        return false;
    }
    var adjEdge;
    if (throughFace.edge != fromEdge && throughFace.edge.oppositeEdge != fromEdge && throughFace.edge != toEdge && throughFace.edge.oppositeEdge != toEdge)
      adjEdge = throughFace.edge;
    else if (throughFace.edge.nextLeftEdge != fromEdge && throughFace.edge.nextLeftEdge.oppositeEdge != fromEdge && throughFace.edge.nextLeftEdge != toEdge && throughFace.edge.nextLeftEdge.oppositeEdge != toEdge)
      adjEdge = throughFace.edge.nextLeftEdge;
    else
      adjEdge = throughFace.edge.prevLeftEdge;
    if (adjEdge.isConstrained) {
      var proj = new DDLSPoint2D(vC.pos.x, vC.pos.y);
      DDLSGeom2D.projectOrthogonaly(proj, adjEdge);
      distSquared = (proj.x - vC.pos.x) * (proj.x - vC.pos.x) + (proj.y - vC.pos.y) * (proj.y - vC.pos.y);
      if (distSquared >= this._diameterSquared)
        return true;
      else
        return false;
    } else {
      var distSquaredA = (vC.pos.x - vA.pos.x) * (vC.pos.x - vA.pos.x) + (vC.pos.y - vA.pos.y) * (vC.pos.y - vA.pos.y);
      var distSquaredB = (vC.pos.x - vB.pos.x) * (vC.pos.x - vB.pos.x) + (vC.pos.y - vB.pos.y) * (vC.pos.y - vB.pos.y);
      if (distSquaredA < this._diameterSquared || distSquaredB < this._diameterSquared) {
        return false;
      } else {
        var vFaceToCheck = [];
        var vFaceIsFromEdge = [];
        var facesDone = {};
        vFaceIsFromEdge.push(adjEdge);
        if (adjEdge.leftFace == throughFace) {
          vFaceToCheck.push(adjEdge.rightFace);
          facesDone[adjEdge.rightFace.id] = true;
        } else {
          vFaceToCheck.push(adjEdge.leftFace);
          facesDone[adjEdge.leftFace.id] = true;
        }
        var currFace;
        var faceFromEdge;
        var currEdgeA;
        var nextFaceA;
        var currEdgeB;
        var nextFaceB;
        while (vFaceToCheck.length > 0) {
          currFace = vFaceToCheck.shift();
          faceFromEdge = vFaceIsFromEdge.shift();
          if (currFace.edge == faceFromEdge || currFace.edge == faceFromEdge.oppositeEdge) {
            currEdgeA = currFace.edge.nextLeftEdge;
            currEdgeB = currFace.edge.nextLeftEdge.nextLeftEdge;
          } else if (currFace.edge.nextLeftEdge == faceFromEdge || currFace.edge.nextLeftEdge == faceFromEdge.oppositeEdge) {
            currEdgeA = currFace.edge;
            currEdgeB = currFace.edge.nextLeftEdge.nextLeftEdge;
          } else {
            currEdgeA = currFace.edge;
            currEdgeB = currFace.edge.nextLeftEdge;
          }
          if (currEdgeA.leftFace == currFace)
            nextFaceA = currEdgeA.rightFace;
          else
            nextFaceA = currEdgeA.leftFace;
          if (currEdgeB.leftFace == currFace)
            nextFaceB = currEdgeB.rightFace;
          else
            nextFaceB = currEdgeB.leftFace;
          if (!facesDone[nextFaceA.id] && DDLSGeom2D.distanceSquaredVertexToEdge(vC, currEdgeA) < this._diameterSquared) {
            if (currEdgeA.isConstrained) {
              return false;
            } else {
              vFaceToCheck.push(nextFaceA);
              vFaceIsFromEdge.push(currEdgeA);
              facesDone[nextFaceA.id] = true;
            }
          }
          if (!facesDone[nextFaceB.id] && DDLSGeom2D.distanceSquaredVertexToEdge(vC, currEdgeB) < this._diameterSquared) {
            if (currEdgeB.isConstrained) {
              return false;
            } else {
              vFaceToCheck.push(nextFaceB);
              vFaceIsFromEdge.push(currEdgeB);
              facesDone[nextFaceB.id] = true;
            }
          }
        }
        return true;
      }
    }
    return true;
  }
};

// src/ddls/data/math/DDLSMatrix2D.ts
var DDLSMatrix2D = class _DDLSMatrix2D {
  constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    this._a = this.a;
    this._b = this.b;
    this._c = this.c;
    this._d = this.d;
    this._e = this.e;
    this._f = this.f;
  }
  identity() {
    this._a = 1;
    this._b = 0;
    this._c = 0;
    this._d = 1;
    this._e = 0;
    this._f = 0;
  }
  translate(tx, ty) {
    this._e = this._e + tx;
    this._f = this._f + ty;
  }
  scale(sx, sy) {
    this._a = this._a * sx;
    this._b = this._b * sy;
    this._c = this._c * sx;
    this._d = this._d * sy;
    this._e = this._e * sx;
    this._f = this._f * sy;
  }
  rotate(rad) {
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var a = this._a * cos + this._b * -sin;
    var b = this._a * sin + this._b * cos;
    var c = this._c * cos + this._d * -sin;
    var d = this._c * sin + this._d * cos;
    var e = this._e * cos + this._f * -sin;
    var f = this._e * sin + this._f * cos;
    this._a = this.a;
    this._b = this.b;
    this._c = this.c;
    this._d = this.d;
    this._e = this.e;
    this._f = this.f;
  }
  clone() {
    return new _DDLSMatrix2D(this._a, this._b, this._c, this._d, this._e, this._f);
  }
  tranform(point) {
    var x = this._a * point.x + this._c * point.y + this.e;
    var y = this._b * point.x + this._d * point.y + this.f;
    point.x = x;
    point.y = y;
  }
  transformX(x, y) {
    return this._a * x + this._c * y + this.e;
  }
  transformY(x, y) {
    return this._b * x + this._d * y + this.f;
  }
  concat(matrix) {
    var a = this._a * matrix.a + this._b * matrix.c;
    var b = this._a * matrix.b + this._b * matrix.d;
    var c = this._c * matrix.a + this._d * matrix.c;
    var d = this._c * matrix.b + this._d * matrix.d;
    var e = this._e * matrix.a + this._f * matrix.c + matrix.e;
    var f = this._e * matrix.b + this._f * matrix.d + matrix.f;
    this._a = this.a;
    this._b = this.b;
    this._c = this.c;
    this._d = this.d;
    this._e = this.e;
    this._f = this.f;
  }
  get a() {
    return this._a;
  }
  set a(value) {
    this._a = value;
  }
  get b() {
    return this._b;
  }
  set b(value) {
    this._b = value;
  }
  get c() {
    return this._c;
  }
  set c(value) {
    this._c = value;
  }
  get d() {
    return this._d;
  }
  set d(value) {
    this._d = value;
  }
  get e() {
    return this._e;
  }
  set e(value) {
    this._e = value;
  }
  get f() {
    return this._f;
  }
  set f(value) {
    this._f = value;
  }
};

// src/ddls/data/DDLSObject.ts
var _DDLSObject = class _DDLSObject {
  constructor() {
    this._id = _DDLSObject.INC;
    _DDLSObject.INC++;
    this._pivotX = 0;
    this._pivotY = 0;
    this._matrix = new DDLSMatrix2D();
    this._scaleX = 1;
    this._scaleY = 1;
    this._rotation = 0;
    this._x = 0;
    this._y = 0;
    this._coordinates = [];
    this._hasChanged = false;
  }
  get id() {
    return this._id;
  }
  dispose() {
    this._matrix = null;
    this._coordinates = null;
    this._constraintShape = null;
  }
  updateValuesFromMatrix() {
  }
  updateMatrixFromValues() {
    this._matrix.identity();
    this._matrix.translate(-this._pivotX, -this._pivotY);
    this._matrix.scale(this._scaleX, this._scaleY);
    this._matrix.rotate(this._rotation);
    this._matrix.translate(this._x, this._y);
  }
  get pivotX() {
    return this._pivotX;
  }
  set pivotX(value) {
    this._pivotX = value;
    this._hasChanged = true;
  }
  get pivotY() {
    return this._pivotY;
  }
  set pivotY(value) {
    this._pivotY = value;
    this._hasChanged = true;
  }
  get scaleX() {
    return this._scaleX;
  }
  set scaleX(value) {
    if (this._scaleX != value) {
      this._scaleX = value;
      this._hasChanged = true;
    }
  }
  get scaleY() {
    return this._scaleY;
  }
  set scaleY(value) {
    if (this._scaleY != value) {
      this._scaleY = value;
      this._hasChanged = true;
    }
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    if (this._rotation != value) {
      this._rotation = value;
      this._hasChanged = true;
    }
  }
  get x() {
    return this._x;
  }
  set x(value) {
    if (this._x != value) {
      this._x = value;
      this._hasChanged = true;
    }
  }
  get y() {
    return this._y;
  }
  set y(value) {
    if (this._y != value) {
      this._y = value;
      this._hasChanged = true;
    }
  }
  get matrix() {
    return this._matrix;
  }
  set matrix(value) {
    this._matrix = value;
    this._hasChanged = true;
  }
  get coordinates() {
    return this._coordinates;
  }
  set coordinates(value) {
    this._coordinates = value;
    this._hasChanged = true;
  }
  get constraintShape() {
    return this._constraintShape;
  }
  set constraintShape(value) {
    this._constraintShape = value;
    this._hasChanged = true;
  }
  get hasChanged() {
    return this._hasChanged;
  }
  set hasChanged(value) {
    this._hasChanged = value;
  }
  get edges() {
    var res = [];
    for (var i = 0; i < this._constraintShape.segments.length; i++) {
      for (var j = 0; j < this._constraintShape.segments[i].edges.length; j++)
        res.push(this._constraintShape.segments[i].edges[j]);
    }
    return res;
  }
};
_DDLSObject.INC = 0;
var DDLSObject = _DDLSObject;

// src/ddls/ai/DDLSEntityAI.ts
var _DDLSEntityAI = class _DDLSEntityAI {
  constructor() {
    this._radius = 10;
    this._x = this._y = 0;
    this._dirNormX = 1;
    this._dirNormY = 0;
    this._angleFOV = 60;
  }
  buildApproximation() {
    this._approximateObject = new DDLSObject();
    this._approximateObject.matrix.translate(this.x, this.y);
    let coordinates = new Array();
    this._approximateObject.coordinates = coordinates;
    if (this._radius == 0)
      return;
    for (let i = 0; i < _DDLSEntityAI.NUM_SEGMENTS; i++) {
      coordinates.push(this._radius * Math.cos(2 * Math.PI * i / _DDLSEntityAI.NUM_SEGMENTS));
      coordinates.push(this._radius * Math.sin(2 * Math.PI * i / _DDLSEntityAI.NUM_SEGMENTS));
      coordinates.push(this._radius * Math.cos(2 * Math.PI * (i + 1) / _DDLSEntityAI.NUM_SEGMENTS));
      coordinates.push(this._radius * Math.sin(2 * Math.PI * (i + 1) / _DDLSEntityAI.NUM_SEGMENTS));
    }
  }
  get approximateObject() {
    this._approximateObject.matrix.identity();
    this._approximateObject.matrix.translate(this.x, this.y);
    return this._approximateObject;
  }
  get radiusFOV() {
    return this._radiusFOV;
  }
  set radiusFOV(value) {
    this._radiusFOV = value;
    this._radiusSquaredFOV = this._radiusFOV * this._radiusFOV;
  }
  get angleFOV() {
    return this._angleFOV;
  }
  set angleFOV(value) {
    this._angleFOV = value;
  }
  get dirNormY() {
    return this._dirNormY;
  }
  set dirNormY(value) {
    this._dirNormY = value;
  }
  get dirNormX() {
    return this._dirNormX;
  }
  set dirNormX(value) {
    this._dirNormX = value;
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
  get radius() {
    return this._radius;
  }
  get radiusSquared() {
    return this._radiusSquared;
  }
  set radius(value) {
    this._radius = value;
    this._radiusSquared = this._radius * this._radius;
  }
};
_DDLSEntityAI.NUM_SEGMENTS = 6;
var DDLSEntityAI = _DDLSEntityAI;

// src/ddls/ai/DDLSFunnel.ts
var DDLSFunnel = class {
  // public debugSurface: Sprite;
  constructor() {
    this._radius = 0;
    this._radiusSquared = 0;
    this._numSamplesCircle = 16;
    this._poolPointsSize = 3e3;
    this._currPoolPointsIndex = 0;
    this._poolPoints = new Array();
    for (var i = 0; i < this._poolPointsSize; i++) {
      this._poolPoints.push(new DDLSPoint2D());
    }
  }
  dispose() {
    this._sampleCircle = null;
  }
  getPoint(x = 0, y = 0) {
    this.__point = this._poolPoints[this._currPoolPointsIndex];
    this.__point.setTo(x, y);
    this._currPoolPointsIndex++;
    if (this._currPoolPointsIndex == this._poolPointsSize) {
      this._poolPoints.push(new DDLSPoint2D());
      this._poolPointsSize++;
    }
    return this.__point;
  }
  getCopyPoint(pointToCopy) {
    return this.getPoint(pointToCopy.x, pointToCopy.y);
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    this._radius = Math.max(0, value);
    this._radiusSquared = this._radius * this._radius;
    this._sampleCircle = new Array();
    if (this._radius == 0)
      return;
    for (var i = 0; i < this._numSamplesCircle; i++) {
      this._sampleCircle.push(new DDLSPoint2D(this._radius * Math.cos(-2 * Math.PI * i / this._numSamplesCircle), this._radius * Math.sin(-2 * Math.PI * i / this._numSamplesCircle)));
    }
    this._sampleCircleDistanceSquared = (this._sampleCircle[0].x - this._sampleCircle[1].x) * (this._sampleCircle[0].x - this._sampleCircle[1].x) + (this._sampleCircle[0].y - this._sampleCircle[1].y) * (this._sampleCircle[0].y - this._sampleCircle[1].y);
  }
  findPath(fromX, fromY, toX, toY, listFaces, listEdges, resultPath) {
    this._currPoolPointsIndex = 0;
    if (this._radius > 0) {
      var checkFace = listFaces[0];
      var distanceSquared;
      var distance;
      var p1;
      var p2;
      var p3;
      p1 = checkFace.edge.originVertex.pos;
      p2 = checkFace.edge.destinationVertex.pos;
      p3 = checkFace.edge.nextLeftEdge.destinationVertex.pos;
      distanceSquared = (p1.x - fromX) * (p1.x - fromX) + (p1.y - fromY) * (p1.y - fromY);
      if (distanceSquared <= this._radiusSquared) {
        distance = Math.sqrt(distanceSquared);
        fromX = this._radius * 1.01 * ((fromX - p1.x) / distance) + p1.x;
        fromY = this._radius * 1.01 * ((fromY - p1.y) / distance) + p1.y;
      } else {
        distanceSquared = (p2.x - fromX) * (p2.x - fromX) + (p2.y - fromY) * (p2.y - fromY);
        if (distanceSquared <= this._radiusSquared) {
          distance = Math.sqrt(distanceSquared);
          fromX = this._radius * 1.01 * ((fromX - p2.x) / distance) + p2.x;
          fromY = this._radius * 1.01 * ((fromY - p2.y) / distance) + p2.y;
        } else {
          distanceSquared = (p3.x - fromX) * (p3.x - fromX) + (p3.y - fromY) * (p3.y - fromY);
          if (distanceSquared <= this._radiusSquared) {
            distance = Math.sqrt(distanceSquared);
            fromX = this._radius * 1.01 * ((fromX - p3.x) / distance) + p3.x;
            fromY = this._radius * 1.01 * ((fromY - p3.y) / distance) + p3.y;
          }
        }
      }
      checkFace = listFaces[listFaces.length - 1];
      p1 = checkFace.edge.originVertex.pos;
      p2 = checkFace.edge.destinationVertex.pos;
      p3 = checkFace.edge.nextLeftEdge.destinationVertex.pos;
      distanceSquared = (p1.x - toX) * (p1.x - toX) + (p1.y - toY) * (p1.y - toY);
      if (distanceSquared <= this._radiusSquared) {
        distance = Math.sqrt(distanceSquared);
        toX = this._radius * 1.01 * ((toX - p1.x) / distance) + p1.x;
        toY = this._radius * 1.01 * ((toY - p1.y) / distance) + p1.y;
      } else {
        distanceSquared = (p2.x - toX) * (p2.x - toX) + (p2.y - toY) * (p2.y - toY);
        if (distanceSquared <= this._radiusSquared) {
          distance = Math.sqrt(distanceSquared);
          toX = this._radius * 1.01 * ((toX - p2.x) / distance) + p2.x;
          toY = this._radius * 1.01 * ((toY - p2.y) / distance) + p2.y;
        } else {
          distanceSquared = (p3.x - toX) * (p3.x - toX) + (p3.y - toY) * (p3.y - toY);
          if (distanceSquared <= this._radiusSquared) {
            distance = Math.sqrt(distanceSquared);
            toX = this._radius * 1.01 * ((toX - p3.x) / distance) + p3.x;
            toY = this._radius * 1.01 * ((toY - p3.y) / distance) + p3.y;
          }
        }
      }
    }
    var startPoint;
    var endPoint;
    startPoint = new DDLSPoint2D(fromX, fromY);
    endPoint = new DDLSPoint2D(toX, toY);
    if (listFaces.length == 1) {
      resultPath.push(startPoint.clone());
      resultPath.push(endPoint.clone());
      return;
    }
    var i;
    var j;
    var k;
    var currEdge;
    var currVertex;
    var direction;
    if (listEdges[0] == DDLSGeom2D.isInFace(fromX, fromY, listFaces[0])) {
      listEdges.shift();
      listFaces.shift();
    }
    var funnelLeft = new Array();
    var funnelRight = new Array();
    funnelLeft.push(startPoint);
    funnelRight.push(startPoint);
    var verticesDoneSide = /* @__PURE__ */ new Map();
    var pointsList = new Array();
    var pointSides = /* @__PURE__ */ new Map();
    var pointSuccessor = /* @__PURE__ */ new Map();
    pointSides.set(startPoint.id, 0);
    currEdge = listEdges[0];
    var relativPos = DDLSGeom2D.getRelativePosition2(fromX, fromY, currEdge);
    var prevPoint;
    var newPointA;
    var newPointB;
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
    } else if (relativPos == -1) {
      pointSides.set(newPointA.id, -1);
      pointSides.set(newPointB.id, 1);
      verticesDoneSide.set(currEdge.destinationVertex.id, -1);
      verticesDoneSide.set(currEdge.originVertex.id, 1);
    }
    var fromVertex = listEdges[0].originVertex;
    var fromFromVertex = listEdges[0].destinationVertex;
    for (i = 1; i < listEdges.length; i++) {
      currEdge = listEdges[i];
      if (currEdge.originVertex == fromVertex) {
        currVertex = currEdge.destinationVertex;
      } else if (currEdge.destinationVertex == fromVertex) {
        currVertex = currEdge.originVertex;
      } else if (currEdge.originVertex == fromFromVertex) {
        currVertex = currEdge.destinationVertex;
        fromVertex = fromFromVertex;
      } else if (currEdge.destinationVertex == fromFromVertex) {
        currVertex = currEdge.originVertex;
        fromVertex = fromFromVertex;
      } else {
        console.log("IMPOSSIBLE TO IDENTIFY THE VERTEX !!!");
      }
      newPointA = this.getCopyPoint(currVertex.pos);
      pointsList.push(newPointA);
      direction = -verticesDoneSide.get(fromVertex.id);
      pointSides.set(newPointA.id, direction);
      pointSuccessor.set(prevPoint.id, newPointA);
      verticesDoneSide.set(currVertex.id, direction);
      prevPoint = newPointA;
      fromFromVertex = fromVertex;
      fromVertex = currVertex;
    }
    pointSuccessor.set(prevPoint.id, endPoint);
    pointSides.set(endPoint.id, 0);
    var pathPoints = new Array();
    var pathSides = /* @__PURE__ */ new Map();
    pathPoints.push(startPoint);
    pathSides.set(startPoint.id, 0);
    var currPos;
    for (i = 0; i < pointsList.length; i++) {
      currPos = pointsList[i];
      if (pointSides.get(currPos.id) == -1) {
        for (j = funnelLeft.length - 2; j >= 0; j--) {
          direction = DDLSGeom2D.getDirection(funnelLeft[j].x, funnelLeft[j].y, funnelLeft[j + 1].x, funnelLeft[j + 1].y, currPos.x, currPos.y);
          if (direction != -1) {
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
      } else {
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
    var blocked = false;
    for (j = funnelRight.length - 2; j >= 0; j--) {
      direction = DDLSGeom2D.getDirection(funnelRight[j].x, funnelRight[j].y, funnelRight[j + 1].x, funnelRight[j + 1].y, toX, toY);
      if (direction != 1) {
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
      for (j = funnelLeft.length - 2; j >= 0; j--) {
        direction = DDLSGeom2D.getDirection(funnelLeft[j].x, funnelLeft[j].y, funnelLeft[j + 1].x, funnelLeft[j + 1].y, toX, toY);
        if (direction != -1) {
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
    if (!blocked) {
      pathPoints.push(endPoint);
      pathSides.set(endPoint.id, 0);
      blocked = true;
    }
    if (this.radius > 0) {
      var adjustedPoints = new Array();
      var newPath = new Array();
      if (pathPoints.length == 2) {
        this.adjustWithTangents(pathPoints[0], false, pathPoints[1], false, pointSides, pointSuccessor, newPath, adjustedPoints);
      } else if (pathPoints.length > 2) {
        this.adjustWithTangents(pathPoints[0], false, pathPoints[1], true, pointSides, pointSuccessor, newPath, adjustedPoints);
        if (pathPoints.length > 3) {
          for (i = 1; i <= pathPoints.length - 3; i++) {
            this.adjustWithTangents(pathPoints[i], true, pathPoints[i + 1], true, pointSides, pointSuccessor, newPath, adjustedPoints);
          }
        }
        var pathLength = pathPoints.length;
        this.adjustWithTangents(pathPoints[pathLength - 2], true, pathPoints[pathLength - 1], false, pointSides, pointSuccessor, newPath, adjustedPoints);
      }
      newPath.push(endPoint);
      this.checkAdjustedPath(newPath, adjustedPoints, pointSides);
      var smoothPoints = new Array();
      for (i = newPath.length - 2; i >= 1; i--) {
        this.smoothAngle(adjustedPoints[i * 2 - 1], newPath[i], adjustedPoints[i * 2], pointSides.get(newPath[i].id), smoothPoints);
        while (smoothPoints.length) {
          adjustedPoints.splice(i * 2, 0, smoothPoints.pop());
        }
      }
    } else {
      adjustedPoints = pathPoints;
    }
    for (i = 0; i < adjustedPoints.length; i++) {
      resultPath.push(adjustedPoints[i].clone());
    }
  }
  adjustWithTangents(p1, applyRadiusToP1, p2, applyRadiusToP2, pointSides, pointSuccessor, newPath, adjustedPoints) {
    var tangentsResult = new Array();
    var side1 = pointSides.get(p1.id);
    var side2 = pointSides.get(p2.id);
    var pTangent1;
    var pTangent2;
    if (!applyRadiusToP1 && !applyRadiusToP2) {
      pTangent1 = p1;
      pTangent2 = p2;
    } else if (!applyRadiusToP1) {
      DDLSGeom2D.tangentsPointToCircle(p1.x, p1.y, p2.x, p2.y, this._radius, tangentsResult);
      if (side2 == 1) {
        pTangent1 = p1;
        pTangent2 = this.getPoint(tangentsResult[2], tangentsResult[3]);
      } else {
        pTangent1 = p1;
        pTangent2 = this.getPoint(tangentsResult[0], tangentsResult[1]);
      }
    } else if (!applyRadiusToP2) {
      DDLSGeom2D.tangentsPointToCircle(p2.x, p2.y, p1.x, p1.y, this._radius, tangentsResult);
      if (side1 == 1) {
        pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
        pTangent2 = p2;
      } else {
        pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
        pTangent2 = p2;
      }
    } else {
      if (side1 == 1 && side2 == 1) {
        DDLSGeom2D.tangentsParalCircleToCircle(this._radius, p1.x, p1.y, p2.x, p2.y, tangentsResult);
        pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
        pTangent2 = this.getPoint(tangentsResult[4], tangentsResult[5]);
      } else if (side1 == -1 && side2 == -1) {
        DDLSGeom2D.tangentsParalCircleToCircle(this._radius, p1.x, p1.y, p2.x, p2.y, tangentsResult);
        pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
        pTangent2 = this.getPoint(tangentsResult[6], tangentsResult[7]);
      } else if (side1 == 1 && side2 == -1) {
        if (DDLSGeom2D.tangentsCrossCircleToCircle(this._radius, p1.x, p1.y, p2.x, p2.y, tangentsResult)) {
          pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
          pTangent2 = this.getPoint(tangentsResult[6], tangentsResult[7]);
        } else {
          console.log("NO TANGENT, points are too close for radius");
          return;
        }
      } else {
        if (DDLSGeom2D.tangentsCrossCircleToCircle(this._radius, p1.x, p1.y, p2.x, p2.y, tangentsResult)) {
          pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
          pTangent2 = this.getPoint(tangentsResult[4], tangentsResult[5]);
        } else {
          console.log("NO TANGENT, points are too close for radius");
          return;
        }
      }
    }
    var successor = pointSuccessor.get(p1.id);
    var distance;
    while (successor != p2) {
      distance = DDLSGeom2D.distanceSquaredPointToSegment(successor.x, successor.y, pTangent1.x, pTangent1.y, pTangent2.x, pTangent2.y);
      if (distance < this._radiusSquared) {
        this.adjustWithTangents(p1, applyRadiusToP1, successor, true, pointSides, pointSuccessor, newPath, adjustedPoints);
        this.adjustWithTangents(successor, true, p2, applyRadiusToP2, pointSides, pointSuccessor, newPath, adjustedPoints);
        return;
      } else {
        successor = pointSuccessor.get(successor.id);
      }
    }
    adjustedPoints.push(pTangent1, pTangent2);
    newPath.push(p1);
  }
  checkAdjustedPath(newPath, adjustedPoints, pointSides) {
    var needCheck = true;
    var point0;
    var point0Side;
    var point1;
    var point1Side;
    var point2;
    var point2Side;
    var pt1;
    var pt2;
    var pt3;
    var dot;
    var tangentsResult = new Array();
    var pTangent1;
    var pTangent2;
    while (needCheck) {
      needCheck = false;
      for (var i = 2; i < newPath.length; i++) {
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
          dot = (pt1.x - pt2.x) * (pt3.x - pt2.x) + (pt1.y - pt2.y) * (pt3.y - pt2.y);
          if (dot > 0) {
            if (i == 2) {
              DDLSGeom2D.tangentsPointToCircle(point0.x, point0.y, point2.x, point2.y, this._radius, tangentsResult);
              if (point2Side == 1) {
                pTangent1 = point0;
                pTangent2 = this.getPoint(tangentsResult[2], tangentsResult[3]);
              } else {
                pTangent1 = point0;
                pTangent2 = this.getPoint(tangentsResult[0], tangentsResult[1]);
              }
            } else if (i == newPath.length - 1) {
              DDLSGeom2D.tangentsPointToCircle(point2.x, point2.y, point0.x, point0.y, this._radius, tangentsResult);
              if (point0Side == 1) {
                pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
                pTangent2 = point2;
              } else {
                pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
                pTangent2 = point2;
              }
            } else {
              if (point0Side == 1 && point2Side == -1) {
                DDLSGeom2D.tangentsCrossCircleToCircle(this._radius, point0.x, point0.y, point2.x, point2.y, tangentsResult);
                pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
                pTangent2 = this.getPoint(tangentsResult[6], tangentsResult[7]);
              } else if (point0Side == -1 && point2Side == 1) {
                DDLSGeom2D.tangentsCrossCircleToCircle(this._radius, point0.x, point0.y, point2.x, point2.y, tangentsResult);
                pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
                pTangent2 = this.getPoint(tangentsResult[4], tangentsResult[5]);
              } else if (point0Side == 1 && point2Side == 1) {
                DDLSGeom2D.tangentsParalCircleToCircle(this._radius, point0.x, point0.y, point2.x, point2.y, tangentsResult);
                pTangent1 = this.getPoint(tangentsResult[2], tangentsResult[3]);
                pTangent2 = this.getPoint(tangentsResult[4], tangentsResult[5]);
              } else if (point0Side == -1 && point2Side == -1) {
                DDLSGeom2D.tangentsParalCircleToCircle(this._radius, point0.x, point0.y, point2.x, point2.y, tangentsResult);
                pTangent1 = this.getPoint(tangentsResult[0], tangentsResult[1]);
                pTangent2 = this.getPoint(tangentsResult[6], tangentsResult[7]);
              }
            }
            adjustedPoints.splice((i - 2) * 2, 1, pTangent1);
            adjustedPoints.splice(i * 2 - 1, 1, pTangent2);
            newPath.splice(i - 1, 1);
            adjustedPoints.splice((i - 1) * 2 - 1, 2);
            tangentsResult.splice(0, tangentsResult.length);
            i--;
          }
        }
      }
    }
  }
  smoothAngle(prevPoint, pointToSmooth, nextPoint, side, encirclePoints) {
    var angleType = DDLSGeom2D.getDirection(
      prevPoint.x,
      prevPoint.y,
      pointToSmooth.x,
      pointToSmooth.y,
      nextPoint.x,
      nextPoint.y
    );
    var distanceSquared = (prevPoint.x - nextPoint.x) * (prevPoint.x - nextPoint.x) + (prevPoint.y - nextPoint.y) * (prevPoint.y - nextPoint.y);
    if (distanceSquared <= this._sampleCircleDistanceSquared)
      return;
    var index = 0;
    var side1;
    var side2;
    var pointInArea;
    var xToCheck;
    var yToCheck;
    for (var i = 0; i < this._numSamplesCircle; i++) {
      pointInArea = false;
      xToCheck = pointToSmooth.x + this._sampleCircle[i].x;
      yToCheck = pointToSmooth.y + this._sampleCircle[i].y;
      side1 = DDLSGeom2D.getDirection(prevPoint.x, prevPoint.y, pointToSmooth.x, pointToSmooth.y, xToCheck, yToCheck);
      side2 = DDLSGeom2D.getDirection(pointToSmooth.x, pointToSmooth.y, nextPoint.x, nextPoint.y, xToCheck, yToCheck);
      if (side == 1) {
        if (angleType == -1) {
          if (side1 == -1 && side2 == -1)
            pointInArea = true;
        } else {
          if (side1 == -1 || side2 == -1)
            pointInArea = true;
        }
      } else {
        if (angleType == 1) {
          if (side1 == 1 && side2 == 1)
            pointInArea = true;
        } else {
          if (side1 == 1 || side2 == 1)
            pointInArea = true;
        }
      }
      if (pointInArea) {
        encirclePoints.splice(index, 0, new DDLSPoint2D(xToCheck, yToCheck));
        index++;
      } else
        index = 0;
    }
    if (side == -1)
      encirclePoints.reverse();
  }
};

// src/ddls/ai/DDLSPathFinder.ts
var DDLSPathFinder = class {
  /**
   * 寻路工具 
   */
  constructor() {
    this._astar = new DDLSAStar();
    this._funnel = new DDLSFunnel();
    this.__listFaces = [];
    this.__listEdges = [];
  }
  dispose() {
    this._mesh = null;
    this._astar.dispose();
    this._astar = null;
    this._funnel.dispose();
    this._funnel = null;
    this.__listEdges = null;
    this.__listFaces = null;
  }
  /*		public get entity():DDLSEntityAI
  	{
  		return this._entity;
  	}
  
  	public set this.entity(value:DDLSEntityAI):void
  	{
  		this._entity = value;
  	}*/
  get mesh() {
    return this._mesh;
  }
  set mesh(value) {
    this._mesh = value;
    this._astar.mesh = this._mesh;
  }
  findPath(startX, startY, toX, toY, resultPath, radius = 0) {
    resultPath.splice(0, resultPath.length);
    if (!this._mesh)
      throw new Error("Mesh missing");
    if (DDLSGeom2D.isCircleIntersectingAnyConstraint(toX, toY, radius, this._mesh)) {
      return false;
    }
    this._astar.radius = radius;
    this._funnel.radius = radius;
    this.__listFaces.splice(0, this.__listFaces.length);
    this.__listEdges.splice(0, this.__listEdges.length);
    this._astar.findPath(startX, startY, toX, toY, this.__listFaces, this.__listEdges);
    if (this.__listFaces.length == 0) {
      return false;
    }
    this._funnel.findPath(startX, startY, toX, toY, this.__listFaces, this.__listEdges, resultPath);
    return true;
  }
};

// src/ddls/data/graph/DDLSGraphEdge.ts
var _DDLSGraphEdge = class _DDLSGraphEdge {
  constructor() {
    this._id = _DDLSGraphEdge.INC;
    _DDLSGraphEdge.INC++;
  }
  get id() {
    return this._id;
  }
  dispose() {
    this._prev = null;
    this._next = null;
    this._rotNextEdge = null;
    this._rotNextEdge = null;
    this._oppositeEdge = null;
    this._sourceNode = null;
    this._destinationNode;
    this._data = null;
  }
  get prev() {
    return this._prev;
  }
  set prev(value) {
    this._prev = value;
  }
  get next() {
    return this._next;
  }
  set next(value) {
    this._next = value;
  }
  get rotPrevEdge() {
    return this._rotPrevEdge;
  }
  set rotPrevEdge(value) {
    this._rotPrevEdge = value;
  }
  get rotNextEdge() {
    return this._rotNextEdge;
  }
  set rotNextEdge(value) {
    this._rotNextEdge = value;
  }
  get oppositeEdge() {
    return this._oppositeEdge;
  }
  set oppositeEdge(value) {
    this._oppositeEdge = value;
  }
  get sourceNode() {
    return this._sourceNode;
  }
  set sourceNode(value) {
    this._sourceNode = value;
  }
  get destinationNode() {
    return this._destinationNode;
  }
  set destinationNode(value) {
    this._destinationNode = value;
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
  }
};
_DDLSGraphEdge.INC = 0;
var DDLSGraphEdge = _DDLSGraphEdge;

// src/ddls/data/graph/DDLSGraphNode.ts
var _DDLSGraphNode = class _DDLSGraphNode {
  constructor() {
    this._id = _DDLSGraphNode.INC;
    _DDLSGraphNode.INC++;
    this._successorNodes = /* @__PURE__ */ new Map();
  }
  get id() {
    return this._id;
  }
  dispose() {
    this._prev = null;
    this._next = null;
    this._outgoingEdge = null;
    this._successorNodes = null;
    this._data = null;
  }
  get prev() {
    return this._prev;
  }
  set prev(value) {
    this._prev = value;
  }
  get next() {
    return this._next;
  }
  set next(value) {
    this._next = value;
  }
  get outgoingEdge() {
    return this._outgoingEdge;
  }
  set outgoingEdge(value) {
    this._outgoingEdge = value;
  }
  get successorNodes() {
    return this._successorNodes;
  }
  set successorNodes(value) {
    this._successorNodes = value;
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
  }
};
_DDLSGraphNode.INC = 0;
var DDLSGraphNode = _DDLSGraphNode;

// src/ddls/data/graph/DDLSGraph.ts
var _DDLSGraph = class _DDLSGraph {
  constructor() {
    this._id = _DDLSGraph.INC;
    _DDLSGraph.INC++;
  }
  get id() {
    return this._id;
  }
  dispose() {
    while (this._node) {
      this.deleteNode(this._node);
    }
  }
  get edge() {
    return this._edge;
  }
  get node() {
    return this._node;
  }
  insertNode() {
    let node = new DDLSGraphNode();
    if (this._node) {
      node.next = this._node;
      this._node.prev = node;
    }
    this._node = node;
    return node;
  }
  deleteNode(node) {
    while (node.outgoingEdge) {
      if (node.outgoingEdge.oppositeEdge) {
        this.deleteEdge(node.outgoingEdge.oppositeEdge);
      }
      this.deleteEdge(node.outgoingEdge);
    }
    let otherNode = this._node;
    let incomingEdge;
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
      } else {
        this._node = null;
      }
    } else {
      if (node.next) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
      } else {
        node.prev.next = null;
      }
    }
    node.dispose();
  }
  insertEdge(fromNode, toNode) {
    if (fromNode.successorNodes.has(toNode.id))
      return null;
    let edge = new DDLSGraphEdge();
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
    } else {
      fromNode.outgoingEdge = edge;
    }
    let oppositeEdge = toNode.successorNodes.get(fromNode.id);
    if (oppositeEdge) {
      edge.oppositeEdge = oppositeEdge;
      oppositeEdge.oppositeEdge = edge;
    }
    return edge;
  }
  deleteEdge(edge) {
    edge.sourceNode.successorNodes.delete(edge.destinationNode.id);
    if (this._edge == edge) {
      if (edge.next) {
        edge.next.prev = null;
        this._edge = edge.next;
      } else {
        this._edge = null;
      }
    } else {
      if (edge.next) {
        edge.prev.next = edge.next;
        edge.next.prev = edge.prev;
      } else {
        edge.prev.next = null;
      }
    }
    if (edge.sourceNode.outgoingEdge == edge) {
      if (edge.rotNextEdge) {
        edge.rotNextEdge.rotPrevEdge = null;
        edge.sourceNode.outgoingEdge = edge.rotNextEdge;
      } else {
        edge.sourceNode.outgoingEdge = null;
      }
    } else {
      if (edge.rotNextEdge) {
        edge.rotPrevEdge.rotNextEdge = edge.rotNextEdge;
        edge.rotNextEdge.rotPrevEdge = edge.rotPrevEdge;
      } else {
        edge.rotPrevEdge.rotNextEdge = null;
      }
    }
    edge.dispose();
  }
};
_DDLSGraph.INC = 0;
var DDLSGraph = _DDLSGraph;

// src/ddls/data/DDLSConstraintSegment.ts
var _DDLSConstraintSegment = class _DDLSConstraintSegment {
  constructor() {
    this._id = _DDLSConstraintSegment.INC;
    _DDLSConstraintSegment.INC++;
    this._edges = [];
  }
  get id() {
    return this._id;
  }
  get fromShape() {
    return this._fromShape;
  }
  set fromShape(value) {
    this._fromShape = value;
  }
  addEdge(edge) {
    if (this._edges.indexOf(edge) == -1 && this._edges.indexOf(edge.oppositeEdge) == -1)
      this._edges.push(edge);
  }
  removeEdge(edge) {
    var index;
    index = this._edges.indexOf(edge);
    if (index == -1)
      index = this._edges.indexOf(edge.oppositeEdge);
    if (index != -1)
      this._edges.splice(index, 1);
  }
  get edges() {
    return this._edges;
  }
  dispose() {
    this._edges = null;
    this._fromShape = null;
  }
  toString() {
    return "seg_id " + this._id;
  }
};
_DDLSConstraintSegment.INC = 0;
var DDLSConstraintSegment = _DDLSConstraintSegment;

// src/ddls/data/DDLSConstraintShape.ts
var _DDLSConstraintShape = class _DDLSConstraintShape {
  constructor() {
    this._id = _DDLSConstraintShape.INC;
    _DDLSConstraintShape.INC++;
    this._segments = [];
  }
  get id() {
    return this._id;
  }
  get segments() {
    return this._segments;
  }
  dispose() {
    while (this._segments.length > 0)
      this._segments.pop().dispose();
    this._segments = null;
  }
};
_DDLSConstraintShape.INC = 0;
var DDLSConstraintShape = _DDLSConstraintShape;

// src/ddls/iterators/IteratorFromVertexToOutgoingEdges.ts
var IteratorFromVertexToOutgoingEdges = class {
  constructor() {
    this.realEdgesOnly = true;
  }
  set fromVertex(value) {
    this._fromVertex = value;
    this._nextEdge = this._fromVertex.edge;
    if (this._nextEdge == void 0 || this._nextEdge.isReal == void 0)
      throw "aaa";
    while (this.realEdgesOnly && !this._nextEdge.isReal) {
      this._nextEdge = this._nextEdge.rotLeftEdge;
      if (this._nextEdge == void 0 || this._nextEdge.isReal == void 0)
        throw "aaa";
    }
  }
  next() {
    if (this._nextEdge) {
      this._resultEdge = this._nextEdge;
      do {
        this._nextEdge = this._nextEdge.rotLeftEdge;
        if (this._nextEdge == this._fromVertex.edge) {
          this._nextEdge = null;
          break;
        }
      } while (this.realEdgesOnly && !this._nextEdge.isReal);
    } else {
      this._resultEdge = null;
    }
    return this._resultEdge;
  }
};

// src/ddls/data/DDLSMesh.ts
var _DDLSMesh = class _DDLSMesh {
  constructor(width, height) {
    this._id = _DDLSMesh.INC;
    _DDLSMesh.INC++;
    this._width = width;
    this._height = height;
    this._clipping = true;
    this._vertices = [];
    this._edges = new EdgeMap();
    this._faces = new FaceMap();
    this._constraintShapes = [];
    this._objects = [];
    this.__edgesToCheck = [];
  }
  get height() {
    return this._height;
  }
  get width() {
    return this._width;
  }
  get clipping() {
    return this._clipping;
  }
  set clipping(value) {
    this._clipping = value;
  }
  get id() {
    return this._id;
  }
  dispose() {
    while (this._vertices.length > 0)
      this._vertices.pop().dispose();
    this._vertices = null;
    this._edges.dispose();
    this._edges = null;
    this._faces.dispose();
    this._faces = null;
    while (this._constraintShapes.length > 0)
      this._constraintShapes.pop().dispose();
    this._constraintShapes = null;
    while (this._objects.length > 0)
      this._objects.pop().dispose();
    this._objects = null;
    this.__edgesToCheck = null;
    this.__centerVertex = null;
  }
  get __vertices() {
    return this._vertices;
  }
  get __edges() {
    return this._edges.vector;
  }
  get __faces() {
    return this._faces.vector;
  }
  get __constraintShapes() {
    return this._constraintShapes;
  }
  buildFromRecord(rec) {
    var positions = rec.split(";");
    for (var i = 0; i < positions.length; i += 4) {
      this.insertConstraintSegment(Number(positions[i]), Number(positions[i + 1]), Number(positions[i + 2]), Number(positions[i + 3]));
    }
  }
  insertObject(object) {
    if (object.constraintShape)
      this.deleteObject(object);
    var shape = new DDLSConstraintShape();
    var segment;
    var coordinates = object.coordinates;
    var m = object.matrix;
    object.updateMatrixFromValues();
    var x1;
    var y1;
    var x2;
    var y2;
    var transfx1;
    var transfy1;
    var transfx2;
    var transfy2;
    for (var i = 0; i < coordinates.length; i += 4) {
      x1 = coordinates[i];
      y1 = coordinates[i + 1];
      x2 = coordinates[i + 2];
      y2 = coordinates[i + 3];
      transfx1 = m.transformX(x1, y1);
      transfy1 = m.transformY(x1, y1);
      transfx2 = m.transformX(x2, y2);
      transfy2 = m.transformY(x2, y2);
      segment = this.insertConstraintSegment(transfx1, transfy1, transfx2, transfy2);
      if (segment) {
        segment.fromShape = shape;
        shape.segments.push(segment);
      }
    }
    this._constraintShapes.push(shape);
    object.constraintShape = shape;
    if (!this.__objectsUpdateInProgress) {
      this._objects.push(object);
    }
  }
  deleteAllObject() {
    while (this._objects.length > 0) {
      let obj = this._objects.pop();
      this.deleteObject(obj);
    }
  }
  deleteObject(object) {
    if (!object.constraintShape)
      return;
    this.deleteConstraintShape(object.constraintShape);
    object.constraintShape = null;
    if (!this.__objectsUpdateInProgress) {
      var index = this._objects.indexOf(object);
      this._objects.splice(index, 1);
    }
  }
  updateObjects() {
    this.__objectsUpdateInProgress = true;
    for (var i = 0; i < this._objects.length; i++) {
      if (this._objects[i].hasChanged) {
        this.deleteObject(this._objects[i]);
        this.insertObject(this._objects[i]);
        this._objects[i].hasChanged = false;
      }
    }
    this.__objectsUpdateInProgress = false;
  }
  // insert a new collection of constrained edges.
  // Coordinates parameter is a list with form [x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, ....]
  // where each 4-uple sequence (xi, yi, xi+1, yi+1) is a constraint segment (with i % 4 == 0)
  // and where each couple sequence (xi, yi) is a point.
  // Segments are not necessary connected.
  // Segments can overlap (then they will be automaticaly subdivided).
  insertConstraintShape(coordinates) {
    var shape = new DDLSConstraintShape();
    var segment;
    for (var i = 0; i < coordinates.length; i += 4) {
      segment = this.insertConstraintSegment(coordinates[i], coordinates[i + 1], coordinates[i + 2], coordinates[i + 3]);
      if (segment) {
        segment.fromShape = shape;
        shape.segments.push(segment);
      }
    }
    this._constraintShapes.push(shape);
    return shape;
  }
  deleteConstraintShape(shape) {
    if (shape.segments) {
      for (var i = 0; i < shape.segments.length; i++) {
        this.deleteConstraintSegment(shape.segments[i]);
      }
    }
    shape.dispose();
    this._constraintShapes.splice(this._constraintShapes.indexOf(shape), 1);
  }
  insertConstraintSegment(x1, y1, x2, y2) {
    var newX1 = x1;
    var newY1 = y1;
    var newX2 = x2;
    var newY2 = y2;
    if (x1 > this._width && x2 > this._width || x1 < 0 && x2 < 0 || y1 > this._height && y2 > this._height || y1 < 0 && y2 < 0) {
      return null;
    } else {
      var nx = x2 - x1;
      var ny = y2 - y1;
      var tmin = Number.NEGATIVE_INFINITY;
      var tmax = Number.POSITIVE_INFINITY;
      if (nx != 0) {
        var tx1 = (0 - x1) / nx;
        var tx2 = (this._width - x1) / nx;
        tmin = Math.max(tmin, Math.min(tx1, tx2));
        tmax = Math.min(tmax, Math.max(tx1, tx2));
      }
      if (ny != 0) {
        var ty1 = (0 - y1) / ny;
        var ty2 = (this._height - y1) / ny;
        tmin = Math.max(tmin, Math.min(ty1, ty2));
        tmax = Math.min(tmax, Math.max(ty1, ty2));
      }
      if (tmax >= tmin) {
        if (tmax < 1) {
          newX2 = nx * tmax + x1;
          newY2 = ny * tmax + y1;
        }
        if (tmin > 0) {
          newX1 = nx * tmin + x1;
          newY1 = ny * tmin + y1;
        }
      } else
        return null;
    }
    var vertexDown = this.insertVertex(newX1, newY1);
    if (!vertexDown)
      return null;
    var vertexUp = this.insertVertex(newX2, newY2);
    if (!vertexUp)
      return null;
    if (vertexDown == vertexUp)
      return null;
    var iterVertexToOutEdges = new IteratorFromVertexToOutgoingEdges();
    var currVertex;
    var currEdge;
    var i;
    var segment = new DDLSConstraintSegment();
    var tempEdgeDownUp = new DDLSEdge();
    var tempSdgeUpDown = new DDLSEdge();
    tempEdgeDownUp.setDatas(vertexDown, tempSdgeUpDown, null, null, true, true);
    tempSdgeUpDown.setDatas(vertexUp, tempEdgeDownUp, null, null, true, true);
    var intersectedEdges = [];
    var leftBoundingEdges = [];
    var rightBoundingEdges = [];
    var currObjet;
    var pIntersect = new DDLSPoint2D();
    var edgeLeft;
    var newEdgeDownUp;
    var newEdgeUpDown;
    var done;
    currVertex = vertexDown;
    currObjet = currVertex;
    while (true) {
      done = false;
      currVertex = currObjet;
      if (currVertex instanceof DDLSVertex) {
        iterVertexToOutEdges.fromVertex = currVertex;
        while (currEdge = iterVertexToOutEdges.next()) {
          if (currEdge.destinationVertex == vertexUp) {
            if (!currEdge.isConstrained) {
              currEdge.isConstrained = true;
              currEdge.oppositeEdge.isConstrained = true;
            }
            currEdge.addFromConstraintSegment(segment);
            currEdge.oppositeEdge.fromConstraintSegments = currEdge.fromConstraintSegments;
            vertexDown.addFromConstraintSegment(segment);
            vertexUp.addFromConstraintSegment(segment);
            segment.addEdge(currEdge);
            return segment;
          }
          if (DDLSGeom2D.distanceSquaredVertexToEdge(currEdge.destinationVertex, tempEdgeDownUp) <= DDLSConstants.EPSILON_SQUARED) {
            if (!currEdge.isConstrained) {
              currEdge.isConstrained = true;
              currEdge.oppositeEdge.isConstrained = true;
            }
            currEdge.addFromConstraintSegment(segment);
            currEdge.oppositeEdge.fromConstraintSegments = currEdge.fromConstraintSegments;
            vertexDown.addFromConstraintSegment(segment);
            segment.addEdge(currEdge);
            vertexDown = currEdge.destinationVertex;
            tempEdgeDownUp.originVertex = vertexDown;
            currObjet = vertexDown;
            done = true;
            break;
          }
        }
        if (done)
          continue;
        iterVertexToOutEdges.fromVertex = currVertex;
        currEdge = iterVertexToOutEdges.next();
        while (currEdge) {
          currEdge = currEdge.nextLeftEdge;
          if (DDLSGeom2D.intersections2edges(currEdge, tempEdgeDownUp, pIntersect)) {
            if (currEdge.isConstrained) {
              vertexDown = this.splitEdge(currEdge, pIntersect.x, pIntersect.y);
              iterVertexToOutEdges.fromVertex = currVertex;
              currEdge = iterVertexToOutEdges.next();
              while (currEdge) {
                if (currEdge.destinationVertex == vertexDown) {
                  currEdge.isConstrained = true;
                  currEdge.oppositeEdge.isConstrained = true;
                  currEdge.addFromConstraintSegment(segment);
                  currEdge.oppositeEdge.fromConstraintSegments = currEdge.fromConstraintSegments;
                  segment.addEdge(currEdge);
                  break;
                }
                currEdge = iterVertexToOutEdges.next();
              }
              currVertex.addFromConstraintSegment(segment);
              tempEdgeDownUp.originVertex = vertexDown;
              currObjet = vertexDown;
            } else {
              intersectedEdges.push(currEdge);
              leftBoundingEdges.unshift(currEdge.nextLeftEdge);
              rightBoundingEdges.push(currEdge.prevLeftEdge);
              currEdge = currEdge.oppositeEdge;
              currObjet = currEdge;
            }
            break;
          }
          currEdge = iterVertexToOutEdges.next();
        }
      } else if (currObjet instanceof DDLSEdge && (currEdge = currObjet)) {
        edgeLeft = currEdge.nextLeftEdge;
        if (edgeLeft.destinationVertex == vertexUp) {
          leftBoundingEdges.unshift(edgeLeft.nextLeftEdge);
          rightBoundingEdges.push(edgeLeft);
          newEdgeDownUp = new DDLSEdge();
          newEdgeUpDown = new DDLSEdge();
          newEdgeDownUp.setDatas(vertexDown, newEdgeUpDown, null, null, true, true);
          newEdgeUpDown.setDatas(vertexUp, newEdgeDownUp, null, null, true, true);
          leftBoundingEdges.push(newEdgeDownUp);
          rightBoundingEdges.push(newEdgeUpDown);
          this.insertNewConstrainedEdge(segment, newEdgeDownUp, intersectedEdges, leftBoundingEdges, rightBoundingEdges);
          return segment;
        } else if (DDLSGeom2D.distanceSquaredVertexToEdge(edgeLeft.destinationVertex, tempEdgeDownUp) <= DDLSConstants.EPSILON_SQUARED) {
          leftBoundingEdges.unshift(edgeLeft.nextLeftEdge);
          rightBoundingEdges.push(edgeLeft);
          newEdgeDownUp = new DDLSEdge();
          newEdgeUpDown = new DDLSEdge();
          newEdgeDownUp.setDatas(vertexDown, newEdgeUpDown, null, null, true, true);
          newEdgeUpDown.setDatas(edgeLeft.destinationVertex, newEdgeDownUp, null, null, true, true);
          leftBoundingEdges.push(newEdgeDownUp);
          rightBoundingEdges.push(newEdgeUpDown);
          this.insertNewConstrainedEdge(segment, newEdgeDownUp, intersectedEdges, leftBoundingEdges, rightBoundingEdges);
          intersectedEdges.splice(0, intersectedEdges.length);
          leftBoundingEdges.splice(0, leftBoundingEdges.length);
          rightBoundingEdges.splice(0, rightBoundingEdges.length);
          vertexDown = edgeLeft.destinationVertex;
          tempEdgeDownUp.originVertex = vertexDown;
          currObjet = vertexDown;
        } else {
          if (DDLSGeom2D.intersections2edges(edgeLeft, tempEdgeDownUp, pIntersect)) {
            if (edgeLeft.isConstrained) {
              currVertex = this.splitEdge(edgeLeft, pIntersect.x, pIntersect.y);
              iterVertexToOutEdges.fromVertex = currVertex;
              currEdge = iterVertexToOutEdges.next();
              while (currEdge) {
                if (currEdge.destinationVertex == leftBoundingEdges[0].originVertex) {
                  leftBoundingEdges.unshift(currEdge);
                }
                if (currEdge.destinationVertex == rightBoundingEdges[rightBoundingEdges.length - 1].destinationVertex) {
                  rightBoundingEdges.push(currEdge.oppositeEdge);
                }
                currEdge = iterVertexToOutEdges.next();
              }
              newEdgeDownUp = new DDLSEdge();
              newEdgeUpDown = new DDLSEdge();
              newEdgeDownUp.setDatas(vertexDown, newEdgeUpDown, null, null, true, true);
              newEdgeUpDown.setDatas(currVertex, newEdgeDownUp, null, null, true, true);
              leftBoundingEdges.push(newEdgeDownUp);
              rightBoundingEdges.push(newEdgeUpDown);
              this.insertNewConstrainedEdge(segment, newEdgeDownUp, intersectedEdges, leftBoundingEdges, rightBoundingEdges);
              intersectedEdges.splice(0, intersectedEdges.length);
              leftBoundingEdges.splice(0, leftBoundingEdges.length);
              rightBoundingEdges.splice(0, rightBoundingEdges.length);
              vertexDown = currVertex;
              tempEdgeDownUp.originVertex = vertexDown;
              currObjet = vertexDown;
            } else {
              intersectedEdges.push(edgeLeft);
              leftBoundingEdges.unshift(edgeLeft.nextLeftEdge);
              currEdge = edgeLeft.oppositeEdge;
              currObjet = currEdge;
            }
          } else {
            edgeLeft = edgeLeft.nextLeftEdge;
            DDLSGeom2D.intersections2edges(edgeLeft, tempEdgeDownUp, pIntersect);
            if (edgeLeft.isConstrained) {
              currVertex = this.splitEdge(edgeLeft, pIntersect.x, pIntersect.y);
              iterVertexToOutEdges.fromVertex = currVertex;
              currEdge = iterVertexToOutEdges.next();
              while (currEdge) {
                if (currEdge.destinationVertex == leftBoundingEdges[0].originVertex) {
                  leftBoundingEdges.unshift(currEdge);
                }
                if (currEdge.destinationVertex == rightBoundingEdges[rightBoundingEdges.length - 1].destinationVertex) {
                  rightBoundingEdges.push(currEdge.oppositeEdge);
                }
                currEdge = iterVertexToOutEdges.next();
              }
              newEdgeDownUp = new DDLSEdge();
              newEdgeUpDown = new DDLSEdge();
              newEdgeDownUp.setDatas(vertexDown, newEdgeUpDown, null, null, true, true);
              newEdgeUpDown.setDatas(currVertex, newEdgeDownUp, null, null, true, true);
              leftBoundingEdges.push(newEdgeDownUp);
              rightBoundingEdges.push(newEdgeUpDown);
              this.insertNewConstrainedEdge(segment, newEdgeDownUp, intersectedEdges, leftBoundingEdges, rightBoundingEdges);
              intersectedEdges.splice(0, intersectedEdges.length);
              leftBoundingEdges.splice(0, leftBoundingEdges.length);
              rightBoundingEdges.splice(0, rightBoundingEdges.length);
              vertexDown = currVertex;
              tempEdgeDownUp.originVertex = vertexDown;
              currObjet = vertexDown;
            } else {
              intersectedEdges.push(edgeLeft);
              rightBoundingEdges.push(edgeLeft.prevLeftEdge);
              currEdge = edgeLeft.oppositeEdge;
              currObjet = currEdge;
            }
          }
        }
      }
    }
  }
  insertNewConstrainedEdge(fromSegment, edgeDownUp, intersectedEdges, leftBoundingEdges, rightBoundingEdges) {
    this._edges.push(edgeDownUp);
    this._edges.push(edgeDownUp.oppositeEdge);
    edgeDownUp.addFromConstraintSegment(fromSegment);
    edgeDownUp.oppositeEdge.fromConstraintSegments = edgeDownUp.fromConstraintSegments;
    fromSegment.addEdge(edgeDownUp);
    edgeDownUp.originVertex.addFromConstraintSegment(fromSegment);
    edgeDownUp.destinationVertex.addFromConstraintSegment(fromSegment);
    this.untriangulate(intersectedEdges);
    this.triangulate(leftBoundingEdges, true);
    this.triangulate(rightBoundingEdges, true);
  }
  deleteConstraintSegment(segment) {
    var i;
    var vertexToDelete = [];
    var edge;
    var vertex;
    var fromConstraintSegment;
    for (i = 0; i < segment.edges.length; i++) {
      edge = segment.edges[i];
      edge.removeFromConstraintSegment(segment);
      if (edge.fromConstraintSegments.length == 0) {
        edge.isConstrained = false;
        edge.oppositeEdge.isConstrained = false;
      }
      vertex = edge.originVertex;
      vertex.removeFromConstraintSegment(segment);
      vertexToDelete.push(vertex);
    }
    vertex = edge.destinationVertex;
    vertex.removeFromConstraintSegment(segment);
    vertexToDelete.push(vertex);
    for (i = 0; i < vertexToDelete.length; i++) {
      this.deleteVertex(vertexToDelete[i]);
    }
    segment.dispose();
  }
  check() {
    for (var i = 0; i < this.__edges.length; i++) {
      if (!this.__edges[i].nextLeftEdge) {
        console.log("!!! missing nextLeftEdge");
        return;
      }
    }
    console.log("this.check OK");
  }
  insertVertex(x, y) {
    if (x < 0 || y < 0 || x > this._width || y > this._height)
      return null;
    this.__edgesToCheck.splice(0, this.__edgesToCheck.length);
    var inObject = DDLSGeom2D.locatePosition(x, y, this);
    var inVertex;
    var inEdge;
    var inFace;
    var newVertex;
    if (inObject instanceof DDLSVertex)
      inVertex = inObject;
    if (inVertex) {
      newVertex = inVertex;
    } else if (inEdge = inObject instanceof DDLSEdge ? inObject : null) {
      newVertex = this.splitEdge(inEdge, x, y);
    } else if (inFace = inObject instanceof DDLSFace ? inObject : null) {
      newVertex = this.splitFace(inFace, x, y);
    }
    this.restoreAsDelaunay();
    return newVertex;
  }
  flipEdge(edge) {
    var eBot_Top = edge;
    var eTop_Bot = edge.oppositeEdge;
    var eLeft_Right = new DDLSEdge();
    var eRight_Left = new DDLSEdge();
    var eTop_Left = eBot_Top.nextLeftEdge;
    var eLeft_Bot = eTop_Left.nextLeftEdge;
    var eBot_Right = eTop_Bot.nextLeftEdge;
    var eRight_Top = eBot_Right.nextLeftEdge;
    var vBot = eBot_Top.originVertex;
    var vTop = eTop_Bot.originVertex;
    var vLeft = eLeft_Bot.originVertex;
    var vRight = eRight_Top.originVertex;
    var fLeft = eBot_Top.leftFace;
    var fRight = eTop_Bot.leftFace;
    var fBot = new DDLSFace();
    var fTop = new DDLSFace();
    this._edges.push(eLeft_Right);
    this._edges.push(eRight_Left);
    this._faces.push(fTop);
    this._faces.push(fBot);
    eLeft_Right.setDatas(vLeft, eRight_Left, eRight_Top, fTop, edge.isReal, edge.isConstrained);
    eRight_Left.setDatas(vRight, eLeft_Right, eLeft_Bot, fBot, edge.isReal, edge.isConstrained);
    fTop.setDatas(eLeft_Right);
    fBot.setDatas(eRight_Left);
    if (vTop.edge == eTop_Bot)
      vTop.setDatas(eTop_Left);
    if (vBot.edge == eBot_Top)
      vBot.setDatas(eBot_Right);
    eTop_Left.nextLeftEdge = eLeft_Right;
    eTop_Left.leftFace = fTop;
    eLeft_Bot.nextLeftEdge = eBot_Right;
    eLeft_Bot.leftFace = fBot;
    eBot_Right.nextLeftEdge = eRight_Left;
    eBot_Right.leftFace = fBot;
    eRight_Top.nextLeftEdge = eTop_Left;
    eRight_Top.leftFace = fTop;
    eBot_Top.dispose();
    eTop_Bot.dispose();
    this._edges.splice(eBot_Top);
    this._edges.splice(eTop_Bot);
    fLeft.dispose();
    fRight.dispose();
    this._faces.splice(fLeft);
    this._faces.splice(fRight);
    return eRight_Left;
  }
  splitEdge(edge, x, y) {
    this.__edgesToCheck.splice(0, this.__edgesToCheck.length);
    var eLeft_Right = edge;
    var eRight_Left = eLeft_Right.oppositeEdge;
    var eRight_Top = eLeft_Right.nextLeftEdge;
    var eTop_Left = eRight_Top.nextLeftEdge;
    var eLeft_Bot = eRight_Left.nextLeftEdge;
    var eBot_Right = eLeft_Bot.nextLeftEdge;
    var vTop = eTop_Left.originVertex;
    var vLeft = eLeft_Right.originVertex;
    var vBot = eBot_Right.originVertex;
    var vRight = eRight_Left.originVertex;
    var fTop = eLeft_Right.leftFace;
    var fBot = eRight_Left.leftFace;
    if ((vLeft.pos.x - x) * (vLeft.pos.x - x) + (vLeft.pos.y - y) * (vLeft.pos.y - y) <= DDLSConstants.EPSILON_SQUARED)
      return vLeft;
    if ((vRight.pos.x - x) * (vRight.pos.x - x) + (vRight.pos.y - y) * (vRight.pos.y - y) <= DDLSConstants.EPSILON_SQUARED)
      return vRight;
    var vCenter = new DDLSVertex();
    var eTop_Center = new DDLSEdge();
    var eCenter_Top = new DDLSEdge();
    var eBot_Center = new DDLSEdge();
    var eCenter_Bot = new DDLSEdge();
    var eLeft_Center = new DDLSEdge();
    var eCenter_Left = new DDLSEdge();
    var eRight_Center = new DDLSEdge();
    var eCenter_Right = new DDLSEdge();
    var fTopLeft = new DDLSFace();
    var fBotLeft = new DDLSFace();
    var fBotRight = new DDLSFace();
    var fTopRight = new DDLSFace();
    this._vertices.push(vCenter);
    this._edges.push(eCenter_Top);
    this._edges.push(eTop_Center);
    this._edges.push(eCenter_Left);
    this._edges.push(eLeft_Center);
    this._edges.push(eCenter_Bot);
    this._edges.push(eBot_Center);
    this._edges.push(eCenter_Right);
    this._edges.push(eRight_Center);
    this._faces.push(fTopRight);
    this._faces.push(fBotRight);
    this._faces.push(fBotLeft);
    this._faces.push(fTopLeft);
    vCenter.setDatas(fTop.isReal ? eCenter_Top : eCenter_Bot);
    vCenter.pos.x = x;
    vCenter.pos.y = y;
    DDLSGeom2D.projectOrthogonaly(vCenter.pos, eLeft_Right);
    eCenter_Top.setDatas(vCenter, eTop_Center, eTop_Left, fTopLeft, fTop.isReal);
    eTop_Center.setDatas(vTop, eCenter_Top, eCenter_Right, fTopRight, fTop.isReal);
    eCenter_Left.setDatas(vCenter, eLeft_Center, eLeft_Bot, fBotLeft, edge.isReal, edge.isConstrained);
    eLeft_Center.setDatas(vLeft, eCenter_Left, eCenter_Top, fTopLeft, edge.isReal, edge.isConstrained);
    eCenter_Bot.setDatas(vCenter, eBot_Center, eBot_Right, fBotRight, fBot.isReal);
    eBot_Center.setDatas(vBot, eCenter_Bot, eCenter_Left, fBotLeft, fBot.isReal);
    eCenter_Right.setDatas(vCenter, eRight_Center, eRight_Top, fTopRight, edge.isReal, edge.isConstrained);
    eRight_Center.setDatas(vRight, eCenter_Right, eCenter_Bot, fBotRight, edge.isReal, edge.isConstrained);
    fTopLeft.setDatas(eCenter_Top, fTop.isReal);
    fBotLeft.setDatas(eCenter_Left, fBot.isReal);
    fBotRight.setDatas(eCenter_Bot, fBot.isReal);
    fTopRight.setDatas(eCenter_Right, fTop.isReal);
    if (vLeft.edge == eLeft_Right)
      vLeft.setDatas(eLeft_Center);
    if (vRight.edge == eRight_Left)
      vRight.setDatas(eRight_Center);
    eTop_Left.nextLeftEdge = eLeft_Center;
    eTop_Left.leftFace = fTopLeft;
    eLeft_Bot.nextLeftEdge = eBot_Center;
    eLeft_Bot.leftFace = fBotLeft;
    eBot_Right.nextLeftEdge = eRight_Center;
    eBot_Right.leftFace = fBotRight;
    eRight_Top.nextLeftEdge = eTop_Center;
    eRight_Top.leftFace = fTopRight;
    if (eLeft_Right.isConstrained) {
      var fromSegments = eLeft_Right.fromConstraintSegments;
      eLeft_Center.fromConstraintSegments = fromSegments.slice(0);
      eCenter_Left.fromConstraintSegments = eLeft_Center.fromConstraintSegments;
      eCenter_Right.fromConstraintSegments = fromSegments.slice(0);
      eRight_Center.fromConstraintSegments = eCenter_Right.fromConstraintSegments;
      var edges;
      var index;
      for (var i = 0; i < eLeft_Right.fromConstraintSegments.length; i++) {
        edges = eLeft_Right.fromConstraintSegments[i].edges;
        index = edges.indexOf(eLeft_Right);
        if (index != -1)
          edges.splice(index, 1, eLeft_Center, eCenter_Right);
        else
          edges.splice(edges.indexOf(eRight_Left), 1, eRight_Center, eCenter_Left);
      }
      vCenter.fromConstraintSegments = fromSegments.slice(0);
    }
    eLeft_Right.dispose();
    eRight_Left.dispose();
    this._edges.splice(eLeft_Right);
    this._edges.splice(eRight_Left);
    fTop.dispose();
    fBot.dispose();
    this._faces.splice(fTop);
    this._faces.splice(fBot);
    this.__centerVertex = vCenter;
    this.__edgesToCheck.push(eTop_Left);
    this.__edgesToCheck.push(eLeft_Bot);
    this.__edgesToCheck.push(eBot_Right);
    this.__edgesToCheck.push(eRight_Top);
    return vCenter;
  }
  splitFace(face, x, y) {
    this.__edgesToCheck.splice(0, this.__edgesToCheck.length);
    var eTop_Left = face.edge;
    var eLeft_Right = eTop_Left.nextLeftEdge;
    var eRight_Top = eLeft_Right.nextLeftEdge;
    var vTop = eTop_Left.originVertex;
    var vLeft = eLeft_Right.originVertex;
    var vRight = eRight_Top.originVertex;
    var vCenter = new DDLSVertex();
    var eTop_Center = new DDLSEdge();
    var eCenter_Top = new DDLSEdge();
    var eLeft_Center = new DDLSEdge();
    var eCenter_Left = new DDLSEdge();
    var eRight_Center = new DDLSEdge();
    var eCenter_Right = new DDLSEdge();
    var fTopLeft = new DDLSFace();
    var fBot = new DDLSFace();
    var fTopRight = new DDLSFace();
    this._vertices.push(vCenter);
    this._edges.push(eTop_Center);
    this._edges.push(eCenter_Top);
    this._edges.push(eLeft_Center);
    this._edges.push(eCenter_Left);
    this._edges.push(eRight_Center);
    this._edges.push(eCenter_Right);
    this._faces.push(fTopLeft);
    this._faces.push(fBot);
    this._faces.push(fTopRight);
    vCenter.setDatas(eCenter_Top);
    vCenter.pos.x = x;
    vCenter.pos.y = y;
    eTop_Center.setDatas(vTop, eCenter_Top, eCenter_Right, fTopRight);
    eCenter_Top.setDatas(vCenter, eTop_Center, eTop_Left, fTopLeft);
    eLeft_Center.setDatas(vLeft, eCenter_Left, eCenter_Top, fTopLeft);
    eCenter_Left.setDatas(vCenter, eLeft_Center, eLeft_Right, fBot);
    eRight_Center.setDatas(vRight, eCenter_Right, eCenter_Left, fBot);
    eCenter_Right.setDatas(vCenter, eRight_Center, eRight_Top, fTopRight);
    fTopLeft.setDatas(eCenter_Top);
    fBot.setDatas(eCenter_Left);
    fTopRight.setDatas(eCenter_Right);
    eTop_Left.nextLeftEdge = eLeft_Center;
    eTop_Left.leftFace = fTopLeft;
    eLeft_Right.nextLeftEdge = eRight_Center;
    eLeft_Right.leftFace = fBot;
    eRight_Top.nextLeftEdge = eTop_Center;
    eRight_Top.leftFace = fTopRight;
    face.dispose();
    this._faces.splice(face);
    this.__centerVertex = vCenter;
    this.__edgesToCheck.push(eTop_Left);
    this.__edgesToCheck.push(eLeft_Right);
    this.__edgesToCheck.push(eRight_Top);
    return vCenter;
  }
  restoreAsDelaunay() {
    var edge;
    while (this.__edgesToCheck.length) {
      edge = this.__edgesToCheck.shift();
      if (edge.isReal && !edge.isConstrained && !DDLSGeom2D.isDelaunay(edge)) {
        if (edge.nextLeftEdge.destinationVertex == this.__centerVertex) {
          this.__edgesToCheck.push(edge.nextRightEdge);
          this.__edgesToCheck.push(edge.prevRightEdge);
        } else {
          this.__edgesToCheck.push(edge.nextLeftEdge);
          this.__edgesToCheck.push(edge.prevLeftEdge);
        }
        this.flipEdge(edge);
      }
    }
  }
  // Delete a vertex IF POSSIBLE and then fill the hole with a new triangulation.
  // A vertex can be deleted if:
  // - it is free of constraint segment (no adjacency to any constrained edge)
  // - it is adjacent to exactly 2 contrained edges and is not an end point of any constraint segment
  deleteVertex(vertex) {
    var i;
    var freeOfConstraint;
    var iterEdges = new IteratorFromVertexToOutgoingEdges();
    iterEdges.fromVertex = vertex;
    iterEdges.realEdgesOnly = false;
    var edge;
    var outgoingEdges = [];
    freeOfConstraint = vertex.fromConstraintSegments.length == 0;
    var bound = [];
    if (freeOfConstraint) {
      edge = iterEdges.next();
      while (edge) {
        outgoingEdges.push(edge);
        bound.push(edge.nextLeftEdge);
        edge = iterEdges.next();
      }
    } else {
      var edges;
      for (i = 0; i < vertex.fromConstraintSegments.length; i++) {
        edges = vertex.fromConstraintSegments[i].edges;
        if (edges[0].originVertex == vertex || edges[edges.length - 1].destinationVertex == vertex) {
          return false;
        }
      }
      var count = 0;
      edge = iterEdges.next();
      while (edge) {
        outgoingEdges.push(edge);
        if (edge.isConstrained) {
          count++;
          if (count > 2) {
            return false;
          }
        }
        edge = iterEdges.next();
      }
      var boundA = [];
      var boundB = [];
      var constrainedEdgeA;
      var constrainedEdgeB;
      var edgeA = new DDLSEdge();
      var edgeB = new DDLSEdge();
      var realA;
      var realB;
      this._edges.push(edgeA);
      this._edges.push(edgeB);
      for (i = 0; i < outgoingEdges.length; i++) {
        edge = outgoingEdges[i];
        if (edge.isConstrained) {
          if (!constrainedEdgeA) {
            edgeB.setDatas(edge.destinationVertex, edgeA, null, null, true, true);
            boundA.push(edgeA, edge.nextLeftEdge);
            boundB.push(edgeB);
            constrainedEdgeA = edge;
          } else if (!constrainedEdgeB) {
            edgeA.setDatas(edge.destinationVertex, edgeB, null, null, true, true);
            boundB.push(edge.nextLeftEdge);
            constrainedEdgeB = edge;
          }
        } else {
          if (!constrainedEdgeA)
            boundB.push(edge.nextLeftEdge);
          else if (!constrainedEdgeB)
            boundA.push(edge.nextLeftEdge);
          else
            boundB.push(edge.nextLeftEdge);
        }
      }
      realA = constrainedEdgeA.leftFace.isReal;
      realB = constrainedEdgeB.leftFace.isReal;
      edgeA.fromConstraintSegments = constrainedEdgeA.fromConstraintSegments.slice(0);
      edgeB.fromConstraintSegments = edgeA.fromConstraintSegments;
      var index;
      for (i = 0; i < vertex.fromConstraintSegments.length; i++) {
        edges = vertex.fromConstraintSegments[i].edges;
        index = edges.indexOf(constrainedEdgeA);
        if (index != -1) {
          edges.splice(index - 1, 2, edgeA);
        } else {
          edges.splice(edges.indexOf(constrainedEdgeB) - 1, 2, edgeB);
        }
      }
    }
    var faceToDelete;
    for (i = 0; i < outgoingEdges.length; i++) {
      edge = outgoingEdges[i];
      faceToDelete = edge.leftFace;
      this._faces.splice(faceToDelete);
      faceToDelete.dispose();
      edge.destinationVertex.edge = edge.nextLeftEdge;
      this._edges.splice(edge.oppositeEdge);
      edge.oppositeEdge.dispose();
      this._edges.splice(edge);
      edge.dispose();
    }
    this._vertices.splice(this._vertices.indexOf(vertex), 1);
    vertex.dispose();
    if (freeOfConstraint) {
      this.triangulate(bound, true);
    } else {
      this.triangulate(boundA, realA);
      this.triangulate(boundB, realB);
    }
    return true;
  }
  ///// PRIVATE
  // this.untriangulate is usually used while a new edge insertion in order to delete the intersected edges
  // edgesList is a list of chained edges oriented from right to left
  untriangulate(edgesList) {
    var i;
    var verticesCleaned = {};
    var currEdge;
    var outEdge;
    for (i = 0; i < edgesList.length; i++) {
      currEdge = edgesList[i];
      if (!verticesCleaned[currEdge.originVertex.id]) {
        currEdge.originVertex.edge = currEdge.prevLeftEdge.oppositeEdge;
        verticesCleaned[currEdge.originVertex.id] = true;
      }
      if (!verticesCleaned[currEdge.destinationVertex.id]) {
        currEdge.destinationVertex.edge = currEdge.nextLeftEdge;
        verticesCleaned[currEdge.destinationVertex.id] = true;
      }
      this._faces.splice(currEdge.leftFace);
      currEdge.leftFace.dispose();
      if (i == edgesList.length - 1) {
        this._faces.splice(currEdge.rightFace);
        currEdge.rightFace.dispose();
      }
    }
    for (i = 0; i < edgesList.length; i++) {
      currEdge = edgesList[i];
      this._edges.splice(currEdge.oppositeEdge);
      this._edges.splice(currEdge);
      currEdge.oppositeEdge.dispose();
      currEdge.dispose();
    }
  }
  // this.triangulate is usually used to fill the hole after deletion of a vertex from mesh or after untriangulation
  // - bounds is the list of edges in CCW bounding the surface to retriangulate,
  triangulate(bound, isReal) {
    if (bound.length < 2) {
      console.log("BREAK ! the hole has less than 2 edges");
      return;
    } else if (bound.length == 2) {
      console.log("BREAK ! the hole has only 2 edges");
      console.log("  - edge0:", bound[0].originVertex.id, "->", bound[0].destinationVertex.id);
      console.log("  - edge1:", bound[1].originVertex.id, "->", bound[1].destinationVertex.id);
      return;
    } else if (bound.length == 3) {
      var f = new DDLSFace();
      f.setDatas(bound[0], isReal);
      this._faces.push(f);
      bound[0].leftFace = f;
      bound[1].leftFace = f;
      bound[2].leftFace = f;
      bound[0].nextLeftEdge = bound[1];
      bound[1].nextLeftEdge = bound[2];
      bound[2].nextLeftEdge = bound[0];
    } else {
      for (i = 0; i < bound.length; i++) {
      }
      var baseEdge = bound[0];
      var vertexA = baseEdge.originVertex;
      var vertexB = baseEdge.destinationVertex;
      var vertexC;
      var vertexCheck;
      var circumcenter = new DDLSPoint2D();
      var radiusSquared;
      var distanceSquared;
      var isDelaunay;
      var index;
      var i;
      for (i = 2; i < bound.length; i++) {
        vertexC = bound[i].originVertex;
        if (DDLSGeom2D.getRelativePosition2(vertexC.pos.x, vertexC.pos.y, baseEdge) == 1) {
          index = i;
          isDelaunay = true;
          DDLSGeom2D.getCircumcenter(vertexA.pos.x, vertexA.pos.y, vertexB.pos.x, vertexB.pos.y, vertexC.pos.x, vertexC.pos.y, circumcenter);
          radiusSquared = (vertexA.pos.x - circumcenter.x) * (vertexA.pos.x - circumcenter.x) + (vertexA.pos.y - circumcenter.y) * (vertexA.pos.y - circumcenter.y);
          radiusSquared -= DDLSConstants.EPSILON_SQUARED;
          for (var j = 2; j < bound.length; j++) {
            if (j != i) {
              vertexCheck = bound[j].originVertex;
              distanceSquared = (vertexCheck.pos.x - circumcenter.x) * (vertexCheck.pos.x - circumcenter.x) + (vertexCheck.pos.y - circumcenter.y) * (vertexCheck.pos.y - circumcenter.y);
              if (distanceSquared < radiusSquared) {
                isDelaunay = false;
                break;
              }
            }
          }
          if (isDelaunay)
            break;
        }
      }
      if (!isDelaunay) {
        console.log("NO DELAUNAY FOUND");
        var s = "";
        for (i = 0; i < bound.length; i++) {
          s += bound[i].originVertex.pos.x + " , ";
          s += bound[i].originVertex.pos.y + " , ";
          s += bound[i].destinationVertex.pos.x + " , ";
          s += bound[i].destinationVertex.pos.y + " , ";
        }
        index = 2;
      }
      var edgeA;
      var edgeAopp;
      var edgeB;
      var edgeBopp;
      var boundA;
      var boundM;
      var boundB;
      if (index < bound.length - 1) {
        edgeA = new DDLSEdge();
        edgeAopp = new DDLSEdge();
        this._edges.push(edgeA);
        this._edges.push(edgeAopp);
        edgeA.setDatas(vertexA, edgeAopp, null, null, isReal, false);
        edgeAopp.setDatas(bound[index].originVertex, edgeA, null, null, isReal, false);
        boundA = bound.slice(index);
        boundA.push(edgeA);
        this.triangulate(boundA, isReal);
      }
      if (index > 2) {
        edgeB = new DDLSEdge();
        edgeBopp = new DDLSEdge();
        this._edges.push(edgeB);
        this._edges.push(edgeBopp);
        edgeB.setDatas(bound[1].originVertex, edgeBopp, null, null, isReal, false);
        edgeBopp.setDatas(bound[index].originVertex, edgeB, null, null, isReal, false);
        boundB = bound.slice(1, index);
        boundB.push(edgeBopp);
        this.triangulate(boundB, isReal);
      }
      boundM = [];
      if (index == 2)
        boundM.push(baseEdge, bound[1], edgeAopp);
      else if (index == bound.length - 1)
        boundM.push(baseEdge, edgeB, bound[index]);
      else
        boundM.push(baseEdge, edgeB, edgeAopp);
      this.triangulate(boundM, isReal);
    }
  }
  debug() {
    var i;
    for (i = 0; i < this.__vertices.length; i++) {
      console.log("-- vertex", this._vertices[i].id);
      console.log("  edge", this._vertices[i].edge.id, " - ", this._vertices[i].edge);
      console.log("  edge isReal:", this._vertices[i].edge.isReal);
    }
    for (i = 0; i < this.__edges.length; i++) {
      console.log("-- edge", this.__edges[i]);
      console.log("  isReal", this.__edges[i].id, " - ", this.__edges[i].isReal);
      console.log("  nextLeftEdge", this.__edges[i].nextLeftEdge);
      console.log("  oppositeEdge", this.__edges[i].oppositeEdge);
    }
  }
};
_DDLSMesh.INC = 0;
var DDLSMesh = _DDLSMesh;
var EdgeMap = class {
  constructor() {
    this.content = {};
  }
  push(value) {
    var old = this.content[value.id];
    if (old) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0");
    }
    this.content[value.id] = value;
    this.dataChanged = true;
  }
  splice(edge) {
    var old = this.content[edge.id];
    delete this.content[edge.id];
    this.dataChanged = true;
  }
  get vector() {
    if (!this._vector) {
      this._vector = [];
    }
    if (this.dataChanged) {
      this._vector.length = 0;
      for (var i of this.content) {
        this._vector.push(i);
      }
      this.dataChanged = false;
    }
    return this._vector;
  }
  dispose() {
    Object.keys(this.content).forEach((key) => {
      const element = this.content[key];
      element.dispose();
    });
    this.content = null;
    this._vector.length = 0;
    this._vector = null;
  }
};
var FaceMap = class {
  constructor() {
    this.content = {};
  }
  push(value) {
    var old = this.content[value.id];
    if (old) {
      console.error("\u91CD\u590D\u6DFB\u52A0");
      return;
    }
    this.content[value.id] = value;
    this.dataChanged = true;
  }
  splice(edge) {
    var old = this.content[edge.id];
    delete this.content[edge.id];
    this.dataChanged = true;
  }
  get vector() {
    if (!this._vector) {
      this._vector = [];
    }
    if (this.dataChanged) {
      this._vector.length = 0;
      for (var i of this.content) {
        this._vector.push(i);
      }
      this.dataChanged = false;
    }
    return this._vector;
  }
  dispose() {
    Object.keys(this.content).forEach((key) => {
      const element = this.content[key];
      element.dispose();
    });
    this.content = null;
    this._vector.length = 0;
    this._vector = null;
  }
};

// src/ddls/factories/DDLSRectMeshFactory.ts
var DDLSRectMeshFactory = class {
  static buildRectangle(width, height) {
    var vTL = new DDLSVertex();
    var vTR = new DDLSVertex();
    var vBR = new DDLSVertex();
    var vBL = new DDLSVertex();
    var eTL_TR = new DDLSEdge();
    var eTR_TL = new DDLSEdge();
    var eTR_BR = new DDLSEdge();
    var eBR_TR = new DDLSEdge();
    var eBR_BL = new DDLSEdge();
    var eBL_BR = new DDLSEdge();
    var eBL_TL = new DDLSEdge();
    var eTL_BL = new DDLSEdge();
    var eTR_BL = new DDLSEdge();
    var eBL_TR = new DDLSEdge();
    var eTL_BR = new DDLSEdge();
    var eBR_TL = new DDLSEdge();
    var fTL_BL_TR = new DDLSFace();
    var fTR_BL_BR = new DDLSFace();
    var fTL_BR_BL = new DDLSFace();
    var fTL_TR_BR = new DDLSFace();
    var boundShape = new DDLSConstraintShape();
    var segTop = new DDLSConstraintSegment();
    var segRight = new DDLSConstraintSegment();
    var segBot = new DDLSConstraintSegment();
    var segLeft = new DDLSConstraintSegment();
    var mesh = new DDLSMesh(width, height);
    var offset = DDLSConstants.EPSILON * 1e3;
    vTL.pos.setTo(0 - offset, 0 - offset);
    vTR.pos.setTo(width + offset, 0 - offset);
    vBR.pos.setTo(width + offset, height + offset);
    vBL.pos.setTo(0 - offset, height + offset);
    vTL.setDatas(eTL_TR);
    vTR.setDatas(eTR_BR);
    vBR.setDatas(eBR_BL);
    vBL.setDatas(eBL_TL);
    eTL_TR.setDatas(vTL, eTR_TL, eTR_BR, fTL_TR_BR, true, true);
    eTR_TL.setDatas(vTR, eTL_TR, eTL_BL, fTL_BL_TR, true, true);
    eTR_BR.setDatas(vTR, eBR_TR, eBR_TL, fTL_TR_BR, true, true);
    eBR_TR.setDatas(vBR, eTR_BR, eTR_BL, fTR_BL_BR, true, true);
    eBR_BL.setDatas(vBR, eBL_BR, eBL_TL, fTL_BR_BL, true, true);
    eBL_BR.setDatas(vBL, eBR_BL, eBR_TR, fTR_BL_BR, true, true);
    eBL_TL.setDatas(vBL, eTL_BL, eTL_BR, fTL_BR_BL, true, true);
    eTL_BL.setDatas(vTL, eBL_TL, eBL_TR, fTL_BL_TR, true, true);
    eTR_BL.setDatas(vTR, eBL_TR, eBL_BR, fTR_BL_BR, true, false);
    eBL_TR.setDatas(vBL, eTR_BL, eTR_TL, fTL_BL_TR, true, false);
    eTL_BR.setDatas(vTL, eBR_TL, eBR_BL, fTL_BR_BL, false, false);
    eBR_TL.setDatas(vBR, eTL_BR, eTL_TR, fTL_TR_BR, false, false);
    fTL_BL_TR.setDatas(eBL_TR);
    fTR_BL_BR.setDatas(eTR_BL);
    fTL_BR_BL.setDatas(eBR_BL, false);
    fTL_TR_BR.setDatas(eTR_BR, false);
    vTL.fromConstraintSegments.push(segTop, segLeft);
    vTR.fromConstraintSegments.push(segTop, segRight);
    vBR.fromConstraintSegments.push(segRight, segBot);
    vBL.fromConstraintSegments.push(segBot, segLeft);
    eTL_TR.fromConstraintSegments.push(segTop);
    eTR_TL.fromConstraintSegments.push(segTop);
    eTR_BR.fromConstraintSegments.push(segRight);
    eBR_TR.fromConstraintSegments.push(segRight);
    eBR_BL.fromConstraintSegments.push(segBot);
    eBL_BR.fromConstraintSegments.push(segBot);
    eBL_TL.fromConstraintSegments.push(segLeft);
    eTL_BL.fromConstraintSegments.push(segLeft);
    segTop.edges.push(eTL_TR);
    segRight.edges.push(eTR_BR);
    segBot.edges.push(eBR_BL);
    segLeft.edges.push(eBL_TL);
    segTop.fromShape = boundShape;
    segRight.fromShape = boundShape;
    segBot.fromShape = boundShape;
    segLeft.fromShape = boundShape;
    boundShape.segments.push(segTop, segRight, segBot, segLeft);
    mesh.__vertices.push(vTL, vTR, vBR, vBL);
    mesh.__edges.push(eTL_TR, eTR_TL, eTR_BR, eBR_TR, eBR_BL, eBL_BR, eBL_TL, eTL_BL, eTR_BL, eBL_TR, eTL_BR, eBR_TL);
    mesh.__faces.push(fTL_BL_TR, fTR_BL_BR, fTL_BR_BL, fTL_TR_BR);
    mesh.__constraintShapes.push(boundShape);
    var securityRect = [];
    securityRect.push(0, 0, width, 0);
    securityRect.push(width, 0, width, height);
    securityRect.push(width, height, 0, height);
    securityRect.push(0, height, 0, 0);
    mesh.clipping = false;
    mesh.insertConstraintShape(securityRect);
    mesh.clipping = true;
    return mesh;
  }
};

// src/ddls/iterators/IteratorFromMeshToVertices.ts
var IteratorFromMeshToVertices = class {
  constructor() {
  }
  set fromMesh(value) {
    this._fromMesh = value;
    this._currIndex = 0;
  }
  next() {
    do {
      if (this._currIndex < this._fromMesh.__vertices.length) {
        this._resultVertex = this._fromMesh.__vertices[this._currIndex];
        this._currIndex++;
      } else {
        this._resultVertex = null;
        break;
      }
    } while (!this._resultVertex.isReal);
    return this._resultVertex;
  }
};

// src/ddls/iterators/IteratorFromVertexToIncomingEdges.ts
var IteratorFromVertexToIncomingEdges = class {
  constructor() {
  }
  set fromVertex(value) {
    this._fromVertex = value;
    this._nextEdge = this._fromVertex.edge;
    while (!this._nextEdge.isReal) {
      this._nextEdge = this._nextEdge.rotLeftEdge;
    }
  }
  next() {
    if (this._nextEdge) {
      this._resultEdge = this._nextEdge.oppositeEdge;
      do {
        this._nextEdge = this._nextEdge.rotLeftEdge;
        if (this._nextEdge == this._fromVertex.edge) {
          this._nextEdge = null;
          break;
        }
      } while (!this._nextEdge.isReal);
    } else {
      this._resultEdge = null;
    }
    return this._resultEdge;
  }
};

// src/ddls/utils/DDLSUtils.ts
import { Vec2 } from "cc";
var _DDLSUtils = class _DDLSUtils {
  /**
   * 计算角色站位位置
   * @param world 
   * @param role_x 
   * @param role_y 
   * @param targetX 
   * @param targetY 
   * @param radius 
   * @param result 
   * @returns 
   */
  static calculatePos(mesh, role_x, role_y, targetX, targetY, radius, result) {
    result = result || { x: 0, y: 0 };
    radius = radius || 1;
    const vector = new Vec2();
    vector.set(targetX - role_x, targetY - role_y);
    let len = vector.length();
    let count = Math.ceil(len / radius) || 1;
    let tx = role_x;
    let ty = role_y;
    let isblock = false;
    vector.normalize();
    vector.multiplyScalar(radius);
    for (let index = 0; index < count; index++) {
      tx += vector.x;
      ty += vector.y;
      if (DDLSGeom2D.isCircleIntersectingAnyConstraint(tx, ty, radius, mesh)) {
        tx -= vector.x;
        ty -= vector.y;
        isblock = true;
        break;
      }
    }
    if (isblock) {
      result.x = tx;
      result.y = ty;
    } else {
      result.x = targetX;
      result.y = targetY;
    }
    return result;
  }
  /**
   * 检测是否发生碰撞并返回碰撞的边缘对象
   */
  static isCircleIntersectingAnyConstraint(x, y, radius, mesh, result) {
    result = result || [];
    result.length = 0;
    if (x <= 0 || x >= mesh.width || y <= 0 || y >= mesh.height)
      return null;
    let loc = DDLSGeom2D.locatePosition(x, y, mesh);
    let face;
    if (loc instanceof DDLSVertex)
      face = loc.edge.leftFace;
    else if (loc instanceof DDLSEdge)
      face = loc.leftFace;
    else
      face = loc;
    let edgesToCheck = new Array();
    edgesToCheck.push(face.edge);
    edgesToCheck.push(face.edge.nextLeftEdge);
    edgesToCheck.push(face.edge.nextLeftEdge.nextLeftEdge);
    _DDLSUtils.checkedEdges.clear();
    let edge;
    let pos1;
    let pos2;
    let intersecting;
    while (edgesToCheck.length > 0) {
      edge = edgesToCheck.pop();
      _DDLSUtils.checkedEdges.set(edge.id, true);
      pos1 = edge.originVertex.pos;
      pos2 = edge.destinationVertex.pos;
      intersecting = DDLSGeom2D.intersectionsSegmentCircle(pos1.x, pos1.y, pos2.x, pos2.y, x, y, radius);
      if (intersecting) {
        if (edge.isConstrained)
          result.push(edge);
        else {
          edge = edge.oppositeEdge.nextLeftEdge;
          if (!_DDLSUtils.checkedEdges.has(edge.id) && !_DDLSUtils.checkedEdges.has(edge.oppositeEdge.id) && edgesToCheck.indexOf(edge) == -1 && edgesToCheck.indexOf(edge.oppositeEdge) == -1) {
            edgesToCheck.push(edge);
          }
          edge = edge.nextLeftEdge;
          if (!_DDLSUtils.checkedEdges.has(edge.id) && !_DDLSUtils.checkedEdges.has(edge.oppositeEdge.id) && edgesToCheck.indexOf(edge) == -1 && edgesToCheck.indexOf(edge.oppositeEdge) == -1) {
            edgesToCheck.push(edge);
          }
        }
      }
    }
    return result;
  }
  /**
   * 路径格式化
   * @param path 
   * @param result 
   * @param checkDup   是否去重
   */
  static pathFormatting(path, result, checkDup = false) {
    if (checkDup) {
      let cache = {};
      let key;
      for (let index = 0; index < path.length; index += 2) {
        const x = path[index];
        const y = path[index + 1];
        key = x + "_" + y;
        if (cache[key]) {
          path.splice(index, 2);
          index -= 2;
        } else {
          cache[key] = true;
        }
      }
    }
    for (let index = 0; index < path.length; index += 2) {
      result.push(path[index], path[index + 1]);
      if (index > 0) {
        result.push(path[index], path[index + 1]);
      }
    }
    result.push(path[0], path[1]);
  }
};
_DDLSUtils.checkedEdges = /* @__PURE__ */ new Map();
var DDLSUtils = _DDLSUtils;

// src/ddls/utils/Polygon.ts
import { Rect, Vec2 as Vec22 } from "cc";
var Polygon = class _Polygon {
  /** Creates a Polygon with the given coordinates.
   *  @param vertices an array that contains either 'Point' instances or
   *                  alternating 'x' and 'y' coordinates.
   */
  constructor(vertices) {
    this._rect = new Rect();
    this._coords = [];
    this._rect.x = Number.MAX_VALUE;
    this._rect.y = Number.MAX_VALUE;
    this._rect.width = Number.MAX_VALUE;
    this._rect.height = Number.MAX_VALUE;
    this.addVertices.apply(this, vertices);
  }
  /** Creates a clone of this polygon. */
  clone() {
    let clone = new _Polygon();
    let numCoords = this._coords.length;
    for (let i = 0; i < numCoords; ++i) {
      clone._coords[i] = this._coords[i];
      clone._rect = this._rect.clone();
    }
    return clone;
  }
  /** Reverses the order of the vertices. Note that some methods of the Polygon class
   *  require the vertices in clockwise order. */
  reverse() {
    let numCoords = this._coords.length;
    let numVertices = Math.floor(numCoords / 2);
    let tmp;
    for (let i = 0; i < numVertices; i += 2) {
      tmp = this._coords[i];
      this._coords[i] = this._coords[numCoords - i - 2];
      this._coords[numCoords - i - 2] = tmp;
      tmp = this._coords[i + 1];
      this._coords[i + 1] = this._coords[numCoords - i - 1];
      this._coords[numCoords - i - 1] = tmp;
    }
  }
  /** Adds vertices to the polygon. Pass either a list of 'Point' instances or alternating
   *  'x' and 'y' coordinates. */
  addVertices(...args) {
    let i;
    let numArgs = args.length;
    let numCoords = this._coords.length;
    let minX = Math.min(this._rect.x, Number.MAX_VALUE);
    let minY = Math.min(this._rect.y, Number.MAX_VALUE);
    let maxX = Math.max(this._rect.x + this._rect.width, Number.MIN_VALUE);
    let maxY = Math.max(this._rect.y + this._rect.height, Number.MIN_VALUE);
    if (numArgs > 0) {
      if (typeof args[0] == "number") {
        for (i = 0; i < numArgs; ++i) {
          const value = args[i];
          this._coords[numCoords + i] = value;
          if ((i + 1) % 2 != 0) {
            if (value < minX) {
              minX = value;
            }
            if (value > maxX) {
              maxX = value;
            }
          } else {
            if (value < minY) {
              minY = value;
            }
            if (value > maxY) {
              maxY = value;
            }
          }
        }
      } else {
        for (i = 0; i < numArgs; i++) {
          const point = args[i];
          this._coords[numCoords + i * 2] = point.x;
          this._coords[numCoords + i * 2 + 1] = point.y;
          if (point.x < minX) {
            minX = point.x;
          }
          if (point.y < minY) {
            minY = point.y;
          }
          if (point.x > maxX) {
            maxX = point.x;
          }
          if (point.y > maxY) {
            maxY = point.y;
          }
        }
      }
      this._rect.set(
        minX,
        minY,
        maxX - minX,
        maxY - minY
      );
    }
  }
  /** Moves a given vertex to a certain position or adds a new vertex at the end. */
  setVertex(index, x, y) {
    if (index >= 0 && index <= this.numVertices) {
      this._coords[index * 2] = x;
      this._coords[index * 2 + 1] = y;
    } else {
      throw new RangeError("Invalid index: " + index);
    }
  }
  /** Returns the coordinates of a certain vertex. */
  getVertex(index, out = null) {
    if (index >= 0 && index < this.numVertices) {
      out = out || new Vec22();
      out.set(this._coords[index * 2], this._coords[index * 2 + 1]);
      return out;
    } else {
      throw new RangeError("Invalid index: " + index);
    }
  }
  /** Figures out if the given coordinates lie within the polygon. */
  contains(x, y) {
    let i, j = this.numVertices - 1;
    let oddNodes = 0;
    for (i = 0; i < this.numVertices; ++i) {
      let ix = this._coords[i * 2];
      let iy = this._coords[i * 2 + 1];
      let jx = this._coords[j * 2];
      let jy = this._coords[j * 2 + 1];
      if ((iy < y && jy >= y || jy < y && iy >= y) && (ix <= x || jx <= x)) {
        oddNodes ^= Number(ix + (y - iy) / (jy - iy) * (jx - ix) < x);
      }
      j = i;
    }
    return oddNodes != 0;
  }
  /** Figures out if the given point lies within the polygon. */
  containsPoint(point) {
    return this.contains(point.x, point.y);
  }
  /** Creates a string that contains the values of all included points. */
  toString() {
    let result = "[Polygon";
    let numPoints = this.numVertices;
    if (numPoints > 0) result += "\n";
    for (let i = 0; i < numPoints; ++i) {
      result += "  [Vertex " + i + ": x=" + this._coords[i * 2].toFixed(1) + ", y=" + this._coords[i * 2 + 1].toFixed(1) + "]" + (i == numPoints - 1 ? "\n" : ",\n");
    }
    return result + "]";
  }
  // helpers
  /** Calculates if the area of the triangle a->b->c is to on the right-hand side of a->b. */
  static isConvexTriangle(ax, ay, bx, by, cx, cy) {
    return (ay - by) * (cx - bx) + (bx - ax) * (cy - by) >= 0;
  }
  /** Finds out if the vector a->b intersects c->d. */
  static areVectorsIntersecting(ax, ay, bx, by, cx, cy, dx, dy) {
    if (ax == bx && ay == by || cx == dx && cy == dy) return false;
    let abx = bx - ax;
    let aby = by - ay;
    let cdx = dx - cx;
    let cdy = dy - cy;
    let tDen = cdy * abx - cdx * aby;
    if (tDen == 0) return false;
    let t = (aby * (cx - ax) - abx * (cy - ay)) / tDen;
    if (t < 0 || t > 1) return false;
    let s = aby ? (cy - ay + t * cdy) / aby : (cx - ax + t * cdx) / abx;
    return s >= 0 && s <= 1;
  }
  // properties
  /** Indicates if the polygon's line segments are not self-intersecting.
   *  Beware: this is a brute-force implementation with <code>O(n^2)</code>. */
  get isSimple() {
    let numCoords = this._coords.length;
    if (numCoords <= 6) return true;
    for (let i = 0; i < numCoords; i += 2) {
      let ax = this._coords[i];
      let ay = this._coords[i + 1];
      let bx = this._coords[(i + 2) % numCoords];
      let by = this._coords[(i + 3) % numCoords];
      let endJ = i + numCoords - 2;
      for (let j = i + 4; j < endJ; j += 2) {
        let cx = this._coords[j % numCoords];
        let cy = this._coords[(j + 1) % numCoords];
        let dx = this._coords[(j + 2) % numCoords];
        let dy = this._coords[(j + 3) % numCoords];
        if (_Polygon.areVectorsIntersecting(ax, ay, bx, by, cx, cy, dx, dy))
          return false;
      }
    }
    return true;
  }
  /** Indicates if the polygon is convex. In a convex polygon, the vector between any two
   *  points inside the polygon lies inside it, as well. */
  get isConvex() {
    let numCoords = this._coords.length;
    if (numCoords < 6) return true;
    else {
      for (let i = 0; i < numCoords; i += 2) {
        if (!_Polygon.isConvexTriangle(
          this._coords[i],
          this._coords[i + 1],
          this._coords[(i + 2) % numCoords],
          this._coords[(i + 3) % numCoords],
          this._coords[(i + 4) % numCoords],
          this._coords[(i + 5) % numCoords]
        )) {
          return false;
        }
      }
    }
    return true;
  }
  /** Calculates the total area of the polygon. */
  get area() {
    let area = 0;
    let numCoords = this._coords.length;
    if (numCoords >= 6) {
      for (let i = 0; i < numCoords; i += 2) {
        area += this._coords[i] * this._coords[(i + 3) % numCoords];
        area -= this._coords[i + 1] * this._coords[(i + 2) % numCoords];
      }
    }
    return area / 2;
  }
  /** Returns the total number of vertices spawning up the polygon. Assigning a value
   *  that's smaller than the current number of vertices will crop the path; a bigger
   *  value will fill up the path with zeros. */
  get numVertices() {
    return this._coords.length / 2;
  }
  set numVertices(value) {
    let oldLength = this.numVertices;
    this._coords.length = value * 2;
    if (oldLength < value) {
      for (let i = oldLength; i < value; ++i)
        this._coords[i * 2] = this._coords[i * 2 + 1] = 0;
    }
  }
  /** Returns the number of triangles that will be required when triangulating the polygon. */
  get numTriangles() {
    let numVertices = this.numVertices;
    return numVertices >= 3 ? numVertices - 2 : 0;
  }
  get rect() {
    return this._rect;
  }
};

// src/ddls/view/DDLSSimpleView.ts
import { Color, Graphics, Node, UITransform } from "cc";
var DDLSSimpleView = class extends Node {
  constructor(YAxisFlip = true) {
    super();
    /**
     * Y轴反转
     */
    this.yAxisFlip = true;
    this.colorEdges = new Color(255, 255, 255, 255);
    this.colorConstraints = new Color(255, 0, 0, 255);
    this.colorVertices = new Color(0, 0, 255, 255);
    this.colorPaths = new Color(255, 0, 255, 255);
    this.colorEntities = new Color(0, 255, 0, 255);
    this.showVerticesIndices = false;
    this.yAxisFlip = YAxisFlip;
    this.edgesNode = new Node("Edges");
    this.__addUITrans(this.edgesNode);
    this.constraintsNode = new Node("Constraints");
    this.__addUITrans(this.constraintsNode);
    this.verticesNode = new Node("Vertices");
    this.__addUITrans(this.verticesNode);
    this.pathsNode = new Node("Paths");
    this.__addUITrans(this.pathsNode);
    this.entitiesNode = new Node("Entities");
    this.__addUITrans(this.entitiesNode);
    this.edges = this.edgesNode.addComponent(Graphics);
    this.constraints = this.constraintsNode.addComponent(Graphics);
    this.vertices = this.verticesNode.addComponent(Graphics);
    this.paths = this.pathsNode.addComponent(Graphics);
    this.entities = this.entitiesNode.addComponent(Graphics);
    this.addChild(this.edgesNode);
    this.addChild(this.constraintsNode);
    this.addChild(this.verticesNode);
    this.addChild(this.pathsNode);
    this.addChild(this.entitiesNode);
    this.uiTrans = this.__addUITrans(this);
  }
  __addUITrans(node) {
    let trans = node.addComponent(UITransform);
    trans.setAnchorPoint(0, 1);
    return trans;
  }
  reset() {
    this.clear();
  }
  clear() {
    this.edges.clear();
    this.constraints.clear();
    this.vertices.clear();
    this.paths.clear();
    this.entities.clear();
  }
  /**
   * 绘制点
   * @param x 
   * @param y 
   * @param radius
   * @param color
   * @param cleanBefore 
   */
  drawPoint(x, y, radius, color, cleanBefore) {
    if (cleanBefore)
      this.entities.clear();
    this.entities.fillColor = color;
    this.entities.circle(x, y, radius);
    this.entities.fill();
  }
  /**
   * 绘制路径
   * @param path 
   * @param cleanBefore 
   * @returns 
   */
  drawPathByPoints(path, cleanBefore = true) {
    if (cleanBefore) {
      this.paths.clear();
    }
    if (path.length == 0) {
      return;
    }
    this.paths.lineWidth = 5;
    this.paths.strokeColor = this.colorPaths;
    this.paths.moveTo(path[0].x, path[0].y);
    this.paths.circle(path[0].x, path[0].y, 4);
    for (let index = 1; index < path.length; index++) {
      this.paths.lineTo(path[index].x, path[index].y);
      this.paths.circle(path[index].x, path[index].y, 4);
    }
    this.paths.stroke();
    this.paths.fill();
  }
  /**
   * 绘制路径
   * @param path 
   * @param cleanBefore 
   * @returns 
   */
  drawPath(path, cleanBefore = true) {
    if (cleanBefore) {
      this.paths.clear();
    }
    if (path.length == 0) {
      return;
    }
    this.paths.strokeColor = this.colorPaths;
    this.paths.lineWidth = 1.5;
    this.paths.moveTo(path[0], this.getY(path[1]));
    this.paths.circle(path[0], this.getY(path[1]), 4);
    for (let index = 2; index < path.length; index += 2) {
      const x = path[index];
      const y = this.getY(path[index + 1]);
      this.paths.lineTo(x, y);
      this.paths.circle(x, y, 4);
    }
    this.paths.stroke();
  }
  /**
   * 绘制mesh
   * @param mesh 
   * @param graphics_com 
   */
  drawMesh(mesh) {
    this.vertices.clear();
    this.constraints.clear();
    this.edges.clear();
    let vertex;
    let incomingEdge;
    let holdingFace;
    let iterVertices = new IteratorFromMeshToVertices();
    iterVertices.fromMesh = mesh;
    let iterEdges = new IteratorFromVertexToIncomingEdges();
    let dictVerticesDone = /* @__PURE__ */ new Map();
    let constraintsFrist = true;
    let edgesFrist = true;
    while (vertex = iterVertices.next()) {
      dictVerticesDone.set(vertex.id, true);
      if (!this.vertexIsInsideAABB(vertex, mesh)) {
        continue;
      }
      this.vertices.fillColor = this.colorVertices;
      this.vertices.circle(vertex.pos.x, this.getY(vertex.pos.y), 0.5);
      constraintsFrist = edgesFrist = true;
      iterEdges.fromVertex = vertex;
      while (incomingEdge = iterEdges.next()) {
        if (!dictVerticesDone.has(incomingEdge.originVertex.id)) {
          if (incomingEdge.isConstrained) {
            this.constraints.strokeColor = this.colorConstraints;
            this.constraints.lineWidth = 3;
            if (constraintsFrist) {
              constraintsFrist = false;
              this.constraints.moveTo(incomingEdge.destinationVertex.pos.x, this.getY(incomingEdge.destinationVertex.pos.y));
            } else {
              this.constraints.lineTo(incomingEdge.destinationVertex.pos.x, this.getY(incomingEdge.destinationVertex.pos.y));
            }
            this.constraints.lineTo(incomingEdge.originVertex.pos.x, this.getY(incomingEdge.originVertex.pos.y));
          } else {
            this.edges.strokeColor = this.colorEdges;
            this.edges.lineWidth = 2;
            if (edgesFrist) {
              this.edges.moveTo(incomingEdge.destinationVertex.pos.x, this.getY(incomingEdge.destinationVertex.pos.y));
              edgesFrist = false;
            } else {
              this.edges.lineTo(incomingEdge.destinationVertex.pos.x, this.getY(incomingEdge.destinationVertex.pos.y));
            }
            this.edges.lineTo(incomingEdge.originVertex.pos.x, this.getY(incomingEdge.originVertex.pos.y));
          }
        }
      }
    }
    this.vertices.stroke();
    this.constraints.stroke();
    this.edges.stroke();
  }
  vertexIsInsideAABB(vertex, mesh) {
    if (vertex.pos.x < 0 || vertex.pos.x > mesh.width || vertex.pos.y < 0 || vertex.pos.y > mesh.height) {
      return false;
    }
    return true;
  }
  getY(y) {
    return this.yAxisFlip ? 0 - y : y;
  }
};

// src/grids/graphs/GraphNode.ts
var GraphNode = class {
  constructor(id, data) {
    this.id = id;
    this.data = data;
  }
};

// src/grids/graphs/GraphLink.ts
var GraphLink = class {
  constructor(fromId, toId, data, id) {
    this.fromId = fromId;
    this.toId = toId;
    this.data = data;
    this.id = id;
  }
};

// src/grids/graphs/Graph.ts
import { Event, EventDispatcher } from "dream-cc-core";
var Graph = class extends EventDispatcher {
  constructor(options) {
    super();
    this.__options = options;
    this.__nodes = /* @__PURE__ */ new Map();
    this.__links = /* @__PURE__ */ new Map();
    this.__multiEdges = {};
    if (this.__options.multigraph === void 0) {
      this.__options.multigraph = false;
    }
    this.createLink = this.__options.multigraph ? this.__createUniqueLink : this.__createSingleLink;
  }
  addNode(id, data) {
    if (id == void 0) {
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
  getNode(id) {
    return this.__nodes.get(id);
  }
  removeNode(id) {
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
  addLink(fromId, toId, data) {
    let link_id = this.__makeLinkId(fromId, toId);
    if (this.__links.has(link_id)) {
      return this.__links.get(link_id);
    }
    let fromNode = this.getNode(fromId) || this.addNode(fromId);
    let toNode = this.getNode(toId) || this.addNode(toId);
    let link = this.createLink(fromId, toId, data);
    this.__links.set(link_id, link);
    this.addLinkToNode(fromNode, link);
    if (fromId !== toId) {
      this.addLinkToNode(toNode, link);
    }
    this.emit(Event.ADD, link);
    return link;
  }
  getLink(fromId, toId) {
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
  removeLink(link) {
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
  addLinkToNode(node, link) {
    if (node.links) {
      node.links.push(link);
    } else {
      node.links = [link];
    }
  }
  __createUniqueLink(fromId, toId, data) {
    var linkId = this.__makeLinkId(fromId, toId);
    var isMultiEdge = this.__multiEdges.hasOwnProperty(linkId);
    if (isMultiEdge || this.getLink(fromId, toId)) {
      if (!isMultiEdge) {
        this.__multiEdges[linkId] = 0;
      }
      var suffix = "@" + ++this.__multiEdges[linkId];
      linkId = this.__makeLinkId(fromId + suffix, toId + suffix);
    }
    return new GraphLink(fromId, toId, data, linkId);
  }
  __createSingleLink(fromId, toId, data) {
    var linkId = this.__makeLinkId(fromId, toId);
    return new GraphLink(fromId, toId, data, linkId);
  }
  get nodeCount() {
    return this.__nodes.size;
  }
  get linkCount() {
    return this.__links.size;
  }
  /**
   * 获取节点链接
   * @param id 
   * @returns 
   */
  getLinks(id) {
    let node = this.getNode(id);
    return node ? node.links : null;
  }
  clear() {
    while (this.__nodes.size > 0) {
      this.removeNode(this.__nodes.keys().next().value);
    }
    this.__nodes.clear();
    this.__links.clear();
    this.__multiEdges = {};
  }
  forEachNode(callback) {
    if (callback == null || callback == void 0) {
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
  forEachLink(callback) {
    if (callback == null || callback == void 0) {
      return;
    }
    let values_iterator = this.__links.values();
    let next_value = values_iterator.next();
    while (!next_value.done) {
      callback(next_value.value);
      next_value = values_iterator.next();
    }
  }
  forEachLinkedNode(nodeId, callback, oriented) {
    let node = this.getNode(nodeId);
    if (oriented) {
      return this.forEachOrientedLink(node.links, nodeId, callback);
    } else {
      return this.forEachNonOrientedLink(node.links, nodeId, callback);
    }
  }
  forEachNonOrientedLink(links, nodeId, callback) {
    for (let index = 0; index < links.length; index++) {
      const link = links[index];
      const lined_node_id = link.fromId === nodeId ? link.toId : link.fromId;
      const quit_fast = callback(this.getNode(lined_node_id), link);
      if (quit_fast) {
        return true;
      }
    }
  }
  forEachOrientedLink(links, nodeId, callback) {
    for (var i = 0; i < links.length; ++i) {
      const link = links[i];
      if (link.fromId === nodeId) {
        const quitFast = callback(this.getNode(link.toId), link);
        if (quitFast) {
          return true;
        }
      }
    }
  }
  __makeLinkId(fromId, toId) {
    return fromId.toString() + "\u{1F449} " + toId.toString();
  }
};

// src/grids/graphs/GraphOptions.ts
var GraphOptions = class {
};

// src/grids/searchs/NodeSearchState.ts
var NodeSearchState = class {
  constructor(node) {
    this.closed = false;
    this.open = 0;
    this.node = node;
    this.parent = null;
    this.closed = false;
    this.open = 0;
    this.distanceToSource = Number.POSITIVE_INFINITY;
    this.fScore = Number.POSITIVE_INFINITY;
    this.heapIndex = -1;
  }
};

// src/grids/searchs/SearchStatePool.ts
var SearchStatePool = class {
  constructor() {
    this.currentInCache = 0;
    this.nodeCache = [];
  }
  createNewState(node) {
    let cached = this.nodeCache[this.currentInCache];
    if (cached) {
      cached.node = node;
      cached.parent = null;
      cached.closed = false;
      cached.open = 0;
      cached.distanceToSource = Number.POSITIVE_INFINITY;
      cached.fScore = Number.POSITIVE_INFINITY;
      cached.heapIndex = -1;
    } else {
      cached = new NodeSearchState(node);
      this.nodeCache[this.currentInCache] = cached;
    }
    this.currentInCache++;
    return cached;
  }
  reset() {
    this.currentInCache = 0;
  }
};

// src/grids/DefaultSettings.ts
var DefaultSettings = class {
  static get blocked() {
    if (!this.__blocked) {
      return this.defaultBlocked;
    }
    return this.__blocked;
  }
  static set blocked(value) {
    this.__blocked = value;
  }
  static defaultBlocked(a, b, link) {
    return false;
  }
  /**
   * 启发式代价函数
   */
  static get heuristic() {
    if (!this.__heuristic) {
      return this.defaultHeuristic;
    }
    return this.__heuristic;
  }
  static set heuristic(value) {
    this.__heuristic = value;
  }
  static defaultHeuristic(a, b) {
    return 0;
  }
  /**
   * 路径距离函数
   */
  static get distance() {
    if (!this.__distance) {
      return this.defaultDistance;
    }
    return this.__distance;
  }
  static set distance(value) {
    this.__distance = value;
  }
  static defaultDistance(a, b, link) {
    return 1;
  }
  /**
   * 比较fScore
   */
  static get compareFScore() {
    if (!this.__compareFScore) {
      return this.defaultCompareFScore;
    }
    return this.__compareFScore;
  }
  static set compareFScore(value) {
    this.__compareFScore = value;
  }
  static defaultCompareFScore(a, b) {
    return a.fScore - b.fScore;
  }
  static get setHeapIndex() {
    if (!this.__setHeapIndex) {
      return this.defaultSetHeapIndex;
    }
    return this.__setHeapIndex;
  }
  static set setHeapIndex(value) {
    this.__setHeapIndex = value;
  }
  static defaultSetHeapIndex(state, heapIndex) {
    state.heapIndex = heapIndex;
  }
};

// src/grids/NodeHeap.ts
var NodeHeap = class {
  constructor(options) {
    this.__data = [];
    this.__length = 0;
    this.__data = [];
    this.__length = this.__data.length;
    this.compare = options.compare || this.__defaultCompare;
    this.setNodeId = options.setNodeId;
    if (this.__length > 0) {
      for (let index = this.__length >> 1; index >= 0; index--) {
        this._down(index);
      }
    }
    if (options.setNodeId) {
      for (let index = 0; index < this.__length; index++) {
        this.setNodeId(this.__data[index], index);
      }
    }
  }
  push(item) {
    this.__data.push(item);
    this.setNodeId(item, this.__length);
    this.__length++;
    this._up(this.__length - 1);
  }
  pop() {
    if (this.__length == 0) return void 0;
    let top = this.__data[0];
    this.__length--;
    if (this.__length > 0) {
      this.__data[0] = this.__data[this.__length];
      this.setNodeId(this.__data[0], 0);
      this._down(0);
    }
    this.__data.pop();
    return top;
  }
  updateItem(pos) {
    this._down(pos);
    this._up(pos);
  }
  peek() {
    return this.__data[0];
  }
  _up(pos) {
    let item = this.__data[pos];
    while (pos > 0) {
      let parent = pos - 1 >> 1;
      let current = this.__data[parent];
      if (this.compare(item, current) >= 0) {
        break;
      }
      this.__data[pos] = current;
      this.setNodeId(current, pos);
      pos = parent;
    }
    this.__data[pos] = item;
    this.setNodeId(item, pos);
  }
  _down(pos) {
    let item = this.__data[pos];
    let halfLength = this.__length >> 1;
    while (pos < halfLength) {
      let left = (pos << 1) + 1;
      let right = left + 1;
      let best = this.__data[left];
      if (right < this.__length && this.compare(this.__data[right], best) < 0) {
        left = right;
        best = this.__data[right];
      }
      if (this.compare(best, item) > 0) {
        break;
      }
      this.__data[pos] = best;
      this.setNodeId(best, pos);
      pos = left;
    }
    this.__data[pos] = item;
    this.setNodeId(item, pos);
  }
  get length() {
    return this.__length;
  }
  __defaultCompare(a, b) {
    return a.fScore - b.fScore;
  }
};

// src/grids/AStar.ts
var AStar = class {
  constructor(graph, options) {
    this.__oriented = false;
    this.__oriented = options.oriented || false;
    this.__blocked = options.blocked || DefaultSettings.blocked;
    this.__heuristic = options.heuristic || DefaultSettings.heuristic;
    this.__distance = options.distance || DefaultSettings.distance;
    this.__graph = graph;
    this.__searchPool = new SearchStatePool();
    this.__nodeState = /* @__PURE__ */ new Map();
    this.__openSet = new NodeHeap({
      setNodeId: DefaultSettings.setHeapIndex,
      compare: DefaultSettings.compareFScore
    });
  }
  find(fromId, toId) {
    let from = this.__graph.getNode(fromId);
    if (!from) throw new Error("fromId is not defined in this graph: " + fromId);
    let to = this.__graph.getNode(toId);
    if (!to) throw new Error("toId is not defined in this graph: " + toId);
    this.__searchPool.reset();
    let startNode = this.__searchPool.createNewState(from);
    this.__nodeState.set(from.id, startNode);
    startNode.fScore = this.__heuristic(from, to);
    startNode.distanceToSource = 0;
    this.__openSet.push(startNode);
    startNode.open = 1;
    let cameFrom;
    let self = this;
    let visitNeighbour = function(otherNode, link) {
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
    };
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
  goalReached(searchState, targetNode) {
    return searchState.node === targetNode;
  }
  reconstructPath(searchState) {
    let path = [searchState.node];
    let parent = searchState.parent;
    while (parent) {
      path.push(parent.node);
      parent = parent.parent;
    }
    return path;
  }
};
export {
  AStar,
  DDLSAStar,
  DDLSConstants,
  DDLSConstraintSegment,
  DDLSConstraintShape,
  DDLSEdge,
  DDLSEntityAI,
  DDLSFace,
  DDLSFunnel,
  DDLSGeom2D,
  DDLSGraph,
  DDLSGraphEdge,
  DDLSGraphNode,
  DDLSMatrix2D,
  DDLSMesh,
  DDLSObject,
  DDLSPathFinder,
  DDLSPoint2D,
  DDLSRandGenerator,
  DDLSRectMeshFactory,
  DDLSSimpleView,
  DDLSUtils,
  DDLSVertex,
  DefaultSettings,
  Graph,
  GraphLink,
  GraphNode,
  GraphOptions,
  IteratorFromFaceToInnerEdges,
  IteratorFromMeshToVertices,
  IteratorFromVertexToHoldingFaces,
  IteratorFromVertexToIncomingEdges,
  IteratorFromVertexToOutgoingEdges,
  NodeHeap,
  NodeSearchState,
  Polygon,
  SearchStatePool
};
//# sourceMappingURL=dream-cc-pathfinding.mjs.map
