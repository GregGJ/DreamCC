/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export class UI_BuildButton extends fgui.GButton {

	public m_img_up!:fgui.GLoader;
	public m_img_disabled!:fgui.GLoader;
	public static URL:string = "ui://xqz4mczv97pi8e";

	public static createInstance():UI_BuildButton {
		return <UI_BuildButton>(fgui.UIPackage.createObject("Battle", "BuildButton"));
	}

	protected onConstruct():void {
		this.m_img_up = <fgui.GLoader>(this.getChild("img_up"));
		this.m_img_disabled = <fgui.GLoader>(this.getChild("img_disabled"));
	}
}
export class UI_UpLevelButton extends fgui.GButton {

	public m_img_up!:fgui.GLoader;
	public m_img_disabled!:fgui.GLoader;
	public static URL:string = "ui://xqz4mczv97pi8j";

	public static createInstance():UI_UpLevelButton {
		return <UI_UpLevelButton>(fgui.UIPackage.createObject("Battle", "UpLevelButton"));
	}

	protected onConstruct():void {
		this.m_img_up = <fgui.GLoader>(this.getChild("img_up"));
		this.m_img_disabled = <fgui.GLoader>(this.getChild("img_disabled"));
	}
}
export class UI_SoldButton extends fgui.GButton {

	public m_bg!:fgui.GImage;
	public static URL:string = "ui://xqz4mczv97pi8o";

