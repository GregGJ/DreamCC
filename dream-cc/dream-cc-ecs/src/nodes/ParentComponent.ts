import { Node } from "cc";
import { ECSComponent } from "../core/ECSComponent";
import { ECSEntity } from "../core/ECSEntity";

/**
 * 设置父节点组件
 */
export class ParentComponent extends ECSComponent {

    private __parent: ECSEntity | Node | null = null;

    constructor() {
        super();
    }

    set parent(v: ECSEntity | Node | null) {
        if (this.__parent === v) return;
        this.__parent = v;
        this.markDirtied();
    }

    get parent(): ECSEntity | Node | null {
        return this.__parent;
    }

    reset(): void {
        super.reset();
        this.parent = null;
    }
}