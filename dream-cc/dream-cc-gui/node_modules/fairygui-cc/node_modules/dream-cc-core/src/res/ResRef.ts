import { IPoolable } from "../pools/IPoolable";




export class ResRef implements IPoolable {

    /**
     * 资源全局唯一KEY
     */
    key: string = "";
    /**
     * 谁引用的
     */
    refKey: string = "";
    /**
     * 资源内容
     */
    content: any;

    private __isDisposed: boolean = false;

    constructor() {

    }

    reset(): void {
        this.key = "";
        this.refKey = "";
        this.content = null;
        this.__isDisposed = false;
    }

    /**
     * 是否已经释放
     */
    get isDisposed(): boolean {
        return this.__isDisposed;
    }

    /**
     * 释放
     */
    dispose(): void {
        if (this.__isDisposed) {
            throw new Error("重复释放资源引用");
        }
        this.__isDisposed = true;
        // ResourceManager.removeRef(this);
    }

    /**
     * 彻底销毁(内部接口，请勿调用)
     */
    destroy(): boolean {
        this.reset();
        return true;
    }
}