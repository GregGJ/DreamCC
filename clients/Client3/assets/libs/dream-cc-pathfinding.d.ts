import { Rect, Vec2, Node, UITransform, Color } from 'cc';
import { EventDispatcher } from 'dream-cc-core';

declare class DDLSConstraintShape {
    private static INC;
    private _id;
    private _segments;
    constructor();
    get id(): number;
    get segments(): DDLSConstraintSegment[];
    dispose(): void;
}

declare class DDLSConstraintSegment {
    private static INC;
    private _id;
    private _edges;
    private _fromShape;
    constructor();
    get id(): number;
    get fromShape(): DDLSConstraintShape;
    set fromShape(value: DDLSConstraintShape);
    addEdge(edge: DDLSEdge): void;
    removeEdge(edge: DDLSEdge): void;
    get edges(): DDLSEdge[];
    dispose(): void;
    toString(): string;
}

declare class DDLSFace {
    private static INC;
    private _id;
    private _isReal;
    private _edge;
    colorDebug: number;
    constructor();
    get id(): number;
    get isReal(): boolean;
    setDatas(edge: DDLSEdge, isReal?: boolean): void;
    dispose(): void;
    get edge(): DDLSEdge;
}

declare class DDLSMatrix2D {
    private _a;
    private _b;
    private _c;
    private _d;
    private _e;
    private _f;
    constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number);
    identity(): void;
    translate(tx: number, ty: number): void;
    scale(sx: number, sy: number): void;
    rotate(rad: number): void;
    clone(): DDLSMatrix2D;
    tranform(point: DDLSPoint2D): void;
    transformX(x: number, y: number): number;
    transformY(x: number, y: number): number;
    concat(matrix: DDLSMatrix2D): void;
    get a(): number;
    set a(value: number);
    get b(): number;
    set b(value: number);
    get c(): number;
    set c(value: number);
    get d(): number;
    set d(value: number);
    get e(): number;
    set e(value: number);
    get f(): number;
    set f(value: number);
}

declare class DDLSPoint2D {
    private static INC;
    private _id;
    private _x;
    private _y;
    constructor(x?: number, y?: number);
    get id(): number;
    transform(matrix: DDLSMatrix2D): void;
    setTo(x: number, y: number): void;
    clone(): DDLSPoint2D;
    substract(p: DDLSPoint2D): void;
    get length(): number;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    normalize(): void;
    scale(s: number): void;
    distanceTo(p: DDLSPoint2D): number;
    distanceSquaredTo(p: DDLSPoint2D): number;
}

declare class DDLSVertex {
    private static INC;
    private _id;
    private _pos;
    private _isReal;
    private _edge;
    private _fromConstraintSegments;
    colorDebug: number;
    constructor();
    get id(): number;
    get isReal(): boolean;
    get pos(): DDLSPoint2D;
    get fromConstraintSegments(): DDLSConstraintSegment[];
    set fromConstraintSegments(value: DDLSConstraintSegment[]);
    setDatas(edge: DDLSEdge, isReal?: boolean): void;
    addFromConstraintSegment(segment: DDLSConstraintSegment): void;
    removeFromConstraintSegment(segment: DDLSConstraintSegment): void;
    dispose(): void;
    get edge(): DDLSEdge;
    set edge(value: DDLSEdge);
    toString(): string;
}

declare class DDLSEdge {
    private static INC;
    private _id;
    private _isReal;
    private _isConstrained;
    private _originVertex;
    private _oppositeEdge;
    private _nextLeftEdge;
    private _leftFace;
    private _fromConstraintSegments;
    colorDebug: number;
    constructor();
    get id(): number;
    get isReal(): boolean;
    get isConstrained(): boolean;
    setDatas(originVertex: DDLSVertex, oppositeEdge: DDLSEdge, nextLeftEdge: DDLSEdge, leftFace: DDLSFace, isReal?: boolean, isConstrained?: boolean): void;
    addFromConstraintSegment(segment: DDLSConstraintSegment): void;
    removeFromConstraintSegment(segment: DDLSConstraintSegment): void;
    set originVertex(value: DDLSVertex);
    set nextLeftEdge(value: DDLSEdge);
    set leftFace(value: DDLSFace);
    set isConstrained(value: boolean);
    get fromConstraintSegments(): DDLSConstraintSegment[];
    set fromConstraintSegments(value: DDLSConstraintSegment[]);
    dispose(): void;
    get originVertex(): DDLSVertex;
    get destinationVertex(): DDLSVertex;
    get oppositeEdge(): DDLSEdge;
    get nextLeftEdge(): DDLSEdge;
    get prevLeftEdge(): DDLSEdge;
    get nextRightEdge(): DDLSEdge;
    get prevRightEdge(): DDLSEdge;
    get rotLeftEdge(): DDLSEdge;
    get rotRightEdge(): DDLSEdge;
    get leftFace(): DDLSFace;
    get rightFace(): DDLSFace;
    toString(): string;
}

