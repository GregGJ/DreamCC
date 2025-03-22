// src/gui/alerts/Alert.ts
import { Injector } from "dream-cc-core";
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
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      throw new Error("\u672A\u6CE8\u5165\uFF1A" + this.KEY);
    }
    return this.__impl;
  }
};
Alert.KEY = "Alert";

// src/gui/layer/Layer.ts
import { GComponent } from "fairygui-cc";
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

// src/gui/layer/LayerManager.ts
import { Injector as Injector2 } from "dream-cc-core";

// src/gui/layer/LayerManagerImpl.ts
import { GRoot } from "fairygui-cc";
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
    } else {
      throw new Error("\u5C42\u5FC5\u987B\u662FLayer");
    }
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
    } else {
      throw new Error("\u627E\u4E0D\u5230\u8981\u5220\u9664\u7684\u5C42\uFF1A" + key);
    }
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

// src/gui/layer/LayerManager.ts
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
    if (this.__impl == null) {
      this.__impl = Injector2.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new LayerManagerImpl();
    }
    return this.__impl;
  }
};
LayerManager.KEY = "LayerManager";

// src/gui/loadingView/LoadingView.ts
import { Injector as Injector3 } from "dream-cc-core";
var LoadingView = class {
  static show() {
    if (!this.impl) {
      return;
    }
    this.impl.show();
  }
  static hide() {
    if (!this.impl) {
      return;
    }
    this.impl.hide();
  }
  static changeData(...args) {
    if (!this.impl) {
      return;
    }
    this.impl.changeData(...args);
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector3.getInject(this.KEY);
    }
    if (this.__impl == null) {
      console.warn(this.KEY + "\u672A\u6CE8\u5165");
    }
    return this.__impl;
  }
};
LoadingView.KEY = "LoadingView";

// src/gui/tooltips/ITooltipData.ts
var ITooltipData = class {
};

// src/gui/tooltips/TooltipManagerImpl.ts
import { Vec2 } from "cc";

// src/gui/tooltips/TooltipPosMode.ts
var TooltipPosMode = /* @__PURE__ */ ((TooltipPosMode2) => {
  TooltipPosMode2[TooltipPosMode2["Touch"] = 0] = "Touch";
  TooltipPosMode2[TooltipPosMode2["Left"] = 1] = "Left";
  TooltipPosMode2[TooltipPosMode2["Right"] = 2] = "Right";
  return TooltipPosMode2;
})(TooltipPosMode || {});

// src/gui/tooltips/TooltipManagerImpl.ts
import { GRoot as GRoot2 } from "fairygui-cc";
var TooltipManagerImpl = class {
  constructor() {
    /**
     * 提示层
     */
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
    if (this.isShowing) {
      this.hide();
    }
    let tData;
    let posMode;
    if (typeof data == "string") {
      tData = data;
      posMode = 0 /* Touch */;
      this.__currentTooltip = this.__tooltipMap.get("default");
    } else if (data instanceof ITooltipData) {
      tData = data.data;
      posMode = data.posMode;
      if (this.__tooltipMap.has(data.tooltipType)) {
        this.__currentTooltip = this.__tooltipMap.get(data.tooltipType);
      } else {
        throw new Error("\u672A\u6CE8\u518Ctooltip Type:" + data.tooltipType);
      }
    }
    this.__currentTooltip.update(tData);
    let layer = LayerManager.getLayer(this.tooltipLayer);
    layer.addChild(this.__currentTooltip.viewComponent);
    this.__layout(posMode);
  }
  __layout(posMode) {
    let view = this.__currentTooltip.viewComponent;
    let pos;
    switch (posMode) {
      case 0 /* Touch */:
        pos = GRoot2.inst.getTouchPosition();
        break;
      case 1 /* Left */:
      case 2 /* Right */:
        pos = new Vec2();
        if (posMode == 1 /* Left */) {
          pos.x = GRoot2.inst.width * 0.25 - view.width * 0.5;
          pos.y = (GRoot2.inst.height - view.height) * 0.5;
        } else {
          pos.x = GRoot2.inst.width - GRoot2.inst.width * 0.25 - view.width * 0.5;
          pos.y = (GRoot2.inst.height - view.height) * 0.5;
        }
        break;
      default:
        throw new Error("Tooltip \u672A\u77E5\u5B9A\u4F4D\u7C7B\u578B\uFF01");
        break;
    }
    if (pos.x < 0) {
      pos.x = 0;
    } else if (pos.x + view.width > GRoot2.inst.width) {
      pos.x = GRoot2.inst.width - view.width;
    }
    if (pos.y < 0) {
      pos.y = 0;
    } else if (pos.y + view.height > GRoot2.inst.height) {
      pos.y = GRoot2.inst.height - view.height;
    }
    view.x = pos.x;
    view.y = pos.y;
  }
  hide() {
    if (!this.isShowing) {
      return;
    }
    let layer = LayerManager.getLayer(this.tooltipLayer);
    layer.removeChild(this.__currentTooltip.viewComponent);
    this.__currentTooltip = null;
  }
  get isShowing() {
    return this.__currentTooltip != null;
  }
};

