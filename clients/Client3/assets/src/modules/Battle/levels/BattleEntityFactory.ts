import { Node } from "cc";
import { ConfigManager, IDConfigAccessor } from "dream-cc-core";
import { DataComponent, DisplayComponent, ECSEntity, ECSWorld, ParentComponent, TransformComponent } from "dream-cc-ecs";
import { ConfigKeys } from "../../../games/configs/ConfigKeys";
import { GamePath } from "../../../games/GamePath";
import { ActionKeys } from "../actions/ActionKeys";
import { SpawnData } from "../datas/SpawnData";
import { UnitAnimationComponent } from "../ecs/display/UnitAnimationComponent";
import { BattleEntitys } from "./BattleEntitys";
import { TowerPointComponnent } from "../ecs/display/TowerPointComponnent";
import { MonsterVO } from "../datas/entitys/MonsterVO";
import { PathMovementComponent } from "../ecs/movments/PathMovementComponent";
import { BattleModel } from "../datas/BattleModel";




export class BattleEntityFactory {

    /**
     * 创建实体
     * @param world 
     * @param entity 
     * @param parent 
     */
    static createEntity(world: ECSWorld, entity: ECSEntity, parent: ECSEntity | Node, display?: new () => DisplayComponent): void {
        world.createEntity(entity);
        world.addComponent(entity, TransformComponent);
        world.addComponent(entity, display ? display : DisplayComponent);
        let parent_com = world.addComponent(entity, ParentComponent);
        parent_com.parent = parent;
    }

    static createTowerPoint(world: ECSWorld, config: { id: string, type: number, x: number, y: number }): void {
        this.createEntity(world, config.id, BattleEntitys.DynamicLayer, TowerPointComponnent);

        let trans = world.getComponent(config.id, TransformComponent);
        trans.setPosition(config.x, config.y);

        let tp = world.getComponent(config.id, TowerPointComponnent);
        tp.config = config;
    }

    /**
     * 创建怪物
     * @param world 
     * @param spawn 
     * @param parent 
     */
    static createMonster(world: ECSWorld, spawn: SpawnData, parent?: ECSEntity): void {
        let path = BattleModel.single.paths.get(spawn.path);
        //怪物配置
        const acc = ConfigManager.getAccessor(ConfigKeys.Monster_Monster) as IDConfigAccessor;
        const monsterConfig = acc.getByID<Config.Monster.Monster>(spawn.creep);
        if (!monsterConfig) {
            throw new Error("怪物配置表中不存在id:" + spawn.creep);
        }
        let entity = monsterConfig.skin + "_wave_" + spawn.wave + "_index_" + spawn.index + "_path_" + spawn.path;
        this.createEntity(world, entity, parent ? parent : BattleEntitys.DynamicLayer, UnitAnimationComponent);

        //起始点
        let trans = world.getComponent(entity, TransformComponent);
        trans.setPosition(path[0].x, path[0].y);

        let ani_com = world.getComponent(entity, UnitAnimationComponent);
        ani_com.url = GamePath.battleURL("entitys/monsters/" + monsterConfig.skin, "ani");
        ani_com.play(ActionKeys.walking, true);

        let monsterVO = new MonsterVO();
        monsterVO.key = entity;
        monsterVO.id = spawn.creep;
        monsterVO.pathID = spawn.path;

        let data_com = world.addComponent(entity, DataComponent);
        data_com.data = monsterVO;

        let movement = world.addComponent(entity, PathMovementComponent);
        movement.setData(path, 0.05);
    }
}