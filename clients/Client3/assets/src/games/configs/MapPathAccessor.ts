import { BaseConfigAccessor } from "dream-cc-core";


export class MapPathAccessor extends BaseConfigAccessor
{
    constructor(){
        super();
        this.addStorage(["level"]);
    }
}