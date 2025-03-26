// src/utils/Injector.ts
var Injector = class {
  /**
   * 注入
   * @param key 
   * @param clazz   类型或实例
   */
  static inject(customKey, clazz) {
    if (clazz instanceof Function) {
      this.__injectedMap.set(customKey, clazz);
    } else {
      this.__instanceMap.set(customKey, clazz);
    }
  }
  /**
   * 获取已注入的类型实例
   */
  static getInject(customKey) {
    let instance = this.__instanceMap.get(customKey);
    if (instance) {
      return instance;
    }
    let clazz = this.__injectedMap.get(customKey);
    if (clazz === void 0) {
      return null;
    }
    instance = new clazz();
    this.__instanceMap.set(customKey, instance);
    return instance;
  }
};
/**类型字典*/
Injector.__injectedMap = /* @__PURE__ */ new Map();
/**实例字典*/
Injector.__instanceMap = /* @__PURE__ */ new Map();

// src/audios/AudioManagerImpl.ts
import { director, find, Node as Node3 } from "cc";

// src/audios/AudioChannelImpl.ts
import { AudioSource } from "cc";

// src/res/resources/ResImpl.ts
import { assetManager as assetManager3, SpriteFrame, Texture2D } from "cc";

// src/res/loaders/CCLoader.ts
import { assetManager as assetManager2 } from "cc";

// src/ticker/TickerManagerImpl.ts
var TickerManagerImpl = class {
  constructor() {
    this.__tickerList = [];
    this.__nextFrameCallBacks = [];
  }
  tick(dt) {
    let handler;
    while (this.__nextFrameCallBacks.length) {
      handler = this.__nextFrameCallBacks.shift();
      handler.callBack.apply(handler.caller);
    }
    for (let index = 0; index < this.__tickerList.length; index++) {
      const element = this.__tickerList[index];
      element.tick(dt);
    }
  }
  addTicker(value) {
    let index = this.__tickerList.indexOf(value);
    if (index >= 0) {
      throw new Error("Ticker \u91CD\u590D\u6DFB\u52A0\uFF01");
    }
    this.__tickerList.push(value);
  }
  removeTicker(value) {
    let index = this.__tickerList.indexOf(value);
    if (index < 0) {
      throw new Error("\u627E\u4E0D\u5230\u8981\u5220\u9664\u7684Tick!");
    }
    this.__tickerList.splice(index, 1);
  }
  callNextFrame(value, caller) {
    for (let index = 0; index < this.__nextFrameCallBacks.length; index++) {
      const element = this.__nextFrameCallBacks[index];
      if (element.equal(value, caller)) {
        return;
      }
    }
    this.__nextFrameCallBacks.push(new NextFrameHandler(value, caller));
  }
  clearNextFrame(value, caller) {
    for (let index = 0; index < this.__nextFrameCallBacks.length; index++) {
      const element = this.__nextFrameCallBacks[index];
      if (element.equal(value, caller)) {
        this.__nextFrameCallBacks.splice(index, 1);
      }
    }
  }
};
var NextFrameHandler = class {
  constructor(callBack, caller) {
    this.callBack = callBack;
    this.caller = caller;
  }
  equal(callBack, caller) {
    if (this.caller !== caller) {
      return false;
    }
    if (this.callBack !== callBack) {
      return false;
    }
    return true;
  }
};

// src/ticker/TickerManager.ts
var TickerManager = class {
  /**
   * 心跳驱动接口
   * @param dt 
   */
  static tick(dt) {
    this.impl.tick(dt);
  }
  /**
   * 添加一个心跳驱动
   * @param value 
   */
  static addTicker(value) {
    this.impl.addTicker(value);
  }
  /**
   * 删除一个心跳驱动
   * @param value 
   */
  static removeTicker(value) {
    this.impl.removeTicker(value);
  }
  /**
   * 下一帧回调
   * @param value 
   * @param caller 
   */
  static callNextFrame(value, caller) {
    this.impl.callNextFrame(value, caller);
  }
  /**
   * 清理下一帧回调请求(如果存在的话)
   * @param value
   * @param value 
   * @param caller 
   */
  static clearNextFrame(value, caller) {
    this.impl.clearNextFrame(value, caller);
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new TickerManagerImpl();
    }
    return this.__impl;
  }
};
TickerManager.KEY = "TickerManager";

