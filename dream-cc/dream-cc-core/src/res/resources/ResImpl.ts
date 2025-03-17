import { Asset, AssetManager, assetManager, SpriteFrame, Texture2D } from "cc";
import { ILoader } from "../loaders/ILoader";
import { IRes } from "./IRes";
import { ResURL } from "../ResURL";
import { CCLoader } from "../loaders/CCLoader";
import { Pool } from "../../pools/Pool";
import { ResRequest } from "../ResRequest";
import { ClassUtils } from "../../utils/ClassUtils";

/**
 * 资源入口实现
 */
export class ResImpl implements IRes {

    private loaderClass: Map<string, new () => ILoader>;

    /**
     * 资源类型映射
     */
    private __assetTypes = new Map<string, typeof Asset>();

    constructor() {
        this.loaderClass = new Map<string, new () => ILoader>();
    }

    url2Key(url: ResURL): string {
        if (url == null || url == undefined) {
            return "";
        }
        if (typeof url == "string") {
            return url;
        }
        let ul: string;
        if (url.type == SpriteFrame) {
            ul = url.url + "/spriteFrame";
        } else if (url.type == Texture2D) {
            ul = url.url + "/texture";
        } else {
            ul = url.url;
        }
        return ul + "|" + url.bundle + "|" + this.getAndSaveClassName(url.type);
    }

    key2Url(key: string): ResURL {
        if (key.indexOf("|")) {
            let arr: Array<string> = key.split("|");
            return { url: this.path2Key(arr[0]), bundle: arr[1], type: this.getAssetType(arr[2]) };
        }
        return key;
    }

    url2Path(url: ResURL): string {
        if (typeof url == "string") {
            return url;
        }
        if (url.type == Texture2D) {
            return url.url + "/texture";
        }
        if (url.type == SpriteFrame) {
            return url.url + "/spriteFrame"
        }
        return url.url;
    }

    urlEqual(a: ResURL | null, b: ResURL | null): boolean {
        if (a == b) return true;
        if (a == null || b == null) return false;
        if (typeof a == "string" && typeof b == "string") {
            return a == b;
        }
        if (typeof a == "string" || typeof b == "string") {
            return false;
        }
        if (a.url == b.url && a.type == b.type && a.bundle == b.bundle) {
            return true;
        }
        return false;
    }

    private getAssetType(key: string): typeof Asset {
        if (!this.__assetTypes.has(key)) {
            throw new Error("未找到对应资源类型：" + key);
        }
        return this.__assetTypes.get(key)!;
    }

    private getAndSaveClassName(clazz: any): string {
        let className: string = ClassUtils.getClassName(clazz);
        if (!this.__assetTypes.has(className)) {
            this.__assetTypes.set(className, clazz);
        }
        return className;
    }

    path2Key(key: string): string {
        let len: number = key.length;
        let end: number = len - 8;
        //texture
        let t = key.substring(end);
        if (t === "/texture") {
            return key.substring(0, end);
        }
        //spriteFrame
        end = len - 12;
        t = key.substring(end);
        if (t === "/spriteFrame") {
            return key.substring(0, end);
        }
        return key;
    }

    setLoader(key: any, loader: new () => ILoader): void {
        let className = ClassUtils.getClassName(key);
        this.loaderClass.set(className, loader);
    }

    getLoader(key: any): new () => ILoader {
        let className = ClassUtils.getClassName(key);
        if (!this.loaderClass.has(className)) {
            return CCLoader;
        }
        return this.loaderClass.get(className)!;
    }

    create(url: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void, cb?: (err?: Error) => void): ResRequest {
        let reqeust = Pool.acquire(ResRequest);
        reqeust.init(url, refKey, progress, cb);
        return reqeust;
    }


    loadAssetBundles(names: string | Array<string>): Promise<void> {
        let list = [];
        if (typeof names == "string") {
            list.push(names);
        } else {
            list.push(...names);
        }
        let abs = [];
        for (let index = 0; index < list.length; index++) {
            const bundle_name = list[index];
            let bundle = assetManager.getBundle(bundle_name);
            if (!bundle && abs.indexOf(bundle_name) == -1) {
                abs.push(bundle_name);
            }
        }
        let loaded = 0;
        let total = abs.length;
        let result = new Promise<void>(
            (resolve, reject) => {
                for (let index = 0; index < abs.length; index++) {
                    const bundle_name = abs[index];
                    assetManager.loadBundle(bundle_name, (err: Error | null, bundle: AssetManager.Bundle) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        loaded++;
                        if (loaded == total) {
                            resolve();
                        }
                    });
                }
            }
        );
        return result;
    }
}