// src/gui/relations/RelationManager.ts
var RelationManager = class {
  constructor() {
  }
  /**
   * 添加UI关联关系
   * @param key 
   * @param value 
   */
  static addRelation(key, value) {
    if (this.DEBUG) {
      this.__checkValidity(key, value);
    }
    if (this.__map.has(key)) {
      throw new Error("\u91CD\u590D\u6CE8\u518C\uFF01");
    }
    this.__map.set(key, value);
  }
  static removeRelation(key) {
    if (!this.__map.has(key)) {
      throw new Error("\u627E\u4E0D\u5230\u8981\u5220\u9664\u7684\u5185\u5BB9\uFF01");
    }
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
    if (findex >= 0) {
      throw new Error("GuiRelation.config\u914D\u7F6E\u9519\u8BEF:gui:" + guiKey + " show.show:\u4E2D\u4E0D\u80FD\u5305\u542B\u81EA\u8EAB\uFF01");
    }
    findex = showList.hide.indexOf(guiKey);
    if (findex >= 0) {
      throw new Error("GuiRelation.config\u914D\u7F6E\u9519\u8BEF:gui:" + guiKey + " show.hide:\u4E2D\u4E0D\u80FD\u5305\u542B\u81EA\u8EAB\uFF01");
    }
    findex = hideList.show.indexOf(guiKey);
    if (findex >= 0) {
      throw new Error("GuiRelation.config\u914D\u7F6E\u9519\u8BEF:gui:" + guiKey + " hide.show:\u4E2D\u4E0D\u80FD\u5305\u542B\u81EA\u8EAB\uFF01");
    }
    findex = hideList.hide.indexOf(guiKey);
    if (findex >= 0) {
      throw new Error("GuiRelation.config\u914D\u7F6E\u9519\u8BEF:gui:" + guiKey + " hide.hide:\u4E2D\u4E0D\u80FD\u5305\u542B\u81EA\u8EAB\uFF01");
    }
    for (let index = 0; index < showList.show.length; index++) {
      const showkey = showList.show[index];
      const findex2 = showList.hide.indexOf(showkey);
      if (findex2 >= 0) {
        throw new Error("GuiRelation.config\u914D\u7F6E\u9519\u8BEF:gui:" + guiKey + " show.show\u548Cshow.hide\u4E2D\u5305\u542B\u76F8\u540C\u7684guikey:" + showkey);
      }
    }
    for (let index = 0; index < hideList.show.length; index++) {
      const showkey = hideList.show[index];
      const findex2 = hideList.hide.indexOf(showkey);
      if (findex2 >= 0) {
        throw new Error("GuiRelation.config\u914D\u7F6E\u9519\u8BEF:gui:" + guiKey + " hide.show\u548Chide.hide\u4E2D\u5305\u542B\u76F8\u540C\u7684guikey:" + showkey);
      }
    }
  }
  static getRelation(key) {
    return this.__map.get(key);
  }
};
RelationManager.DEBUG = false;
RelationManager.__map = /* @__PURE__ */ new Map();

// src/gui/res/FGUILoader.ts
import { assetManager as assetManager2 } from "cc";

// src/gui/res/FGUIResource.ts
import { assetManager } from "cc";
import { Res, Resource } from "dream-cc-core";
import { UIPackage } from "fairygui-cc";
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
      let bundle = assetManager.getBundle(url.bundle);
      let asset = bundle.get(url.url);
      assetManager.releaseAsset(asset);
    } else {
      throw new Error("\u672A\u5904\u7406\u7684Fguipackage\u9500\u6BC1\uFF01");
    }
    return super.destroy();
  }
};

