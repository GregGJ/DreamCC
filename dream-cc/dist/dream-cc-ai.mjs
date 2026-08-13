var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/behaviorTree/BTNodeStatus.ts
var BTNodeStatus = /* @__PURE__ */ ((BTNodeStatus2) => {
  BTNodeStatus2[BTNodeStatus2["IDLE"] = 0] = "IDLE";
  BTNodeStatus2[BTNodeStatus2["FAILURE"] = 1] = "FAILURE";
  BTNodeStatus2[BTNodeStatus2["SUCCESS"] = 2] = "SUCCESS";
  BTNodeStatus2[BTNodeStatus2["RUNNING"] = 3] = "RUNNING";
  return BTNodeStatus2;
})(BTNodeStatus || {});

// src/behaviorTree/BTNodeType.ts
var BTNodeType = /* @__PURE__ */ ((BTNodeType2) => {
  BTNodeType2[BTNodeType2["ERROR"] = 0] = "ERROR";
  BTNodeType2[BTNodeType2["CONTROL"] = 1] = "CONTROL";
  BTNodeType2[BTNodeType2["DECORATOR"] = 2] = "DECORATOR";
  BTNodeType2[BTNodeType2["ACTION"] = 3] = "ACTION";
  BTNodeType2[BTNodeType2["CONDITION"] = 4] = "CONDITION";
  return BTNodeType2;
})(BTNodeType || {});

// src/behaviorTree/BTNode.ts
var BTNode = class {
  constructor(name, blackboard) {
    /**父节点*/
    this.parent = null;
    /**状态 */
    this.$status = 0 /* IDLE */;
    this.name = name;
    this.blackboard = blackboard;
  }
  init(data) {
  }
  evaluate() {
    this.status = this.tick();
    return this.status;
  }
  destroy() {
    this.parent = null;
    this.blackboard = null;
  }
  /**获取状态*/
  get status() {
    return this.$status;
  }
  set status(value) {
    this.$status = value;
  }
  get type() {
    return 0 /* ERROR */;
  }
};

// src/behaviorTree/actions/BTActionNode.ts
var BTActionNode = class extends BTNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  get type() {
    return 3 /* ACTION */;
  }
};

// src/behaviorTree/actions/BTAsyncActionNode.ts
var BTAsyncActionNode = class extends BTActionNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.halt_requested = false;
  }
  evaluate() {
    if (this.status === 0 /* IDLE */) {
      this.status = 3 /* RUNNING */;
      this.halt_requested = false;
      (() => __async(this, null, function* () {
        try {
          this.status = yield this.tick();
        } catch (error) {
          throw new Error(error);
        }
      }))();
    }
    return this.status;
  }
  isHaltRequested() {
    return this.halt_requested;
  }
  halt() {
    this.halt_requested = true;
  }
};

// src/behaviorTree/actions/BTCoroActionNode.ts
var BTCoroActionNode = class extends BTActionNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.yield = false;
  }
  setStatusRunningAndYield() {
    this.status = 3 /* RUNNING */;
    this.yield = true;
  }
  evaluate() {
    if (!this.yield) {
      this.status = this.tick();
    }
    return this.status;
  }
  halt() {
    this.yield = false;
  }
};

// src/behaviorTree/actions/BTSimpleActionNode.ts
var BTSimpleActionNode = class extends BTAsyncActionNode {
  constructor(name, blackboard, tickFunctor) {
    super(name, blackboard);
    this.tickFunctor = tickFunctor;
  }
  tick() {
    let prevStatuc = this.status;
    if (prevStatuc === 0 /* IDLE */) {
      this.status = 3 /* RUNNING */;
      prevStatuc = 3 /* RUNNING */;
    }
    let status = this.tickFunctor(this);
    if (status !== prevStatuc) {
      this.status = status;
    }
    return status;
  }
};

// src/behaviorTree/actions/BTStatefulActionNode.ts
var BTStatefulActionNode = class extends BTActionNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  tick() {
    const initial_status = this.status;
    if (initial_status === 0 /* IDLE */) {
      const new_status = this.onEnter();
      if (new_status === 0 /* IDLE */) {
        throw new Error("AsyncActionNode2::onStart() must not return IDLE");
      }
      if (new_status != 3 /* RUNNING */) {
        this.onExit();
      }
      return new_status;
    }
    if (initial_status === 3 /* RUNNING */) {
      const new_status = this.onTick();
      if (new_status === 0 /* IDLE */) {
        throw new Error("AsyncActionNode2::onRunning() must not return IDLE");
      }
      if (new_status != 3 /* RUNNING */) {
        this.onExit();
      }
      return new_status;
    }
    return initial_status;
  }
  halt() {
    if (this.status === 3 /* RUNNING */) {
      this.onHalted();
    }
    this.status = 0 /* IDLE */;
  }
  /**被打断 */
  onHalted() {
    this.onExit();
  }
};

