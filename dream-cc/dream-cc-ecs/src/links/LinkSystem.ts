
import { ECSEntity } from "../core/ECSEntity";
import { MatcherAllOf } from "../core/ECSMatcher";
import { ECSSystem } from "../core/ECSSystem";
import { TransformComponent } from "../transforms/TransformComponent";
import { LinkComponent } from "./LinkComponent";

export class LinkSystem extends ECSSystem {
  constructor() {
    super(new MatcherAllOf([LinkComponent, TransformComponent]));
  }

  protected $tick(entitys: Set<ECSEntity>, dt: number): void {
    for (let entity of entitys) {
      const link_com = this.world.getComponent(entity, LinkComponent);
      const trans = this.world.getComponent(entity, TransformComponent);
      if (link_com.target) {
        const target_trans = this.world.getComponent(
          link_com.target,
          TransformComponent,
        );
        trans.setPosition(target_trans.x, target_trans.y, target_trans.z);
      }
    }
  }
}
