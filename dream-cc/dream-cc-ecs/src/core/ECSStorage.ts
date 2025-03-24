import { Dictionary, IPoolable, Pool } from "dream-cc-core";
import { ECSEntity } from "./ECSEntity";
import { ECSWorld } from "./ECSWorld";
import { SparseSet } from "./SparseSet";

export class ECSStorage<T extends IPoolable> {

    private __uidMapping: Dictionary<ECSEntity, number>;
    private __values: Map<new () => any, Array<T | null>>;
    private __entitySets: Array<Set<new () => T>>;
    private __poolRecord: Set<new () => T>;
    private __sparseSet: SparseSet;
    private __freelist: Array<number>;
    private __entityIndex: number = 0;

    constructor(maxCount: number) {
        this.__uidMapping = new Dictionary<ECSEntity, number>();
        this.__sparseSet = new SparseSet(maxCount);
        this.__poolRecord = new Set<new () => T>();
        this.__values = new Map<new () => any, Array<T | null>>();
        this.__entitySets = new Array<Set<new () => T>>(maxCount);
        this.__freelist = [];
    }

    /**
     * 添加
     * @param id 
     */
    add(id: ECSEntity): void {
        if (this.__uidMapping.has(id)) {
            throw new Error("重复添加:" + id)
        }
        let entity: number;
        if (this.__freelist.length > 0) {
            entity = this.__freelist.shift();
        } else {
            entity = this.__entityIndex;
            this.__entityIndex++;
        }
        // console.log("添加entity:", id, entity);
        this.__uidMapping.set(id, entity);
        this.__sparseSet.add(entity);
        const idx = this.__sparseSet.getPackedIdx(entity);
        if (this.__entitySets[idx] == null) {
            this.__entitySets[idx] = new Set<new () => T>();
        }
    }

    /**
     * 是否包含
     * @param id 
     * @returns 
     */
    has(id: ECSEntity): boolean {
        return this.__uidMapping.has(id);
    }

    /**
     * 删除
     * @param id 
     * @returns 
     */
    remove(id: ECSEntity): void {
        if (!this.__uidMapping.has(id)) {
            throw new Error(id + "不存在!");
        }
        let entity = this.__uidMapping.get(id);
        // console.log("删除entity:", id, entity);
        let lastEntity = this.__sparseSet.lastEntity;
        const deleteIdx = this.__sparseSet.getPackedIdx(entity);
        const lastIdx = this.__sparseSet.getPackedIdx(lastEntity);
        //删除关联值
        let values = Array.from(this.getEntitySet(id));
        //排序
        if (ECSWorld.COMPONENT_PRIORITY) {
            values.sort((a, b) => {
                const a_p = ECSWorld.COMPONENT_PRIORITY(a);
                const b_p = ECSWorld.COMPONENT_PRIORITY(b);
                return a_p - b_p;
            });
        }
        for (let i = 0; i < values.length; i++) {
            const com_type = values[i];
            this.removeValue(id, com_type);
        }
        //如果删除的内容不在末尾，则将末尾内容移动到删除位置
        if (deleteIdx != lastIdx) {
            let last_set = this.__entitySets[lastIdx];
            if (last_set) {
                for (const type of last_set) {
                    const list = this.__values.get(type);
                    if (list) {
                        list[deleteIdx] = list[lastIdx];
                        list[lastIdx] = null;
                        this.__entitySets[deleteIdx].add(type);
                    }
                }
                last_set.clear();
            }
        }
        this.__uidMapping.delete(id);
        this.__sparseSet.remove(entity);
        this.__freelist.push(entity);
    }

    /**
     * 获取
     * @param id 
     * @param type 
     * @returns 
     */
    getValue(id: ECSEntity, type: new () => T): T | null {
        let entity = this.__uidMapping.get(id);
        let pIdx = this.__sparseSet.getPackedIdx(entity);
        if (pIdx == this.__sparseSet.invalid) {
            return null;
        }
        let list = this.__values.get(type);
        if (list == null || list.length == 0 || pIdx >= list.length) {
            return null;
        }
        return list[pIdx] as T;
    }

