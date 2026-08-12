import { instantiate, Node, ProgressBar } from "cc";
import { Res, ResRequest, ResURL } from "dream-cc-core";
import { ECSComponent } from "dream-cc-ecs";




export class HPBarComponent extends ECSComponent {

    private __hpBar: ProgressBar;
    private __hpBarNode: Node;
    private __url: ResURL;
    private __request: ResRequest;
    constructor() {
        super();
    }

    enable(): void {
        super.enable();
    }

    reset(): void {
        super.reset();
        if (this.__request) {
            this.__request.dispose();
            this.__request = null;
        }
        if (this.__hpBarNode) {
            this.__hpBarNode.destroy();
            this.__hpBarNode = null;
            this.__hpBar = null;
        }
        this.__url = null;
    }


    set url(v: ResURL) {
        if (Res.urlEqual(this.__url, v)) {
            return;
        }
        if (this.__request) {
            this.__request.dispose();
            this.__request = null;
        }
        this.__url = v;
        if (!this.__url) {
            return;
        }
        this.__request = Res.create(
            this.__url,
            "HPBarComponent",
            undefined,
            (err?: Error) => {
                if (err) {
                    this.__request.dispose();
                    this.__request = null;
                    return;
                }
                let ref = this.__request.getRef();
                this.__hpBarNode = instantiate(ref.content);
                this.__hpBar = this.__hpBarNode.getComponent(ProgressBar);
                this.__hpBarNode.setSiblingIndex(0);
                this.markDirtied();
            }
        );
        this.__request.load();
    }

    get hpBar(): ProgressBar {
        return this.__hpBar;
    }

    get hpBarNode(): Node {
        return this.__hpBarNode;
    }
}