import { Dictionary } from "../../datas/Dictionary";
import { TickerManager } from "../../ticker/TickerManager";
import { Timer } from "../../timer/Timer";
import { ResRef } from "../ResRef";
import { IResource } from "./IResource";
import { ResourceManager } from "./ResourceManager";


/**
 * 资源管理器默认实现
 */
export class ResourceManagerImpl {
    /**
     * 资源
     */
    protected __resDic: Dictionary<string, IResource> = new Dictionary<string, IResource>();
    /**
     * 等待销毁的资源
     */
    protected _waitDestroy: Array<IResource> = [];

    private __lastTime: number = 0;

    constructor() {
        TickerManager.addTicker(this);
    }

    tick(dt: number): void {
        if (!ResourceManager.AUTO_GC) {
            return;
        }
        let currentTime = Timer.currentTime;
        let d = currentTime - this.__lastTime
        if (d < ResourceManager.GC_CHECK_TIME) {
            return;
        }
        this.__lastTime = currentTime;
        this.gc();
    }
    
    addRes(value: IResource): void {
        if (this.__resDic.has(value.key)) {
            throw new Error("重复添加资源！");
        }
        this.__resDic.set(value.key, value);
        //标记为待删除
        this._waitDestroy.push(value);
        value.lastOpTime = Timer.currentTime;
    }

    hasRes(key: string): boolean {
        return this.__resDic.has(key);
    }

    getRes(key: string): IResource | undefined {
        return this.__resDic.get(key);
    }

    addRef(key: string, refKey?: string): ResRef {
        if (!this.__resDic.has(key)) {
            throw new Error("未找到资源：" + key);
        }
        let res: IResource = this.__resDic.get(key)!;
        //如果在待删除列表中
        let index: number = this._waitDestroy.indexOf(res);
        if (index >= 0) {
            this._waitDestroy.splice(index, 1);
        }
        //更新操作时间
        res.lastOpTime = Timer.currentTime;
        return res.addRef(refKey);
    }

    removeRef(value: ResRef): void {
        if (!this.__resDic.has(value.key)) {
            throw new Error("未找到资源：" + value.key);
        }
        let res: IResource = this.__resDic.get(value.key)!;
        res.removeRef(value);
        if (res.refLength == 0) {
            //放入待删除列表
            this._waitDestroy.push(res);
        }
        res.lastOpTime = Timer.currentTime;
    }

    gc(ignoreTime?: boolean): void {
        let res: IResource;
        let currentTime: number = Timer.currentTime;
        for (let index = 0; index < this._waitDestroy.length; index++) {
            res = this._waitDestroy[index];
            if (res.refCount > 0) {
                continue;
            }
            //如果忽略时间机制
            if (ignoreTime == true) {
                this._waitDestroy.splice(index, 1);
                this.destroyRes(res);
                index--;
            } else if (currentTime - res.lastOpTime > ResourceManager.GC_TIME) {//超过允许的时间就回收
                this._waitDestroy.splice(index, 1);
                this.destroyRes(res);
                index--;
            }
        }
    }

    /**
     * 销毁
     * @param value 
     */
    protected destroyRes(value: IResource): void {
        this.__resDic.delete(value.key);
        value.destroy();
    }

    get resList(): Array<IResource> {
        return this.__resDic.elements;
    }
}