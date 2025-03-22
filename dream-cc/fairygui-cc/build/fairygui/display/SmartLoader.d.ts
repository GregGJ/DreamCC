import { SpriteFrame } from "cc";
import { GLoader } from "../GLoader";
export declare class SmartLoader extends GLoader {
    /**加载完成回调 */
    loadedCallback: (target: SmartLoader, err?: Error) => void;
    refKey: string;
    private __spriteFrame;
    private __resRequest;
    constructor();
    protected loadExternal(): void;
    protected freeExternal(texture: SpriteFrame): void;
}
