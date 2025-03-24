import { ECSEntity } from "./ECSEntity";
import { ECSWorld } from "./ECSWorld";



export interface IECSComponent {
    /**所属世界 */
    world: ECSWorld | null;
    /**所属entity*/
    entity: ECSEntity | null;
    /**脏数据标记回调*/
    dirtySignal: (() => void) | null;
    /**标记该组件数据为脏*/
    markDirtied(): void;
    /**启用 */
    enable(): void;
    /**重置*/
    reset(): void;
    /**销毁 */
    destroy(): boolean
}