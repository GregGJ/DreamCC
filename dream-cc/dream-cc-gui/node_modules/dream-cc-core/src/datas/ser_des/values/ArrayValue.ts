import { Event } from "../../../events/Event";
import { ChangedData } from "../ChangedData";
import { BaseValue } from "./BaseValue";
import { ISerDesValue } from "./ISerDesValue";



/**
 * 数组型数值
 */
export class ArrayValue extends BaseValue {

    constructor() {
        super();
        this.value = [];
    }

    protected checkValue(value: any): boolean {
        if (value != null && Array.isArray(value)) {
            return true;
        }
        return false;
    }

    /**
     * 添加到指定位置
     * @param index 
     * @param value 
     */
    addAt(index: number, value: ISerDesValue): void {
        if (index < this.elements.length - 1) {
            this.elements.splice(index, 0, value);
            if (this.hasEvent(Event.ADD_CHILD)) {
                this.emit(Event.ADD_CHILD, ChangedData.create(index));
            }
            value.on(Event.VALUE_CHANGED, this.childValueChanged, this);
            value.on(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
        } else {
            throw new Error("索引" + index + " 超出可添加范围:" + (this.elements.length - 1));
        }
    }

    /**
     * 删除
     * @param value 
     */
    remove(value: ISerDesValue): void {
        let index = this.elements.indexOf(value);
        this.removeAt(index);
    }

    /**
     * 通过索引删除并返回元素
     * @param index 
     */
    removeAt(index: number): ISerDesValue {
        if (index < 0 || index > this.elements.length - 1) {
            throw new Error("要删除的索引超出数组边界！");
        }
        let result: ISerDesValue = this.elements[index];
        this.elements.splice(index, 1);
        if (this.hasEvent(Event.REMOVE_CHILD)) {
            this.emit(Event.REMOVE_CHILD, ChangedData.create(index));
        }
        result.off(Event.VALUE_CHANGED, this.childValueChanged, this);
        result.off(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
        return result;
    }


    /**
     * 添加到末尾
     * @param value 
     */
    push(value: ISerDesValue): void {
        let index: number = this.elements.indexOf(value);
        if (index >= 0) {
            throw new Error("重复添加！");
        }
        index = this.elements.length;
        this.elements.push(value);
        if (this.hasEvent(Event.ADD_CHILD)) {
            this.emit(Event.ADD_CHILD, ChangedData.create(index));
        }
        value.on(Event.VALUE_CHANGED, this.childValueChanged, this);
        value.on(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
    }

    /**
     * 添加到头部
     * @param value 
     */
    unshift(value: ISerDesValue): void {
        let index: number = this.elements.indexOf(value);
        if (index >= 0) {
            throw new Error("重复添加！");
        }
        this.elements.unshift(value);
        if (this.hasEvent(Event.ADD_CHILD)) {
            this.emit(Event.ADD_CHILD, ChangedData.create(0));
        }
        value.on(Event.VALUE_CHANGED, this.childValueChanged, this);
        value.on(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
    }

    /**
     * 删除并返回第一个元素
     */
    shift(): ISerDesValue {
        if (this.elements.length == 0) {
            throw new Error("数组为空！");
        }
        let result: ISerDesValue = this.elements.shift();
        if (this.hasEvent(Event.REMOVE_CHILD)) {
            this.emit(Event.REMOVE_CHILD, ChangedData.create(0));
        }
        result.off(Event.VALUE_CHANGED, this.childValueChanged, this);
        result.off(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
        return result;
    }

    /**
    * 删除并返回最后一个元素
    */
    pop(): ISerDesValue {
        if (this.elements.length == 0) {
            throw new Error("数组为空！");
        }
        let index: number = this.elements.length - 1;
        let result: ISerDesValue = this.elements.pop();
        if (this.hasEvent(Event.REMOVE_CHILD)) {
            this.emit(Event.REMOVE_CHILD, ChangedData.create(index));
        }
        result.off(Event.VALUE_CHANGED, this.childValueChanged, this);
        result.off(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
        return result;
    }

    /**
     * 通过索引获取元素
     * @param index 
     */
    getAt(index: number): ISerDesValue {
        return this.elements[index];
    }

    /**
     * 获取索引值
     * @param value 
     */
    getChildIndex(value: ISerDesValue): number {
        return this.elements.indexOf(value);
    }

    /**
     * 检测时候包含该内容
     * @param value 
     */
    contains(value: ISerDesValue): boolean {
        for (let index = 0; index < this.elements.length; index++) {
            const element = this.elements[index];
            if (element.equality(value)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 对比
     * @param value 
     */
    equality(value: ISerDesValue): boolean {
        if (value instanceof ArrayValue) {
            if (this.elements == value.elements) {
                return true;
            }
            if (this.elements.length != value.elements.length) {
                return false;
            }
            let a: ISerDesValue, b: ISerDesValue;
            for (let index = 0; index < this.length; index++) {
                a = this.elements[index];
                b = value.elements[index];
                if (a.equality(b) == false) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }


    private childValueChanged(e: Event): void {
        if (this.hasEvent(Event.CHILD_VALUE_CHANGED)) {
            this.emit(Event.CHILD_VALUE_CHANGED, e.data);
        }
    }

    /**
     * 清除
     */
    clear(): void {
        this.elements.length = 0;
    }

    /**
     * 列表长度
     */
    get length(): number {
        return this.elements.length;
    }

    /**
     * 内容
     */
    get elements(): Array<ISerDesValue> {
        return this.value;
    }
}