// src/gui/res/FGUILoader.ts
import { UIPackage as UIPackage2 } from "fairygui-cc";
import { Event, EventDispatcher, Res as Res2, ResourceManager } from "dream-cc-core";
var FGUILoader = class extends EventDispatcher {
  constructor() {
    super();
  }
  load(url) {
    this.url = url;
    if (typeof url == "string") {
      throw new Error("\u672A\u5B9E\u73B0\uFF1A" + url);
    } else {
      let bundle = assetManager2.getBundle(url.bundle);
      let self = this;
      if (!bundle) {
        assetManager2.loadBundle(url.bundle, (err, bundle2) => {
          if (err) {
            self.emit(Event.ERROR, url, err);
            return;
          }
          self.loadUIPackge(url, bundle2);
        });
      } else {
        self.loadUIPackge(url, bundle);
      }
    }
  }
  loadUIPackge(url, bundle) {
    if (typeof url == "string") {
      throw new Error("\u672A\u5B9E\u73B0\uFF1A" + url);
    }
    let self = this;
    UIPackage2.loadPackage(
      bundle,
      url.url,
      (finish, total, item) => {
        const progress = finish / total;
        self.emit(Event.PROGRESS, url, void 0, progress);
      },
      (err, pkg) => {
        if (err) {
          self.emit(Event.ERROR, url, err);
          return;
        }
        const urlKey = Res2.url2Key(url);
        let res = new FGUIResource();
        res.key = urlKey;
        res.content = pkg;
        ResourceManager.addRes(res);
        self.emit(Event.COMPLETE, url);
      }
    );
  }
  reset() {
    this.url = null;
  }
};

// src/gui/BaseMediator.ts
import { Binder } from "dream-cc-core";
var BaseMediator = class extends Binder {
  constructor() {
    super();
    /**UI组件 */
    this.ui = null;
  }
  init() {
    super.init();
  }
  tick(dt) {
  }
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
      if (uiName.startsWith("m_")) {
        uiName = uiName.replace("m_", "");
      }
      ui = ui.getChild(uiName);
      index++;
    }
    return ui;
  }
};

// src/gui/GUIManager.ts
import { Injector as Injector4 } from "dream-cc-core";

// src/gui/GUIProxy.ts
import { assetManager as assetManager3, Node as Node2 } from "cc";