// src/behaviorTree/actions/BTSyncActionNode.ts
var BTSyncActionNode = class extends BTActionNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  // throws if the derived class return RUNNING.
  evaluate() {
    const stat = super.evaluate();
    if (stat === 3 /* RUNNING */) {
      throw new Error("SyncActionNode MUST never return RUNNING");
    }
    return stat;
  }
  halt() {
    this.status = 0 /* IDLE */;
  }
};

// src/behaviorTree/conditions/BTConditionNode.ts
var BTConditionNode = class extends BTNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  halt() {
    this.status = 0 /* IDLE */;
  }
  get type() {
    return 4 /* CONDITION */;
  }
};

// src/behaviorTree/conditions/BTSimpleConditionNode.ts
var BTSimpleConditionNode = class extends BTConditionNode {
  constructor(name, blackboard, tick_functor) {
    super(name, blackboard);
    this.tick_functor = tick_functor;
  }
  tick() {
    return this.tick_functor(this);
  }
};

// src/behaviorTree/controls/BTControlNode.ts
var BTControlNode = class extends BTNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.$children = [];
    this.$children = [];
  }
  addChild(child) {
    if (this.$children.indexOf(child) > -1) {
      throw new Error("child already exists");
    }
    this.$children.push(child);
    child.parent = this;
  }
  getChild(idx) {
    if (idx < 0 || idx >= this.$children.length) {
      throw new Error("index out of range");
    }
    return this.$children[idx];
  }
  halt() {
    this.haltChildren();
    this.status = 0 /* IDLE */;
  }
  haltChild(idx) {
    if (idx < 0 || idx >= this.$children.length) {
      throw new Error("index out of range");
    }
    const child = this.$children[idx];
    if (child.status === 3 /* RUNNING */) {
      child.halt();
    }
    child.status = 0 /* IDLE */;
  }
  haltChildren(start = 0) {
    for (let i = start; i < this.$children.length; ++i) {
      this.haltChild(i);
    }
  }
  destroy() {
    this.haltChildren();
    for (let i = 0; i < this.$children.length; ++i) {
      const child = this.$children[i];
      child.destroy();
    }
    super.destroy();
  }
  get numChildren() {
    return this.$children.length;
  }
  get type() {
    return 1 /* CONTROL */;
  }
};

// src/behaviorTree/controls/BTFallbackNode.ts
var BTFallbackNode = class extends BTControlNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.__current_child_idx = 0;
  }
  tick() {
    const child_count = this.numChildren;
    this.status = 3 /* RUNNING */;
    while (this.__current_child_idx < child_count) {
      const child_node = this.$children[this.__current_child_idx];
      const child_status = child_node.evaluate();
      switch (child_status) {
        case 3 /* RUNNING */:
          return child_status;
        case 2 /* SUCCESS */:
          this.haltChildren();
          this.__current_child_idx = 0;
          return child_status;
        case 1 /* FAILURE */:
          this.__current_child_idx++;
          break;
        case 0 /* IDLE */:
          throw new Error("NodeStatus.IDLE is not allowed in FallbackNode");
        default:
          throw new Error("Unknown NodeStatus");
      }
    }
    if (this.__current_child_idx == child_count) {
      this.haltChildren();
      this.__current_child_idx = 0;
    }
    return 1 /* FAILURE */;
  }
  halt() {
    this.__current_child_idx = 0;
    super.halt();
  }
};

// src/behaviorTree/controls/BTIfThenElseNode.ts
var BTIfThenElseNode = class extends BTControlNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.__child_idx = 0;
  }
  tick() {
    if (this.numChildren != 2 && this.numChildren != 3) {
      throw new Error(this.name + "IfThenElseNode:the number of children must be 2 or 3");
    }
    this.status = 3 /* RUNNING */;
    if (this.__child_idx == 0) {
      const condition_status = this.$children[0].evaluate();
      if (condition_status == 3 /* RUNNING */) {
        return condition_status;
      } else if (condition_status == 2 /* SUCCESS */) {
        this.__child_idx = 1;
      } else if (condition_status == 1 /* FAILURE */) {
        if (this.numChildren == 3) {
          this.__child_idx = 2;
        } else {
          return condition_status;
        }
      }
    }
    if (this.__child_idx > 0) {
      const child_status = this.$children[this.__child_idx].evaluate();
      if (child_status == 3 /* RUNNING */) {
        return 3 /* RUNNING */;
      } else {
        this.haltChildren();
        this.__child_idx = 0;
        return child_status;
      }
    }
    throw new Error(this.name + "Something unexpected happened in IfThenElseNode");
  }
  halt() {
    this.__child_idx = 0;
    super.halt();
  }
};

