import { BaseConfigAccessor } from "dream-cc-core";




export class ConstantAccessor extends BaseConfigAccessor {

    constructor() {
        super();
        this.addStorage(["key"]);
    }

    getValue<T>(key: string): T {
        let s = this.getStorage(["key"]);
        let item = s.get<Config.Constants.Constants>(key);
        return item.value as T;
    }
}