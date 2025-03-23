import { ISerialization } from "./ISerialization";
import { ISerDesProperty } from "../propertys/ISerDesProperty";
import { NumberProperty } from "../propertys/NumberProperty";
import { StringProperty } from "../propertys/StringProperty";
import { SerDesMode } from "../SerDesMode";
import { ArrayValue } from "../values/ArrayValue";
import { DictionaryValue } from "../values/DictionaryValue";
import { ISerDesValue } from "../values/ISerDesValue";
import { DictionaryProperty } from "../propertys/DictionaryProperty";




export class JSONSerialization implements ISerialization {

    /**
     * 编码
     * @param target 
     * @param data 
     * @returns 
     */
    encode(target: any, data: any): any {
        //数组
        if (target instanceof ArrayValue) {
            let result_value = [];
            let item_value: ISerDesValue;
            for (let i: number = 0; i < target.elements.length; i++) {
                item_value = target.elements[i];
                result_value.push(item_value.encode(SerDesMode.JSON, data));
            }
            return result_value;
        }
        if (target instanceof DictionaryValue) {
            let result_property: any = {};
            let item_property: ISerDesProperty;
            for (let index = 0; index < target.elements.length; index++) {
                item_property = target.elements[index] as ISerDesProperty;
                result_property[item_property.key] = item_property.encode(SerDesMode.JSON, data);
            }
            if (target instanceof DictionaryProperty) {
                result_property["key"] = target.key;
            }
            return result_property;
        }
        return target.value;
    }
}