// src/pools/PoolImpl.ts
var PoolImpl = class {
  constructor(classType, max = 1e3, min = 0) {
    /**最大对象数 */
    this.__max = 0;
    this.__class = classType;
    this.__max = max;
    this.__using = /* @__PURE__ */ new Set();
    this.__free = /* @__PURE__ */ new Set();
    for (let i = 0; i < min; i++) {
      this.__free.add(new this.__class());
    }
  }
  /**
   * 销毁对象池中的所有对象并释放资源
   *
   * @returns 返回一个布尔值，表示销毁操作是否成功
   */
  destroy() {
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
  acquire() {
    let item;
    if (this.__free.size > 0) {
      const iterator = this.__free.values();
      item = iterator.next().value;
      this.__free.delete(item);
    } else {
      if (this.size >= this.__max) {
        throw new Error("\u5BF9\u8C61\u6C60\u5DF2\u6EE1");
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
  release(item) {
    item.reset();
    this.__using.delete(item);
    this.__free.add(item);
  }
  /**
   * 释放所有正在使用的资源
   */
  releaseAll() {
    if (this.__using.size === 0) {
      return;
    }
    this.__using.forEach((item) => {
      this.release(item);
    });
    this.__using.clear();
  }
  get using() {
    return this.__using;
  }
  /**
   * 获取当前正在使用的数量
   */
  get usingCount() {
    return this.__using.size;
  }
  /**
   * 获取空闲计数器的值
   */
  get freeCount() {
    return this.__free.size;
  }
  /**
   * 对象池当前的大小（已创建对象的数量）
   */
  get size() {
    return this.freeCount + this.usingCount;
  }
};

// src/pools/Pool.ts
var Pool = class {
  /**
   * 从对象池中获取一个实例
   *
   * @param clazz 类的构造函数，该类需要实现 IPoolable 接口
   * @returns 返回从对象池中获取的实例
   */
  static acquire(clazz) {
    let pool = this.pools.get(clazz);
    if (!pool) {
      this.pools.set(clazz, new PoolImpl(clazz, 1e3, 0));
      return this.acquire(clazz);
    }
    return pool.acquire();
  }
  /**
   * 释放对象到指定类型的对象池中
   *
   * @param clazz 对象类型，必须实现 IPoolable 接口
   * @param item 要释放的对象
   * @throws 如果对象池不存在，则抛出错误
   */
  static release(clazz, item) {
    let pool = this.pools.get(clazz);
    if (pool) {
      pool.release(item);
    } else {
      throw new Error("\u5BF9\u8C61\u6C60\u4E0D\u5B58\u5728");
    }
  }
  /**
   * 获取指定类的所有正在使用的对象
   * @param type 
   * @param result 
   * @returns 
   */
  static getUsing(type, result) {
    result = result || [];
    if (!this.pools.has(type)) {
      return [];
    }
    let pool = this.pools.get(type);
    result.push(...pool.using);
    return result;
  }
  /**
   * 释放指定类的所有对象
   *
   * @param clazz 类构造函数，需要实现 IPoolable 接口
   * @throws Error 如果对象池不存在，则抛出错误
   */
  static releaseAll(clazz) {
    let pool = this.pools.get(clazz);
    if (pool) {
      pool.releaseAll();
    } else {
      throw new Error("\u5BF9\u8C61\u6C60\u4E0D\u5B58\u5728");
    }
  }
  /**
   * 销毁指定类的对象池
   *
   * @param clazz 需要销毁对象池的类
   * @throws Error 如果对象池不存在，则抛出错误
   */
  static destroy(clazz) {
    let pool = this.pools.get(clazz);
    if (pool) {
      pool.destroy();
      this.pools.delete(clazz);
    } else {
      throw new Error("\u5BF9\u8C61\u6C60\u4E0D\u5B58\u5728");
    }
  }
  static logStatus() {
    console.log("\u5404\u5BF9\u8C61\u6C60\u7684\u72B6\u6001\uFF1A");
    this.pools.forEach((pool, clazz) => {
      console.log(`\u7C7B\u540D: ${clazz.name}`);
      console.log(`  \u5DF2\u4F7F\u7528\u5BF9\u8C61\u6570\u91CF: ${pool.usingCount}`);
      console.log(`  \u7A7A\u95F2\u5BF9\u8C61\u6570\u91CF: ${pool.freeCount}`);
    });
  }
};
/**
 * 对象池的集合
 */
Pool.pools = /* @__PURE__ */ new Map();

// src/events/Event.ts
var _Event = class _Event {
  constructor() {
    /**
     * 进入百分比(0-1)
     */
    this.progress = 0;
    /**
     * 事件是否停止
     */
    this.propagationStopped = false;
  }
  /**
   * 初始化
   * @param type 
   * @param taraget
   * @param data 
   * @param err 
   * @param progress 
   */
  init(type, taraget, data, err, progress = 0) {
    this.type = type;
    this.target = taraget;
    this.data = data;
    this.error = err;
    this.progress = progress;
  }
  reset() {
    this.type = void 0;
    this.target = void 0;
    this.data = null;
    this.error = void 0;
    this.progress = 0;
  }
  destroy() {
    this.reset();
    return true;
  }
  release() {
    Pool.release(_Event, this);
  }
  /**
   * 创建事件对象
   * @param type
   * @param target
   * @param data 
   * @param err 
   * @param progress 
   * @returns 
   */
  static create(type, target, data, err, progress) {
    let result = Pool.acquire(_Event);
    result.init(type, target, data, err, progress);
    return result;
  }
};
_Event.START = "START";
_Event.PROGRESS = "PROGRESS";
_Event.COMPLETE = "COMPLETE";
_Event.ERROR = "ERROR";
_Event.SHOW = "SHOW";
_Event.HIDE = "HIDE";
_Event.ADD = "ADD";
_Event.REMOVE = "REMOVE";
_Event.UPDATE = "UPDATE";
_Event.CLEAR = "CLEAR";
_Event.STATE_CHANGED = "STATE_CHANGED";
_Event.VALUE_CHANGED = "VALUE_CHANGED";
_Event.ADD_CHILD = "ADD_CHILD";
_Event.REMOVE_CHILD = "REMOVE_CHILD";
_Event.CHILD_VALUE_CHANGED = "CHILD_VALUE_CHANGED";
var Event = _Event;

// src/events/EventListener.ts
var EventListener = class {
  constructor(type, handler, caller, priority = 255) {
    /**
     * 事件优先级，默认为255
     */
    this.priority = 255;
    this.type = type;
    this.caller = caller;
    this.handler = handler;
    this.priority = priority;
  }
  reset() {
    this.type = void 0;
    this.caller = void 0;
    this.handler = void 0;
    this.priority = 255;
  }
  destroy() {
    this.reset();
    return true;
  }
  equal(target) {
    if (this.type === target.type && this.caller === target.caller && this.handler === target.handler) {
      return true;
    }
    return false;
  }
  equals(type, handler, caller) {
    if (this.type === type && this.handler === handler && this.caller === caller) {
      return true;
    }
    return false;
  }
};

// src/events/EventDispatcher.ts
var _EventDispatcher = class _EventDispatcher {
  constructor(target) {
    /**
     * 事件是否异步处理
     */
    this.eventAync = false;
    /**
     * 需要派发的事件
     */
    this.__needEmit = [];
    this.__emitHelp = [];
    this.__target = target ? target : this;
    this.__listeners = /* @__PURE__ */ new Map();
    this.__callers = /* @__PURE__ */ new Map();
  }
  /**
   * 添加事件监听
   * @param type      事件类型
   * @param handler   事件回调函数
   * @param caller    回调函数this指针
   * @param priority  优先级
   */
  on(type, handler, caller, priority) {
    let listeners = this.__listeners.get(type);
    if (!listeners) {
      listeners = [];
      this.__listeners.set(type, listeners);
    }
    for (const element of listeners) {
      if (element.equals(type, handler, caller)) {
        throw new Error(`\u91CD\u590D\u6DFB\u52A0\u4E8B\u4EF6\u76D1\u542C\uFF1A${type} ${handler} ${caller}`);
      }
    }
    const listener = new EventListener(type, handler, caller, priority);
    listeners.push(listener);
    listeners.sort((a, b) => a.priority - b.priority);
    let callerListeners = this.__callers.get(caller);
    if (!callerListeners) {
      callerListeners = [];
      this.__callers.set(caller, callerListeners);
    }
    callerListeners.push(listener);
  }
  /**
   * 删除事件监听
   * @param type      事件类型
   * @param handler   事件回调函数
   * @param caller    回调函数this指针
   * @returns 
   */
  off(type, handler, caller) {
    let listeners = this.__listeners.get(type);
    if (!listeners) {
      return;
    }
    let index = listeners.findIndex((element) => element.equals(type, handler, caller));
    if (index < 0) {
      return;
    }
    listeners.splice(index, 1);
    let callerListeners = this.__callers.get(caller);
    if (!callerListeners) {
      return;
    }
    index = callerListeners.findIndex((element) => element.equals(type, handler, caller));
    if (index < 0) {
      return;
    }
    callerListeners.splice(index, 1);
  }
  /**
   * 删除指定对象所有的事件监听
   * @param caller    
   * @returns 
   */
  offByCaller(caller) {
    let callerListeners = this.__callers.get(caller);
    if (!callerListeners) {
      return;
    }
    while (callerListeners.length > 0) {
      let listener = callerListeners[0];
      this.off(listener.type, listener.handler, listener.caller);
    }
  }
  /**
   * 删除所有事件监听
   */
  offAllEvent() {
    this.__listeners.forEach((list) => {
      list.forEach((element) => {
        element.destroy();
      });
    });
    this.__listeners.clear();
    this.__callers.clear();
  }
  /**
   * 派发事件
   * @param type 
   * @param data 
   * @param err 
   * @param progress 
   * @param url 
   * @returns 
   */
  emit(type, data, err, progress) {
    if (!this.__listeners.has(type)) {
      return;
    }
    const event = Event.create(type, this.__target, data, err, progress);
    this.__needEmit.push(event);
    if (this.eventAync) {
      TickerManager.callNextFrame(this.__emit, this);
    } else {
      this.__emit();
    }
  }
  __emit() {
    this.__emitHelp.push(...this.__needEmit);
    this.__needEmit.splice(0, this.__needEmit.length);
    for (let index = 0; index < this.__emitHelp.length; index++) {
      const event = this.__emitHelp[index];
      if (this.hasEvent(event.type) && event.propagationStopped == false) {
        let list = this.__listeners.get(event.type);
        let listener;
        for (let index2 = 0; index2 < list.length; index2++) {
          listener = list[index2];
          if (event.propagationStopped) {
            break;
          }
          listener.handler.apply(listener.caller, [event]);
        }
      }
      event.release();
    }
    this.__emitHelp.splice(0, this.__emitHelp.length);
  }
  hasEvent(type) {
    return this.__listeners.has(type);
  }
  hasEventHandler(type, handler, caller) {
    if (this.__listeners.has(type) == false) {
      return false;
    }
    let infoList = this.__listeners.get(type);
    let info;
    for (let index = 0; index < infoList.length; index++) {
      info = infoList[index];
      if (info.equals(type, handler, caller)) {
        return true;
      }
    }
    return false;
  }
  destroy() {
    if (this.eventAync) {
      TickerManager.clearNextFrame(this.__emit, this);
    }
    this.__needEmit.splice(0, this.__needEmit.length);
    this.__needEmit = void 0;
    this.__listeners.clear();
    this.__listeners = void 0;
    this.__callers.clear();
    this.__callers = void 0;
    this.__target = void 0;
    return true;
  }
};
/**
 * 全局事件派发起
 */
_EventDispatcher.Main = new _EventDispatcher();
var EventDispatcher = _EventDispatcher;

// src/datas/Dictionary.ts
var Dictionary = class extends EventDispatcher {
  constructor() {
    super();
    this.__map = /* @__PURE__ */ new Map();
    this.__list = [];
  }
  /**
   * 设置
   * @param key 
   * @param value 
   */
  set(key, value) {
    let old;
    if (this.__map.has(key)) {
      old = this.__map.get(key);
      const index = this.__list.indexOf(old);
      if (index < 0) {
        throw new Error("Dictionary\u5185\u90E8\u903B\u8F91\u9519\u8BEF\uFF01");
      }
      this.__map.delete(key);
      this.__list.splice(index, 1);
      this.emit(Event.REMOVE, old);
    }
    this.__map.set(key, value);
    this.__list.push(value);
    this.emit(Event.ADD, value);
  }
  /**
   * 是否拥有指定KEY的元素
   * @param key 
   * @returns 
   */
  has(key) {
    return this.__map.has(key);
  }
  /**
   * 获取指定元素
   * @param key 
   * @returns 
   */
  get(key) {
    return this.__map.get(key);
  }
  /**
   * 通过索引获取元素
   * @param index 
   * @returns 
   */
  getValue(index) {
    if (index >= this.__list.length) {
      throw new Error(index + "\u7D22\u5F15\u8D85\u51FA0-" + this.__list.length + "\u8303\u56F4");
    }
    return this.__list[index];
  }
  /**
   * 删除指定元素
   * @param key 
   * @returns 
   */
  delete(key) {
    if (!this.__map.has(key)) {
      return void 0;
    }
    const result = this.__map.get(key);
    const index = this.__list.indexOf(result);
    if (index < 0) {
      throw new Error("Dictionary\u5185\u90E8\u903B\u8F91\u9519\u8BEF\uFF01");
    }
    this.__list.splice(index, 1);
    this.__map.delete(key);
    if (this.hasEvent(Event.REMOVE)) {
      this.emit(Event.REMOVE, result);
    }
    return result;
  }
  /**
   * 清除所有元素
   */
  clear() {
    this.__map.clear();
    this.__list.length = 0;
  }
  getKeys(result) {
    result = result || [];
    for (const iterator of this.__map.keys()) {
      result.push(iterator);
    }
    return result;
  }
  /**
  * 元素列表
  */
  get elements() {
    return this.__list;
  }
  get size() {
    return this.__map.size;
  }
  destroy() {
    if (super.destroy()) {
      this.__map.clear();
      this.__map = void 0;
      this.__list = void 0;
      return true;
    }
    return false;
  }
};

// src/timer/TimerImpl.ts
import { game } from "cc";
var TimerImpl = class {
  constructor() {
    this.__currentTime = 0;
    this.__deltaTime = 0;
    this.__startTime = 0;
    this.reset();
    TickerManager.addTicker(this);
  }
  reset(time) {
    if (time) {
      this.__currentTime = time;
    } else {
      this.__currentTime = game.totalTime;
    }
    this.__startTime = this.__currentTime;
  }
  tick(dt) {
    this.__deltaTime = dt;
    this.__currentTime += dt;
  }
  get currentTime() {
    return this.__currentTime;
  }
  get absTime() {
    return this.__startTime + game.totalTime;
  }
  get deltaTime() {
    return this.__deltaTime;
  }
};

// src/timer/Timer.ts
var Timer = class {
  /**
   * 服务器时间(毫秒)
   */
  static get serverTime() {
    let d = this.currentTime - this.__lastTime;
    if (d) {
      this.__serverTime += d;
    }
    return this.__serverTime;
  }
  /**
   * 当前时间(毫秒)
   */
  static get currentTime() {
    return this.impl.currentTime;
  }
  /**
   * 绝对时间(毫秒),注意效率较差，不推荐使用！
   */
  static get absTime() {
    return this.impl.absTime;
  }
  /**
   * 重新校准
   * @param time  时间起点，如果不设置则获取系统当前时间点
   */
  static reset(time) {
    this.impl.reset(time);
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new TimerImpl();
    }
    return this.__impl;
  }
};
Timer.KEY = "Timer";
Timer.__serverTime = 0;
Timer.__lastTime = 0;

// src/res/resources/ResourceManagerImpl.ts
var ResourceManagerImpl = class {
  constructor() {
    /**
     * 资源
     */
    this.__resDic = new Dictionary();
    /**
     * 等待销毁的资源
     */
    this._waitDestroy = [];
    this.__lastTime = 0;
    TickerManager.addTicker(this);
  }
  tick(dt) {
    if (!ResourceManager.AUTO_GC) {
      return;
    }
    let currentTime = Timer.currentTime;
    let d = currentTime - this.__lastTime;
    if (d < ResourceManager.GC_CHECK_TIME) {
      return;
    }
    this.__lastTime = currentTime;
    this.gc();
  }
  addRes(value) {
    if (this.__resDic.has(value.key)) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0\u8D44\u6E90\uFF01");
    }
    this.__resDic.set(value.key, value);
    this._waitDestroy.push(value);
    value.lastOpTime = Timer.currentTime;
  }
  hasRes(key) {
    return this.__resDic.has(key);
  }
  getRes(key) {
    return this.__resDic.get(key);
  }
  addRef(key, refKey) {
    if (!this.__resDic.has(key)) {
      throw new Error("\u672A\u627E\u5230\u8D44\u6E90\uFF1A" + key);
    }
    let res = this.__resDic.get(key);
    let index = this._waitDestroy.indexOf(res);
    if (index >= 0) {
      this._waitDestroy.splice(index, 1);
    }
    res.lastOpTime = Timer.currentTime;
    return res.addRef(refKey);
  }
  removeRef(value) {
    if (!this.__resDic.has(value.key)) {
      throw new Error("\u672A\u627E\u5230\u8D44\u6E90\uFF1A" + value.key);
    }
    let res = this.__resDic.get(value.key);
    res.removeRef(value);
    if (res.refLength == 0) {
      this._waitDestroy.push(res);
    }
    res.lastOpTime = Timer.currentTime;
  }
  gc(ignoreTime) {
    let res;
    let currentTime = Timer.currentTime;
    for (let index = 0; index < this._waitDestroy.length; index++) {
      res = this._waitDestroy[index];
      if (res.refCount > 0) {
        continue;
      }
      if (ignoreTime == true) {
        this._waitDestroy.splice(index, 1);
        this.destroyRes(res);
        index--;
      } else if (currentTime - res.lastOpTime > ResourceManager.GC_TIME) {
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
  destroyRes(value) {
    this.__resDic.delete(value.key);
    value.destroy();
  }
  get resList() {
    return this.__resDic.elements;
  }
};

// src/res/resources/ResourceManager.ts
var ResourceManager = class {
  /**
   * 添加一个资源
   * @param value
   */
  static addRes(value) {
    this.impl.addRes(value);
  }
  /**
   * 是否包含该资源
   * @param key 
   */
  static hasRes(key) {
    return this.impl.hasRes(key);
  }
  /**
   * 获取资源（内部接口）
   * @param key 
   * @returns 
   */
  static getRes(key) {
    return this.impl.getRes(key);
  }
  /**
   * 添加并返回一个资源引用
   * @param key 
   * @param refKey 
   */
  static addRef(key, refKey) {
    return this.impl.addRef(key, refKey);
  }
  /**
   * 删除一个资源引用
   * @param value 
   */
  static removeRef(value) {
    return this.impl.removeRef(value);
  }
  /**
   * 资源清理
   */
  static gc(ignoreTime) {
    return this.impl.gc(ignoreTime);
  }
  /**
   * 资源列表
   * @returns 
   */
  static get resList() {
    return this.impl.resList;
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new ResourceManagerImpl();
    }
    return this.__impl;
  }
};
ResourceManager.KEY = "ResourceManager";
/**
 * GC检查时间间隔(毫秒)
 */
ResourceManager.GC_CHECK_TIME = 5e3;
/**
 * 资源保留长时间(毫秒)GC
 */
ResourceManager.GC_TIME = 15e3;
/**
 * 自动清理
 */
ResourceManager.AUTO_GC = true;

// src/res/resources/Resource.ts
import { Asset, assetManager, instantiate, isValid, Prefab } from "cc";

// src/loggers/LoggerImpl.ts
var LoggerImpl = class {
  constructor() {
    this.__logs = new Dictionary();
    this.__showed = /* @__PURE__ */ new Map();
    this.__saves = /* @__PURE__ */ new Map();
    this.__showed.set(Logger.TYPE.ALL, true);
    this.__saves.set(Logger.TYPE.ALL, false);
  }
  /**
   * 设置显示过滤
   * @param key 
   * @param isOpen 
   */
  show(key, isOpen) {
    this.__showed.set(key, isOpen);
  }
  /**
   * 设置保存过滤
   * @param key 
   * @param isSave 
   */
  save(key, isSave) {
    this.__saves.set(key, isSave);
  }
  /**
   * 获取已保存的日志
   * @param type 
   * @returns 
   */
  getLogs(type) {
    if (type == void 0 || type == null) {
      type = Logger.TYPE.ALL;
    }
    if (this.__logs.has(type)) {
      return this.__logs.get(type);
    }
    return void 0;
  }
  __save(type, logType, msg) {
    let data = "[" + type.toUpperCase() + "]" + logType + ": " + msg;
    let list;
    if (this.__saves.has(type)) {
      if (!this.__logs.has(type)) {
        list = [];
        this.__logs.set(type, list);
      } else {
        list = this.__logs.get(type);
      }
      if (list.length >= Logger.MaxCount) {
        list.unshift();
      }
      list.push(data);
    }
    if (!this.__logs.has(Logger.TYPE.ALL)) {
      list = [];
      this.__logs.set(Logger.TYPE.ALL, list);
    } else {
      list = this.__logs.get(Logger.TYPE.ALL);
    }
    if (list.length >= Logger.MaxCount) {
      list.unshift();
    }
    list.push(data);
    return data;
  }
  isShow(type) {
    let isAll = this.__showed.has(Logger.TYPE.ALL) ? this.__showed.get(Logger.TYPE.ALL) : false;
    let isOpen = this.__showed.has(type) ? this.__showed.get(type) : false;
    return isAll || isOpen;
  }
  log(msg, type) {
    type = type || Logger.TYPE.ALL;
    let data = this.__save(type, "Log", msg);
    if (this.isShow(type)) {
      console.log(data);
    }
  }
  error(msg, type) {
    type = type || Logger.TYPE.ALL;
    let data = this.__save(type, "Error", msg);
    if (this.isShow(type)) {
      console.error(data);
    }
  }
  warn(msg, type) {
    type = type || Logger.TYPE.ALL;
    let data = this.__save(type, "Warn", msg);
    if (this.isShow(type)) {
      console.warn(data);
    }
  }
  info(msg, type) {
    type = type || Logger.TYPE.ALL;
    let data = this.__save(type, "Info", msg);
    if (this.isShow(type)) {
      console.info(data);
    }
  }
};

// src/loggers/Logger.ts
var LogType = /* @__PURE__ */ ((LogType2) => {
  LogType2["ALL"] = "all";
  LogType2["NET"] = "net";
  LogType2["RES"] = "res";
  LogType2["Module"] = "module";
  return LogType2;
})(LogType || {});
var Logger = class {
  /**
   * 设置显示过滤
   * @param key 
   * @param isOpen 
   */
  static show(type, isOpen) {
    this.impl.show(type, isOpen);
  }
  /**
   * 设置保存过滤
   * @param type 
   * @param isSave 
   */
  static save(type, isSave) {
    this.impl.save(type, isSave);
  }
  /**
   * 获取已保存的日志
   * @param type 
   * @returns 
   */
  static getLogs(type) {
    return this.impl.getLogs(type);
  }
  static log(msg, type) {
    this.impl.log(msg, type);
  }
  static error(msg, type) {
    this.impl.error(msg, type);
  }
  static warn(msg, type) {
    this.impl.warn(msg, type);
  }
  static info(msg, type) {
    this.impl.info(msg, type);
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new LoggerImpl();
    }
    return this.__impl;
  }
};
/**
 * 日志类型
 */
Logger.TYPE = LogType;
Logger.KEY = "Logger";
/**
 * 最大保存条数
 */
Logger.MaxCount = 1e3;

// src/res/ResRef.ts
var ResRef = class {
  constructor() {
    /**
     * 资源全局唯一KEY
     */
    this.key = "";
    /**
     * 谁引用的
     */
    this.refKey = "";
    this.__isDisposed = false;
  }
  reset() {
    this.key = "";
    this.refKey = "";
    this.content = null;
    this.__isDisposed = false;
  }
  /**
   * 是否已经释放
   */
  get isDisposed() {
    return this.__isDisposed;
  }
  /**
   * 释放
   */
  dispose() {
    if (this.__isDisposed) {
      throw new Error("\u91CD\u590D\u91CA\u653E\u8D44\u6E90\u5F15\u7528");
    }
    this.__isDisposed = true;
  }
  /**
   * 彻底销毁(内部接口，请勿调用)
   */
  destroy() {
    this.reset();
    return true;
  }
};

// src/res/resources/Resource.ts
var Resource = class {
  constructor() {
    /**
     * 最后操作的时间电
     */
    this.lastOpTime = 0;
    this.__refList = [];
  }
  addRef(refKey) {
    let ref = Pool.acquire(ResRef);
    ref.key = this.key;
    ref.refKey = refKey ? refKey : "";
    if (this.content instanceof Asset) {
      if (this.content instanceof Prefab) {
        ref.content = instantiate(this.content);
      } else {
        ref.content = this.content;
      }
      this.content.addRef();
    } else {
      ref.content = this.content;
    }
    this.__refList.push(ref);
    return ref;
  }
  removeRef(value) {
    let index = this.__refList.indexOf(value);
    if (index == -1) {
      throw new Error("\u8D44\u6E90\u5F15\u7528\u4E0D\u5B58\u5728");
    }
    if (this.content instanceof Asset) {
      if (this.content instanceof Prefab) {
        let node = value.content;
        if (isValid(node)) {
          node.destroy();
        }
      }
      this.content.decRef();
    }
    this.__refList.splice(index, 1);
    Pool.release(ResRef, value);
  }
  destroy() {
    if (this.refCount > 0 || this.refLength > 0) {
      throw new Error("\u53D1\u73B0\u9500\u6BC1\u8D44\u6E90\u65F6\u5F15\u7528\u6570\u91CF\u4E0D\u4E3A0");
    }
    if (this.content instanceof Asset) {
      this.content.decRef();
      if (this.content.refCount <= 0) {
        Logger.log("ReleaseAsset=>" + this.key, Logger.TYPE.RES);
        assetManager.releaseAsset(this.content);
      }
    } else {
      Logger.log("DestroyAsset=>" + this.key, Logger.TYPE.RES);
      if (this.content["destroy"]) {
        this.content["destroy"]();
      }
    }
    this.key = void 0;
    this.__refList = void 0;
    this.content = void 0;
    return true;
  }
  /**
   * 资源引用列表
   */
  get refList() {
    return this.__refList;
  }
  /**
   * 引用数量
   */
  get refCount() {
    if (this.content instanceof Asset) {
      return this.content.refCount - 1;
    }
    return this.__refList.length;
  }
  /**
   * 引用列表长度
   */
  get refLength() {
    return this.__refList.length;
  }
};

// src/res/loaders/CCLoader.ts
var CCLoader = class extends EventDispatcher {
  constructor() {
    super();
  }
  reset() {
    this.__url = void 0;
    this.offAllEvent();
  }
  load(url) {
    this.__url = url;
    if (!this.__url) {
      throw new Error("url is null");
    }
    if (typeof this.__url == "string") {
      assetManager2.loadRemote(
        this.__url,
        (err, asset) => {
          if (err) {
            this.emit(Event.ERROR, this.__url, err);
            return;
          }
          const urlKey = Res.url2Key(url);
          let res = new Resource();
          res.key = urlKey;
          res.content = asset;
          ResourceManager.addRes(res);
          this.emit(Event.COMPLETE, url);
        }
      );
    } else {
      let bundle = assetManager2.getBundle(this.__url.bundle);
      if (!bundle) {
        assetManager2.loadBundle(
          this.__url.bundle,
          (err, bundle2) => {
            if (err) {
              this.emit(Event.ERROR, this.__url, err);
              return;
            }
            this.__load(this.__url, bundle2);
          }
        );
      } else {
        this.__load(this.__url, bundle);
      }
    }
  }
  __load(url, bundle) {
    if (typeof url == "string") {
      throw new Error("\u672A\u5B9E\u73B0\uFF01");
    }
    let urlStr = Res.url2Path(url);
    bundle.load(
      urlStr,
      url.type,
      (finished, total) => {
        const progress = finished / total;
        this.emit(Event.PROGRESS, this.__url, void 0, progress);
      },
      (err, asset) => {
        if (err) {
          this.emit(Event.ERROR, url, err);
          return;
        }
        const urlKey = Res.url2Key(url);
        let res = new Resource();
        res.key = urlKey;
        res.content = asset;
        ResourceManager.addRes(res);
        this.emit(Event.COMPLETE, url);
      }
    );
  }
};

// src/res/loaders/LoaderQueue.ts
var LoaderQueue = class _LoaderQueue {
  constructor() {
    /**
     * 加载中
     */
    this.running = new Dictionary();
    /**
     * 等待加载
     */
    this.waiting = new Dictionary();
    /**
     * 对象池
     */
    this.pool = /* @__PURE__ */ new Map();
    TickerManager.addTicker(this);
  }
  tick(dt) {
    while (this.running.size < Res.MAX_LOADER_THREAD && this.waiting.size > 0) {
      const url = this.waiting.elements[0];
      const urlKey = Res.url2Key(url);
      this.waiting.delete(urlKey);
      this.__load(url, urlKey);
    }
  }
  __load(url, urlKey) {
    let loader;
    let loaderClass;
    let type;
    if (typeof url == "string") {
      type = "string";
    } else {
      type = url.type;
    }
    let list = this.pool.get(type);
    if (list == null) {
      list = [];
      this.pool.set(type, list);
    }
    if (list.length > 0) {
      loader = list.shift();
    } else {
      if (typeof url == "string") {
        loaderClass = Res.getLoader("string");
      } else {
        loaderClass = Res.getLoader(url.type);
      }
      loader = new loaderClass();
    }
    if (loader != null) {
      this.running.set(urlKey, loader);
      this.__addEvent(loader);
      Logger.log("Start Load:" + Res.url2Key(url), Logger.TYPE.RES);
      loader.load(url);
    }
  }
  __addEvent(target) {
    target.on(Event.COMPLETE, this.__eventHandler, this);
    target.on(Event.ERROR, this.__eventHandler, this);
    target.on(Event.PROGRESS, this.__eventHandler, this);
  }
  __eventHandler(evt) {
    let target = evt.target;
    if (evt.type == Event.PROGRESS) {
      LoaderManager.childProgress(evt.data, evt.progress);
      return;
    }
    target.offAllEvent();
    this.running.delete(Res.url2Key(evt.data));
    if (evt.type == Event.ERROR) {
      Logger.log("Load Error:" + Res.url2Key(evt.data) + " e: " + evt.error.message, Logger.TYPE.RES);
      LoaderManager.childError(evt.data, evt.error);
      return;
    }
    if (evt.type == Event.COMPLETE) {
      Logger.log("Load Complete:" + Res.url2Key(evt.data), Logger.TYPE.RES);
      LoaderManager.childComplete(evt.data);
      target.reset();
      let type;
      if (typeof evt.data == "string") {
        type = "string";
      } else {
        type = evt.data.type;
      }
      let list = this.pool.get(type);
      if (list == null) {
        list = [];
        this.pool.set(type, list);
      }
      list.push(target);
    }
  }
  load(url) {
    const urlKey = Res.url2Key(url);
    if (typeof url != "string" && url.isSub) {
      if (this.waiting.has(urlKey)) {
        this.waiting.delete(urlKey);
      }
      if (!this.running.has(urlKey)) {
        this.__load(url, urlKey);
      }
      return;
    }
    if (this.waiting.has(urlKey)) {
      return;
    }
    if (this.running.has(urlKey)) {
      return;
    }
    this.waiting.set(urlKey, url);
  }
  static get single() {
    if (_LoaderQueue.__instance == null) {
      _LoaderQueue.__instance = new _LoaderQueue();
    }
    return _LoaderQueue.__instance;
  }
};

// src/res/loaders/LoaderManagerImpl.ts
var LoaderManagerImpl = class {
  constructor() {
    this.__requests = /* @__PURE__ */ new Map();
  }
  /**
   * 加载
   * @param url 
   * @param refKey 
   * @param cb 
   * @param progress 
   * @returns 
   */
  load(request) {
    if (request.urls.length == 0) {
      console.error("urls is empty!");
      return;
    }
    this.__addReqeuset(request);
    for (let index = 0; index < request.urls.length; index++) {
      const url = request.urls[index];
      const urlKey = Res.url2Key(url);
      if (ResourceManager.hasRes(urlKey)) {
        this.childComplete(url);
      } else {
        LoaderQueue.single.load(url);
      }
    }
  }
  /**
   * 卸载
   * @param request 
   */
  unload(request) {
    this.__deleteReqeuset(request);
  }
  childComplete(url) {
    const urlKey = Res.url2Key(url);
    let list = this.__requests.get(urlKey);
    if (list) {
      for (let index = 0; index < list.length; index++) {
        const request = list[index];
        request.childComplete(url);
      }
      list.splice(0, list.length);
    }
    this.__requests.delete(urlKey);
  }
  childError(url, err) {
    const urlKey = Res.url2Key(url);
    let rlist = this.__requests.get(urlKey);
    if (rlist) {
      let list = rlist.concat();
      for (let index = 0; index < list.length; index++) {
        const request = list[index];
        request.childError(err);
        this.__deleteReqeuset(request);
      }
    }
    this.__requests.delete(urlKey);
  }
  childProgress(url, progress) {
    const urlKey = Res.url2Key(url);
    let list = this.__requests.get(urlKey);
    if (list) {
      for (let index = 0; index < list.length; index++) {
        const request = list[index];
        request.childProgress(url, progress);
      }
    }
  }
  /**
   * 添加
   * @param request 
   */
  __addReqeuset(request) {
    let list;
    for (let index = 0; index < request.urls.length; index++) {
      const url = request.urls[index];
      const urlKey = Res.url2Key(url);
      if (this.__requests.has(urlKey)) {
        list = this.__requests.get(urlKey);
      } else {
        list = [];
        this.__requests.set(urlKey, list);
      }
      list.push(request);
    }
  }
  /**
   * 删除
   * @param request 
   */
  __deleteReqeuset(request) {
    if (!request.urls || request.urls.length == 0) return;
    let list;
    let findex = 0;
    for (let i = 0; i < request.urls.length; i++) {
      const url = request.urls[i];
      const urlKey = Res.url2Key(url);
      if (!this.__requests.has(urlKey)) {
        continue;
      }
      list = this.__requests.get(urlKey);
      if (!list || list.length == 0) {
        continue;
      }
      findex = list.indexOf(request);
      if (findex >= 0) {
        list.splice(findex, 1);
      }
    }
  }
};

// src/res/loaders/LoaderManager.ts
var LoaderManager = class {
  /**
   * 加载资源
   * @param reqeust 
   */
  static load(reqeust) {
    this.impl.load(reqeust);
  }
  /**
   * 卸载
   * @param request 
   */
  static unload(request) {
    this.impl.unload(request);
  }
  static childComplete(url) {
    this.impl.childComplete(url);
  }
  static childError(url, err) {
    this.impl.childError(url, err);
  }
  static childProgress(url, progress) {
    this.impl.childProgress(url, progress);
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new LoaderManagerImpl();
    }
    return this.__impl;
  }
};
LoaderManager.KEY = "LoaderManager";

// src/res/ResRequest.ts
var ResRequest = class _ResRequest {
  constructor() {
    /**
     * 状态
     */
    this.state = 3 /* POOL */;
    /**
     * 引用KEY
     */
    this.refKey = "";
    this.helpMap = /* @__PURE__ */ new Map();
    this.urls = [];
    this.__resRefs = [];
    this.__loaded = /* @__PURE__ */ new Map();
    this.__loadProgress = /* @__PURE__ */ new Map();
  }
  init(url, refKey, progress, cb) {
    if (Array.isArray(url)) {
      this.urls = url;
    } else {
      this.urls = [url];
    }
    this.urls = this.removeDuplicates(this.urls);
    this.cb = cb;
    this.refKey = refKey;
    this.progress = progress;
  }
  load() {
    this.state = 2 /* LOADING */;
    LoaderManager.load(this);
  }
  childComplete(resURL) {
    const urlKey = Res.url2Key(resURL);
    this.__loaded.set(urlKey, true);
    this.checkComplete();
  }
  childProgress(resURL, progress) {
    const urlKey = Res.url2Key(resURL);
    this.__loadProgress.set(urlKey, progress);
    this.updateProgress();
  }
  childError(err) {
    this.state = 0 /* ERROR */;
    if (this.cb) {
      this.cb(err);
    }
  }
  updateProgress() {
    let loaded = this.getLoaded();
    let progress = loaded / this.urls.length;
    if (this.progress) {
      this.progress(progress);
    }
  }
  checkComplete() {
    let loaded = this.__loaded.size;
    let progress = loaded / this.urls.length;
    if (progress >= 1 && this.cb != null) {
      this.state = 1 /* SUCCESS */;
      for (let index = 0; index < this.urls.length; index++) {
        const url = this.urls[index];
        const urlKey = Res.url2Key(url);
        const ref = ResourceManager.addRef(urlKey, this.refKey);
        this.__resRefs.push(ref);
      }
      this.cb();
    }
  }
  getLoaded() {
    let loaded = 0;
    for (let value of this.__loadProgress.values()) {
      loaded += value;
    }
    return loaded;
  }
  reset() {
    this.state = 3 /* POOL */;
    if (this.__resRefs) {
      for (let index = 0; index < this.__resRefs.length; index++) {
        const ref = this.__resRefs[index];
        ref.dispose();
      }
      this.__resRefs.splice(0, this.__resRefs.length);
    }
    this.__loaded.clear();
    this.__loadProgress.clear();
    this.urls = [];
    this.cb = void 0;
    this.progress = void 0;
  }
  destroy() {
    this.reset();
    this.__resRefs.splice(0, this.__resRefs.length);
    this.__loaded.clear();
    this.__loadProgress.clear();
    return true;
  }
  /**
   * 释放
   */
  dispose() {
    if (this.state == 2 /* LOADING */) {
      LoaderManager.unload(this);
    }
    Pool.release(_ResRequest, this);
  }
  /**
   * 获取资源引用
   * @returns 
   */
  getRef() {
    return this.__resRefs[0];
  }
  /**
   * 获取资源引用列表
   * @returns 
   */
  getRefList() {
    return this.__resRefs;
  }
  /**
   * 获取资源引用映射表
   * @param result 
   * @returns 
   */
  getRefMap(result) {
    result = result || /* @__PURE__ */ new Map();
    for (let index = 0; index < this.__resRefs.length; index++) {
      const ref = this.__resRefs[index];
      result.set(ref.key, ref);
    }
    return result;
  }
  /**
   * 去重
   * @param urls 
   * @returns 
   */
  removeDuplicates(urls) {
    this.helpMap.clear();
    let result = [];
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index];
      const urlKey = Res.url2Key(url);
      if (this.helpMap.has(urlKey)) {
        continue;
      } else {
        this.helpMap.set(urlKey, true);
        result.push(url);
      }
    }
    return result;
  }
};

