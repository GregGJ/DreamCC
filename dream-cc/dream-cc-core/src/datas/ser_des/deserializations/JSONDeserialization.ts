import { DataFactory } from "../DataFactory";
import { DictionaryProperty } from "../propertys/DictionaryProperty";
import { ISerDesProperty } from "../propertys/ISerDesProperty";
import { SerDesMode } from "../SerDesMode";
import { ArrayValue } from "../values/ArrayValue";
import { BaseValue } from "../values/BaseValue";
import { DictionaryValue } from "../values/DictionaryValue";
import { ISerDesValue } from "../values/ISerDesValue";
import { IDeserialization } from "./IDeserialization";




export class JSONDeserialization implements IDeserialization {

    /**
     * 解码
     * @param target 
     * @param data 
     */
    decode(target: any, data: any): void {
        //数组
        if (target instanceof ArrayValue) {
            let value: ISerDesValue;
            for (let i: number = 0; i < data.length; i++) {
                let item_value = data[i];
                value = DataFactory.createProperty(item_value);
                value.decode(SerDesMode.JSON, item_value);
                target.push(value);
            }
            return;
        }
        if (target instanceof DictionaryValue) {
            let item_property: any;
            let property: ISerDesProperty;
            for (const key in data) {
                if (key == "key") {
                    if (target instanceof DictionaryProperty) {
                        target.key = data.key;
                    }
                    continue;
                }
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    item_property = data[key];
                    property = DataFactory.createProperty(item_property);
                    property.key = key;
                    property.decode(SerDesMode.JSON, item_property);
                    target.add(property);
                }
            }
            return;
        }
        if (target instanceof BaseValue) {
            target.setValue(data);
        }
    }
}