// src/behaviorTree/controls/BTParallelNode.ts
var BTParallelNode = class extends BTControlNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.success_threshold = 0;
    this.failure_threshold = 1;
    this.__skip_list = /* @__PURE__ */ new Map();
  }
  init(data) {
    if (data.hasOwnProperty("success")) {
      this.success_threshold = data["success"];
    }
    if (data.hasOwnProperty("failure")) {
      this.failure_threshold = data["failure"];
    }
    this.success_threshold = Math.max(this.success_threshold, 0);
    this.failure_threshold = Math.max(this.failure_threshold, 1);
  }
  tick() {
    let success_childred_num = 0;
    let failure_childred_num = 0;
    const children_count = this.$children.length;
    if (children_count < this.success_threshold) {
      throw new Error("Number of children is less than threshold. Can never succeed.");
    }
    if (children_count < this.failure_threshold) {
      throw new Error("Number of children is less than threshold. Can never fail.");
    }
    for (let i = 0; i < children_count; i++) {
      const child_node = this.$children[i];
      const in_skip_list = this.__skip_list.has(i);
      let child_status;
      if (in_skip_list) {
        child_status = child_node.status;
      } else {
        child_status = child_node.evaluate();
      }
      switch (child_status) {
        case 2 /* SUCCESS */:
          {
            if (!in_skip_list) {
              this.__skip_list.set(i, i);
            }
            success_childred_num++;
            if (success_childred_num == this.success_threshold) {
              this.__skip_list.clear();
              this.haltChildren();
              return 2 /* SUCCESS */;
            }
          }
          break;
        case 1 /* FAILURE */:
          {
            if (!in_skip_list) {
              this.__skip_list.set(i, i);
            }
            failure_childred_num++;
            if (failure_childred_num > children_count - this.success_threshold || failure_childred_num == this.failure_threshold) {
              this.__skip_list.clear();
              this.haltChildren();
              return 1 /* FAILURE */;
            }
          }
          break;
        case 3 /* RUNNING */:
          {
          }
          break;
        default: {
          throw new Error("A child node must never return IDLE");
        }
      }
    }
    return 3 /* RUNNING */;
  }
  halt() {
    this.__skip_list.clear();
    super.halt();
  }
  destroy() {
    this.__skip_list.clear();
    super.destroy();
  }
};

// src/behaviorTree/controls/BTReactiveFallback.ts
var BTReactiveFallback = class extends BTControlNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  tick() {
    let failure_count = 0;
    for (let index = 0; index < this.numChildren; index++) {
      const child = this.$children[index];
      const child_status = child.evaluate();
      switch (child_status) {
        case 3 /* RUNNING */:
          this.haltChildren(index + 1);
          return 3 /* RUNNING */;
        case 1 /* FAILURE */:
          failure_count++;
          break;
        case 2 /* SUCCESS */:
          this.haltChildren();
          return 2 /* SUCCESS */;
        case 0 /* IDLE */:
          throw new Error("ReactiveFallback: child node is idle");
        default:
          throw new Error("ReactiveFallback: unknown child node status");
      }
    }
    if (failure_count == this.numChildren) {
      this.haltChildren();
      return 1 /* FAILURE */;
    }
    return 3 /* RUNNING */;
  }
};

// src/behaviorTree/controls/BTSequenceNode.ts
var BTSequenceNode = class extends BTControlNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.__current_index = 0;
  }
  halt() {
    this.__current_index = 0;
    super.halt();
  }
  tick() {
    this.status = 3 /* RUNNING */;
    while (this.__current_index < this.numChildren) {
      const child = this.$children[this.__current_index];
      const child_status = child.evaluate();
      switch (child_status) {
        case 3 /* RUNNING */:
          return child_status;
        case 1 /* FAILURE */:
          this.haltChildren();
          this.__current_index = 0;
          return child_status;
        case 2 /* SUCCESS */:
          this.__current_index++;
          break;
        case 0 /* IDLE */:
          throw new Error("NodeStatus.IDLE is not a valid status");
        default:
          throw new Error("Unknown NodeStatus");
      }
    }
    if (this.__current_index === this.numChildren) {
      this.haltChildren();
      this.__current_index = 0;
    }
    return 2 /* SUCCESS */;
  }
};

// src/behaviorTree/controls/BTSequenceStarNode.ts
var BTSequenceStarNode = class extends BTControlNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.__current_index = 0;
  }
  tick() {
    this.status = 3 /* RUNNING */;
    while (this.__current_index < this.numChildren) {
      const child = this.$children[this.__current_index];
      const child_status = child.evaluate();
      switch (child_status) {
        case 3 /* RUNNING */:
          return child_status;
        case 1 /* FAILURE */:
          this.haltChildren(this.__current_index);
          return child_status;
        case 2 /* SUCCESS */:
          this.__current_index++;
          break;
        case 0 /* IDLE */:
          throw new Error("NodeStatus.IDLE is not a valid status");
        default:
          throw new Error("Unknown NodeStatus");
      }
    }
    if (this.__current_index === this.numChildren) {
      this.haltChildren();
      this.__current_index = 0;
    }
    return 2 /* SUCCESS */;
  }
};

