
import { Dictionary } from "../../Dictionary";
import { Event } from "../../../events/Event";
import { ChangedData } from "../ChangedData";
import { ISerDesProperty } from "../propertys/ISerDesProperty";
import { BaseValue } from "./BaseValue";
import { ISerDesValue } from "./ISerDesValue";


/**
 * 对象类型数据
 */
export class DictionaryValue extends BaseValue {

    constructor() {
        super();
        this.value = new Dictionary<string, ISerDesProperty>();
    }

    /**
     * 添加属性
     * @param value 
     */
    add(value: ISerDesProperty): ISerDesValue {
        if (this.map.has(value.key)) {
            throw new Error("重复添加相同KEY的属性！");
        }
        this.map.set(value.key, value);
        if (this.hasEvent(Event.ADD_CHILD)) {
            this.emit(Event.ADD_CHILD, ChangedData.create(value, null, value.key));
        }
        value.on(Event.VALUE_CHANGED, this.childValueChanged, this);
        value.on(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
        return value;
    }

    /**
     * 删除属性
     * @param value 
     */
    remove(value: ISerDesProperty): void {
        this.removeByKey(value.key);
    }

    /**
     * 通过属性key删除并返回
     * @param key 
     */
    removeByKey(key: string): ISerDesValue {
        if (!this.map.has(key)) {
            throw new Error("要删除的属性不在集合内!");
        }
        let result: ISerDesValue = this.map.get(key);
        this.map.delete(key);
        if (this.hasEvent(Event.REMOVE_CHILD)) {
            this.emit(Event.REMOVE_CHILD, ChangedData.create(null, result, key));
        }
        result.off(Event.VALUE_CHANGED, this.childValueChanged, this);
        result.off(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
        return result;
    }

    /**
     * 查询是否存在
     * @param key 
     * @returns 
     */
    has(key: string): boolean {
        return this.map.has(key);
    }

    /**
     * 更新属性
     * @param key 
     * @param data 
     */
    update(key: string, data: any): void {
        if (this.map.has(key) == false) {
            throw new Error("要更新的属性不存在！" + key);
        }
        let value: ISerDesValue = this.map.get(key);
        value.setValue(data);
    }

    /**
     * 更新多项属性
     * @param keys 
     * @param values 
     */
    multUpdate(keys: Array<string>, values: Array<any>): void {
        if (keys == null || values == null) {
            throw new Error("Keys和values不能为空！");
        }
        if (keys.length != values.length) {
            throw new Error("keys.length!=values.length");
        }
        let key: string;
        let value: any;
        for (let i: number = 0; i < keys.length; i++) {
            key = keys[i];
            value = values[i];
            this.update(key, value);
        }
    }

    /**
     * 获取属性
     * @param key 
     */
    get(key: string): ISerDesValue {
        return this.map.get(key);
    }

    /**
     * 对比
     * @param value 
     */
    equality(value: ISerDesValue): boolean {
        if (value instanceof DictionaryValue) {
            if (this.elements.length != value.elements.length) {
                return false;
            }
            let a: ISerDesValue;
            let b: ISerDesValue;
            for (let i: number = 0; i < this.elements.length; i++) {
                a = this.elements[i];
                b = value.elements[i];
                if (a.equality(b) != false) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * 清除
     */
    clear(): void {
        this.map.clear();
    }

    private childValueChanged(e: Event): void {
        if (this.hasEvent(Event.CHILD_VALUE_CHANGED)) {
            this.emit(Event.CHILD_VALUE_CHANGED, e.data);
        }
    }

    get elements(): Array<ISerDesValue> {
        return this.map.elements;
    }

    private get map(): Dictionary<string, ISerDesValue> {
        return this.value;
    }
}