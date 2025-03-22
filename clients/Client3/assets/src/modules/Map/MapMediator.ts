import { _decorator, Component } from 'cc';
import { IGUIMediator,IViewCreator,GUIMediator, ITabData} from 'dream-cc-gui';
import { MapBinder, UI_Map } from "./MapBinder";
import { AudioManager } from 'dream-cc-core';
import { GamePath } from '../../games/GamePath';

const { ccclass, property } = _decorator;

@ccclass('MapViewCreator')
export default class MapViewCreator extends Component implements IViewCreator {

    createMediator(): IGUIMediator {
        MapBinder.bindAll();
        return new MapMediator();
    }
}

export class MapMediator extends GUIMediator {

    constructor() {
        super();
        this.showLoadingView = true;
        this.assets = [
            GamePath.soundURL("MusicMap")
        ]
    }

    init() {
        super.init();

    }

    show(data?: ITabData): void {
        super.show(data);

        AudioManager.playMusic(GamePath.soundURL("MusicMap"));
    }

    showedUpdate(data?: any): void {

    }

    hide(): void {
        super.hide();

    }

    destroy(): void {
        super.destroy();

    }

    private get view(): UI_Map {
        return this.ui as UI_Map;
    }
}
