"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUICode = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class GUICode {
    /**
     *
     * @param moduleName
     * @param component
     * @param uiName
     * @param commant 注释名称
     * @returns
     */
    static getMediator(moduleName, component, uiName, commant) {
        let result = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/MediatorTemplate.txt'), 'utf-8');
        result = result.replace(/TestModuleBinder/g, moduleName + "Binder");
        result = result.replace(/TestGUIViewCreator/g, uiName + "ViewCreator");
        result = result.replace(/UI_TestGUI/g, component);
        result = result.replace(/测试界面/g, commant);
        return result.replace(/TestGUIMediator/g, uiName + "Mediator");
    }
}
exports.GUICode = GUICode;
