import { v2, Vec2 } from "cc";
import { MathUtils } from "dream-cc-core";
import { Direction8 } from "./Direction8";

export class Direction8Utils {
    /**
     * 八方向角度
     */
    static direction8Angle: Array<number> = [
        80, 100, 20, 80, 350, 20, 280, 350, 260, 280, 190, 260, 160, 190, 100, 160,
    ];

    /**
     * 方向向量
     */
    static directionVecs: Array<Vec2> = [
        v2(1, 0), //右
        v2(0, 1), //下
        v2(0.5, 0.5), //右下
        v2(1, 0), //右
        v2(0.5, -0.5), //右上
        v2(0, -1), //上
        v2(-0.5, -0.5), //左上
        v2(-1, 0), //左
        v2(-0.5, 0.5),
    ];

    /**
     * 根据方向返回方向向量
     * @param dir
     * @returns
     */
    static getDirectionVec(dir: number): Vec2 {
        return this.directionVecs[dir];
    }

    /**
     * 角度转方向
     * @param angle
     */
    static angle2direction(angle: number, direction8Angle?: Array<number>): number {
        var i = Direction8.B_B;
        var d_a = direction8Angle || this.direction8Angle;
        var idx = 0,
            start = 0,
            end = 0;
        for (let index = Direction8.B_B; index <= Direction8.L_B; index++) {
            idx = index + index - 2;
            start = d_a[idx] || 0;
            end = d_a[idx + 1] || 0;
            if (end >= start) {
                if (angle >= start && end > angle) {
                    return (i = index);
                }
            } else if (angle >= start || end > angle) {
                return (i = index);
            }
        }
        return i;
    }

    /**
     * 获取方向
     * @param x
     * @param y
     * @param tx
     * @param ty
     * @returns
     */
    static getDirection(x: number, y: number, tx: number, ty: number): number {
        var n = MathUtils.calculateAngle(x, y, tx, ty);
        return this.angle2direction(n);
    }

    /**
     * 方向反转
     * @param dir
     * @returns
     */
    static reverseDirection(dir: number): number {
        switch (dir) {
            case Direction8.R_R:
                return Direction8.L_L;
            case Direction8.L_L:
                return Direction8.R_R;

            case Direction8.T_T:
                return Direction8.B_B;
            case Direction8.B_B:
                return Direction8.T_T;

            case Direction8.R_T:
                return Direction8.L_B;
            case Direction8.L_B:
                return Direction8.R_T;

            case Direction8.R_B:
                return Direction8.L_T;
            case Direction8.L_T:
                return Direction8.R_B;

            default:
                return Direction8.R_R;
        }
    }

    /**
     * 方向向量(单位向量)转方向枚举
     * @param vector
     * @param epsilon
     * @returns
     */
    static vectorToDirection8(vector: { x: number; y: number }, epsilon: number = 1e-9): Direction8 {
        let x = vector.x;
        let y = vector.y;
        if (x == 0 && y == 0) {
            return Direction8.R_R;
        }
        if (Math.abs(x) < epsilon && y > 0) {
            return Direction8.T_T; // 上
        } else if (x > 0 && Math.abs(y - x) < epsilon) {
            return Direction8.R_T; // 右上
        } else if (Math.abs(y) < epsilon && x > 0) {
            return Direction8.R_R; // 右
        } else if (x > 0 && Math.abs(y + x) < epsilon) {
            return Direction8.R_B; // 右下
        } else if (Math.abs(x) < epsilon && y < 0) {
            return Direction8.B_B; // 下
        } else if (x < 0 && Math.abs(y + x) < epsilon) {
            return Direction8.L_B; // 左下
        } else if (Math.abs(y) < epsilon && x < 0) {
            return Direction8.L_L; // 左
        } else if (x < 0 && Math.abs(y - x) < epsilon) {
            return Direction8.L_T; // 左上
        } else {
            throw new Error("Invalid vector direction");
        }
    }
}
