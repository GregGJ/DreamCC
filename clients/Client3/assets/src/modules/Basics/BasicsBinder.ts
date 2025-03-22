/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export class UI_HeroicState extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public static URL:string = "ui://xg9d8gh1p1ln14";

	public static createInstance():UI_HeroicState {
		return <UI_HeroicState>(fgui.UIPackage.createObject("Basics", "HeroicState"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
	}
}
export class UI_IronState extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public static URL:string = "ui://xg9d8gh1p1ln15";

	public static createInstance():UI_IronState {
		return <UI_IronState>(fgui.UIPackage.createObject("Basics", "IronState"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
	}
}
export class UI_StarState extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public static URL:string = "ui://xg9d8gh1p1ln16";

	public static createInstance():UI_StarState {
		return <UI_StarState>(fgui.UIPackage.createObject("Basics", "StarState"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
	}
}
export class UI_ComboBox_popup extends fgui.GComponent {

	public m_list!:fgui.GList;
	public static URL:string = "ui://xg9d8gh1p1ln18";

	public static createInstance():UI_ComboBox_popup {
		return <UI_ComboBox_popup>(fgui.UIPackage.createObject("Basics", "ComboBox_popup"));
	}

	protected onConstruct():void {
		this.m_list = <fgui.GList>(this.getChild("list"));
	}
}
export class UI_SamllStar extends fgui.GComponent {

	public m_c1!:fgui.Controller;
	public static URL:string = "ui://xg9d8gh1vjqlg";

	public static createInstance():UI_SamllStar {
		return <UI_SamllStar>(fgui.UIPackage.createObject("Basics", "SamllStar"));
	}

	protected onConstruct():void {
		this.m_c1 = this.getController("c1");
	}
}

export class BasicsBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_HeroicState.URL, UI_HeroicState);
		fgui.UIObjectFactory.setExtension(UI_IronState.URL, UI_IronState);
		fgui.UIObjectFactory.setExtension(UI_StarState.URL, UI_StarState);
		fgui.UIObjectFactory.setExtension(UI_ComboBox_popup.URL, UI_ComboBox_popup);
		fgui.UIObjectFactory.setExtension(UI_SamllStar.URL, UI_SamllStar);
	}
}