import { _decorator, Component } from 'cc';
import { IGUIMediator, IViewCreator, GUIMediator, ITabData, GUIManager } from 'dream-cc-gui';
import { ArrayProperty, AudioManager, DictionaryProperty, NumberProperty } from 'dream-cc-core';
import { GamePath } from '../../games/GamePath';
import { ModuleKeys } from '../../games/ModuleKeys';
import { EXI_Playerprefs } from '../../models_exi/EXI_Playerprefs';
import { HomeBinder, UI_Home, UI_NewGame, UI_SlotButton } from './HomeBinder';
import { FGUIEvent, GList, GObject } from 'fairygui-cc';
import { RecordPropertys } from '../../models/playerPrefs/RecordPropertys';
import { GUIKeys } from '../../games/consts/GUIKeys';

const { ccclass, property } = _decorator;

@ccclass('HomeViewCreator')
export default class HomeViewCreator extends Component implements IViewCreator {

    createMediator(): IGUIMediator {
        HomeBinder.bindAll();
        return new HomeMediator();
    }
}

export class HomeMediator extends GUIMediator {

    constructor() {
        super();
        this.showLoadingView = true;
        this.assets = [
            GamePath.soundURL("MusicMainMenu")
        ];
        this.modules = [
            ModuleKeys.Playerprefs
        ]
    }

    init() {
        super.init();
        this.bindEvent(this.view.m_menu.m_menu001.m_btn_start, FGUIEvent.CLICK, this.__startButtonClick, this);
        this.bindEvent(this.view.m_menu.m_menu001.m_btn_options, FGUIEvent.CLICK, this.__optionButtonClick, this);


        this.listView.itemRenderer = this.__recordListItemRenderer.bind(this);
        this.listView.backToPool = this.__recordListItemBackToPool.bind(this);
    }

    show(data?: ITabData): void {
        super.show(data);
        this.view.m_logo.playing = true;
        this.view.m_logo.setPlaySettings(0, -1, 1);

        AudioManager.playMusic(GamePath.soundURL("MusicMainMenu"));
        this.recordModule.clear();
        this.__refreshRecord();
    }

    showedUpdate(data?: any): void {

    }

    hide(): void {
        super.hide();

    }

    destroy(): void {
        super.destroy();

    }

    /**
     * 开始按钮点击事件
     */
    private __startButtonClick(): void {
        let index: number = this.view.m_menu.m_c1.selectedIndex == 1 ? 0 : 1;
        this.view.m_menu.m_c1.selectedIndex = index;
    }

    private __optionButtonClick(): void {
        console.log("option button click");
    }

    private __refreshRecord(): void {
        let list = this.recordModule.playerRecord.get(RecordPropertys.GAMES) as ArrayProperty;
        this.listView.numItems = list.length + 1;
    }

    private __recordListItemRenderer(index: number, item: GObject): void {
        this.__recordListItemBackToPool(item);
        let itemView = item as UI_NewGame;
        let list = this.recordModule.playerRecord.get(RecordPropertys.GAMES) as ArrayProperty;
        if (index < list.length) {
            let p_record = list.getAt(index) as DictionaryProperty;
            itemView.data = p_record;
            itemView.m_c1.selectedIndex = 1;
        } else {
            itemView.data = null;
            itemView.m_c1.selectedIndex = 0;
        }
        this.bindEvent(itemView.m_btn_new_game, FGUIEvent.CLICK, this.__newGameButtonClick, this);
        this.bindEvent(itemView.m_btn_slot, FGUIEvent.CLICK, this.__slotClick, this);
        this.bindEvent(itemView.m_btn_slot.m_btn_close, FGUIEvent.CLICK, this.__slotCloseClick, this);
    }

    private __recordListItemBackToPool(item: GObject): void {
        let itemView = item as UI_NewGame;
        itemView.data = null;
        itemView.m_c1.selectedIndex = 0;
        this.unbindEvent(itemView.m_btn_new_game, FGUIEvent.CLICK, this.__newGameButtonClick, this);
        this.unbindEvent(itemView.m_btn_slot, FGUIEvent.CLICK, this.__slotClick, this);
        this.unbindEvent(itemView.m_btn_slot.m_btn_close, FGUIEvent.CLICK, this.__slotCloseClick, this);
    }

    private __newGameButtonClick(): void {
        this.recordModule.createGameRecord();
        this.recordModule.save();
        this.__refreshRecord();
    }

    private __slotClick(e:FGUIEvent): void {
        const target = GObject.cast(e.currentTarget) as UI_SlotButton;
        const newGame = target.parent as UI_NewGame;
        this.recordModule.currentLevel = newGame.data;
        console.log("读取游戏记录并开始游戏");
        GUIManager.open(GUIKeys.Map);
    }

    private __slotCloseClick(e:FGUIEvent): void {
        e.propagationStopped=true;
        const target=GObject.cast(e.currentTarget).asCom;
        const slotButton = target.parent as UI_SlotButton;
        const newGame = slotButton.parent as UI_NewGame;
        const data=newGame.data as DictionaryProperty;
        this.recordModule.removeGameRecord(data);
        this.__refreshRecord();
    }

    private get view(): UI_Home {
        return this.ui as UI_Home;
    }

    private get listView(): GList {
        return this.view.m_menu.m_menu002.m_list;
    }

    private get recordModule(): EXI_Playerprefs.Module_playerPrefs {
        return <any>this.getModule(ModuleKeys.Playerprefs) as EXI_Playerprefs.Module_playerPrefs;
    }
}