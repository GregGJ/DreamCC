import { Vec3 } from "cc";
import { ECSComponent } from "../core/ECSComponent";


/**
 * 大小记录组件(只用于记录大小)
 */
export class SizeComponent extends ECSComponent {

    private __size: Vec3 = new Vec3(1, 1, 1);

    constructor() {
        super();
    }


    setSize(w: number, h: number): void {
        this.__size.x = w;
        this.__size.y = h;
        this.markDirtied();
    }
    
    set width(v: number) {
        if (this.__size.x === v) return;
        this.__size.x = v;
        this.markDirtied();
    }

    get width(): number {
        return this.__size.x;
    }

    set height(v: number) {
        if (this.__size.y === v) return;
        this.__size.y = v;
    }

    get height(): number {
        return this.__size.y;
    }

    reset(): void {
        super.reset();
        this.__size.set(1, 1, 1);
    }
}