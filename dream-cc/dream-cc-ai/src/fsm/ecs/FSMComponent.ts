import { ECSComponent } from "dream-cc-ecs";
import { FSM } from "../FSM";





export class FSMComponent extends ECSComponent {

    /**
     * 状态机
     */
    fsm: FSM;

    constructor() {
        super();
        this.fsm = new FSM(this, "FSMComponent");
    }
    
    destroy(): boolean {
        if (super.destroy()) {
            this.fsm.destroy();
            this.fsm = null;
            return true;
        }
        return false;
    }
}