import { Handler } from "../utils/Handler";
import { FunctionHook } from "./FunctionHook";
import { PropertyBinder } from "./PropertyBinder";


/**
 * 绑定工具类
 */
export class Binder {

    /**属性绑定记录 */
    private __bindRecords: Array<PropertyBindInfo>;
    /**方法绑定记录 */
    private __hookRecords: Array<FunctionHookInfo>;
    /**需要注册和删除的事件*/
    private __eventRecords: Array<{ target: any, eventType: number | string, handler: Function, caller: any }>;

    /**初始化标记 */
    inited: boolean;

    constructor() {
        this.__bindRecords = [];
        this.__hookRecords = [];
        this.__eventRecords = [];
        this.inited = false;
    }


    init(): void {
        this.inited = true;
    }

    /**
     * 数据绑定
     * @param source 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyKeyOrCaller 
     */
    private __bind(source: any, property: string | Array<string>, targetOrCallBack: any | Function, tPropertyKeyOrCaller: string | any): void {
        for (let index = 0; index < this.__bindRecords.length; index++) {
            const element = this.__bindRecords[index];
            if (element.source == source &&
                element.property == property &&
                element.targetOrCallback == targetOrCallBack &&
                element.targetPropertyOrCaller == tPropertyKeyOrCaller) {
                //重复绑定
                throw new Error("重复绑定：" + source + property + targetOrCallBack + tPropertyKeyOrCaller);
            }
        }
        this.__bindRecords.push({
            source: source,
            property: property,
            targetOrCallback: targetOrCallBack,
            targetPropertyOrCaller: tPropertyKeyOrCaller
        });
        BinderUtils.bind(this, source, property, targetOrCallBack, tPropertyKeyOrCaller);
    }

    /**
     * 取消绑定
     * @param source 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyKeyOrCaller
     */
    private __unbind(source: any, property?: string | Array<string>, targetOrCallBack?: any | Function, tPropertyKeyOrCaller?: string | any): void {
        for (let index = 0; index < this.__bindRecords.length; index++) {
            const element = this.__bindRecords[index];
            if (element.source == source &&
                element.property == property &&
                element.targetOrCallback == targetOrCallBack &&
                element.targetPropertyOrCaller == tPropertyKeyOrCaller) {
                this.__bindRecords.splice(index, 1);
            }
        }
        BinderUtils.unbind(this, source, property, targetOrCallBack, tPropertyKeyOrCaller);
    }

    /**
     * 添加函数钩子
     * @param source 
     * @param functionName 
     * @param preHandles 
     * @param laterHandlers
     */
    private __addHook(source: any, functionName: string, preHandle: Handler, laterHandler?: Handler): void {
        for (let index = 0; index < this.__hookRecords.length; index++) {
            const element = this.__hookRecords[index];
            if (element.source == source &&
                element.functionName == functionName &&
                preHandle.equal(element.preHandler) &&
                laterHandler.equal(element.laterHandler)) {
                //重复绑定
                throw new Error("重复绑定：" + source + " " + functionName);
            }
        }
        //记录
        this.__hookRecords.push({ source: source, functionName: functionName, preHandler: preHandle, laterHandler: laterHandler });
        BinderUtils.addHook(this, source, functionName, preHandle, laterHandler);
    }

    /**
     * 删除函数钩子
     * @param source
     * @param functionName
     * @param preHandle
     * @param laterHandler
     */
    private __removeHook(source: any, functionName?: string, preHandle?: Handler, laterHandler?: Handler): void {
        for (let index = 0; index < this.__hookRecords.length; index++) {
            const element = this.__hookRecords[index];
            if (element.source == source &&
                element.functionName == functionName &&
                preHandle.equal(element.preHandler) &&
                laterHandler.equal(element.laterHandler)) {
                this.__hookRecords.splice(index, 1);
            }
        }
        BinderUtils.removeHook(this, source, functionName, preHandle, laterHandler);
    }

