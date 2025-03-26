import { ECSEntity, ECSSystem, MatcherAllOf } from "dream-cc-ecs";
import { UnitAnimationComponent } from "./UnitAnimationComponent";




export class UintAnimationSystem extends ECSSystem {

    constructor() {
        super(
            new MatcherAllOf([
                UnitAnimationComponent
            ])
        )
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (const entity of entitys) {
            const ani_com = this.world.getComponent(entity, UnitAnimationComponent);
            ani_com.tick(dt);
        }
    }
}