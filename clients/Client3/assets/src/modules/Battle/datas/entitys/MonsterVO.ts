import { ConfigManager, IDConfigAccessor } from "dream-cc-core";
import { BattleVO } from "./BattleVO";
import { ConfigKeys } from "../../../../games/configs/ConfigKeys";




export class MonsterVO extends BattleVO {

    id: number;
    /**
     * 怪物路径ID
     */
    pathID: string;

    constructor() {
        super();
    }

    init(key: string, id: number, pathID: string): void {
        this.id = id;
        this.pathID = pathID;
        super.init(key);
    }

    protected $initAttr():void{
        let attrConfig = this.attrConfig;
    }

    get config(): Config.Monster.Monster {
        const acc = ConfigManager.getAccessor(ConfigKeys.Monster_Monster) as IDConfigAccessor;
        const monsterConfig = acc.getByID<Config.Monster.Monster>(this.id);
        return monsterConfig;
    }

    get attrConfig(): Config.Attrs.Attributes {
        const attr_id = this.config.attr_id;
        let acc = ConfigManager.getAccessor(ConfigKeys.Attrs_Attributes) as IDConfigAccessor;
        let result = acc.getByID<Config.Attrs.Attributes>(attr_id);
        return result;
    }
}