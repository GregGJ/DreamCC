import { ECSComponent } from "../core/ECSComponent";


/**
 * 阵营基础类
 */
export class CampComponent extends ECSComponent {
    /**
     * 阵营
     */
    camp: number = 0;
    constructor() {
        super();
    }
}