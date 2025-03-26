// src/core/ECSComponent.ts
import { TickerManager } from "dream-cc-core";
var ECSComponent = class {
  constructor() {
  }
  /**
   * 启用组件
   */
  enable() {
  }
  /**标记该组件数据为脏*/
  markDirtied() {
    TickerManager.callNextFrame(this.__nextFrame, this);
  }
  __nextFrame() {
    this.dirtySignal && this.dirtySignal();
  }
  /**重置*/
  reset() {
    TickerManager.clearNextFrame(this.__nextFrame, this);
    this.dirtySignal = null;
    this.world = null;
    this.entity = void 0;
  }
  destroy() {
    this.reset();
    return true;
  }
};

// src/core/ECSMatcher.ts
var ECSMatcher = class {
  constructor(allOrAny, matcherAnyOf, none) {
    /**
     * 全部包含或任意包含
     */
    this.matcher = void 0;
    /**
     * 可选任意包含
     */
    this.matcherAnyOf = void 0;
    /**
     * 不能包含的
     */
    this.matcherNoneOf = void 0;
    /**
     * 编组所匹配的元素(内部接口)
     */
    this.__entitys = /* @__PURE__ */ new Set();
    /**
     * 关联组件
     */
    this._dependencies = /* @__PURE__ */ new Set();
    this.matcher = allOrAny;
    this.matcherAnyOf = matcherAnyOf;
    this.matcherNoneOf = none;
    for (let index = 0; index < allOrAny.types.length; index++) {
      const type = allOrAny.types[index];
      this._dependencies.add(type);
    }
    if (matcherAnyOf) {
      for (let index = 0; index < matcherAnyOf.types.length; index++) {
        const type = matcherAnyOf.types[index];
        this._dependencies.add(type);
      }
    }
    if (none) {
      for (let index = 0; index < none.types.length; index++) {
        const type = none.types[index];
        this._dependencies.delete(type);
      }
    }
  }
  get entitys() {
    return this.__entitys;
  }
  has(entity) {
    return this.__entitys.has(entity);
  }
  add(entity) {
    this.__entitys.add(entity);
  }
  remove(entity) {
    this.__entitys.delete(entity);
  }
  clear() {
    this.__entitys.clear();
  }
  destroy() {
    this.matcher = void 0;
    this.matcherNoneOf = void 0;
    this.__entitys = null;
    this._dependencies.clear();
    this._dependencies = null;
  }
};
var Matcher = class {
  constructor(types) {
    this.types = types;
  }
};
var MatcherAllOf = class extends Matcher {
  constructor(types) {
    super(types);
  }
};
var MatcherAnyOf = class extends Matcher {
  constructor(types) {
    super(types);
  }
};
var MatcherNoneOf = class extends Matcher {
  constructor(types) {
    super(types);
  }
};

// src/core/ECSStorage.ts
import { Dictionary as Dictionary2, Pool } from "dream-cc-core";

