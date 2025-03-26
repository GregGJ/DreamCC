import { Node } from "cc";
import { ECSEntity } from "../core/ECSEntity";
import { MatcherAllOf } from "../core/ECSMatcher";
import { ECSSystem } from "../core/ECSSystem";
import { DisplayComponent } from "../displays/DisplayComponent";
import { ParentComponent } from "./ParentComponent";



/**
 * 添加到父节点系统
 */
export class AddToParentSystem extends ECSSystem {

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
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (const entity of entitys) {
            const parent_com = this.world.getComponent(entity, ParentComponent)!;
            const display_com = this.world.getComponent(entity, DisplayComponent)!;
            if (parent_com.parent == null) {
                continue;
            }
            if (parent_com.parent instanceof Node) {
                parent_com.parent.addChild(display_com.node);
            } else {
                let parent_display_com = this.world.getComponent(parent_com.parent, DisplayComponent);
                if (!parent_display_com) {
                    continue;
                }
                parent_display_com.node.addChild(display_com.node);
            }
        }
    }
}