declare class DDLSObject {
    private static INC;
    private _id;
    private _matrix;
    private _coordinates;
    private _constraintShape;
    private _pivotX;
    private _pivotY;
    private _scaleX;
    private _scaleY;
    private _rotation;
    private _x;
    private _y;
    private _hasChanged;
    constructor();
    get id(): number;
    dispose(): void;
    updateValuesFromMatrix(): void;
    updateMatrixFromValues(): void;
    get pivotX(): number;
    set pivotX(value: number);
    get pivotY(): number;
    set pivotY(value: number);
    get scaleX(): number;
    set scaleX(value: number);
    get scaleY(): number;
    set scaleY(value: number);
    get rotation(): number;
    set rotation(value: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get matrix(): DDLSMatrix2D;
    set matrix(value: DDLSMatrix2D);
    get coordinates(): number[];
    set coordinates(value: number[]);
    get constraintShape(): DDLSConstraintShape;
    set constraintShape(value: DDLSConstraintShape);
    get hasChanged(): boolean;
    set hasChanged(value: boolean);
    get edges(): DDLSEdge[];
}

declare class DDLSMesh {
    private static INC;
    private _id;
    private _width;
    private _height;
    private _clipping;
    private _vertices;
    private _edges;
    private _faces;
    private _constraintShapes;
    private _objects;
    private __centerVertex;
    private __edgesToCheck;
    constructor(width: number, height: number);
    get height(): number;
    get width(): number;
    get clipping(): boolean;
    set clipping(value: boolean);
    get id(): number;
    dispose(): void;
    get __vertices(): DDLSVertex[];
    get __edges(): DDLSEdge[];
    get __faces(): DDLSFace[];
    get __constraintShapes(): DDLSConstraintShape[];
    buildFromRecord(rec: string): void;
    insertObject(object: DDLSObject): void;
    deleteAllObject(): void;
    deleteObject(object: DDLSObject): void;
    private __objectsUpdateInProgress;
    updateObjects(): void;
    insertConstraintShape(coordinates: number[]): DDLSConstraintShape;
    deleteConstraintShape(shape: DDLSConstraintShape): void;
    insertConstraintSegment(x1: number, y1: number, x2: number, y2: number): DDLSConstraintSegment;
    private insertNewConstrainedEdge;
    deleteConstraintSegment(segment: DDLSConstraintSegment): void;
    private check;
    insertVertex(x: number, y: number): DDLSVertex;
    flipEdge(edge: DDLSEdge): DDLSEdge;
    splitEdge(edge: DDLSEdge, x: number, y: number): DDLSVertex;
    splitFace(face: DDLSFace, x: number, y: number): DDLSVertex;
    restoreAsDelaunay(): void;
    deleteVertex(vertex: DDLSVertex): boolean;
    private untriangulate;
    private triangulate;
    debug(): void;
}

declare class DDLSAStar {
    private _mesh;
    private __closedFaces;
    private __sortedOpenedFaces;
    private __openedFaces;
    private __entryEdges;
    private __entryX;
    private __entryY;
    private __scoreF;
    private __scoreG;
    private __scoreH;
    private __predecessor;
    private __iterEdge;
    private _radius;
    private _radiusSquared;
    private _diameter;
    private _diameterSquared;
    constructor();
    dispose(): void;
    get radius(): number;
    set radius(value: number);
    set mesh(value: DDLSMesh);
    private __fromFace;
    private __toFace;
    private __curFace;
    findPath(fromX: number, fromY: number, toX: number, toY: number, resultListFaces: DDLSFace[], resultListEdges: DDLSEdge[]): void;
    private isWalkableByRadius;
}

declare class DDLSEntityAI {
    private static NUM_SEGMENTS;
    private _radius;
    private _radiusSquared;
    private _x;
    private _y;
    private _dirNormX;
    private _dirNormY;
    private _angleFOV;
    private _radiusFOV;
    private _radiusSquaredFOV;
    private _approximateObject;
    constructor();
    buildApproximation(): void;
    get approximateObject(): DDLSObject;
    get radiusFOV(): number;
    set radiusFOV(value: number);
    get angleFOV(): number;
    set angleFOV(value: number);
    get dirNormY(): number;
    set dirNormY(value: number);
    get dirNormX(): number;
    set dirNormX(value: number);
    get y(): number;
    set y(value: number);
    get x(): number;
    set x(value: number);
    get radius(): number;
    get radiusSquared(): number;
    set radius(value: number);
}

declare class DDLSFunnel {
    private _radius;
    private _radiusSquared;
    private _numSamplesCircle;
    private _sampleCircle;
    private _sampleCircleDistanceSquared;
    constructor();
    dispose(): void;
    private _poolPointsSize;
    private _poolPoints;
    private _currPoolPointsIndex;
    private __point;
    getPoint(x?: number, y?: number): DDLSPoint2D;
    getCopyPoint(pointToCopy: DDLSPoint2D): DDLSPoint2D;
    get radius(): number;
    set radius(value: number);
    findPath(fromX: number, fromY: number, toX: number, toY: number, listFaces: Array<DDLSFace>, listEdges: Array<DDLSEdge>, resultPath: Array<{
        x: number;
        y: number;
    }>): void;
    private adjustWithTangents;
    private checkAdjustedPath;
    private smoothAngle;
}

declare class DDLSPathFinder {
    private _mesh;
    private _astar;
    private _funnel;
    private _radius;
    private __listFaces;
    private __listEdges;
    /**
     * 寻路工具
     */
    constructor();
    dispose(): void;
    get mesh(): DDLSMesh;
    set mesh(value: DDLSMesh);
    findPath(startX: number, startY: number, toX: number, toY: number, resultPath: any[], radius?: number): boolean;
}

declare class DDLSGraphNode {
    private static INC;
    private _id;
    private _prev;
    private _next;
    private _outgoingEdge;
    private _successorNodes;
    private _data;
    constructor();
    get id(): number;
    dispose(): void;
    get prev(): DDLSGraphNode;
    set prev(value: DDLSGraphNode);
    get next(): DDLSGraphNode;
    set next(value: DDLSGraphNode);
    get outgoingEdge(): DDLSGraphEdge;
    set outgoingEdge(value: DDLSGraphEdge);
    get successorNodes(): Map<number, DDLSGraphEdge>;
    set successorNodes(value: Map<number, DDLSGraphEdge>);
    get data(): {
        index: number;
        point: DDLSPoint2D;
    };
    set data(value: {
        index: number;
        point: DDLSPoint2D;
    });
}

declare class DDLSGraphEdge {
    private static INC;
    private _id;
    private _prev;
    private _next;
    private _rotPrevEdge;
    private _rotNextEdge;
    private _oppositeEdge;
    private _sourceNode;
    private _destinationNode;
    private _data;
    constructor();
    get id(): number;
    dispose(): void;
    get prev(): DDLSGraphEdge;
    set prev(value: DDLSGraphEdge);
    get next(): DDLSGraphEdge;
    set next(value: DDLSGraphEdge);
    get rotPrevEdge(): DDLSGraphEdge;
    set rotPrevEdge(value: DDLSGraphEdge);
    get rotNextEdge(): DDLSGraphEdge;
    set rotNextEdge(value: DDLSGraphEdge);
    get oppositeEdge(): DDLSGraphEdge;
    set oppositeEdge(value: DDLSGraphEdge);
    get sourceNode(): DDLSGraphNode;
    set sourceNode(value: DDLSGraphNode);
    get destinationNode(): DDLSGraphNode;
    set destinationNode(value: DDLSGraphNode);
    get data(): {
        sumDistancesSquared: number;
        length: number;
        nodesCount: number;
    };
    set data(value: {
        sumDistancesSquared: number;
        length: number;
        nodesCount: number;
    });
}

declare class DDLSGraph {
    private static INC;
    private _id;
    private _node;
    private _edge;
    constructor();
    get id(): number;
    dispose(): void;
    get edge(): DDLSGraphEdge;
    get node(): DDLSGraphNode;
    insertNode(): DDLSGraphNode;
    deleteNode(node: DDLSGraphNode): void;
    insertEdge(fromNode: DDLSGraphNode, toNode: DDLSGraphNode): DDLSGraphEdge;
    deleteEdge(edge: DDLSGraphEdge): void;
}

declare class DDLSGeom2D {
    private static _randGen;
    private static __samples;
    static locatePosition(x: number, y: number, mesh: DDLSMesh): Object;
    /**
     *  圆形是否与任何约束交叉
     * @param x
     * @param y
     * @param radius
     * @param mesh
     * @return
     */
    static isCircleIntersectingAnyConstraint(x: number, y: number, radius: number, mesh: DDLSMesh): boolean;
    static getDirection(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number;
    static getDirection2(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number;
    static getRelativePosition(x: number, y: number, eUp: DDLSEdge): number;
    static getRelativePosition2(x: number, y: number, eUp: DDLSEdge): number;
    static isInFace(x: number, y: number, polygon: DDLSFace): Object;
    static clipSegmentByTriangle(s1x: number, s1y: number, s2x: number, s2y: number, t1x: number, t1y: number, t2x: number, t2y: number, t3x: number, t3y: number, pResult1?: DDLSPoint2D, pResult2?: DDLSPoint2D): boolean;
    static isSegmentIntersectingTriangle(s1x: number, s1y: number, s2x: number, s2y: number, t1x: number, t1y: number, t2x: number, t2y: number, t3x: number, t3y: number): boolean;
    private static __circumcenter;
    static isDelaunay(edge: DDLSEdge): boolean;
    static getCircumcenter(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, result?: DDLSPoint2D): DDLSPoint2D;
    static intersections2segments(s1p1x: number, s1p1y: number, s1p2x: number, s1p2y: number, s2p1x: number, s2p1y: number, s2p2x: number, s2p2y: number, posIntersection?: DDLSPoint2D, paramIntersection?: number[], infiniteLineMode?: boolean): boolean;
    static intersections2edges(edge1: DDLSEdge, edge2: DDLSEdge, posIntersection?: DDLSPoint2D, paramIntersection?: number[], infiniteLineMode?: boolean): boolean;
    static isConvex(edge: DDLSEdge): boolean;
    static projectOrthogonaly(vertexPos: DDLSPoint2D, edge: DDLSEdge): void;
    static projectOrthogonalyOnSegment(px: number, py: number, sp1x: number, sp1y: number, sp2x: number, sp2y: number, result: DDLSPoint2D): void;
    static intersections2Circles(cx1: number, cy1: number, r1: number, cx2: number, cy2: number, r2: number, result?: number[]): boolean;
    static intersectionsSegmentCircle(p0x: number, p0y: number, p1x: number, p1y: number, cx: number, cy: number, r: number, result?: number[]): boolean;
    static intersectionsLineCircle(p0x: number, p0y: number, p1x: number, p1y: number, cx: number, cy: number, r: number, result: number[]): boolean;
    static tangentsPointToCircle(px: number, py: number, cx: number, cy: number, r: number, result: number[]): void;
    static tangentsCrossCircleToCircle(r: number, c1x: number, c1y: number, c2x: number, c2y: number, result: number[]): boolean;
    static tangentsParalCircleToCircle(r: number, c1x: number, c1y: number, c2x: number, c2y: number, result: number[]): void;
    static distanceSquaredPointToLine(px: number, py: number, ax: number, ay: number, bx: number, by: number): number;
    static distanceSquaredPointToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number;
    static distanceSquaredVertexToEdge(vertex: DDLSVertex, edge: DDLSEdge): number;
    static pathLength(path: number[]): number;
}

declare class DDLSRandGenerator {
    private _originalSeed;
    private _currSeed;
    private _rangeMin;
    private _rangeMax;
    private _numIter;
    private _tempString;
    constructor(seed?: number, rangeMin?: number, rangeMax?: number);
    set seed(value: number);
    set rangeMin(value: number);
    set rangeMax(value: number);
    get seed(): number;
    get rangeMin(): number;
    get rangeMax(): number;
    reset(): void;
    next(): number;
}

declare class DDLSConstants {
    static EPSILON: number;
    static EPSILON_SQUARED: number;
}

declare class DDLSRectMeshFactory {
    static buildRectangle(width: number, height: number): DDLSMesh;
}

declare class IteratorFromFaceToInnerEdges {
    private _fromFace;
    private _nextEdge;
    constructor();
    set fromFace(value: DDLSFace);
    private _resultEdge;
    next(): DDLSEdge;
}

declare class IteratorFromMeshToVertices {
    private _fromMesh;
    private _currIndex;
    constructor();
    set fromMesh(value: DDLSMesh);
    private _resultVertex;
    next(): DDLSVertex;
}

declare class IteratorFromVertexToHoldingFaces {
    private _fromVertex;
    private _nextEdge;
    constructor();
    set fromVertex(value: DDLSVertex);
    private _resultFace;
    next(): DDLSFace;
}

declare class IteratorFromVertexToIncomingEdges {
    private _fromVertex;
    private _nextEdge;
    constructor();
    set fromVertex(value: DDLSVertex);
    private _resultEdge;
    next(): DDLSEdge;
}

declare class IteratorFromVertexToOutgoingEdges {
    private _fromVertex;
    private _nextEdge;
    realEdgesOnly: boolean;
    constructor();
    set fromVertex(value: DDLSVertex);
    private _resultEdge;
    next(): DDLSEdge;
}

declare class DDLSUtils {
    private static checkedEdges;
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
    static calculatePos(mesh: DDLSMesh, role_x: number, role_y: number, targetX: number, targetY: number, radius: number, result?: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
    /**
     * 检测是否发生碰撞并返回碰撞的边缘对象
     */
    static isCircleIntersectingAnyConstraint(x: number, y: number, radius: number, mesh: DDLSMesh, result?: Array<DDLSEdge>): Array<DDLSEdge>;
    /**
     * 路径格式化
     * @param path
     * @param result
     * @param checkDup   是否去重
     */
    static pathFormatting(path: Array<number>, result: Array<number>, checkDup?: boolean): void;
}

/** A polygon describes a closed two-dimensional shape bounded by a number of straight
 *  line segments.
 *
 *  <p>The vertices of a polygon form a closed path (i.e. the last vertex will be connected
 *  to the first). It is recommended to provide the vertices in clockwise order.
 *  Self-intersecting paths are not supported and will give wrong results on triangulation,
 *  area calculation, etc.</p>
 */
declare class Polygon {
    _coords: Array<number>;
    _rect: Rect;
    /** Creates a Polygon with the given coordinates.
     *  @param vertices an array that contains either 'Point' instances or
     *                  alternating 'x' and 'y' coordinates.
     */
    constructor(vertices?: Array<number>);
    /** Creates a clone of this polygon. */
    clone(): Polygon;
    /** Reverses the order of the vertices. Note that some methods of the Polygon class
     *  require the vertices in clockwise order. */
    reverse(): void;
    /** Adds vertices to the polygon. Pass either a list of 'Point' instances or alternating
     *  'x' and 'y' coordinates. */
    addVertices(...args: Array<number | {
        x: number;
        y: number;
    }>): void;
    /** Moves a given vertex to a certain position or adds a new vertex at the end. */
    setVertex(index: number, x: number, y: number): void;
    /** Returns the coordinates of a certain vertex. */
    getVertex(index: number, out?: Vec2): Vec2;
    /** Figures out if the given coordinates lie within the polygon. */
    contains(x: number, y: number): Boolean;
    /** Figures out if the given point lies within the polygon. */
    containsPoint(point: {
        x: number;
        y: number;
    }): Boolean;
    /** Creates a string that contains the values of all included points. */
    toString(): string;
    /** Calculates if the area of the triangle a->b->c is to on the right-hand side of a->b. */
    private static isConvexTriangle;
    /** Finds out if the vector a->b intersects c->d. */
    private static areVectorsIntersecting;
    /** Indicates if the polygon's line segments are not self-intersecting.
     *  Beware: this is a brute-force implementation with <code>O(n^2)</code>. */
    get isSimple(): Boolean;
    /** Indicates if the polygon is convex. In a convex polygon, the vector between any two
     *  points inside the polygon lies inside it, as well. */
    get isConvex(): Boolean;
    /** Calculates the total area of the polygon. */
    get area(): number;
    /** Returns the total number of vertices spawning up the polygon. Assigning a value
     *  that's smaller than the current number of vertices will crop the path; a bigger
     *  value will fill up the path with zeros. */
    get numVertices(): number;
    set numVertices(value: number);
    /** Returns the number of triangles that will be required when triangulating the polygon. */
    get numTriangles(): number;
    get rect(): Rect;
}

declare class DDLSSimpleView extends Node {
    /**
     * Y轴反转
     */
    yAxisFlip: boolean;
    uiTrans: UITransform;
    colorEdges: Color;
    colorConstraints: Color;
    colorVertices: Color;
    colorPaths: Color;
    colorEntities: Color;
    private edgesNode;
    private constraintsNode;
    private verticesNode;
    private pathsNode;
    private entitiesNode;
    private edges;
    private constraints;
    private vertices;
    private paths;
    private entities;
    private showVerticesIndices;
    constructor(YAxisFlip?: boolean);
    private __addUITrans;
    reset(): void;
    clear(): void;
    /**
     * 绘制点
     * @param x
     * @param y
     * @param radius
     * @param color
     * @param cleanBefore
     */
    drawPoint(x: number, y: number, radius: number, color: Color, cleanBefore?: boolean): void;
    /**
     * 绘制路径
     * @param path
     * @param cleanBefore
     * @returns
     */
    drawPathByPoints(path: Array<{
        x: number;
        y: number;
    }>, cleanBefore?: boolean): void;
    /**
     * 绘制路径
     * @param path
     * @param cleanBefore
     * @returns
     */
    drawPath(path: Array<number>, cleanBefore?: boolean): void;
    /**
     * 绘制mesh
     * @param mesh
     * @param graphics_com
     */
    drawMesh(mesh: DDLSMesh): void;
    private vertexIsInsideAABB;
    private getY;
}

declare class GraphLink {
    fromId: string;
    toId: string;
    id: string;
    data: any;
    constructor(fromId: string, toId: string, data: any, id: string);
}

declare class GraphNode {
    id: string;
    links: Array<GraphLink>;
    data: any;
    constructor(id: string, data: any);
}

declare class GraphOptions {
    multigraph: boolean;
}

/**
 *
 */
declare class Graph extends EventDispatcher {
    private __options;
    private __nodes;
    private __links;
    private __multiEdges;
    private createLink;
    constructor(options: GraphOptions);
    addNode(id: string, data?: any): GraphNode;
    getNode(id: string): GraphNode;
    removeNode(id: string): boolean;
    addLink(fromId: string, toId: string, data: any): GraphLink;
    getLink(fromId: string, toId: string): GraphLink;
    removeLink(link: GraphLink): boolean;
    private addLinkToNode;
    private __createUniqueLink;
    private __createSingleLink;
    get nodeCount(): number;
    get linkCount(): number;
    /**
     * 获取节点链接
     * @param id
     * @returns
     */
    getLinks(id: string): Array<GraphLink>;
    clear(): void;
    forEachNode(callback: (node: GraphNode) => boolean): boolean;
    forEachLink(callback: (link: GraphLink) => boolean): void;
    forEachLinkedNode(nodeId: string, callback: (node: GraphNode, link: GraphLink) => boolean, oriented: boolean): boolean;
    forEachNonOrientedLink(links: Array<GraphLink>, nodeId: string, callback: (node: GraphNode, link: GraphLink) => boolean): boolean;
    forEachOrientedLink(links: Array<GraphLink>, nodeId: string, callback: (node: GraphNode, link: GraphLink) => boolean): boolean;
    private __makeLinkId;
}

interface INodeSearchState {
    node: GraphNode;
    parent: INodeSearchState;
    closed: boolean;
    open: number;
    distanceToSource: number;
    fScore: number;
    heapIndex: number;
}

interface ISearchStatePool {
    /**
     * 创建
     * @param node
     */
    createNewState(node: GraphNode): INodeSearchState;
    /**
     * 重置
     */
    reset(): void;
}

declare class NodeSearchState implements INodeSearchState {
    node: GraphNode;
    parent: NodeSearchState;
    closed: boolean;
    open: number;
    distanceToSource: number;
    fScore: number;
    heapIndex: number;
    constructor(node: GraphNode);
}

declare class SearchStatePool {
    currentInCache: number;
    nodeCache: INodeSearchState[];
    createNewState(node: GraphNode): NodeSearchState;
    reset(): void;
}

declare class IAStarOptions {
    oriented?: boolean;
    blocked?: (a: GraphNode, b: GraphNode, link: GraphLink) => boolean;
    heuristic?: (a: GraphNode, b: GraphNode) => number;
    distance?: (a: GraphNode, b: GraphNode, link: GraphLink) => number;
}
/**
 * A* 算法
 */
declare class AStar {
    private __graph;
    private __searchPool;
    private __nodeState;
    private __openSet;
    private __oriented;
    private __blocked;
    private __heuristic;
    private __distance;
    constructor(graph: Graph, options: IAStarOptions);
    find(fromId: string, toId: string): Array<GraphNode> | null;
    private goalReached;
    private reconstructPath;
}

declare class DefaultSettings {
    /**
    * 是否阻塞
    */
    static __blocked: (a: GraphNode, b: GraphNode, link: GraphLink) => boolean;
    static get blocked(): (a: GraphNode, b: GraphNode, link: GraphLink) => boolean;
    static set blocked(value: (a: GraphNode, b: GraphNode, link: GraphLink) => boolean);
    private static defaultBlocked;
    static __heuristic: (a: GraphNode, b: GraphNode) => number;
    /**
     * 启发式代价函数
     */
    static get heuristic(): (a: GraphNode, b: GraphNode) => number;
    static set heuristic(value: (a: GraphNode, b: GraphNode) => number);
    private static defaultHeuristic;
    static __distance: (a: GraphNode, b: GraphNode, link: GraphLink) => number;
    /**
     * 路径距离函数
     */
    static get distance(): (a: GraphNode, b: GraphNode, link: GraphLink) => number;
    static set distance(value: (a: GraphNode, b: GraphNode, link: GraphLink) => number);
    private static defaultDistance;
    static __compareFScore: (a: NodeSearchState, b: NodeSearchState) => number;
    /**
     * 比较fScore
     */
    static get compareFScore(): (a: NodeSearchState, b: NodeSearchState) => number;
    static set compareFScore(value: (a: NodeSearchState, b: NodeSearchState) => number);
    private static defaultCompareFScore;
    static __setHeapIndex: (state: NodeSearchState, heapIndex: number) => void;
    static get setHeapIndex(): (state: NodeSearchState, heapIndex: number) => void;
    static set setHeapIndex(value: (state: NodeSearchState, heapIndex: number) => void);
    private static defaultSetHeapIndex;
}

interface INodeHeapOptions {
    setNodeId: (item: INodeSearchState, index: number) => void;
    compare?: (a: INodeSearchState, b: INodeSearchState) => number;
}
declare class NodeHeap {
    private __data;
    private __length;
    compare: (a: INodeSearchState, b: INodeSearchState) => number;
    setNodeId: (item: INodeSearchState, index: number) => void;
    constructor(options?: INodeHeapOptions);
    push(item: INodeSearchState): void;
    pop(): INodeSearchState | undefined;
    updateItem(pos: number): void;
    peek(): INodeSearchState | undefined;
    _up(pos: number): void;
    _down(pos: number): void;
    get length(): number;
    private __defaultCompare;
}

export { AStar, DDLSAStar, DDLSConstants, DDLSConstraintSegment, DDLSConstraintShape, DDLSEdge, DDLSEntityAI, DDLSFace, DDLSFunnel, DDLSGeom2D, DDLSGraph, DDLSGraphEdge, DDLSGraphNode, DDLSMatrix2D, DDLSMesh, DDLSObject, DDLSPathFinder, DDLSPoint2D, DDLSRandGenerator, DDLSRectMeshFactory, DDLSSimpleView, DDLSUtils, DDLSVertex, DefaultSettings, Graph, GraphLink, GraphNode, GraphOptions, INodeSearchState, ISearchStatePool, IteratorFromFaceToInnerEdges, IteratorFromMeshToVertices, IteratorFromVertexToHoldingFaces, IteratorFromVertexToIncomingEdges, IteratorFromVertexToOutgoingEdges, NodeHeap, NodeSearchState, Polygon, SearchStatePool };
