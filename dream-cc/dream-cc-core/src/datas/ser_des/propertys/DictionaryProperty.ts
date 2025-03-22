
import { Event } from "../../../events/Event";
import { ChangedData } from "../ChangedData";
import { DictionaryValue } from "../values/DictionaryValue";
import { ISerDesProperty } from "./ISerDesProperty";


export class DictionaryProperty extends DictionaryValue implements ISerDesProperty {
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
}