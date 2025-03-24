import { IDestroyable } from "../interfaces/IDestroyable";
import { IPoolable } from "./IPoolable";


/**
 * 对象池实现
 */
export class PoolImpl<T extends IPoolable> implements IDestroyable {

    /**对象类型 */
    private __class: new () => T;
    /**正在使用的对象列表 */
    private __using: Set<T>;
    /**空闲对象列表 */
    private __free: Set<T>;
    /**最大对象数 */
    private __max: number = 0;

    constructor(classType: new () => T, max: number = 1000, min: number = 0) {
        this.__class = classType;
        this.__max = max;
        this.__using = new Set<T>();
        this.__free = new Set<T>();
        // 初始化对象池到最小容量
        for (let i = 0; i < min; i++) {
            this.__free.add(new this.__class());
        }
    }


    /**
     * 销毁对象池中的所有对象并释放资源
     *
     * @returns 返回一个布尔值，表示销毁操作是否成功
     */
    destroy(): boolean {
        // 释放所有对象到对象池中
        this.releaseAll();
        for (const element of this.__free) {
            element.destroy();
        }
        this.__free.clear();
        this.__using.clear();
        return true;
    }


    /**
     * 从对象池中获取一个对象。
     *
     * @returns 返回获取到的对象。
     * @throws 当对象池已满时，抛出错误。
     */
    acquire(): T {
        let item: T;
        if (this.__free.size > 0) {
            // 从 __free 中取出一个对象
            const iterator = this.__free.values();
            item = iterator.next().value!;
            this.__free.delete(item);
        } else {
            if (this.size >= this.__max) {
                throw new Error("对象池已满");
            }
            item = new this.__class();
        }
        this.__using.add(item);
        return item;
    }


    /**
     * 释放对象
     *
     * @param item 要释放的对象
     */
    release(item: T): void {
        item.reset(); // 重置对象状态
        this.__using.delete(item);
        this.__free.add(item);
    }


    /**
     * 释放所有正在使用的资源
     */
    releaseAll(): void {
        if (this.__using.size === 0) {
            return;
        }
        this.__using.forEach(item => {
            this.release(item);
        });
        this.__using.clear();
    }

    get using(): Set<T> {
        return this.__using;
    }
    
    /**
     * 获取当前正在使用的数量
     */
    get usingCount(): number {
        return this.__using.size;
    }

    /**
     * 获取空闲计数器的值
     */
    get freeCount(): number {
        return this.__free.size;
    }

    /**
     * 对象池当前的大小（已创建对象的数量）
     */
    get size(): number {
        return this.freeCount + this.usingCount;
    }
}