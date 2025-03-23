import { BaseConfigAccessor } from "dream-cc-core";



export class LevelAccessor extends BaseConfigAccessor {

    /**
     * 最大关卡
     */
    maxLevel: number = Number.MIN_SAFE_INTEGER;

    constructor() {
        super()
        this.addStorage(["id", "difficulty", "mode"]);
    }

    save(value: any): boolean {
        let config = value as Config.Level.Level;
        if (config) {
            this.maxLevel = Math.max(config.id, this.maxLevel);
        }
        return super.save(value);
    }

    getLevel(id: number, difficulty: number, mode: number): Config.Level.Level | null {
        return this.get<Config.Level.Level>(["id", "difficulty", "mode"], [id, difficulty, mode]);
    }
}