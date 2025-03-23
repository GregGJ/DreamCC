import { BaseConfigAccessor } from "dream-cc-core";


export class SkillAccessor extends BaseConfigAccessor {

    constructor() {
        super();
        this.addStorage(["type", "level"]);
    }

    getSkill(type: number, level: number=0): Config.Skills.Skill {
        return this.get<Config.Skills.Skill>(["type", "level"], [type, level]);
    }
}