// src/core/ECSWorld.ts
import { Dictionary } from "dream-cc-core";
var _ECSWorld = class _ECSWorld {
  /**
   * 初始化
   * @param maxCount 
   */
  constructor(maxCount) {
    /**等待删除的entity*/
    this.__waitFree = [];
    /**标记系统需要排序 */
    this.__need_sort_systems = false;
    /**
     * 当前删除正在删除的entity
     */
    this.__currentRemoveEntity = null;
    this.__maxCount = maxCount;
    this.__storage = new ECSStorage(this.__maxCount);
    this.__systems = new Dictionary();
    this.__componentSystems = /* @__PURE__ */ new Map();
  }
  /**系统排序（用于控制system.tick的调用顺序） */
  set system_priority(fn) {
    this.__system_priority = fn;
    if (this.__system_priority) {
      this.__need_sort_systems = true;
    }
  }
  get system_priority() {
    return this.__system_priority;
  }
  /**
   * 心跳
   * @param dt 
   */
  tick(dt) {
    const systems = this.__systems.elements;
    if (this.__need_sort_systems && this.__system_priority) {
      systems.sort((a, b) => {
        return this.__system_priority(a) - this.__system_priority(b);
      });
      this.__need_sort_systems = false;
    }
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
  createEntity(entity) {
    let findex = this.__waitFree.indexOf(entity);
    if (findex >= 0) {
      this.__waitFree.splice(findex, 1);
      this.__removeEntity(entity);
    }
    this.__storage && this.__storage.add(entity);
  }
  /**
   * 查询是否包含entity
   * @param entity 
   * @returns 
   */
  hasEntity(entity) {
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
  removeEntity(entity) {
    if (!this.__storage.has(entity)) {
      throw new Error(entity + " entity\u4E0D\u5B58\u5728");
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
  __removeEntity(entity) {
    if (!this.__storage.has(entity)) {
      throw new Error(entity + " entity\u4E0D\u5B58\u5728");
    }
    let com_set = this.__storage.getEntitySet(entity);
    let com_list = Array.from(com_set);
    this.__storage.remove(entity);
    if (com_list.length > 0) {
      for (let index = 0; index < com_list.length; index++) {
        const com_type = com_list[index];
        let sys_list = this.__componentSystems.get(com_type);
        if (sys_list) {
          for (let index2 = 0; index2 < sys_list.length; index2++) {
            const sys = sys_list[index2];
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
  addComponent(entity, type) {
    if (entity == this.__currentRemoveEntity) {
      throw new Error("\u5220\u9664\u65F6\u6DFB\u52A0\u7EC4\u4EF6");
    }
    let result = this.__storage.addValue(entity, type);
    result.dirtySignal = () => {
      this.__componentDirty(entity, type);
    };
    result.entity = entity;
    result.world = this;
    result.enable();
    this.__matcher(result.entity, false, true);
    return result;
  }
  /**
   * 查询entity是否包含组件 
   * @param entity 
   * @param type 
   * @param check_instance    是否检查继承关系
   * @returns 
   */
  hasComponent(entity, type) {
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
  removeComponent(entity, type) {
    let instance_type = this.__getComponentType(entity, type);
    let result = this.__storage.removeValue(entity, instance_type);
    this.__matcher(entity, false, true);
    return result;
  }
  /**
   * 删除entity上的所有组件
   * @param entity 
   */
  removeComponents(entity) {
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
  __getComponentType(entity, type) {
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
  removeComponentIf(entity, type) {
    let instance_type = this.__getComponentType(entity, type) || type;
    if (this.hasComponent(entity, instance_type)) {
      let result = this.__storage.removeValue(entity, instance_type);
      this.__matcher(entity, false, true);
      return result;
    }
    return null;
  }
  /**
   * 通过组件实例进行删除
   * @param entity 
   * @param com 
   * @returns 
   */
  removeComponentBy(entity, com) {
    let type = com["constructor"];
    let instance_type = this.__getComponentType(entity, type) || type;
    let result = this.__storage.removeValue(entity, instance_type);
    this.__matcher(entity, false, true);
    return result;
  }
  /**
   * 获取组件
   * @param entity 
   * @param type 
   * @returns 
   */
  getComponent(entity, type) {
    let instance_type = this.__getComponentType(entity, type) || type;
    let result = this.__storage.getValue(entity, instance_type);
    return result;
  }
  /**
   * 获取entity上某个类型组件的列表
   * @param entity 
   * @param type 
   * @returns 
   */
  getComponentList(entity, type) {
    let result = [];
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
  getComponents(type, check_instance = false) {
    if (!check_instance) {
      return this.__storage.getValues(type);
    }
    let result = [];
    let types = [];
    let list = this.__storage.values.keys();
    for (const com_type of list) {
      const com_list = this.__storage.values.get(com_type);
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
      result = result.concat(this.__storage.getValues(element));
    }
    return result;
  }
  /**
   * 获取组件，如果没有则添加
   * @param entity 
   * @param type 
   * @returns 
   */
  getAddComponent(entity, type) {
    if (this.__storage.hasValue(entity, type)) {
      return this.getComponent(entity, type);
    }
    return this.addComponent(entity, type);
  }
  /**
   * 添加多个系统
   * @param sys_list 
   */
  addSystems(sys) {
    for (let i = 0; i < sys.length; i++) {
      this.addSystem(sys[i]);
    }
  }
  /**
   * 添加系统 
   */
  addSystem(sysClass) {
    if (this.__systems.has(sysClass)) {
      return;
    }
    const sys = new sysClass();
    sys.setWorld(this);
    this.__systems.set(sysClass, sys);
    let list = sys._matcher._dependencies;
    for (const com_type of list) {
      let systems;
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
    this.__matcherAll(sys);
    this.__need_sort_systems = true;
  }
  /**
   * 是否包含该系统
   * @param key 
   * @returns 
   */
  hasSystem(key) {
    return this.__systems.has(key);
  }
  /**
   * 获取系统
   * @param key 
   * @returns 
   */
  getSystem(key) {
    return this.__systems.get(key);
  }
  /**
   * 删除系统
   * @param value 
   */
  removeSystem(value) {
    const sysClass = value.constructor;
    if (!this.__systems.has(sysClass)) {
      throw new Error("\u627E\u4E0D\u5230\u8981\u5220\u9664\u7684\u7CFB\u7EDF");
    }
    let sys = this.__systems.delete(sysClass);
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
  clearAll() {
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
  destroy() {
    this.clearAll();
    this.__waitFree.splice(0, this.__waitFree.length);
    this.__waitFree = null;
    this.__storage.destroy();
    this.__storage = null;
    this.__systems = null;
  }
  /**标记组件脏了 */
  __componentDirty(entity, type) {
    let systems = this.__componentSystems.get(type);
    this.__matcher(entity, true, false, systems);
  }
  /**将所有entity跟系统进行匹配 */
  __matcherAll(sys) {
    _ECSWorld.HELP_ENTITY_LIST.splice(0, _ECSWorld.HELP_ENTITY_LIST.length);
    let list = this.__storage.getIDList(_ECSWorld.HELP_ENTITY_LIST);
    for (let index = 0; index < list.length; index++) {
      const id = list[index];
      if (this.__matcherEntity(sys._matcher, id)) {
        sys.addEntity(id);
      }
    }
  }
  __matcher(id, useDirty, all = false, p_systems) {
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
  __matcherEntity(matcher, entity) {
    let mainMatcher = this.__matcherComponents(matcher.matcher, entity);
    let anyMatcher = matcher.matcherAnyOf == void 0 ? true : this.__matcherComponents(matcher.matcherAnyOf, entity);
    let noneMatcher = matcher.matcherNoneOf == void 0 ? true : this.__matcherComponents(matcher.matcherNoneOf, entity);
    return mainMatcher && anyMatcher && noneMatcher;
  }
  __matcherComponents(matcher, entity) {
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
    for (let index = 0; index < matcher.types.length; index++) {
      const comType = matcher.types[index];
      if (this.hasComponent(entity, comType)) {
        return false;
      }
    }
    return true;
  }
};
_ECSWorld.HELP_SYSTEM_LIST = [];
_ECSWorld.HELP_ENTITY_LIST = [];
var ECSWorld = _ECSWorld;

// src/core/SparseSet.ts
var SparseSet = class {
  constructor(maxCount) {
    /**无效值 */
    this.invalid = 0;
    this.__maxCount = 0;
    this.__index = 0;
    this.__maxCount = this.invalid = maxCount;
    this.__packed = new Uint32Array(this.__maxCount);
    this.__packed.fill(this.invalid);
    this.__sparse = new Uint32Array(this.__maxCount);
    this.__sparse.fill(this.invalid);
  }
  /**
   * 添加
   * @param id 
   */
  add(id) {
    if (id >= this.invalid) {
      throw new Error("\u8D85\u51FA\u6700\u5927\u7D22\u5F15:" + id + "/" + this.invalid);
    }
    this.__packed[this.__index] = id;
    this.__sparse[id] = this.__index;
    this.__index++;
  }
  /**
   * 是否包含
   * @param id 
   * @returns 
   */
  contains(id) {
    if (id >= this.__sparse.length) {
      return false;
    }
    if (this.__sparse[id] == this.invalid) {
      return false;
    }
    return true;
  }
  /**
   * 删除
   * @param id 
   */
  remove(id) {
    if (id >= this.__maxCount) {
      throw new Error("\u8D85\u51FA\u8303\u56F4");
    }
    let delete_packIdx = this.__sparse[id];
    let lastIdx = this.__index - 1;
    if (this.length == 1 || delete_packIdx == lastIdx) {
      this.__packed[lastIdx] = this.invalid;
      this.__sparse[id] = this.invalid;
    } else {
      let swap_id = this.__packed[lastIdx];
      this.__packed[delete_packIdx] = swap_id;
      this.__sparse[id] = this.invalid;
      this.__sparse[swap_id] = delete_packIdx;
      this.__packed[lastIdx] = this.invalid;
    }
    this.__index--;
  }
  /**
   * 清除所有
   */
  clear() {
    this.__packed.fill(this.invalid);
    this.__sparse.fill(this.invalid);
    this.__index = 0;
  }
  destroy() {
    this.__packed = null;
    this.__sparse = null;
  }
  /**
   * 获取packed的索引值
   * @param id 
   * @returns 
   */
  getPackedIdx(id) {
    if (id >= this.__sparse.length) {
      return this.invalid;
    }
    if (this.__sparse[id] == this.invalid) {
      return this.invalid;
    }
    const pIdx = this.__sparse[id];
    return pIdx;
  }
  /**
   * 最后一个entity
   */
  get lastEntity() {
    return this.__packed[this.__index - 1];
  }
  get packed() {
    return this.__packed;
  }
  get length() {
    return this.__index;
  }
  get maxCount() {
    return this.__maxCount;
  }
};

// src/core/ECSStorage.ts
var ECSStorage = class {
  constructor(maxCount) {
    this.__entityIndex = 0;
    this.__uidMapping = new Dictionary2();
    this.__sparseSet = new SparseSet(maxCount);
    this.__poolRecord = /* @__PURE__ */ new Set();
    this.__values = /* @__PURE__ */ new Map();
    this.__entitySets = new Array(maxCount);
    this.__freelist = [];
  }
  /**
   * 添加
   * @param id 
   */
  add(id) {
    if (this.__uidMapping.has(id)) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0:" + id);
    }
    let entity;
    if (this.__freelist.length > 0) {
      entity = this.__freelist.shift();
    } else {
      entity = this.__entityIndex;
      this.__entityIndex++;
    }
    this.__uidMapping.set(id, entity);
    this.__sparseSet.add(entity);
    const idx = this.__sparseSet.getPackedIdx(entity);
    if (this.__entitySets[idx] == null) {
      this.__entitySets[idx] = /* @__PURE__ */ new Set();
    }
  }
  /**
   * 是否包含
   * @param id 
   * @returns 
   */
  has(id) {
    return this.__uidMapping.has(id);
  }
  /**
   * 删除
   * @param id 
   * @returns 
   */
  remove(id) {
    if (!this.__uidMapping.has(id)) {
      throw new Error(id + "\u4E0D\u5B58\u5728!");
    }
    let entity = this.__uidMapping.get(id);
    let lastEntity = this.__sparseSet.lastEntity;
    const deleteIdx = this.__sparseSet.getPackedIdx(entity);
    const lastIdx = this.__sparseSet.getPackedIdx(lastEntity);
    let values = Array.from(this.getEntitySet(id));
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
  getValue(id, type) {
    let entity = this.__uidMapping.get(id);
    let pIdx = this.__sparseSet.getPackedIdx(entity);
    if (pIdx == this.__sparseSet.invalid) {
      return null;
    }
    let list = this.__values.get(type);
    if (list == null || list.length == 0 || pIdx >= list.length) {
      return null;
    }
    return list[pIdx];
  }
  /**
   * 添加
   * @param id 
   * @param type 
   * @returns 
   */
  addValue(id, type) {
    if (!this.__uidMapping.has(id)) {
      throw new Error(id + "\u5BF9\u8C61\u4E0D\u5B58\u5728\uFF01");
    }
    let entity = this.__uidMapping.get(id);
    if (!this.__sparseSet.contains(entity)) throw new Error("\u4E0D\u5B58\u5728:" + id);
    const pIdx = this.__sparseSet.getPackedIdx(entity);
    let list = this.__values.get(type);
    if (list == null) {
      list = new Array(this.__sparseSet.maxCount);
      this.__values.set(type, list);
    }
    if (list[pIdx] != null) {
      throw new Error(id + "=>\u91CD\u590D\u6DFB\u52A0:" + type);
    }
    this.__poolRecord.add(type);
    let result = list[pIdx] = Pool.acquire(type);
    let entitySet = this.__entitySets[pIdx];
    entitySet.add(type);
    return result;
  }
  /**
   * 是否包含Value
   * @param id 
   * @param type 
   */
  hasValue(id, type) {
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
  removeValue(id, type) {
    if (!this.__uidMapping.has(id)) {
      throw new Error(id + "\u4E0D\u5B58\u5728:");
    }
    let entity = this.__uidMapping.get(id);
    let pIdx = this.__sparseSet.getPackedIdx(entity);
    let list = this.__values.get(type);
    if (list == null || list.length == 0) {
      throw new Error(id + "=>\u4E0A\u627E\u4E0D\u5230\u8981\u5220\u9664\u7684\u5173\u8054\u5BF9\u8C61:" + type);
    }
    let result = list[pIdx];
    list[pIdx] = null;
    Pool.release(type, result);
    let entitySet = this.__entitySets[pIdx];
    entitySet.delete(type);
    return result;
  }
  /**
   * 根据类型获取列表
   * @param type 
   * @returns 
   */
  getValues(type) {
    return Pool.getUsing(type);
  }
  getEntitySet(id) {
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
  clear() {
    this.__entityIndex = 0;
    let ids = this.__uidMapping.getKeys();
    while (ids.length > 0) {
      this.remove(ids.shift());
    }
    this.__values.clear();
    this.__freelist.splice(0, this.__freelist.length);
  }
  /**销毁 */
  destroy() {
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
  get invalid() {
    return this.__sparseSet.invalid;
  }
  getIDList(result) {
    result = result || [];
    this.__uidMapping.getKeys(result);
    return result;
  }
  get values() {
    return this.__values;
  }
};

// src/core/ECSSystem.ts
var ECSSystem = class {
  /**
   * 系统
   * @param allOrAny  匹配所有或任意一个 
   * @param none      不能包含
   * @param useDirty  是否使用脏数据机制
   */
  constructor(allOrAny, matcherAnyOf, none, useDirty = false) {
    /**是否使用脏数据*/
    this.useDirty = false;
    /**所属世界 */
    this.__world = null;
    this._matcher = new ECSMatcher(allOrAny, matcherAnyOf, none);
    this.useDirty = useDirty;
  }
  /**设置所属世界 */
  setWorld(v) {
    this.__world = v;
  }
  /**心跳 */
  tick(dt) {
    if (this._matcher.entitys.size == 0) return;
    this.$tick(this._matcher.entitys, dt);
    if (this.useDirty) {
      this._matcher.clear();
    }
  }
  hasEntity(entity) {
    return this._matcher.has(entity);
  }
  removeEntity(entity) {
    this._matcher.remove(entity);
  }
  addEntity(entity) {
    this._matcher.add(entity);
  }
  /**所属世界 */
  get world() {
    return this.__world;
  }
  $tick(entitys, dt) {
  }
  /**销毁 */
  destory() {
    this.__world = null;
    this._matcher = null;
  }
};
ECSSystem.HELP_ENTITY_LIST = [];

// src/camps/CampComponent.ts
var CampComponent = class extends ECSComponent {
  constructor() {
    super();
    /**
     * 阵营
     */
    this.camp = 0;
  }
};

// src/transforms/TransformComponent.ts
import { Quat, Vec3 } from "cc";
var TransformComponent = class extends ECSComponent {
  constructor() {
    super();
    this.__position = new Vec3();
    this.__rotation = new Quat();
    this.__angle = new Vec3();
    this.__scale = new Vec3(1, 1, 1);
    this.__direction = new Vec3(1, 0, 0);
  }
  /**
   * 设置朝向
   * @param x 
   * @param y 
   * @param z 
   */
  setDirection(x, y, z) {
    let changed = false;
    if (x != void 0 && this.__direction.x != x) {
      this.__direction.x = x;
      changed = true;
    }
    if (y != void 0 && this.__direction.y != y) {
      this.__direction.y = y;
      changed = true;
    }
    if (z != void 0 && this.__direction.z != z) {
      this.__direction.z = z;
      changed = true;
    }
    if (changed) {
      this.markDirtied();
    }
  }
  get direction() {
    return this.__direction;
  }
  setPosition(x, y, z) {
    let changed = false;
    if (x != void 0 && this.__position.x != x) {
      this.__position.x = x;
      changed = true;
    }
    if (y != void 0 && this.__position.y != y) {
      this.__position.y = y;
      changed = true;
    }
    if (z != void 0 && this.__position.z != z) {
      this.__position.z = z;
      changed = true;
    }
    if (changed) {
      this.markDirtied();
    }
  }
  get x() {
    return this.__position.x;
  }
  set x(v) {
    if (this.__position.x == v) return;
    this.__position.x = v;
    this.markDirtied();
  }
  get y() {
    return this.__position.y;
  }
  set y(v) {
    if (this.__position.y == v) return;
    this.__position.y = v;
    this.markDirtied();
  }
  get z() {
    return this.__position.z;
  }
  set z(v) {
    if (this.__position.z == v) return;
    this.__position.z = v;
    this.markDirtied();
  }
  get position() {
    return this.__position;
  }
  set position(v) {
    if (this.__position.equals(v)) return;
    this.__position.set(v);
    this.markDirtied();
  }
  /**
   * 设置旋转角度(0-360)
   * @param x 
   * @param y 
   * @param z 
   */
  setAngle(x, y, z) {
    let changed = false;
    if (x != void 0 && this.__angle.x != x) {
      this.__angle.x = x;
      changed = true;
    }
    if (y != void 0 && this.__angle.y != y) {
      this.__angle.y = y;
      changed = true;
    }
    if (z != void 0 && this.__angle.z != z) {
      this.__angle.z = z;
      changed = true;
    }
    if (changed) {
      Quat.fromEuler(this.__rotation, this.__angle.x, this.__angle.y, this.__angle.z);
      this.markDirtied();
    }
  }
  get rotation() {
    return this.__rotation;
  }
  set rotation(v) {
    if (this.__rotation.equals(v)) return;
    this.__rotation.set(v);
    this.markDirtied();
  }
  /**
   * 设置缩放比例
   * @param x 
   * @param y 
   * @param z 
   */
  setScale(x, y, z) {
    let changed = false;
    if (x != void 0 && this.__angle.x != x) {
      this.__scale.x = x;
      changed = true;
    }
    if (y != void 0 && this.__angle.y != y) {
      this.__scale.y = y;
      changed = true;
    }
    if (z != void 0 && this.__angle.z != z) {
      this.__scale.z = z;
      changed = true;
    }
    if (changed) {
      this.markDirtied();
    }
  }
  /**
   * 缩放比例
   */
  set scale(v) {
    if (this.__scale.equals(v)) return;
    this.__scale.set(v);
    this.markDirtied();
  }
  get scale() {
    return this.__scale;
  }
  reset() {
    super.reset();
    this.__direction.set(0, 0, 0);
    this.__position.set(0, 0, 0);
    this.__angle.set(0, 0, 0);
    this.__rotation.set(0, 0, 0, 1);
    this.__scale.set(1, 1, 1);
  }
};
/**
 * 是否翻转Y轴
 */
TransformComponent.YAxisFlip = true;

// src/nodes/ParentComponent.ts
var ParentComponent = class extends ECSComponent {
  constructor() {
    super();
    this.__parent = null;
  }
  set parent(v) {
    if (this.__parent === v) return;
    this.__parent = v;
    this.markDirtied();
  }
  get parent() {
    return this.__parent;
  }
  reset() {
    super.reset();
    this.parent = null;
  }
};

// src/nodes/AddToParentQueueSystem.ts
import { Node as Node2 } from "cc";

// src/displays/DisplayComponent.ts
import { Node } from "cc";
var DisplayComponent = class extends ECSComponent {
  constructor() {
    super();
  }
  enable() {
    this.__node = new Node(this.entity.toString());
  }
  reset() {
    super.reset();
    this.__node.destroy();
    this.__node = null;
  }
  /**
   * 节点
   */
  get node() {
    return this.__node;
  }
  set name(v) {
    this.__node && (this.__node.name = v);
  }
  get name() {
    return this.__node.name || "";
  }
};

// src/nodes/AddToParentQueueSystem.ts
var AddToParentQueueSystem = class extends ECSSystem {
  constructor() {
    super(
      new MatcherAllOf([
        DisplayComponent,
        ParentComponent
      ]),
      void 0,
      void 0,
      true
    );
    this.frame_count = Number.MAX_VALUE;
    this.nodes = /* @__PURE__ */ new Set();
  }
  tick(dt) {
    super.tick(dt);
    if (this.nodes.size > 0) {
      let count = Math.min(this.frame_count, this.nodes.size);
      let itr = this.nodes.values();
      let index = 0;
      while (index < count) {
        const entity = itr.next().value;
        this.nodes.delete(entity);
        if (this.world.hasEntity(entity)) {
          const parent_com = this.world.getComponent(entity, ParentComponent);
          const display_com = this.world.getComponent(entity, DisplayComponent);
          if (parent_com.parent == null) {
            continue;
          }
          if (parent_com.parent instanceof Node2) {
            parent_com.parent.addChild(display_com.node);
          } else {
            let parent_node = this.world.getComponent(parent_com.parent, DisplayComponent);
            if (!parent_node) {
              continue;
            }
            parent_node.node.addChild(display_com.node);
          }
        }
        index++;
      }
    }
  }
  $tick(entitys, dt) {
    for (const entity of entitys) {
      this.nodes.add(entity);
    }
  }
};

// src/nodes/AddToParentSystem.ts
import { Node as Node3 } from "cc";
var AddToParentSystem = class extends ECSSystem {
  constructor() {
    super(
      new MatcherAllOf([
        DisplayComponent,
        ParentComponent
      ]),
      void 0,
      void 0,
      true
    );
  }
  $tick(entitys, dt) {
    for (const entity of entitys) {
      const parent_com = this.world.getComponent(entity, ParentComponent);
      const display_com = this.world.getComponent(entity, DisplayComponent);
      if (parent_com.parent == null) {
        continue;
      }
      if (parent_com.parent instanceof Node3) {
        parent_com.parent.addChild(display_com.node);
      } else {
        let parent_display_com = this.world.getComponent(parent_com.parent, DisplayComponent);
        if (!parent_display_com) {
          continue;
        }
        parent_display_com.node.addChild(display_com.node);
      }
    }
  }
};

// src/nodes/SizeComponent.ts
import { Vec3 as Vec32 } from "cc";
var SizeComponent = class extends ECSComponent {
  constructor() {
    super();
    this.__size = new Vec32(1, 1, 1);
  }
  setSize(w, h) {
    this.__size.x = w;
    this.__size.y = h;
    this.markDirtied();
  }
  set width(v) {
    if (this.__size.x === v) return;
    this.__size.x = v;
    this.markDirtied();
  }
  get width() {
    return this.__size.x;
  }
  set height(v) {
    if (this.__size.y === v) return;
    this.__size.y = v;
  }
  get height() {
    return this.__size.y;
  }
  reset() {
    super.reset();
    this.__size.set(1, 1, 1);
  }
};

// src/displays/DisplaySystem.ts
var DisplaySystem = class extends ECSSystem {
  constructor() {
    super(
      new MatcherAllOf([
        DisplayComponent,
        TransformComponent
      ]),
      void 0,
      void 0,
      true
      //使用脏数据
    );
  }
  $tick(entitys, dt) {
    for (const entity of entitys) {
      const display_com = this.world.getComponent(entity, DisplayComponent);
      const trans_com = this.world.getComponent(entity, TransformComponent);
      display_com.node.setRotation(trans_com.rotation);
      if (TransformComponent.YAxisFlip) {
        display_com.node.setPosition(trans_com.position.x, trans_com.position.y * -1, trans_com.position.z);
      } else {
        display_com.node.setPosition(trans_com.position);
      }
      display_com.node.setScale(trans_com.scale);
    }
  }
};

// src/displays/GraphicsComponent.ts
import { Graphics } from "cc";
var GraphicsComponent = class extends DisplayComponent {
  constructor() {
    super();
  }
  enable() {
    super.enable();
    this.__graphics = this.node.addComponent(Graphics);
  }
  get graphics() {
    return this.__graphics;
  }
  reset() {
    super.reset();
    if (this.__graphics) {
      this.__graphics.destroy();
      this.__graphics = null;
    }
  }
};

// src/datas/DataComponent.ts
var DataComponent = class extends ECSComponent {
  constructor() {
    super();
  }
  reset() {
    super.reset();
    this.__data = null;
  }
  set data(v) {
    if (this.__data == v) return;
    this.__data = v;
    this.markDirtied();
  }
  get data() {
    return this.__data;
  }
};

// src/links/LinkComponent.ts
var LinkComponent = class extends ECSComponent {
  constructor() {
    super();
  }
};

// src/links/LinkSystem.ts
var LinkSystem = class extends ECSSystem {
  constructor() {
    super(new MatcherAllOf([LinkComponent, TransformComponent]));
  }
  $tick(entitys, dt) {
    for (let entity of entitys) {
      const link_com = this.world.getComponent(entity, LinkComponent);
      const trans = this.world.getComponent(entity, TransformComponent);
      if (link_com.target) {
        const target_trans = this.world.getComponent(
          link_com.target,
          TransformComponent
        );
        trans.setPosition(target_trans.x, target_trans.y, target_trans.z);
      }
    }
  }
};

// src/displays/RendererRoot2DComponent.ts
import { RenderRoot2D } from "cc";
var RendererRoot2DComponent = class extends DisplayComponent {
  constructor() {
    super();
  }
  enable() {
    super.enable();
    this.__root2D = this.node.addComponent(RenderRoot2D);
  }
  reset() {
    super.reset();
    if (this.__root2D) {
      this.__root2D.destroy();
      this.__root2D = null;
    }
  }
};

// src/levels/LevelStatus.ts
var LevelStatus = class {
  constructor() {
    this.__status = /* @__PURE__ */ new Map();
  }
  /**
   * 获取数据
   * @param key 
   * @returns 
   */
  get(key) {
    return this.__status.get(key);
  }
  /**
   * 是否包含数据
   * @param key 
   * @returns 
   */
  has(key) {
    return this.__status.has(key);
  }
  /**
   * 设置数据
   * @param key 
   * @param value 
   */
  set(key, value) {
    this.__status.set(key, value);
  }
  /**
   * 删除数据
   */
  delete(key) {
    this.__status.delete(key);
  }
  clear() {
    this.__status.clear();
  }
  destroy() {
    this.clear();
    this.__status = null;
    return true;
  }
};

// src/levels/Level.ts
import { Event, EventDispatcher } from "dream-cc-core";
var Level = class extends EventDispatcher {
  constructor() {
    super();
    this.__entered = false;
    this.__status = new LevelStatus();
  }
  /**
   * 初始化
   * @param root 
   * @param entity_max_count  最大实体数量
   */
  init(root, entity_max_count = 1024) {
    let old = this.__world;
    if (old) {
      old.clearAll();
      old.destroy();
    }
    this.__world = new ECSWorld(entity_max_count);
    this.__world_root = root;
  }
  /**
   * 进入关卡
   * @param mode          玩法模式
   * @param mode_data     玩法数据
   */
  enter(mode, ...mode_data) {
    let old = this.__mode;
    if (old) {
      old.destroy();
      this.world.clearAll();
    }
    this.__mode = mode;
    this.__mode.level = this;
    this.__mode.on(Event.COMPLETE, this.__enterComplete, this);
    this.__mode.init(...mode_data);
  }
  __enterComplete(e) {
    this.__mode.off(Event.COMPLETE, this.__enterComplete, this);
    this.__entered = true;
  }
  /**
   * 关卡心跳统一接口
   * @param dt 
   */
  tick(dt) {
    if (this.__entered) {
      this.__world.tick(dt);
      this.__mode.tick(dt);
    }
  }
  /**
   * 退出关卡
   */
  exit() {
    this.__entered = false;
    this.__world.clearAll();
    this.__mode.destroy();
    this.__mode = null;
    this.status.clear();
  }
  /**
   * 根节点
   */
  get root() {
    return this.__world_root;
  }
  /**
   * 世界
   */
  get world() {
    return this.__world;
  }
  /**
   * 模式
   */
  get mode() {
    return this.__mode;
  }
  /**
   * 状态(用于记录一下对于关卡中的一些"全局"状态信息)")
   */
  get status() {
    return this.__status;
  }
};

// src/levels/LevelManager.ts
import { TickerManager as TickerManager2 } from "dream-cc-core";
var LevelManager = class _LevelManager {
  constructor() {
    this.__levels = /* @__PURE__ */ new Map();
    TickerManager2.addTicker(this);
  }
  /**
   * 初始化关卡
   * @param key 
   * @param root 
   * @param max_count 
   */
  initLevel(key, root, max_count = 1024) {
    if (this.__levels.has(key)) {
      throw new Error(`\u5173\u5361[${key}]\u5DF2\u5B58\u5728`);
    }
    let level = new Level();
    level.key = key;
    level.init(root, max_count);
    this.__levels.set(key, level);
    return level;
  }
  /**
   * 关卡是否存在
   * @param key 
   * @returns 
   */
  hasLevel(key) {
    return this.__levels.has(key);
  }
  /**
   * 获取关卡实例
   * @param key 
   * @returns 
   */
  getLevel(key) {
    return this.__levels.get(key);
  }
  /**
   * 进入关卡
   * @param key 
   * @param mode 
   * @param data 
   */
  enter(key, mode, ...data) {
    if (!this.__levels.has(key)) {
      throw new Error(`\u5173\u5361[${key}]\u4E0D\u5B58\u5728`);
    }
    let level = this.__levels.get(key);
    level.enter(mode, ...data);
  }
  /**
   * 心跳
   * @param dt 
   */
  tick(dt) {
    let elements = this.__levels.values();
    for (const element of elements) {
      element.tick(dt);
    }
  }
  /**
   * 退出关卡
   * @param key 
   */
  exit(key) {
    if (!this.__levels.has(key)) {
      throw new Error(`\u5173\u5361[${key}]\u4E0D\u5B58\u5728`);
    }
    let level = this.__levels.get(key);
    level.exit();
  }
  /**
   * 销毁关卡
   * @param key 
   */
  destroy(key) {
    if (!this.__levels.has(key)) {
      throw new Error(`\u5173\u5361[${key}]\u4E0D\u5B58\u5728`);
    }
    let level = this.__levels.get(key);
    level.destroy();
    this.__levels.delete(key);
  }
  /**
   * 单例
   */
  static get single() {
    if (this.__instance == null) {
      this.__instance = new _LevelManager();
    }
    return this.__instance;
  }
};

// src/levels/LevelMode.ts
import { Event as Event2, EventDispatcher as EventDispatcher2, Res } from "dream-cc-core";
var LevelMode = class extends EventDispatcher2 {
  constructor() {
    super();
    this.reqeust = null;
    /**初始化完成 */
    this.$inited = false;
    this.__scripts = /* @__PURE__ */ new Map();
  }
  /**
   * 数据
   */
  get data() {
    return this.$data;
  }
  /**
   * 初始化数据
   */
  get initData() {
    return this.$initData;
  }
  /**
   * 初始化
   */
  init(...arg) {
    this.$initData = arg;
    let urls = [];
    if (this.configs && this.configs.length > 0) {
      for (let index = 0; index < this.configs.length; index++) {
        const element = this.configs[index];
        const url = Res.sheet2URL(element);
        urls.push(url);
      }
    }
    if (urls.length <= 0) {
      this.$init();
    } else {
      this.reqeust = Res.create(
        urls,
        "LevelMode",
        (progress) => {
          this.emit(Event2.PROGRESS, "LevelMode", void 0, progress * 0.7);
        },
        (err) => {
          if (err) {
            this.reqeust.dispose();
            this.reqeust = null;
            this.emit(Event2.ERROR, "LevelMode", err);
            return;
          }
          this.$init();
        }
      );
      this.reqeust.load();
    }
  }
  /**
   * 初始化,如果不调用super.$init的话，请在完成初始化后调用$initComplete()方法。
   */
  $init() {
    this.$initComplete();
  }
  /**
   * 初始化完成
   */
  $initComplete() {
    for (const element of this.__scripts.values()) {
      element.init();
    }
    this.$inited = true;
    this.emit(Event2.COMPLETE);
  }
  /**
   * 心跳
   * @param dt 
   */
  tick(dt) {
    if (this.$inited) {
      this.__scripts.forEach((value, key) => {
        value.tick(dt);
      });
    }
  }
  /**
   * 添加脚本
   * @param type 
   */
  addScript(type) {
    if (type == null) {
      return null;
    }
    if (this.__scripts.has(type)) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0\u811A\u672C:" + type);
    }
    let value = new type();
    value.mode = this;
    this.__scripts.set(type, value);
    return value;
  }
  /**
   * 删除脚本
   * @param type 
   * @returns 
   */
  removeScript(type) {
    if (!this.__scripts.has(type)) {
      throw new Error("\u811A\u672C\u4E0D\u5B58\u5728!");
    }
    let result = this.__scripts.get(type);
    result.mode = null;
    this.__scripts.delete(type);
    return result;
  }
  /**
   * 移除所有脚本
   */
  removeAllScript() {
    this.__scripts.forEach((value) => {
      value.destroy();
    });
    this.__scripts.clear();
  }
  /**
   * 获取脚本
   * @param type 
   * @returns 
   */
  getScript(type) {
    if (!this.__scripts.has(type)) {
      return null;
    }
    return this.__scripts.get(type);
  }
  destroy() {
    if (super.destroy()) {
      if (this.configs) {
        this.configs.splice(0, this.configs.length);
        this.configs = null;
      }
      if (this.__scripts) {
        this.__scripts.forEach((value) => {
          value.destroy();
        });
        this.__scripts = null;
      }
      if (this.reqeust) {
        this.reqeust.dispose();
        this.reqeust = null;
      }
      return true;
    }
    return false;
  }
  /**
   * 世界
   */
  get world() {
    return this.level.world;
  }
  /**
   * 根节点
   */
  get root() {
    return this.level.root;
  }
};

// src/levels/LevelModeScript.ts
var LevelModeScript = class {
  constructor() {
  }
  tick(dt) {
  }
  /**
   * 世界
   */
  get world() {
    return this.mode.world;
  }
};
export {
  AddToParentQueueSystem,
  AddToParentSystem,
  CampComponent,
  DataComponent,
  DisplayComponent,
  DisplaySystem,
  ECSComponent,
  ECSMatcher,
  ECSStorage,
  ECSSystem,
  ECSWorld,
  GraphicsComponent,
  Level,
  LevelManager,
  LevelMode,
  LevelModeScript,
  LevelStatus,
  LinkComponent,
  LinkSystem,
  MatcherAllOf,
  MatcherAnyOf,
  MatcherNoneOf,
  ParentComponent,
  RendererRoot2DComponent,
  SizeComponent,
  SparseSet,
  TransformComponent
};
//# sourceMappingURL=dream-cc-ecs.mjs.map
