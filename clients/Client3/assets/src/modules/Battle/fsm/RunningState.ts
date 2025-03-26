import { AudioManager } from "dream-cc-core";
import { BaseState } from "./BaseState";
import { GamePath } from "../../../games/GamePath";
import { ECSWorld, TransformComponent } from "dream-cc-ecs";
import { BattleEntityFactory } from "../levels/BattleEntityFactory";
import { BattleEntitys } from "../levels/BattleEntitys";
import { UnitAnimationComponent } from "../ecs/UnitAnimationComponent";
import { ActionKeys } from "../datas/ActionKeys";
import { Timeline } from "../utils/Timeline";




export class RunningState extends BaseState {

    constructor(level: string) {
        super("RunningState", level);
    }

    enter(data?: any): void {
        super.enter(data);
        //播放战斗前置音乐
        AudioManager.playMusic(GamePath.soundURL("MusicBattleUnderAttackForest1"));


        let entity = "test";
        BattleEntityFactory.createMonster(this.world, entity, BattleEntitys.DynamicLayer);
        let trans = this.world.getComponent(entity, TransformComponent);
        let ani_com = this.world.getComponent(entity, UnitAnimationComponent);
        trans.setPosition(600, 600);
        ani_com.url = GamePath.battleURL("entitys/monsters/goblin", "ani");
        ani_com.play(ActionKeys.walkingDown, true);
    }

    tick(dt: number): void {
        if (!this.model.paused) {
            Timeline.single.tick(dt);
        }
    }

    exit(): void {
        super.exit();
    }
}