// src/utils/ClassUtils.ts
var ClassUtils = class {
  /**
   * 获取单词指定位置单词
   * @param str 
   * @param n 
   * @returns 
   */
  static getWord(str, n) {
    if (Array.isArray(n) && n.length > 0) {
      let arr = [];
      for (let i of n) {
        arr.push(this.getWord(str, i).toString());
      }
      return arr;
    } else {
      const m = str.match(new RegExp("^(?:\\w+\\W+){" + n + "}(\\w+)"));
      if (m) {
        return m[1];
      }
      return "";
    }
  }
  static getContractName(code) {
    const words = this.getWord(code, [0, 1, 2]);
    if (words[0] === "abstract") {
      return words[2];
    }
    return words[1];
  }
  static getFunctionName(code) {
    const words = this.getWord(code, [0, 1]);
    if (words[0] === "constructor") {
      return words[0];
    }
    return words[1];
  }
  static getClassName(value) {
    let className;
    if (typeof value != "string") {
      className = value.toString();
      if (className.startsWith("function")) {
        return this.getFunctionName(className);
      } else {
        return this.getContractName(className);
      }
    } else {
      className = value;
    }
    return className;
  }
};

// src/res/resources/ResImpl.ts
var ResImpl = class {
  constructor() {
    /**
     * 资源类型映射
     */
    this.__assetTypes = /* @__PURE__ */ new Map();
    this.loaderClass = /* @__PURE__ */ new Map();
  }
  url2Key(url) {
    if (url == null || url == void 0) {
      return "";
    }
    if (typeof url == "string") {
      return url;
    }
    let ul;
    if (url.type == SpriteFrame) {
      ul = url.url + "/spriteFrame";
    } else if (url.type == Texture2D) {
      ul = url.url + "/texture";
    } else {
      ul = url.url;
    }
    return ul + "|" + url.bundle + "|" + this.getAndSaveClassName(url.type);
  }
  key2Url(key) {
    if (key.indexOf("|")) {
      let arr = key.split("|");
      return { url: this.path2Key(arr[0]), bundle: arr[1], type: this.getAssetType(arr[2]) };
    }
    return key;
  }
  url2Path(url) {
    if (typeof url == "string") {
      return url;
    }
    if (url.type == Texture2D) {
      return url.url + "/texture";
    }
    if (url.type == SpriteFrame) {
      return url.url + "/spriteFrame";
    }
    return url.url;
  }
  urlEqual(a, b) {
    if (a == b) return true;
    if (a == null || b == null) return false;
    if (typeof a == "string" && typeof b == "string") {
      return a == b;
    }
    if (typeof a == "string" || typeof b == "string") {
      return false;
    }
    if (a.url == b.url && a.type == b.type && a.bundle == b.bundle) {
      return true;
    }
    return false;
  }
  getAssetType(key) {
    if (!this.__assetTypes.has(key)) {
      throw new Error("\u672A\u627E\u5230\u5BF9\u5E94\u8D44\u6E90\u7C7B\u578B\uFF1A" + key);
    }
    return this.__assetTypes.get(key);
  }
  getAndSaveClassName(clazz) {
    let className = ClassUtils.getClassName(clazz);
    if (!this.__assetTypes.has(className)) {
      this.__assetTypes.set(className, clazz);
    }
    return className;
  }
  path2Key(key) {
    let len = key.length;
    let end = len - 8;
    let t = key.substring(end);
    if (t === "/texture") {
      return key.substring(0, end);
    }
    end = len - 12;
    t = key.substring(end);
    if (t === "/spriteFrame") {
      return key.substring(0, end);
    }
    return key;
  }
  setLoader(key, loader) {
    let className = ClassUtils.getClassName(key);
    this.loaderClass.set(className, loader);
  }
  getLoader(key) {
    let className = ClassUtils.getClassName(key);
    if (!this.loaderClass.has(className)) {
      return CCLoader;
    }
    return this.loaderClass.get(className);
  }
  create(url, refKey, progress, cb) {
    let reqeust = Pool.acquire(ResRequest);
    reqeust.init(url, refKey, progress, cb);
    return reqeust;
  }
  loadAssetBundles(names) {
    let list = [];
    if (typeof names == "string") {
      list.push(names);
    } else {
      list.push(...names);
    }
    let abs = [];
    for (let index = 0; index < list.length; index++) {
      const bundle_name = list[index];
      let bundle = assetManager3.getBundle(bundle_name);
      if (!bundle && abs.indexOf(bundle_name) == -1) {
        abs.push(bundle_name);
      }
    }
    let loaded = 0;
    let total = abs.length;
    let result = new Promise(
      (resolve, reject) => {
        for (let index = 0; index < abs.length; index++) {
          const bundle_name = abs[index];
          assetManager3.loadBundle(bundle_name, (err, bundle) => {
            if (err) {
              reject(err);
              return;
            }
            loaded++;
            if (loaded == total) {
              resolve();
            }
          });
        }
      }
    );
    return result;
  }
};

// src/res/Res.ts
var ResType = /* @__PURE__ */ ((ResType2) => {
  ResType2["FGUI"] = "fgui";
  ResType2["CONFIG"] = "config";
  return ResType2;
})(ResType || {});
var Res = class {
  /**
   * key转url
   * @param key 
   * @returns 
   */
  static key2Url(key) {
    return this.impl.key2Url(key);
  }
  /**
   * url转key
   * @param url 
   * @returns 
   */
  static url2Key(url) {
    return this.impl.url2Key(url);
  }
  /**
  * url转资源路径
  * @param url
  */
  static url2Path(url) {
    return this.impl.url2Path(url);
  }
  /**
   * url是否相同
   * @param a 
   * @param b 
   */
  static urlEqual(a, b) {
    return this.impl.urlEqual(a, b);
  }
  /**
   * 设置资源加载器
   * @param key 
   * @param loader 
   */
  static setLoader(key, loader) {
    this.impl.setLoader(key, loader);
  }
  /**
   * 获取资源加载器
   * @param key 
   * @returns 
   */
  static getLoader(key) {
    return this.impl.getLoader(key);
  }
  /**
   * 创建资源请求
   * @param url 
   * @param refKey 
   * @param progress 
   * @param cb 
   * @returns 
   */
  static create(url, refKey, progress, cb) {
    return this.impl.create(url, refKey, progress, cb);
  }
  /**
   * 加载AssetBundle
   * @param names 
   * @returns 
   */
  static loadAssetBundles(names) {
    return this.impl.loadAssetBundles(names);
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new ResImpl();
    }
    return this.__impl;
  }
};
Res.KEY = "Res";
/**
 * 默认资源类型
 */
Res.TYPE = ResType;
/**
 * 资源加载最大线程数
 */
Res.MAX_LOADER_THREAD = 5;

// src/audios/AudioChannelImpl.ts
var AudioChannelImpl = class {
  constructor(node, source) {
    this.__reqeust = null;
    if (source == null) {
      source = node.addComponent(AudioSource);
    }
    this.__node = node;
    this.__source = source;
  }
  get url() {
    return this.__url;
  }
  get mute() {
    return this.__mute;
  }
  set mute(value) {
    if (this.__mute == value) {
      return;
    }
    this.__mute = value;
    if (this.__mute) {
      this.__volume = this.__source.volume;
      this.__source.volume = 0;
    } else {
      this.__source.volume = this.__volume;
    }
  }
  play(url, playedComplete, volume, fade, loop = false, speed = 1) {
    this.__reset();
    this.__url = url;
    this.__playedComplete = playedComplete;
    this.__isPlaying = true;
    this.__speed = speed;
    this.__loop = loop;
    if (fade) {
      if (fade.time <= 0) {
        if (this.mute) {
          this.__volume = volume;
        } else {
          this.__source.volume = volume;
        }
      }
      if (this.__fadeData == null) {
        this.__fadeData = new FadeData();
      }
      this.__fadeData.startTime = Timer.currentTime;
      this.__fadeData.startValue = fade.startVolume == void 0 ? this.__source.volume : fade.startVolume;
      this.__fadeData.time = fade.time;
      this.__fadeData.endValue = volume;
      this.__fadeData.complete = fade.complete;
      this.__fadeData.completeStop = fade.completeStop;
      this.__volume = this.__fadeData.startValue;
    } else {
      this.__volume = volume;
    }
    this.__startTime = Timer.currentTime;
    this.__time = Number.MAX_VALUE;
    if (this.__reqeust) {
      this.__reqeust.dispose();
      this.__reqeust = null;
    }
    this.__reqeust = Res.create(
      this.url,
      "AudioChannel",
      void 0,
      (err) => {
        if (err) {
          this.__reqeust.dispose();
          this.__reqeust = null;
          Logger.error(err, Logger.TYPE.RES);
          this.__isPlaying = false;
          this.__source.stop();
          return;
        }
        if (this.__isPlaying == false) {
          return;
        }
        this.__play();
      }
    );
    this.__reqeust.load();
  }
  stop() {
    if (this.__source.playing) {
      this.__source.stop();
    }
    this.__isPlaying = false;
    this.__reset();
  }
  get isPlaying() {
    return this.__isPlaying || this.__source.playing;
  }
  /**
   * 
   * @param time 
   * @param endVolume 
   * @param startVolume 
   * @param complete 
   * @param completeStop 
   * @returns 
   */
  fade(time, endVolume, startVolume, complete, completeStop) {
    if (!this.isPlaying) {
      return;
    }
    this.__paused = false;
    if (time <= 0) {
      if (this.mute) {
        this.__volume = endVolume;
      } else {
        this.__source.volume = endVolume;
      }
      if (completeStop) {
        this.stop();
        if (complete) {
          complete();
        }
      }
    } else {
      if (this.__fadeData == null) {
        this.__fadeData = new FadeData();
      }
      this.__fadeData.startTime = Timer.currentTime;
      this.__fadeData.startValue = startVolume == void 0 ? this.__source.volume : startVolume;
      this.__fadeData.time = time;
      this.__fadeData.endValue = endVolume;
      this.__fadeData.complete = complete;
      this.__fadeData.completeStop = completeStop;
    }
  }
  __reset() {
    this.__url = null;
    if (this.__reqeust) {
      this.__reqeust.dispose();
      this.__reqeust = null;
    }
    this.__isPlaying = false;
    this.__paused = false;
    this.__fadeData = null;
  }
  // private __clipLoaded(err: Error | null, result: ResRef): void {
  //     if (err) {
  //         if (Logger.isDebug("Core")) {
  //             console.error(err.message);
  //         }
  //         this.__isPlaying = false;
  //         this.__source.stop();
  //         return;
  //     }
  //     if (this.__isPlaying == false) {
  //         result.dispose();
  //         return;
  //     }
  //     let resKey: string = Res.url2Key(this.url);
  //     if (resKey != result.key) {
  //         result.dispose();
  //         return;
  //     }
  //     this.__ref = result;
  //     this.__play();
  // }
  __play() {
    this.__source.clip = this.__reqeust.getRef().content;
    this.__source.loop = this.__loop;
    this.__source.play();
    let currentTime = Timer.currentTime;
    if (this.__fadeData) {
      this.__fadeData.startTime = currentTime;
      if (this.mute) {
        this.__volume = this.__fadeData.startValue;
      } else {
        this.__source.volume = this.__fadeData.startValue;
      }
    } else {
      if (!this.mute) {
        this.__source.volume = this.__volume;
      } else {
        this.__source.volume = 0;
      }
    }
    this.__startTime = Timer.currentTime;
    this.__time = this.__source.duration * 1e3;
  }
  tick(dt) {
    if (this.__paused || this.__isPlaying == false || this.__url == null) {
      return;
    }
    let currentTime = Timer.currentTime;
    let passTime;
    if (this.__fadeData) {
      passTime = currentTime - this.__fadeData.startTime;
      let value2 = passTime / this.__fadeData.time;
      value2 = value2 > 1 ? 1 : value2;
      if (!this.mute) {
        this.__source.volume = this.__fadeData.startValue + (this.__fadeData.endValue - this.__fadeData.startValue) * value2;
      } else {
        this.__volume = this.__fadeData.startValue + (this.__fadeData.endValue - this.__fadeData.startValue) * value2;
      }
      if (value2 == 1) {
        let complete = this.__fadeData.complete;
        if (this.__fadeData.completeStop) {
          this.__source.stop();
          this.__isPlaying = false;
          this.__reset();
        }
        if (complete) {
          complete();
        }
        this.__fadeData = null;
      }
    }
    if (this.__loop) {
      return;
    }
    passTime = currentTime - this.__startTime;
    let value = passTime / this.__time;
    if (value >= 1) {
      this.__source.stop();
      this.__isPlaying = false;
      if (this.__playedComplete) {
        this.__playedComplete();
      }
      this.__reset();
    }
  }
  resume() {
    if (this.__paused == false) {
      return;
    }
    let pTime = Timer.currentTime - this.__pauseTime;
    if (this.__fadeData) {
      this.__fadeData.startTime += pTime;
    }
    this.__startTime += pTime;
    this.__source.play();
    this.__paused = false;
  }
  pause() {
    if (this.__paused) {
      return;
    }
    this.__paused = true;
    this.__pauseTime = Timer.currentTime;
    this.__source.pause();
  }
  get curVolume() {
    return this.__source.volume;
  }
};
var FadeData = class {
};

// src/audios/AudioManagerImpl.ts
var AudioManagerImpl = class {
  constructor() {
    this.__musicChannelIndex = 0;
    this.__volume = 1;
    this.__musicVolume = 1;
    this.__musicChannels = [];
    this.__soundChannels = [];
    TickerManager.addTicker(this);
    this.__audioRoot = find("AudioManager");
    if (this.__audioRoot == null) {
      this.__audioRoot = new Node3("AudioManager");
      director.getScene().addChild(this.__audioRoot);
    }
    let channel;
    for (let index = 0; index < 2; index++) {
      channel = new AudioChannelImpl(this.__audioRoot);
      this.__musicChannels.push(channel);
    }
  }
  /**
   * 总音量
   */
  get volume() {
    return this.__volume;
  }
  set volume(value) {
    if (this.__volume == value) {
      return;
    }
    this.__volume = value;
    let channelVolume;
    let channel;
    for (let index = 0; index < this.__musicChannels.length; index++) {
      channel = this.__musicChannels[index];
      if (channel.isPlaying) {
        channelVolume = channel.volume * this.__musicVolume * this.__volume;
        channel.fade(100, channelVolume, channel.curVolume);
      }
    }
    for (let index = 0; index < this.__soundChannels.length; index++) {
      channel = this.__soundChannels[index];
      if (channel.isPlaying) {
        channelVolume = channel.volume * this.__soundVolume * this.__volume;
        channel.fade(100, channelVolume, channel.curVolume);
      }
    }
  }
  /**
   * 音乐总音量控制
   */
  set musicVolume(value) {
    if (this.__musicVolume == value) {
      return;
    }
    this.__musicVolume = value;
    if (this.muteMusic) {
      return;
    }
    let current = this.__musicChannels[this.__musicChannelIndex];
    if (current && current.isPlaying) {
      let channelVolume = current.volume * this.__musicVolume * this.__volume;
      current.fade(100, channelVolume, current.curVolume);
    }
  }
  get musicVolume() {
    return this.__musicVolume;
  }
  /**
   * 声音总音量
   */
  get soundVolume() {
    return this.__soundVolume;
  }
  set soundVolume(value) {
    if (this.__soundVolume == value) {
      return;
    }
    this.__soundVolume = value;
    let channel;
    for (let index = 0; index < this.__soundChannels.length; index++) {
      channel = this.__soundChannels[index];
      if (channel.isPlaying) {
        let channelVolume = channel.volume * this.__soundVolume * this.__volume;
        channel.fade(100, channelVolume, channel.curVolume);
      }
    }
  }
  set mute(value) {
    if (this.__mute == value) {
      return;
    }
    this.__mute = value;
    this.__changedMutes();
  }
  get mute() {
    return this.__mute;
  }
  get muteMusic() {
    return this.__muteMusic;
  }
  set muteMusic(value) {
    if (this.__muteMusic == value) {
      return;
    }
    this.__muteMusic = value;
    this.__changedMutes();
  }
  get muteSound() {
    return this.__muteSound;
  }
  set muteSound(value) {
    if (this.__muteSound == value) {
      return;
    }
    this.__muteSound = value;
    this.__changedMutes();
  }
  __changedMutes() {
    for (let index = 0; index < this.__musicChannels.length; index++) {
      const element = this.__musicChannels[index];
      element.mute = this.muteMusic || this.mute;
    }
    for (let index = 0; index < this.__soundChannels.length; index++) {
      const element = this.__soundChannels[index];
      element.mute = this.muteSound || this.mute;
      ;
    }
  }
  playMusic(url, volume, speed) {
    let playVolume;
    if (this.muteMusic || this.mute) {
      playVolume = 0;
    } else {
      playVolume = volume * this.__musicVolume * this.__volume;
    }
    let current = this.__musicChannels[this.__musicChannelIndex];
    if (current && current.isPlaying) {
      if (Res.urlEqual(current.url, url)) {
        return;
      }
    }
    this.__musicChannelIndex++;
    this.__musicChannelIndex = this.__musicChannelIndex % 2;
    let last;
    if (this.__musicChannelIndex == 0) {
      current = this.__musicChannels[0];
      last = this.__musicChannels[1];
    } else {
      current = this.__musicChannels[1];
      last = this.__musicChannels[0];
    }
    if (last.isPlaying) {
      last.fade(500, 0, void 0, null, true);
    }
    current.volume = volume;
    current.play(url, null, playVolume, { time: 500, startVolume: 0 }, true, speed);
  }
  stopMusic() {
    let current = this.__musicChannels[this.__musicChannelIndex];
    if (current && current.isPlaying) {
      current.stop();
    }
  }
  pauseMusic() {
    let current = this.__musicChannels[this.__musicChannelIndex];
    if (current) {
      current.pause();
    }
  }
  resumeMusic() {
    let current = this.__musicChannels[this.__musicChannelIndex];
    if (current) {
      current.resume();
    }
  }
  playSound(url, playedCallBack, volume, speed, loop) {
    let playVolume;
    if (this.muteSound || this.mute) {
      playVolume = 0;
    } else {
      playVolume = this.soundVolume * volume * this.__volume;
    }
    let channel = this.GetIdleChannel();
    if (channel) {
      channel.volume = volume;
      channel.play(url, playedCallBack, playVolume, null, loop, speed);
    }
  }
  getPlaying(url) {
    for (let index = 0; index < this.__soundChannels.length; index++) {
      const element = this.__soundChannels[index];
      if (element.isPlaying && Res.urlEqual(element.url, url)) {
        return element;
      }
    }
    return null;
  }
  GetIdleChannel() {
    let index;
    let channel;
    for (index = 0; index < this.__soundChannels.length; index++) {
      channel = this.__soundChannels[index];
      if (channel.isPlaying == false) {
        return channel;
      }
    }
    if (index < AudioManager.MAX_SOUND_CHANNEL_COUNT) {
      channel = new AudioChannelImpl(this.__audioRoot);
      this.__soundChannels.push(channel);
      return channel;
    }
    return null;
  }
  tick(dt) {
    for (let index = 0; index < this.__musicChannels.length; index++) {
      const element = this.__musicChannels[index];
      if (element.isPlaying) {
        element.tick(dt);
      }
    }
    for (let index = 0; index < this.__soundChannels.length; index++) {
      const element = this.__soundChannels[index];
      if (element.isPlaying) {
        element.tick(dt);
      }
    }
  }
};

