


import { IEventDispatcher } from "../../../events/IEventDispatcher";
import { SerDesMode } from "../SerDesMode";


/**
 * 值接口
 */
export interface ISerDesValue extends IEventDispatcher {

    /**
     * 值对象（用于绑定）
     */
    value:any;

    /**
     * 获取值
     */
    getValue(): any;

    /**
     * 设置值
     * @param value 
     */
    setValue(value: any): void;

    /**
     * 对比函数
     * @param value 
     */
    equality(value: ISerDesValue): boolean;

    /**
     * 编码
     * @param mode 
     * @param data 
     */
    encode(mode:SerDesMode,data:any):any;
    /**
     * 解码
     * @param mode 
     * @param data 
     */
    decode(mode:SerDesMode,data:any):void;
}