    /**
     * 属性和属性的绑定
     * @param source            数据源
     * @param property          数据源属性名
     * @param target            目标对象
     * @param targetProperty    目标对象属性名
     */
    bindAA(source: any, property: string, target: any, targetProperty: string): void {
        this.__bind(source, property, target, targetProperty);
    }

    /**
     * 取消属性和属性的绑定
     * @param source 
     * @param property 
     * @param target 
     * @param targetProperty 
     */
    unbindAA(source: any, property: string, target: any, targetProperty: string): void {
        this.__unbind(source, property, target, targetProperty);
    }

    /**
     * 属性和函数的绑定
     * @param source 
     * @param property 
     * @param callBack 
     * @param caller 
     */
    bindAM(source: any, property: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void {
        this.__bind(source, property, callBack, caller);
    }

    /**
     * 取消属性和函数的绑定
     * @param source 
     * @param propertys 
     * @param callBack 
     * @param caller 
     */
    unbidAM(source: any, propertys: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void {
        this.__unbind(source, propertys, callBack, caller);
    }


    /**
     * 函数和函数的绑定
     * @param source        
     * @param functionName  目标函数
     * @param preHandle     该函数将在目标函数调用前调用
     * @param laterHandler  该函数将在目标函数调用后调用
     */
    bindMM(source: any, functionName: string, preHandle: Handler, laterHandler?: Handler): void {
        this.__addHook(source, functionName, preHandle, laterHandler);
    }

    /**
     * 取消方法和方法的绑定关系
     * @param source 
     * @param functionName 
     * @param preHandle 
     * @param laterHandler 
     */
    unbindMM(source: any, functionName: string, preHandle: Handler, laterHandler: Handler): void {
        this.__removeHook(source, functionName, preHandle, laterHandler);
    }

    /**
     * 绑定事件
     * @param target 
     * @param type 
     * @param handler 
     * @param caller 
     */
    bindEvent(target: any, type: number | string, handler: Function, caller: any): void {
        for (let index = 0; index < this.__eventRecords.length; index++) {
            const element = this.__eventRecords[index];
            if (element.target == target && element.eventType == type && element.handler == handler && element.caller == caller) {
                throw new Error("重复绑定UI事件：" + target + type + handler + caller);
            }
        }
        if (this.inited) {
            let on = target["on"];
            if (on && typeof on == "function") {
                target.on(type, handler, caller);
            }
            this.__eventRecords.push({ target: target, eventType: type, handler: handler, caller: caller });
        } else {
            this.__eventRecords.push({ target: target, eventType: type, handler: handler, caller: caller });
        }
    }

    /**
     * 取消事件绑定
     * @param target 
     * @param type 
     * @param handler 
     * @param caller 
     */
    unbindEvent(target: any, type: number | string, handler: Function, caller: any): void {
        let off = target["off"];
        if (off && typeof off == "function") {
            target.off(type, handler, caller);
        }
        for (let index = 0; index < this.__eventRecords.length; index++) {
            const element = this.__eventRecords[index];
            if (element.target == target && element.eventType == type && element.handler == handler && element.caller == caller) {
                this.__eventRecords.splice(index, 1);
            }
        }
    }

    //根据记录添加绑定
    bindByRecords(): void {
        //bind
        for (let index = 0; index < this.__bindRecords.length; index++) {
            const element = this.__bindRecords[index];
            BinderUtils.bind(this, element.source, element.property, element.targetOrCallback, element.targetPropertyOrCaller);
        }
        //addHook
        for (let index = 0; index < this.__hookRecords.length; index++) {
            const element = this.__hookRecords[index];
            BinderUtils.addHook(this, element.source, element.functionName, element.preHandler, element.laterHandler);
        }
        //events
        for (let index = 0; index < this.__eventRecords.length; index++) {
            const eventInfo = this.__eventRecords[index];
            let hasEventHandler = eventInfo.target["hasEventHandler"];
            if (hasEventHandler && typeof hasEventHandler == "function") {
                //如果已经添加
                if (eventInfo.target.hasEventHandler(eventInfo.eventType, eventInfo.handler, eventInfo.caller)) {
                    continue;
                }
            }
            let on = eventInfo.target["on"];
            if (on && typeof on == "function") {
                eventInfo.target.on(eventInfo.eventType, eventInfo.handler, eventInfo.caller);
            }
        }
    }

    //根据记录删除绑定
    unbindByRecords(): void {
        //unbind
        for (let index = 0; index < this.__bindRecords.length; index++) {
            const element = this.__bindRecords[index];
            BinderUtils.unbind(this, element.source, element.property, element.targetOrCallback, element.targetPropertyOrCaller);
        }
        //removeHook
        for (let index = 0; index < this.__hookRecords.length; index++) {
            const element = this.__hookRecords[index];
            BinderUtils.removeHook(this, element.source, element.functionName, element.preHandler, element.laterHandler);
        }
        //events
        for (let index = 0; index < this.__eventRecords.length; index++) {
            const eventInfo = this.__eventRecords[index];
            eventInfo.target.off(eventInfo.eventType, eventInfo.handler, eventInfo.caller);
        }
    }

    /**
     * 销毁
     */
    destroy(): void {
        this.unbindByRecords();
        this.__bindRecords = null;
        this.__hookRecords = null;
        this.__eventRecords = null;
    }
}

/**
 * 属性与属性数据
 */
interface PropertyBindInfo {
    /**
     * 数据源对象
     */
    source: any;
    /**
     * 数据源属性名
     */
    property: string | Array<string>;
    /**
     * 目标对象
     */
    targetOrCallback: any | Function;
    /**
     * 目标属性名
     */
    targetPropertyOrCaller: string | any;
}

/**
 * 方法与方法绑定信息
 */
interface FunctionHookInfo {
    source: any;
    functionName: string;
    preHandler: Handler;
    laterHandler: Handler;
}

/**
 * 绑定器工具类
 */
class BinderUtils {

    constructor() {

    }

    /**
     * 绑定
     * @param group 
     * @param source 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyOrCaller 
     */
    static bind(group: any, source: any, property: string | Array<string>, targetOrCallBack: any | Function, tPropertyOrCaller: string | any): void {
        let binder: PropertyBinder = source["$PropertyBinder"];
        if (!binder) {
            binder = new PropertyBinder(source);
            source["$PropertyBinder"] = binder;
        }
        binder.bind(group, property, targetOrCallBack, tPropertyOrCaller);
    }

    /**
     * 取消绑定
     * @param group 
     * @param source 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyOrCaller 
     * @returns 
     */
    static unbind(group: any, source: any, property?: string | Array<string>, targetOrCallBack?: any | Function, tPropertyOrCaller?: string | any): void {
        let binder: PropertyBinder = source["$PropertyBinder"];
        if (!binder) {
            return;
        }
        binder.unbind(group, property, targetOrCallBack, tPropertyOrCaller);
    }


    /**
     * 添加函数钩子
     * @param group 
     * @param source 
     * @param functionName 
     * @param preHandler 
     * @param laterHandler 
     */
    static addHook(group: any, source: any, functionName: string, preHandler: Handler, laterHandler: Handler): void {
        let hook: FunctionHook = source["$FunctionHook"];
        if (!hook) {
            hook = new FunctionHook(source);
            source["$FunctionHook"] = hook;
        }
        hook.addHook(group, functionName, preHandler, laterHandler);
    }

    /**
     * 删除函数钩子
     * @param group 
     * @param source 
     * @param functionName 
     * @param preHandler 
     * @param laterHandler 
     * @returns 
     */
    static removeHook(group: any, source: any, functionName?: string, preHandler?: Handler, laterHandler?: Handler): void {
        let hook: FunctionHook = source["$FunctionHook"];
        if (!hook) {
            return;
        }
        hook.removeHook(group, functionName, preHandler, laterHandler);
    }
}