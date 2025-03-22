import { Event } from "../../../events/Event";
import { EventDispatcher } from "../../../events/EventDispatcher";
import { ChangedData } from "../ChangedData";
import { SerDes } from "../SerDes";
import { ISerDesValue } from "./ISerDesValue";


/**
 * 值抽象类
 */
export class BaseValue extends EventDispatcher implements ISerDesValue {

    value: any;

    constructor() {
        super();
    }

    getValue(): any {
        return this.value;
    }

    setValue(value: any): void {
        if (this.checkValue(value)) {
            let oldValue: any = this.value;
            this.value = value;
            this.sendEvent(this.value, oldValue);
        }
    }

    protected sendEvent(newValue: any, oldValue: any): void {
        if (this.hasEvent(Event.VALUE_CHANGED)) {
            this.emit(Event.VALUE_CHANGED, ChangedData.create(newValue, oldValue));
        }
    }

    /**
     * 检测值是否合法
     * @param value 
     */
    protected checkValue(value: any): boolean {
        return false;
    }

    /**
     * 反序列化
     * @param type 
     * @param data 
     */
    decode(type: number, data: any): void {
        let decoder = SerDes.getDeserialization(type);
        decoder.decode(this, data);
    }

    /**
     * 序列化
     * @param type 
     * @param data 
     * @returns 
     */
    encode(type: number, data?: any): any {
        let encoder = SerDes.getSerialization(type);
        return encoder.encode(this, data);
    }

    equality(value: ISerDesValue): boolean {
        if (this.value == value.getValue()) {
            return true;
        }
        return false;
    }
}