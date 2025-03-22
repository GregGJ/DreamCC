import { IPoolable } from "./IPoolable";
import { PoolImpl } from "./PoolImpl";




/**
 * 对象池
 * @example
 * //从对象池获取一个实例
 * let item=Pool.acquire(MyClass);
 * //将对象还回对象池
 * Pool.release(MyClass,item);
 */
export class Pool {

    /**
     * 对象池的集合
     */
    private static pools = new Map<new () => IPoolable, PoolImpl<IPoolable>>()

    /**
     * 从对象池中获取一个实例
     *
     * @param clazz 类的构造函数，该类需要实现 IPoolable 接口
     * @returns 返回从对象池中获取的实例
     */
    static acquire<T extends IPoolable>(clazz: new () => T): T {
        let pool = this.pools.get(clazz);
        if (!pool) {

            this.pools.set(clazz, new PoolImpl(clazz, 1000, 0))
            return this.acquire(clazz);
        }
        return pool.acquire() as T;
    }


    /**
     * 释放对象到指定类型的对象池中
     *
     * @param clazz 对象类型，必须实现 IPoolable 接口
     * @param item 要释放的对象
     * @throws 如果对象池不存在，则抛出错误
     */
    static release<T extends IPoolable>(clazz: new () => T, item: T): void {
        let pool = this.pools.get(clazz);
        if (pool) {
            pool.release(item);
        } else {
            throw new Error("对象池不存在");
        }
    }

    /**
     * 释放指定类的所有对象
     *
     * @param clazz 类构造函数，需要实现 IPoolable 接口
     * @throws Error 如果对象池不存在，则抛出错误
     */
    static releaseAll<T extends IPoolable>(clazz: new () => T): void {
        let pool = this.pools.get(clazz);
        if (pool) {
            pool.releaseAll();
        } else {
            throw new Error("对象池不存在");
        }
    }


    /**
     * 销毁指定类的对象池
     *
     * @param clazz 需要销毁对象池的类
     * @throws Error 如果对象池不存在，则抛出错误
     */
    static destroy<T extends IPoolable>(clazz: new () => T): void {
        let pool = this.pools.get(clazz);
        if (pool) {
            pool.destroy();
            this.pools.delete(clazz);
        } else {
            throw new Error("对象池不存在");
        }
    }

    static logStatus(): void {
        console.log("各对象池的状态：");
        this.pools.forEach((pool, clazz) => {
            console.log(`类名: ${clazz.name}`);
            console.log(`  已使用对象数量: ${pool.usingCount}`);
            console.log(`  空闲对象数量: ${pool.freeCount}`);
        });
    }
}