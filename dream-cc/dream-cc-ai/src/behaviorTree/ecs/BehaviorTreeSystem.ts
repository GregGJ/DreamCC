import { ECSEntity, ECSSystem, MatcherAllOf } from "dream-cc-ecs";
import { BehaviorTreeComponent } from "./BehaviorTreeComponent";
import { Timer } from "dream-cc-core";
import { BTUtils } from "../BTUtils";


/**
 * 行为树系统
 */
export class BehaviorTreeSystem extends ECSSystem {

    constructor() {
        super(new MatcherAllOf([
            BehaviorTreeComponent
        ]));
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        let currentTime = Timer.currentTime;
        for (let entity of entitys) {
            let tree = this.world.getComponent(entity, BehaviorTreeComponent);
            if (!tree) return;
            if (currentTime - tree.lastTime < tree.frameInterval) {
                return;
            }
            tree.lastTime = currentTime;
            if (tree && tree.root) {
                tree.root.evaluate();
                if (tree.debug) {
                    let log = BTUtils.printTreeRecursively(tree.root);
                    console.log(log);
                }
            }
        }
    }
}