import { ECSEntity, ECSSystem, MatcherAllOf } from "dream-cc-ecs";
import { FSMComponent } from "./FSMComponent";


export class FSMSystem extends ECSSystem {


    constructor() {
        super(
            new MatcherAllOf(
                [
                    FSMComponent
                ]
            )
        );
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (let entity of entitys) {
            let fsm = this.world.getComponent(entity, FSMComponent)!;
            fsm.fsm.tick(dt);
        }
    }
}