// src/behaviorTree/controls/BTWhileDoElseNode.ts
var BTWhileDoElseNode = class extends BTControlNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  tick() {
    if (this.numChildren != 2 && this.numChildren != 3) {
      throw new Error(this.name + "IfThenElseNode:the number of children must be 2 or 3");
    }
    this.status = 3 /* RUNNING */;
    const condition_status = this.$children[0].evaluate();
    if (condition_status == 3 /* RUNNING */) {
      return condition_status;
    }
    let status = 0 /* IDLE */;
    if (condition_status == 2 /* SUCCESS */) {
      this.haltChild(2);
      status = this.$children[1].evaluate();
    } else if (condition_status == 1 /* FAILURE */) {
      this.haltChild(1);
      ;
      status = this.$children[2].evaluate();
    }
    if (status == 3 /* RUNNING */) {
      return 3 /* RUNNING */;
    } else {
      this.haltChildren();
      return status;
    }
  }
};

// src/behaviorTree/decorators/BTDecoratorNode.ts
var BTDecoratorNode = class extends BTNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.$child = null;
  }
  /**
   * 设置子节点
   * @param child 
   */
  setChild(child) {
    if (this.$child != null) {
      throw new Error("Child already set");
    }
    this.$child = child;
  }
  getChild() {
    return this.$child;
  }
  halt() {
    this.haltChild();
    this.status = 0 /* IDLE */;
  }
  haltChild() {
    if (!this.$child) {
      return;
    }
    if (this.$child.status == 3 /* RUNNING */) {
      this.$child.halt();
    }
    this.$child.status = 0 /* IDLE */;
  }
  destroy() {
    super.destroy();
    if (this.$child) {
      if (this.$child.status == 3 /* RUNNING */) {
        this.$child.halt();
      }
      this.$child.destroy();
      this.$child = null;
    }
  }
  get type() {
    return 2 /* DECORATOR */;
  }
};

// src/behaviorTree/decorators/BTDelayNode.ts
var BTDelayNode = class extends BTDecoratorNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    /**定时器句柄*/
    this.time_handler = void 0;
    /**延迟时间 */
    this.delayTime = 0;
    this.delay_started = false;
    this.delay_aborted = false;
    this.delay_complete = false;
  }
  init(data) {
    if (data.hasOwnProperty("delayTime")) {
      this.delayTime = data["delayTime"] || 0;
    }
    this.delayTime = Math.max(this.delayTime, 0);
  }
  tick() {
    if (!this.delay_started) {
      this.delay_complete = false;
      this.delay_aborted = false;
      this.delay_started = true;
      this.status = 3 /* RUNNING */;
      this.time_handler = setTimeout(this.__timeOut.bind(this), this.delayTime);
    }
    if (this.delay_aborted) {
      this.delay_aborted = false;
      this.delay_started = false;
      return 1 /* FAILURE */;
    } else if (this.delay_complete) {
      this.delay_started = false;
      this.delay_aborted = false;
      const child_status = this.getChild().evaluate();
      return child_status;
    } else {
      return 3 /* RUNNING */;
    }
  }
  /**
   * 延迟结束
   */
  __timeOut() {
    this.delay_complete = true;
    this.time_handler = void 0;
  }
  halt() {
    this.delay_started = false;
    if (this.time_handler != void 0) {
      clearTimeout(this.time_handler);
      this.time_handler = void 0;
      this.delay_aborted = true;
    }
    super.halt();
  }
};

// src/behaviorTree/decorators/BTForceFailureNode.ts
var BTForceFailureNode = class extends BTDecoratorNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  tick() {
    this.status = 3 /* RUNNING */;
    const child_state = this.getChild().evaluate();
    switch (child_state) {
      case 1 /* FAILURE */:
      case 2 /* SUCCESS */: {
        return 1 /* FAILURE */;
      }
      case 3 /* RUNNING */: {
        return 3 /* RUNNING */;
      }
    }
    return this.status;
  }
};

// src/behaviorTree/decorators/BTForceSuccessNode.ts
var BTForceSuccessNode = class extends BTDecoratorNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  tick() {
    this.status = 3 /* RUNNING */;
    const child_state = this.getChild().evaluate();
    switch (child_state) {
      case 1 /* FAILURE */:
      case 2 /* SUCCESS */: {
        return 2 /* SUCCESS */;
      }
      case 3 /* RUNNING */: {
        return 3 /* RUNNING */;
      }
    }
    return this.status;
  }
};

