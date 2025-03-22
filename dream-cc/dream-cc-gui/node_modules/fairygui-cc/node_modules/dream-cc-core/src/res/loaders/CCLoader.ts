import { Asset, AssetManager, assetManager } from "cc";
import { ILoader } from "../loaders/ILoader";
import { ResURL } from "../ResURL";
import { EventDispatcher } from "../../events/EventDispatcher";
import { Event } from "../../events/Event";
import { ResourceManager } from "../resources/ResourceManager";
import { Resource } from "../resources/Resource";
import { Res } from "../Res";

/**
 * cocos 内置类型资源加载器
 */
export class CCLoader extends EventDispatcher implements ILoader {

    private __url?: ResURL;

    constructor() {
        super();
    }

    reset(): void {
        this.__url = undefined;
        //斩断一切事件监听
        this.offAllEvent();
    }

    load(url: ResURL): void {
        this.__url = url;
        if (!this.__url) {
            throw new Error("url is null");
        }
        if (typeof this.__url == "string") {
            assetManager.loadRemote(
                this.__url,
                (err: Error | null, asset: Asset) => {
                    if (err) {
                        this.emit(Event.ERROR, this.__url, err);
                        return;
                    }
                    const urlKey = Res.url2Key(url);
                    let res: Resource = new Resource();
                    res.key = urlKey;
                    res.content = asset;
                    ResourceManager.addRes(res);
                    this.emit(Event.COMPLETE, url);
                });
        } else {
            let bundle = assetManager.getBundle(this.__url.bundle);
            if (!bundle) {
                assetManager.loadBundle(
                    this.__url.bundle,
                    (err: Error | null, bundle: AssetManager.Bundle) => {
                        if (err) {
                            this.emit(Event.ERROR, this.__url, err);
                            return;
                        }
                        this.__load(this.__url!, bundle);
                    }
                );
            } else {
                this.__load(this.__url, bundle);
            }
        }
    }

    private __load(url: ResURL, bundle: AssetManager.Bundle): void {
        if (typeof url == "string") {
            throw new Error("未实现！");
        }
        let urlStr = Res.url2Path(url);
        bundle.load(
            urlStr,
            url.type,
            (finished: number, total: number) => {
                const progress = finished / total;
                this.emit(Event.PROGRESS, this.__url, undefined, progress);
            },
            (err: Error | null, asset: Asset) => {
                if (err) {
                    this.emit(Event.ERROR, url, err);
                    return;
                }
                const urlKey = Res.url2Key(url);
                let res: Resource = new Resource();
                res.key = urlKey;
                res.content = asset;
                ResourceManager.addRes(res);
                this.emit(Event.COMPLETE, url);
            }
        );
    }
}