import { SpriteAtlas, SpriteFrame } from "cc";
import { ResRequest } from "dream-cc-core";

/**
 * 动画资源
 */
export class UnitAnimationAsset {
    /**
     * 动作列表
     */
    actions: Map<string, IAnimationData> | null = null;
    /**
     * 纹理集
     */
    private __spriteAtlas: Array<SpriteAtlas> | null = null;

    private __atlasReqeust: ResRequest;

    constructor(data: any, request: ResRequest) {
        this.__atlasReqeust = request;
        let assets = request.getRefList();
        this.__spriteAtlas = [];
        for (let index = 0; index < assets.length; index++) {
            const element = assets[index];
            if (element.content instanceof SpriteAtlas) {
                this.__spriteAtlas.push(element.content);
            }
        }
        this.actions = new Map<string, IAnimationData>();
        for (let index = 0; index < data.actions.length; index++) {
            const action = data.actions[index];
            this.actions.set(action.key, action);
        }
    }

    getFrame(action: string, index: number): SpriteFrame | null {
        const actionData = this.actions!.get(action);
        if (!actionData) {
            return null;
        }
        let frameKey: string = actionData.prefix + "_" + this.__getIndexStr(actionData.from + index);
        return this.__getSpriteFrame(frameKey);
    }

    getFrameName(action: string, index: number): string | undefined {
        const actionData = this.actions!.get(action);
        if (!actionData) {
            return undefined;
        }
        let frameKey: string = actionData.prefix + "_" + this.__getIndexStr(actionData.from + index);
        return frameKey;
    }

    getSpriteAtlas(action: string, index: number): SpriteAtlas | null {
        const actionData = this.actions!.get(action);
        if (!actionData) {
            return null;
        }
        let frameKey: string = actionData.prefix + "_" + this.__getIndexStr(actionData.from + index);
        return this.__getSpriteAtlas(frameKey);
    }

    private __getSpriteAtlas(name: string): SpriteAtlas | null {
        for (let index = 0; index < this.__spriteAtlas!.length; index++) {
            const spriteAtlas = this.__spriteAtlas![index];
            if (spriteAtlas.spriteFrames[name]) {
                return spriteAtlas;
            }
        }
        return null;
    }

    private __getSpriteFrame(name: string): SpriteFrame | null {
        for (let index = 0; index < this.__spriteAtlas!.length; index++) {
            const spriteAtlas = this.__spriteAtlas![index];
            let frame = spriteAtlas.getSpriteFrame(name);
            if (frame) {
                return frame;
            }
        }
        return null;
    }

    private __getIndexStr(index: number): string {
        if (index < 10) {
            return "000" + index;
        }
        if (index < 100) {
            return "00" + index;
        }
        if (index < 1000) {
            return "0" + index;
        }
        return index.toString();
    }

    destroy(): void {
        this.actions?.clear();
        this.actions = null;
        this.__atlasReqeust.dispose();
        this.__atlasReqeust = null;
        this.__spriteAtlas = null;
    }
}

export interface IAnimationData {
    key: string;
    prefix: string;
    from: number;
    to: number;
    loop: boolean;
    events: Array<{ key: string, time: number }>;
}