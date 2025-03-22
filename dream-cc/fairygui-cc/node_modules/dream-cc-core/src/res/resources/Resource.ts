import { Asset, assetManager, instantiate, isValid, Node, Prefab } from "cc";
import { Logger } from "../../loggers/Logger";
import { Pool } from "../../pools/Pool";
import { ResRef } from "../ResRef";
import { IResource } from "./IResource";




/**
 * 资源
 */
export class Resource implements IResource {
    /**
     * 资源全局唯一KEY
     */
    key: string;
    /**
     * 最后操作的时间电
     */
    lastOpTime: number = 0;
    /**
     * 资源内容
     */
    content: any;

    private __refList: Array<ResRef>;

    constructor() {
        this.__refList = [];
    }

    addRef(refKey?: string): ResRef {
        let ref = Pool.acquire(ResRef);
        ref.key = this.key;
        ref.refKey = refKey ? refKey : "";
        //cocos内置资源
        if (this.content instanceof Asset) {
            //如果是预制体
            if (this.content instanceof Prefab) {
                ref.content = instantiate(this.content);
            } else {
                ref.content = this.content;
            }
            this.content.addRef();
        } else {
            ref.content = this.content;
        }
        this.__refList.push(ref);
        return ref;
    }

    removeRef(value: ResRef): void {
        let index = this.__refList.indexOf(value);
        if (index == -1) {
            throw new Error("资源引用不存在");
        }
        //cocos内置资源
        if (this.content instanceof Asset) {
            //如果是预制体
            if (this.content instanceof Prefab) {
                let node: Node = value.content;
                if (isValid(node)) {
                    node.destroy();
                }
            }
            this.content.decRef();
        }
        this.__refList.splice(index, 1);
        Pool.release(ResRef, value);
    }

    destroy(): boolean {
        if (this.refCount > 0 || this.refLength > 0) {
            throw new Error("发现销毁资源时引用数量不为0");
        }
        //自身引用计数
        if (this.content instanceof Asset) {
            this.content.decRef();
            if (this.content.refCount <= 0) {
                Logger.log("ReleaseAsset=>" + this.key, Logger.TYPE.RES);
                assetManager.releaseAsset(this.content);
            }
        } else {
            Logger.log("DestroyAsset=>" + this.key, Logger.TYPE.RES);
            if (this.content["destroy"]) {
                this.content["destroy"]();
            }
        }
        this.key = undefined;
        this.__refList = undefined;
        this.content = undefined;
        return true;
    }

    /**
     * 资源引用列表
     */
    get refList(): ResRef[] {
        return this.__refList;
    }

    /**
     * 引用数量
     */
    get refCount(): number {
        if (this.content instanceof Asset) {
            return this.content.refCount - 1;
        }
        return this.__refList.length;
    }

    /**
     * 引用列表长度
     */
    get refLength(): number {
        return this.__refList.length;
    }
}