/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export class UI_Menu001 extends fgui.GComponent {

	public m_btn_start!:fgui.GButton;
	public m_btn_options!:fgui.GButton;
	public static URL:string = "ui://5gta1jjseex09s";

	public static createInstance():UI_Menu001 {
		return <UI_Menu001>(fgui.UIPackage.createObject("Home", "Menu001"));
	}

	protected onConstruct():void {
		this.m_btn_start = <fgui.GButton>(this.getChild("btn_start"));
		this.m_btn_options = <fgui.GButton>(this.getChild("btn_options"));
	}
}
export class UI_Menu002 extends fgui.GComponent {

	public m_list!:fgui.GList;
	public static URL:string = "ui://5gta1jjseex09t";

	public static createInstance():UI_Menu002 {
		return <UI_Menu002>(fgui.UIPackage.createObject("Home", "Menu002"));
	}

	protected onConstruct():void {
		this.m_list = <fgui.GList>(this.getChild("list"));
	}
}
export class UI_Home extends fgui.GComponent {

	public m_logo!:fgui.GMovieClip;
	public m_menu!:UI_Menu;
	public static URL:string = "ui://5gta1jjsgssq0";

	public static createInstance():UI_Home {
		return <UI_Home>(fgui.UIPackage.createObject("Home", "Home"));
	}

	protected onConstruct():void {
		this.m_logo = <fgui.GMovieClip>(this.getChild("logo"));
		this.m_menu = <UI_Menu>(this.getChild("menu"));
	}
}
export class UI_NewGame extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public m_btn_new_game!:fgui.GButton;
	public m_btn_slot!:UI_SlotButton;
	public static URL:string = "ui://5gta1jjsgssq7y";

	public static createInstance():UI_NewGame {
		return <UI_NewGame>(fgui.UIPackage.createObject("Home", "NewGame"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
		this.m_btn_new_game = <fgui.GButton>(this.getChild("btn_new_game"));
		this.m_btn_slot = <UI_SlotButton>(this.getChild("btn_slot"));
	}
}
export class UI_SlotButton extends fgui.GButton {

	public m_c1!:fgui.Controller;
	public m_txt_star!:fgui.GTextField;
	public m_txt_heroic!:fgui.GTextField;
	public m_txt_iron!:fgui.GTextField;
	public m_btn_close!:fgui.GButton;
	public static URL:string = "ui://5gta1jjsgssq80";

	public static createInstance():UI_SlotButton {
		return <UI_SlotButton>(fgui.UIPackage.createObject("Home", "SlotButton"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
		this.m_txt_star = <fgui.GTextField>(this.getChild("txt_star"));
		this.m_txt_heroic = <fgui.GTextField>(this.getChild("txt_heroic"));
		this.m_txt_iron = <fgui.GTextField>(this.getChild("txt_iron"));
		this.m_btn_close = <fgui.GButton>(this.getChild("btn_close"));
	}
}
export class UI_Menu extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public m_menu002!:UI_Menu002;
	public m_menu001!:UI_Menu001;
	public m_showSlot!:fgui.Transition;
	public static URL:string = "ui://5gta1jjsgssq81";

	public static createInstance():UI_Menu {
		return <UI_Menu>(fgui.UIPackage.createObject("Home", "Menu"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
		this.m_menu002 = <UI_Menu002>(this.getChild("menu002"));
		this.m_menu001 = <UI_Menu001>(this.getChild("menu001"));
		this.m_showSlot = this.getTransition("showSlot");
	}
}

export class HomeBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_Menu001.URL, UI_Menu001);
		fgui.UIObjectFactory.setExtension(UI_Menu002.URL, UI_Menu002);
		fgui.UIObjectFactory.setExtension(UI_Home.URL, UI_Home);
		fgui.UIObjectFactory.setExtension(UI_NewGame.URL, UI_NewGame);
		fgui.UIObjectFactory.setExtension(UI_SlotButton.URL, UI_SlotButton);
		fgui.UIObjectFactory.setExtension(UI_Menu.URL, UI_Menu);
	}
}