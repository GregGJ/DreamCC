import { _decorator, Component } from 'cc';
import { GUIMediator, IGUIMediator, IViewCreator } from 'dream-cc-gui';
import { SettingsBinder, UI_SettingsView, UI_SettingsWindow } from './SettingsBinder';
import { FGUIEvent } from 'fairygui-cc';
import { ModuleKeys } from '../../games/ModuleKeys';
import { AudioManager } from 'dream-cc-core';
import { EXI_Playerprefs } from '../../models_exi/EXI_Playerprefs';
import { RecordPropertys } from '../../models/playerPrefs/RecordPropertys';

const { ccclass, property } = _decorator;

@ccclass('SettingsViewCreator')
export default class SettingsViewCreator extends Component implements IViewCreator {

    createMediator(): IGUIMediator {
        SettingsBinder.bindAll();
        return new SettingsMediator();
    }
}

export class SettingsMediator extends GUIMediator {

    private __closeHandler: { (value: number): void } | null = null;
    constructor() {
        super();
        this.modules = [
            ModuleKeys.Playerprefs
        ]
    }

    init() {
        super.init();
        this.bindEvent(this.view.m_sl_volume, FGUIEvent.STATUS_CHANGED, this.__volumeValueChanged, this);
        this.bindEvent(this.view.m_sl_music, FGUIEvent.STATUS_CHANGED, this.__musicValueChanged, this);
        this.bindEvent(this.view.m_sl_sound, FGUIEvent.STATUS_CHANGED, this.__soundValueChanged, this);

        this.bindEvent(this.view.m_btn_back, FGUIEvent.CLICK, this.__backButtonClick, this);
        this.bindEvent(this.view.m_btn_exit, FGUIEvent.CLICK, this.__exitButtonClick, this);
        this.bindEvent(this.view.m_btn_restart, FGUIEvent.CLICK, this.__restartButtonClick, this);
        this.bindEvent(this.view.m_btn_difficulty, FGUIEvent.CLICK, this.__difficultyButtonClick, this);
    }

    show(data?: any): void {
        super.show(data);
        if (data == null) {
            this.view.m_c1.selectedIndex = 0;
        } else {
            this.view.m_c1.selectedIndex = data.state;
            this.__closeHandler = data.close;
        }

        //将音量数据更新到界面
        let volume = this.recordModule.playerRecord.get(RecordPropertys.VOLUME).value;
        this.view.m_sl_volume.value = volume * 100;

        let music_volume = this.recordModule.playerRecord.get(RecordPropertys.MUSIC_VOLUME).value;
        this.view.m_sl_music.value = music_volume * 100;

        let sound_volume = this.recordModule.playerRecord.get(RecordPropertys.SOUND_VOLUME).value;
        this.view.m_sl_sound.value = sound_volume * 100;

        //难度
        let difficulty = this.recordModule.playerRecord.get(RecordPropertys.DIFFICULTY).value;
        this.view.m_btn_difficulty.m_c1.selectedIndex = difficulty;
    }

    showedUpdate(data?: any): void {

    }

    hide(): void {
        super.hide();
        this.__closeHandler = null;
    }

    destroy(): void {
        super.destroy();
    }

    private __backButtonClick(e: FGUIEvent): void {
        if (this.__closeHandler != null) {
            this.__closeHandler(0);
        }
        this.close();
    }

    private __exitButtonClick(e: FGUIEvent): void {
        if (this.__closeHandler != null) {
            this.__closeHandler(1);
        }
        this.close();
    }

    private __restartButtonClick(e: FGUIEvent): void {
        if (this.__closeHandler != null) {
            this.__closeHandler(2);
        }
        this.close();
    }

    private __difficultyButtonClick(e: FGUIEvent): void {
        let index: number = this.view.m_btn_difficulty.m_c1.selectedIndex;
        index = (index + 1) % 3;
        this.view.m_btn_difficulty.m_c1.selectedIndex = index;
        this.recordModule.playerRecord.update(RecordPropertys.DIFFICULTY, index);
        this.recordModule.save();
    }

    private __volumeValueChanged(e: FGUIEvent): void {
        AudioManager.volume = this.view.m_sl_volume.value / 100;
        this.recordModule.playerRecord.update(RecordPropertys.VOLUME, AudioManager.volume);
        this.recordModule.save();
    }

    private __musicValueChanged(e: FGUIEvent): void {
        AudioManager.musicVolume = this.view.m_sl_music.value / 100;
        this.recordModule.playerRecord.update(RecordPropertys.MUSIC_VOLUME, AudioManager.musicVolume);
        this.recordModule.save();
    }

    private __soundValueChanged(e: FGUIEvent): void {
        AudioManager.soundVolume = this.view.m_sl_sound.value / 100;
        this.recordModule.playerRecord.update(RecordPropertys.SOUND_VOLUME, AudioManager.soundVolume);
        this.recordModule.save();
    }

    private get view(): UI_SettingsView {
        return (this.ui as UI_SettingsWindow).m_view as UI_SettingsView;
    }

    private get recordModule(): EXI_Playerprefs.Module_playerPrefs {
        return <any>this.getModule(ModuleKeys.Playerprefs) as EXI_Playerprefs.Module_playerPrefs;
    }
}
