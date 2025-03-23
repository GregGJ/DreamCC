import { _decorator, Component } from 'cc';
import { AudioManager } from 'dream-cc-core';
import { GUIManager, GUIMediator, IGUIMediator, IViewCreator } from 'dream-cc-gui';
import { GamePath } from '../../games/GamePath';
import { MapBinder, UI_Map } from "./MapBinder";
import { DragMeditor } from './sub/DragMeditor';
import { FlagsMeditor } from './sub/FlagsMeditor';
import { ConfigKeys } from '../../games/configs/ConfigKeys';
import { FGUIEvent } from 'fairygui-cc';
import { GUIKeys } from '../../games/consts/GUIKeys';
import { ModuleKeys } from '../../games/ModuleKeys';

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
        this.configs = [
            ConfigKeys.Level_Level,
            ConfigKeys.Maps_MapPath
        ];
        this.assets = [
            GamePath.soundURL("MusicMap")
        ];
        this.modules = [
            ModuleKeys.Playerprefs
        ]
    }

    init() {
        super.init();
        this.$subMediators = [
            new DragMeditor(this.ui, this),
            new FlagsMeditor(this.ui, this)
        ]
        this.bindEvent(this.view.m_btn_config, FGUIEvent.CLICK, this.__settingsButtonClick, this);
    }

    show(data?: any): void {
        super.show(data);

        AudioManager.playMusic(GamePath.soundURL("MusicMap"));
    }

    showedUpdate(data?: any): void {

    }

    private __settingsButtonClick(e: FGUIEvent): void {
        GUIManager.open(GUIKeys.Settings, { state: 1, close: this.__settingsClose.bind(this) });
    }

    hide(): void {
        super.hide();

    }

    destroy(): void {
        super.destroy();

    }

    private __settingsClose(value: number): void {
        if (value == 1) {
            this.close(true);
        }
    }

    private get view(): UI_Map {
        return this.ui as UI_Map;
    }
}