// src/GUIPlugin.ts
import { Color } from "cc";
import { Event as Event2, EventDispatcher as EventDispatcher2, I18N, Logger, Res as Res3 } from "dream-cc-core";
import { GRoot as GRoot3, registerFont, SmartLoader, UIObjectFactory, UIPackage as UIPackage3 } from "fairygui-cc";
var _GUIPlugin = class _GUIPlugin extends EventDispatcher2 {
  constructor() {
    super(...arguments);
    /**
     * 名称
     */
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
    if (!_GUIPlugin.uiPackageURL) {
      _GUIPlugin.uiPackageURL = (packageName, type, bundle) => {
        return { url: "ui/" + packageName, type, bundle };
      };
    }
    Res3.setLoader(Res3.TYPE.FGUI, FGUILoader);
    UIObjectFactory.setLoaderExtension(SmartLoader);
    GRoot3.create(this.__root);
    this.__InitLayer();
    if (this.__assets && this.__assets.length > 0) {
      this.__loadCommonAssets();
    } else {
      if (this.__fonts && this.__fonts.length > 0) {
        this.__loadFonts();
      } else {
        this.__initUI();
      }
    }
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
      let fullScrene = [
        "FullScreen"
      ];
      this.__layer = { layers, fullScrene };
    }
    if (this.__layer.layers && this.__layer.layers.length > 0) {
      for (let index = 0; index < this.__layer.layers.length; index++) {
        const layerKey = this.__layer.layers[index];
        if (this.__layer.fullScrene && this.__layer.fullScrene.length > 0) {
          LayerManager.addLayer(layerKey, new Layer(layerKey, this.__layer.fullScrene.indexOf(layerKey) >= 0));
        } else {
          LayerManager.addLayer(layerKey, new Layer(layerKey));
        }
      }
    }
  }
  __loadCommonAssets() {
    let reqeust = Res3.create(
      this.__assets,
      "Engine",
      (progress) => {
        let v = 0.2 + progress * 0.2;
        this.emit(Event2.PROGRESS, Event2.create(Event2.PROGRESS, this, null, null, v));
      },
      (err) => {
        if (err) {
          reqeust.dispose();
          reqeust = null;
          this.__onError(err);
          return;
        }
        if (this.__fonts && this.__fonts.length > 0) {
          this.__loadFonts();
        } else {
          this.__initUI();
        }
      }
    );
    reqeust.load();
  }
  __loadFonts() {
    let urls = [];
    let fontNames = /* @__PURE__ */ new Map();
    for (let index = 0; index < this.__fonts.length; index++) {
      const config = this.__fonts[index];
      urls.push(config.url);
      fontNames.set(Res3.url2Key(config.url), config.name);
    }
    let request = Res3.create(
      urls,
      "Engine",
      (progress) => {
        let v = 0.4 + progress * 0.2;
        this.emit(Event2.PROGRESS, Event2.create(Event2.PROGRESS, this, null, null, v));
      },
      (err) => {
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
      }
    );
    request.load();
  }
  __initUI() {
    if (this.__guiconfig) {
      let request = Res3.create(
        this.__guiconfig,
        "Engine",
        (progress) => {
          const v = 0.6 + progress * 0.2;
          this.emit(Event2.PROGRESS, Event2.create(Event2.PROGRESS, this, null, null, v));
        },
        (err) => {
          if (err) {
            request.dispose();
            request = null;
            this.__onError(err);
            return;
          }
          let ref = request.getRef();
          let list = ref.content.json;
          for (let index = 0; index < list.length; index++) {
            const element = list[index];
            GUIManager.register(element);
          }
          if (this.__language) {
            this.__loadLangenge();
          } else {
            this.__allComplete();
          }
        }
      );
      request.load();
    } else {
      if (this.__language) {
        this.__loadLangenge();
      } else {
        this.__allComplete();
      }
    }
  }
  /**
   * 加载FGUI语言包
   * @param url 
   * @param p_progress 
   * @param cb 
   */
  __loadLangenge() {
    let request = Res3.create(
      this.__language,
      "Engine",
      (progress) => {
        const v = 0.8 + progress * 0.2;
        this.emit(Event2.PROGRESS, Event2.create(Event2.PROGRESS, this, null, null, v));
      },
      (err) => {
        if (err) {
          request.dispose();
          request = null;
          this.__allComplete();
          return;
        }
        let ref = request.getRef();
        UIPackage3.setStringsSource(this.parseXML(ref.content.text));
        this.__allComplete();
      }
    );
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
        var i = key.indexOf("-");
        if (i == -1)
          continue;
        let t_str = I18N.tr(text);
        cxml.textContent = t_str;
      }
    }
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xml);
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
    this.emit(Event2.COMPLETE, Event2.create(Event2.COMPLETE, this));
  }
};
/**UI遮罩颜色值 */
_GUIPlugin.MaskColor = new Color(0, 0, 0, 255 * 0.5);
/**透明遮罩颜色 */
_GUIPlugin.AlphaMaskColor = new Color(0, 0, 0, 0);
var GUIPlugin = _GUIPlugin;

