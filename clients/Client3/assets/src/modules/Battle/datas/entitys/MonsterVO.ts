import { ConfigManager, IDConfigAccessor } from "dream-cc-core";
import { BattleVO } from "./BattleVO";
import { ConfigKeys } from "../../../../games/configs/ConfigKeys";




export class MonsterVO extends BattleVO {

    id: number;
    /**
     * 怪物路径ID
     */
    pathID:string;

    constructor() {
        super();
    }
    
    get config(): Config.Monster.Monster {
        const acc = ConfigManager.getAccessor(ConfigKeys.Monster_Monster) as IDConfigAccessor;
        const monsterConfig = acc.getByID<Config.Monster.Monster>(this.id);
        return monsterConfig;
    }
}