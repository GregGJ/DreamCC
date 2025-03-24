import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSVertex } from "../data/DDLSVertex";
import { DDLSGeom2D } from "../data/math/DDLSGeom2D";
import { DDLSPoint2D } from "../data/math/DDLSPoint2D";
import { Vec2 } from "cc";


export class DDLSUtils {

    private static checkedEdges: Map<number, boolean> = new Map<number, boolean>();

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
    static calculatePos(mesh: DDLSMesh, role_x: number, role_y: number, targetX: number, targetY: number, radius: number, result?: { x: number, y: number }): { x: number, y: number } {
        result = result || { x: 0, y: 0 };
        radius = radius || 1;
        const vector = new Vec2();
        vector.set(targetX - role_x, targetY - role_y);
        let len = vector.length();
        let count = Math.ceil(len / radius) || 1;
        let tx: number = role_x;
        let ty: number = role_y;
        //每次移动半径距离进行测试,检测两点之间是否有阻挡
        let isblock: boolean = false;
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
    static isCircleIntersectingAnyConstraint(x: number, y: number, radius: number, mesh: DDLSMesh, result?: Array<DDLSEdge>): Array<DDLSEdge> {
        result = result || [];
        result.length = 0;
        if (x <= 0 || x >= mesh.width || y <= 0 || y >= mesh.height)
            return null;

        let loc: Object = DDLSGeom2D.locatePosition(x, y, mesh);
        let face: DDLSFace;
        if (loc instanceof DDLSVertex)
            face = (loc as DDLSVertex).edge.leftFace;
        else if (loc instanceof DDLSEdge)
            face = (loc as DDLSEdge).leftFace;
        else
            face = loc as DDLSFace;

        // check if edge intersects
        let edgesToCheck: Array<DDLSEdge> = new Array<DDLSEdge>();
        edgesToCheck.push(face.edge);
        edgesToCheck.push(face.edge.nextLeftEdge);
        edgesToCheck.push(face.edge.nextLeftEdge.nextLeftEdge);

        //clear
        DDLSUtils.checkedEdges.clear();

        let edge: DDLSEdge;
        let pos1: DDLSPoint2D;
        let pos2: DDLSPoint2D;
        let intersecting: boolean;
        while (edgesToCheck.length > 0) {
            edge = edgesToCheck.pop();
            DDLSUtils.checkedEdges.set(edge.id, true);
            pos1 = edge.originVertex.pos;
            pos2 = edge.destinationVertex.pos;
            intersecting = DDLSGeom2D.intersectionsSegmentCircle(pos1.x, pos1.y, pos2.x, pos2.y, x, y, radius);
            if (intersecting) {
                if (edge.isConstrained)
                    result.push(edge);
                else {
                    edge = edge.oppositeEdge.nextLeftEdge;
                    if (!DDLSUtils.checkedEdges.has(edge.id) && !DDLSUtils.checkedEdges.has(edge.oppositeEdge.id)
                        && edgesToCheck.indexOf(edge) == -1 && edgesToCheck.indexOf(edge.oppositeEdge) == -1) {
                        edgesToCheck.push(edge);
                    }
                    edge = edge.nextLeftEdge;
                    if (!DDLSUtils.checkedEdges.has(edge.id) && !DDLSUtils.checkedEdges.has(edge.oppositeEdge.id)
                        && edgesToCheck.indexOf(edge) == -1 && edgesToCheck.indexOf(edge.oppositeEdge) == -1) {
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
    static pathFormatting(path: Array<number>, result: Array<number>, checkDup: boolean = false): void {
        if (checkDup) {
            let cache: any = {};
            let key: string;
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
}