/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export class UI_DifficultyButton extends fgui.GButton {

	public m_c1!:fgui.Controller;
	public static URL:string = "ui://dvjsr70cgssql";

	public static createInstance():UI_DifficultyButton {
		return <UI_DifficultyButton>(fgui.UIPackage.createObject("Settings", "DifficultyButton"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
	}
}
export class UI_SettingsWindow extends fgui.GComponent {

	public m_view!:UI_SettingsView;
	public static URL:string = "ui://dvjsr70cgssqn";

	public static createInstance():UI_SettingsWindow {
		return <UI_SettingsWindow>(fgui.UIPackage.createObject("Settings", "SettingsWindow"));
	}

	protected onConstruct():void {
		this.m_view = <UI_SettingsView>(this.getChild("view"));
	}
}
export class UI_SettingsView extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public m_btn_difficulty!:UI_DifficultyButton;
	public m_btn_exit!:fgui.GButton;
	public m_btn_back!:fgui.GButton;
	public m_sl_volume!:fgui.GSlider;
	public m_sl_music!:fgui.GSlider;
	public m_sl_sound!:fgui.GSlider;
	public m_btn_restart!:fgui.GButton;
	public static URL:string = "ui://dvjsr70cu33a0";

	public static createInstance():UI_SettingsView {
		return <UI_SettingsView>(fgui.UIPackage.createObject("Settings", "SettingsView"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
		this.m_btn_difficulty = <UI_DifficultyButton>(this.getChild("btn_difficulty"));
		this.m_btn_exit = <fgui.GButton>(this.getChild("btn_exit"));
		this.m_btn_back = <fgui.GButton>(this.getChild("btn_back"));
		this.m_sl_volume = <fgui.GSlider>(this.getChild("sl_volume"));
		this.m_sl_music = <fgui.GSlider>(this.getChild("sl_music"));
		this.m_sl_sound = <fgui.GSlider>(this.getChild("sl_sound"));
		this.m_btn_restart = <fgui.GButton>(this.getChild("btn_restart"));
	}
}

export class SettingsBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_DifficultyButton.URL, UI_DifficultyButton);
		fgui.UIObjectFactory.setExtension(UI_SettingsWindow.URL, UI_SettingsWindow);
		fgui.UIObjectFactory.setExtension(UI_SettingsView.URL, UI_SettingsView);
	}
}