// src/behaviorTree/decorators/BTInverterNode.ts
var BTInverterNode = class extends BTDecoratorNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  tick() {
    this.status = 3 /* RUNNING */;
    const child_state = this.getChild().evaluate();
    switch (child_state) {
      case 2 /* SUCCESS */: {
        return 1 /* FAILURE */;
      }
      case 1 /* FAILURE */: {
        return 2 /* SUCCESS */;
      }
      case 3 /* RUNNING */: {
        return 3 /* RUNNING */;
      }
      default: {
        throw new Error("A child node must never return IDLE");
      }
    }
  }
};

// src/behaviorTree/decorators/BTKeepRunningUntilFailureNode.ts
var BTKeepRunningUntilFailureNode = class extends BTDecoratorNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  tick() {
    this.status = 3 /* RUNNING */;
    const child_state = this.getChild().evaluate();
    switch (child_state) {
      case 1 /* FAILURE */: {
        return 1 /* FAILURE */;
      }
      case 2 /* SUCCESS */:
      case 3 /* RUNNING */: {
        return 3 /* RUNNING */;
      }
    }
    return this.status;
  }
};

// src/behaviorTree/decorators/BTRepeatNode.ts
var BTRepeatNode = class extends BTDecoratorNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.num_cycles = -1;
    this.try_index = 0;
  }
  init(data) {
    if (data.hasOwnProperty("num")) {
      this.num_cycles = data["num"] || 1;
    }
    this.num_cycles = isNaN(this.num_cycles) ? -1 : this.num_cycles;
  }
  tick() {
    this.status = 3 /* RUNNING */;
    while (this.try_index < this.num_cycles || this.num_cycles == -1) {
      const child_state = this.getChild().evaluate();
      switch (child_state) {
        case 2 /* SUCCESS */:
          this.try_index++;
          this.haltChild();
          break;
        case 1 /* FAILURE */:
          this.try_index = 0;
          this.haltChild();
          return 1 /* FAILURE */;
        case 3 /* RUNNING */:
          return 3 /* RUNNING */;
        default:
          throw new Error("A child node must never return IDLE");
      }
    }
    this.try_index = 0;
    return 2 /* SUCCESS */;
  }
  halt() {
    this.try_index = 0;
    super.halt();
  }
};

// src/behaviorTree/decorators/BTRetryNode.ts
var BTRetryNode = class extends BTDecoratorNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.max_attempts_ = 1;
    this.try_index = 0;
  }
  init(data) {
    if (data.hasOwnProperty("num")) {
      this.max_attempts_ = data["num"];
    }
  }
  halt() {
    this.try_index = 0;
    super.halt();
  }
  tick() {
    this.status = 3 /* RUNNING */;
    while (this.try_index < this.max_attempts_ || this.max_attempts_ == -1) {
      const child_state = this.getChild().evaluate();
      switch (child_state) {
        case 2 /* SUCCESS */: {
          this.try_index = 0;
          this.haltChild();
          return 2 /* SUCCESS */;
        }
        case 1 /* FAILURE */:
          this.try_index++;
          this.haltChild();
          break;
        case 3 /* RUNNING */:
          return 3 /* RUNNING */;
        default:
          throw new Error("A child node must never return IDLE");
      }
    }
    this.try_index = 0;
    return 1 /* FAILURE */;
  }
};

// src/behaviorTree/decorators/BTTimeOutNode.ts
var BTTimeOutNode = class extends BTDecoratorNode {
  constructor(name, blackboard) {
    super(name, blackboard);
    this.msec = 0;
    this.child_halted = false;
    this.timeout_started = false;
  }
  init(data) {
    if (data.hasOwnProperty("msec")) {
      this.msec = data["msec"];
    }
  }
  tick() {
    if (!this.timeout_started) {
      this.timeout_started = true;
      this.status = 3 /* RUNNING */;
      this.child_halted = false;
      if (this.msec > 0) {
        this.timerHandler = setTimeout(() => {
          if (this.getChild().status == 3 /* RUNNING */) {
            this.child_halted = true;
            this.haltChild();
          }
        }, this.msec);
      }
    }
    if (this.child_halted) {
      this.timeout_started = false;
      return 1 /* FAILURE */;
    } else {
      const child_status = this.getChild().evaluate();
      if (child_status != 3 /* RUNNING */) {
        this.timeout_started = false;
        if (this.timerHandler) {
          clearTimeout(this.timerHandler);
          this.timerHandler = void 0;
        }
      }
      return child_status;
    }
  }
};

