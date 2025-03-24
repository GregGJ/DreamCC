import { ECSComponent } from "../core/ECSComponent";
import { ECSEntity } from "../core/ECSEntity";

/**
 * 链接组件
 */
export class LinkComponent extends ECSComponent {
  /**链接目标 */
  target?: ECSEntity;
  constructor() {
    super();
  }
}
