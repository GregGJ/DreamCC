
import { Event } from "../../../events/Event";
import { ChangedData } from "../ChangedData";
import { StringValue } from "../values/StringValue";
import { ISerDesProperty } from "./ISerDesProperty";



export class StringProperty extends StringValue implements ISerDesProperty {

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