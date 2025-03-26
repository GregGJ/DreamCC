import { Node } from "cc";
import { DisplayComponent, ECSEntity, ECSWorld, ParentComponent, TransformComponent } from "dream-cc-ecs";
import { UnitAnimationComponent } from "../ecs/UnitAnimationComponent";




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

    /**
     * 创建怪物
     * @param world 
     * @param entity 
     * @param parent 
     */
    static createMonster(world: ECSWorld, entity: ECSEntity, parent: ECSEntity): void {
        this.createEntity(world, entity, parent, UnitAnimationComponent);
    }
}