// src/gui/GUIProxy.ts
import { Event as Event3, EventDispatcher as EventDispatcher3, ModuleManager, Res as Res4 } from "dream-cc-core";
var _GUIProxy = class _GUIProxy {
  constructor(info) {
    /**关闭时间*/
    this.closeTime = 0;
    /**是否在显示中*/
    this.__showing = false;
    /**加载状态 */
    this.__loadState = 0 /* Null */;
    this.info = info;
    if (!this.info) {
      throw new Error("UI\u4FE1\u606F\u4E0D\u80FD\u4E3A\u7A7A\uFF01");
    }
    this.urls = [];
  }
  /**
   * 加载AssetBundle
   */
  __loadAssetBundle() {
    this.__loadState = 1 /* Loading */;
    if (!assetManager3.getBundle(this.info.bundleName)) {
      assetManager3.loadBundle(this.info.bundleName, this.__assetBundleLoaded.bind(this));
    } else {
      this.__assetBundleLoaded();
    }
  }
  /**
   * AssetBundle加载完成
   */
  __assetBundleLoaded() {
    if (GUIPlugin.uiPackageURL == void 0) {
      throw new Error("GUIModule.uiPackageURL\u672A\u5B9A\u4E49!");
    }
    this.urls.push(GUIPlugin.uiPackageURL(this.info.packageName, Res4.TYPE.FGUI, this.info.bundleName));
    let viewCreatorCom = _GUIProxy.createNode.addComponent(this.info.key + "ViewCreator");
    let viewCreator = viewCreatorCom;
    if (!viewCreator) {
      throw new Error(this.info.key + "ViewCreator\u7C7B\u4E0D\u5B58\u5728\u6216\u672A\u5B9E\u73B0IViewCreator!");
    }
    this.mediator = viewCreator.createMediator();
    if (this.mediator.showLoadingView) {
      LoadingView.show();
    }
    viewCreatorCom.destroy();
    if (this.mediator.modules && this.mediator.modules.length > 0) {
      ModuleManager.single.load(
        this.mediator.modules,
        (p_progress) => {
          let progress = p_progress * 0.5 * this.mediator.loadingViewTotalRatio;
          LoadingView.changeData({ label: this.info.key + " Modules startup...", progress });
        },
        (err) => {
          this.__loadAssets();
        }
      );
    } else {
      this.__loadAssets();
    }
  }
  //加载UI资源
  __loadAssets() {
    if (this.mediator.configs && this.mediator.configs.length > 0) {
      for (let index = 0; index < this.mediator.configs.length; index++) {
        const sheet = this.mediator.configs[index];
        const url = Res4.sheet2URL(sheet);
        this.urls.push(url);
      }
    }
    if (this.mediator.assets && this.mediator.assets.length > 0) {
      for (let index = 0; index < this.mediator.assets.length; index++) {
        const url = this.mediator.assets[index];
        this.urls.push(url);
      }
    }
    this.assetsRequest = Res4.create(
      this.urls,
      this.info.key,
      (p_progress) => {
        let progress = (0.5 + p_progress * 0.5) * this.mediator.loadingViewTotalRatio;
        LoadingView.changeData({ label: this.info.key + " Res Loading...", progress });
      },
      (err) => {
        if (err) {
          this.assetsRequest.dispose();
          this.assetsRequest = null;
          LoadingView.changeData({ label: this.info.key + " Res Load Err:" + err });
          return;
        }
        this.__create_ui();
      }
    );
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
    this.__loadState = 2 /* Loaded */;
    this.mediator.init();
    this.mediator.inited = true;
    if (this.__showing) {
      this.__show();
    }
  }
  __add_to_layer() {
    this.layer.addChildAt(this.mediator.viewComponent, this.getLayerChildCount());
    this.mediator.viewComponent.visible = true;
  }
  tick(dt) {
    if (this.__loadState == 2 /* Loaded */) {
      if (this.mediator) {
        this.mediator.tick(dt);
      }
    }
  }
  show(data) {
    this.__showing = true;
    this.data = data;
    this.__show();
  }
  showedUpdate(data) {
    if (this.mediator && this.__showing) {
      this.mediator.showedUpdate(data);
    }
  }
  __show() {
    if (this.__loadState == 0 /* Null */) {
      this.__loadAssetBundle();
    } else if (this.__loadState == 1 /* Loading */) {
    } else {
      this.__add_to_layer();
      if (this.mediator.showLoadingView && this.mediator.closeLoadingView) {
        LoadingView.hide();
      }
      this.mediator.show(this.data);
      this.data = null;
      if (!GUIManager.isOpen(this.info.key)) {
        return;
      }
      if (this.mediator.playShowAnimation) {
        this.mediator.playShowAnimation(this.__showAnimationPlayed.bind(this));
      } else {
        EventDispatcher3.Main.emit(Event3.SHOW, this.info.key);
      }
    }
  }
  __showAnimationPlayed() {
    EventDispatcher3.Main.emit(Event3.SHOW, this.info.key);
  }
  hide() {
    if (this.__loadState == 1 /* Loading */) {
      this.__loadState = 0 /* Null */;
    } else if (this.__loadState == 2 /* Loaded */) {
      if (this.__showing) {
        if (this.mediator.playHideAnimation) {
          this.mediator.playHideAnimation(this.__hideAnimationPlayed.bind(this));
        } else {
          this.__hide();
        }
      }
    }
  }
  __hideAnimationPlayed() {
    if (this.__showing) {
      this.__hide();
    }
  }
  __hide() {
    this.mediator.viewComponent.visible = false;
    this.mediator.hide();
    this.__showing = false;
    EventDispatcher3.Main.emit(Event3.HIDE, this.info.key);
  }
  destroy() {
    var _a;
    console.log("UI\u9500\u6BC1=>" + ((_a = this.info) == null ? void 0 : _a.key));
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
    if (l === void 0) {
      throw new Error("layer\uFF1A" + this.info.layer + "\u4E0D\u5B58\u5728\uFF01");
    }
    return l;
  }
  /**
   * 获取组件
   * @param path 
   */
  getComponent(path) {
    if (!this.mediator) {
      return null;
    }
    return this.mediator.getUIComponent(path);
  }
};
/**用于Creator创建器的统一帮助节点 */
_GUIProxy.createNode = new Node2("createHelpNode");
var GUIProxy = _GUIProxy;

