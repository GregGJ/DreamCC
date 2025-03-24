import { Node } from "cc";
import { NodeComponent } from "./NodeComponent";
import { ParentComponent } from "./ParentComponent";
import { MatcherAllOf } from "../core/ECSMatcher";
import { ECSSystem } from "../core/ECSSystem";
import { ECSEntity } from "../core/ECSEntity";



/**
 * 添加到父节点系统
 */
export class AddToParentSystem extends ECSSystem {
    
    constructor() {
        super(
            new MatcherAllOf([
                ParentComponent,
            ]),
            undefined,
            undefined,
            true
        );
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (const entity of entitys) {
            const parent_com = this.world.getComponent(entity, ParentComponent)!;
            const node_com = this.world.getComponent(entity, NodeComponent)!;
            if (parent_com.parent == null) {
                continue;
            }
            if (parent_com.parent instanceof Node) {
                parent_com.parent.addChild(node_com);
            } else {
                let parent_node_com = this.world.getComponent(parent_com.parent, NodeComponent)!;
                parent_node_com.addChild(node_com);
            }
        }
    }
}