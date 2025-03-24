import { ECSEntity } from "../core/ECSEntity";
import { MatcherAllOf } from "../core/ECSMatcher";
import { ECSSystem } from "../core/ECSSystem";
import { NodeComponent } from "./NodeComponent";
import { TransformComponent } from "../transforms/TransformComponent";


export class NodeSystem extends ECSSystem {

    constructor() {
        super(
            new MatcherAllOf([
                NodeComponent,
                TransformComponent
            ]),
            undefined,
            undefined,
            true//使用脏数据
        );
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (const entity of entitys) {
            const node_com = this.world.getComponent(entity, NodeComponent)!;
            const trans_com = this.world.getComponent(entity, TransformComponent)!;
            //旋转
            node_com.setRotation(trans_com.rotation);
            //平移
            if (TransformComponent.YAxisFlip) {
                node_com.setPosition(trans_com.position.x, trans_com.position.y * -1, trans_com.position.z);
            } else {
                node_com.setPosition(trans_com.position);
            }
            //缩放
            node_com.setScale(trans_com.scale);
        }
    }
}