// src/behaviorTree/BTUtils.ts
var BTUtils = class {
  /**
   * 递归遍历行为树节点，并对每个节点执行指定函数。
   *
   * @param root 行为树根节点。
   * @param visitor 访问函数，用于处理每个节点。
   * @throws 当根节点为null时，抛出异常。
   */
  static applyRecursiveVisitor(root, visitor) {
    if (!root) throw new Error("root is null");
    visitor(root);
    if (root.type == 1 /* CONTROL */) {
      const controlNode = root;
      for (let index = 0; index < controlNode.numChildren; index++) {
        const child = controlNode.getChild(index);
        this.applyRecursiveVisitor(child, visitor);
      }
    } else if (root.type == 2 /* DECORATOR */) {
      const decoratorNode = root;
      this.applyRecursiveVisitor(decoratorNode.getChild(), visitor);
    }
  }
  /**
   * 递归打印树形结构
   *
   * @param root 树的根节点
   * @returns 返回树的字符串表示
   */
  static printTreeRecursively(root) {
    if (!root) return "";
    const endl = "\n";
    let stream = "";
    let recursivePrint = (indent, node) => {
      for (let i = 0; i < indent; i++) {
        stream += "   ";
      }
      if (!node) {
        stream += "!null!" + endl;
        return;
      }
      let status = "";
      switch (node.status) {
        case 1 /* FAILURE */:
          status = "failure";
          break;
        case 3 /* RUNNING */:
          status = "running";
          break;
        case 2 /* SUCCESS */:
          status = "success";
          break;
      }
      stream += "[" + status + "]" + node.name + endl;
      indent++;
      if (node.type == 1 /* CONTROL */) {
        const controlNode = node;
        for (let index = 0; index < controlNode.numChildren; index++) {
          const child = controlNode.getChild(index);
          recursivePrint(indent, child);
        }
      } else if (node.type == 2 /* DECORATOR */) {
        const decoratorNode = node;
        recursivePrint(indent, decoratorNode.getChild());
      }
    };
    stream += "----------------" + endl;
    recursivePrint(0, root);
    stream += "----------------" + endl;
    return stream;
  }
};

// src/behaviorTree/BTNodeKeys.ts
var BTNodeKeys = /* @__PURE__ */ ((BTNodeKeys2) => {
  BTNodeKeys2["SEQUENCE"] = "sequence";
  BTNodeKeys2["ReactiveSequence"] = "reactiveSequence";
  BTNodeKeys2["SequenceStar"] = "sequenceStar";
  BTNodeKeys2["PARALLEL"] = "parallel";
  BTNodeKeys2["FALLBACK"] = "fallback";
  BTNodeKeys2["ReactiveFallback"] = "reactiveFallback";
  BTNodeKeys2["IfThenElseNode"] = "ifThenElse";
  BTNodeKeys2["WhileDoElseNode"] = "whileDoElse";
  BTNodeKeys2["Delay"] = "delay";
  BTNodeKeys2["ForceFailure"] = "forceFailure";
  BTNodeKeys2["ForceSuccess"] = "forceSuccess";
  BTNodeKeys2["Inverter"] = "inverter";
  BTNodeKeys2["KeepRunningUntilFailure"] = "keepRunningUntilFailure";
  BTNodeKeys2["Repeat"] = "repeat";
  BTNodeKeys2["Retry"] = "retry";
  BTNodeKeys2["TimeOut"] = "timeout";
  return BTNodeKeys2;
})(BTNodeKeys || {});

// src/behaviorTree/controls/BTReactiveSequence.ts
var BTReactiveSequence = class extends BTControlNode {
  constructor(name, blackboard) {
    super(name, blackboard);
  }
  tick() {
    let success_count = 0;
    let running_count = 0;
    for (let index = 0; index < this.numChildren; index++) {
      const child_node = this.$children[index];
      const child_status = child_node.evaluate();
      switch (child_status) {
        case 3 /* RUNNING */:
          running_count++;
          this.haltChildren(index + 1);
          return 3 /* RUNNING */;
        case 1 /* FAILURE */:
          this.haltChildren();
          return 1 /* FAILURE */;
        case 2 /* SUCCESS */:
          success_count++;
          break;
        case 0 /* IDLE */:
          throw new Error("ReactiveSequence: child node is idle");
        default:
          throw new Error("ReactiveSequence: child node status is invalid");
      }
    }
    if (success_count == this.numChildren) {
      this.haltChildren();
      return 2 /* SUCCESS */;
    }
    return 3 /* RUNNING */;
  }
};

