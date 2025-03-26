import { Color, Graphics, Node, UITransform } from "cc";
import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSVertex } from "../data/DDLSVertex";
import { IteratorFromMeshToVertices } from "../iterators/IteratorFromMeshToVertices";
import { IteratorFromVertexToIncomingEdges } from "../iterators/IteratorFromVertexToIncomingEdges";



export class DDLSSimpleView extends Node {
    /**
     * Y轴反转
     */
    yAxisFlip: boolean = true;

    uiTrans: UITransform;

    colorEdges: Color = new Color(255, 255, 255, 255);
    colorConstraints: Color = new Color(255, 0, 0, 255);
    colorVertices: Color = new Color(0, 0, 255, 255);
    colorPaths: Color = new Color(255, 0, 255, 255);
    colorEntities: Color = new Color(0, 255, 0, 255);

    private edgesNode: Node;
    private constraintsNode: Node;
    private verticesNode: Node;
    private pathsNode: Node;
    private entitiesNode: Node;

    private edges: Graphics;
    private constraints: Graphics;
    private vertices: Graphics;
    private paths: Graphics;
    private entities: Graphics;
    private showVerticesIndices: boolean = false;


    constructor(YAxisFlip: boolean = true) {
        super();
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

    private __addUITrans(node: Node): UITransform {
        let trans = node.addComponent(UITransform);
        trans.setAnchorPoint(0, 1);
        return trans;
    }

    reset(): void {
        this.clear();
    }

    clear(): void {
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
    drawPoint(x: number, y: number, radius: number, color: Color, cleanBefore?: boolean): void {
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
    drawPathByPoints(path: Array<{ x: number, y: number }>, cleanBefore: boolean = true): void {
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
    drawPath(path: Array<number>, cleanBefore: boolean = true): void {
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
    drawMesh(mesh: DDLSMesh): void {
        this.vertices.clear();
        this.constraints.clear();
        this.edges.clear();

        let vertex: DDLSVertex;
        let incomingEdge: DDLSEdge;
        let holdingFace: DDLSFace;

        let iterVertices = new IteratorFromMeshToVertices();
        iterVertices.fromMesh = mesh;
        //
        let iterEdges = new IteratorFromVertexToIncomingEdges();
        let dictVerticesDone = new Map<number, boolean>();
        //
        let constraintsFrist: boolean = true;
        let edgesFrist: boolean = true;
        while (vertex = iterVertices.next()) {
            dictVerticesDone.set(vertex.id, true);
            if (!this.vertexIsInsideAABB(vertex, mesh)) {
                continue;
            }
            this.vertices.fillColor = this.colorVertices;
            this.vertices.circle(vertex.pos.x, this.getY(vertex.pos.y), 0.5);

            // vertices.graphics.beginFill(this.colorVertices, 1);
            // vertices.graphics.drawCircle(vertex.pos.x, vertex.pos.y, 0.5);
            // vertices.graphics.endFill();

            // if (this.showVerticesIndices) {
            //     var tf: egret.TextField = new egret.TextField();
            //     tf.touchEnabled = false;
            //     tf.text = String(vertex.id);
            //     tf.x = vertex.pos.x + 5;
            //     tf.y = vertex.pos.y + 5;
            //     tf.width = tf.height = 20;
            //     this.vertices.addChild(tf);
            // }

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
                    }
                    else {
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

    private vertexIsInsideAABB(vertex: DDLSVertex, mesh: DDLSMesh): boolean {
        if (vertex.pos.x < 0 || vertex.pos.x > mesh.width || vertex.pos.y < 0 || vertex.pos.y > mesh.height) {
            return false;
        }
        return true;
    }

    private getY(y: number): number {
        return this.yAxisFlip ? 0 - y : y;
    }
}