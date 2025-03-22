import { BaseValue } from "./BaseValue";



/**
 * 字符串类型值
 */
export class StringValue extends BaseValue {

    constructor() {
        super();
    }

    protected checkValue(value: any): boolean {
        if (value == undefined || value == null) {
            return false;
        }
        return true;
    }
}