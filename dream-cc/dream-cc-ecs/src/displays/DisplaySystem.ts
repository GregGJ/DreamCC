import { ECSEntity } from "../core/ECSEntity";
import { MatcherAllOf } from "../core/ECSMatcher";
import { ECSSystem } from "../core/ECSSystem";
import { TransformComponent } from "../transforms/TransformComponent";
import { DisplayComponent } from "./DisplayComponent";



export class DisplaySystem extends ECSSystem {
    
    constructor() {
        super(
            new MatcherAllOf([
                DisplayComponent,
                TransformComponent
            ]),
            undefined,
            undefined,
            true//使用脏数据
        );
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (const entity of entitys) {
            const display_com = this.world.getComponent(entity, DisplayComponent)!;
            const trans_com = this.world.getComponent(entity, TransformComponent)!;
            //旋转
            display_com.node.setRotation(trans_com.rotation);
            //平移
            if (TransformComponent.YAxisFlip) {
                display_com.node.setPosition(trans_com.position.x, trans_com.position.y * -1, trans_com.position.z);
            } else {
                display_com.node.setPosition(trans_com.position);
            }
            //缩放
            display_com.node.setScale(trans_com.scale);
        }
    }
}