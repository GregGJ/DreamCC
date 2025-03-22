
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { Ref, ref, reactive } from 'vue';
// @ts-ignore
import packageJSON from '../../../package.json';
import { StringUtils } from '../../utils/StringUtils';
import { join } from 'path';
import { GUICode } from './GUICode';
import { EnumData, EnumUtils } from '../../utils/EnumUtils';

/**
 * UI创建器
 */
export class GUICreator {

    inited: boolean = false;

    constructor() {

    }


    /**
     * guiconfig.json文件路径
     */
    guiconfigFile: Ref<string> = ref("");
    guiconfigData: any[] = reactive([]);
    /**
     * guiconfig.json文件路径改变
     * @param value 
     */
    guiConfigFileChanged(value: string): void {
        if (StringUtils.isEmpty(value)) {
            return;
        }
        this.guiconfigFile.value = value;
        let configInfo;
        let guiStr = readFileSync(this.guiconfigFile.value, { encoding: "utf-8" });
        let guiList = JSON.parse(guiStr);
        let guiMediatorPath: string;
        let isChanged: boolean = false;
        //检测UI
        if (this.modulesPath.value.length != 0) {
            for (let index = 0; index < guiList.length; index++) {
                configInfo = guiList[index];
                guiMediatorPath = this.modulesPath.value + "/" + configInfo.bundleName + "/" + configInfo.key + "Mediator.ts"
                // console.log(guiMediatorPath);
                if (!existsSync(guiMediatorPath)) {
                    console.log("检测到UI:" + guiMediatorPath + "不存在了,从guiconfig.json和gui枚举类中中删除!");
                    const idx = this.guiEnumData.enums.indexOf(configInfo.key);
                    // console.log(idx, this.guiEnumData.commentsList, this.guiEnumData.enums);
                    if (idx >= 0) {
                        this.guiEnumData.commentsList.splice(idx, 1);
                        this.guiEnumData.enums.splice(idx, 1);
                    }
                    // console.log(this.guiEnumData.commentsList, this.guiEnumData.enums);
                    isChanged = true;
                } else {
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
    saveGuiConfig(): void {
        let list = [];
        if (this.guiconfigFile.value.length > 0) {
            for (const iterator of this.guiconfigData.values()) {
                list.push(iterator);
            }
        }
        let configStr = JSON.stringify(list, null, 5);
        console.log("保存:" + this.guiconfigFile.value);
        writeFileSync(this.guiconfigFile.value, configStr, "utf8");
    }

    /**
     * GUI枚举文件
     */
    guiEnumFile: Ref<string> = ref("");
    guiEnumData = reactive(new EnumData());
    /**
     * GUI枚举文件改变
     * @param value 
     */
    guiEnumFileChanged(value: string): void {
        if (StringUtils.isEmpty(value)) {
            return;
        }
        this.guiEnumFile.value = value;
        EnumUtils.getEnumFile(this.guiEnumFile.value, this.guiEnumData);
        // console.log("读取GUI枚举成功：",this.guiEnumData.enumName,this.guiEnumData.commentsList,this.guiEnumData.enums);
        this.save2LocalData();
    }

    /**
     * 保存gui枚举
     */
    saveGuiEnumFile(): void {
        let code: string = "export enum " + this.guiEnumData.enumName + " {\n";
        if (this.guiEnumFile.value.length > 0) {
            let total: number = this.guiEnumData.enums.length;
            for (let index = 0; index < total; index++) {
                const commant = this.guiEnumData.commentsList[index];
                const key = this.guiEnumData.enums[index];
                if (index < total) {
                    code += "    /**" + commant + "*/\n";
                    code += '    ' + key + ' = "' + key + '",\n';
                } else {
                    code += "    /**" + commant + "*/\n";
                    code += '    ' + key + ' = "' + key + '"\n';
                }
            }
        }
        code += "}";
        console.log("保存:" + this.guiEnumFile.value);
        writeFileSync(this.guiEnumFile.value, code, "utf8");
    }


    /**层级枚举文件路径 */
    layerEnumFile: Ref<string> = ref("");
    layerEnumData = reactive(new EnumData());
    /**
     * 层级枚举文件路径改变
     * @param value 
     */
    layerEnumFileChanged(value: string): void {
        if (StringUtils.isEmpty(value)) {
            return;
        }
        this.layerEnumFile.value = value;
        EnumUtils.getEnumFile(this.layerEnumFile.value, this.layerEnumData);
        // console.log("读取GUI枚举成功：", this.guiEnumData.enumName, this.guiEnumData.commentsList, this.guiEnumData.enums);
        this.save2LocalData();
    }

    /**
     * 模块文件夹路径
     */
    modulesPath = ref("");
    /**模块名列表 */
    modules = reactive([]);
    /**当前选择的模块 */
    moduleName = ref("");
    /**模块过滤 */
    moduleFilter = ref("");

    /**模块路径改变 */
    modulesPathChanged(value: string): void {
        if (StringUtils.isEmpty(value)) {
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
    moduleNameChanged(value): void {
        this.moduleName.value = value;
        this.refreshComponent();
    }

    /**模块过滤条件修改 */
    moduleFilterChanged(value: string): void {
        this.moduleFilter.value = value;
        this.refreshModules();
    }

    /**刷新模块列表 */
    refreshModules(): void {
        this.modules.length = 0;
        let dirPath = this.modulesPath.value;
        let files = readdirSync(dirPath);
        let stats;
        let filePath;
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            filePath = dirPath + "/" + element;
            stats = statSync(filePath);
            if (stats.isDirectory()) {
                //排除games文件夹
                if (element == "games") continue;
                if (this.moduleFilter.value != null && this.moduleFilter.value.length != 0) {
                    if (element.indexOf(this.moduleFilter.value) >= 0) {
                        this.modules.push(element);
                    }
                } else {
                    this.modules.push(element);
                }
            }
        }
        this.refreshComponent();
    }


    layerName = ref("");
    layerChanged(value): void {
        this.layerName.value = value;
    }

    //永不销毁
    permanence = ref(true);
    permanenceChanged(value): void {
        this.permanence.value = value;
    }
    //是否使用蒙版
    modal = ref(false);
    modalChanged(value): void {
        this.modal.value = value;
    }
    modalClose = ref(false);
    modalCloseChanged(value): void {
        this.modalClose.value = value;
    }

    uiComments = ref("");
    uiCommentsChanged(value: string): void {
        this.uiComments.value = value;
    }
    /**UI名称 */
    uiName = ref("");
    uiNameChanged(value: string): void {
        this.uiName.value = value;
    }
    components = reactive([]);
    componentName = ref("");
    componentChanged(value: string): void {
        this.componentName.value = value;
    }
    //模块内组件
    refreshComponent(): void {
        this.components.length = 0;
        this.componentName.value = "";
        if (this.moduleName.value == null || this.moduleName.value.length == 0) {
            return;
        }
        let binder = this.modulesPath.value + "/" + this.moduleName.value + "/" + this.moduleName.value + "Binder.ts";
        if (!existsSync(binder)) {
            console.warn("文件不存在:" + this.modulesPath.value + "/" + this.moduleName.value + "/" + this.moduleName.value + "Binder.ts");
            return;
        }
        let fileStr = readFileSync(binder, { encoding: "utf-8" });
        let re = /(?<=export class ).*?(?=extends)/g;
        let result = fileStr.match(re);
        if(result){
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
        Editor.Profile.getConfig(packageJSON.name + ".gui", "data", "local").then(
            value => {
                let localData = JSON.parse(value);
                if (localData === null) {
                    //默认
                    this.modulesPath.value = Editor.Project.path + "/assets/src/modules";
                    this.guiconfigFile.value = Editor.Project.path + "/assets/res/configs/guiconfig.json";
                    this.guiEnumFile.value = Editor.Project.path + "/assets/src/games/consts/GUIKeys.ts";
                    this.layerEnumFile.value = Editor.Project.path + "/assets/src/games/consts/LayerKeys.ts";
                    //创建文件
                    if (!existsSync(this.guiconfigFile.value)) {
                        this.guiEnumData.enumName = "GUIKeys";
                        this.saveGuiConfig();
                    } else {
                        this.guiConfigFileChanged(this.guiconfigFile.value);
                    }
                    if (!existsSync(this.guiEnumFile.value)) {
                        this.saveGuiEnumFile();
                    } else {
                        this.guiEnumFileChanged(this.guiEnumFile.value);
                    }
                    if (!existsSync(this.layerEnumFile.value)) {
                        this.layerEnumData.enumName = "LayerKeys";
                    }
                    this.inited = true;
                    this.refreshModules();
                    this.save2LocalData();
                } else {
                    this.guiEnumFileChanged(localData.guiEnumFile);
                    this.layerEnumFileChanged(localData.layerEnumFile);
                    this.modulesPathChanged(localData.modulesPath);
                    this.guiConfigFileChanged(localData.guiconfigFile);
                }
                this.inited = true;
            }, reasion => {
                console.log("读取本地配置路径失败");
            }
        )
    }

    /**
     * 保存本地配置
     */
    save2LocalData(): void {
        if (!this.inited) {
            return;
        }
        let data: any = {};
        data.guiconfigFile = this.guiconfigFile.value;
        data.guiEnumFile = this.guiEnumFile.value;
        data.layerEnumFile = this.layerEnumFile.value;
        data.modulesPath = this.modulesPath.value;
        let json = JSON.stringify(data);
        Editor.Profile.setConfig(packageJSON.name + ".gui", "data", json, "local").then(
            () => {
                console.log("保存本地配置路径成功：" + json);
            }, reason => {
                console.log("保存本地配置路径失败：" + json);
            });
    }


    /**
     * 创建UI
     */
    createUI(): void {
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

        let mediatorStr = GUICode.getMediator(
            this.moduleName.value,
            this.componentName.value,
            this.uiName.value,
            this.uiComments.value
        );
        //保存UI代码
        writeFileSync(this.modulesPath.value + "/" + this.moduleName.value + "/" + this.uiName.value + "Mediator.ts", mediatorStr, { encoding: "utf-8" });
        //发送刷新消息
        Editor.Message.broadcast("refresh-asset", "db://assets/");
    }
}