	public static createInstance():UI_SoldButton {
		return <UI_SoldButton>(fgui.UIPackage.createObject("Battle", "SoldButton"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GImage>(this.getChild("bg"));
	}
}
export class UI_RallyButton extends fgui.GButton {

	public m_up!:fgui.GImage;
	public static URL:string = "ui://xqz4mczv97pi8r";

	public static createInstance():UI_RallyButton {
		return <UI_RallyButton>(fgui.UIPackage.createObject("Battle", "RallyButton"));
	}

	protected onConstruct():void {
		this.m_up = <fgui.GImage>(this.getChild("up"));
	}
}
export class UI_MeneWindow extends fgui.GComponent {

	public m_ui_view!:UI_MeneView;
	public m_ui_circle!:fgui.GComponent;
	public static URL:string = "ui://xqz4mczv97pi8s";

	public static createInstance():UI_MeneWindow {
		return <UI_MeneWindow>(fgui.UIPackage.createObject("Battle", "MeneWindow"));
	}

	protected onConstruct():void {
		this.m_ui_view = <UI_MeneView>(this.getChild("ui_view"));
		this.m_ui_circle = <fgui.GComponent>(this.getChild("ui_circle"));
	}
}
export class UI_DefeatedView extends fgui.GComponent {

	public m_btn_restart!:fgui.GButton;
	public m_btn_exit!:fgui.GButton;
	public m_txt_info!:fgui.GTextField;
	public static URL:string = "ui://xqz4mczv9btn42";

	public static createInstance():UI_DefeatedView {
		return <UI_DefeatedView>(fgui.UIPackage.createObject("Battle", "DefeatedView"));
	}

	protected onConstruct():void {
		this.m_btn_restart = <fgui.GButton>(this.getChild("btn_restart"));
		this.m_btn_exit = <fgui.GButton>(this.getChild("btn_exit"));
		this.m_txt_info = <fgui.GTextField>(this.getChild("txt_info"));
	}
}
export class UI_DefeatedWindow extends fgui.GComponent {

	public m_ui_view!:UI_DefeatedView;
	public static URL:string = "ui://xqz4mczv9btn43";

	public static createInstance():UI_DefeatedWindow {
		return <UI_DefeatedWindow>(fgui.UIPackage.createObject("Battle", "DefeatedWindow"));
	}

	protected onConstruct():void {
		this.m_ui_view = <UI_DefeatedView>(this.getChild("ui_view"));
	}
}
export class UI_SettlementView extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public m_btn_continue!:fgui.GButton;
	public m_txt_title!:fgui.GTextField;
	public m_ani_star!:fgui.GMovieClip;
	public static URL:string = "ui://xqz4mczv9btn5p";

	public static createInstance():UI_SettlementView {
		return <UI_SettlementView>(fgui.UIPackage.createObject("Battle", "SettlementView"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
		this.m_btn_continue = <fgui.GButton>(this.getChild("btn_continue"));
		this.m_txt_title = <fgui.GTextField>(this.getChild("txt_title"));
		this.m_ani_star = <fgui.GMovieClip>(this.getChild("ani_star"));
	}
}
export class UI_SettlementWindow extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public m_ui_view!:UI_SettlementView;
	public static URL:string = "ui://xqz4mczv9btn5r";

	public static createInstance():UI_SettlementWindow {
		return <UI_SettlementWindow>(fgui.UIPackage.createObject("Battle", "SettlementWindow"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
		this.m_ui_view = <UI_SettlementView>(this.getChild("ui_view"));
	}
}
export class UI_BattleView extends fgui.GComponent {

	public m_ui_top!:UI_TopUI;
	public m_ui_bottom!:UI_BottomUI;
	public static URL:string = "ui://xqz4mczvd1aq0";

	public static createInstance():UI_BattleView {
		return <UI_BattleView>(fgui.UIPackage.createObject("Battle", "BattleView"));
	}

	protected onConstruct():void {
		this.m_ui_top = <UI_TopUI>(this.getChild("ui_top"));
		this.m_ui_bottom = <UI_BottomUI>(this.getChild("ui_bottom"));
	}
}
export class UI_BottomUI extends fgui.GComponent {

	public m_ui_start!:UI_StartButtonGroup;
	public static URL:string = "ui://xqz4mczvid0z3c";

	public static createInstance():UI_BottomUI {
		return <UI_BottomUI>(fgui.UIPackage.createObject("Battle", "BottomUI"));
	}

	protected onConstruct():void {
		this.m_ui_start = <UI_StartButtonGroup>(this.getChild("ui_start"));
	}
}
export class UI_RangeCircleView1 extends fgui.GComponent {

	public m_view!:fgui.GComponent;
	public static URL:string = "ui://xqz4mczvksqm8z";

	public static createInstance():UI_RangeCircleView1 {
		return <UI_RangeCircleView1>(fgui.UIPackage.createObject("Battle", "RangeCircleView1"));
	}

	protected onConstruct():void {
		this.m_view = <fgui.GComponent>(this.getChild("view"));
	}
}
export class UI_RangeCircleView2 extends fgui.GComponent {

	public m_view!:fgui.GComponent;
	public static URL:string = "ui://xqz4mczvksqm90";

	public static createInstance():UI_RangeCircleView2 {
		return <UI_RangeCircleView2>(fgui.UIPackage.createObject("Battle", "RangeCircleView2"));
	}

	protected onConstruct():void {
		this.m_view = <fgui.GComponent>(this.getChild("view"));
	}
}
export class UI_MeneView extends fgui.GComponent {

	public m_bg!:fgui.GImage;
	public m_content!:fgui.GComponent;
	public static URL:string = "ui://xqz4mczvptu95t";

	public static createInstance():UI_MeneView {
		return <UI_MeneView>(fgui.UIPackage.createObject("Battle", "MeneView"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GImage>(this.getChild("bg"));
		this.m_content = <fgui.GComponent>(this.getChild("content"));
	}
}
export class UI_TopUI extends fgui.GComponent {

	public m_ui_info!:UI_InfoUI;
	public m_btn_pause!:fgui.GButton;
	public static URL:string = "ui://xqz4mczvu6wq3o";

	public static createInstance():UI_TopUI {
		return <UI_TopUI>(fgui.UIPackage.createObject("Battle", "TopUI"));
	}

	protected onConstruct():void {
		this.m_ui_info = <UI_InfoUI>(this.getChild("ui_info"));
		this.m_btn_pause = <fgui.GButton>(this.getChild("btn_pause"));
	}
}
export class UI_InfoUI extends fgui.GComponent {

	public m_txt_hp!:fgui.GTextField;
	public m_txt_gold!:fgui.GTextField;
	public m_txt_wave!:fgui.GTextField;
	public static URL:string = "ui://xqz4mczvu6wq3u";

	public static createInstance():UI_InfoUI {
		return <UI_InfoUI>(fgui.UIPackage.createObject("Battle", "InfoUI"));
	}

	protected onConstruct():void {
		this.m_txt_hp = <fgui.GTextField>(this.getChild("txt_hp"));
		this.m_txt_gold = <fgui.GTextField>(this.getChild("txt_gold"));
		this.m_txt_wave = <fgui.GTextField>(this.getChild("txt_wave"));
	}
}
export class UI_StartButtonGroup extends fgui.GComponent {

	public m_btn_start!:fgui.GButton;
	public m_t0!:fgui.Transition;
	public static URL:string = "ui://xqz4mczvu6wq40";

	public static createInstance():UI_StartButtonGroup {
		return <UI_StartButtonGroup>(fgui.UIPackage.createObject("Battle", "StartButtonGroup"));
	}

	protected onConstruct():void {
		this.m_btn_start = <fgui.GButton>(this.getChild("btn_start"));
		this.m_t0 = this.getTransition("t0");
	}
}

export class BattleBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_BuildButton.URL, UI_BuildButton);
		fgui.UIObjectFactory.setExtension(UI_UpLevelButton.URL, UI_UpLevelButton);
		fgui.UIObjectFactory.setExtension(UI_SoldButton.URL, UI_SoldButton);
		fgui.UIObjectFactory.setExtension(UI_RallyButton.URL, UI_RallyButton);
		fgui.UIObjectFactory.setExtension(UI_MeneWindow.URL, UI_MeneWindow);
		fgui.UIObjectFactory.setExtension(UI_DefeatedView.URL, UI_DefeatedView);
		fgui.UIObjectFactory.setExtension(UI_DefeatedWindow.URL, UI_DefeatedWindow);
		fgui.UIObjectFactory.setExtension(UI_SettlementView.URL, UI_SettlementView);
		fgui.UIObjectFactory.setExtension(UI_SettlementWindow.URL, UI_SettlementWindow);
		fgui.UIObjectFactory.setExtension(UI_BattleView.URL, UI_BattleView);
		fgui.UIObjectFactory.setExtension(UI_BottomUI.URL, UI_BottomUI);
		fgui.UIObjectFactory.setExtension(UI_RangeCircleView1.URL, UI_RangeCircleView1);
		fgui.UIObjectFactory.setExtension(UI_RangeCircleView2.URL, UI_RangeCircleView2);
		fgui.UIObjectFactory.setExtension(UI_MeneView.URL, UI_MeneView);
		fgui.UIObjectFactory.setExtension(UI_TopUI.URL, UI_TopUI);
		fgui.UIObjectFactory.setExtension(UI_InfoUI.URL, UI_InfoUI);
		fgui.UIObjectFactory.setExtension(UI_StartButtonGroup.URL, UI_StartButtonGroup);
	}
}