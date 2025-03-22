
import { Event } from "../../../events/Event";
import { ChangedData } from "../ChangedData";
import { ArrayValue } from "../values/ArrayValue";
import { DictionaryValue } from "../values/DictionaryValue";
import { ISerDesValue } from "../values/ISerDesValue";
import { ISerDesProperty } from "./ISerDesProperty";



export class ArrayProperty extends ArrayValue implements ISerDesProperty {
    
    key: string;

    constructor(key?: string, value?: any) {
        super();
        this.key = key;
        if (value != null && value != undefined) {
            this.setValue(value);
        }
    }

    protected sendEvent(newValue: any, oldValue: any): void {
        if (this.hasEvent(Event.VALUE_CHANGED)) {
            this.emit(Event.VALUE_CHANGED, ChangedData.create(newValue, oldValue, this.key));
        }
    }

    /**
     * 判断某个子内容的某个属性相同则返回true
     */
    containProperty(value: ISerDesProperty): Boolean {
        let item: ISerDesValue;
        let findValue: ISerDesValue;
        for (let j: number = 0; j < this.length; j++) {
            item = this.elements[j];
            if (item instanceof DictionaryValue) {
                findValue = item.get(value.key);
                if (findValue.equality(value)) {
                    return true;
                }
            }
        }
        return false;
    }
}