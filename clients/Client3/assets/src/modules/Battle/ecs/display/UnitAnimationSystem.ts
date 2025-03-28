import { ECSEntity, ECSSystem, MatcherAllOf, TransformComponent } from "dream-cc-ecs";
import { UnitAnimationComponent } from "./UnitAnimationComponent";




export class UintAnimationSystem extends ECSSystem {

    constructor() {
        super(
            new MatcherAllOf([
                TransformComponent,
                UnitAnimationComponent
            ])
        )
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (const entity of entitys) {
            let ani_com = this.world.getComponent(entity, UnitAnimationComponent);
            let trans = this.world.getComponent(entity, TransformComponent);
            ani_com.setDirection(trans.direction.x, trans.direction.y);
            ani_com.tick(dt);
        }
    }
}