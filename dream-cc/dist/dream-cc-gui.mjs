import { Binder, Event, EventDispatcher, I18N, Injector, Logger, ModuleManager, Res, Resource, ResourceManager, TickerManager, Timer } from "dream-cc-core";
import { AsyncOperation, GComponent, GGraph, GRoot, SmartLoader, UIObjectFactory, UIPackage, registerFont } from "fairygui-cc";
import { Color, Node, Vec2, assetManager } from "cc";
//#region dream-cc-gui/src/gui/alerts/Alert.ts
var Alert = class {
	/**
	* 显示一个警告框
	* @param msg 
	* @param title 
	* @param buttons 
	* @param callback 
	* @param buttonSkins 
	*/
	static show(msg, title, buttons, callback, buttonSkins) {
		this.impl.show(msg, title, buttons, callback, buttonSkins);
	}
	static get impl() {
		if (this.__impl == null) this.__impl = Injector.getInject(this.KEY);
		if (this.__impl == null) throw new Error("未注入：" + this.KEY);
		return this.__impl;
	}
};
Alert.KEY = "Alert";
//#endregion
//#region dream-cc-gui/src/gui/layer/Layer.ts
/**
* 层级类
*/
var Layer = class extends GComponent {
	constructor(name, isFullScrene = false) {
		super();
		this.node.name = name;
		this.isFullScrene = isFullScrene;
		this.openRecord = [];
		this.makeFullScreen();
	}
	getCount() {
		return this.numChildren;
	}
};
//#endregion
//#region dream-cc-gui/src/gui/layer/LayerManagerImpl.ts
/**
* cocos fgui 层管理器
*/
var LayerManagerImpl = class {
	constructor() {
		this.__layerMap = /* @__PURE__ */ new Map();
	}
	/**
	* 添加层
	* @param key 
	* @param layer 
	*/
	addLayer(key, layer) {
		if (layer instanceof Layer) {
			GRoot.inst.addChild(layer);
			this.__layerMap.set(key, layer);
		} else throw new Error("层必须是Layer");
	}
	/**
	* 删除层
	* @param key 
	*/
	removeLayer(key) {
		let layer = this.__layerMap.get(key);
		if (layer) {
			GRoot.inst.removeChild(layer);
			this.__layerMap.delete(key);
		} else throw new Error("找不到要删除的层：" + key);
	}
	getLayer(layerKey) {
		return this.__layerMap.get(layerKey);
	}
	/**
	* 获得所有层
	*/
	getAllLayer() {
		let _values = [];
		this.__layerMap.forEach(function(v, key) {
			_values.push(v);
		});
		return _values;
	}
};
//#endregion
//#region dream-cc-gui/src/gui/layer/LayerManager.ts
/**
* 层管理器
*/
var LayerManager = class {
	/**
	* 添加一个层
	* @param key 
	* @param layer 
	*/
	static addLayer(key, layer) {
		this.impl.addLayer(key, layer);
	}
	/**
	* 删除层
	* @param key 
	*/
	static removeLayer(key) {
		this.impl.removeLayer(key);
	}
	/**
	* 获取层对象
	* @param key 
	*/
	static getLayer(key) {
		return this.impl.getLayer(key);
	}
	/**
	* 获得所有层
	*/
	static getAllLayer() {
		return this.impl.getAllLayer();
	}
	static get impl() {
		if (this.__impl == null) this.__impl = Injector.getInject(this.KEY);
		if (this.__impl == null) this.__impl = new LayerManagerImpl();
		return this.__impl;
	}
};
LayerManager.KEY = "LayerManager";
//#endregion
//#region dream-cc-gui/src/gui/loadingView/LoadingView.ts
/**
* 加载界面
*/
var LoadingView = class {
	static show() {
		if (!this.impl) return;
		this.impl.show();
	}
	static hide() {
		if (!this.impl) return;
		this.impl.hide();
	}
	static changeData(...args) {
		if (!this.impl) return;
		this.impl.changeData(...args);
	}
	static get impl() {
		if (this.__impl == null) this.__impl = Injector.getInject(this.KEY);
		if (this.__impl == null) console.warn(this.KEY + "未注入");
		return this.__impl;
	}
};
LoadingView.KEY = "LoadingView";
//#endregion
//#region dream-cc-gui/src/gui/tooltips/ITooltipData.ts
/**
* 提示数据
*/
var ITooltipData = class {};
//#endregion
//#region dream-cc-gui/src/gui/tooltips/TooltipPosMode.ts
/**
* 位置模式
*/
let TooltipPosMode = /* @__PURE__ */ function(TooltipPosMode) {
	TooltipPosMode[TooltipPosMode["Touch"] = 0] = "Touch";
	TooltipPosMode[TooltipPosMode["Left"] = 1] = "Left";
	TooltipPosMode[TooltipPosMode["Right"] = 2] = "Right";
	return TooltipPosMode;
}({});
//#endregion
//#region dream-cc-gui/src/gui/tooltips/TooltipManagerImpl.ts
/**
* tooltip 管理类
*/
var TooltipManagerImpl = class {
	constructor() {
		this.tooltipLayer = "Tooltip";
		this.__tooltipMap = /* @__PURE__ */ new Map();
	}
	register(type, value) {
		this.__tooltipMap.set(type, value);
	}
	unregister(type) {
		this.__tooltipMap.delete(type);
	}
	show(data) {
		if (this.isShowing) this.hide();
		let tData;
		let posMode;
		if (typeof data == "string") {
			tData = data;
			posMode = 0;
			this.__currentTooltip = this.__tooltipMap.get("default");
		} else if (data instanceof ITooltipData) {
			tData = data.data;
			posMode = data.posMode;
			if (this.__tooltipMap.has(data.tooltipType)) this.__currentTooltip = this.__tooltipMap.get(data.tooltipType);
			else throw new Error("未注册tooltip Type:" + data.tooltipType);
		}
		this.__currentTooltip.update(tData);
		LayerManager.getLayer(this.tooltipLayer).addChild(this.__currentTooltip.viewComponent);
		this.__layout(posMode);
	}
	__layout(posMode) {
		let view = this.__currentTooltip.viewComponent;
		let pos;
		switch (posMode) {
			case 0:
				pos = GRoot.inst.getTouchPosition();
				break;
			case 1:
			case 2:
				pos = new Vec2();
				if (posMode == 1) {
					pos.x = GRoot.inst.width * .25 - view.width * .5;
					pos.y = (GRoot.inst.height - view.height) * .5;
				} else {
					pos.x = GRoot.inst.width - GRoot.inst.width * .25 - view.width * .5;
					pos.y = (GRoot.inst.height - view.height) * .5;
				}
				break;
			default: throw new Error("Tooltip 未知定位类型！");
		}
		if (pos.x < 0) pos.x = 0;
		else if (pos.x + view.width > GRoot.inst.width) pos.x = GRoot.inst.width - view.width;
		if (pos.y < 0) pos.y = 0;
		else if (pos.y + view.height > GRoot.inst.height) pos.y = GRoot.inst.height - view.height;
		view.x = pos.x;
		view.y = pos.y;
	}
	hide() {
		if (!this.isShowing) return;
		LayerManager.getLayer(this.tooltipLayer).removeChild(this.__currentTooltip.viewComponent);
		this.__currentTooltip = null;
	}
	get isShowing() {
		return this.__currentTooltip != null;
	}
};
//#endregion
//#region dream-cc-gui/src/gui/relations/RelationManager.ts
/**
* GUI 关联关系
*/
var RelationManager = class {
	constructor() {}
	/**
	* 添加UI关联关系
	* @param key 
	* @param value 
	*/
	static addRelation(key, value) {
		if (this.DEBUG) this.__checkValidity(key, value);
		if (this.__map.has(key)) throw new Error("重复注册！");
		this.__map.set(key, value);
	}
	static removeRelation(key) {
		if (!this.__map.has(key)) throw new Error("找不到要删除的内容！");
		this.__map.delete(key);
	}
	/**
	* 检测合法性
	* @param value 
	*/
	static __checkValidity(key, value) {
		let guiKey = key;
		let showList = value.show;
		let hideList = value.hide;
		let findex;
		findex = showList.show.indexOf(guiKey);
		if (findex >= 0) throw new Error("GuiRelation.config配置错误:gui:" + guiKey + " show.show:中不能包含自身！");
		findex = showList.hide.indexOf(guiKey);
		if (findex >= 0) throw new Error("GuiRelation.config配置错误:gui:" + guiKey + " show.hide:中不能包含自身！");
		findex = hideList.show.indexOf(guiKey);
		if (findex >= 0) throw new Error("GuiRelation.config配置错误:gui:" + guiKey + " hide.show:中不能包含自身！");
		findex = hideList.hide.indexOf(guiKey);
		if (findex >= 0) throw new Error("GuiRelation.config配置错误:gui:" + guiKey + " hide.hide:中不能包含自身！");
		for (let index = 0; index < showList.show.length; index++) {
			const showkey = showList.show[index];
			if (showList.hide.indexOf(showkey) >= 0) throw new Error("GuiRelation.config配置错误:gui:" + guiKey + " show.show和show.hide中包含相同的guikey:" + showkey);
		}
		for (let index = 0; index < hideList.show.length; index++) {
			const showkey = hideList.show[index];
			if (hideList.hide.indexOf(showkey) >= 0) throw new Error("GuiRelation.config配置错误:gui:" + guiKey + " hide.show和hide.hide中包含相同的guikey:" + showkey);
		}
	}
	static getRelation(key) {
		return this.__map.get(key);
	}
};
RelationManager.DEBUG = false;
RelationManager.__map = /* @__PURE__ */ new Map();
//#endregion
//#region dream-cc-gui/src/gui/res/FGUIResource.ts
var FGUIResource = class extends Resource {
	constructor() {
		super();
	}
	/**
	* 销毁
	*/
	destroy() {
		let url = Res.key2Url(this.key);
		if (typeof url != "string") {
			UIPackage.removePackage(url.url);
			let asset = assetManager.getBundle(url.bundle).get(url.url);
			assetManager.releaseAsset(asset);
		} else throw new Error("未处理的Fguipackage销毁！");
		return super.destroy();
	}
};
//#endregion
//#region dream-cc-gui/src/gui/res/FGUILoader.ts
var FGUILoader = class extends EventDispatcher {
	constructor() {
		super();
	}
	load(url) {
		this.url = url;
		if (typeof url == "string") throw new Error("未实现：" + url);
		else {
			let bundle = assetManager.getBundle(url.bundle);
			let self = this;
			if (!bundle) assetManager.loadBundle(url.bundle, (err, bundle) => {
				if (err) {
					self.emit(Event.ERROR, url, err);
					return;
				}
				self.loadUIPackge(url, bundle);
			});
			else self.loadUIPackge(url, bundle);
		}
	}
	loadUIPackge(url, bundle) {
		if (typeof url == "string") throw new Error("未实现：" + url);
		let self = this;
		UIPackage.loadPackage(bundle, url.url, (finish, total, item) => {
			const progress = finish / total;
			self.emit(Event.PROGRESS, url, void 0, progress);
		}, (err, pkg) => {
			if (err) {
				self.emit(Event.ERROR, url, err);
				return;
			}
			const urlKey = Res.url2Key(url);
			let res = new FGUIResource();
			res.key = urlKey;
			res.content = pkg;
			ResourceManager.addRes(res);
			self.emit(Event.COMPLETE, url);
		});
	}
	reset() {
		this.url = null;
	}
};
//#endregion
//#region dream-cc-gui/src/gui/BaseMediator.ts
/**
* 基础Mediator类
*/
var BaseMediator = class extends Binder {
	constructor() {
		super();
		this.ui = null;
	}
	init() {
		super.init();
	}
	tick(dt) {}
	show(data) {
		this.data = data;
		this.bindByRecords();
	}
	showedUpdate(data) {
		this.data = data;
	}
	hide() {
		this.unbindByRecords();
	}
	/**
	* 根据名称或路径获取组件
	* @param path 
	* @returns 
	*/
	getUIComponent(path) {
		let paths = path.split("/");
		let ui = this.ui;
		let index = 0;
		let uiName;
		while (ui && index < paths.length) {
			uiName = paths[index];
			if (uiName.startsWith("m_")) uiName = uiName.replace("m_", "");
			ui = ui.getChild(uiName);
			index++;
		}
		return ui;
	}
};
//#endregion
//#region dream-cc-gui/src/GUIPlugin.ts
/**
* GUI插件
*/
var GUIPlugin = class GUIPlugin extends EventDispatcher {
	constructor(..._args) {
		super(..._args);
		this.name = "GUIPlugin";
	}
	/**
	* 初始化
	* @param root          fgui根节点
	* @param guiconfig     UI配置
	* @param layer         层级配置
	* @param assets        公共资源
	* @param fonts         字体
	* @param language      fgui多语言xml文件
	*/
	init(root, guiconfig, layer, assets, fonts, language) {
		this.__root = root;
		this.__guiconfig = guiconfig;
		this.__layer = layer;
		this.__assets = assets;
		this.__fonts = fonts;
		this.__language = language;
	}
	start() {
		Logger.log("Engine Init...", "gui");
		if (!GUIPlugin.uiPackageURL) GUIPlugin.uiPackageURL = (packageName, type, bundle) => {
			return {
				url: "ui/" + packageName,
				type,
				bundle
			};
		};
		Res.setLoader(Res.TYPE.FGUI, FGUILoader);
		UIObjectFactory.setLoaderExtension(SmartLoader);
		GRoot.create(this.__root);
		this.__InitLayer();
		if (this.__assets && this.__assets.length > 0) this.__loadCommonAssets();
		else if (this.__fonts && this.__fonts.length > 0) this.__loadFonts();
		else this.__initUI();
	}
	__InitLayer() {
		if (!this.__layer) {
			let layers = [
				"BattleDamage",
				"FullScreen",
				"Window",
				"Pannel",
				"Tooltip",
				"Alert",
				"Guide",
				"LoadingView"
			];
			let fullScrene = ["FullScreen"];
			this.__layer = {
				layers,
				fullScrene
			};
		}
		if (this.__layer.layers && this.__layer.layers.length > 0) for (let index = 0; index < this.__layer.layers.length; index++) {
			const layerKey = this.__layer.layers[index];
			if (this.__layer.fullScrene && this.__layer.fullScrene.length > 0) LayerManager.addLayer(layerKey, new Layer(layerKey, this.__layer.fullScrene.indexOf(layerKey) >= 0));
			else LayerManager.addLayer(layerKey, new Layer(layerKey));
		}
	}
	__loadCommonAssets() {
		let reqeust = Res.create(this.__assets, "Engine", (progress) => {
			let v = .2 + progress * .2;
			this.emit(Event.PROGRESS, Event.create(Event.PROGRESS, this, null, null, v));
		}, (err) => {
			if (err) {
				reqeust.dispose();
				reqeust = null;
				this.__onError(err);
				return;
			}
			if (this.__fonts && this.__fonts.length > 0) this.__loadFonts();
			else this.__initUI();
		});
		reqeust.load();
	}
	__loadFonts() {
		let urls = [];
		let fontNames = /* @__PURE__ */ new Map();
		for (let index = 0; index < this.__fonts.length; index++) {
			const config = this.__fonts[index];
			urls.push(config.url);
			fontNames.set(Res.url2Key(config.url), config.name);
		}
		let request = Res.create(urls, "Engine", (progress) => {
			let v = .4 + progress * .2;
			this.emit(Event.PROGRESS, Event.create(Event.PROGRESS, this, null, null, v));
		}, (err) => {
			if (err) {
				request.dispose();
				request = null;
				this.__onError(err);
				return;
			}
			let refs = request.getRefList();
			for (let index = 0; index < refs.length; index++) {
				const ref = refs[index];
				const name = fontNames.get(ref.key);
				registerFont(name, ref.content);
			}
			this.__initUI();
		});
		request.load();
	}
	__initUI() {
		if (this.__guiconfig) {
			let request = Res.create(this.__guiconfig, "Engine", (progress) => {
				const v = .6 + progress * .2;
				this.emit(Event.PROGRESS, Event.create(Event.PROGRESS, this, null, null, v));
			}, (err) => {
				if (err) {
					request.dispose();
					request = null;
					this.__onError(err);
					return;
				}
				let list = request.getRef().content.json;
				for (let index = 0; index < list.length; index++) {
					const element = list[index];
					GUIManager.register(element);
				}
				if (this.__language) this.__loadLangenge();
				else this.__allComplete();
			});
			request.load();
		} else if (this.__language) this.__loadLangenge();
		else this.__allComplete();
	}
	/**
	* 加载FGUI语言包
	* @param url 
	* @param p_progress 
	* @param cb 
	*/
	__loadLangenge() {
		let request = Res.create(this.__language, "Engine", (progress) => {
			const v = .8 + progress * .2;
			this.emit(Event.PROGRESS, Event.create(Event.PROGRESS, this, null, null, v));
		}, (err) => {
			if (err) {
				request.dispose();
				request = null;
				this.__allComplete();
				return;
			}
			let ref = request.getRef();
			UIPackage.setStringsSource(this.parseXML(ref.content.text));
			this.__allComplete();
		});
		request.load();
	}
	parseXML(value) {
		var xml = new DOMParser().parseFromString(value, "text/xml").documentElement;
		var nodes = xml.childNodes;
		var length1 = nodes.length;
		for (var i1 = 0; i1 < length1; i1++) {
			var cxml = nodes[i1];
			if (cxml.tagName == "string") {
				var key = cxml.getAttribute("name");
				var text = cxml.childNodes.length > 0 ? cxml.firstChild.nodeValue : "";
				if (key.indexOf("-") == -1) continue;
				cxml.textContent = I18N.tr(text);
			}
		}
		return new XMLSerializer().serializeToString(xml);
	}
	__onError(err) {
		Logger.error("Engine Init Error:" + err.message, "gui");
	}
	__allComplete(err) {
		if (err) {
			Logger.error("Engine Init Error" + err.message, "gui");
			return;
		}
		Logger.log("Engine Init Completed", "gui");
		this.emit(Event.COMPLETE, Event.create(Event.COMPLETE, this));
	}
};
GUIPlugin.MaskColor = new Color(0, 0, 0, 127.5);
GUIPlugin.AlphaMaskColor = new Color(0, 0, 0, 0);
//#endregion
//#region dream-cc-gui/src/gui/GUIProxy.ts
/**
* GUI代理，将资源加载和Mediator逻辑隔离开
*/
var GUIProxy = class GUIProxy {
	constructor(info) {
		this.closeTime = 0;
		this.__showing = false;
		this.__loadState = 0;
		this.info = info;
		if (!this.info) throw new Error("UI信息不能为空！");
		this.urls = [];
	}
	/**
	* 加载AssetBundle
	*/
	__loadAssetBundle() {
		this.__loadState = 1;
		if (!assetManager.getBundle(this.info.bundleName)) assetManager.loadBundle(this.info.bundleName, this.__assetBundleLoaded.bind(this));
		else this.__assetBundleLoaded();
	}
	/**
	* AssetBundle加载完成
	*/
	__assetBundleLoaded() {
		if (GUIPlugin.uiPackageURL == void 0) throw new Error("GUIModule.uiPackageURL未定义!");
		this.urls.push(GUIPlugin.uiPackageURL(this.info.packageName, Res.TYPE.FGUI, this.info.bundleName));
		let viewCreatorCom = GUIProxy.createNode.addComponent(this.info.key + "ViewCreator");
		let viewCreator = viewCreatorCom;
		if (!viewCreator) throw new Error(this.info.key + "ViewCreator类不存在或未实现IViewCreator!");
		this.mediator = viewCreator.createMediator();
		if (this.mediator.showLoadingView) LoadingView.show();
		viewCreatorCom.destroy();
		if (this.mediator.modules && this.mediator.modules.length > 0) ModuleManager.single.load(this.mediator.modules, (p_progress) => {
			let progress = p_progress * .5 * this.mediator.loadingViewTotalRatio;
			LoadingView.changeData({
				label: this.info.key + " Modules startup...",
				progress
			});
		}, (err) => {
			this.__loadAssets();
		});
		else this.__loadAssets();
	}
	__loadAssets() {
		if (this.mediator.configs && this.mediator.configs.length > 0) for (let index = 0; index < this.mediator.configs.length; index++) {
			const sheet = this.mediator.configs[index];
			const url = Res.sheet2URL(sheet);
			this.urls.push(url);
		}
		if (this.mediator.assets && this.mediator.assets.length > 0) for (let index = 0; index < this.mediator.assets.length; index++) {
			const url = this.mediator.assets[index];
			this.urls.push(url);
		}
		this.assetsRequest = Res.create(this.urls, this.info.key, (p_progress) => {
			let progress = (.5 + p_progress * .5) * this.mediator.loadingViewTotalRatio;
			LoadingView.changeData({
				label: this.info.key + " Res Loading...",
				progress
			});
		}, (err) => {
			if (err) {
				this.assetsRequest.dispose();
				this.assetsRequest = null;
				LoadingView.changeData({ label: this.info.key + " Res Load Err:" + err });
				return;
			}
			this.__create_ui();
		});
		this.assetsRequest.load();
	}
	/**
	* 创建UI
	*/
	__create_ui() {
		this.mediator.createUI(this.info, this.__create_ui_callback.bind(this));
	}
	/**
	* UI创建完成回调
	*/
	__create_ui_callback() {
		LoadingView.changeData({ progress: this.mediator.loadingViewTotalRatio });
		this.__loadState = 2;
		this.mediator.init();
		this.mediator.inited = true;
		if (this.__showing) this.__show();
	}
	__add_to_layer() {
		this.layer.addChildAt(this.mediator.viewComponent, this.getLayerChildCount());
		this.mediator.viewComponent.visible = true;
	}
	tick(dt) {
		if (this.__loadState == 2) {
			if (this.mediator) this.mediator.tick(dt);
		}
	}
	show(data) {
		this.__showing = true;
		this.data = data;
		this.__show();
	}
	showedUpdate(data) {
		if (this.mediator && this.__showing) this.mediator.showedUpdate(data);
	}
	__show() {
		if (this.__loadState == 0) this.__loadAssetBundle();
		else if (this.__loadState == 1) {} else {
			this.__add_to_layer();
			if (this.mediator.showLoadingView && this.mediator.closeLoadingView) LoadingView.hide();
			this.mediator.show(this.data);
			this.data = null;
			if (!GUIManager.isOpen(this.info.key)) return;
			if (this.mediator.playShowAnimation) this.mediator.playShowAnimation(this.__showAnimationPlayed.bind(this));
			else EventDispatcher.Main.emit(Event.SHOW, this.info.key);
		}
	}
	__showAnimationPlayed() {
		EventDispatcher.Main.emit(Event.SHOW, this.info.key);
	}
	hide() {
		if (this.__loadState == 1) this.__loadState = 0;
		else if (this.__loadState == 2) {
			if (this.__showing) {
				if (this.mediator.playHideAnimation) this.mediator.playHideAnimation(this.__hideAnimationPlayed.bind(this));
				else this.__hide();
			}
		}
	}
	__hideAnimationPlayed() {
		if (this.__showing) this.__hide();
	}
	__hide() {
		this.mediator.viewComponent.visible = false;
		this.mediator.hide();
		this.__showing = false;
		EventDispatcher.Main.emit(Event.HIDE, this.info.key);
	}
	destroy() {
		var _this$info;
		console.log("UI销毁=>" + ((_this$info = this.info) === null || _this$info === void 0 ? void 0 : _this$info.key));
		if (this.assetsRequest) {
			this.assetsRequest.dispose();
			this.assetsRequest = null;
		}
		this.mediator.destroy();
		this.mediator = void 0;
		this.info = void 0;
		this.data = null;
	}
	getLayerChildCount() {
		return this.layer.getCount();
	}
	get layer() {
		let l = LayerManager.getLayer(this.info.layer);
		if (l === void 0) throw new Error("layer：" + this.info.layer + "不存在！");
		return l;
	}
	/**
	* 获取组件
	* @param path 
	*/
	getComponent(path) {
		if (!this.mediator) return null;
		return this.mediator.getUIComponent(path);
	}
};
GUIProxy.createNode = new Node("createHelpNode");
//#endregion
//#region dream-cc-gui/src/gui/GUIState.ts
/**
* 界面状态
*/
let GUIState = /* @__PURE__ */ function(GUIState) {
	/**
	* 未使用状态
	*/
	GUIState[GUIState["Null"] = 0] = "Null";
	/**
	* 显示处理中
	*/
	GUIState[GUIState["Showing"] = 1] = "Showing";
	/**
	* 已显示
	*/
	GUIState[GUIState["Showed"] = 2] = "Showed";
	/**
	* 关闭处理中
	*/
	GUIState[GUIState["Closeing"] = 3] = "Closeing";
	/**
	* 已关闭
	*/
	GUIState[GUIState["Closed"] = 4] = "Closed";
	return GUIState;
}({});
//#endregion
//#region dream-cc-gui/src/gui/GUIManagerImpl.ts
/**
* GUI管理器
*/
var GUIManagerImpl = class {
	constructor() {
		this.__registered = /* @__PURE__ */ new Map();
		this.__instances = /* @__PURE__ */ new Map();
		this.__destryList = [];
		TickerManager.addTicker(this);
		EventDispatcher.Main.on(Event.SHOW, this.__showedHandler, this);
		EventDispatcher.Main.on(Event.HIDE, this.__closedHandler, this);
	}
	/**获取某个组件 */
	getUIComponent(key, path) {
		if (!this.__instances.has(key)) throw new Error("GUI:" + key + "实例，不存在！");
		return this.__instances.get(key).getComponent(path);
	}
	/**
	* 获取界面的mediator
	* @param key 
	*/
	getMediatorByKey(key) {
		if (!this.__instances.has(key)) return null;
		return this.__instances.get(key).mediator;
	}
	__showedHandler(e) {
		let guiKey = e.data;
		this.setState(guiKey, 2);
	}
	__closedHandler(e) {
		let guiKey = e.data;
		this.setState(guiKey, 4);
	}
	register(info) {
		if (this.__registered.has(info.key)) throw new Error("重复注册！");
		this.__registered.set(info.key, info);
	}
	unregister(key) {
		if (!this.__registered.has(key)) throw new Error("未找到要注销的界面信息！");
		this.__registered.delete(key);
	}
	tick(dt) {
		this.__destryList.length = 0;
		let currentTime = Timer.currentTime;
		this.__instances.forEach((value, key, map) => {
			if (value.info.state == 2) value.tick(dt);
			else if (value.info.state == 4) {
				if (!value.info.permanence) {
					if (currentTime - value.closeTime > GUIManager.GUI_GC_INTERVAL) this.__destryList.push(key);
				}
			}
		});
		if (this.__destryList.length > 0) {
			let gui;
			for (let index = 0; index < this.__destryList.length; index++) {
				const key = this.__destryList[index];
				gui = this.__instances.get(key);
				gui.info.state = 0;
				this.__instances.delete(key);
				gui.destroy();
			}
		}
	}
	open(key, data) {
		this.__open(key, data);
		this.__checkRelation(key, true);
	}
	__open(key, data) {
		let state = this.getState(key);
		let guiProxy;
		if (state == 0) {
			let info = this.__registered.get(key);
			guiProxy = new GUIProxy(info);
			guiProxy.info.state = 1;
			this.__instances.set(info.key, guiProxy);
			this.checkFullLayer(guiProxy);
			guiProxy.show(data);
			return;
		}
		if (state == 1) {
			guiProxy = this.__instances.get(key);
			this.checkFullLayer(guiProxy);
			guiProxy.show(data);
			return;
		}
		if (state == 2) {
			guiProxy = this.__instances.get(key);
			this.checkFullLayer(guiProxy);
			guiProxy.showedUpdate(data);
			LoadingView.hide();
			return;
		}
		if (state == 3 || state == 4) {
			guiProxy = this.__instances.get(key);
			guiProxy.info.state = 1;
			this.checkFullLayer(guiProxy);
			guiProxy.show(data);
			return;
		}
	}
	checkFullLayer(guiProxy) {
		let layer = LayerManager.getLayer(guiProxy.info.layer);
		if (layer.isFullScrene) {
			for (let index = 0; index < layer.openRecord.length; index++) {
				const guiKey = layer.openRecord[index];
				if (guiKey != guiProxy.info.key) this.__close(guiKey);
			}
			layer.openRecord.push(guiProxy.info.key);
		}
	}
	close(key, checkLayer = true) {
		this.__close(key, checkLayer);
		this.__checkRelation(key, false);
	}
	closeAll() {
		this.__instances.forEach((value, key, map) => {
			this.close(key, false);
		});
	}
	__close(key, checkLayer = false) {
		let state = this.getState(key);
		let guiProxy;
		if (state == 0 || state == 4 || state == 3) return;
		guiProxy = this.__instances.get(key);
		guiProxy.closeTime = Timer.currentTime;
		guiProxy.info.state = 3;
		guiProxy.hide();
		if (!checkLayer) return;
		let layer = LayerManager.getLayer(guiProxy.info.layer);
		if (layer.isFullScrene && layer.openRecord.length > 1) {
			layer.openRecord.pop();
			let guikey = layer.openRecord.pop();
			this.__open(guikey);
		}
	}
	/**
	* 检测UI关联关系
	* @param key 
	*/
	__checkRelation(key, isOpen) {
		let relation = RelationManager.getRelation(key);
		let relationList;
		if (relation) {
			if (isOpen) relationList = relation.show;
			else relationList = relation.hide;
			let guiKey;
			for (let index = 0; index < relationList.show.length; index++) {
				guiKey = relationList.show[index];
				this.__open(guiKey);
			}
			for (let index = 0; index < relationList.hide.length; index++) {
				guiKey = relationList.hide[index];
				this.__close(guiKey);
			}
		}
	}
	/**
	* 获取界面状态
	* @param key 
	*/
	getState(key) {
		if (!this.__registered.has(key)) throw new Error("GUI:" + key + "未注册！");
		if (!this.__instances.has(key)) return 0;
		return this.__instances.get(key).info.state;
	}
	setState(key, state) {
		if (!this.__registered.has(key)) throw new Error("GUI:" + key + "未注册！");
		let info = this.__registered.get(key);
		info.state = state;
	}
	/**
	* 是否已打开或打开中
	* @param key 
	* @returns 
	*/
	isOpen(key) {
		let state = this.getState(key);
		if (state == 1 || state == 2) return true;
		return false;
	}
};
//#endregion
//#region dream-cc-gui/src/gui/GUIManager.ts
/**
* GUI 管理器
*/
var GUIManager = class {
	/**
	* 注册
	* @param info 
	* @returns 
	*/
	static register(info) {
		return this.impl.register(info);
	}
	/**
	* 注销
	* @param key 
	* @returns 
	*/
	static unregister(key) {
		return this.impl.unregister(key);
	}
	/**
	* 打开指定UI界面
	* @param key 
	* @param data 
	*/
	static open(key, data) {
		this.impl.open(key, data);
	}
	/**
	* 关闭
	* @param key 
	* @param checkLayer 是否检查全屏记录
	*/
	static close(key, checkLayer = true) {
		this.impl.close(key, checkLayer);
	}
	/**
	* 关闭所有界面
	*/
	static closeAll() {
		this.impl.closeAll();
	}
	/**
	* 获取界面状态
	* @param key 
	* @returns  0 未显示  1显示中
	*/
	static getGUIState(key) {
		return this.impl.getState(key);
	}
	/**
	* 是否已打开或再打开中
	* @param key 
	* @returns 
	*/
	static isOpen(key) {
		return this.impl.isOpen(key);
	}
	/**
	* 获取GUI中的某个组件
	* @param key    界面全局唯一KEY
	* @param path   组件名称/路径
	*/
	static getUIComponent(key, path) {
		return this.impl.getUIComponent(key, path);
	}
	static get impl() {
		if (this.__impl == null) this.__impl = Injector.getInject(this.KEY);
		if (this.__impl == null) this.__impl = new GUIManagerImpl();
		return this.__impl;
	}
};
GUIManager.KEY = "GUIManager";
GUIManager.GUI_GC_INTERVAL = 30;
//#endregion
//#region dream-cc-gui/src/gui/GUIMediator.ts
/**
* UI逻辑类
*/
var GUIMediator = class extends BaseMediator {
	constructor() {
		super();
		this.info = null;
		this.showLoadingView = false;
		this.closeLoadingView = true;
		this.loadingViewTotalRatio = 1;
		this.viewComponent = null;
		this.__mask = null;
	}
	/**
	* 创建UI
	* @param info 
	* @param created 
	*/
	createUI(info, created) {
		this.info = info;
		if (this.info == null) throw new Error("GUI 信息不能为空");
		this.__createdCallBack = created;
		this.__createUI(true);
	}
	__createUI(async) {
		let packageName = this.info.packageName;
		let com_name = this.info.comName;
		if (this.info.comName.startsWith("UI_")) com_name = this.info.comName.substring(3);
		if (async) {
			this.__asyncCreator = new AsyncOperation();
			this.__asyncCreator.callback = this.__uiCreated.bind(this);
			this.__asyncCreator.createObject(packageName, com_name);
		} else try {
			let ui = UIPackage.createObject(packageName, com_name);
			this.__uiCreated(ui);
		} catch (err) {
			throw new Error("创建界面失败：" + this.info.packageName + " " + com_name);
		}
	}
	__uiCreated(ui) {
		let uiCom = ui.asCom;
		uiCom.makeFullScreen();
		if (this.info.modal) {
			this.ui = uiCom;
			this.viewComponent = new GComponent();
			this.viewComponent.makeFullScreen();
			this.__mask = new GGraph();
			this.__mask.touchable = true;
			this.__mask.makeFullScreen();
			this.__mask.drawRect(0, Color.BLACK, this.info.maskAlpha ? GUIPlugin.AlphaMaskColor : GUIPlugin.MaskColor);
			this.viewComponent.addChild(this.__mask);
			if (this.info.modalClose) this.__mask.onClick(this._maskClickHandler, this);
			this.viewComponent.addChild(this.ui);
		} else this.ui = this.viewComponent = uiCom;
		this.ui.name = this.info.key;
		if (this.__createdCallBack) {
			this.__createdCallBack();
			this.__createdCallBack = null;
		}
	}
	_maskClickHandler() {
		GUIManager.close(this.info.key);
	}
	init() {
		super.init();
	}
	show(data) {
		super.show(data);
		if (this.$subMediators) for (let index = 0; index < this.$subMediators.length; index++) this.$subMediators[index].show(data);
		if (this.tabContainer) this.tabContainer.show(data);
	}
	showedUpdate(data) {
		super.showedUpdate(data);
		if (this.$subMediators) for (let index = 0; index < this.$subMediators.length; index++) this.$subMediators[index].showedUpdate(data);
		if (this.tabContainer) this.tabContainer.showedUpdate(data);
	}
	hide() {
		super.hide();
		if (this.$subMediators) for (let index = 0; index < this.$subMediators.length; index++) this.$subMediators[index].hide();
		if (this.tabContainer) this.tabContainer.hide();
	}
	/**
	* 关闭
	* @param checkLayer 是否检查全屏层记录
	*/
	close(checkLayer = true) {
		GUIManager.close(this.info.key, checkLayer);
	}
	tick(dt) {
		if (this.$subMediators) for (let index = 0; index < this.$subMediators.length; index++) this.$subMediators[index].tick(dt);
	}
	/**
	* 获取模块
	* @param key 
	* @returns 
	*/
	getModule(key) {
		if (!this.modules || this.modules.length == 0 || this.modules.indexOf(key) < 0) throw new Error("无法获取未引用的模块：" + key + ",请在Mediator构造函数中引用模块!");
		return ModuleManager.single.getModule(key);
	}
	destroy() {
		super.destroy();
		if (this.__mask) {
			this.__mask.offClick(this._maskClickHandler, this);
			this.__mask.dispose();
			this.__mask = null;
		}
		this.viewComponent.dispose();
		if (this.$subMediators) for (let index = 0; index < this.$subMediators.length; index++) this.$subMediators[index].destroy();
		this.configs = null;
		this.assets = null;
		if (this.tabContainer) {
			this.tabContainer.destroy();
			this.tabContainer = null;
		}
		if (this.modules && this.modules.length > 0) {
			for (const moduleName of this.modules) ModuleManager.single.dispose(moduleName);
			this.modules = null;
		}
		this.info = null;
	}
};
//#endregion
//#region dream-cc-gui/src/gui/SubGUIMediator.ts
/**
* 子UI 逻辑划分
*/
var SubGUIMediator = class extends BaseMediator {
	constructor(ui, owner) {
		super();
		if (ui == null) throw new Error("ui组件为空");
		this.ui = ui;
		this.owner = owner;
		this.inited = true;
	}
	/**
	* 子类必须在构造函数中调用
	*/
	init() {}
	show(data) {
		super.show(data);
	}
	hide() {
		super.hide();
	}
	destroy() {
		super.destroy();
		this.owner = null;
		this.ui = null;
	}
};
//#endregion
//#region dream-cc-gui/src/gui/tabs/TabData.ts
var TabData = class {};
//#endregion
//#region dream-cc-gui/src/gui/tabs/TabContainer.ts
/**
* 页签容器组件
*/
var TabContainer = class extends Binder {
	constructor(content, createPage, owner) {
		super();
		this.__pageInstanceMap = /* @__PURE__ */ new Map();
		this.ui = content;
		this.__createPage = createPage;
		this.owner = owner;
		this.init();
	}
	/**切换到某个页签 */
	switchPage(index, data) {
		if (index == this.currentIndex) return;
		this.currentIndex = index;
		if (this.currentPage) {
			if (this.currentPage.ui.parent) {
				this.currentPage.hide();
				this.ui.removeChild(this.currentPage.ui);
			}
			this.currentPage = null;
		}
		this.currentPage = this.getPage(index);
		if (this.__showing) {
			this.currentPage.show(data);
			this.ui.addChild(this.currentPage.ui);
		}
	}
	init() {
		super.init();
	}
	show(data) {
		this.__showing = true;
		let page = data ? data.page || 0 : 0;
		let pageData = data ? data.pageData || null : null;
		this.switchPage(page, pageData);
		this.bindByRecords();
	}
	showedUpdate(data) {
		let page = data ? data.page || 0 : this.currentIndex;
		let pageData = data ? data.pageData || null : null;
		if (page == this.currentIndex) this.currentPage.showedUpdate(pageData);
		else this.switchPage(page, pageData);
	}
	hide() {
		if (this.currentPage) {
			this.currentPage.hide();
			this.ui.removeChild(this.currentPage.ui);
			this.currentPage = null;
		}
		this.currentIndex = -1;
		this.__showing = false;
		this.unbindByRecords();
	}
	getPage(index) {
		if (this.__pageInstanceMap.has(index)) return this.__pageInstanceMap.get(index);
		if (!this.__createPage) throw new Error("Page创建函数未定义！");
		let result = this.__createPage(index);
		result.owner = this.owner;
		result.ui.setSize(this.ui.width, this.ui.height);
		result.init();
		this.__pageInstanceMap.set(index, result);
		return result;
	}
	destroy() {
		super.destroy();
		let values = this.__pageInstanceMap.values();
		let page;
		for (let index = 0; index < this.__pageInstanceMap.size; index++) {
			page = values.next().value;
			page.destroy();
		}
		this.__pageInstanceMap.clear();
		this.__pageInstanceMap = null;
		this.ui = null;
		this.currentPage = null;
		this.currentIndex = void 0;
	}
};
//#endregion
//#region dream-cc-gui/src/gui/tabs/TabPage.ts
var TabPage = class extends Binder {
	constructor() {
		super();
	}
	init() {
		super.init();
	}
	show(data) {
		this.bindByRecords();
	}
	showedUpdate(data) {}
	hide() {
		this.unbindByRecords();
	}
	destroy() {
		super.destroy();
	}
};
//#endregion
export { Alert, BaseMediator, FGUILoader, FGUIResource, GUIManager, GUIMediator, GUIPlugin, GUIProxy, GUIState, ITooltipData, Layer, LayerManager, LoadingView, RelationManager, SubGUIMediator, TabContainer, TabData, TabPage, TooltipManagerImpl, TooltipPosMode };

//# sourceMappingURL=dream-cc-gui.mjs.map