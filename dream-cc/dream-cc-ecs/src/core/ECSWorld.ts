import { Dictionary } from "dream-cc-core";
import { ECSEntity } from "./ECSEntity";
import { ECSMatcher, Matcher, MatcherAllOf, MatcherAnyOf } from "./ECSMatcher";
import { ECSStorage } from "./ECSStorage";
import { ECSSystem } from "./ECSSystem";
import { IECSComponent } from "./IECSComponent";

/**
 * 世界
 */
export class ECSWorld {

    /**组件优先级（用于控制entity删除时component销毁的调用优先级） */
    static COMPONENT_PRIORITY: (com_type: new () => any) => number;

    static HELP_SYSTEM_LIST: Array<new () => ECSSystem> = [];

    static HELP_ENTITY_LIST: Array<ECSEntity> = [];

    private __maxCount: number;

    /**等待删除的entity*/
    private __waitFree: Array<ECSEntity> = [];

    private __storage: ECSStorage<IECSComponent>;
    private __systems: Dictionary<new () => ECSSystem, ECSSystem>;

    /**组件关联的系统 */
    private __componentSystems: Map<new () => IECSComponent, Array<ECSSystem>>;

    /**系统排序 */
    private __system_priority: (sys: ECSSystem) => number;

    /**标记系统需要排序 */
    private __need_sort_systems: boolean = false;
    /**
     * 当前删除正在删除的entity
     */
    private __currentRemoveEntity: ECSEntity | null = null;
    /**
     * 初始化
     * @param maxCount 
     */
    constructor(maxCount: number) {
        this.__maxCount = maxCount;
        this.__storage = new ECSStorage<IECSComponent>(this.__maxCount);
        this.__systems = new Dictionary<new () => ECSSystem, ECSSystem>();
        this.__componentSystems = new Map<new () => IECSComponent, Array<ECSSystem>>();
    }

    /**系统排序（用于控制system.tick的调用顺序） */
    set system_priority(fn: (sys_type: ECSSystem) => number) {
        this.__system_priority = fn;
        if (this.__system_priority) {
            this.__need_sort_systems = true;
        }
    }

    get system_priority(): (sys: ECSSystem) => number {
        return this.__system_priority;
    }

    /**
     * 心跳
     * @param dt 
     */
    tick(dt: number): void {
        //系统
        const systems = this.__systems.elements;
        //排序
        if (this.__need_sort_systems && this.__system_priority) {
            systems.sort((a, b) => {
                return this.__system_priority(a) - this.__system_priority(b);
            });
            this.__need_sort_systems = false;
        }
        //删除
        for (let index = 0; index < this.__waitFree.length; index++) {
            const id = this.__waitFree[index];
            this.__currentRemoveEntity = id;
            this.__removeEntity(id);
        }
        this.__currentRemoveEntity = null;
        this.__waitFree.splice(0, this.__waitFree.length);
        for (let index = 0; index < systems.length; index++) {
            const sys = systems[index];
            sys.tick(dt);
        }
    }

    /**
     * 创建
     */
    createEntity(entity: ECSEntity): void {
        //如果要创建的entity在等待删除列表中时
        let findex = this.__waitFree.indexOf(entity);
        if (findex >= 0) {
            //删除entity;
            this.__waitFree.splice(findex, 1);
            this.__removeEntity(entity);
        }
        //创建entity
        this.__storage && this.__storage.add(entity);
    }

    /**
     * 查询是否包含entity
     * @param entity 
     * @returns 
     */
    hasEntity(entity: ECSEntity): boolean {
        //如果在等待删除列表中
        if (this.__waitFree.indexOf(entity) >= 0) {
            return false;
        }
        return this.__storage.has(entity);
    }

