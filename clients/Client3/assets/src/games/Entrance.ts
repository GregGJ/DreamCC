import { Layers } from 'cc';
import { JsonAsset } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Engine } from 'dream-cc-core';
import { GUIManager, GUIPlugin, Layer, LoadingView } from 'dream-cc-gui';
import { LayerKeys } from './consts/LayerKeys';
import { GUIKeys } from './consts/GUIKeys';
const { ccclass, property } = _decorator;

@ccclass('Entrance')
export class Entrance extends Component {

    start() {
        //fgui插件
        let guiPlugin = new GUIPlugin();
        guiPlugin.init(
            this.node,
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
            }
        )

        Engine.start(
            [
                guiPlugin
            ],
            (progress: number) => {
                console.log(progress);
            },
            (err: Error | null) => {
                LoadingView.hide();
                GUIManager.open(GUIKeys.Home);
            }
        );
    }

    update(deltaTime: number) {
        Engine.tick(deltaTime);
    }
}