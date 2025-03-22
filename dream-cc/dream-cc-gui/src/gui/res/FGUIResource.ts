import { assetManager } from "cc";
import { Res, Resource } from "dream-cc-core";
import { UIPackage } from "fairygui-cc";


export class FGUIResource extends Resource {

    constructor() {
        super();
    }

    /**
     * 销毁
     */
    destroy(): boolean {
        let url = Res.key2Url(this.key);
        if (typeof url != "string") {
            UIPackage.removePackage(url.url);
            let bundle = assetManager.getBundle(url.bundle);
            let asset = bundle.get(url.url);
            assetManager.releaseAsset(asset);
        } else {
            throw new Error("未处理的Fguipackage销毁！");
        }
        return super.destroy();
    }
}