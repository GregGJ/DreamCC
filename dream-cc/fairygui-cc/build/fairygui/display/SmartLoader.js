import { SpriteFrame, Texture2D } from "cc";
import { GLoader } from "../GLoader";
import { Logger, Res } from "dream-cc-core";
export class SmartLoader extends GLoader {
    constructor() {
        super();
        this.refKey = "SmartLoader";
        this.__resRequest = null;
    }
    loadExternal() {
        if (typeof this.url == "string") {
            super.loadExternal();
            return;
        }
        if (this.__spriteFrame) {
            this.__spriteFrame.destroy();
            this.__spriteFrame = null;
        }
        if (this.__resRequest) {
            this.__resRequest.dispose();
            this.__resRequest = null;
        }
        this.__resRequest = Res.create(this.url, this.refKey, undefined, (err) => {
            if (err) {
                this.__resRequest.dispose();
                this.__resRequest = null;
                Logger.error("SmartLoader Error:" + err.message);
                this.loadedCallback && this.loadedCallback(this, err);
                this.loadedCallback = null;
                return;
            }
            let ref = this.__resRequest.getRef();
            if (ref.content instanceof Texture2D) {
                this.__spriteFrame = new SpriteFrame();
                this.__spriteFrame.texture = ref.content;
                this.onExternalLoadSuccess(this.__spriteFrame);
            }
            else {
                this.onExternalLoadSuccess(ref.content);
            }
            this.loadedCallback && this.loadedCallback(this, null);
            this.loadedCallback = null;
        });
        this.__resRequest.load();
    }
    freeExternal(texture) {
        if (this.__spriteFrame) {
            this.__spriteFrame.destroy();
            this.__spriteFrame = null;
        }
        if (this.__resRequest) {
            this.__resRequest.dispose();
            this.__resRequest = null;
        }
    }
}
