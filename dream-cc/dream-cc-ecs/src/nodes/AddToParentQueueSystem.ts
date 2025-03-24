

import { ParentComponent } from "./ParentComponent";
import { Node } from "cc";
import { NodeComponent } from "./NodeComponent";
import { ECSSystem } from "../core/ECSSystem";
import { ECSEntity } from "../core/ECSEntity";
import { MatcherAllOf } from "../core/ECSMatcher";



export class AddToParentQueueSystem extends ECSSystem {

    private nodes: Set<ECSEntity>;

    private frame_count: number = Number.MAX_VALUE;

    constructor() {
        super(
            new MatcherAllOf([
                ParentComponent,
            ]),
            undefined,
            undefined,
            true
        );
        this.nodes = new Set();
    }

    tick(dt: number): void {
        super.tick(dt);
        if (this.nodes.size > 0) {
            let count = Math.min(this.frame_count, this.nodes.size);
            let itr = this.nodes.values();
            let index: number = 0;
            while (index < count) {
                const entity = itr.next().value as ECSEntity;
                this.nodes.delete(entity);
                if (this.world.hasEntity(entity)) {
                    const parent_com = this.world.getComponent(entity, ParentComponent)!;
                    const node_com = this.world.getComponent(entity, NodeComponent)!;
                    if (parent_com.parent == null) {
                        continue;
                    }
                    if (parent_com.parent instanceof Node) {
                        parent_com.parent.addChild(node_com);
                    } else {
                        let parent_node = this.world.getComponent(parent_com.parent, NodeComponent)!;
                        parent_node.addChild(node_com);
                    }
                }
                index++;
            }
        }
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (const entity of entitys) {
            this.nodes.add(entity);
        }
    }
}