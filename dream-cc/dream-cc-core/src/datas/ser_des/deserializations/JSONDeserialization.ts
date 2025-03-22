import { DataFactory } from "../DataFactory";
import { IDeserialization } from "./IDeserialization";
import { ISerDesProperty } from "../propertys/ISerDesProperty";
import { SerDesMode } from "../SerDesMode";
import { ArrayValue } from "../values/ArrayValue";
import { BaseValue } from "../values/BaseValue";
import { DictionaryValue } from "../values/DictionaryValue";
import { ISerDesValue } from "../values/ISerDesValue";




export class JSONDeserialization implements IDeserialization {

    /**
     * 解码
     * @param target 
     * @param data 
     */
    decode(target: any, data: any): void {
        //数组
        if (target instanceof ArrayValue) {
            let item: any;
            let value: ISerDesValue;
            for (let i: number = 0; i < data.length; i++) {
                item = data[i];
                value = DataFactory.createValue(item);
                value.decode(SerDesMode.JSON, item);
                target.push(value);
            }
        }
        if (target instanceof DictionaryValue) {
            let item: any;
            let property: ISerDesProperty;
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    item = data[key];
                    property = DataFactory.createProperty(key, item);
                    property.key = key;
                    property.decode(SerDesMode.JSON, item);
                    target.add(property);
                }
            }
        }
        if (target instanceof BaseValue) {
            target.setValue(data);
        }
    }
}