// src/behaviorTree/BTContext.ts
var BTContext = class {
  constructor() {
    this.class_map = /* @__PURE__ */ new Map();
    this.$init();
  }
  $init() {
    this.register("sequence" /* SEQUENCE */, BTSequenceNode);
    this.register("reactiveSequence" /* ReactiveSequence */, BTReactiveSequence);
    this.register("sequenceStar" /* SequenceStar */, BTSequenceStarNode);
    this.register("ifThenElse" /* IfThenElseNode */, BTIfThenElseNode);
    this.register("whileDoElse" /* WhileDoElseNode */, BTWhileDoElseNode);
    this.register("parallel" /* PARALLEL */, BTParallelNode);
    this.register("fallback" /* FALLBACK */, BTFallbackNode);
    this.register("reactiveFallback" /* ReactiveFallback */, BTReactiveFallback);
    this.register("delay" /* Delay */, BTDelayNode);
    this.register("forceFailure" /* ForceFailure */, BTForceFailureNode);
    this.register("forceSuccess" /* ForceSuccess */, BTForceSuccessNode);
    this.register("keepRunningUntilFailure" /* KeepRunningUntilFailure */, BTKeepRunningUntilFailureNode);
    this.register("inverter" /* Inverter */, BTInverterNode);
    this.register("repeat" /* Repeat */, BTRepeatNode);
    this.register("retry" /* Retry */, BTRetryNode);
    this.register("timeout" /* TimeOut */, BTTimeOutNode);
  }
  /**
   * 注册节点类
   * @param name 
   * @param clazz 
   */
  register(name, clazz) {
    this.class_map.set(name.toLocaleLowerCase(), clazz);
  }
  /**
   * 注销节点类
   * @param name 
   */
  unregister(name) {
    this.class_map.delete(name.toLocaleLowerCase());
  }
  /**
   * 创建节点
   * @param data 
   * @returns 
   */
  createNode(data, blackboard) {
    const clazz = this.class_map.get(data.type.toLocaleLowerCase());
    if (!clazz) {
      throw new Error(`${data.name, data.type}\u8282\u70B9\u4E0D\u5B58\u5728`);
    }
    let result = new clazz(data.name, blackboard);
    result.init(data);
    const isControl = result.type == 1 /* CONTROL */;
    const isDecorator = result.type == 2 /* DECORATOR */;
    if (data.children) {
      for (let index = 0; index < data.children.length; index++) {
        const child_data = data.children[index];
        if (isControl) {
          const control = result;
          control.addChild(this.createNode(child_data, blackboard));
        }
        if (isDecorator) {
          const decorator = result;
          if (index > 0) {
            throw new Error("\u88C5\u9970\u8282\u70B9\u53EA\u80FD\u6709\u4E00\u4E2A\u5B50\u8282\u70B9=>" + data);
          }
          decorator.setChild(this.createNode(child_data, blackboard));
        }
      }
    }
    return result;
  }
  /**
   * 清理
   */
  clear() {
    this.class_map.clear();
  }
  destroy() {
    this.clear();
  }
};

// src/behaviorTree/BTBlackboard.ts
import { EventDispatcher } from "dream-cc-core";
var BTBlackboard = class extends EventDispatcher {
  constructor() {
    super();
    this.__datas = /* @__PURE__ */ new Map();
  }
  /**
   * 获取数据
   * @param key 
   * @returns 
   */
  get(key) {
    return this.__datas.get(key);
  }
  /**
   * 判断是否存在数据
   * @param key 
   */
  has(key) {
    return this.__datas.has(key);
  }
  /**
   * 设置数据
   * @param key 
   * @param value 
   */
  set(key, value) {
    this.__datas.set(key, value);
  }
  /**
   * 删除数据
   */
  delete(key) {
    this.__datas.delete(key);
  }
  /**
   * 清理数据
   */
  clear() {
    this.__datas.clear();
  }
  /**
   * 销毁
   * @returns 
   */
  destroy() {
    this.clear();
    this.__datas = null;
    return true;
  }
};

// src/behaviorTree/ecs/BehaviorTreeComponent.ts
import { ECSComponent } from "dream-cc-ecs";
var BehaviorTreeComponent = class extends ECSComponent {
  constructor() {
    super();
    /**
     * 帧间隔
     */
    this.frameInterval = 50;
    this.lastTime = 0;
    this.debug = false;
  }
  /**
   * 初始化
   * @param context 
   */
  init(context, data, blackboard) {
    this.context = context;
    if (data) {
      this.setData(data, blackboard);
    }
  }
  /**
   * 设置
   * @param data 
   * @param blackboard 
   */
  setData(data, blackboard) {
    let old = this.root;
    let bb = blackboard ? blackboard : old.blackboard;
    this.root = this.context.createNode(data, bb);
    if (old) {
      old.destroy();
    }
  }
  /**
   * 黑板
   */
  get blackboard() {
    if (!this.root) {
      return null;
    }
    return this.root.blackboard;
  }
  reset() {
    if (this.root) {
      this.root.destroy();
      this.root = null;
    }
  }
  destroy() {
    let result = super.destroy();
    if (this.root) {
      this.root.destroy();
      this.root = null;
    }
    this.context = null;
    return result;
  }
};

