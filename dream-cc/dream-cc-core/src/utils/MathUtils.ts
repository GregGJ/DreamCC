

export class MathUtils {

    static readonly ZeroTolerance: number = 1e-3;
    static readonly Angle90: number = Math.PI * 0.5;
    static readonly Rad2Angle: number = 180 / Math.PI;
    static readonly Angle2Rad: number = Math.PI / 180;

    /**
     * 检测是否相等
     * @param a
     * @param b
     * @returns true 相等 false不相等
     */
    static equals(a: number, b: number): boolean {
        return Math.abs(a - b) <= MathUtils.ZeroTolerance;
    }

    /**
     * 强制取整，去掉小数点后的数字
     * @param v 
     * @returns 
     */
    static int(v: number): number {
        return parseInt(v.toString(), 10);
    }

    /**
     * 求2条线段之间的交点
     * @param a 
     * @param b 
     * @param c 
     * @param d 
     * @param result 
     * @returns 
     */
    static getIntersectionPoint(a: { x: number, y: number }, b: { x: number, y: number }, c: { x: number, y: number }, d: { x: number, y: number }, result?: { x: number, y: number }): { x: number, y: number } | null {
        result = result || { x: 0, y: 0 };
        // 三角形abc 面积的2倍  
        var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);

        // 三角形abd 面积的2倍  
        var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);  
        if (area_abc * area_abd >= 0) {
            return null;
        }

        // 三角形cda 面积的2倍  
        var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
        // 三角形cdb 面积的2倍  
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.  
        var area_cdb = area_cda + area_abc - area_abd;
        if (area_cda * area_cdb >= 0) {
            return null;
        }

        //计算交点坐标  
        var t = area_cda / (area_abd - area_abc);
        var dx = t * (b.x - a.x),
            dy = t * (b.y - a.y);
        result.x = a.x + dx;
        result.y = a.y + dy;
        return result;
    }

    /**
     * 点到线段的垂点
     * @param px 
     * @param py 
     * @param sx 
     * @param sy 
     * @param ex 
     * @param ey 
     */
    static getPerpendicularPoint(px: number, py: number, sx: number, sy: number, ex: number, ey: number, result?: { x: number, y: number }): { x: number, y: number } {
        result = result || { x: 0, y: 0 };
        let dx = ex - sx;
        let dy = ey - sy;

        let k = (ex - sx) * (px - sx) + (ey - sy) * (py - sy);
        k /= dx * dx + dy * dy;
        if (k >= 0 && k <= 1) {
            result.x = sx + k * dx;
            result.y = sy + k * dy;
            return result;
        }
        return null;
    }

    /**
     * 点到线段的距离 
     * @param P3
     * @param PA
     * @param PB
     * @return 
     */
    static getNearestDistance(target: { x: number, y: number }, pa: { x: number, y: number }, pb: { x: number, y: number }): number {
        let targetPoint = { x: 0, y: 0 };
        let aPoint = { x: 0, y: 0 };
        let bPoint = { x: 0, y: 0 };

        targetPoint.x = target.x;
        targetPoint.y = target.y;
        aPoint.x = pa.x;
        aPoint.y = pa.y;
        bPoint.x = pb.x;
        bPoint.y = pb.y;

        var a: number, b: number, c: number;
        a = this.distance(bPoint.x, bPoint.y, targetPoint.x, targetPoint.y);
        if (a <= 0.00001)
            return 0;
        b = this.distance(aPoint.x, aPoint.y, targetPoint.x, targetPoint.y);
        if (b <= 0.00001)
            return 0;
        c = this.distance(aPoint.x, aPoint.y, bPoint.x, bPoint.y);
        if (c <= 0.00001)
            return a;//如果PA和PB坐标相同，则退出函数，并返回距离   
        //------------------------------   


        if (a * a >= b * b + c * c)//--------图3--------   
            return b;
        if (b * b >= a * a + c * c)//--------图4-------   
            return a;

        //图1   
        var l: number = (a + b + c) / 2;     //周长的一半   
        var s: number = Math.sqrt(l * (l - a) * (l - b) * (l - c));  //海伦公式求面积
        return 2 * s / c;
    }

    /**
     * 向量点乘
     * @param ax 
     * @param ay 
     * @param bx 
     * @param by 
     * @returns   0 互相垂直 >0 向量夹角小于90度 <0向量夹角大于90度
     */
    static vectorDot(ax: number, ay: number, bx: number, by: number): number {
        return ax * bx + ay * by;
    }

    /**
     * 向量叉乘
     * @param a 
     * @param b 
     * @param out 
     */
    static vectorCross(ax: number, ay: number, bx: number, by: number): number {
        return ax * by - ay * bx;
    }

    /**
     * 求两个向量之间的夹角
     * @param av        单位向量
     * @param bv        单位向量
     */
    static calculateAngle(ax: number, ay: number, bx: number, by: number): number {
        var s = Math.atan2(by - ay, bx - ax);
        s = (180 * s) / Math.PI;
        if (s < 0) {
            s += 360;
        }
        return s;
    }

    /**
    * 求两点之间距离
    * @param ax 
    * @param ay 
    * @param bx 
    * @param by 
    * @returns 
    */
    static distance(ax: number, ay: number, bx: number, by: number): number {
        const x: number = bx - ax;
        const y: number = by - ay;
        return Math.sqrt(x * x + y * y)
    }

    /**
     * 求距离的二次方
     * @param ax 
     * @param ay 
     * @param bx 
     * @param by 
     * @returns 
     */
    static distanceSquared(ax: number, ay: number, bx: number, by: number): number {
        const x: number = bx - ax;
        const y: number = by - ay;
        return x * x + y * y;
    }

    /**
     * 是否包含在圆内
     * @param x 
     * @param y 
     * @param ox 
     * @param oy 
     * @param r 
     * @returns 
     */
    static inTheCircle(x: number, y: number, ox: number, oy: number, r: number): boolean {
        let dis = this.distance(x, y, ox, oy);
        if (dis < r) {
            return true;
        }
        return false;
    }
}