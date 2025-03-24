import { ECSComponent } from "../core/ECSComponent";
import { NodeComponent } from "../nodes/NodeComponent";
import { Node } from "cc";




/**
 * 显示组件
 */
export class DisplayComponent extends ECSComponent {

    constructor() {
        super();
    }

    enable(): void {
        //如果没有节点组件
        if (!this.world!.hasComponent(this.entity!, NodeComponent)) {
            this.world?.addComponent(this.entity!, NodeComponent);
        }
    }
    
    reset(): void {
        super.reset();
    }

    /**
     * 节点
     */
    get node(): Node | null {
        if (this.world && this.entity) {
            let node_com = this.world?.getComponent(this.entity!, NodeComponent)!;
            return node_com;
        }
        return null;
    }

    set name(v: string) {
        this.node && (this.node.name = v);
    }

    get name(): string {
        return this.node?.name || "";
    }
}