    /**
     * 删除entity
     * @param entity 
     * @returns 
     */
    removeEntity(entity: ECSEntity): void {
        if (!this.__storage.has(entity)) {
            throw new Error(entity + " entity不存在");
        }
        const index = this.__waitFree.indexOf(entity);
        if (index >= 0) {
            return;
        }
        this.__waitFree.push(entity);
    }

    /**
    * 立刻删除entity
    * @param entity 
    */
    private __removeEntity(entity: ECSEntity): void {
        if (!this.__storage.has(entity)) {
            throw new Error(entity + " entity不存在");
        }
        let com_set = this.__storage.getEntitySet(entity);
        let com_list = Array.from(com_set);
        //删除
        this.__storage.remove(entity);
        //从相关系统匹配记录中删除
        if (com_list.length > 0) {
            for (let index = 0; index < com_list.length; index++) {
                const com_type = com_list[index];
                let sys_list = this.__componentSystems.get(com_type);
                if (sys_list) {
                    for (let index = 0; index < sys_list.length; index++) {
                        const sys = sys_list[index];
                        if (sys.hasEntity(entity)) {
                            sys.removeEntity(entity);
                        }
                    }
                }
            }
        }
    }


    /**
     * 添加组件
     * @param entity
     * @param type
     * @returns
     */
    addComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T {
        if (entity == this.__currentRemoveEntity) {
            throw new Error("删除时添加组件");
        }
        let result = this.__storage.addValue(entity, type);
        result.dirtySignal = () => {
            this.__componentDirty(entity, type);
        }
        //记录所属
        result.entity = entity;
        result.world = this;
        result.enable();
        this.__matcher(result.entity, false, true);
        return result as T;
    }

