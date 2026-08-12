import { DataComponent, DisplayComponent, ECSEntity, ECSSystem, MatcherAllOf } from "dream-cc-ecs";
import { MonsterVO } from "../../datas/entitys/MonsterVO";
import { HPBarComponent } from "./HPBarComponent";



export class HPBarSystem extends ECSSystem {

    constructor() {
        super(
            new MatcherAllOf([
                HPBarComponent,
            ]),
            undefined,
            undefined,
            true
        );
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (let entity of entitys) {
            let hpBar_com = this.world.getComponent(entity, HPBarComponent);
            if (hpBar_com.hpBarNode) {
                let display_com = this.world.getComponent(entity, DisplayComponent);
                if (display_com) {
                    display_com.node.addChild(hpBar_com.hpBarNode);
                    this.__updateHPBar(entity);
                }
            }
        }
    }

    private __updateHPBar(entity: ECSEntity): void {
        let hpBar_com = this.world.getComponent(entity, HPBarComponent);
        let data_com = this.world.getComponent(entity, DataComponent);
        if (!hpBar_com || !data_com) {
            return;
        }
        let battleVO = data_com.data;
        if (battleVO instanceof MonsterVO) {
            hpBar_com.hpBar.progress = 1;
            hpBar_com.hpBarNode.setScale(battleVO.config.hp_scale[0], battleVO.config.hp_scale[1]);
            hpBar_com.hpBarNode.setPosition(battleVO.config.hp_bar[0], battleVO.config.hp_bar[1]);
        }
    }
}