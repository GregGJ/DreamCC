import { Quat, Vec3 } from "cc";
import { ECSComponent } from "../core/ECSComponent";


/**
 * 变换组件
 */
export class TransformComponent extends ECSComponent {

    /**
     * 是否翻转Y轴
     */
    static YAxisFlip: boolean = true;

    private __position: Vec3;
    private __rotation: Quat;
    private __angle: Vec3;
    private __scale: Vec3;
    private __direction: Vec3;

    constructor() {
        super();
        this.__position = new Vec3();
        this.__rotation = new Quat();
        this.__angle = new Vec3();
        this.__scale = new Vec3(1, 1, 1);
        //默认朝向z轴
        this.__direction = new Vec3(1, 0, 0);
    }

    /**
     * 设置朝向
     * @param x 
     * @param y 
     * @param z 
     */
    setDirection(x?: number, y?: number, z?: number): void {
        let changed: boolean = false;
        if (x != undefined && this.__direction.x != x) {
            this.__direction.x = x;
            changed = true;
        }
        if (y != undefined && this.__direction.y != y) {
            this.__direction.y = y;
            changed = true;
        }
        if (z != undefined && this.__direction.z != z) {
            this.__direction.z = z;
            changed = true;
        }
        if (changed) {
            this.markDirtied();
        }
    }

    get direction(): Vec3 {
        return this.__direction;
    }

    setPosition(x?: number, y?: number, z?: number): void {
        let changed: boolean = false;
        if (x != undefined && this.__position.x != x) {
            this.__position.x = x;
            changed = true;
        }
        if (y != undefined && this.__position.y != y) {
            this.__position.y = y;
            changed = true;
        }
        if (z != undefined && this.__position.z != z) {
            this.__position.z = z;
            changed = true;
        }
        if (changed) {
            this.markDirtied();
        }
    }

    get x(): number {
        return this.__position.x;
    }

    set x(v: number) {
        if (this.__position.x == v) return;
        this.__position.x = v;
        this.markDirtied();
    }

    get y(): number {
        return this.__position.y;
    }

    set y(v: number) {
        if (this.__position.y == v) return;
        this.__position.y = v;
        this.markDirtied();
    }

    get z(): number {
        return this.__position.z;
    }

    set z(v: number) {
        if (this.__position.z == v) return;
        this.__position.z = v;
        this.markDirtied();
    }

    get position(): Vec3 {
        return this.__position;
    }

    set position(v: Vec3) {
        if (this.__position.equals(v)) return;
        this.__position.set(v);
        this.markDirtied();
    }


    /**
     * 设置旋转角度(0-360)
     * @param x 
     * @param y 
     * @param z 
     */
    setAngle(x: number, y?: number, z?: number): void {
        let changed: boolean = false;
        if (x != undefined && this.__angle.x != x) {
            this.__angle.x = x;
            changed = true;
        }
        if (y != undefined && this.__angle.y != y) {
            this.__angle.y = y;
            changed = true;
        }
        if (z != undefined && this.__angle.z != z) {
            this.__angle.z = z;
            changed = true;
        }
        if (changed) {
            Quat.fromEuler(this.__rotation, this.__angle.x, this.__angle.y, this.__angle.z);
            this.markDirtied();
        }
    }

    get rotation(): Quat {
        return this.__rotation;
    }

    set rotation(v: Quat) {
        if (this.__rotation.equals(v)) return;
        this.__rotation.set(v);
        this.markDirtied();
    }

    /**
     * 设置缩放比例
     * @param x 
     * @param y 
     * @param z 
     */
    setScale(x?: number, y?: number, z?: number): void {
        let changed = false;
        if (x != undefined && this.__angle.x != x) {
            this.__scale.x = x;
            changed = true;
        }
        if (y != undefined && this.__angle.y != y) {
            this.__scale.y = y;
            changed = true;
        }
        if (z != undefined && this.__angle.z != z) {
            this.__scale.z = z;
            changed = true;
        }
        if (changed) {
            this.markDirtied()
        }
    }

    /**
     * 缩放比例
     */
    set scale(v: Vec3) {
        if (this.__scale.equals(v)) return;
        this.__scale.set(v);
        this.markDirtied();
    }

    get scale(): Vec3 {
        return this.__scale;
    }

    reset(): void {
        super.reset();
        this.__direction.set(0, 0, 0);
        this.__position.set(0, 0, 0);
        this.__angle.set(0, 0, 0);
        this.__rotation.set(0, 0, 0, 1);
        this.__scale.set(1, 1, 1);
    }
}