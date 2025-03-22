import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { App, createApp } from 'vue';
// @ts-ignore
import { GUICreator } from './GUICreator';

const panelDataMap = new WeakMap<any, App>();
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
    template: readFileSync(join(__dirname, '../../../static/template/index.html'), 'utf-8'),
    // style: readFileSync(join(__dirname, '../../../static/styles/excel.css'), 'utf-8'),
    $: {
        app: '#app',
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
            const uiCreator = new GUICreator();
            const app = createApp({});
            app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');
            app.component('MyCounter', {
                template: readFileSync(join(__dirname, '../../../static/template/vue/gui.html'), 'utf-8'),
                /**
                 * 启动
                 * @returns 
                 */
                setup() {

                    uiCreator.readLocalData();

                    return {
                        guiconfigFile: uiCreator.guiconfigFile,
                        guiConfigPathChanged: uiCreator.guiConfigFileChanged.bind(uiCreator),
                        guiEnumFile: uiCreator.guiEnumFile,
                        guiEnumFileChanged: uiCreator.guiEnumFileChanged.bind(uiCreator),
                        //层级枚举定义
                        layerEnumFile: uiCreator.layerEnumFile,
                        layerEnumFileChanged: uiCreator.layerEnumFileChanged.bind(uiCreator),
                        //模块
                        modulesPath: uiCreator.modulesPath,
                        modulesPathChanged: uiCreator.modulesPathChanged.bind(uiCreator),
                        modules: uiCreator.modules,
                        moduleName: uiCreator.moduleName,
                        moduleNameChanged: uiCreator.moduleNameChanged.bind(uiCreator),
                        moduleFilter: uiCreator.moduleFilter,
                        moduleFilterChanged: uiCreator.moduleFilterChanged.bind(uiCreator),
                        //层级
                        layers: uiCreator.layerEnumData.enums,
                        layerName: uiCreator.layerName,
                        layerChanged: uiCreator.layerChanged.bind(uiCreator),
                        permanence: uiCreator.permanence,
                        permanenceChanged: uiCreator.permanenceChanged.bind(uiCreator),
                        modal: uiCreator.modal,
                        modalChanged: uiCreator.modalChanged.bind(uiCreator),
                        modalClose: uiCreator.modalClose,
                        modalCloseChanged: uiCreator.modalCloseChanged.bind(uiCreator),
                        //UI名称
                        uiComments: uiCreator.uiComments,
                        uiCommentsChanged: uiCreator.uiCommentsChanged.bind(uiCreator),
                        uiName: uiCreator.uiName,
                        uiNameChanged: uiCreator.uiNameChanged.bind(uiCreator),
                        components: uiCreator.components,
                        componentName: uiCreator.componentName,
                        componentChanged: uiCreator.componentChanged.bind(uiCreator),
                        createButtonClick: uiCreator.createUI.bind(uiCreator),
                    }
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
