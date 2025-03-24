import { JsonAsset, Node } from "cc";
import { ConfigManager, Engine, Event, Res, ResURL, Task } from "dream-cc-core";
import { GUIPlugin } from "dream-cc-gui";
import { LayerKeys } from "../consts/LayerKeys";
import { GamePath } from "../GamePath";
import { ConfigKeys } from "../configs/ConfigKeys";
import { UnitAnimationLoader } from "../res/UnitAnimationLoader";
import { TowerSkinLoader } from "../res/TowerSkinLoader";



export class EngineInitTask extends Task {

    constructor() {
        super();
    }

    start(data?: any): void {
        let node = data as Node;

        Res.sheet2URL = (sheet: string, type?: any, bundle?: string) => {
            return GamePath.sheetURL(sheet);
        };
        Res.url2Sheet = (url: ResURL) => {
            if (typeof url == "string") {
                return url;
            }
            return url.url.replace("configs/", "");
        }
        Res.setLoader("ani", UnitAnimationLoader);
        Res.setLoader("tower", TowerSkinLoader);
        
        //fgui插件
        let guiPlugin = new GUIPlugin();
        guiPlugin.init(
            node,
            {
                url: "configs/guiconfig",
                type: JsonAsset,
                bundle: "res"
            },
            {
                layers: [
                    LayerKeys.BattleDamage,
                    LayerKeys.FullScreen,
                    LayerKeys.Window,
                    LayerKeys.Pannel,
                    LayerKeys.Tooltip,
                    LayerKeys.Guide,
                    LayerKeys.Alert,
                ],
                fullScrene: [
                    LayerKeys.FullScreen
                ]
            },
            [
                { url: "ui/Basics", type: Res.TYPE.FGUI, bundle: "Basics" },
                { url: "ui/Home", type: Res.TYPE.FGUI, bundle: "Home" },
                GamePath.sheetURL(ConfigKeys.Language_Zh_cn)
            ]
        )

        Engine.start(
            [
                guiPlugin
            ],
            (progress: number) => {
                this.emit(Event.PROGRESS, undefined, undefined, progress);
            },
            (err: Error | null) => {
                if (err) {
                    this.emit(Event.ERROR, undefined, err);
                    return;
                }
                this.emit(Event.COMPLETE);
            }
        );
    }

    destroy(): boolean {
        return true;
    }
}