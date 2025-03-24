import { AssetManager, JsonAsset, SpriteAtlas, SpriteFrame, assetManager } from "cc";
import { UnitAnimationAsset } from "./UnitAnimationAsset";
import { Event, EventDispatcher, ILoader, Res, Resource, ResourceManager, ResRequest, ResURL, StringUtils } from "dream-cc-core";


/**
 * 动画加载器
 */
export class UnitAnimationLoader extends EventDispatcher implements ILoader {

    private __url: ResURL | null = null;
    private __bundle: AssetManager.Bundle | null = null;

    constructor() {
        super();
    }

    load(url: ResURL): void {
        if (typeof url == "string") {
            throw new Error("未实现：" + url);
        }
        this.__url = url;
        let bundle = assetManager.getBundle(url.bundle);
        if (!bundle) {
            assetManager.loadBundle(url.bundle, (err, bundle) => {
                if (err) {
                    this.emit(Event.ERROR, url, err);
                    return;
                }
                this.__load(bundle);
            })
        } else {
            this.__load(bundle);
        }
    }

    private __load(bundle: AssetManager.Bundle): void {
        if (typeof this.__url == "string") {
            throw new Error("动画url不能为string");
        }
        this.__bundle = bundle;
        this.__bundle.load(this.__url!.url, JsonAsset, this.__bundleLoaded.bind(this));
    }

    private __bundleLoaded(err: Error | null, asset: JsonAsset | null): void {
        if (err) {
            this.emit(Event.ERROR, this.__url, err);
            return;
        }
        this.__parseJson(asset!);
    }

    private __parseJson(asset: JsonAsset): void {
        let data = asset.json;
        if (data == null || this.__dataIsEmpty(data)) {
            this.emit(Event.ERROR, this.__url, new Error("数据结构错误!"));
            return;
        }
        if (typeof this.__url == "string") {
            return;
        }
        let dir: string = StringUtils.getDir(this.__url!.url);
        let urls: Array<ResURL> = [];
        for (let index = 0; index < data.textures.length; index++) {
            const textureName: string = data.textures[index];
            urls.push({
                url: dir + "/textures/" + textureName.replace(".png", ""),
                type: SpriteAtlas,
                bundle: this.__url!.bundle,
                isSub: true
            });
        }

        let request = Res.create(
            urls,
            "Battle",
            (progress: number) => {
                this.emit(Event.PROGRESS, this.__url, undefined, progress)
            },
            (err?: Error) => {
                if (err) {
                    request.dispose();
                    this.emit(Event.ERROR, this.__url, err);
                    return;
                }
                this.__parseAnimationClip(data, request);
            }
        );
        request.load();
    }

    private __parseAnimationClip(data: any, request: ResRequest): void {
        let res: Resource = new Resource();
        res.key = Res.url2Key(this.__url!);
        res.content = new UnitAnimationAsset(data, request);
        ResourceManager.addRes(res);
        this.emit(Event.COMPLETE, this.__url);
    }

    private __dataIsEmpty(data: any): boolean {
        return data["actions"] == null || data["actions"].length == 0 || data["textures"] == null || data["textures"].length == 0
    }

    reset(): void {
        this.__url = null;
        this.__bundle = null;
    }
}