    /**
     * 查询entity是否包含组件 
     * @param entity 
     * @param type 
     * @param check_instance    是否检查继承关系
     * @returns 
     */
    hasComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): boolean {
        let instance_type = this.__getComponentType(entity, type);
        let result = this.__storage.hasValue(entity, instance_type);
        return result;
    }

    /**
     * 删除组件
     * @param entity 
     * @param type 
     * @returns 
     */
    removeComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T {
        let instance_type = this.__getComponentType(entity, type);
        let result = this.__storage.removeValue(entity, instance_type);
        this.__matcher(entity, false, true);
        return result as T;
    }

    /**
     * 删除entity上的所有组件
     * @param entity 
     */
    removeComponents(entity: ECSEntity): void {
        let entity_coms = this.__storage.getEntitySet(entity);
        if (!entity_coms) return;
        let elements = Array.from(entity_coms);
        for (let index = 0; index < elements.length; index++) {
            const com_type = elements[index];
            this.removeComponent(entity, com_type);
        }
    }

    /**
     * 获取组件在entity上的实例类型
     * @param entity 
     * @param type 
     * @returns 
     */
    private __getComponentType(entity: ECSEntity, type: new () => IECSComponent): new () => IECSComponent {
        if (this.__storage.hasValue(entity, type)) {
            return type;
        }
        let entity_coms = this.__storage.getEntitySet(entity);
        if (!entity_coms) return type;
        for (const com_type of entity_coms) {
            const com = this.__storage.getValue(entity, com_type);
            if (com instanceof type) {
                return com_type;
            }
        }
        return type;
    }

    /**
     * 删除组件
     * @param entity 
     * @param type 
     * @returns 
     */
    removeComponentIf<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T | null {
        let instance_type = this.__getComponentType(entity, type) || type;
        if (this.hasComponent(entity, instance_type)) {
            let result = this.__storage.removeValue(entity, instance_type);
            this.__matcher(entity, false, true);
            return result as T;
        }
        return null;
    }

    /**
     * 通过组件实例进行删除
     * @param entity 
     * @param com 
     * @returns 
     */
    removeComponentBy<T extends IECSComponent>(entity: ECSEntity, com: IECSComponent): T {
        let type = com["constructor"] as new () => T;
        let instance_type = this.__getComponentType(entity, type) || type;
        let result = this.__storage.removeValue(entity, instance_type);
        this.__matcher(entity, false, true);
        return result as T;
    }

    /**
     * 获取组件
     * @param entity 
     * @param type 
     * @returns 
     */
    getComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T | null {
        let instance_type = this.__getComponentType(entity, type) || type;
        let result = this.__storage.getValue(entity, instance_type);
        return result as T;
    }

    /**
     * 获取entity上某个类型组件的列表
     * @param entity 
     * @param type 
     * @returns 
     */
    getComponentList<T extends IECSComponent>(entity: ECSEntity, type: new () => T): Array<T> {
        let result: Array<T> = [];
        //判断当前entity下所有组件是否有组件是继承与指定类型的子类。
        let entitySet = this.__storage.getEntitySet(entity);
        if (entitySet == null) return result;
        for (const com_type of entitySet) {
            const com = this.__storage.getValue(entity, com_type);
            if (com instanceof type) {
                result.push(com);
            }
        }
        return result;
    }

    /**
     * 通过类型获取组件列表
     * @param type 
     * @param check_instance 是否开启instanceof检测，默认关闭
     * @returns 
     */
    getComponents<T extends IECSComponent>(type: new () => T, check_instance: boolean = false): Array<T> {
        if (!check_instance) {
            return this.__storage.getValues(type) as Array<T>;
        }
        let result: Array<T> = [];
        let types: Array<new () => IECSComponent> = [];
        let list = this.__storage.values.keys();
        for (const com_type of list) {
            const com_list = this.__storage.values.get(com_type);
            //判断当前entity下所有组件是否有组件是继承与指定类型的子类。
            if (com_list.length > 0) {
                for (let i = 0; i < com_list.length; i++) {
                    const element = com_list[i];
                    if (element instanceof type) {
                        types.push(com_type);
                        break;
                    }
                }
            }
        }
        for (let index = 0; index < types.length; index++) {
            const element = types[index];
            result = result.concat(this.__storage.getValues(element) as Array<T>);
        }
        return result;
    }

    /**
     * 获取组件，如果没有则添加
     * @param entity 
     * @param type 
     * @returns 
     */
    getAddComponent<T extends IECSComponent>(entity: ECSEntity, type: new () => T): T {
        if (this.__storage.hasValue(entity, type)) {
            return this.getComponent(entity, type);
        }
        return this.addComponent(entity, type);
    }

    /**
     * 添加多个系统
     * @param sys_list 
     */
    addSystems(sys: Array<new () => ECSSystem>): void {
        for (let i = 0; i < sys.length; i++) {
            this.addSystem(sys[i]);
        }
    }

    /**
     * 添加系统 
     */
    addSystem(sysClass: new () => ECSSystem): void {
        if (this.__systems.has(sysClass)) {
            return;
        }
        const sys = new sysClass();
        sys.setWorld(this);
        this.__systems.set(sysClass, sys);
        //添加依赖
        let list = sys._matcher._dependencies;
        for (const com_type of list) {
            let systems: Array<ECSSystem>;
            if (!this.__componentSystems.has(com_type)) {
                systems = [];
                this.__componentSystems.set(com_type, systems);
            } else {
                systems = this.__componentSystems.get(com_type);
            }
            if (systems.indexOf(sys) < 0) {
                systems.push(sys);
            }
        }
        //按照编组规则匹配
        this.__matcherAll(sys);
        this.__need_sort_systems = true;
    }

    /**
     * 是否包含该系统
     * @param key 
     * @returns 
     */
    hasSystem(key: new () => ECSSystem): boolean {
        return this.__systems.has(key);
    }

    /**
     * 获取系统
     * @param key 
     * @returns 
     */
    getSystem(key: new () => ECSSystem): ECSSystem | undefined {
        return this.__systems.get(key);
    }

    /**
     * 删除系统
     * @param value 
     */
    removeSystem(value: ECSSystem): void {
        const sysClass = value.constructor as new () => ECSSystem;
        if (!this.__systems.has(sysClass)) {
            throw new Error("找不到要删除的系统");
        }
        let sys = this.__systems.delete(sysClass);
        //添加依赖
        let list = sys._matcher._dependencies;
        for (const com_type of list) {
            const systems = this.__componentSystems.get(com_type);
            const index = systems.indexOf(sys);
            if (index >= 0) {
                systems.splice(index, 1);
            }
        }
        value.setWorld(null);
        value.destory();
        this.__need_sort_systems = true;
    }


    /**
     * 清理所有元素
     */
    clearAll(): void {
        this.__waitFree.splice(0, this.__waitFree.length);
        this.__storage.clear();
        const systems = this.__systems.elements;
        for (let index = 0; index < systems.length; index++) {
            const sys = systems[index];
            sys.destory();
        }
        this.__systems.clear();
        this.__componentSystems.clear();
    }

    destroy(): void {
        this.clearAll();
        this.__waitFree.splice(0, this.__waitFree.length);
        this.__waitFree = null;
        this.__storage.destroy();
        this.__storage = null;
        this.__systems = null;
    }

    /**标记组件脏了 */
    private __componentDirty<T extends IECSComponent>(entity: ECSEntity, type: new () => T): void {
        let systems = this.__componentSystems.get(type);
        this.__matcher(entity, true, false, systems);
    }

    /**将所有entity跟系统进行匹配 */
    private __matcherAll(sys: ECSSystem): void {
        ECSWorld.HELP_ENTITY_LIST.splice(0, ECSWorld.HELP_ENTITY_LIST.length);
        let list = this.__storage.getIDList(ECSWorld.HELP_ENTITY_LIST);
        for (let index = 0; index < list.length; index++) {
            const id = list[index];
            if (this.__matcherEntity(sys._matcher, id)) {
                sys.addEntity(id);
            }
        }
    }

    private __matcher(id: ECSEntity, useDirty: boolean, all: boolean = false, p_systems?: Array<ECSSystem>): void {
        if (!this.__systems) return;
        const systems = p_systems || this.__systems.elements;
        for (let index = 0; index < systems.length; index++) {
            const sys = systems[index];
            if (sys.useDirty == useDirty || all) {
                if (this.__matcherEntity(sys._matcher, id)) {
                    if (!sys.hasEntity(id)) {
                        sys.addEntity(id);
                    }
                } else {
                    if (sys.hasEntity(id)) {
                        sys.removeEntity(id);
                    }
                }
            }
        }
    }

    private __matcherEntity(matcher: ECSMatcher, entity: ECSEntity): boolean {
        let mainMatcher: boolean = this.__matcherComponents(matcher.matcher!, entity);
        let anyMatcher: boolean = matcher.matcherAnyOf == undefined ? true : this.__matcherComponents(matcher.matcherAnyOf, entity);
        let noneMatcher = matcher.matcherNoneOf == undefined ? true : this.__matcherComponents(matcher.matcherNoneOf, entity);
        return mainMatcher && anyMatcher && noneMatcher;
    }

    private __matcherComponents(matcher: Matcher, entity: ECSEntity): boolean {
        if (matcher instanceof MatcherAllOf) {
            for (let index = 0; index < matcher.types.length; index++) {
                const comType = matcher.types[index];
                if (!this.hasComponent(entity, comType)) {
                    return false;
                }
            }
            return true;
        } else if (matcher instanceof MatcherAnyOf) {
            for (let index = 0; index < matcher.types.length; index++) {
                const comType = matcher.types[index];
                if (this.hasComponent(entity, comType)) {
                    return true;
                }
            }
            return false;
        }
        //排除
        for (let index = 0; index < matcher.types.length; index++) {
            const comType = matcher.types[index];
            if (this.hasComponent(entity, comType)) {
                return false;
            }
        }
        return true;
    }
}