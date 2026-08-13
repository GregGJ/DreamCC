import { Event, EventDispatcher, Logger, Timer } from "dream-cc-core";
import { ECSComponent, ECSSystem, MatcherAllOf } from "dream-cc-ecs";
//#region dream-cc-ai/src/behaviorTree/BTNodeStatus.ts
/**
* 节点状态
*/
let BTNodeStatus = /* @__PURE__ */ function(BTNodeStatus) {
	/**初始状态 */
	BTNodeStatus[BTNodeStatus["IDLE"] = 0] = "IDLE";
	/**失败 */
	BTNodeStatus[BTNodeStatus["FAILURE"] = 1] = "FAILURE";
	/**成功 */
	BTNodeStatus[BTNodeStatus["SUCCESS"] = 2] = "SUCCESS";
	/**运行中 */
	BTNodeStatus[BTNodeStatus["RUNNING"] = 3] = "RUNNING";
	return BTNodeStatus;
}({});
//#endregion
//#region dream-cc-ai/src/behaviorTree/BTNodeType.ts
/**
* 节点类型
*/
let BTNodeType = /* @__PURE__ */ function(BTNodeType) {
	BTNodeType[BTNodeType["ERROR"] = 0] = "ERROR";
	BTNodeType[BTNodeType["CONTROL"] = 1] = "CONTROL";
	BTNodeType[BTNodeType["DECORATOR"] = 2] = "DECORATOR";
	BTNodeType[BTNodeType["ACTION"] = 3] = "ACTION";
	BTNodeType[BTNodeType["CONDITION"] = 4] = "CONDITION";
	return BTNodeType;
}({});
//#endregion
//#region dream-cc-ai/src/behaviorTree/BTNode.ts
var BTNode = class {
	constructor(name, blackboard) {
		this.parent = null;
		this.$status = 0;
		this.name = name;
		this.blackboard = blackboard;
	}
	init(data) {}
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
		return 0;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/actions/BTActionNode.ts
/**
* 动作节点基础类
*/
var BTActionNode = class extends BTNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	get type() {
		return 3;
	}
};
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(n, t, e, r, o, a, c) {
	try {
		var i = n[a](c), u = i.value;
	} catch (n) {
		e(n);
		return;
	}
	i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
	return function() {
		var t = this, e = arguments;
		return new Promise(function(r, o) {
			var a = n.apply(t, e);
			function _next(n) {
				asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
			}
			function _throw(n) {
				asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
			}
			_next(void 0);
		});
	};
}
//#endregion
//#region dream-cc-ai/src/behaviorTree/actions/BTAsyncActionNode.ts
/**
* 异步动作节点基础类
*/
var BTAsyncActionNode = class extends BTActionNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.halt_requested = false;
	}
	evaluate() {
		var _this = this;
		if (this.status === 0) {
			this.status = 3;
			this.halt_requested = false;
			_asyncToGenerator(function* () {
				try {
					_this.status = yield _this.tick();
				} catch (error) {
					throw new Error(error);
				}
			})();
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
//#endregion
//#region dream-cc-ai/src/behaviorTree/actions/BTCoroActionNode.ts
var BTCoroActionNode = class extends BTActionNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.yield = false;
	}
	setStatusRunningAndYield() {
		this.status = 3;
		this.yield = true;
	}
	evaluate() {
		if (!this.yield) this.status = this.tick();
		return this.status;
	}
	halt() {
		this.yield = false;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/actions/BTSimpleActionNode.ts
var BTSimpleActionNode = class extends BTAsyncActionNode {
	constructor(name, blackboard, tickFunctor) {
		super(name, blackboard);
		this.tickFunctor = tickFunctor;
	}
	tick() {
		let prevStatuc = this.status;
		if (prevStatuc === 0) {
			this.status = 3;
			prevStatuc = 3;
		}
		let status = this.tickFunctor(this);
		if (status !== prevStatuc) this.status = status;
		return status;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/actions/BTStatefulActionNode.ts
/**
* 状态类动作节点
*/
var BTStatefulActionNode = class extends BTActionNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	tick() {
		const initial_status = this.status;
		if (initial_status === 0) {
			const new_status = this.onEnter();
			if (new_status === 0) throw new Error("AsyncActionNode2::onStart() must not return IDLE");
			if (new_status != 3) this.onExit();
			return new_status;
		}
		if (initial_status === 3) {
			const new_status = this.onTick();
			if (new_status === 0) throw new Error("AsyncActionNode2::onRunning() must not return IDLE");
			if (new_status != 3) this.onExit();
			return new_status;
		}
		return initial_status;
	}
	halt() {
		if (this.status === 3) this.onHalted();
		this.status = 0;
	}
	/**被打断 */
	onHalted() {
		this.onExit();
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/actions/BTSyncActionNode.ts
/**
* 同步动作节点
*/
var BTSyncActionNode = class extends BTActionNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	evaluate() {
		const stat = super.evaluate();
		if (stat === 3) throw new Error("SyncActionNode MUST never return RUNNING");
		return stat;
	}
	halt() {
		this.status = 0;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/conditions/BTConditionNode.ts
/**
* 条件节点
*/
var BTConditionNode = class extends BTNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	halt() {
		this.status = 0;
	}
	get type() {
		return 4;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/conditions/BTSimpleConditionNode.ts
/**
* 简单条件节点
*/
var BTSimpleConditionNode = class extends BTConditionNode {
	constructor(name, blackboard, tick_functor) {
		super(name, blackboard);
		this.tick_functor = tick_functor;
	}
	tick() {
		return this.tick_functor(this);
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/controls/BTControlNode.ts
/**
* 控制节点
*/
var BTControlNode = class extends BTNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.$children = [];
		this.$children = [];
	}
	addChild(child) {
		if (this.$children.indexOf(child) > -1) throw new Error("child already exists");
		this.$children.push(child);
		child.parent = this;
	}
	getChild(idx) {
		if (idx < 0 || idx >= this.$children.length) throw new Error("index out of range");
		return this.$children[idx];
	}
	halt() {
		this.haltChildren();
		this.status = 0;
	}
	haltChild(idx) {
		if (idx < 0 || idx >= this.$children.length) throw new Error("index out of range");
		const child = this.$children[idx];
		if (child.status === 3) child.halt();
		child.status = 0;
	}
	haltChildren(start = 0) {
		for (let i = start; i < this.$children.length; ++i) this.haltChild(i);
	}
	destroy() {
		this.haltChildren();
		for (let i = 0; i < this.$children.length; ++i) this.$children[i].destroy();
		super.destroy();
	}
	get numChildren() {
		return this.$children.length;
	}
	get type() {
		return 1;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/controls/BTFallbackNode.ts
/**
* 在勾选第一个子节点之前，节点状态变为RUNNING。
* 如果一个子节点返回FAILURE，则回退标记下一个子节点。
* 如果最后一个子进程也返回FAILURE，那么所有的子进程都停止，回退进程返回FAILURE。
* 如果子进程返回SUCCESS，则停止并返回SUCCESS。所有的孩子都停下来了。
*/
var BTFallbackNode = class extends BTControlNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.__current_child_idx = 0;
	}
	tick() {
		const child_count = this.numChildren;
		this.status = 3;
		while (this.__current_child_idx < child_count) {
			const child_status = this.$children[this.__current_child_idx].evaluate();
			switch (child_status) {
				case 3: return child_status;
				case 2:
					this.haltChildren();
					this.__current_child_idx = 0;
					return child_status;
				case 1:
					this.__current_child_idx++;
					break;
				case 0: throw new Error("NodeStatus.IDLE is not allowed in FallbackNode");
				default: throw new Error("Unknown NodeStatus");
			}
		}
		if (this.__current_child_idx == child_count) {
			this.haltChildren();
			this.__current_child_idx = 0;
		}
		return 1;
	}
	halt() {
		this.__current_child_idx = 0;
		super.halt();
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/controls/BTIfThenElseNode.ts
/**
* 有2或3个子节点，node1就是if判断的条件。
* 如果node1返回SUCCESS，那么node2执行；
* 否则，node3执行。
* 如果没有node3，返回FAILURE。
* 该结点not reactive，
* 体现在一旦node1不返回RUNNING了，就进入了node2或node3的执行，以后tick()不会再执行node1了，也即不会再检查if条件的变化。
*/
var BTIfThenElseNode = class extends BTControlNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.__child_idx = 0;
	}
	tick() {
		if (this.numChildren != 2 && this.numChildren != 3) throw new Error(this.name + "IfThenElseNode:the number of children must be 2 or 3");
		this.status = 3;
		if (this.__child_idx == 0) {
			const condition_status = this.$children[0].evaluate();
			if (condition_status == 3) return condition_status;
			else if (condition_status == 2) this.__child_idx = 1;
			else if (condition_status == 1) {
				if (this.numChildren == 3) this.__child_idx = 2;
				else return condition_status;
			}
		}
		if (this.__child_idx > 0) {
			const child_status = this.$children[this.__child_idx].evaluate();
			if (child_status == 3) return 3;
			else {
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
//#endregion
//#region dream-cc-ai/src/behaviorTree/controls/BTParallelNode.ts
/**
* 当返回SUCCESS的子节点个数>=THRESHOLD_SUCCESS时，返回SUCCESS。
* 当返回FAILURE的子节点个数>=THRESHOLD_FAILURE时，返回FAILURE。
* 当程序判断绝不可能SUCCESS时，返回FAILURE。如 failure_children_num > children_count - success_threshold_。
*/
var BTParallelNode = class extends BTControlNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.success_threshold = 0;
		this.failure_threshold = 1;
		this.__skip_list = /* @__PURE__ */ new Map();
	}
	init(data) {
		if (data.hasOwnProperty("success")) this.success_threshold = data["success"];
		if (data.hasOwnProperty("failure")) this.failure_threshold = data["failure"];
		this.success_threshold = Math.max(this.success_threshold, 0);
		this.failure_threshold = Math.max(this.failure_threshold, 1);
	}
	tick() {
		let success_childred_num = 0;
		let failure_childred_num = 0;
		const children_count = this.$children.length;
		if (children_count < this.success_threshold) throw new Error("Number of children is less than threshold. Can never succeed.");
		if (children_count < this.failure_threshold) throw new Error("Number of children is less than threshold. Can never fail.");
		for (let i = 0; i < children_count; i++) {
			const child_node = this.$children[i];
			const in_skip_list = this.__skip_list.has(i);
			let child_status;
			if (in_skip_list) child_status = child_node.status;
			else child_status = child_node.evaluate();
			switch (child_status) {
				case 2:
					if (!in_skip_list) this.__skip_list.set(i, i);
					success_childred_num++;
					if (success_childred_num == this.success_threshold) {
						this.__skip_list.clear();
						this.haltChildren();
						return 2;
					}
					break;
				case 1:
					if (!in_skip_list) this.__skip_list.set(i, i);
					failure_childred_num++;
					if (failure_childred_num > children_count - this.success_threshold || failure_childred_num == this.failure_threshold) {
						this.__skip_list.clear();
						this.haltChildren();
						return 1;
					}
					break;
				case 3: break;
				default: throw new Error("A child node must never return IDLE");
			}
		}
		return 3;
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
//#endregion
//#region dream-cc-ai/src/behaviorTree/controls/BTReactiveFallback.ts
/**
* 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点会再次执行，reactive所在。
* 如果某个子节点返回SUCCESS，不再执行，且返回SUCCESS。
* 如果某个子节点返回FAILURE，立即执行下一个子节点（不会等下一次tick()）。如果所有子节点返回FAILURE，返回FAILURE。
*/
var BTReactiveFallback = class extends BTControlNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	tick() {
		let failure_count = 0;
		for (let index = 0; index < this.numChildren; index++) switch (this.$children[index].evaluate()) {
			case 3:
				this.haltChildren(index + 1);
				return 3;
			case 1:
				failure_count++;
				break;
			case 2:
				this.haltChildren();
				return 2;
			case 0: throw new Error("ReactiveFallback: child node is idle");
			default: throw new Error("ReactiveFallback: unknown child node status");
		}
		if (failure_count == this.numChildren) {
			this.haltChildren();
			return 1;
		}
		return 3;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/controls/BTSequenceNode.ts
/**
* 按从左到右的顺序依次执行子节点。
* 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点不会再执行。
* 如果某个子节点返回SUCCESS，立即执行下一个子节点（不会等下一次tick()）。
* 如果所有子节点返回SUCCESS，返回SUCCESS。
*/
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
		this.status = 3;
		while (this.__current_index < this.numChildren) {
			const child_status = this.$children[this.__current_index].evaluate();
			switch (child_status) {
				case 3: return child_status;
				case 1:
					this.haltChildren();
					this.__current_index = 0;
					return child_status;
				case 2:
					this.__current_index++;
					break;
				case 0: throw new Error("NodeStatus.IDLE is not a valid status");
				default: throw new Error("Unknown NodeStatus");
			}
		}
		if (this.__current_index === this.numChildren) {
			this.haltChildren();
			this.__current_index = 0;
		}
		return 2;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/controls/BTSequenceStarNode.ts
/**
* 同SequenceNode，不同之处在于如果某个子节点返回FAILURE，返回FAILURE，终止所有节点的执行。
* 但不复位current_child_idx_。所以当再次tick()时，从FAILURE的子节点开始。
*/
var BTSequenceStarNode = class extends BTControlNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.__current_index = 0;
	}
	tick() {
		this.status = 3;
		while (this.__current_index < this.numChildren) {
			const child_status = this.$children[this.__current_index].evaluate();
			switch (child_status) {
				case 3: return child_status;
				case 1:
					this.haltChildren(this.__current_index);
					return child_status;
				case 2:
					this.__current_index++;
					break;
				case 0: throw new Error("NodeStatus.IDLE is not a valid status");
				default: throw new Error("Unknown NodeStatus");
			}
		}
		if (this.__current_index === this.numChildren) {
			this.haltChildren();
			this.__current_index = 0;
		}
		return 2;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/controls/BTWhileDoElseNode.ts
/**
* 是IfThenElseNode的reactive版本。
* reactive体现在每次tick()都会执行node1，即检查if条件的变化。
* 若node1返回值有SUCCESS、FAILURE的切换变化，就会打断node2或node3的执行，重新选择对应的node。
*/
var BTWhileDoElseNode = class extends BTControlNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	tick() {
		if (this.numChildren != 2 && this.numChildren != 3) throw new Error(this.name + "IfThenElseNode:the number of children must be 2 or 3");
		this.status = 3;
		const condition_status = this.$children[0].evaluate();
		if (condition_status == 3) return condition_status;
		let status = 0;
		if (condition_status == 2) {
			this.haltChild(2);
			status = this.$children[1].evaluate();
		} else if (condition_status == 1) {
			this.haltChild(1);
			status = this.$children[2].evaluate();
		}
		if (status == 3) return 3;
		else {
			this.haltChildren();
			return status;
		}
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/decorators/BTDecoratorNode.ts
/**
* 装饰节点
*/
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
		if (this.$child != null) throw new Error("Child already set");
		this.$child = child;
	}
	getChild() {
		return this.$child;
	}
	halt() {
		this.haltChild();
		this.status = 0;
	}
	haltChild() {
		if (!this.$child) return;
		if (this.$child.status == 3) this.$child.halt();
		this.$child.status = 0;
	}
	destroy() {
		super.destroy();
		if (this.$child) {
			if (this.$child.status == 3) this.$child.halt();
			this.$child.destroy();
			this.$child = null;
		}
	}
	get type() {
		return 2;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/decorators/BTDelayNode.ts
/**
* 延迟指定时间后执行子节点
*/
var BTDelayNode = class extends BTDecoratorNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.time_handler = void 0;
		this.delayTime = 0;
		this.delay_started = false;
		this.delay_aborted = false;
		this.delay_complete = false;
	}
	init(data) {
		if (data.hasOwnProperty("delayTime")) this.delayTime = data["delayTime"] || 0;
		this.delayTime = Math.max(this.delayTime, 0);
	}
	tick() {
		if (!this.delay_started) {
			this.delay_complete = false;
			this.delay_aborted = false;
			this.delay_started = true;
			this.status = 3;
			this.time_handler = setTimeout(this.__timeOut.bind(this), this.delayTime);
		}
		if (this.delay_aborted) {
			this.delay_aborted = false;
			this.delay_started = false;
			return 1;
		} else if (this.delay_complete) {
			this.delay_started = false;
			this.delay_aborted = false;
			return this.getChild().evaluate();
		} else return 3;
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
//#endregion
//#region dream-cc-ai/src/behaviorTree/decorators/BTForceFailureNode.ts
/**
* 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回FAILURE，即强制返回失败状态。
*/
var BTForceFailureNode = class extends BTDecoratorNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	tick() {
		this.status = 3;
		switch (this.getChild().evaluate()) {
			case 1:
			case 2: return 1;
			case 3: return 3;
		}
		return this.status;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/decorators/BTForceSuccessNode.ts
/**
* 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回SUCCESS，即强制返回成功状态。
*/
var BTForceSuccessNode = class extends BTDecoratorNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	tick() {
		this.status = 3;
		switch (this.getChild().evaluate()) {
			case 1:
			case 2: return 2;
			case 3: return 3;
		}
		return this.status;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/decorators/BTInverterNode.ts
/**
* 如果子节点执行后返回RUNNING，该节点返回RUNNING；
* 如果子节点执行后返回SUCCESS，该节点返回FAILURE；
* 如果子节点执行后返回FAILURE，该节点返回SUCCESS；
* 即对子节点的执行结果取反。
*/
var BTInverterNode = class extends BTDecoratorNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	tick() {
		this.status = 3;
		switch (this.getChild().evaluate()) {
			case 2: return 1;
			case 1: return 2;
			case 3: return 3;
			default: throw new Error("A child node must never return IDLE");
		}
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/decorators/BTKeepRunningUntilFailureNode.ts
/**
* 如果子节点执行后返回RUNNING或SUCCESS，下次tick()继续执行子节点，直到子节点返回FAILURE。
*/
var BTKeepRunningUntilFailureNode = class extends BTDecoratorNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	tick() {
		this.status = 3;
		switch (this.getChild().evaluate()) {
			case 1: return 1;
			case 2:
			case 3: return 3;
		}
		return this.status;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/decorators/BTRepeatNode.ts
/**
* 重复执行子节点NUM_CYCLES 次，若每次都返回 SUCCESS，该节点返回SUCCESS；
* 若子节点某次返回FAILURE，该节点不再重复执行子节点，立即返回FAILURE；
* 若子节点返回RUNNING，该节点也返回RUNNING。
*/
var BTRepeatNode = class extends BTDecoratorNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.num_cycles = -1;
		this.try_index = 0;
	}
	init(data) {
		if (data.hasOwnProperty("num")) this.num_cycles = data["num"] || 1;
		this.num_cycles = isNaN(this.num_cycles) ? -1 : this.num_cycles;
	}
	tick() {
		this.status = 3;
		while (this.try_index < this.num_cycles || this.num_cycles == -1) switch (this.getChild().evaluate()) {
			case 2:
				this.try_index++;
				this.haltChild();
				break;
			case 1:
				this.try_index = 0;
				this.haltChild();
				return 1;
			case 3: return 3;
			default: throw new Error("A child node must never return IDLE");
		}
		this.try_index = 0;
		return 2;
	}
	halt() {
		this.try_index = 0;
		super.halt();
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/decorators/BTRetryNode.ts
/**
* 如果子节点执行后返回RUNNING，该节点返回RUNNING；
* 如果子节点执行后返回SUCCESS，该节点返回SUCCESS，不再执行；
* 如果子节点执行后返回FAILURE，该节点再次尝试执行子节点，直到尝试了num_attempts次；
*/
var BTRetryNode = class extends BTDecoratorNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.max_attempts_ = 1;
		this.try_index = 0;
	}
	init(data) {
		if (data.hasOwnProperty("num")) this.max_attempts_ = data["num"];
	}
	halt() {
		this.try_index = 0;
		super.halt();
	}
	tick() {
		this.status = 3;
		while (this.try_index < this.max_attempts_ || this.max_attempts_ == -1) switch (this.getChild().evaluate()) {
			case 2:
				this.try_index = 0;
				this.haltChild();
				return 2;
			case 1:
				this.try_index++;
				this.haltChild();
				break;
			case 3: return 3;
			default: throw new Error("A child node must never return IDLE");
		}
		this.try_index = 0;
		return 1;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/decorators/BTTimeOutNode.ts
/**
* 在设置的msec 毫秒内，返回子节点执行的状态。
* 若子节点返回FAILURE或SUCCESS，不再执行。
* 如果超时，终止子节点执行，并返回FAILURE。
*/
var BTTimeOutNode = class extends BTDecoratorNode {
	constructor(name, blackboard) {
		super(name, blackboard);
		this.msec = 0;
		this.child_halted = false;
		this.timeout_started = false;
	}
	init(data) {
		if (data.hasOwnProperty("msec")) this.msec = data["msec"];
	}
	tick() {
		if (!this.timeout_started) {
			this.timeout_started = true;
			this.status = 3;
			this.child_halted = false;
			if (this.msec > 0) this.timerHandler = setTimeout(() => {
				if (this.getChild().status == 3) {
					this.child_halted = true;
					this.haltChild();
				}
			}, this.msec);
		}
		if (this.child_halted) {
			this.timeout_started = false;
			return 1;
		} else {
			const child_status = this.getChild().evaluate();
			if (child_status != 3) {
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
//#endregion
//#region dream-cc-ai/src/behaviorTree/BTUtils.ts
/**
* 行为树
*/
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
		if (root.type == 1) {
			const controlNode = root;
			for (let index = 0; index < controlNode.numChildren; index++) {
				const child = controlNode.getChild(index);
				this.applyRecursiveVisitor(child, visitor);
			}
		} else if (root.type == 2) {
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
			for (let i = 0; i < indent; i++) stream += "   ";
			if (!node) {
				stream += "!null!\n";
				return;
			}
			let status = "";
			switch (node.status) {
				case 1:
					status = "failure";
					break;
				case 3:
					status = "running";
					break;
				case 2: status = "success";
			}
			stream += "[" + status + "]" + node.name + endl;
			indent++;
			if (node.type == 1) {
				const controlNode = node;
				for (let index = 0; index < controlNode.numChildren; index++) {
					const child = controlNode.getChild(index);
					recursivePrint(indent, child);
				}
			} else if (node.type == 2) recursivePrint(indent, node.getChild());
		};
		stream += "----------------\n";
		recursivePrint(0, root);
		stream += "----------------\n";
		return stream;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/BTNodeKeys.ts
/**
* 节点KEY
*/
let BTNodeKeys = /* @__PURE__ */ function(BTNodeKeys) {
	/**
	* 按从左到右的顺序依次执行子节点。
	* 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点不会再执行。
	* 如果某个子节点返回SUCCESS，立即执行下一个子节点（不会等下一次tick()）。
	* 如果所有子节点返回SUCCESS，返回SUCCESS。
	*/
	BTNodeKeys["SEQUENCE"] = "sequence";
	/**
	* 尝试依次执行其所有子节点，并且每个子节点只有在成功执行后才会继续到下一个。
	* 如果任何一个子节点失败，整个序列失败。
	*/
	BTNodeKeys["ReactiveSequence"] = "reactiveSequence";
	/** 同SequenceNode，不同之处在于如果某个子节点返回FAILURE，返回FAILURE，终止所有节点的执行。
	* 但不复位current_child_idx_。所以当再次tick()时，从FAILURE的子节点开始。 */
	BTNodeKeys["SequenceStar"] = "sequenceStar";
	/**
	* 当返回SUCCESS的子节点个数>=THRESHOLD_SUCCESS时，返回SUCCESS。
	* 当返回FAILURE的子节点个数>=THRESHOLD_FAILURE时，返回FAILURE。
	* 当程序判断绝不可能SUCCESS时，返回FAILURE。如 failure_children_num > children_count - success_threshold_。
	*/
	BTNodeKeys["PARALLEL"] = "parallel";
	/**
	* 在勾选第一个子节点之前，节点状态变为RUNNING。
	* 如果一个子节点返回FAILURE，则回退标记下一个子节点。
	* 如果最后一个子进程也返回FAILURE，那么所有的子进程都停止，回退进程返回FAILURE。
	* 如果子进程返回SUCCESS，则停止并返回SUCCESS。所有的孩子都停下来了。
	*/
	BTNodeKeys["FALLBACK"] = "fallback";
	/**
	* 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点会再次执行，reactive所在。
	* 如果某个子节点返回SUCCESS，不再执行，且返回SUCCESS。
	* 如果某个子节点返回FAILURE，立即执行下一个子节点（不会等下一次tick()）。如果所有子节点返回FAILURE，返回FAILURE。
	*/
	BTNodeKeys["ReactiveFallback"] = "reactiveFallback";
	/**
	* 有2或3个子节点，node1就是if判断的条件。
	* 如果node1返回SUCCESS，那么node2执行；
	* 否则，node3执行。
	* 如果没有node3，返回FAILURE。
	* 该结点not reactive，
	* 体现在一旦node1不返回RUNNING了，就进入了node2或node3的执行，以后tick()不会再执行node1了，也即不会再检查if条件的变化。
	*/
	BTNodeKeys["IfThenElseNode"] = "ifThenElse";
	/**
	* 是IfThenElseNode的reactive版本。
	* reactive体现在每次tick()都会执行node1，即检查if条件的变化。
	* 若node1返回值有SUCCESS、FAILURE的切换变化，就会打断node2或node3的执行，重新选择对应的node。
	*/
	BTNodeKeys["WhileDoElseNode"] = "whileDoElse";
	/**
	* 延迟指定时间后执行子节点
	*/
	BTNodeKeys["Delay"] = "delay";
	/**
	* 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回FAILURE，即强制返回失败状态。
	*/
	BTNodeKeys["ForceFailure"] = "forceFailure";
	/**
	* 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回SUCCESS，即强制返回成功状态。
	*/
	BTNodeKeys["ForceSuccess"] = "forceSuccess";
	/**
	* 如果子节点执行后返回RUNNING，该节点返回RUNNING；
	* 如果子节点执行后返回SUCCESS，该节点返回FAILURE；
	* 如果子节点执行后返回FAILURE，该节点返回SUCCESS；
	* 即对子节点的执行结果取反。
	*/
	BTNodeKeys["Inverter"] = "inverter";
	/**
	* 如果子节点执行后返回RUNNING或SUCCESS，下次tick()继续执行子节点，直到子节点返回FAILURE。
	*/
	BTNodeKeys["KeepRunningUntilFailure"] = "keepRunningUntilFailure";
	/**
	* 重复执行子节点NUM_CYCLES 次，若每次都返回 SUCCESS，该节点返回SUCCESS；
	* 若子节点某次返回FAILURE，该节点不再重复执行子节点，立即返回FAILURE；
	* 若子节点返回RUNNING，该节点也返回RUNNING。
	*/
	BTNodeKeys["Repeat"] = "repeat";
	/**
	* 如果子节点执行后返回RUNNING，该节点返回RUNNING；
	* 如果子节点执行后返回SUCCESS，该节点返回SUCCESS，不再执行；
	* 如果子节点执行后返回FAILURE，该节点再次尝试执行子节点，直到尝试了num_attempts次；
	*/
	BTNodeKeys["Retry"] = "retry";
	/**
	* 在设置的msec 毫秒内，返回子节点执行的状态。
	* 若子节点返回FAILURE或SUCCESS，不再执行。
	* 如果超时，终止子节点执行，并返回FAILURE。
	*/
	BTNodeKeys["TimeOut"] = "timeout";
	return BTNodeKeys;
}({});
//#endregion
//#region dream-cc-ai/src/behaviorTree/controls/BTReactiveSequence.ts
/**
* 尝试依次执行其所有子节点，并且每个子节点只有在成功执行后才会继续到下一个。
* 如果任何一个子节点失败，整个序列失败。
*/
var BTReactiveSequence = class extends BTControlNode {
	constructor(name, blackboard) {
		super(name, blackboard);
	}
	tick() {
		let success_count = 0;
		let running_count = 0;
		for (let index = 0; index < this.numChildren; index++) switch (this.$children[index].evaluate()) {
			case 3:
				running_count++;
				this.haltChildren(index + 1);
				return 3;
			case 1:
				this.haltChildren();
				return 1;
			case 2:
				success_count++;
				break;
			case 0: throw new Error("ReactiveSequence: child node is idle");
			default: throw new Error("ReactiveSequence: child node status is invalid");
		}
		if (success_count == this.numChildren) {
			this.haltChildren();
			return 2;
		}
		return 3;
	}
};
//#endregion
//#region dream-cc-ai/src/behaviorTree/BTContext.ts
var BTContext = class {
	constructor() {
		this.class_map = /* @__PURE__ */ new Map();
		this.$init();
	}
	$init() {
		this.register("sequence", BTSequenceNode);
		this.register("reactiveSequence", BTReactiveSequence);
		this.register("sequenceStar", BTSequenceStarNode);
		this.register("ifThenElse", BTIfThenElseNode);
		this.register("whileDoElse", BTWhileDoElseNode);
		this.register("parallel", BTParallelNode);
		this.register("fallback", BTFallbackNode);
		this.register("reactiveFallback", BTReactiveFallback);
		this.register("delay", BTDelayNode);
		this.register("forceFailure", BTForceFailureNode);
		this.register("forceSuccess", BTForceSuccessNode);
		this.register("keepRunningUntilFailure", BTKeepRunningUntilFailureNode);
		this.register("inverter", BTInverterNode);
		this.register("repeat", BTRepeatNode);
		this.register("retry", BTRetryNode);
		this.register("timeout", BTTimeOutNode);
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
		if (!clazz) throw new Error(`${data.name, data.type}节点不存在`);
		let result = new clazz(data.name, blackboard);
		result.init(data);
		const isControl = result.type == 1;
		const isDecorator = result.type == 2;
		if (data.children) for (let index = 0; index < data.children.length; index++) {
			const child_data = data.children[index];
			if (isControl) result.addChild(this.createNode(child_data, blackboard));
			if (isDecorator) {
				const decorator = result;
				if (index > 0) throw new Error("装饰节点只能有一个子节点=>" + data);
				decorator.setChild(this.createNode(child_data, blackboard));
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
//#endregion
//#region dream-cc-ai/src/behaviorTree/BTBlackboard.ts
/**
* 行为树黑板
*/
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
//#endregion
//#region dream-cc-ai/src/behaviorTree/ecs/BehaviorTreeComponent.ts
/**
* 行为树组件
*/
var BehaviorTreeComponent = class extends ECSComponent {
	constructor() {
		super();
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
		if (data) this.setData(data, blackboard);
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
		if (old) old.destroy();
	}
	/**
	* 黑板
	*/
	get blackboard() {
		if (!this.root) return null;
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
//#endregion
//#region dream-cc-ai/src/behaviorTree/ecs/BehaviorTreeSystem.ts
/**
* 行为树系统
*/
var BehaviorTreeSystem = class extends ECSSystem {
	constructor() {
		super(new MatcherAllOf([BehaviorTreeComponent]));
	}
	$tick(entitys, dt) {
		let currentTime = Timer.currentTime;
		for (let entity of entitys) {
			let tree = this.world.getComponent(entity, BehaviorTreeComponent);
			if (!tree) return;
			if (currentTime - tree.lastTime < tree.frameInterval) return;
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
//#endregion
//#region dream-cc-ai/src/fsm/FSM.ts
/**
* 状态机
*/
var FSM = class extends EventDispatcher {
	constructor(owner, name) {
		super();
		this.owner = owner;
		this.__name = name;
		this.__states = /* @__PURE__ */ new Map();
	}
	tick(dt) {
		if (this.__current) this.__current.tick(dt);
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
		if (this.__state == value) return;
		let oldKey = this.__state;
		let old = this.__current;
		if (old) {
			if (this.debug) Logger.log(this.__name + " 所属:" + this.owner.name + " 退出状态==>" + this.__current.name, "FSM");
			old.exit();
		}
		this.__current = null;
		if (!this.__states.has(value)) throw new Error("状态机:" + this.__name + " 所属:" + this.owner.name + "未找到状态==>" + value);
		this.__state = value;
		this.__current = this.__states.get(value);
		if (this.debug) Logger.log(this.__name + " 所属:" + this.owner.name + " 进入状态==>" + this.__current.name, "FSM");
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
			if (this.__current) this.__current.exit();
			this.__states.forEach((element) => {
				element.destroy();
			});
			this.__states.clear();
			return true;
		}
		return false;
	}
};
//#endregion
//#region dream-cc-ai/src/fsm/ecs/FSMComponent.ts
var FSMComponent = class extends ECSComponent {
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
//#endregion
//#region dream-cc-ai/src/fsm/ecs/FSMSystem.ts
var FSMSystem = class extends ECSSystem {
	constructor() {
		super(new MatcherAllOf([FSMComponent]));
	}
	$tick(entitys, dt) {
		for (let entity of entitys) this.world.getComponent(entity, FSMComponent).fsm.tick(dt);
	}
};
//#endregion
export { BTActionNode, BTAsyncActionNode, BTBlackboard, BTConditionNode, BTContext, BTControlNode, BTCoroActionNode, BTDecoratorNode, BTDelayNode, BTFallbackNode, BTForceFailureNode, BTForceSuccessNode, BTIfThenElseNode, BTInverterNode, BTKeepRunningUntilFailureNode, BTNode, BTNodeKeys, BTNodeStatus, BTNodeType, BTParallelNode, BTReactiveFallback, BTRepeatNode, BTRetryNode, BTSequenceNode, BTSequenceStarNode, BTSimpleActionNode, BTSimpleConditionNode, BTStatefulActionNode, BTSyncActionNode, BTTimeOutNode, BTUtils, BTWhileDoElseNode, BehaviorTreeComponent, BehaviorTreeSystem, FSM, FSMComponent, FSMSystem };

//# sourceMappingURL=dream-cc-ai.mjs.map