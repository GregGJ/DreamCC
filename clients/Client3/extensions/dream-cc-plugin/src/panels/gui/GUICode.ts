import { readFileSync } from 'fs';
import { join } from 'path';
import { Ref } from 'vue';

export class GUICode {


    /**
     * 
     * @param moduleName 
     * @param component 
     * @param uiName 
     * @param commant 注释名称
     * @returns 
     */
    public static getMediator(moduleName: string, component: string, uiName: string, commant: string): string {
        let result = readFileSync(join(__dirname, '../../../static/template/MediatorTemplate.txt'), 'utf-8')
        result = result.replace(/TestModuleBinder/g, moduleName + "Binder");
        result = result.replace(/TestGUIViewCreator/g, uiName + "ViewCreator");
        result = result.replace(/UI_TestGUI/g, component);
        result = result.replace(/测试界面/g, commant);
        return result.replace(/TestGUIMediator/g, uiName + "Mediator");
    }
}