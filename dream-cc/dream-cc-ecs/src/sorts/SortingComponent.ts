import { ECSComponent } from "../core/ECSComponent";

/**
 * 排序组件
 */
export class SortingComponent extends ECSComponent {
  /**排序索引 */
  index: number = 0;
  constructor() {
    super();
  }
}
