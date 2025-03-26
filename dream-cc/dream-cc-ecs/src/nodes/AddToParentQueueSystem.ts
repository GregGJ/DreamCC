

import { ParentComponent } from "./ParentComponent";
import { Node } from "cc";
import { ECSSystem } from "../core/ECSSystem";
import { ECSEntity } from "../core/ECSEntity";
import { MatcherAllOf } from "../core/ECSMatcher";
import { DisplayComponent } from "../displays/DisplayComponent";



export class AddToParentQueueSystem extends ECSSystem {

    private nodes: Set<ECSEntity>;

    private frame_count: number = Number.MAX_VALUE;

    constructor() {
        super(
            new MatcherAllOf([
                DisplayComponent,
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
                    const display_com = this.world.getComponent(entity, DisplayComponent)!;
                    if (parent_com.parent == null) {
                        continue;
                    }
                    if (parent_com.parent instanceof Node) {
                        parent_com.parent.addChild(display_com.node);
                    } else {
                        let parent_node = this.world.getComponent(parent_com.parent, DisplayComponent)!;
                        if (!parent_node) {
                            continue;
                        }
                        parent_node.node.addChild(display_com.node);
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