// src/audios/AudioManager.ts
var AudioManager = class {
  /**
   * 总音量
   */
  static get volume() {
    return this.impl.volume;
  }
  static set volume(value) {
    this.impl.volume = value;
  }
  /**
   * 音乐音量
   */
  static get musicVolume() {
    return this.impl.musicVolume;
  }
  static set musicVolume(value) {
    this.impl.musicVolume = value;
  }
  /**
   * 声音音量
   */
  static get soundVolume() {
    return this.impl.soundVolume;
  }
  static set soundVolume(value) {
    this.impl.soundVolume = value;
  }
  /**
   * 静音总开关
   */
  static get mute() {
    return this.impl.mute;
  }
  static set mute(value) {
    this.impl.mute = value;
  }
  /**
   * 音乐静音开关
   */
  static get muteMusic() {
    return this.impl.muteMusic;
  }
  static set muteMusic(value) {
    this.impl.muteMusic = value;
  }
  /**
   * 声音静音开关
   */
  static get muteSound() {
    return this.impl.muteSound;
  }
  static set muteSound(value) {
    this.impl.muteSound = value;
  }
  /**
   * 播放音乐
   * @param value
   */
  static playMusic(url, volume = 1, speed = 1) {
    this.impl.playMusic(url, volume, speed);
  }
  /**
   * 停止音乐
   */
  static stopMusic() {
    this.impl.stopMusic();
  }
  /**
   * 暂停
   */
  static pauseMusic() {
    this.impl.pauseMusic();
  }
  /**
   * 继续播放
   */
  static resumeMusic() {
    this.impl.resumeMusic();
  }
  /**
   * 播放声音
   * @param value
   */
  static playSound(url, playedCallBack, volume = 1, speed = 1, loop = false) {
    this.impl.playSound(url, playedCallBack, volume, speed, loop);
  }
  /**
   * 获取正在播放指定音频的轨道
   * @param url
   */
  static getPlaying(url) {
    return this.impl.getPlaying(url);
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new AudioManagerImpl();
    }
    return this.__impl;
  }
};
/**
 * 全局唯一注入KEY
 */
AudioManager.KEY = "AudioManager";
/**
 * 最大音频轨道数量
 */
AudioManager.MAX_SOUND_CHANNEL_COUNT = 30;

// src/bindings/FunctionHook.ts
var FunctionHookInfo = class {
  equal(functionName, preHandler, laterHandler) {
    if (this.functionName != functionName) {
      return false;
    }
    if (preHandler && !preHandler.equal(this.preHandler)) {
      return false;
    }
    if (laterHandler && !laterHandler.equal(this.laterHandler)) {
      return false;
    }
    return true;
  }
};
var FunctionHook = class {
  constructor(data) {
    this.data = data;
    this.__functions = [];
    this.__preHandlerMap = /* @__PURE__ */ new Map();
    this.__laterHandlerMap = /* @__PURE__ */ new Map();
    this.__groupMap = /* @__PURE__ */ new Map();
  }
  /**
   * 添加钩子
   * @param group
   * @param functionName 
   * @param preHandlers 
   * @param laterHandlers 
   */
  addHook(group, functionName, preHandler, laterHandler) {
    let groupList = this.__groupMap.get(group);
    if (!groupList) {
      groupList = [];
      this.__groupMap.set(group, groupList);
    }
    for (let index = 0; index < groupList.length; index++) {
      const element = groupList[index];
      if (element.equal(functionName, preHandler, laterHandler)) {
        return;
      }
    }
    let info = new FunctionHookInfo();
    info.functionName = functionName;
    info.preHandler = preHandler;
    info.laterHandler = laterHandler;
    groupList.push(info);
    let self = this;
    if (this.__functions.indexOf(functionName) < 0) {
      let oldFun = this.data[functionName];
      if (!oldFun) {
        throw new Error("\u65B9\u6CD5\u4E0D\u5B58\u5728\uFF01");
      }
      let pres2 = this.__preHandlerMap.get(functionName);
      if (!pres2) {
        pres2 = [];
        this.__preHandlerMap.set(functionName, pres2);
      }
      let laters2 = this.__laterHandlerMap.get(functionName);
      if (!laters2) {
        laters2 = [];
        this.__laterHandlerMap.set(functionName, laters2);
      }
      let newFun = function(...arg) {
        if (pres2 && pres2.length) {
          for (let index = 0; index < pres2.length; index++) {
            const element = pres2[index];
            element && element.run(arg);
          }
        }
        oldFun.apply(self.data, arg);
        if (laters2 && laters2.length) {
          for (let index = 0; index < laters2.length; index++) {
            const element = laters2[index];
            element && element.run(arg);
          }
        }
      };
      this.data[functionName] = newFun;
      this.data["old_" + functionName] = oldFun;
      this.__functions.push(functionName);
    }
    let pres = this.__preHandlerMap.get(functionName);
    if (!pres) {
      pres = [];
      this.__preHandlerMap.set(functionName, pres);
    }
    if (pres.indexOf(preHandler) < 0) {
      pres.push(preHandler);
    }
    let laters = this.__laterHandlerMap.get(functionName);
    if (!laters) {
      laters = [];
      this.__laterHandlerMap.set(functionName, laters);
    }
    if (laters.indexOf(laterHandler) < 0) {
      laters.push(laterHandler);
    }
  }
  /**
   * 删除钩子
   * @param group 
   * @param functionName
   * @param preHandler 
   * @param laterHandler 
   * @returns 
   */
  removeHook(group, functionName, preHandler, laterHandler) {
    let groupList = this.__groupMap.get(group);
    if (!groupList) {
      return;
    }
    let list;
    let fIndex;
    if (!functionName) {
      for (let index = 0; index < groupList.length; index++) {
        const element = groupList[index];
        if (element.preHandler) {
          list = this.__preHandlerMap.get(element.functionName);
          fIndex = list.indexOf(element.preHandler);
          if (fIndex >= 0) {
            list.splice(fIndex, 1);
          }
          if (list.length == 0) {
            this.__preHandlerMap.delete(element.functionName);
          }
        }
        if (element.laterHandler) {
          list = this.__laterHandlerMap.get(element.functionName);
          fIndex = list.indexOf(element.laterHandler);
          if (fIndex >= 0) {
            list.splice(fIndex, 1);
          }
          if (list.length == 0) {
            this.__laterHandlerMap.delete(element.functionName);
          }
        }
      }
      groupList.length = 0;
      this.__groupMap.delete(group);
      return;
    }
    for (let index = 0; index < groupList.length; index++) {
      const element = groupList[index];
      if (element.equal(functionName, preHandler, laterHandler)) {
        groupList.splice(index, 1);
        if (element.preHandler) {
          list = this.__preHandlerMap.get(functionName);
          fIndex = list.indexOf(element.preHandler);
          if (fIndex >= 0) {
            list.splice(fIndex, 1);
          }
        }
        if (element.laterHandler) {
          list = this.__laterHandlerMap.get(functionName);
          fIndex = list.indexOf(element.laterHandler);
          if (fIndex >= 0) {
            list.splice(fIndex, 1);
          }
        }
        return;
      }
    }
  }
};

// src/bindings/PropertyBinder.ts
var BindInfo = class {
  constructor(property, targetOrCallBack, tPropertyOrCaller) {
    this.property = property;
    this.targetOrCallBack = targetOrCallBack;
    this.tPropertyOrCaller = tPropertyOrCaller;
  }
  /**
   * 判断是否相等
   * @param property 
   * @param targetOrCallBack 
   * @param tPropertyOrCaller 
   * @returns 
   */
  equal(property, targetOrCallBack, tPropertyOrCaller) {
    if (property == this.property && this.targetOrCallBack == targetOrCallBack && this.tPropertyOrCaller == tPropertyOrCaller) {
      return true;
    }
    return false;
  }
};
var PropertyBinder = class {
  constructor(data) {
    this.data = data;
    this.__propertys = [];
    this.__changedPropertys = [];
    this.__bindedMap = /* @__PURE__ */ new Map();
    this.__bindedGroupMap = /* @__PURE__ */ new Map();
  }
  /**
   * 绑定
   * @param group 
   * @param property 
   * @param targetOrCallBack 
   * @param tPropertyOrCaller 
   * @returns 
   */
  bind(group, property, targetOrCallBack, tPropertyOrCaller) {
    let info;
    let groupList = this.__bindedGroupMap.get(group);
    if (!groupList) {
      groupList = [];
      this.__bindedGroupMap.set(group, groupList);
    }
    let exist = false;
    let bindInfos;
    if (Array.isArray(property)) {
      for (let pIndex = 0; pIndex < property.length; pIndex++) {
        const propertyKey = property[pIndex];
        this.__checkProperty(propertyKey);
        for (let index = 0; index < groupList.length; index++) {
          info = groupList[index];
          if (info.equal(propertyKey, targetOrCallBack, tPropertyOrCaller)) {
            exist = true;
            continue;
          }
        }
        if (!exist) {
          info = new BindInfo(propertyKey, targetOrCallBack, tPropertyOrCaller);
          bindInfos = this.__bindedMap.get(propertyKey);
          if (!bindInfos) {
            bindInfos = [];
            this.__bindedMap.set(propertyKey, bindInfos);
          }
          bindInfos.push(info);
          groupList.push(info);
          this.__propertyChanged(propertyKey);
        }
      }
    } else {
      this.__checkProperty(property);
      for (let index = 0; index < groupList.length; index++) {
        info = groupList[index];
        if (info.equal(property, targetOrCallBack, tPropertyOrCaller)) {
          return;
        }
      }
      info = new BindInfo(property, targetOrCallBack, tPropertyOrCaller);
      bindInfos = this.__bindedMap.get(property);
      if (!bindInfos) {
        bindInfos = [];
        this.__bindedMap.set(property, bindInfos);
      }
      bindInfos.push(info);
      groupList.push(info);
      this.__propertyChanged(property);
    }
  }
  /**
   * 取消绑定
   * @param group 
   * @param property 
   * @param targetOrCallBack 
   * @param tPropertyOrCaller 
   * @returns 
   */
  unbind(group, property, targetOrCallBack, tPropertyOrCaller) {
    let info;
    let groupList = this.__bindedGroupMap.get(group);
    if (!groupList) {
      return;
    }
    let bindInfos;
    let fIndex;
    if (property == null) {
      for (let index = 0; index < groupList.length; index++) {
        info = groupList[index];
        bindInfos = this.__bindedMap.get(info.property);
        if (bindInfos && bindInfos.length > 0) {
          fIndex = bindInfos.indexOf(info);
          if (fIndex >= 0) {
            bindInfos.splice(fIndex, 1);
          }
        }
        if (bindInfos.length == 0) {
          this.__bindedMap.delete(info.property);
        }
      }
      groupList.length = 0;
      this.__bindedGroupMap.delete(group);
      return;
    }
    if (Array.isArray(property)) {
      for (let pIndex = 0; pIndex < property.length; pIndex++) {
        const propertyKey = property[pIndex];
        for (let gIndex = 0; gIndex < groupList.length; gIndex++) {
          info = groupList[gIndex];
          bindInfos = this.__bindedMap.get(info.property);
          if (info.equal(propertyKey, targetOrCallBack, tPropertyOrCaller)) {
            fIndex = bindInfos.indexOf(info);
            if (fIndex >= 0) {
              bindInfos.splice(fIndex, 1);
            }
            groupList.splice(gIndex, 1);
            gIndex--;
          }
        }
      }
      if (groupList.length == 0) {
        this.__bindedGroupMap.delete(group);
      }
    } else {
      for (let gIndex = 0; gIndex < groupList.length; gIndex++) {
        info = groupList[gIndex];
        bindInfos = this.__bindedMap.get(info.property);
        if (info.equal(property, targetOrCallBack, tPropertyOrCaller)) {
          fIndex = bindInfos.indexOf(info);
          if (fIndex >= 0) {
            bindInfos.splice(fIndex, 1);
          }
          groupList.splice(gIndex, 1);
          gIndex--;
        }
      }
      if (groupList.length == 0) {
        this.__bindedGroupMap.delete(group);
      }
    }
  }
  //========================================属性绑定机制实现======================================//
  /**
  * 检测属性
  * @param propertyKey 
  */
  __checkProperty(propertyKey) {
    let index = this.__propertys.indexOf(propertyKey);
    if (index < 0) {
      let value = this.data[propertyKey];
      this.__defineReactive(this.data, propertyKey, value);
      this.__propertys.push(propertyKey);
    }
  }
  /**定义 */
  __defineReactive(data, key, value) {
    let self = this;
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },
      set: function(newValue) {
        if (value == newValue) {
          return;
        }
        value = newValue;
        self.__propertyChanged(key);
      }
    });
  }
  __propertyChanged(pKey, isInit = false) {
    if (this.__changedPropertys.indexOf(pKey) < 0) {
      this.__changedPropertys.push(pKey);
      TickerManager.callNextFrame(this.__nextFramePropertyUpdate, this);
    }
  }
  __nextFramePropertyUpdate(isInit = false) {
    let pKey;
    for (let propsIndex = 0; propsIndex < this.__changedPropertys.length; propsIndex++) {
      pKey = this.__changedPropertys[propsIndex];
      this.__updateProperty(pKey);
    }
    this.__changedPropertys.length = 0;
  }
  /**
   * 属性更新
   * @param pKey 
   */
  __updateProperty(pKey) {
    let bindInfos = this.__bindedMap.get(pKey);
    let info;
    if (bindInfos && bindInfos.length) {
      for (let index = 0; index < bindInfos.length; index++) {
        info = bindInfos[index];
        if (typeof info.targetOrCallBack != "function") {
          info.targetOrCallBack[info.tPropertyOrCaller] = this.data[pKey];
        } else {
          info.targetOrCallBack.apply(info.tPropertyOrCaller, [this.__changedPropertys]);
        }
      }
    }
  }
};

