import { IDeserialization } from "./deserializations/IDeserialization";
import { ISerialization } from "./serializations/ISerialization";
import { SerDesMode } from "./SerDesMode";
import { JSONDeserialization } from "./deserializations/JSONDeserialization";
import { JSONSerialization } from "./serializations/JSONSerialization";




/**
 * 序列化和反序列化
 */
export class SerDes {

    private static __serMap = new Map<SerDesMode, ISerialization>();
    private static __desMap = new Map<SerDesMode, IDeserialization>();

    private static __inited:boolean=false;
    private static init():void{
        if(this.__inited){
            return;
        }
        this.__inited=true;
        this.addSer(SerDesMode.JSON, new JSONSerialization());
        this.addDes(SerDesMode.JSON, new JSONDeserialization());
    }

    /**
     * 添加序列化器
     * @param type 
     * @param ser 
     */
    static addSer(type: SerDesMode, ser: ISerialization) {
        this.__serMap.set(type, ser);
    }

    /**
     * 添加反序列化器
     * @param type 
     * @param des 
     */
    static addDes(type: SerDesMode, des: IDeserialization) {
        this.__desMap.set(type, des);
    }

    static getSerialization(type: SerDesMode): ISerialization {
        this.init();
        if (!this.__serMap.has(type)) {
            console.error("没有找到序列化器");
            return new JSONSerialization();
        } else {
            return this.__serMap.get(type);
        }
    }

    static getDeserialization(type: SerDesMode): IDeserialization {
        this.init();
        if (!this.__desMap.has(type)) {
            console.error("没有找到反序列化器");
            return new JSONDeserialization();
        } else {
            return this.__desMap.get(type);
        }
    }
}