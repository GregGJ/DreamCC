import { ConfigManager, Event, IDConfigAccessor, Task } from "dream-cc-core";
import { ConfigKeys } from "../configs/ConfigKeys";
import { LevelAccessor } from "../configs/LevelAccessor";
import { ConstantAccessor } from "../configs/ConstantAccessort";
import { MapPathAccessor } from "../configs/MapPathAccessor";
import { SkillAccessor } from "../configs/SkillAccessor";
import { TowerAccessor } from "../configs/TowerAccessor";



/**
 * 配置初始化任务
 */
export class ConfigInitTask extends Task {

    constructor() {
        super();
    }

    start(data?: any): void {
        ConfigManager.register(ConfigKeys.Constants_Constants, ConstantAccessor);

        ConfigManager.register(ConfigKeys.Level_Level, LevelAccessor);

        ConfigManager.register(ConfigKeys.Maps_MapPath, MapPathAccessor);

        ConfigManager.register(ConfigKeys.Monster_Monster, IDConfigAccessor);

        ConfigManager.register(ConfigKeys.Skills_Skill, SkillAccessor);

        ConfigManager.register(ConfigKeys.Tower_Tower, TowerAccessor);
        this.emit(Event.COMPLETE);
    }

    destroy(): boolean {
        return true;
    }
}