// src/behaviorTree/ecs/BehaviorTreeSystem.ts
import { ECSSystem, MatcherAllOf } from "dream-cc-ecs";
import { Timer } from "dream-cc-core";
var BehaviorTreeSystem = class extends ECSSystem {
  constructor() {
    super(new MatcherAllOf([
      BehaviorTreeComponent
    ]));
  }
  $tick(entitys, dt) {
    let currentTime = Timer.currentTime;
    for (let entity of entitys) {
      let tree = this.world.getComponent(entity, BehaviorTreeComponent);
      if (!tree) return;
      if (currentTime - tree.lastTime < tree.frameInterval) {
        return;
      }
      tree.lastTime = currentTime;
      if (tree && tree.root) {
        tree.root.evaluate();
        if (tree.debug) {
          let log = BTUtils.printTreeRecursively(tree.root);
          console.log(log);
        }
      }
    }
  }
};

// src/fsm/ecs/FSMComponent.ts
import { ECSComponent as ECSComponent2 } from "dream-cc-ecs";

// src/fsm/FSM.ts
import { Event, EventDispatcher as EventDispatcher2, Logger } from "dream-cc-core";
var FSM = class extends EventDispatcher2 {
  constructor(owner, name) {
    super();
    this.owner = owner;
    this.__name = name;
    this.__states = /* @__PURE__ */ new Map();
  }
  tick(dt) {
    if (this.__current) {
      this.__current.tick(dt);
    }
  }
  /**
   * 添加
   * @param key 
   * @param v 
   */
  addState(key, v) {
    this.__states.set(key, v);
    v.init(this);
  }
  /**
   * 切换状态
   * @param value 
   * @param data 
   * @returns 
   */
  switchState(value, data) {
    if (this.__state == value) {
      return;
    }
    let oldKey = this.__state;
    let old = this.__current;
    if (old) {
      if (this.debug) {
        Logger.log(this.__name + " \u6240\u5C5E:" + this.owner.name + " \u9000\u51FA\u72B6\u6001==>" + this.__current.name, "FSM");
      }
      old.exit();
    }
    this.__current = null;
    if (!this.__states.has(value)) {
      throw new Error("\u72B6\u6001\u673A:" + this.__name + " \u6240\u5C5E:" + this.owner.name + "\u672A\u627E\u5230\u72B6\u6001==>" + value);
    }
    this.__state = value;
    this.__current = this.__states.get(value);
    if (this.debug) {
      Logger.log(this.__name + " \u6240\u5C5E:" + this.owner.name + " \u8FDB\u5165\u72B6\u6001==>" + this.__current.name, "FSM");
    }
    this.__current.enter(data);
    this.emit(Event.STATE_CHANGED, oldKey);
  }
  get state() {
    return this.__state;
  }
  get current() {
    return this.__current;
  }
  destroy() {
    if (super.destroy()) {
      if (this.__current) {
        this.__current.exit();
      }
      this.__states.forEach((element) => {
        element.destroy();
      });
      this.__states.clear();
      return true;
    }
    return false;
  }
};

// src/fsm/ecs/FSMComponent.ts
var FSMComponent = class extends ECSComponent2 {
  constructor() {
    super();
    this.fsm = new FSM(this, "FSMComponent");
  }
  destroy() {
    if (super.destroy()) {
      this.fsm.destroy();
      this.fsm = null;
      return true;
    }
    return false;
  }
};

// src/fsm/ecs/FSMSystem.ts
import { ECSSystem as ECSSystem2, MatcherAllOf as MatcherAllOf2 } from "dream-cc-ecs";
var FSMSystem = class extends ECSSystem2 {
  constructor() {
    super(
      new MatcherAllOf2(
        [
          FSMComponent
        ]
      )
    );
  }
  $tick(entitys, dt) {
    for (let entity of entitys) {
      let fsm = this.world.getComponent(entity, FSMComponent);
      fsm.fsm.tick(dt);
    }
  }
};
export {
  BTActionNode,
  BTAsyncActionNode,
  BTBlackboard,
  BTConditionNode,
  BTContext,
  BTControlNode,
  BTCoroActionNode,
  BTDecoratorNode,
  BTDelayNode,
  BTFallbackNode,
  BTForceFailureNode,
  BTForceSuccessNode,
  BTIfThenElseNode,
  BTInverterNode,
  BTKeepRunningUntilFailureNode,
  BTNode,
  BTNodeKeys,
  BTNodeStatus,
  BTNodeType,
  BTParallelNode,
  BTReactiveFallback,
  BTRepeatNode,
  BTRetryNode,
  BTSequenceNode,
  BTSequenceStarNode,
  BTSimpleActionNode,
  BTSimpleConditionNode,
  BTStatefulActionNode,
  BTSyncActionNode,
  BTTimeOutNode,
  BTUtils,
  BTWhileDoElseNode,
  BehaviorTreeComponent,
  BehaviorTreeSystem,
  FSM,
  FSMComponent,
  FSMSystem
};
//# sourceMappingURL=dream-cc-ai.mjs.map
