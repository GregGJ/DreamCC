import { AssetManager, assetManager } from "cc";
import { FGUIResource } from "./FGUIResource";
import { UIPackage } from "fairygui-cc";
import { Event, EventDispatcher, ILoader, Res, ResourceManager, ResURL } from "dream-cc-core";


export class FGUILoader extends EventDispatcher implements ILoader {

    url: ResURL;

    constructor() {
        super();
    }

    load(url: ResURL): void {
        this.url = url;
        if (typeof url == "string") {
            throw new Error("未实现：" + url);
        } else {
            let bundle = assetManager.getBundle(url.bundle);
            let self = this;
            if (!bundle) {
                assetManager.loadBundle(url.bundle, (err: Error, bundle: AssetManager.Bundle) => {
                    if (err) {
                        self.emit(Event.ERROR, url, err);
                        return;
                    }
                    self.loadUIPackge(url, bundle);
                });
            } else {
                self.loadUIPackge(url, bundle);
            }
        }
    }

    private loadUIPackge(url: ResURL, bundle: AssetManager.Bundle): void {
        if (typeof url == "string") {
            throw new Error("未实现：" + url);
        }
        let self = this;
        UIPackage.loadPackage(bundle, url.url,
            (finish: number, total: number, item: AssetManager.RequestItem) => {
                const progress: number = finish / total;
                self.emit(Event.PROGRESS, url, undefined, progress);
            },
            (err: Error, pkg: UIPackage) => {
                if (err) {
                    self.emit(Event.ERROR, url, err);
                    return;
                }
                const urlKey = Res.url2Key(url);
                let res = new FGUIResource();
                res.key = urlKey;
                res.content = pkg;
                ResourceManager.addRes(res);
                self.emit(Event.COMPLETE, url);
            });
    }

    reset(): void {
        this.url = null;
    }
}