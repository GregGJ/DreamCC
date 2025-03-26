import { Node } from "cc";
import { ECSComponent } from "../core/ECSComponent";




/**
 * 显示组件
 */
export class DisplayComponent extends ECSComponent {

    private __node: Node;
    constructor() {
        super();
    }

    enable(): void {
        this.__node = new Node(this.entity.toString());
    }

    reset(): void {
        super.reset();
        this.__node.destroy();
        this.__node = null;
    }

    /**
     * 节点
     */
    get node(): Node {
        return this.__node;
    }

    set name(v: string) {
        this.__node && (this.__node.name = v);
    }

    get name(): string {
        return this.__node.name || "";
    }
}