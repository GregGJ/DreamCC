import { ISerDesValue } from "../values/ISerDesValue";


/**
 * 属性接口
 */
export interface ISerDesProperty extends ISerDesValue {
    /**
     * 属性KEY
     */
    key: string;
}