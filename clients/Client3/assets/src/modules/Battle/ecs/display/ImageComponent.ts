import { UITransform } from "cc";
import { Sprite } from "cc";
import { Res, ResRequest, ResURL } from "dream-cc-core";
import { DisplayComponent } from "dream-cc-ecs";



export class ImageComponent extends DisplayComponent {

    private __sprite: Sprite;
    private __uiTrans: UITransform;
    private __url: ResURL;
    private __reqeust: ResRequest;
    constructor() {
        super();
    }

    enable(): void {
        super.enable();
        this.__sprite = this.node.addComponent(Sprite);
        this.__uiTrans = this.node.getComponent(UITransform);
        this.__uiTrans.setAnchorPoint(0, 1);
    }

    set url(v: ResURL) {
        if (Res.urlEqual(this.__url, v)) {
            return;
        }
        this.__url = v;
        //清除老的请求
        if (this.__reqeust) {
            this.__reqeust.dispose();
            this.__reqeust = null;
        }
        if (!this.__url) {
            return;
        }
        this.__reqeust = Res.create(
            this.__url,
            "ImageComponent",
            undefined,
            (err?: Error) => {
                if (err) {
                    this.__reqeust.dispose();
                    this.__reqeust = null;
                    return;
                }
                let ref = this.__reqeust.getRef();
                this.__sprite.spriteFrame = ref.content;
            }
        )
        this.__reqeust.load();
    }

    get url(): ResURL {
        return this.__url;
    }

    reset(): void {
        super.reset();
        if (this.__reqeust) {
            this.__reqeust.dispose();
            this.__reqeust = null;
        }
        this.__url = null;
        this.__sprite = null;
        this.__uiTrans = null;
    }

    destroy(): boolean {
        if (super.destroy()) {
            this.reset();
            this.__sprite.destroy();
            this.__sprite = null;
            return true;
        }
        return false;
    }
}