    /**
     * 添加
     * @param id 
     * @param type 
     * @returns 
     */
    addValue(id: ECSEntity, type: new () => T): T {
        if (!this.__uidMapping.has(id)) {
            throw new Error(id + "对象不存在！");
        }
        let entity = this.__uidMapping.get(id);
        // console.log("添加组件：", id, entity, egret.getQualifiedClassName(type));
        if (!this.__sparseSet.contains(entity)) throw new Error("不存在:" + id);
        const pIdx = this.__sparseSet.getPackedIdx(entity);
        let list = this.__values.get(type);
        if (list == null) {
            list = new Array<T>(this.__sparseSet.maxCount);
            this.__values.set(type, list);
        }
        if (list[pIdx] != null) {
            throw new Error(id + "=>重复添加:" + type);
        }
        this.__poolRecord.add(type);//记录分配类型
        let result = list[pIdx] = Pool.acquire(type);
        //增加组件标记
        let entitySet = this.__entitySets[pIdx];
        entitySet.add(type);
        return result;
    }

    /**
     * 是否包含Value
     * @param id 
     * @param type 
     */
    hasValue(id: ECSEntity, type: new () => T): boolean {
        if (!this.__uidMapping.has(id)) {
            return false;
        }
        let entity = this.__uidMapping.get(id);
        let pIdx = this.__sparseSet.getPackedIdx(entity);
        let list = this.__values.get(type);
        if (list == null) {
            return false;
        }
        if (list[pIdx] == null) {
            return false;
        }
        return true;
    }

    /**
     * 删除
     * @param id 
     * @param type 
     * @returns 
     */
    removeValue(id: ECSEntity, type: new () => T): T {
        if (!this.__uidMapping.has(id)) {
            throw new Error(id + "不存在:");
        }
        let entity = this.__uidMapping.get(id);
        // console.log("删除组件：",id,entity,egret.getQualifiedClassName(type));
        let pIdx = this.__sparseSet.getPackedIdx(entity);
        let list = this.__values.get(type);
        if (list == null || list.length == 0) {
            throw new Error(id + "=>上找不到要删除的关联对象:" + type);
        }
        let result = list[pIdx] as T;
        list[pIdx] = null;
        Pool.release(type, result);
        //删除组件标记
        let entitySet = this.__entitySets[pIdx];
        entitySet.delete(type);
        return result;
    }

    /**
     * 根据类型获取列表
     * @param type 
     * @returns 
     */
    getValues(type: new () => T): Array<T> {
        return Pool.getUsing(type);
    }

    getEntitySet(id: ECSEntity): Set<new () => T> | null {
        if (!this.__uidMapping.has(id)) {
            return null;
        }
        let entity = this.__uidMapping.get(id);
        let pIdx = this.__sparseSet.getPackedIdx(entity);
        return this.__entitySets[pIdx];
    }

    /**
     * 清理
     */
    clear(): void {
        this.__entityIndex = 0;
        let ids = this.__uidMapping.getKeys();
        while (ids.length > 0) {
            this.remove(ids.shift() as ECSEntity);
        }
        this.__values.clear();
        this.__freelist.splice(0, this.__freelist.length);
    }

    /**销毁 */
    destroy(): void {
        this.__entitySets.splice(0, this.__entitySets.length);
        this.__uidMapping.clear();
        this.__uidMapping = null;
        this.__sparseSet.destroy();
        this.__sparseSet = null;
        for (const element of this.__poolRecord) {
            Pool.destroy(element);
        }
        this.__poolRecord.clear();
        this.__poolRecord = null;

        this.__values.clear();
        this.__values = null;
    }

    /**无效值 */
    get invalid(): number {
        return this.__sparseSet.invalid;
    }

    getIDList(result?: Array<ECSEntity>): Array<ECSEntity> {
        result = result || [];
        this.__uidMapping.getKeys(result);
        return result;
    }

    get values(): Map<new () => any, Array<T | null>> {
        return this.__values;
    }
}