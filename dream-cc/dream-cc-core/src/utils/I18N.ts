import { BaseConfigAccessor } from "../configs/accessors/BaseConfigAccessor";
import { ConfigManager } from "../configs/ConfigManager";
import { StringUtils } from "./StringUtils";



export class I18N {
    /**
     * 多语言表名
     */
    static fileName: string = "language";
    /**
     * 当前语言
     */
    static langenge: string = "zh_CN";
    /**
     * 多语言项数据
     */
    static sheetItem: { key: string, value: string } = { key: "id", value: "value" };

    constructor() {

    }

    /**
     * 转换
     * @param value 
     * @param rest 
     * @returns 
     */
    static tr(value: string, ...rest: any[]): string {
        let langeValue: string;
        let acc = ConfigManager.getAccessor(this.sheetName) as L18Acc;
        if (!acc) {
            //如果不存在当前语言，则使用默认语言
            acc = ConfigManager.getAccessor(this.defaultSheetName) as L18Acc;
        }
        if (acc) {
            let sheetItem: any = acc.getOne(this.sheetItem.key, value);
            if (sheetItem == null || rest == undefined) {
                langeValue = value;
            } else {
                langeValue = sheetItem[this.sheetItem.value]
            }
        } else {
            langeValue = value;
        }
        if (rest == null || rest == undefined || rest.length == 0) {
            return langeValue;
        }
        return StringUtils.substitute(langeValue, rest);
    }

    /**
     * 多语言资源路径
     * @param url 
     */
    static tr_res(url: string): string {
        return this.langenge + "/" + url;
    }

    static get sheetName(): string {
        return this.fileName + "/" + this.langenge;
    }

    static get defaultSheetName(): string {
        return this.fileName + "/zh_CN";
    }
}


export class L18Acc extends BaseConfigAccessor {

    constructor() {
        super();
        this.addStorage([I18N.sheetItem.key]);
    }
}