

/**
 * 节点KEY
 */
export enum BTNodeKeys {
   //----------------------控制节点-----------------------
   /**
    * 按从左到右的顺序依次执行子节点。
    * 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点不会再执行。
    * 如果某个子节点返回SUCCESS，立即执行下一个子节点（不会等下一次tick()）。
    * 如果所有子节点返回SUCCESS，返回SUCCESS。
    */
   SEQUENCE = "sequence",
   /**
    * 尝试依次执行其所有子节点，并且每个子节点只有在成功执行后才会继续到下一个。
    * 如果任何一个子节点失败，整个序列失败。
    */
   ReactiveSequence = "reactiveSequence",
   /** 同SequenceNode，不同之处在于如果某个子节点返回FAILURE，返回FAILURE，终止所有节点的执行。
   * 但不复位current_child_idx_。所以当再次tick()时，从FAILURE的子节点开始。 */
   SequenceStar = "sequenceStar",
   /**
    * 当返回SUCCESS的子节点个数>=THRESHOLD_SUCCESS时，返回SUCCESS。
    * 当返回FAILURE的子节点个数>=THRESHOLD_FAILURE时，返回FAILURE。
    * 当程序判断绝不可能SUCCESS时，返回FAILURE。如 failure_children_num > children_count - success_threshold_。
    */
   PARALLEL = "parallel",
   /**
   * 在勾选第一个子节点之前，节点状态变为RUNNING。
   * 如果一个子节点返回FAILURE，则回退标记下一个子节点。
   * 如果最后一个子进程也返回FAILURE，那么所有的子进程都停止，回退进程返回FAILURE。
   * 如果子进程返回SUCCESS，则停止并返回SUCCESS。所有的孩子都停下来了。
   */
   FALLBACK = "fallback",
   /**
   * 如果某个子节点返回RUNNING，返回RUNNING，且下次tick()时之前的子节点会再次执行，reactive所在。
   * 如果某个子节点返回SUCCESS，不再执行，且返回SUCCESS。
   * 如果某个子节点返回FAILURE，立即执行下一个子节点（不会等下一次tick()）。如果所有子节点返回FAILURE，返回FAILURE。
   */
   ReactiveFallback = "reactiveFallback",
   /**
   * 有2或3个子节点，node1就是if判断的条件。
   * 如果node1返回SUCCESS，那么node2执行；
   * 否则，node3执行。
   * 如果没有node3，返回FAILURE。
   * 该结点not reactive，
   * 体现在一旦node1不返回RUNNING了，就进入了node2或node3的执行，以后tick()不会再执行node1了，也即不会再检查if条件的变化。
   */
   IfThenElseNode = "ifThenElse",
   /**
   * 是IfThenElseNode的reactive版本。
   * reactive体现在每次tick()都会执行node1，即检查if条件的变化。
   * 若node1返回值有SUCCESS、FAILURE的切换变化，就会打断node2或node3的执行，重新选择对应的node。
   */
   WhileDoElseNode = "whileDoElse",
   //----------------------装饰节点-----------------------

   /**
    * 延迟指定时间后执行子节点
    */
   Delay = "delay",
   /**
   * 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回FAILURE，即强制返回失败状态。
   */
   ForceFailure = "forceFailure",
   /**
   * 如果子节点执行后返回RUNNING，该节点返回RUNNING；否则，该节点返回SUCCESS，即强制返回成功状态。
   */
   ForceSuccess = "forceSuccess",
   /**
   * 如果子节点执行后返回RUNNING，该节点返回RUNNING；
   * 如果子节点执行后返回SUCCESS，该节点返回FAILURE；
   * 如果子节点执行后返回FAILURE，该节点返回SUCCESS；
   * 即对子节点的执行结果取反。
   */
   Inverter = "inverter",
   /**
   * 如果子节点执行后返回RUNNING或SUCCESS，下次tick()继续执行子节点，直到子节点返回FAILURE。
   */
   KeepRunningUntilFailure = "keepRunningUntilFailure",
   /**
   * 重复执行子节点NUM_CYCLES 次，若每次都返回 SUCCESS，该节点返回SUCCESS；
   * 若子节点某次返回FAILURE，该节点不再重复执行子节点，立即返回FAILURE；
   * 若子节点返回RUNNING，该节点也返回RUNNING。
   */
   Repeat = "repeat",
   /**
   * 如果子节点执行后返回RUNNING，该节点返回RUNNING；
   * 如果子节点执行后返回SUCCESS，该节点返回SUCCESS，不再执行；
   * 如果子节点执行后返回FAILURE，该节点再次尝试执行子节点，直到尝试了num_attempts次；
   */
   Retry = "retry",
   /**
   * 在设置的msec 毫秒内，返回子节点执行的状态。
   * 若子节点返回FAILURE或SUCCESS，不再执行。
   * 如果超时，终止子节点执行，并返回FAILURE。
   */
   TimeOut = "timeout",
}