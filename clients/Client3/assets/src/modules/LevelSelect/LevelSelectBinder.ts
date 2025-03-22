/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export class UI_LevelSelectWindow extends fgui.GComponent {

	public m_view!:UI_LevelSelectView;
	public static URL:string = "ui://04j85c0plkyt0";

	public static createInstance():UI_LevelSelectWindow {
		return <UI_LevelSelectWindow>(fgui.UIPackage.createObject("LevelSelect", "LevelSelectWindow"));
	}

	protected onConstruct():void {
		this.m_view = <UI_LevelSelectView>(this.getChild("view"));
	}
}
export class UI_DifficultyButton extends fgui.GButton {

	public m_c1!:fgui.Controller;
	public static URL:string = "ui://04j85c0plkyt17";

	public static createInstance():UI_DifficultyButton {
		return <UI_DifficultyButton>(fgui.UIPackage.createObject("LevelSelect", "DifficultyButton"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
	}
}
export class UI_LevelSelectView extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public m_btn_c!:fgui.GButton;
	public m_btn_h!:fgui.GButton;
	public m_btn_i!:fgui.GButton;
	public m_btn_close!:fgui.GButton;
	public m_img_thumb!:fgui.GLoader;
	public m_btn_battle!:UI_BattleButton;
	public m_img_pass_diff!:fgui.GLoader;
	public m_btn_difficulty!:UI_DifficultyButton;
	public m_star_1!:fgui.GImage;
	public m_star_2!:fgui.GImage;
	public m_star_3!:fgui.GImage;
	public m_star_4!:fgui.GImage;
	public m_star_5!:fgui.GImage;
	public m_title_2!:fgui.GLabel;
	public m_txt_desc!:fgui.GTextField;
	public m_title_3!:fgui.GLabel;
	public m_txt_lvl_limit!:fgui.GTextField;
	public m_img_hero!:fgui.GImage;
	public m_img_dis_1!:fgui.GImage;
	public m_img_dis_2!:fgui.GImage;
	public m_img_dis_3!:fgui.GImage;
	public m_img_dis_4!:fgui.GImage;
	public m_title_1!:fgui.GLabel;
	public static URL:string = "ui://04j85c0plkyt1g";

	public static createInstance():UI_LevelSelectView {
		return <UI_LevelSelectView>(fgui.UIPackage.createObject("LevelSelect", "LevelSelectView"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
		this.m_btn_c = <fgui.GButton>(this.getChild("btn_c"));
		this.m_btn_h = <fgui.GButton>(this.getChild("btn_h"));
		this.m_btn_i = <fgui.GButton>(this.getChild("btn_i"));
		this.m_btn_close = <fgui.GButton>(this.getChild("btn_close"));
		this.m_img_thumb = <fgui.GLoader>(this.getChild("img_thumb"));
		this.m_btn_battle = <UI_BattleButton>(this.getChild("btn_battle"));
		this.m_img_pass_diff = <fgui.GLoader>(this.getChild("img_pass_diff"));
		this.m_btn_difficulty = <UI_DifficultyButton>(this.getChild("btn_difficulty"));
		this.m_star_1 = <fgui.GImage>(this.getChild("star_1"));
		this.m_star_2 = <fgui.GImage>(this.getChild("star_2"));
		this.m_star_3 = <fgui.GImage>(this.getChild("star_3"));
		this.m_star_4 = <fgui.GImage>(this.getChild("star_4"));
		this.m_star_5 = <fgui.GImage>(this.getChild("star_5"));
		this.m_title_2 = <fgui.GLabel>(this.getChild("title_2"));
		this.m_txt_desc = <fgui.GTextField>(this.getChild("txt_desc"));
		this.m_title_3 = <fgui.GLabel>(this.getChild("title_3"));
		this.m_txt_lvl_limit = <fgui.GTextField>(this.getChild("txt_lvl_limit"));
		this.m_img_hero = <fgui.GImage>(this.getChild("img_hero"));
		this.m_img_dis_1 = <fgui.GImage>(this.getChild("img_dis_1"));
		this.m_img_dis_2 = <fgui.GImage>(this.getChild("img_dis_2"));
		this.m_img_dis_3 = <fgui.GImage>(this.getChild("img_dis_3"));
		this.m_img_dis_4 = <fgui.GImage>(this.getChild("img_dis_4"));
		this.m_title_1 = <fgui.GLabel>(this.getChild("title_1"));
	}
}
export class UI_BattleButton extends fgui.GButton {

	public m_c1!:fgui.Controller;
	public static URL:string = "ui://04j85c0plkytu";

	public static createInstance():UI_BattleButton {
		return <UI_BattleButton>(fgui.UIPackage.createObject("LevelSelect", "BattleButton"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
	}
}

export class LevelSelectBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_LevelSelectWindow.URL, UI_LevelSelectWindow);
		fgui.UIObjectFactory.setExtension(UI_DifficultyButton.URL, UI_DifficultyButton);
		fgui.UIObjectFactory.setExtension(UI_LevelSelectView.URL, UI_LevelSelectView);
		fgui.UIObjectFactory.setExtension(UI_BattleButton.URL, UI_BattleButton);
	}
}