// src/bindings/Binder.ts
var Binder = class {
  constructor() {
    this.__bindRecords = [];
    this.__hookRecords = [];
    this.__eventRecords = [];
    this.inited = false;
  }
  init() {
    this.inited = true;
  }
  /**
   * 数据绑定
   * @param source 
   * @param property 
   * @param targetOrCallBack 
   * @param tPropertyKeyOrCaller 
   */
  __bind(source, property, targetOrCallBack, tPropertyKeyOrCaller) {
    for (let index = 0; index < this.__bindRecords.length; index++) {
      const element = this.__bindRecords[index];
      if (element.source == source && element.property == property && element.targetOrCallback == targetOrCallBack && element.targetPropertyOrCaller == tPropertyKeyOrCaller) {
        throw new Error("\u91CD\u590D\u7ED1\u5B9A\uFF1A" + source + property + targetOrCallBack + tPropertyKeyOrCaller);
      }
    }
    this.__bindRecords.push({
      source,
      property,
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
  __unbind(source, property, targetOrCallBack, tPropertyKeyOrCaller) {
    for (let index = 0; index < this.__bindRecords.length; index++) {
      const element = this.__bindRecords[index];
      if (element.source == source && element.property == property && element.targetOrCallback == targetOrCallBack && element.targetPropertyOrCaller == tPropertyKeyOrCaller) {
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
  __addHook(source, functionName, preHandle, laterHandler) {
    for (let index = 0; index < this.__hookRecords.length; index++) {
      const element = this.__hookRecords[index];
      if (element.source == source && element.functionName == functionName && preHandle.equal(element.preHandler) && laterHandler.equal(element.laterHandler)) {
        throw new Error("\u91CD\u590D\u7ED1\u5B9A\uFF1A" + source + " " + functionName);
      }
    }
    this.__hookRecords.push({ source, functionName, preHandler: preHandle, laterHandler });
    BinderUtils.addHook(this, source, functionName, preHandle, laterHandler);
  }
  /**
   * 删除函数钩子
   * @param source
   * @param functionName
   * @param preHandle
   * @param laterHandler
   */
  __removeHook(source, functionName, preHandle, laterHandler) {
    for (let index = 0; index < this.__hookRecords.length; index++) {
      const element = this.__hookRecords[index];
      if (element.source == source && element.functionName == functionName && preHandle.equal(element.preHandler) && laterHandler.equal(element.laterHandler)) {
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
  bindAA(source, property, target, targetProperty) {
    this.__bind(source, property, target, targetProperty);
  }
  /**
   * 取消属性和属性的绑定
   * @param source 
   * @param property 
   * @param target 
   * @param targetProperty 
   */
  unbindAA(source, property, target, targetProperty) {
    this.__unbind(source, property, target, targetProperty);
  }
  /**
   * 属性和函数的绑定
   * @param source 
   * @param property 
   * @param callBack 
   * @param caller 
   */
  bindAM(source, property, callBack, caller) {
    this.__bind(source, property, callBack, caller);
  }
  /**
   * 取消属性和函数的绑定
   * @param source 
   * @param propertys 
   * @param callBack 
   * @param caller 
   */
  unbidAM(source, propertys, callBack, caller) {
    this.__unbind(source, propertys, callBack, caller);
  }
  /**
   * 函数和函数的绑定
   * @param source        
   * @param functionName  目标函数
   * @param preHandle     该函数将在目标函数调用前调用
   * @param laterHandler  该函数将在目标函数调用后调用
   */
  bindMM(source, functionName, preHandle, laterHandler) {
    this.__addHook(source, functionName, preHandle, laterHandler);
  }
  /**
   * 取消方法和方法的绑定关系
   * @param source 
   * @param functionName 
   * @param preHandle 
   * @param laterHandler 
   */
  unbindMM(source, functionName, preHandle, laterHandler) {
    this.__removeHook(source, functionName, preHandle, laterHandler);
  }
  /**
   * 绑定事件
   * @param target 
   * @param type 
   * @param handler 
   * @param caller 
   */
  bindEvent(target, type, handler, caller) {
    for (let index = 0; index < this.__eventRecords.length; index++) {
      const element = this.__eventRecords[index];
      if (element.target == target && element.eventType == type && element.handler == handler && element.caller == caller) {
        throw new Error("\u91CD\u590D\u7ED1\u5B9AUI\u4E8B\u4EF6\uFF1A" + target + type + handler + caller);
      }
    }
    if (this.inited) {
      let on = target["on"];
      if (on && typeof on == "function") {
        target.on(type, handler, caller);
      }
      this.__eventRecords.push({ target, eventType: type, handler, caller });
    } else {
      this.__eventRecords.push({ target, eventType: type, handler, caller });
    }
  }
  /**
   * 取消事件绑定
   * @param target 
   * @param type 
   * @param handler 
   * @param caller 
   */
  unbindEvent(target, type, handler, caller) {
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
  bindByRecords() {
    for (let index = 0; index < this.__bindRecords.length; index++) {
      const element = this.__bindRecords[index];
      BinderUtils.bind(this, element.source, element.property, element.targetOrCallback, element.targetPropertyOrCaller);
    }
    for (let index = 0; index < this.__hookRecords.length; index++) {
      const element = this.__hookRecords[index];
      BinderUtils.addHook(this, element.source, element.functionName, element.preHandler, element.laterHandler);
    }
    for (let index = 0; index < this.__eventRecords.length; index++) {
      const eventInfo = this.__eventRecords[index];
      let hasEventHandler = eventInfo.target["hasEventHandler"];
      if (hasEventHandler && typeof hasEventHandler == "function") {
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
  unbindByRecords() {
    for (let index = 0; index < this.__bindRecords.length; index++) {
      const element = this.__bindRecords[index];
      BinderUtils.unbind(this, element.source, element.property, element.targetOrCallback, element.targetPropertyOrCaller);
    }
    for (let index = 0; index < this.__hookRecords.length; index++) {
      const element = this.__hookRecords[index];
      BinderUtils.removeHook(this, element.source, element.functionName, element.preHandler, element.laterHandler);
    }
    for (let index = 0; index < this.__eventRecords.length; index++) {
      const eventInfo = this.__eventRecords[index];
      eventInfo.target.off(eventInfo.eventType, eventInfo.handler, eventInfo.caller);
    }
  }
  /**
   * 销毁
   */
  destroy() {
    this.unbindByRecords();
    this.__bindRecords = null;
    this.__hookRecords = null;
    this.__eventRecords = null;
  }
};
var BinderUtils = class {
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
  static bind(group, source, property, targetOrCallBack, tPropertyOrCaller) {
    let binder = source["$PropertyBinder"];
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
  static unbind(group, source, property, targetOrCallBack, tPropertyOrCaller) {
    let binder = source["$PropertyBinder"];
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
  static addHook(group, source, functionName, preHandler, laterHandler) {
    let hook = source["$FunctionHook"];
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
  static removeHook(group, source, functionName, preHandler, laterHandler) {
    let hook = source["$FunctionHook"];
    if (!hook) {
      return;
    }
    hook.removeHook(group, functionName, preHandler, laterHandler);
  }
};

// src/configs/accessors/ConfigStorage.ts
var ConfigStorage = class {
  constructor(keys) {
    this.key = keys.join("_");
    this.keys = keys;
    this.map = /* @__PURE__ */ new Map();
  }
  save(value, sheet) {
    if (this.keys.length == 1) {
      let key = this.keys[0];
      let saveKey = value[key];
      if (this.map.has(saveKey)) {
        throw new Error(`\u914D\u7F6E\u8868${sheet}\u552F\u4E00Key\u5B58\u5728\u91CD\u590D\u5185\u5BB9:${saveKey}`);
      }
      this.map.set(saveKey, value);
    } else {
      let values = [];
      for (let index = 0; index < this.keys.length; index++) {
        const key = this.keys[index];
        values.push(value[key]);
      }
      const saveKey = values.join("_");
      if (!saveKey || saveKey.length == 0) {
        return;
      }
      if (this.map.has(saveKey)) {
        throw new Error(`\u914D\u7F6E\u8868${sheet}\u552F\u4E00Key\u5B58\u5728\u91CD\u590D\u5185\u5BB9:${saveKey}`);
      }
      this.map.set(saveKey, value);
    }
  }
  get(key) {
    if (this.map.has(key)) {
      return this.map.get(key);
    }
    return void 0;
  }
  destroy() {
    this.key = void 0;
    this.keys = null;
    this.map.clear();
    this.map = null;
  }
};

// src/configs/accessors/BaseConfigAccessor.ts
var BaseConfigAccessor = class {
  constructor() {
    this.$configs = [];
    this.$storages = /* @__PURE__ */ new Map();
  }
  /**
  * 子类构造函数中调用，增加存储方式
  * @param keys 
  */
  addStorage(keys) {
    const key = keys.join("_");
    if (this.$storages.has(key)) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0\u914D\u7F6E\u8868\u5B58\u50A8\u65B9\u5F0F\uFF1A" + key);
    }
    this.$storages.set(key, new ConfigStorage(keys));
  }
  save(value) {
    const index = this.$configs.indexOf(value);
    if (index >= 0) {
      return false;
    }
    this.$configs.push(value);
    for (let i of this.$storages.values()) {
      i.save(value, this.sheetName);
    }
    return true;
  }
  /**
   * 通过单key单值获取项内容
   * @param key 
   * @param value 
   * @returns 
   */
  getOne(key, value) {
    return this.get([key], [value]);
  }
  /**
    * 获取
    * @param keys 
    * @param values 
    * @returns 
    */
  get(keys, values) {
    if (!keys || !values || keys.length == 0 || values.length == 0) {
      return void 0;
    }
    if (keys.length != values.length) {
      throw new Error("\u53C2\u6570\u957F\u5EA6\u4E0D\u4E00\u81F4!");
    }
    if (keys.length == 1) {
      let key = keys[0];
      let value = values[0];
      if (this.$storages.has(key)) {
        const storage = this.$storages.get(key);
        return storage.get(value);
      }
    } else {
      let sKey = keys.join("_");
      if (this.$storages.has(sKey)) {
        const s = this.$storages.get(sKey);
        const vKey = values.join("_");
        return s.get(vKey);
      }
    }
    return void 0;
  }
  /**
   * 获取存储器
   * @param keys 
   * @returns 
   */
  getStorage(keys) {
    return this.$storages.get(keys.join("_"));
  }
  /**
   * 获取
   * @param key
   * @param value
   * @returns 
   */
  getElements() {
    return this.$configs;
  }
  destroy() {
    this.$configs = null;
    for (let i of this.$storages.values()) {
      i.destroy();
    }
    this.$storages.clear();
    this.$storages = null;
  }
};

// src/configs/accessors/IDConfigAccessor.ts
var IDConfigAccessor = class extends BaseConfigAccessor {
  constructor() {
    super();
    this.addStorage(["id"]);
  }
  /**
   * 通过ID获取配置项内容
   * @param id 
   * @returns 
   */
  getByID(id) {
    return this.getOne("id", id);
  }
};

// src/configs/res/LocalConfigLoader.ts
import { assetManager as assetManager4, JsonAsset } from "cc";

// src/configs/ConfigManagerImpl.ts
var ConfigManagerImpl = class {
  constructor() {
    this.__accessors = /* @__PURE__ */ new Map();
  }
  /**
   * 注册存取器
   * @param sheet 
   * @param accessor
   */
  register(sheet, accessor) {
    if (this.__accessors.has(sheet)) {
      if (this.__accessors.get(sheet) != accessor) {
        throw new Error(`${sheet},\u91CD\u590D\u6CE8\u518C\u914D\u7F6E\u8868\u5B58\u53D6\u5668\u4E14\u5B58\u53D6\u5668\u7C7B\u578B\u4E0D\u4E00\u81F4!`);
      } else {
        return;
      }
    }
    this.__accessors.set(sheet, accessor);
  }
  /**
   * 注销
   * @param sheet 
   */
  unregister(sheet) {
    this.__accessors.delete(sheet);
  }
  /**
   * 获取存取器类
   * @param sheet 
   * @returns 
   */
  getAccessorClass(sheet) {
    if (!this.__accessors.has(sheet)) {
      throw new Error(`${sheet},\u914D\u7F6E\u8868\u5B58\u53D6\u5668\u672A\u6CE8\u518C!`);
    }
    return this.__accessors.get(sheet);
  }
  /**
   * 获取存取器
   * @param sheet 
   * @returns 
   */
  getAccessor(sheet) {
    if (Res.sheet2URL == void 0) {
      throw new Error("Res.sheet2URL\u672A\u5B9A\u4E49!\u8BF7\u5728\u521D\u59CB\u5316\u524D\u8BBE\u7F6E!");
    }
    const url = Res.sheet2URL(sheet);
    const urlKey = Res.url2Key(url);
    if (!ResourceManager.hasRes(urlKey)) {
      throw new Error(sheet + "\u672A\u52A0\u8F7D!");
    }
    let res = ResourceManager.getRes(urlKey);
    return res.content;
  }
};

// src/configs/ConfigManager.ts
var ConfigManager = class {
  /**
    * 注册存取器
    * @param sheet 
    * @param accessors 
    */
  static register(sheet, accessors) {
    this.impl.register(sheet, accessors);
  }
  /**
   * 注销
   * @param sheet 
   */
  static unregister(sheet) {
    this.impl.unregister(sheet);
  }
  /**
   * 获取存取器类
   * @param sheet 
   * @returns 
   */
  static getAccessorClass(sheet) {
    return this.impl.getAccessorClass(sheet);
  }
  /**
   * 获取配置存取器
   * @param sheet
   */
  static getAccessor(sheet) {
    return this.impl.getAccessor(sheet);
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new ConfigManagerImpl();
    }
    return this.__impl;
  }
};
ConfigManager.KEY = "ConfigManager";

// src/configs/res/LocalConfigLoader.ts
var LocalConfigLoader = class extends EventDispatcher {
  constructor() {
    super();
  }
  load(url) {
    this.__url = url;
    if (typeof this.__url == "string") {
      throw new Error("\u672A\u5B9E\u73B0\uFF01");
    }
    let self = this;
    let bundle = assetManager4.getBundle(this.__url.bundle);
    if (!bundle) {
      assetManager4.loadBundle(
        this.__url.bundle,
        (err, bundle2) => {
          if (err) {
            this.emit(Event.ERROR, this.__url, err);
            return;
          }
          this.__load(this.__url, bundle2);
        }
      );
    } else {
      this.__load(this.__url, bundle);
    }
  }
  __load(url, bundle) {
    if (typeof url == "string") {
      throw new Error("\u672A\u5B9E\u73B0\uFF01");
    }
    let urlStr = Res.url2Path(url);
    bundle.load(
      urlStr,
      JsonAsset,
      (finished, total) => {
        const progress = finished / total;
        this.emit(Event.PROGRESS, this.__url, void 0, progress);
      },
      (err, asset) => {
        if (err) {
          this.emit(Event.ERROR, url, err);
          return;
        }
        const urlKey = Res.url2Key(url);
        let res = new Resource();
        res.key = urlKey;
        res.content = asset;
        let accessor = this.__parseConfig(url, asset);
        res.content = accessor;
        ResourceManager.addRes(res);
        this.emit(Event.COMPLETE, url);
      }
    );
  }
  __parseConfig(url, data) {
    let list = data.json;
    if (Res.url2Sheet == void 0) {
      throw new Error("Res.url2Sheet\u672A\u5B9A\u4E49!\u8BF7\u5728\u521D\u59CB\u5316\u524D\u8BBE\u7F6E!");
    }
    const sheet_name = Res.url2Sheet(url);
    let accessorClass = ConfigManager.getAccessorClass(sheet_name);
    let accessor = new accessorClass();
    accessor.sheetName = sheet_name;
    for (let idx = 0; idx < list.length; idx++) {
      const data2 = list[idx];
      accessor.save(data2);
    }
    return accessor;
  }
  reset() {
    this.__url = void 0;
    this.offAllEvent();
  }
};

// src/configs/res/RemoteConfigLoader.ts
import { assetManager as assetManager5 } from "cc";
var _RemoteConfigLoader = class _RemoteConfigLoader extends EventDispatcher {
  constructor() {
    super();
  }
  load(url) {
    this.url = url;
    if (typeof url == "string") {
      throw new Error("\u672A\u5B9E\u73B0\uFF01");
    }
    let self = this;
    let remote_url = url.url;
    if (_RemoteConfigLoader.force) {
      remote_url += "?v=" + Date.now();
    }
    assetManager5.loadRemote(remote_url, (err, asset) => {
      if (err) {
        self.emit(Event.ERROR, url, err);
        return;
      }
      const urlKey = Res.url2Key(url);
      let res = new Resource();
      res.key = urlKey;
      res.content = asset;
      let accessor = this.__parseConfig(url, asset);
      res.content = accessor;
      ResourceManager.addRes(res);
      self.emit(Event.COMPLETE, url);
    });
  }
  __parseConfig(url, data) {
    let list = data.json;
    if (Res.url2Sheet == void 0) {
      throw new Error("Res.url2Sheet\u672A\u5B9A\u4E49!\u8BF7\u5728\u521D\u59CB\u5316\u524D\u8BBE\u7F6E!");
    }
    const sheet_name = Res.url2Sheet(url);
    let accessorClass = ConfigManager.getAccessorClass(sheet_name);
    let accessor = new accessorClass();
    accessor.sheetName = sheet_name;
    for (let idx = 0; idx < list.length; idx++) {
      const data2 = list[idx];
      accessor.save(data2);
    }
    return accessor;
  }
  reset() {
    this.url = void 0;
    this.offAllEvent();
  }
};
/**
 * 强制加载最新版本
 */
_RemoteConfigLoader.force = true;
var RemoteConfigLoader = _RemoteConfigLoader;

// src/datas/List.ts
var List = class extends EventDispatcher {
  constructor(only = true) {
    super();
    /**
     * 是否保证元素的唯一性
     */
    this.__only = false;
    /**
     * 元素数量(内部再增删时会修改这个参数，外部只做计算和绑定使用，切记不可做赋值操作！)
     */
    this.count = 0;
    this.__only = only;
    this.__element = [];
  }
  /**
   * 添加到末尾(注意如果保证唯一性，那么重复时就直接返回)
   * @param value 
   */
  push(value) {
    if (this.__only) {
      let index = this.__element.indexOf(value);
      if (index >= 0) {
        return false;
      }
    }
    this.__element.push(value);
    this.count = this.__element.length;
    if (this.hasEvent(Event.ADD)) {
      this.emit(Event.ADD, value);
    }
    return true;
  }
  /**
   * 添加到列表头部(注意如果保证唯一性，那么重复时就直接返回)
   * @param value 
   * @returns 
   */
  unshift(value) {
    if (this.__only) {
      let index = this.__element.indexOf(value);
      if (index >= 0) {
        return false;
      }
    }
    this.__element.unshift(value);
    this.count = this.__element.length;
    if (this.hasEvent(Event.ADD)) {
      this.emit(Event.ADD, value);
    }
    return true;
  }
  /**
   * 获取并删除最后一个元素
   * @returns 
   */
  pop() {
    if (this.__element.length > 0) {
      const result = this.__element.pop();
      this.count = this.__element.length;
      if (this.hasEvent(Event.REMOVE)) {
        this.emit(Event.REMOVE, result);
      }
      return result;
    }
    return null;
  }
  /**
   * 获取并删除第一个元素
   * @returns 
   */
  shift() {
    if (this.__element.length > 0) {
      const result = this.__element.shift();
      this.count = this.__element.length;
      if (this.hasEvent(Event.REMOVE)) {
        this.emit(Event.REMOVE, result);
      }
      return result;
    }
    return null;
  }
  /**
   * 删除指定索引的元素
   * @param index 
   */
  removeAt(index) {
    if (index >= this.__element.length) {
      throw new Error("\u5220\u9664\u7D22\u5F15\u8D85\u51FA\u8303\u56F4\uFF01");
    }
    const result = this.__element[index];
    this.__element.splice(index, 1);
    this.count = this.__element.length;
    if (this.hasEvent(Event.REMOVE)) {
      this.emit(Event.REMOVE, result);
    }
    return result;
  }
  /**
   * 删除元素
   * @param value 
   */
  remove(value) {
    let index = this.__element.indexOf(value);
    if (index < 0) {
      throw new Error("\u8981\u5220\u9664\u7684\u5185\u5BB9\u4E0D\u5728\u5217\u8868\u4E2D\uFF01" + value);
    }
    const result = this.__element[index];
    this.__element.splice(index, 1);
    this.count = this.__element.length;
    if (this.hasEvent(Event.REMOVE)) {
      this.emit(Event.REMOVE, result);
    }
  }
  /**
   * 移除所有元素
   */
  clear() {
    this.count = 0;
    this.__element.length = 0;
    if (this.hasEvent(Event.CLEAR)) {
      this.emit(Event.CLEAR);
    }
  }
  /**
   * 判断是否包含
   * @param value 
   * @returns 
   */
  has(value) {
    return this.find(value) >= 0;
  }
  /**
   * 查找元素下标
   * @param value 
   * @returns 
   */
  find(value) {
    return this.__element.indexOf(value);
  }
  /**
   * 查找元素下标
   * @param predicate 
   * @returns 
   */
  findIndex(predicate) {
    let index = this.__element.findIndex(predicate);
    return index;
  }
  /**
   * 获取指定元素
   * @param index 
   * @returns 
   */
  get(index) {
    if (index >= this.__element.length) {
      throw new Error("\u8D85\u51FA\u7D22\u5F15\u8303\u56F4:" + index + "/" + this.__element.length);
    }
    return this.__element[index];
  }
  /**
   * 源列表数据(注意不要直接进行增删操作，而是通过List.push....等接口进行操作)
   */
  get elements() {
    return this.__element;
  }
};

// src/datas/ser_des/ChangedData.ts
var ChangedData = class _ChangedData {
  constructor() {
  }
  static create(newValue, oldValue, key) {
    let result = new _ChangedData();
    result.oldValue = oldValue;
    result.newValue = newValue;
    result.key = key;
    return result;
  }
};

// src/datas/ser_des/SerDesMode.ts
var SerDesMode = /* @__PURE__ */ ((SerDesMode2) => {
  SerDesMode2[SerDesMode2["JSON"] = 0] = "JSON";
  return SerDesMode2;
})(SerDesMode || {});

// src/datas/ser_des/values/BaseValue.ts
var BaseValue = class extends EventDispatcher {
  constructor() {
    super();
  }
  getValue() {
    return this.value;
  }
  setValue(value) {
    if (this.checkValue(value)) {
      let oldValue = this.value;
      this.value = value;
      this.sendEvent(this.value, oldValue);
    }
  }
  sendEvent(newValue, oldValue) {
    if (this.hasEvent(Event.VALUE_CHANGED)) {
      this.emit(Event.VALUE_CHANGED, ChangedData.create(newValue, oldValue));
    }
  }
  /**
   * 检测值是否合法
   * @param value 
   */
  checkValue(value) {
    return false;
  }
  /**
   * 反序列化
   * @param type 
   * @param data 
   */
  decode(type, data) {
    let decoder = SerDes.getDeserialization(type);
    decoder.decode(this, data);
  }
  /**
   * 序列化
   * @param type 
   * @param data 
   * @returns 
   */
  encode(type, data) {
    let encoder = SerDes.getSerialization(type);
    return encoder.encode(this, data);
  }
  equality(value) {
    if (this.value == value.getValue()) {
      return true;
    }
    return false;
  }
};

// src/datas/ser_des/values/ArrayValue.ts
var ArrayValue = class _ArrayValue extends BaseValue {
  constructor() {
    super();
    this.value = [];
  }
  checkValue(value) {
    if (value != null && Array.isArray(value)) {
      return true;
    }
    return false;
  }
  /**
   * 添加到指定位置
   * @param index 
   * @param value 
   */
  addAt(index, value) {
    if (index < this.elements.length - 1) {
      this.elements.splice(index, 0, value);
      if (this.hasEvent(Event.ADD_CHILD)) {
        this.emit(Event.ADD_CHILD, ChangedData.create(index));
      }
      value.on(Event.VALUE_CHANGED, this.childValueChanged, this);
      value.on(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
    } else {
      throw new Error("\u7D22\u5F15" + index + " \u8D85\u51FA\u53EF\u6DFB\u52A0\u8303\u56F4:" + (this.elements.length - 1));
    }
  }
  /**
   * 删除
   * @param value 
   */
  remove(value) {
    let index = this.elements.indexOf(value);
    this.removeAt(index);
  }
  /**
   * 通过索引删除并返回元素
   * @param index 
   */
  removeAt(index) {
    if (index < 0 || index > this.elements.length - 1) {
      throw new Error("\u8981\u5220\u9664\u7684\u7D22\u5F15\u8D85\u51FA\u6570\u7EC4\u8FB9\u754C\uFF01");
    }
    let result = this.elements[index];
    this.elements.splice(index, 1);
    if (this.hasEvent(Event.REMOVE_CHILD)) {
      this.emit(Event.REMOVE_CHILD, ChangedData.create(index));
    }
    result.off(Event.VALUE_CHANGED, this.childValueChanged, this);
    result.off(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
    return result;
  }
  /**
   * 添加到末尾
   * @param value 
   */
  push(value) {
    let index = this.elements.indexOf(value);
    if (index >= 0) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0\uFF01");
    }
    index = this.elements.length;
    this.elements.push(value);
    if (this.hasEvent(Event.ADD_CHILD)) {
      this.emit(Event.ADD_CHILD, ChangedData.create(index));
    }
    value.on(Event.VALUE_CHANGED, this.childValueChanged, this);
    value.on(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
  }
  /**
   * 添加到头部
   * @param value 
   */
  unshift(value) {
    let index = this.elements.indexOf(value);
    if (index >= 0) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0\uFF01");
    }
    this.elements.unshift(value);
    if (this.hasEvent(Event.ADD_CHILD)) {
      this.emit(Event.ADD_CHILD, ChangedData.create(0));
    }
    value.on(Event.VALUE_CHANGED, this.childValueChanged, this);
    value.on(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
  }
  /**
   * 删除并返回第一个元素
   */
  shift() {
    if (this.elements.length == 0) {
      throw new Error("\u6570\u7EC4\u4E3A\u7A7A\uFF01");
    }
    let result = this.elements.shift();
    if (this.hasEvent(Event.REMOVE_CHILD)) {
      this.emit(Event.REMOVE_CHILD, ChangedData.create(0));
    }
    result.off(Event.VALUE_CHANGED, this.childValueChanged, this);
    result.off(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
    return result;
  }
  /**
  * 删除并返回最后一个元素
  */
  pop() {
    if (this.elements.length == 0) {
      throw new Error("\u6570\u7EC4\u4E3A\u7A7A\uFF01");
    }
    let index = this.elements.length - 1;
    let result = this.elements.pop();
    if (this.hasEvent(Event.REMOVE_CHILD)) {
      this.emit(Event.REMOVE_CHILD, ChangedData.create(index));
    }
    result.off(Event.VALUE_CHANGED, this.childValueChanged, this);
    result.off(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
    return result;
  }
  /**
   * 通过索引获取元素
   * @param index 
   */
  getAt(index) {
    return this.elements[index];
  }
  /**
   * 获取索引值
   * @param value 
   */
  getChildIndex(value) {
    return this.elements.indexOf(value);
  }
  /**
   * 检测时候包含该内容
   * @param value 
   */
  contains(value) {
    for (let index = 0; index < this.elements.length; index++) {
      const element = this.elements[index];
      if (element.equality(value)) {
        return true;
      }
    }
    return false;
  }
  /**
   * 对比
   * @param value 
   */
  equality(value) {
    if (value instanceof _ArrayValue) {
      if (this.elements == value.elements) {
        return true;
      }
      if (this.elements.length != value.elements.length) {
        return false;
      }
      let a, b;
      for (let index = 0; index < this.length; index++) {
        a = this.elements[index];
        b = value.elements[index];
        if (a.equality(b) == false) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  childValueChanged(e) {
    if (this.hasEvent(Event.CHILD_VALUE_CHANGED)) {
      this.emit(Event.CHILD_VALUE_CHANGED, e.data);
    }
  }
  /**
   * 清除
   */
  clear() {
    this.elements.length = 0;
  }
  /**
   * 列表长度
   */
  get length() {
    return this.elements.length;
  }
  /**
   * 内容
   */
  get elements() {
    return this.value;
  }
};

// src/datas/ser_des/values/DictionaryValue.ts
var DictionaryValue = class _DictionaryValue extends BaseValue {
  constructor() {
    super();
    this.value = new Dictionary();
  }
  /**
   * 添加属性
   * @param value 
   */
  add(value) {
    if (this.map.has(value.key)) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0\u76F8\u540CKEY\u7684\u5C5E\u6027\uFF01");
    }
    this.map.set(value.key, value);
    if (this.hasEvent(Event.ADD_CHILD)) {
      this.emit(Event.ADD_CHILD, ChangedData.create(value, null, value.key));
    }
    value.on(Event.VALUE_CHANGED, this.childValueChanged, this);
    value.on(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
    return value;
  }
  /**
   * 删除属性
   * @param value 
   */
  remove(value) {
    this.removeByKey(value.key);
  }
  /**
   * 通过属性key删除并返回
   * @param key 
   */
  removeByKey(key) {
    if (!this.map.has(key)) {
      throw new Error("\u8981\u5220\u9664\u7684\u5C5E\u6027\u4E0D\u5728\u96C6\u5408\u5185!");
    }
    let result = this.map.get(key);
    this.map.delete(key);
    if (this.hasEvent(Event.REMOVE_CHILD)) {
      this.emit(Event.REMOVE_CHILD, ChangedData.create(null, result, key));
    }
    result.off(Event.VALUE_CHANGED, this.childValueChanged, this);
    result.off(Event.CHILD_VALUE_CHANGED, this.childValueChanged, this);
    return result;
  }
  /**
   * 查询是否存在
   * @param key 
   * @returns 
   */
  has(key) {
    return this.map.has(key);
  }
  /**
   * 更新属性
   * @param key 
   * @param data 
   */
  update(key, data) {
    if (this.map.has(key) == false) {
      throw new Error("\u8981\u66F4\u65B0\u7684\u5C5E\u6027\u4E0D\u5B58\u5728\uFF01" + key);
    }
    let value = this.map.get(key);
    value.setValue(data);
  }
  /**
   * 更新多项属性
   * @param keys 
   * @param values 
   */
  multUpdate(keys, values) {
    if (keys == null || values == null) {
      throw new Error("Keys\u548Cvalues\u4E0D\u80FD\u4E3A\u7A7A\uFF01");
    }
    if (keys.length != values.length) {
      throw new Error("keys.length!=values.length");
    }
    let key;
    let value;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      value = values[i];
      this.update(key, value);
    }
  }
  /**
   * 获取属性
   * @param key 
   */
  get(key) {
    return this.map.get(key);
  }
  /**
   * 对比
   * @param value 
   */
  equality(value) {
    if (value instanceof _DictionaryValue) {
      if (this.elements.length != value.elements.length) {
        return false;
      }
      let a;
      let b;
      for (let i = 0; i < this.elements.length; i++) {
        a = this.elements[i];
        b = value.elements[i];
        if (a.equality(b) != false) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  /**
   * 清除
   */
  clear() {
    this.map.clear();
  }
  childValueChanged(e) {
    if (this.hasEvent(Event.CHILD_VALUE_CHANGED)) {
      this.emit(Event.CHILD_VALUE_CHANGED, e.data);
    }
  }
  get elements() {
    return this.map.elements;
  }
  get map() {
    return this.value;
  }
};

// src/datas/ser_des/propertys/ArrayProperty.ts
var ArrayProperty = class extends ArrayValue {
  constructor(key, value) {
    super();
    this.key = key;
    if (value != null && value != void 0) {
      this.setValue(value);
    }
  }
  sendEvent(newValue, oldValue) {
    if (this.hasEvent(Event.VALUE_CHANGED)) {
      this.emit(Event.VALUE_CHANGED, ChangedData.create(newValue, oldValue, this.key));
    }
  }
  /**
   * 判断某个子内容的某个属性相同则返回true
   */
  containProperty(value) {
    let item;
    let findValue;
    for (let j = 0; j < this.length; j++) {
      item = this.elements[j];
      if (item instanceof DictionaryValue) {
        findValue = item.get(value.key);
        if (findValue.equality(value)) {
          return true;
        }
      }
    }
    return false;
  }
};

// src/datas/ser_des/propertys/DictionaryProperty.ts
var DictionaryProperty = class extends DictionaryValue {
  constructor(key, value) {
    super();
    this.key = key;
    if (value != null && value != void 0) {
      this.setValue(value);
    }
  }
  sendEvent(newValue, oldValue) {
    if (this.hasEvent(Event.VALUE_CHANGED)) {
      this.emit(Event.VALUE_CHANGED, ChangedData.create(newValue, oldValue, this.key));
    }
  }
};

// src/datas/ser_des/values/NumberValue.ts
var NumberValue = class extends BaseValue {
  constructor() {
    super();
  }
  checkValue(value) {
    if (isNaN(value)) {
      Logger.error("\u8BBE\u7F6E\u975E\u6570\u5B57\u7C7B\u578B:" + value, "datas");
      return false;
    }
    if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
      Logger.error("\u6570\u503C:" + value + " \u8D85\u51FAnumber\u53EF\u5141\u8BB8\u8303\u56F4!", "datas");
      return false;
    }
    return true;
  }
};

// src/datas/ser_des/propertys/NumberProperty.ts
var NumberProperty = class extends NumberValue {
  constructor(key, value) {
    super();
    this.key = key;
    if (value != null && value != void 0) {
      this.setValue(value);
    }
  }
  sendEvent(newValue, oldValue) {
    if (this.hasEvent(Event.VALUE_CHANGED)) {
      this.emit(Event.VALUE_CHANGED, ChangedData.create(newValue, oldValue, this.key));
    }
  }
};

// src/datas/ser_des/values/StringValue.ts
var StringValue = class extends BaseValue {
  constructor() {
    super();
  }
  checkValue(value) {
    if (value == void 0 || value == null) {
      return false;
    }
    return true;
  }
};

// src/datas/ser_des/propertys/StringProperty.ts
var StringProperty = class extends StringValue {
  constructor(key, value) {
    super();
    this.key = key;
    if (value != null && value != void 0) {
      this.setValue(value);
    }
  }
  sendEvent(newValue, oldValue) {
    if (this.hasEvent(Event.VALUE_CHANGED)) {
      this.emit(Event.VALUE_CHANGED, ChangedData.create(newValue, oldValue, this.key));
    }
  }
};

// src/datas/ser_des/DataFactory.ts
var DataFactory = class {
  /**
   * 根据数据创建值对象
   * @param data 
   */
  static createValue(data) {
    if (data instanceof Array) {
      return new ArrayValue();
    } else {
      if (data instanceof String) {
        return new StringValue();
      } else {
        if (isNaN(data)) {
          return new DictionaryValue();
        } else {
          return new NumberValue();
        }
      }
    }
  }
  /**
   * 根据数据创建
   * @param type 
   * @param key 
   */
  static createProperty(data) {
    let result;
    if (data instanceof Array) {
      result = new ArrayProperty();
    } else {
      if (typeof data === "string") {
        result = new StringProperty();
      } else {
        let numValue = Number(data);
        if (isNaN(numValue)) {
          result = new DictionaryProperty();
        } else {
          result = new NumberProperty();
        }
      }
    }
    return result;
  }
};

// src/datas/ser_des/deserializations/JSONDeserialization.ts
var JSONDeserialization = class {
  /**
   * 解码
   * @param target 
   * @param data 
   */
  decode(target, data) {
    if (target instanceof ArrayValue) {
      let value;
      for (let i = 0; i < data.length; i++) {
        let item_value = data[i];
        value = DataFactory.createProperty(item_value);
        value.decode(0 /* JSON */, item_value);
        target.push(value);
      }
      return;
    }
    if (target instanceof DictionaryValue) {
      let item_property;
      let property;
      for (const key in data) {
        if (key == "key") {
          if (target instanceof DictionaryProperty) {
            target.key = data.key;
          }
          continue;
        }
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          item_property = data[key];
          property = DataFactory.createProperty(item_property);
          property.key = key;
          property.decode(0 /* JSON */, item_property);
          target.add(property);
        }
      }
      return;
    }
    if (target instanceof BaseValue) {
      target.setValue(data);
    }
  }
};

// src/datas/ser_des/serializations/JSONSerialization.ts
var JSONSerialization = class {
  /**
   * 编码
   * @param target 
   * @param data 
   * @returns 
   */
  encode(target, data) {
    if (target instanceof ArrayValue) {
      let result_value = [];
      let item_value;
      for (let i = 0; i < target.elements.length; i++) {
        item_value = target.elements[i];
        result_value.push(item_value.encode(0 /* JSON */, data));
      }
      return result_value;
    }
    if (target instanceof DictionaryValue) {
      let result_property = {};
      let item_property;
      for (let index = 0; index < target.elements.length; index++) {
        item_property = target.elements[index];
        result_property[item_property.key] = item_property.encode(0 /* JSON */, data);
      }
      if (target instanceof DictionaryProperty) {
        result_property["key"] = target.key;
      }
      return result_property;
    }
    return target.value;
  }
};

// src/datas/ser_des/SerDes.ts
var SerDes = class {
  static init() {
    if (this.__inited) {
      return;
    }
    this.__inited = true;
    this.addSer(0 /* JSON */, new JSONSerialization());
    this.addDes(0 /* JSON */, new JSONDeserialization());
  }
  /**
   * 添加序列化器
   * @param type 
   * @param ser 
   */
  static addSer(type, ser) {
    this.__serMap.set(type, ser);
  }
  /**
   * 添加反序列化器
   * @param type 
   * @param des 
   */
  static addDes(type, des) {
    this.__desMap.set(type, des);
  }
  static getSerialization(type) {
    this.init();
    if (!this.__serMap.has(type)) {
      console.error("\u6CA1\u6709\u627E\u5230\u5E8F\u5217\u5316\u5668");
      return new JSONSerialization();
    } else {
      return this.__serMap.get(type);
    }
  }
  static getDeserialization(type) {
    this.init();
    if (!this.__desMap.has(type)) {
      console.error("\u6CA1\u6709\u627E\u5230\u53CD\u5E8F\u5217\u5316\u5668");
      return new JSONDeserialization();
    } else {
      return this.__desMap.get(type);
    }
  }
};
SerDes.__serMap = /* @__PURE__ */ new Map();
SerDes.__desMap = /* @__PURE__ */ new Map();
SerDes.__inited = false;

// src/func/redPoint/RedPoint.ts
import { DEBUG } from "cc/env";

// src/func/redPoint/RedPointNode.ts
var RedPointNode = class extends EventDispatcher {
  constructor(id) {
    super();
    this.parent = null;
    this.__isActive = false;
    this.id = id;
    this.__children = [];
  }
  /**
   * 添加子节点
   * @param node 
   */
  addChild(node) {
    this.__children = this.__children || [];
    node.parent = this;
    this.__children.push(node);
    this.childrenChanged();
  }
  /**
   * 删除子节点
   * @param node
   */
  removeChild(node) {
    this.__children = this.__children || [];
    node.parent = null;
    const index = this.__children.indexOf(node);
    if (index !== -1) {
      this.__children.splice(index, 1);
    }
    this.childrenChanged();
  }
  get children() {
    return this.__children;
  }
  set isActive(value) {
    this.__isActive = value;
    if (this.parent) {
      this.parent.childrenChanged();
    }
    this.emit(Event.UPDATE);
  }
  /**
   * 子节点改变
   */
  childrenChanged() {
    TickerManager.callNextFrame(this.__childrenChanged, this);
  }
  __childrenChanged() {
    let active = false;
    for (let index = 0; index < this.__children.length; index++) {
      const node = this.__children[index];
      if (node.isActive) {
        active = true;
        break;
      }
    }
    this.isActive = active;
  }
  get isActive() {
    return this.__isActive;
  }
};

// src/func/redPoint/RedPoint.ts
var _RedPoint = class _RedPoint {
  constructor() {
    this.__redPoints = /* @__PURE__ */ new Map();
    this.__detectors = /* @__PURE__ */ new Map();
    this.__waiting = /* @__PURE__ */ new Set();
    this.__frameRunList = [];
    TickerManager.addTicker(this);
  }
  tick(dt) {
    if (this.__waiting.size == 0) {
      return;
    }
    let index = 0;
    for (const id of this.__waiting) {
      let detector = this.__detectors.get(id);
      let isActive = detector();
      let node = this.__redPoints.get(id);
      node.isActive = isActive;
      this.__frameRunList.push(id);
      if (index > _RedPoint.FRAME_RUN_COUNT) {
        break;
      }
      index++;
    }
    for (let index2 = 0; index2 < this.__frameRunList.length; index2++) {
      const id = this.__frameRunList[index2];
      this.__waiting.delete(id);
    }
    this.__frameRunList.splice(0, this.__frameRunList.length);
  }
  /**
   * 注册红点检测器(内部接口，开发时请使用Module上的registerRedPoint方法)
   * @param id 
   * @param detector 
   */
  register(id, detector) {
    if (this.__detectors.has(id)) {
      throw new Error(`\u91CD\u590D\u6CE8\u518C\u7EA2\u70B9\u68C0\u6D4B${id}`);
    }
    this.__detectors.set(id, detector);
  }
  /**
   * 注销红点检测器
   * @param id 
   */
  unregister(id) {
    this.__detectors.delete(id);
  }
  /**
   * 请求检测
   * @param id 
   */
  request(id) {
    if (!this.__detectors.has(id)) {
      throw new Error(`\u68C0\u6D4B\u5668${id}\u4E0D\u5B58\u5728`);
    }
    this.__waiting.add(id);
  }
  /**
   * 初始化红点结构体
   * @param config 
   */
  createByConfig(configs) {
    for (let index = 0; index < configs.length; index++) {
      const config = configs[index];
      let node = this.__createNode(config.id);
      this.__redPoints.set(config.id, node);
    }
    for (let index = 0; index < configs.length; index++) {
      const config = configs[index];
      if (config.id == config.parent) {
        continue;
      }
      let node = this.__redPoints.get(config.id);
      let parent = this.__redPoints.get(config.parent);
      node.parent = parent;
      parent.addChild(node);
    }
    if (DEBUG) {
      let parents = [];
      for (let index = 0; index < configs.length; index++) {
        const config = configs[index];
        let node = this.__redPoints.get(config.id);
        parents.splice(0, parents.length);
        this.checkCircularReference(node, parents);
      }
    }
  }
  /**
   * 通过数据创建节点
   * @param data 
   * @returns 
   */
  createByData(data) {
    let node = new RedPointNode(data.id);
    for (const child of data.children) {
      if (typeof child == "number") {
        let childNode;
        if (this.__redPoints.has(child)) {
          childNode = this.__redPoints.get(child);
        } else {
          childNode = new RedPointNode(child);
        }
        node.addChild(childNode);
      } else {
        let childData = child;
        let childNode = this.createByData(childData);
        node.addChild(childNode);
      }
    }
    return node;
  }
  /**
   * 创建节点
   * @param id 
   * @param children 
   * @returns 
   */
  create(id, children) {
    if (this.__redPoints.has(id)) {
      throw new Error(`\u8282\u70B9${id}\u5DF2\u5B58\u5728`);
    }
    let node = new RedPointNode(id);
    for (let index = 0; index < children.length; index++) {
      const childID = children[index];
      if (childID == id) {
        throw new Error(`\u8282\u70B9${id}\u4E0D\u80FD\u5305\u542B\u81EA\u5DF1`);
      }
      let childNode;
      if (this.__redPoints.has(childID)) {
        childNode = this.__redPoints.get(childID);
      } else {
        childNode = this.__createNode(childID);
      }
      node.addChild(childNode);
    }
    this.__redPoints.set(id, node);
    if (DEBUG) {
      let parents = [];
      this.checkCircularReference(node, parents);
    }
    return node;
  }
  /**
   * 创建叶子节点
   * @param id 
   * @returns 
   */
  __createNode(id) {
    let node = new RedPointNode(id);
    this.__redPoints.set(id, node);
    return node;
  }
  /**
   * 检测循环引用
   * @param node 
   * @param parents 
   */
  checkCircularReference(node, parents) {
    if (parents.indexOf(node.id) >= 0) {
      throw new Error(`\u8282\u70B9${node.id}\u5B58\u5728\u5FAA\u73AF\u5F15\u7528`);
    } else {
      parents.push(node.id);
      for (let index = 0; index < node.children.length; index++) {
        const childNode = node.children[index];
        if (childNode.children.length > 0) {
          this.checkCircularReference(childNode, parents);
        }
      }
    }
  }
  /**
   * 获取红点节点
   * @param id 
   * @returns 
   */
  getNode(id) {
    return this.__redPoints.get(id);
  }
  static get single() {
    if (this.__instance) {
      this.__instance = new _RedPoint();
    }
    return this.__instance;
  }
};
/**每帧运行检测器数量 */
_RedPoint.FRAME_RUN_COUNT = 2;
var RedPoint = _RedPoint;

// src/func/Func.ts
import { DEBUG as DEBUG2 } from "cc/env";

// src/func/FuncNode.ts
var FuncNode = class extends EventDispatcher {
  constructor(id) {
    super();
    this.__isActive = false;
    this.__children = [];
    this.id = id;
  }
  addChild(node) {
    node.parent = this;
    this.__children.push(node);
  }
  removeChild(node) {
    let index = this.__children.indexOf(node);
    if (index > -1) {
      this.__children.splice(index, 1);
      node.parent = null;
    }
  }
  get children() {
    return this.__children;
  }
  update(server) {
    this.server = server;
    let slefActive = Func.single.checkFunc(this);
    if (!slefActive) {
      this.isActive = false;
      return;
    }
    let parent = this.parent;
    while (parent) {
      if (!parent.isActive) {
        this.isActive = false;
        break;
      }
      parent = parent.parent;
    }
    this.isActive = true;
    for (let index = 0; index < this.__children.length; index++) {
      const child = this.__children[index];
      child.update(child.server);
    }
  }
  set isActive(value) {
    if (this.__isActive == value) return;
    this.__isActive = value;
    this.emit(Event.UPDATE);
  }
  get isActive() {
    return false;
  }
};

// src/func/Func.ts
var Func = class _Func extends EventDispatcher {
  constructor() {
    super();
    /**
     * 节点检测函数
     */
    this.checkFunc = (value) => {
      if (!value.server) {
        return false;
      }
      return true;
    };
    this.__funcs = /* @__PURE__ */ new Map();
  }
  /**
   * 初始化
   * @param configs 
   */
  init(configs) {
    for (let index = 0; index < configs.length; index++) {
      const config = configs[index];
      let node = this.__createNode(config.id, config);
      this.__funcs.set(config.id, node);
    }
    for (let index = 0; index < configs.length; index++) {
      const config = configs[index];
      if (config.id == config.parent) {
        continue;
      }
      let node = this.__funcs.get(config.id);
      let parent = this.__funcs.get(config.parent);
      node.parent = parent;
      parent.addChild(node);
    }
    if (DEBUG2) {
      let parents = [];
      for (let index = 0; index < configs.length; index++) {
        const config = configs[index];
        let node = this.__funcs.get(config.id);
        parents.splice(0, parents.length);
        this.__checkCircularReference(node, parents);
      }
    }
  }
  /**
   * 更新
   * @param server 
   */
  update(server) {
    if (Array.isArray(server)) {
      for (let index = 0; index < server.length; index++) {
        const element = server[index];
        this.__update(element);
      }
    } else {
      this.__update(server);
    }
  }
  __update(server) {
    let node = this.__funcs.get(server.id);
    node.update(server);
    this.emit(Event.UPDATE, node);
  }
  /**
   * 检测循环引用
   * @param node 
   * @param parents 
   */
  __checkCircularReference(node, parents) {
    if (parents.indexOf(node.id) >= 0) {
      throw new Error(`\u8282\u70B9${node.id}\u5B58\u5728\u5FAA\u73AF\u5F15\u7528`);
    } else {
      parents.push(node.id);
      for (let index = 0; index < node.children.length; index++) {
        const childNode = node.children[index];
        this.__checkCircularReference(childNode, parents);
      }
    }
  }
  /**
   * 创建节点
   * @param id 
   * @param config 
   * @returns 
   */
  __createNode(id, config) {
    let result = new FuncNode(id);
    result.config = config;
    return result;
  }
  /**
   * 获取功能节点
   * @param id 
   */
  getNode(id) {
    return this.__funcs.get(id);
  }
  static get single() {
    if (!this.__instance) {
      this.__instance = new _Func();
    }
    return this.__instance;
  }
};

// src/modules/Module.ts
import { Component } from "cc";

// src/modules/ModuleManager.ts
import { Node as Node4 } from "cc";

// src/modules/ModuleLoader.ts
import { assetManager as assetManager6 } from "cc";

// src/modules/ModuleProxy.ts
var ModuleProxy = class {
  constructor(module) {
    /**
     * 引用计数器
     */
    this.refCount = 0;
    this.module = module;
    this.refCount = 0;
  }
  addRef() {
    this.refCount++;
  }
  removeRef() {
    this.refCount--;
  }
  destroy() {
    this.module.destroy();
    this.module = null;
    return true;
  }
};

// src/modules/ModuleLoader.ts
var ModuleLoader = class extends EventDispatcher {
  constructor() {
    super();
    /**
     * 资源请求对象
     */
    this.resRequest = null;
  }
  load(module_name) {
    this.module_name = module_name;
    let module = ModuleManager.single.node.getComponent("Module_" + this.module_name);
    if (module) {
      if (!(module instanceof Module)) {
        throw new Error("\u6A21\u5757Module_" + this.module_name + "\u5FC5\u987B\u7EE7\u627FModule\u7C7B");
      }
      this.module = module;
      this.__initModule();
    } else {
      Logger.log("Start Load Module:" + this.module_name);
      let bundle = assetManager6.getBundle(module_name);
      if (!bundle) {
        assetManager6.loadBundle(module_name, this.__bundleLoaded.bind(this));
      } else {
        this.__bundleLoaded(null, bundle);
      }
    }
  }
  __bundleLoaded(err, bundle) {
    if (err) {
      this.emit(Event.ERROR, this.module_name, new Error("AssetBundle:" + this.module_name + "\u4E0D\u5B58\u5728\uFF01"));
      return;
    }
    try {
      this.module = ModuleManager.single.node.addComponent("Module_" + this.module_name);
    } catch (error) {
      throw new Error("\u6A21\u5757Module_" + this.module_name + "\u521D\u59CB\u5316\u62A5\u9519:" + error);
    }
    this.module.module_name = this.module_name;
    if (!this.module) {
      throw new Error("\u6A21\u5757\u7C7BModule_" + this.module_name + "\u4E0D\u5B58\u5728\uFF01");
    }
    if (!(this.module instanceof Module)) {
      throw new Error("\u6A21\u5757Module_" + this.module_name + "\u5FC5\u987B\u7EE7\u627FModule\u7C7B");
    }
    try {
      this.__initModule();
    } catch (error) {
      Logger.error("Load Module Error:" + this.module_name);
    }
  }
  __initModule() {
    let urls = [];
    if (this.module.configs && this.module.configs.length > 0) {
      for (let index = 0; index < this.module.configs.length; index++) {
        const sheet_name = this.module.configs[index];
        const url = Res.sheet2URL(sheet_name);
        urls.push(url);
      }
    }
    if (this.module.assets && this.module.assets.length > 0) {
      for (let index = 0; index < this.module.assets.length; index++) {
        const element = this.module.assets[index];
        urls.push(element);
      }
    }
    if (urls.length > 0) {
      this.resRequest = Res.create(
        urls,
        this.module.name,
        (progress) => {
          this.emit(Event.PROGRESS, this.module_name, void 0, progress * 0.7);
        },
        (err) => {
          if (err) {
            this.resRequest.dispose();
            this.resRequest = null;
            this.emit(Event.ERROR, this.module_name, err);
            return;
          }
          this.__assetReady();
        }
      );
      this.resRequest.load();
    } else {
      this.__assetReady();
    }
  }
  /**
   * 依赖的配置与资源准备完毕
   */
  __assetReady() {
    this.module.resRequest = this.resRequest;
    this.module.preInit();
    let proxy = new ModuleProxy(this.module);
    this.emit(Event.COMPLETE, { module: this.module_name, proxy });
  }
  reset() {
    this.module_name = null;
    this.module = null;
  }
};

// src/modules/ModuleQueue.ts
var ModuleQueue = class _ModuleQueue {
  constructor() {
    /**
     * 正在加载的模块
     */
    this.running = new Dictionary();
    /**
     * 等待加载的模块
     */
    this.waiting = [];
    TickerManager.addTicker(this);
  }
  load(module_name, isSub) {
    if (this.running.has(module_name)) {
      return;
    }
    let idx = this.waiting.indexOf(module_name);
    if (isSub && idx >= 0) {
      this.waiting.splice(idx, 1);
      this.__startLoad(module_name);
      return;
    }
    if (idx >= 0) {
      return;
    }
    this.waiting.push(module_name);
  }
  tick(dt) {
    while (this.running.size < ModuleManager.MAX_LOADER_THREAD && this.waiting.length > 0) {
      const module = this.waiting.shift();
      this.__startLoad(module);
    }
  }
  __startLoad(module_name) {
    let loader = Pool.acquire(ModuleLoader);
    this.running.set(module_name, loader);
    this.__addEvent(loader);
    loader.load(module_name);
  }
  __addEvent(target) {
    target.on(Event.COMPLETE, this.__eventHandler, this);
    target.on(Event.ERROR, this.__eventHandler, this);
    target.on(Event.PROGRESS, this.__eventHandler, this);
  }
  __eventHandler(evt) {
    let target = evt.target;
    if (evt.type == Event.PROGRESS) {
      ModuleManager.single.childProgress(evt.data, evt.progress);
      return;
    }
    target.offAllEvent();
    if (evt.type == Event.ERROR) {
      this.running.delete(evt.data);
      ModuleManager.single.childError(evt.data, evt.error);
      return;
    }
    if (evt.type == Event.COMPLETE) {
      this.running.delete(evt.data.module);
      ModuleManager.single.childComplete(evt.data.module, evt.data.proxy);
      target.reset();
      Pool.release(ModuleLoader, target);
    }
  }
  static get single() {
    if (this.instance == null) {
      this.instance = new _ModuleQueue();
    }
    return this.instance;
  }
};

// src/modules/ModuleRequest.ts
var ModuleRequest = class {
  constructor(modules, progress, callback, isSub) {
    /**
     * 是否是子服务(子服务在加载时不占用加载线程)
     */
    this.isSub = false;
    this.__loadedMap = /* @__PURE__ */ new Map();
    this.isSub = isSub;
    this.modules = modules;
    this.__progress = progress;
    this.__callback = callback;
  }
  load() {
    this.__loadedMap.clear();
    let isLoading = false;
    for (let index = 0; index < this.modules.length; index++) {
      const module_name = this.modules[index];
      const module = ModuleManager.single.getModule(module_name);
      if (module) {
        this.__loadedMap.set(module_name, 1);
      } else {
        isLoading = true;
        ModuleQueue.single.load(module_name, this.isSub);
      }
    }
    if (!isLoading) {
      this.__checkComplete();
    }
  }
  childComplete(module_name) {
    this.__loadedMap.set(module_name, 1);
    this.__checkComplete();
  }
  childError(module_name, err) {
    if (this.__callback) {
      this.__callback(err);
    }
  }
  childProgress(module_name, progress) {
    this.__loadedMap.set(module_name, progress);
    let totalProgress = this.loaded / this.modules.length;
    if (this.__progress) {
      this.__progress(totalProgress);
    }
  }
  __checkComplete() {
    let progress = this.loaded / this.modules.length;
    if (this.__progress) {
      this.__progress(progress);
    }
    if (progress == 1 && this.__callback != null) {
      this.__callback(null);
      this.destroy();
    }
  }
  get loaded() {
    let loaded = 0;
    for (let value of this.__loadedMap.values()) {
      loaded += value;
    }
    return loaded;
  }
  destroy() {
    this.modules = null;
    this.__progress = null;
    this.__callback = null;
  }
};

// src/modules/ModuleManager.ts
var _ModuleManager = class _ModuleManager {
  constructor() {
    /**
     * 模块节点(用于加载模块)
     */
    this.node = new Node4("ModuleManager");
    this.__lastGCTime = 0;
    this.__modules = /* @__PURE__ */ new Map();
    this.__requests = /* @__PURE__ */ new Map();
    this.__waitDeletes = /* @__PURE__ */ new Set();
    TickerManager.addTicker(this);
  }
  tick(dt) {
    let currentTime = Timer.currentTime;
    if (currentTime - this.__lastGCTime > _ModuleManager.GC_INTERVAL) {
      for (const module_name of this.__waitDeletes) {
        let proxy = this.getModuleProxy(module_name);
        if (!proxy || !proxy.module || proxy.module.notReleased) continue;
        if (proxy.refCount <= 0) {
          Logger.log("Module Destroy:" + proxy.module.name, Logger.TYPE.Module);
          this.__modules.delete(module_name);
          proxy.destroy();
        }
      }
      this.__waitDeletes.clear();
    }
  }
  /**
   * 加载
   * @param modules 
   * @param progress 
   * @param callback 
   * @param isSub
   */
  load(modules, progress, callback, isSub) {
    let request = new ModuleRequest(modules, progress, callback, isSub);
    this.__addRequest(request);
    request.load();
  }
  childComplete(module_name, proxy) {
    this.__modules.set(module_name, proxy);
    let list = this.__requests.get(module_name);
    for (let index = 0; index < list.length; index++) {
      const request = list[index];
      request.childComplete(module_name);
    }
    list.length = 0;
    this.__requests.delete(module_name);
  }
  childError(module_name, err) {
    let list = this.__requests.get(module_name);
    for (let index = 0; index < list.length; index++) {
      const request = list[index];
      request.childError(module_name, err);
    }
    let clist = list.concat();
    for (let index = 0; index < clist.length; index++) {
      const request = clist[index];
      this.__removeRequest(request);
      request.destroy();
    }
  }
  childProgress(module_name, progress) {
    let list = this.__requests.get(module_name);
    for (let index = 0; index < list.length; index++) {
      const request = list[index];
      request.childProgress(module_name, progress);
    }
  }
  __addRequest(request) {
    let list;
    for (let index = 0; index < request.modules.length; index++) {
      const module = request.modules[index];
      if (!this.__requests.has(module)) {
        list = [];
        this.__requests.set(module, list);
      } else {
        list = this.__requests.get(module);
      }
      list.push(request);
    }
  }
  __removeRequest(request) {
    let list;
    let findex = 0;
    for (let index = 0; index < request.modules.length; index++) {
      const module = request.modules[index];
      list = this.__requests.get(module);
      findex = list.indexOf(request);
      if (findex >= 0) {
        list.splice(findex, 1);
      }
    }
  }
  /**
   * 获取代理(内部接口，请勿使用)
   * @param module_name 
   * @returns 
   */
  getModuleProxy(module_name) {
    if (!this.__modules.has(module_name)) {
      return null;
    }
    return this.__modules.get(module_name);
  }
  /**
   * 获取服务(内部接口，请勿使用)
   * @param module_name 
   */
  getModule(module_name) {
    let proxy = this.getModuleProxy(module_name);
    if (!proxy) {
      return void 0;
    }
    return proxy.module;
  }
  /**
   * 尝试销毁服务
   * @param clazz
   */
  dispose(module_name) {
    let proxy = this.__modules.get(module_name);
    proxy.removeRef();
    this.__waitDeletes.add(module_name);
  }
  static get single() {
    if (!this.__instance) {
      this.__instance = new _ModuleManager();
    }
    return this.__instance;
  }
};
/**
 * 最大启动线程
 */
_ModuleManager.MAX_LOADER_THREAD = 5;
/**
 * GC间隔时间
 */
_ModuleManager.GC_INTERVAL = 60;
var ModuleManager = _ModuleManager;

// src/modules/Module.ts
var Module = class extends Component {
  constructor() {
    super();
    /**
     * 永不删除
     */
    this.notReleased = false;
    /**
     * 资源请求对象
     */
    this.resRequest = null;
    /**
     * 是否初始化完毕
     */
    this.$inited = false;
    this.__moduleIndex = 0;
    this.__eventProxy = new EventDispatcher(this);
    this.__redPoints = /* @__PURE__ */ new Map();
  }
  /**
   * 前置初始化
   */
  preInit() {
    if (this.modules && this.modules.length > 0) {
      this.__moduleIndex = 0;
      ModuleManager.single.load(this.modules, void 0, (err) => {
        if (err) {
          throw new Error("\u6A21\u5757\u521D\u59CB\u5316\u5931\u8D25:" + err.message);
        }
        for (let index = 0; index < this.modules.length; index++) {
          const clazz = this.modules[index];
          const module = this.$getModule(clazz);
          const proxy = ModuleManager.single.getModuleProxy(clazz);
          proxy.addRef();
          if (module.$inited) {
            this.__moduleIndex++;
          } else {
            module.on(Event.COMPLETE, this.__otherModuleInitComplete, this);
          }
        }
        const total = this.modules ? this.modules.length : 0;
        if (this.__moduleIndex > total) {
          this.init();
        }
        this.on(Event.COMPLETE, this.__otherModuleInitComplete, this);
        this.selfInit();
      }, true);
    } else {
      this.on(Event.COMPLETE, this.__otherModuleInitComplete, this);
      this.selfInit();
    }
  }
  __otherModuleInitComplete(e) {
    const module = e.target;
    module.off(Event.COMPLETE, this.__otherModuleInitComplete, this);
    this.__moduleIndex++;
    const total = this.modules ? this.modules.length : 0;
    if (this.__moduleIndex > total) {
      this.init();
    }
  }
  /**自身初始化(子类重写并在初始化完成后调用selfInitComplete) */
  selfInit() {
    this.selfInitComplete();
  }
  /**
   * 自身初始化完成
   */
  selfInitComplete() {
    this.$inited = true;
    this.emit(Event.COMPLETE);
  }
  /**
   * 初始化
   */
  init() {
  }
  /**
   * 获取配置存取器
   * @param config 
   * @returns 
   */
  getConfigAccessor(config) {
    return ConfigManager.getAccessor(config);
  }
  /**
   * 获取模块
   * @param module_name 
   * @returns 
   */
  $getModule(module_name) {
    if (!this.modules || this.modules.indexOf(module_name) < 0) {
      throw new Error("\u6A21\u5757\u4E0D\u5B58\u5728:" + module_name);
    }
    return ModuleManager.single.getModule(module_name);
  }
  /**
   * 注册红点检测器
   * @param id 
   * @param detector 
   */
  registerRedPoint(id, detector) {
    this.__redPoints.set(id, detector);
    RedPoint.single.register(id, detector);
  }
  destroy() {
    this.configs = null;
    if (this.modules && this.modules.length > 0) {
      for (let index = 0; index < this.modules.length; index++) {
        const element = this.modules[index];
        ModuleManager.single.dispose(element);
      }
      this.modules = null;
    }
    this.notReleased = false;
    this.assets = null;
    if (this.resRequest) {
      this.resRequest.dispose();
      this.resRequest = null;
    }
    for (const [key, _] of this.__redPoints) {
      RedPoint.single.unregister(key);
    }
    this.__redPoints.clear();
    this.__redPoints = null;
    this.$inited = false;
    this.__moduleIndex = 0;
    return super.destroy();
  }
  /**
   * 获取是否已初始化
   */
  get inited() {
    return this.$inited;
  }
  //=========================IEventDispatcher接口实现
  on(key, handler, caller, priority) {
    this.__eventProxy.on(key, handler, caller, priority);
  }
  off(key, handler, caller) {
    this.__eventProxy.off(key, handler, caller);
  }
  offByCaller(caller) {
    this.__eventProxy.offByCaller(caller);
  }
  offAllEvent() {
    this.__eventProxy.offAllEvent();
  }
  emit(key, data) {
    this.__eventProxy.emit(key, data);
  }
  hasEvent(key) {
    return this.__eventProxy.hasEvent(key);
  }
  hasEventHandler(key, handler, caller) {
    return this.__eventProxy.hasEventHandler(key, handler, caller);
  }
};

// src/net/http/Http.ts
var Http = class {
  /**
   * get请求
   * @param url 
   * @param param 
   * @param callback 
   * @param setRequestHeader 
   */
  static get(url, param, callback, setRequestHeader) {
    this.http(url, "get", param, callback, setRequestHeader);
  }
  /**
   * post 请求
   * @param url 
   * @param param 
   * @param callback 
   * @param setRequestHeader
   */
  static post(url, param, callback, setRequestHeader) {
    this.http(url, "post", param, callback, setRequestHeader);
  }
  static http(url, method, param, callback, setRequestHeader) {
    if (param) {
      let s = "?";
      for (let key in param) {
        let p = this.isValidKey(key, param);
        url += `${s}${key}=${p}`;
        s = "&";
      }
    }
    Logger.log(`http send:${url}`, Logger.TYPE.NET);
    let request = new XMLHttpRequest();
    if (method == "get") {
      request.open("get", url, true);
    } else {
      request.open("post", url);
    }
    if (setRequestHeader != null) {
      setRequestHeader(request);
    } else {
      this.setRequestHeader(request);
    }
    request.onreadystatechange = () => {
      console.log("url : " + request.responseURL);
      if (request.readyState == 4) {
        let status = request.status;
        let txt = request.responseText;
        if (status >= 200 && status < 300) {
          Logger.log(`url:(${url}) result:${txt})`, Logger.TYPE.NET);
          callback(void 0, txt);
        } else {
          Logger.log(`url:(${url}) request error. status:(${request.status})`, Logger.TYPE.NET);
          callback(new Error(`Http:${method}\u5931\u8D25:${url}`));
        }
      }
    };
    request.send();
  }
  static isValidKey(key, object) {
    return key in object;
  }
  /**
   * 设置http头
   * @param request XMLHttpRequest
   */
  static setRequestHeader(request) {
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8;application/x-www-form-urlencoded;application/json;charset=UTF-8");
    request.setRequestHeader("Cache-Control", "no-store");
  }
};

// src/net/socket/SocketManagerImpl.ts
var SocketManagerImpl = class {
  constructor() {
    this.__socketMap = /* @__PURE__ */ new Map();
  }
  initSocket(protocal, name) {
    if (this.__socketMap.has(name)) {
      throw new Error(`socket ${name} is exist`);
    }
    if (protocal == null) {
      throw new Error("protocal is null");
    }
    let socket = new Socket(protocal);
    socket.name = name;
    this.__socketMap.set(name, socket);
    return socket;
  }
  /**
   * socket是否存在
   * @param name 
   * @returns 
   */
  hasSocket(name) {
    return this.__socketMap.has(name);
  }
  /**
   * 获取指定类型的长链接
   * @param name 
   */
  getSocket(name) {
    if (!this.__socketMap.has(name)) {
      throw new Error(`socket ${name} is not exist`);
    }
    return this.__socketMap.get(name);
  }
};

// src/net/socket/SocketManager.ts
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2["SOCKET_CONNECTED"] = "SOCKET_CONNECTED";
  EventType2["SOCKET_ERROR"] = "SOCKET_ERROR";
  EventType2["SOCKET_CLOSE"] = "SOCKET_CLOSE";
  return EventType2;
})(EventType || {});
var SocketManager = class {
  /**
   * 设置默认socket
   * @param type 
   */
  static setDefaultSocket(type) {
    this.__default_socket = type;
  }
  /**
   * socket是否存在
   * @param name 
   * @returns 
   */
  static hasSocket(name) {
    return this.impl.hasSocket(name);
  }
  /**
   * 初始化socket
   * @param name 
   * @param protocal 
   * @returns 
   */
  static initSocket(protocal, name) {
    if (name == void 0) {
      name = this.__default_socket;
    }
    if (name == void 0) {
      throw new Error("\u8BF7\u5148\u8BBE\u7F6E\u9ED8\u8BA4socket\u7C7B\u578B");
    }
    return this.impl.initSocket(protocal, name);
  }
  /**
   * 获取指定类型的长链接
   * @param name 
   * @returns 
   */
  static getSocket(name) {
    if (name == void 0) {
      name = this.__default_socket;
    }
    if (name == void 0) {
      throw new Error("\u8BF7\u5148\u8BBE\u7F6E\u9ED8\u8BA4socket\u7C7B\u578B");
    }
    return this.impl.getSocket(name);
  }
  static get impl() {
    if (this.__impl == null) {
      this.__impl = Injector.getInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new SocketManagerImpl();
    }
    return this.__impl;
  }
};
SocketManager.KEY = "SocketManager";
/**
 * sokcet事件类型枚举
 */
SocketManager.EventType = EventType;
SocketManager.__default_socket = "GameSocket";

// src/net/socket/Socket.ts
var _Socket = class _Socket extends EventDispatcher {
  constructor(message_parser) {
    super();
    /**
     * 当前错误次数
     */
    this.error_count = 0;
    this.is_conected = false;
    if (message_parser == null) throw new Error("message_parser is null");
    this.cache_msgs = /* @__PURE__ */ new Map();
    this.message_protocol = message_parser;
    this.message_protocol.parse_callback = this.onMessageParseCallback.bind(this);
  }
  getCacheMsg(code) {
    if (!this.cache_msgs.has(code)) return null;
    let msg = this.cache_msgs.get(code);
    this.cache_msgs.delete(code);
    return msg;
  }
  isConected() {
    return this.is_conected;
  }
  /**
   * 链接
   * @param url 
   * @param binaryType 
   */
  connect(url, binaryType = "arraybuffer") {
    this.web_socket = new WebSocket(url);
    this.web_socket.binaryType = binaryType;
    this.web_socket.onclose = this.onclose.bind(this);
    this.web_socket.onerror = this.onerror.bind(this);
    this.web_socket.onopen = this.onopen.bind(this);
    this.web_socket.onmessage = this.onmessage.bind(this);
    this.error_count = 0;
  }
  /**
   * 重新链接
   * @returns 
   */
  reconnect() {
    const readyState = this.web_socket.readyState;
    if (readyState == WebSocket.CONNECTING || readyState == WebSocket.OPEN) return;
    if (this.web_socket) {
      this.web_socket.close();
      this.web_socket.onclose = null;
      this.web_socket.onerror = null;
      this.web_socket.onopen = null;
      this.web_socket.onmessage = null;
    }
    this.web_socket = new WebSocket(this.web_socket.url);
    this.web_socket.onclose = this.onclose.bind(this);
    this.web_socket.onerror = this.onerror.bind(this);
    this.web_socket.onopen = this.onopen.bind(this);
    this.web_socket.onmessage = this.onmessage.bind(this);
  }
  /**
   * 关闭
   */
  close() {
    this.web_socket.close();
    this.is_conected = false;
  }
  onopen(e) {
    this.is_conected = true;
    this.emit(SocketManager.EventType.SOCKET_CONNECTED);
  }
  /**
   * 发送协议
   * @param code 
   * @param data 
   */
  send(code, data) {
    Logger.log("[" + this.name + "][C2S]" + code + "  =>" + JSON.stringify(data), Logger.TYPE.NET);
    this.web_socket.send(this.message_protocol.encode(code, data));
  }
  onmessage(e) {
    this.message_protocol.decode(e.data);
  }
  onMessageParseCallback(code, data) {
    Logger.log("[" + this.name + "][S2C]" + code + "    <=" + JSON.stringify(data), Logger.TYPE.NET);
    if (this.hasEvent(code)) {
      this.emit(code, data);
    } else {
      console.log(this.name + " \u68C0\u6D4B\u5230\u672A\u5904\u7406\u6D88\u606F:" + code + ",\u5185\u90E8\u5C06\u7F13\u5B58\u8BE5\u6D88\u606F");
      this.cache_msgs.set(code, data);
    }
  }
  onclose(e) {
    this.emit(SocketManager.EventType.SOCKET_CLOSE);
  }
  onerror(e) {
    this.is_conected = false;
    this.error_count++;
    if (this.error_count < _Socket.MAX_ERROR_COUNT) {
      this.reconnect();
    } else {
      this.emit(SocketManager.EventType.SOCKET_ERROR, null, new Error(this.name + " socket \u94FE\u63A5\u9519\u8BEF!"));
    }
  }
};
/**
 * 最大允许错误次数
 */
_Socket.MAX_ERROR_COUNT = 3;
var Socket = _Socket;

// src/tasks/Task.ts
var Task = class extends EventDispatcher {
  /**
   * 开始
   * @param data 
   */
  start(data) {
  }
  addEventHandler(handler, caller) {
    this.on(Event.PROGRESS, handler, caller);
    this.on(Event.COMPLETE, handler, caller);
    this.on(Event.ERROR, handler, caller);
  }
  removeEventHandler(handler, caller) {
    this.off(Event.PROGRESS, handler, caller);
    this.off(Event.COMPLETE, handler, caller);
    this.off(Event.ERROR, handler, caller);
  }
  /**
   * 销毁
   */
  destroy() {
    this.offAllEvent();
    return super.destroy();
  }
};

// src/tasks/TaskQueue.ts
var TaskQueue = class extends Task {
  constructor() {
    super();
    this.__index = 0;
    this.__taskList = [];
  }
  addTask(value) {
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        this.__addTask(element);
      }
    } else {
      this.__addTask(value);
    }
  }
  __addTask(value) {
    if (this.__taskList.indexOf(value) >= 0) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0\uFF01");
    }
    this.__taskList.push(value);
  }
  removeTask(value) {
    let index = this.__taskList.indexOf(value);
    if (index < 0) {
      throw new Error("\u672A\u627E\u5230\u8981\u5220\u9664\u7684\u5185\u5BB9\uFF01");
    }
    this.__taskList.splice(index, 1);
  }
  start(data) {
    this.__data = data;
    this.__index = 0;
    this.__tryNext();
  }
  __tryNext() {
    if (this.__index < this.__taskList.length) {
      let task = this.__taskList[this.__index];
      task.on(Event.COMPLETE, this.__subTaskEventHandler, this);
      task.on(Event.PROGRESS, this.__subTaskEventHandler, this);
      task.on(Event.ERROR, this.__subTaskEventHandler, this);
      task.start(this.__data);
    } else {
      this.emit(Event.COMPLETE);
    }
  }
  __subTaskEventHandler(e) {
    if (e.type == Event.PROGRESS) {
      let progress = (this.__index + e.progress) / this.__taskList.length;
      this.emit(Event.PROGRESS, void 0, void 0, progress);
      return;
    }
    e.target.offAllEvent();
    if (e.type == Event.ERROR) {
      this.emit(Event.ERROR, void 0, e.error);
      return;
    }
    e.target.destroy();
    this.__index++;
    this.__tryNext();
  }
  destroy() {
    this.__taskList.length = 0;
    this.__index = 0;
    return super.destroy();
  }
};

// src/tasks/TaskSequence.ts
var TaskSequence = class extends Task {
  constructor() {
    super();
    this.__taskList = new Array();
    this.__index = 0;
  }
  addTask(value) {
    if (this.__taskList.indexOf(value) >= 0) {
      throw new Error("\u91CD\u590D\u6DFB\u52A0\uFF01");
    }
    this.__taskList.push(value);
  }
  removeTask(value) {
    let index = this.__taskList.indexOf(value);
    if (index < 0) {
      throw new Error("\u627E\u4E0D\u5230\u8981\u5220\u9664\u7684\u5185\u5BB9!");
    }
    this.__taskList.splice(index, 1);
  }
  start(data) {
    for (let index = 0; index < this.__taskList.length; index++) {
      const element = this.__taskList[index];
      element.on(Event.COMPLETE, this.__subTaskEventHandler, this);
      element.on(Event.ERROR, this.__subTaskEventHandler, this);
      element.on(Event.PROGRESS, this.__subTaskEventHandler, this);
      element.start(data);
    }
  }
  __subTaskEventHandler(e) {
    if (e.type == Event.PROGRESS) {
      this.emit(Event.PROGRESS, void 0, void 0, this.__index / this.__taskList.length);
      return;
    }
    e.target.offAllEvent();
    if (e.type == Event.ERROR) {
      this.emit(Event.ERROR, void 0, e.error);
      return;
    }
    this.__index++;
    if (this.__index < this.__taskList.length) {
      return;
    }
    e.target.destroy();
    this.emit(Event.COMPLETE);
  }
  destroy() {
    this.__taskList.length = 0;
    this.__index = 0;
    return super.destroy();
  }
};

// src/utils/BitFlag.ts
var BitFlag = class {
  constructor() {
    this.__flags = 0;
    this.__elements = [];
  }
  reset() {
    this.__flags = 0;
  }
  add(flag) {
    this.__flags |= flag;
    if (this.__elements.indexOf(flag) < 0) {
      this.__elements.push(flag);
    }
  }
  remove(flag) {
    this.__flags ^= flag;
    let index = this.__elements.indexOf(flag);
    if (index >= 0) {
      this.__elements.splice(index, 1);
    }
  }
  /**
   * 是否包含
   * @param flag 
   * @returns 
   */
  has(flag) {
    return (this.__flags & flag) == flag;
  }
  /**
   * 位码
   */
  get flags() {
    return this.__flags;
  }
  get elements() {
    return this.__elements;
  }
  destroy() {
    this.__flags = 0;
    this.__elements.length = 0;
    this.__elements = null;
  }
  static getBit(value) {
    if (this.TYPES.has(value)) {
      return this.TYPES.get(value);
    }
    this.TYPE_IDX++;
    let result = Math.pow(2, this.TYPE_IDX);
    this.TYPES.set(value, result);
    this.BITS.set(result, value);
    return result;
  }
  static getType(bit) {
    return this.BITS.get(bit);
  }
};
//======================================================静态工具
BitFlag.TYPES = /* @__PURE__ */ new Map();
BitFlag.BITS = /* @__PURE__ */ new Map();
BitFlag.TYPE_IDX = 0;

// src/utils/Handler.ts
var Handler = class {
  constructor() {
  }
  reset() {
    this.method = null;
    this.caller = null;
  }
  destroy() {
    this.reset();
    return true;
  }
  /**
   * 运行
   * @param args 
   */
  run(...args) {
    let result = null;
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
  equal(value) {
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
  equals(method, caller) {
    if (this.method == method && this.caller == caller) {
      return true;
    }
    return false;
  }
};

// src/utils/StringUtils.ts
var StringUtils = class {
  /**
   * 判断字符串是否为空
   * @param str 
   * @returns 
   */
  static isEmpty(str) {
    return !str || str.length === 0;
  }
  /**
   * 字符转二维数组
   * @param str 
   * @returns 
   */
  static str2NumArrList(str, separators = ["|", ","]) {
    if (separators.length < 2) throw new Error("separators \u957F\u5EA6\u4E0D\u80FD\u5C0F\u4E8E2");
    if (!str) return [];
    let strArr = str.split(separators[0]);
    let len = strArr.length;
    let res = [];
    for (let i = 0; i < len; i++) {
      let arr = strArr[i].split(separators[1]).map((item) => Number(item));
      res.push(arr);
    }
    return res;
  }
  /**
   * 字符串转二维数组
   * @param str 
   * @param separators 
   * @returns 
   */
  static str2StringList(str, separators = ["|", ","]) {
    let strArr = str.split(separators[0]);
    let len = strArr.length;
    let res = [];
    for (let i = 0; i < len; i++) {
      let arr = strArr[i].split(separators[1]);
      res.push(arr);
    }
    return res;
  }
  /**
   * 参数替换
   *  @param  str
   *  @param  rest
   *  
   *  @example
   *
   *  let str:string = "你好{},这里是:{}";
   *  console.log(StringUtil.substitute2(str, "蝈蝈","蓝星"));
   *
   *  // 输出结果如下:
   *  // "你好蝈蝈,这里是:蓝星"
   */
  static substitute(str, ...rest) {
    if (str == null) return "";
    let len = rest.length;
    let args;
    if (len == 1 && rest[0] instanceof Array) {
      args = rest[0];
      len = args.length;
    } else {
      args = rest;
    }
    let idx = 0;
    return str.replace(/{}/g, (_, index) => {
      return args[idx++];
    });
  }
  /**
   * 参数替换
   *  @param  str
   *  @param  rest
   *  
   *  @example
   *
   *  let str:string = "here is some info '{0}' and {1}";
   *  console.log(StringUtil.substitute(str, 15.4, true));
   *
   *  // this will output the following string:
   *  // "here is some info '15.4' and true"
   */
  static substitute2(str, ...rest) {
    if (str == null) return "";
    let len = rest.length;
    let args;
    if (len == 1 && rest[0] instanceof Array) {
      args = rest[0];
      len = args.length;
    } else {
      args = rest;
    }
    for (let i = 0; i < len; i++) {
      str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
    }
    return str;
  }
  /**
   * 获取资源父文件夹
   * @param url 
   * @param separator 
   * @returns 
   */
  static getDir(url, separator = "/") {
    let arr = url.split(separator);
    if (arr.length > 1) {
      arr.pop();
      return arr.join(separator);
    }
    return "";
  }
};

// src/utils/I18N.ts
var I18N = class {
  constructor() {
  }
  /**
   * 转换
   * @param value 
   * @param rest 
   * @returns 
   */
  static tr(value, ...rest) {
    let langeValue;
    let acc = ConfigManager.getAccessor(this.sheetName);
    if (!acc) {
      acc = ConfigManager.getAccessor(this.defaultSheetName);
    }
    if (acc) {
      let sheetItem = acc.getOne(this.sheetItem.key, value);
      if (sheetItem == null || rest == void 0) {
        langeValue = value;
      } else {
        langeValue = sheetItem[this.sheetItem.value];
      }
    } else {
      langeValue = value;
    }
    if (rest == null || rest == void 0 || rest.length == 0) {
      return langeValue;
    }
    return StringUtils.substitute(langeValue, rest);
  }
  /**
   * 多语言资源路径
   * @param url 
   */
  static tr_res(url) {
    return this.langenge + "/" + url;
  }
  static get sheetName() {
    return this.fileName + "/" + this.langenge;
  }
  static get defaultSheetName() {
    return this.fileName + "/zh_CN";
  }
};
/**
 * 多语言表名
 */
I18N.fileName = "language";
/**
 * 当前语言
 */
I18N.langenge = "zh_CN";
/**
 * 多语言项数据
 */
I18N.sheetItem = { key: "id", value: "value" };
var L18Acc = class extends BaseConfigAccessor {
  constructor() {
    super();
    this.addStorage([I18N.sheetItem.key]);
  }
};

// src/utils/MathUtils.ts
var _MathUtils = class _MathUtils {
  /**
   * 检测是否相等
   * @param a
   * @param b
   * @returns true 相等 false不相等
   */
  static equals(a, b) {
    return Math.abs(a - b) <= _MathUtils.ZeroTolerance;
  }
  /**
   * 强制取整，去掉小数点后的数字
   * @param v 
   * @returns 
   */
  static int(v) {
    return parseInt(v.toString(), 10);
  }
  /**
   * 求2条线段之间的交点
   * @param a 
   * @param b 
   * @param c 
   * @param d 
   * @param result 
   * @returns 
   */
  static getIntersectionPoint(a, b, c, d, result) {
    result = result || { x: 0, y: 0 };
    var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
    var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
    if (area_abc * area_abd >= 0) {
      return null;
    }
    var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
    var area_cdb = area_cda + area_abc - area_abd;
    if (area_cda * area_cdb >= 0) {
      return null;
    }
    var t = area_cda / (area_abd - area_abc);
    var dx = t * (b.x - a.x), dy = t * (b.y - a.y);
    result.x = a.x + dx;
    result.y = a.y + dy;
    return result;
  }
  /**
   * 点到线段的垂点
   * @param px 
   * @param py 
   * @param sx 
   * @param sy 
   * @param ex 
   * @param ey 
   */
  static getPerpendicularPoint(px, py, sx, sy, ex, ey, result) {
    result = result || { x: 0, y: 0 };
    let dx = ex - sx;
    let dy = ey - sy;
    let k = (ex - sx) * (px - sx) + (ey - sy) * (py - sy);
    k /= dx * dx + dy * dy;
    if (k >= 0 && k <= 1) {
      result.x = sx + k * dx;
      result.y = sy + k * dy;
      return result;
    }
    return null;
  }
  /**
   * 点到线段的距离 
   * @param P3
   * @param PA
   * @param PB
   * @return 
   */
  static getNearestDistance(target, pa, pb) {
    let targetPoint = { x: 0, y: 0 };
    let aPoint = { x: 0, y: 0 };
    let bPoint = { x: 0, y: 0 };
    targetPoint.x = target.x;
    targetPoint.y = target.y;
    aPoint.x = pa.x;
    aPoint.y = pa.y;
    bPoint.x = pb.x;
    bPoint.y = pb.y;
    var a, b, c;
    a = this.distance(bPoint.x, bPoint.y, targetPoint.x, targetPoint.y);
    if (a <= 1e-5)
      return 0;
    b = this.distance(aPoint.x, aPoint.y, targetPoint.x, targetPoint.y);
    if (b <= 1e-5)
      return 0;
    c = this.distance(aPoint.x, aPoint.y, bPoint.x, bPoint.y);
    if (c <= 1e-5)
      return a;
    if (a * a >= b * b + c * c)
      return b;
    if (b * b >= a * a + c * c)
      return a;
    var l = (a + b + c) / 2;
    var s = Math.sqrt(l * (l - a) * (l - b) * (l - c));
    return 2 * s / c;
  }
  /**
   * 向量点乘
   * @param ax 
   * @param ay 
   * @param bx 
   * @param by 
   * @returns   0 互相垂直 >0 向量夹角小于90度 <0向量夹角大于90度
   */
  static vectorDot(ax, ay, bx, by) {
    return ax * bx + ay * by;
  }
  /**
   * 向量叉乘
   * @param a 
   * @param b 
   * @param out 
   */
  static vectorCross(ax, ay, bx, by) {
    return ax * by - ay * bx;
  }
  /**
   * 求两个向量之间的夹角
   * @param av        单位向量
   * @param bv        单位向量
   */
  static calculateAngle(ax, ay, bx, by) {
    return Math.acos(this.vectorDot(ax, ay, bx, by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by)));
  }
  /**
  * 求两点之间距离
  * @param ax 
  * @param ay 
  * @param bx 
  * @param by 
  * @returns 
  */
  static distance(ax, ay, bx, by) {
    const x = bx - ax;
    const y = by - ay;
    return Math.sqrt(x * x + y * y);
  }
  /**
   * 求距离的二次方
   * @param ax 
   * @param ay 
   * @param bx 
   * @param by 
   * @returns 
   */
  static distanceSquared(ax, ay, bx, by) {
    const x = bx - ax;
    const y = by - ay;
    return x * x + y * y;
  }
  /**
   * 是否包含在圆内
   * @param x 
   * @param y 
   * @param ox 
   * @param oy 
   * @param r 
   * @returns 
   */
  static inTheCircle(x, y, ox, oy, r) {
    let dis = this.distance(x, y, ox, oy);
    if (dis < r) {
      return true;
    }
    return false;
  }
};
_MathUtils.ZeroTolerance = 1e-3;
_MathUtils.Angle90 = Math.PI * 0.5;
_MathUtils.Rad2Angle = 180 / Math.PI;
_MathUtils.Angle2Rad = Math.PI / 180;
var MathUtils = _MathUtils;

// src/utils/ObjectUtils.ts
var ObjectUtils = class {
  /**
   * 将source对象属性拷贝到target对象
   * @param source 
   * @param target 
   */
  static oto(source, target) {
    for (let key in source) {
      target[key] = source[key];
    }
  }
  /**
   * 深度克隆
   * @param source 
   * @returns 
   */
  static deepClone(source) {
    if (!source || typeof source != "object")
      return null;
    var obj_str = JSON.stringify(source);
    let result = JSON.parse(obj_str);
    return result;
  }
  /**
   * 清理对象
   * @param obj 
   */
  static clear(obj) {
    for (let key in obj) {
      delete obj[key];
    }
  }
};

// src/Engine.ts
var Engine = class {
  /**
   * 启动引擎
   * @param plugins 
   * @param progress 
   * @param cb 
   */
  static start(plugins, progress, cb) {
    if (this.inited) {
      throw new Error("\u91CD\u590D\u542F\u52A8\u5F15\u64CE!");
    }
    Res.setLoader(Res.TYPE.CONFIG, LocalConfigLoader);
    if (I18N.langenge != "zh_CN") {
      ConfigManager.register(I18N.defaultSheetName, L18Acc);
    }
    ConfigManager.register(I18N.sheetName, L18Acc);
    let setup_idx = 0;
    let total_count = plugins.length;
    for (let idx = 0; idx < plugins.length; idx++) {
      const plugin = plugins[idx];
      plugin.on(Event.PROGRESS, (e) => {
        progress && progress((setup_idx + e.progress) / total_count);
      }, this);
      plugin.on(Event.ERROR, (e) => {
        cb && cb(e.error);
        plugin.offAllEvent();
      }, this);
      plugin.on(Event.COMPLETE, (e) => {
        let target = e.target;
        target.offAllEvent();
        setup_idx++;
        if (setup_idx >= total_count) {
          cb && cb(null);
        }
      }, this);
      plugin.start();
      this.plugins.set(plugin.name, plugin);
      this.inited = true;
    }
  }
  /**
   * 获取插件
   * @param name 
   * @returns 
   */
  static getPlugin(name) {
    return this.plugins.get(name);
  }
  /**
   * 心跳驱动
   * @param dt 
   * @returns 
   */
  static tick(dt) {
    if (!this.inited) {
      return;
    }
    TickerManager.tick(dt);
  }
};
Engine.plugins = /* @__PURE__ */ new Map();
Engine.inited = false;
export {
  ArrayProperty,
  ArrayValue,
  AudioManager,
  BaseConfigAccessor,
  BaseValue,
  Binder,
  BitFlag,
  CCLoader,
  ChangedData,
  ClassUtils,
  ConfigManager,
  ConfigStorage,
  Dictionary,
  DictionaryProperty,
  DictionaryValue,
  Engine,
  Event,
  EventDispatcher,
  Func,
  FuncNode,
  FunctionHook,
  Handler,
  Http,
  I18N,
  IDConfigAccessor,
  Injector,
  JSONDeserialization,
  JSONSerialization,
  List,
  LoaderManager,
  LocalConfigLoader,
  Logger,
  MathUtils,
  Module,
  ModuleManager,
  NumberProperty,
  NumberValue,
  ObjectUtils,
  Pool,
  PropertyBinder,
  RedPoint,
  RedPointNode,
  RemoteConfigLoader,
  Res,
  ResRef,
  ResRequest,
  Resource,
  ResourceManager,
  SerDes,
  SerDesMode,
  Socket,
  SocketManager,
  SocketManagerImpl,
  StringProperty,
  StringUtils,
  StringValue,
  Task,
  TaskQueue,
  TaskSequence,
  TickerManager,
  Timer
};
//# sourceMappingURL=dream-cc-core.mjs.map
