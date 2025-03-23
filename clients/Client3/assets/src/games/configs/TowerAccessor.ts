import { BaseConfigAccessor } from "dream-cc-core";



export class TowerAccessor extends BaseConfigAccessor {
    constructor() {
        super()
        this.addStorage(["id"]);
        this.addStorage(["type", "level"]);
    }

    getById(id: number): Config.Tower.Tower {
        return this.get<Config.Tower.Tower>(["id"], [id]);
    }

    getBy(type: number, level: number): Config.Tower.Tower {
        return this.get<Config.Tower.Tower>(["type", "level"], [type, level]);
    }
}