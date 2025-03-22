import { GComponent } from "fairygui-cc";
import { ILayer } from "./ILayer";



/**
 * 层级类
 */
export class Layer extends GComponent implements ILayer {

    /**
     * 是否是全屏层
     */
    isFullScrene: boolean;

    /**
     * 开启记录
     */
    openRecord: Array<string>;
    
    constructor(name: string, isFullScrene: boolean = false) {
        super();
        this.node.name = name;
        this.isFullScrene = isFullScrene;
        this.openRecord = [];
        this.makeFullScreen();
    }

    getCount(): number {
        return this.numChildren;
    }
}