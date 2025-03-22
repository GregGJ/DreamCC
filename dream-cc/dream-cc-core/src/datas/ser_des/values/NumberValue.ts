import { Logger } from "../../../loggers/Logger";
import { BaseValue } from "./BaseValue";



/**
 * 数值类型值
 */
export class NumberValue extends BaseValue {

    constructor() {
        super();
    }

    protected checkValue(value: any): boolean {
        if (isNaN(value)) {
            Logger.error("设置非数字类型:" + value, "datas");
            return false;
        }
        if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
            Logger.error("数值:" + value + " 超出number可允许范围!", "datas");
            return false;
        }
        return true;
    }
}