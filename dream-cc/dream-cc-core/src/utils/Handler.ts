import { IPoolable } from "../pools/IPoolable";

/**
 * 处理器
 */
export class Handler implements IPoolable {

    method?: Function;
    caller: any;

    constructor() {

    }

    reset(): void {
        this.method = null;
        this.caller = null;
    }
    
    destroy(): boolean {
        this.reset();
        return true;
    }

    /**
     * 运行
     * @param args 
     */
    run(...args: any[]): any {
        let result: any = null;
        if (this.method) {
            result = this.method.apply(this.caller, args);
        } else {
            throw new Error("Handler method is null!");
        }
        return result;
    }

    /**
     * 判断是否相同
     * @param value 
     * @returns 
     */
    equal(value: Handler): boolean {
        if (this.method == value.method && this.caller == value.caller) {
            return true;
        }
        return false;
    }

    /**
     * 判断是否相同
     * @param method 
     * @param caller 
     * @returns 
     */
    equals(method: Function, caller?: any): boolean {
        if (this.method == method && this.caller == caller) {
            return true;
        }
        return false;
    }
}