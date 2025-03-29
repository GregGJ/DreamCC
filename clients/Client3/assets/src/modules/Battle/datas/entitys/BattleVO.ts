import { ECSEntity } from "dream-cc-ecs";
import { Attributes } from "./Attributes";



export class BattleVO {

    key: ECSEntity;
    /**
     * 属性集合
     */
    attrs: Attributes;

    constructor() {

    }

    init(...args: any[]): void {
        this.key = args[0];
        this.$initAttr();
    }

    protected $initAttr():void{
        
    }
}