// src/gui/GUIState.ts
var GUIState = /* @__PURE__ */ ((GUIState2) => {
  GUIState2[GUIState2["Null"] = 0] = "Null";
  GUIState2[GUIState2["Showing"] = 1] = "Showing";
  GUIState2[GUIState2["Showed"] = 2] = "Showed";
  GUIState2[GUIState2["Closeing"] = 3] = "Closeing";
  GUIState2[GUIState2["Closed"] = 4] = "Closed";
  return GUIState2;
})(GUIState || {});

// src/gui/GUIManagerImpl.ts
import { Event as Event4, EventDispatcher as EventDispatcher4, TickerManager, Timer } from "dream-cc-core";
var GUIManagerImpl = class {
  constructor() {
    /**已注册*/
    this.__registered = /* @__PURE__ */ new Map();
    /**实例 */
    this.__instances = /* @__PURE__ */ new Map();
    /**
     * 删除列表
     */
    this.__destryList = [];
    TickerManager.addTicker(this);
    EventDispatcher4.Main.on(Event4.SHOW, this.__showedHandler, this);
    EventDispatcher4.Main.on(Event4.HIDE, this.__closedHandler, this);
  }
  /**获取某个组件 */
  getUIComponent(key, path) {
    if (!this.__instances.has(key)) {
      throw new Error("GUI:" + key + "\u5B9E\u4F8B\uFF0C\u4E0D\u5B58\u5728\uFF01");
    }
    let guiProxy = this.__instances.get(key);
    return guiProxy.getComponent(path);
  }
  /**
   * 获取界面的mediator
   * @param key 
   */
  getMediatorByKey(key) {
    if (!this.__instances.has(key)) {
      return null;
    }
    return this.__instances.get(key).mediator;
  }
  __showedHandler(e) {
    let guiKey = e.data;
    this.setState(guiKey, 2 /* Showed */);
  }
  __closedHandler(e) {
    let guiKey = e.data;
    this.setState(guiKey, 4 /* Closed */);
  }
  register(info) {
    if (this.__registered.has(info.key)) {
      throw new Error("\u91CD\u590D\u6CE8\u518C\uFF01");
    }
    this.__registered.set(info.key, info);
  }
  unregister(key) {
    if (!this.__registered.has(key)) {
      throw new Error("\u672A\u627E\u5230\u8981\u6CE8\u9500\u7684\u754C\u9762\u4FE1\u606F\uFF01");
    }
    this.__registered.delete(key);
  }
  tick(dt) {
    this.__destryList.length = 0;
    let currentTime = Timer.currentTime;
    this.__instances.forEach((value, key, map) => {
      if (value.info.state == 2 /* Showed */) {
        value.tick(dt);
      } else if (value.info.state == 4 /* Closed */) {
        if (!value.info.permanence) {
          if (currentTime - value.closeTime > GUIManager.GUI_GC_INTERVAL) {
            this.__destryList.push(key);
          }
        }
      }
    });
    if (this.__destryList.length > 0) {
      let gui;
      for (let index = 0; index < this.__destryList.length; index++) {
        const key = this.__destryList[index];
        gui = this.__instances.get(key);
        gui.info.state = 0 /* Null */;
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
    if (state == 0 /* Null */) {
      let info = this.__registered.get(key);
      guiProxy = new GUIProxy(info);
      guiProxy.info.state = 1 /* Showing */;
      this.__instances.set(info.key, guiProxy);
      this.checkFullLayer(guiProxy);
      guiProxy.show(data);
      return;
    }
    if (state == 1 /* Showing */) {
      guiProxy = this.__instances.get(key);
      this.checkFullLayer(guiProxy);
      guiProxy.show(data);
      return;
    }
    if (state == 2 /* Showed */) {
      guiProxy = this.__instances.get(key);
      this.checkFullLayer(guiProxy);
      guiProxy.showedUpdate(data);
      LoadingView.hide();
      return;
    }
    if (state == 3 /* Closeing */ || state == 4 /* Closed */) {
      guiProxy = this.__instances.get(key);
      guiProxy.info.state = 1 /* Showing */;
      this.checkFullLayer(guiProxy);
      guiProxy.show(data);
      return;
    }
  }
  //全屏层同时只能打开一个界面
  checkFullLayer(guiProxy) {
    let layer = LayerManager.getLayer(guiProxy.info.layer);
    if (layer.isFullScrene) {
      for (let index = 0; index < layer.openRecord.length; index++) {
        const guiKey = layer.openRecord[index];
        if (guiKey != guiProxy.info.key) {
          this.__close(guiKey);
        }
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
    if (state == 0 /* Null */ || state == 4 /* Closed */ || state == 3 /* Closeing */) {
      return;
    }
    guiProxy = this.__instances.get(key);
    guiProxy.closeTime = Timer.currentTime;
    guiProxy.info.state = 3 /* Closeing */;
    guiProxy.hide();
    if (!checkLayer) {
      return;
    }
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
      if (isOpen) {
        relationList = relation.show;
      } else {
        relationList = relation.hide;
      }
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
    if (!this.__registered.has(key)) {
      throw new Error("GUI:" + key + "\u672A\u6CE8\u518C\uFF01");
    }
    if (!this.__instances.has(key)) {
      return 0 /* Null */;
    }
    let proxy = this.__instances.get(key);
    return proxy.info.state;
  }
  setState(key, state) {
    if (!this.__registered.has(key)) {
      throw new Error("GUI:" + key + "\u672A\u6CE8\u518C\uFF01");
    }
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
    if (state == 1 /* Showing */ || state == 2 /* Showed */) {
      return true;
    }
    return false;
  }
};

// src/gui/GUIManager.ts
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
    if (this.__impl == null) {
      this.__impl = Injector4.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new GUIManagerImpl();
    }
    return this.__impl;
  }
};
GUIManager.KEY = "GUIManager";
/**
 * 在界面关闭后多长时间不使用则销毁(秒)
 */
GUIManager.GUI_GC_INTERVAL = 30;

// src/gui/GUIMediator.ts
import { Color as Color2 } from "cc";
import { AsyncOperation, GComponent as GComponent3, GGraph, UIPackage as UIPackage4 } from "fairygui-cc";
import { ModuleManager as ModuleManager2 } from "dream-cc-core";
var GUIMediator = class extends BaseMediator {
  constructor() {
    super();
    this.info = null;
    /**是否显示进度界面 */
    this.showLoadingView = false;
    /**显示界面时是否关闭进度条*/
    this.closeLoadingView = true;
    /**界面从开始加载到底层调用Show方法之前的进度总比值 */
    this.loadingViewTotalRatio = 1;
    /**根节点 */
    this.viewComponent = null;
    /**遮罩 */
    this.__mask = null;
  }
  /**
   * 创建UI
   * @param info 
   * @param created 
   */
  createUI(info, created) {
    this.info = info;
    if (this.info == null) {
      throw new Error("GUI \u4FE1\u606F\u4E0D\u80FD\u4E3A\u7A7A");
    }
    this.__createdCallBack = created;
    this.__createUI(true);
  }
  __createUI(async) {
    let packageName = this.info.packageName;
    let com_name = this.info.comName;
    if (this.info.comName.startsWith("UI_")) {
      com_name = this.info.comName.substring("UI_".length);
    }
    if (async) {
      this.__asyncCreator = new AsyncOperation();
      this.__asyncCreator.callback = this.__uiCreated.bind(this);
      this.__asyncCreator.createObject(packageName, com_name);
    } else {
      try {
        let ui = UIPackage4.createObject(packageName, com_name);
        this.__uiCreated(ui);
      } catch (err) {
        throw new Error("\u521B\u5EFA\u754C\u9762\u5931\u8D25\uFF1A" + this.info.packageName + " " + com_name);
      }
    }
  }
  __uiCreated(ui) {
    let uiCom = ui.asCom;
    uiCom.makeFullScreen();
    if (this.info.modal) {
      this.ui = uiCom;
      this.viewComponent = new GComponent3();
      this.viewComponent.makeFullScreen();
      this.__mask = new GGraph();
      this.__mask.touchable = true;
      this.__mask.makeFullScreen();
      this.__mask.drawRect(0, Color2.BLACK, this.info.maskAlpha ? GUIPlugin.AlphaMaskColor : GUIPlugin.MaskColor);
      this.viewComponent.addChild(this.__mask);
      if (this.info.modalClose) {
        this.__mask.onClick(this._maskClickHandler, this);
      }
      this.viewComponent.addChild(this.ui);
    } else {
      this.ui = this.viewComponent = uiCom;
    }
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
    if (this.$subMediators) {
      for (let index = 0; index < this.$subMediators.length; index++) {
        const element = this.$subMediators[index];
        element.show(data);
      }
    }
    if (this.tabContainer) {
      this.tabContainer.show(data);
    }
  }
  showedUpdate(data) {
    super.showedUpdate(data);
    if (this.$subMediators) {
      for (let index = 0; index < this.$subMediators.length; index++) {
        const element = this.$subMediators[index];
        element.showedUpdate(data);
      }
    }
    if (this.tabContainer) {
      this.tabContainer.showedUpdate(data);
    }
  }
  hide() {
    super.hide();
    if (this.$subMediators) {
      for (let index = 0; index < this.$subMediators.length; index++) {
        const element = this.$subMediators[index];
        element.hide();
      }
    }
    if (this.tabContainer) {
      this.tabContainer.hide();
    }
  }
  /**
   * 关闭
   * @param checkLayer 是否检查全屏层记录
   */
  close(checkLayer = true) {
    GUIManager.close(this.info.key, checkLayer);
  }
  tick(dt) {
    if (this.$subMediators) {
      for (let index = 0; index < this.$subMediators.length; index++) {
        const element = this.$subMediators[index];
        element.tick(dt);
      }
    }
  }
  /**
   * 获取模块
   * @param key 
   * @returns 
   */
  getModule(key) {
    if (!this.modules || this.modules.length == 0 || this.modules.indexOf(key) < 0) {
      throw new Error("\u65E0\u6CD5\u83B7\u53D6\u672A\u5F15\u7528\u7684\u6A21\u5757\uFF1A" + key + ",\u8BF7\u5728Mediator\u6784\u9020\u51FD\u6570\u4E2D\u5F15\u7528\u6A21\u5757!");
    }
    return ModuleManager2.single.getModule(key);
  }
  destroy() {
    super.destroy();
    if (this.__mask) {
      this.__mask.offClick(this._maskClickHandler, this);
      this.__mask.dispose();
      this.__mask = null;
    }
    this.viewComponent.dispose();
    if (this.$subMediators) {
      for (let index = 0; index < this.$subMediators.length; index++) {
        const element = this.$subMediators[index];
        element.destroy();
      }
    }
    this.configs = null;
    this.assets = null;
    if (this.tabContainer) {
      this.tabContainer.destroy();
      this.tabContainer = null;
    }
    if (this.modules && this.modules.length > 0) {
      for (const moduleName of this.modules) {
        ModuleManager2.single.dispose(moduleName);
      }
      this.modules = null;
    }
    this.info = null;
  }
};

// src/gui/SubGUIMediator.ts
var SubGUIMediator = class extends BaseMediator {
  constructor(ui, owner) {
    super();
    if (ui == null) {
      throw new Error("ui\u7EC4\u4EF6\u4E3A\u7A7A");
    }
    this.ui = ui;
    this.owner = owner;
    this.inited = true;
  }
  /**
   * 子类必须在构造函数中调用
   */
  init() {
  }
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

// src/gui/tabs/TabContainer.ts
import { Binder as Binder2 } from "dream-cc-core";
var TabContainer = class extends Binder2 {
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
    if (index == this.currentIndex) {
      return;
    }
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
    if (page == this.currentIndex) {
      this.currentPage.showedUpdate(pageData);
    } else {
      this.switchPage(page, pageData);
    }
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
    if (this.__pageInstanceMap.has(index)) {
      return this.__pageInstanceMap.get(index);
    }
    if (!this.__createPage) {
      throw new Error("Page\u521B\u5EFA\u51FD\u6570\u672A\u5B9A\u4E49\uFF01");
    }
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

// src/gui/tabs/TabPage.ts
import { Binder as Binder3 } from "dream-cc-core";
var TabPage = class extends Binder3 {
  constructor() {
    super();
  }
  init() {
    super.init();
  }
  show(data) {
    this.bindByRecords();
  }
  showedUpdate(data) {
  }
  hide() {
    this.unbindByRecords();
  }
  destroy() {
    super.destroy();
  }
};
export {
  Alert,
  BaseMediator,
  FGUILoader,
  FGUIResource,
  GUIManager,
  GUIMediator,
  GUIPlugin,
  GUIProxy,
  GUIState,
  ITooltipData,
  Layer,
  LayerManager,
  LoadingView,
  RelationManager,
  SubGUIMediator,
  TabContainer,
  TabPage,
  TooltipManagerImpl,
  TooltipPosMode
};
//# sourceMappingURL=dream-cc-gui.mjs.map
