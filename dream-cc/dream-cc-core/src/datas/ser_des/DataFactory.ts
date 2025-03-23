import { ArrayProperty } from "./propertys/ArrayProperty";
import { DictionaryProperty } from "./propertys/DictionaryProperty";
import { ISerDesProperty } from "./propertys/ISerDesProperty";
import { NumberProperty } from "./propertys/NumberProperty";
import { StringProperty } from "./propertys/StringProperty";
import { ArrayValue } from "./values/ArrayValue";
import { DictionaryValue } from "./values/DictionaryValue";
import { ISerDesValue } from "./values/ISerDesValue";
import { NumberValue } from "./values/NumberValue";
import { StringValue } from "./values/StringValue";




export class DataFactory {
    /**
     * 根据数据创建值对象
     * @param data 
     */
    static createValue(data: any): ISerDesValue {
        if (data instanceof Array) {
            return new ArrayValue();
        } else {
            //字符串
            if (data instanceof String) {
                return new StringValue();
            } else {
                //非数字
                if (isNaN(data)) {
                    return new DictionaryValue();
                } else {
                    return new NumberValue();
                }
            }
        }
    }

    /**
     * 根据数据创建
     * @param type 
     * @param key 
     */
    static createProperty(data: any): ISerDesProperty {
        let result: ISerDesProperty;
        if (data instanceof Array) {
            result = new ArrayProperty();
        } else {
            //字符串
            if (typeof data === 'string') {
                result = new StringProperty();
            } else {
                let numValue: number = Number(data);
                //非数字
                if (isNaN(numValue)) {
                    result = new DictionaryProperty();
                } else {
                    result = new NumberProperty();
                }
            }
        }
        return result;
    }
}