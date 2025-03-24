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

// ../dream-cc-ecs/dist/dream-cc-ecs.mjs
import { TickerManager } from "dream-cc-core";
import { Dictionary as Dictionary2, Pool } from "dream-cc-core";
import { Dictionary } from "dream-cc-core";
import { Quat, Vec3 } from "cc";
import { Node as Node2 } from "cc";
import { Node } from "cc";
import { TickerManager as TickerManager2 } from "dream-cc-core";
import { Node as Node3 } from "cc";
import { Vec3 as Vec32 } from "cc";
import { Graphics } from "cc";
import { RenderRoot2D } from "cc";
import { Event, EventDispatcher as EventDispatcher2 } from "dream-cc-core";
import { TickerManager as TickerManager3 } from "dream-cc-core";
import { Event as Event2, EventDispatcher as EventDispatcher22, Res } from "dream-cc-core";
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
var ECSMatcher = class {
  constructor(allOrAny, matcherAnyOf, none) {
    this.matcher = void 0;
    this.matcherAnyOf = void 0;
    this.matcherNoneOf = void 0;
    this.__entitys = /* @__PURE__ */ new Set();
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
};
var MatcherAnyOf = class extends Matcher {
};
var _ECSWorld = class _ECSWorld2 {
  /**
   * 初始化
   * @param maxCount 
   */
  constructor(maxCount) {
    this.__waitFree = [];
    this.__need_sort_systems = false;
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
    _ECSWorld2.HELP_ENTITY_LIST.splice(0, _ECSWorld2.HELP_ENTITY_LIST.length);
    let list = this.__storage.getIDList(_ECSWorld2.HELP_ENTITY_LIST);
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
var SparseSet = class {
  constructor(maxCount) {
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
var ECSSystem = class {
  /**
   * 系统
   * @param allOrAny  匹配所有或任意一个 
   * @param none      不能包含
   * @param useDirty  是否使用脏数据机制
   */
  constructor(allOrAny, matcherAnyOf, none, useDirty = false) {
    this.useDirty = false;
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
TransformComponent.YAxisFlip = true;

// src/behaviorTree/ecs/BehaviorTreeComponent.ts
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

// src/fsm/FSM.ts
import { Event as Event3, EventDispatcher as EventDispatcher3, Logger } from "dream-cc-core";
var FSM = class extends EventDispatcher3 {
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
    this.emit(Event3.STATE_CHANGED, oldKey);
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
  FSM
};
//# sourceMappingURL=dream-cc-ai.mjs.map
