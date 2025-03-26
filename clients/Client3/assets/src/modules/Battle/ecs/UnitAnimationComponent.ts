import { Sprite } from "cc";
import { Res, ResRequest, ResURL, Timer } from "dream-cc-core";
import { DisplayComponent } from "dream-cc-ecs";
import { IAnimationData, UnitAnimationAsset } from "../../../games/res/UnitAnimationAsset";
import { Timeline } from "../utils/Timeline";




export class UnitAnimationComponent extends DisplayComponent {

    private __sprite: Sprite;
    private __asset: UnitAnimationAsset;
    private __url: ResURL;
    private __request: ResRequest;
    private __loaded: boolean = false;

    private __playing: boolean = false;
    private __aniName: string;
    private __loop: boolean;
    private __callback: () => void;
    private __startTime: number = 0;

    private __events: Map<string, boolean>;
    private __frameInterval: number = 1000 / 30;
    private __currentAniData: IAnimationData;
    private __frameTotal: number = 0;

    constructor() {
        super();
        this.__events = new Map<string, boolean>();
    }

    enable(): void {
        super.enable();
        this.__sprite = this.node.addComponent(Sprite);
    }

    reset(): void {
        super.reset();
        if (this.__request) {
            this.__request.dispose();
            this.__request = null;
        }
        this.__sprite = null;
        this.__url = null;
        this.__asset = null;
        this.__loaded = false;
        this.__playing = false;
        this.__aniName = "";
        this.__loop = false;
        this.__callback = null;
        this.__startTime = 0;
        this.__events.clear();
        this.__frameInterval = 1000 / 30;
        this.__currentAniData = null;
        this.__frameTotal = 0;
    }

    set url(v: ResURL) {
        this.__loaded = false;
        if (Res.urlEqual(this.__url, v)) {
            return;
        }
        this.__url = v;
        if (!this.__url) {
            return;
        }
        this.__request = Res.create(
            this.__url,
            "UnitAnimationComponent",
            undefined,
            (err?: Error) => {
                if (err) {
                    this.__request.dispose();
                    this.__request = null;
                    return;
                }
                let ref = this.__request.getRef();
                this.__asset = ref.content;
                this.__loaded = true;
                if (this.__playing) {
                    this.__play();
                }
            }
        );
        this.__request.load();
    }

    get url(): ResURL {
        return this.__url;
    }

    set frameInterval(v: number) {
        this.__frameInterval = v;
    }

    get frameInterval(): number {
        return this.__frameInterval;
    }

    play(aniName: string, loop: boolean = false, callback?: () => void): void {
        this.__aniName = aniName;
        this.__loop = loop;
        this.__callback = callback;
        this.__startTime = Timeline.single.currentTime;
        this.__events.clear();
        this.__playing = true;
        if (this.__loaded) {
            this.__play();
        }
    }

    private __play(): void {
        this.__currentAniData = this.__asset.actions.get(this.__aniName);
        this.__frameTotal = this.__currentAniData.to + 1 - this.__currentAniData.from;
    }

    tick(dt: number): void {
        if (!this.__playing || !this.__loaded) {
            return;
        }
        if (!this.__asset || !this.__sprite) {
            return;
        }
        let currentTime = Timeline.single.currentTime;
        let passTime = currentTime - this.__startTime;
        //通过时间计算出当前帧
        let frame = Math.floor(passTime / this.__frameInterval);
        if (this.__loop) {
            if (frame >= this.__frameTotal) {
                this.__events.clear();
            }
            frame = frame % this.__frameTotal;
        } else {
            if (frame >= this.__frameTotal) {
                frame = this.__frameTotal - 1;
                this.__playing = false;
                if (this.__callback) {
                    this.__callback();
                    this.__callback = null;
                }
            }
        }
        if (this.__currentAniData.events && this.__currentAniData.events.length > 0) {
            let list = this.__currentAniData.events;
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                if (this.__events.has(element.key)) {
                    continue;
                }
                if (currentTime - this.__startTime > element.time) {
                    this.__events.set(element.key, true);
                }
            }
        }
        const atlas = this.__asset!.getSpriteAtlas(this.__aniName!, frame);
        if (this.__sprite.spriteAtlas != atlas) {
            this.__sprite.spriteAtlas = atlas;
        }
        const frameName = this.__asset.getFrameName(this.__aniName!, frame);
        if (!frameName) {
            return;
        }
        this.__sprite.changeSpriteFrameFromAtlas(frameName);
    }
}