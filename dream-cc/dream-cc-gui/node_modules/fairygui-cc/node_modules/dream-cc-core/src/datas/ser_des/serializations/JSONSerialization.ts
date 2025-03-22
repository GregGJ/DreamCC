import { ISerialization } from "./ISerialization";
import { ISerDesProperty } from "../propertys/ISerDesProperty";
import { NumberProperty } from "../propertys/NumberProperty";
import { StringProperty } from "../propertys/StringProperty";
import { SerDesMode } from "../SerDesMode";
import { ArrayValue } from "../values/ArrayValue";
import { DictionaryValue } from "../values/DictionaryValue";
import { ISerDesValue } from "../values/ISerDesValue";




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
            let result = [];
            let item: ISerDesValue;
            for (let i: number = 0; i < target.elements.length; i++) {
                item = target.elements[i];
                result.push(item.encode(SerDesMode.JSON, data));
            }
            return result;
        }
        if (target instanceof DictionaryValue) {
            let result: any = {};
            let item: ISerDesProperty;
            for (let index = 0; index < target.elements.length; index++) {
                item = target.elements[index] as ISerDesProperty;
                result[item.key] = item.encode(SerDesMode.JSON, data);
            }
            return result;
        }
        return target.value;
    }
}