"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
// @ts-ignore
const package_json_1 = __importDefault(require("../../../package.json"));
const StringUtils_1 = require("../../utils/StringUtils");
const ExcelExport_1 = require("./ExcelExport");
const panelDataMap = new WeakMap();
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() {
        },
        hide() {
            console.log('hide');
        },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/styles/excel.css'), 'utf-8'),
    $: {
        app: '#app',
        exportButton: '#exportButton',
        exportProgressBar: "#exportProgressBar"
    },
    methods: {
        hello() {
            // if (this.$.text) {
            //     this.$.text.innerHTML = 'hello';
            //     console.log('[cocos-panel-html.default]: hello');
            // }
        },
    },
    ready() {
        // if (this.$.text) {
        //     this.$.text.innerHTML = 'Hello Cocos.';
        // }
        if (this.$.app) {
            const _this = this;
            const app = (0, vue_1.createApp)({});
            app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');
            app.component('MyCounter', {
                template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/vue/excel.html'), 'utf-8'),
                /**
                 * 启动
                 * @returns
                 */
                setup() {
                    /**配置表文件夹*/
                    let excelFolder = (0, vue_1.ref)("");
                    let excelFolderChanged = (value) => {
                        excelFolder.value = value;
                        saveSettings();
                    };
                    /**导出二进制存放文件夹*/
                    let dataFolder = (0, vue_1.ref)("");
                    let dataFolderChanged = (value) => {
                        dataFolder.value = value;
                        saveSettings();
                    };
                    /**导出配置表类型定义文件夹*/
                    let scriptFolder = (0, vue_1.ref)("");
                    let scriptFolderChanged = (value) => {
                        scriptFolder.value = value;
                        saveSettings();
                    };
                    /**表头所在行 */
                    let titleIndex = (0, vue_1.ref)(1);
                    let titleIndexChanged = (value) => {
                        titleIndex.value = value;
                        saveSettings();
                    };
                    /**参考类型所在行 */
                    let typeIndex = (0, vue_1.ref)(2);
                    let typeIndexChanged = (value) => {
                        typeIndex.value = value;
                        saveSettings();
                    };
                    /**注释所在行*/
                    let commentsIndex = (0, vue_1.ref)(3);
                    let commentsIndexChanged = (value) => {
                        commentsIndex.value = value;
                        saveSettings();
                    };
                    /**数据开始行 */
                    let dataIndex = (0, vue_1.ref)(4);
                    let dataIndexChanged = (value) => {
                        dataIndex.value = value;
                        saveSettings();
                    };
                    /**导出状态 */
                    let exporting = (0, vue_1.ref)(false);
                    //导出工具
                    let excelExport = new ExcelExport_1.ExcelExport();
                    let saveSettings = () => {
                        let result = {};
                        result.excelFolder = excelFolder.value;
                        result.dataFolder = dataFolder.value;
                        result.scriptFolder = scriptFolder.value;
                        result.titleIndex = titleIndex.value;
                        result.typeIndex = typeIndex.value;
                        result.commentsIndex = commentsIndex.value;
                        result.dataIndex = dataIndex.value;
                        let json = JSON.stringify(result, null, 5);
                        Editor.Profile.setConfig(package_json_1.default.name + ".excel", "data", json, "local").then(() => {
                            console.log("本地数据保存成功");
                            // console.log("本地数据保存成功：" + json);
                        }, reason => {
                            console.log("本地数据保存失败");
                            // console.log("本地数据保存失败：" + json);
                        });
                    };
                    //读取记录
                    Editor.Profile.getConfig(package_json_1.default.name + ".excel", "data", "local").then(value => {
                        // console.log("读取配置成功");
                        let localData = JSON.parse(value);
                        if (localData === null) {
                            dataFolder.value = Editor.Project.path + "/assets/res/configs/";
                            scriptFolder.value = Editor.Project.path + "/assets/src/games/consts";
                            titleIndex.value = 1;
                            typeIndex.value = 2;
                            commentsIndex.value = 3;
                            dataIndex.value = 4;
                        }
                        else {
                            excelFolder.value = localData.excelFolder;
                            dataFolder.value = localData.dataFolder;
                            scriptFolder.value = localData.scriptFolder;
                            titleIndex.value = localData.titleIndex;
                            typeIndex.value = localData.typeIndex;
                            commentsIndex.value = localData.commentsIndex;
                            dataIndex.value = localData.dataIndex;
                        }
                    }, reasion => {
                        console.log("读取本地数据失败");
                    });
                    //导出按钮点击
                    let exportButtonClick = () => {
                        if (exporting.value) {
                            return;
                        }
                        if (StringUtils_1.StringUtils.isEmpty(excelFolder.value)) {
                            console.error("Excel Folder is null");
                            return;
                        }
                        if (StringUtils_1.StringUtils.isEmpty(scriptFolder.value)) {
                            console.error("Excel Folder is null");
                            return;
                        }
                        if (StringUtils_1.StringUtils.isEmpty(dataFolder.value)) {
                            console.error("Excel Folder is null");
                            return;
                        }
                        exporting.value = true;
                        //导出
                        excelExport.export(excelFolder.value, dataFolder.value, scriptFolder.value, titleIndex.value, typeIndex.value, commentsIndex.value, dataIndex.value, (progress) => {
                            // console.log(Math.floor(progress * 100) + "%");
                        }, () => {
                            console.log("导出完成!");
                            exporting.value = false;
                            //发送刷新消息
                            Editor.Message.broadcast("refresh-asset", "db://assets/");
                        });
                    };
                    return {
                        excelFolder,
                        excelFolderChanged,
                        dataFolder,
                        dataFolderChanged,
                        scriptFolder,
                        scriptFolderChanged,
                        titleIndex,
                        titleIndexChanged,
                        typeIndex,
                        typeIndexChanged,
                        commentsIndex,
                        commentsIndexChanged,
                        dataIndex,
                        dataIndexChanged,
                        exportButtonClick,
                    };
                },
            });
            app.mount(this.$.app);
            panelDataMap.set(this, app);
        }
    },
    beforeClose() { },
    close() {
        const app = panelDataMap.get(this);
        if (app) {
            app.unmount();
        }
    },
});
