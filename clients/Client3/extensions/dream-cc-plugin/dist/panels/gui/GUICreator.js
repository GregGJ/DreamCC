"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUICreator = void 0;
const fs_1 = require("fs");
const vue_1 = require("vue");
// @ts-ignore
const package_json_1 = __importDefault(require("../../../package.json"));
const StringUtils_1 = require("../../utils/StringUtils");
const GUICode_1 = require("./GUICode");
const EnumUtils_1 = require("../../utils/EnumUtils");
/**
 * UI创建器
 */
class GUICreator {
    constructor() {
        this.inited = false;
        /**
         * guiconfig.json文件路径
         */
        this.guiconfigFile = (0, vue_1.ref)("");
        this.guiconfigData = (0, vue_1.reactive)([]);
        /**
         * GUI枚举文件
         */
        this.guiEnumFile = (0, vue_1.ref)("");
        this.guiEnumData = (0, vue_1.reactive)(new EnumUtils_1.EnumData());
        /**层级枚举文件路径 */
        this.layerEnumFile = (0, vue_1.ref)("");
        this.layerEnumData = (0, vue_1.reactive)(new EnumUtils_1.EnumData());
        /**
         * 模块文件夹路径
         */
        this.modulesPath = (0, vue_1.ref)("");
        /**模块名列表 */
        this.modules = (0, vue_1.reactive)([]);
        /**当前选择的模块 */
        this.moduleName = (0, vue_1.ref)("");
        /**模块过滤 */
        this.moduleFilter = (0, vue_1.ref)("");
        this.layerName = (0, vue_1.ref)("");
        //永不销毁
        this.permanence = (0, vue_1.ref)(true);
        //是否使用蒙版
        this.modal = (0, vue_1.ref)(false);
        this.modalClose = (0, vue_1.ref)(false);
        this.uiComments = (0, vue_1.ref)("");
        /**UI名称 */
        this.uiName = (0, vue_1.ref)("");
        this.components = (0, vue_1.reactive)([]);
        this.componentName = (0, vue_1.ref)("");
    }
    /**
     * guiconfig.json文件路径改变
     * @param value
     */
    guiConfigFileChanged(value) {
        if (StringUtils_1.StringUtils.isEmpty(value)) {
            return;
        }
        this.guiconfigFile.value = value;
        let configInfo;
        let guiStr = (0, fs_1.readFileSync)(this.guiconfigFile.value, { encoding: "utf-8" });
        let guiList = JSON.parse(guiStr);
        let guiMediatorPath;
        let isChanged = false;
        //检测UI
        if (this.modulesPath.value.length != 0) {
            for (let index = 0; index < guiList.length; index++) {
                configInfo = guiList[index];
                guiMediatorPath = this.modulesPath.value + "/" + configInfo.bundleName + "/" + configInfo.key + "Mediator.ts";
                // console.log(guiMediatorPath);
                if (!(0, fs_1.existsSync)(guiMediatorPath)) {
                    console.log("检测到UI:" + guiMediatorPath + "不存在了,从guiconfig.json和gui枚举类中中删除!");
                    const idx = this.guiEnumData.enums.indexOf(configInfo.key);
                    // console.log(idx, this.guiEnumData.commentsList, this.guiEnumData.enums);
                    if (idx >= 0) {
                        this.guiEnumData.commentsList.splice(idx, 1);
                        this.guiEnumData.enums.splice(idx, 1);
                    }
                    // console.log(this.guiEnumData.commentsList, this.guiEnumData.enums);
                    isChanged = true;
                }
                else {
                    this.guiconfigData.push(configInfo);
                }
            }
        }
        if (isChanged) {
            this.saveGuiConfig();
            this.saveGuiEnumFile();
        }
        this.save2LocalData();
    }
    /**
     * 保存guiconfig.json
     */
    saveGuiConfig() {
        let list = [];
        if (this.guiconfigFile.value.length > 0) {
            for (const iterator of this.guiconfigData.values()) {
                list.push(iterator);
            }
        }
        let configStr = JSON.stringify(list, null, 5);
        console.log("保存:" + this.guiconfigFile.value);
        (0, fs_1.writeFileSync)(this.guiconfigFile.value, configStr, "utf8");
    }
    /**
     * GUI枚举文件改变
     * @param value
     */
    guiEnumFileChanged(value) {
        if (StringUtils_1.StringUtils.isEmpty(value)) {
            return;
        }
        this.guiEnumFile.value = value;
        EnumUtils_1.EnumUtils.getEnumFile(this.guiEnumFile.value, this.guiEnumData);
        // console.log("读取GUI枚举成功：",this.guiEnumData.enumName,this.guiEnumData.commentsList,this.guiEnumData.enums);
        this.save2LocalData();
    }
    /**
     * 保存gui枚举
     */
    saveGuiEnumFile() {
        let code = "export enum " + this.guiEnumData.enumName + " {\n";
        if (this.guiEnumFile.value.length > 0) {
            let total = this.guiEnumData.enums.length;
            for (let index = 0; index < total; index++) {
                const commant = this.guiEnumData.commentsList[index];
                const key = this.guiEnumData.enums[index];
                if (index < total) {
                    code += "    /**" + commant + "*/\n";
                    code += '    ' + key + ' = "' + key + '",\n';
                }
                else {
                    code += "    /**" + commant + "*/\n";
                    code += '    ' + key + ' = "' + key + '"\n';
                }
            }
        }
        code += "}";
        console.log("保存:" + this.guiEnumFile.value);
        (0, fs_1.writeFileSync)(this.guiEnumFile.value, code, "utf8");
    }
    /**
     * 层级枚举文件路径改变
     * @param value
     */
    layerEnumFileChanged(value) {
        if (StringUtils_1.StringUtils.isEmpty(value)) {
            return;
        }
        this.layerEnumFile.value = value;
        EnumUtils_1.EnumUtils.getEnumFile(this.layerEnumFile.value, this.layerEnumData);
        // console.log("读取GUI枚举成功：", this.guiEnumData.enumName, this.guiEnumData.commentsList, this.guiEnumData.enums);
        this.save2LocalData();
    }
    /**模块路径改变 */
    modulesPathChanged(value) {
        if (StringUtils_1.StringUtils.isEmpty(value)) {
            return;
        }
        this.modulesPath.value = value;
        if (this.modulesPath.value.length == 0) {
            return;
        }
        this.refreshModules();
        this.save2LocalData();
    }
    /**当前模块改变 */
    moduleNameChanged(value) {
        this.moduleName.value = value;
        this.refreshComponent();
    }
    /**模块过滤条件修改 */
    moduleFilterChanged(value) {
        this.moduleFilter.value = value;
        this.refreshModules();
    }
    /**刷新模块列表 */
    refreshModules() {
        this.modules.length = 0;
        let dirPath = this.modulesPath.value;
        let files = (0, fs_1.readdirSync)(dirPath);
        let stats;
        let filePath;
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            filePath = dirPath + "/" + element;
            stats = (0, fs_1.statSync)(filePath);
            if (stats.isDirectory()) {
                //排除games文件夹
                if (element == "games")
                    continue;
                if (this.moduleFilter.value != null && this.moduleFilter.value.length != 0) {
                    if (element.indexOf(this.moduleFilter.value) >= 0) {
                        this.modules.push(element);
                    }
                }
                else {
                    this.modules.push(element);
                }
            }
        }
        this.refreshComponent();
    }
    layerChanged(value) {
        this.layerName.value = value;
    }
    permanenceChanged(value) {
        this.permanence.value = value;
    }
    modalChanged(value) {
        this.modal.value = value;
    }
    modalCloseChanged(value) {
        this.modalClose.value = value;
    }
    uiCommentsChanged(value) {
        this.uiComments.value = value;
    }
    uiNameChanged(value) {
        this.uiName.value = value;
    }
    componentChanged(value) {
        this.componentName.value = value;
    }
    //模块内组件
    refreshComponent() {
        this.components.length = 0;
        this.componentName.value = "";
        if (this.moduleName.value == null || this.moduleName.value.length == 0) {
            return;
        }
        let binder = this.modulesPath.value + "/" + this.moduleName.value + "/" + this.moduleName.value + "Binder.ts";
        if (!(0, fs_1.existsSync)(binder)) {
            console.warn("文件不存在:" + this.modulesPath.value + "/" + this.moduleName.value + "/" + this.moduleName.value + "Binder.ts");
            return;
        }
        let fileStr = (0, fs_1.readFileSync)(binder, { encoding: "utf-8" });
        let re = /(?<=export class ).*?(?=extends)/g;
        let result = fileStr.match(re);
        if (result) {
            for (let index = 0; index < result.length; index++) {
                const className = result[index];
                this.components.push(className);
            }
        }
    }
    /**
     * 读取本地配置
     */
    readLocalData() {
        // Editor.Profile.removeConfig(packageJSON.name + ".gui", "data", "local");
        // return;
        // 读取本地数据记录
        Editor.Profile.getConfig(package_json_1.default.name + ".gui", "data", "local").then(value => {
            let localData = JSON.parse(value);
            if (localData === null) {
                //默认
                this.modulesPath.value = Editor.Project.path + "/assets/src/modules";
                this.guiconfigFile.value = Editor.Project.path + "/assets/res/configs/guiconfig.json";
                this.guiEnumFile.value = Editor.Project.path + "/assets/src/games/consts/GUIKeys.ts";
                this.layerEnumFile.value = Editor.Project.path + "/assets/src/games/consts/LayerKeys.ts";
                //创建文件
                if (!(0, fs_1.existsSync)(this.guiconfigFile.value)) {
                    this.guiEnumData.enumName = "GUIKeys";
                    this.saveGuiConfig();
                }
                else {
                    this.guiConfigFileChanged(this.guiconfigFile.value);
                }
                if (!(0, fs_1.existsSync)(this.guiEnumFile.value)) {
                    this.saveGuiEnumFile();
                }
                else {
                    this.guiEnumFileChanged(this.guiEnumFile.value);
                }
                if (!(0, fs_1.existsSync)(this.layerEnumFile.value)) {
                    this.layerEnumData.enumName = "LayerKeys";
                }
                this.inited = true;
                this.refreshModules();
                this.save2LocalData();
            }
            else {
                this.guiEnumFileChanged(localData.guiEnumFile);
                this.layerEnumFileChanged(localData.layerEnumFile);
                this.modulesPathChanged(localData.modulesPath);
                this.guiConfigFileChanged(localData.guiconfigFile);
            }
            this.inited = true;
        }, reasion => {
            console.log("读取本地配置路径失败");
        });
    }
    /**
     * 保存本地配置
     */
    save2LocalData() {
        if (!this.inited) {
            return;
        }
        let data = {};
        data.guiconfigFile = this.guiconfigFile.value;
        data.guiEnumFile = this.guiEnumFile.value;
        data.layerEnumFile = this.layerEnumFile.value;
        data.modulesPath = this.modulesPath.value;
        let json = JSON.stringify(data);
        Editor.Profile.setConfig(package_json_1.default.name + ".gui", "data", json, "local").then(() => {
            console.log("保存本地配置路径成功：" + json);
        }, reason => {
            console.log("保存本地配置路径失败：" + json);
        });
    }
    /**
     * 创建UI
     */
    createUI() {
        if (this.guiconfigFile.value.length == 0) {
            console.warn("guiconfig配置路径未设置！");
            return;
        }
        if (this.guiEnumFile.value.length == 0) {
            console.warn("gui枚举定义类未指定！");
            return;
        }
        if (this.layerEnumFile.value.length == 0) {
            console.warn("层级枚举定义类未指定！");
            return;
        }
        if (this.modulesPath.value.length == 0) {
            console.log("模块路径未设置！");
            return;
        }
        if (this.moduleName.value.length == 0) {
            console.warn("模块未选择！");
            return;
        }
        if (this.componentName.value.length == 0) {
            console.warn("依赖组件未选择");
            return;
        }
        if (this.uiName.value.length == 0) {
            console.warn("UI名称未定义");
            return;
        }
        if (this.layerName.value.length == 0) {
            console.warn("层级未选择");
            return;
        }
        if (this.guiEnumData.enums.includes(this.uiName.value)) {
            console.error("UI:" + this.uiName.value + " 已存在！");
            return;
        }
        //UI枚举添加
        this.guiEnumData.commentsList.push(this.uiComments.value);
        this.guiEnumData.enums.push(this.uiName.value);
        this.guiconfigData.push({
            key: this.uiName.value,
            layer: this.layerName.value,
            modal: this.modal.value,
            modalClose: this.modalClose.value,
            permanence: this.permanence.value,
            bundleName: this.moduleName.value,
            packageName: this.moduleName.value,
            comName: this.componentName.value
        });
        //保存guiconfig.json
        this.saveGuiConfig();
        this.saveGuiEnumFile();
        let mediatorStr = GUICode_1.GUICode.getMediator(this.moduleName.value, this.componentName.value, this.uiName.value, this.uiComments.value);
        //保存UI代码
        (0, fs_1.writeFileSync)(this.modulesPath.value + "/" + this.moduleName.value + "/" + this.uiName.value + "Mediator.ts", mediatorStr, { encoding: "utf-8" });
        //发送刷新消息
        Editor.Message.broadcast("refresh-asset", "db://assets/");
    }
}
exports.GUICreator = GUICreator;
