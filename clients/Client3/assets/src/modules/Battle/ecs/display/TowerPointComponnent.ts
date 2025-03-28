import { DisplayComponent } from "dream-cc-ecs";
import { BattleModel } from "../../datas/BattleModel";
import { GamePath } from "../../../../games/GamePath";
import { Prefab } from "cc";
import { Res, ResRequest, ResURL } from "dream-cc-core";
import { Node } from "cc";
import { Button } from "cc";
import { instantiate } from "cc";
import { EventTouch } from "cc";



export class TowerPointComponnent extends DisplayComponent {

    private __data: { id: string, type: number, x: number, y: number };
    private __url: ResURL;
    private __request: ResRequest;

    private __view: Node;
    private __button: Button;

    constructor() {
        super();
    }

    set config(data: { id: string, type: number, x: number, y: number }) {
        this.__data = data;
        const url = GamePath.battleURL("ui/build_terrains/build_terrain_" + data.type, Prefab);
        if (Res.urlEqual(this.__url, url)) {
            return;
        }
        this.__url = url;
        if (!this.__url) {
            return;
        }
        if (this.__request) {
            this.__request.dispose();
            this.__request = null;
        }
        this.__request = Res.create(
            this.__url,
            "ImageComponent",
            undefined,
            (err?: Error) => {
                if (err) {
                    this.__request.dispose();
                    this.__request = null;
                    return;
                }
                let ref = this.__request.getRef();

                this.__view = instantiate(ref.content);
                this.__button = this.__view.getComponent(Button);
                this.__view.on(Node.EventType.TOUCH_END, this.__touchEnd, this);
                this.node.addChild(this.__view);
            }
        )
        this.__request.load();
    }

    get config(): { id: string, type: number, x: number, y: number } {
        return this.__data;
    }

    reset(): void {
        super.reset();
        if (this.__request) {
            this.__request.dispose();
            this.__request = null;
        }
        this.__url = null;
        this.__data = null;
        this.__button = null;

        this.__view.off(Node.EventType.TOUCH_START, this.__touchEnd, this);
        this.__view.destroy();
        this.__view = null;
    }
    
    private __touchEnd(e: EventTouch): void {
        console.log("__touchEnd", this.__data);
        // let pos = this.node.getPosition();
        // GUIManager.Open(GUIKeys.BuildMenu,
        //     {
        //         x: pos.x * NodeUtils.scaleX,
        //         y: -pos.y * NodeUtils.scaleY,
        //         data: MenuUtils.GetBuildMenu(this.__data.id)
        //     }
        // );
    }
}