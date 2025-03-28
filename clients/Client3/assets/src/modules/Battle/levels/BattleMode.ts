import { FSM } from "dream-cc-ai";
import { LevelManager, LevelMode } from "dream-cc-ecs";
import { ConfigKeys } from "../../../games/configs/ConfigKeys";
import { BattleModel } from "../datas/BattleModel";
import { FSMStates } from "../fsm/FSMStates";
import { IdleState } from "../fsm/IdleState";
import { InitState } from "../fsm/InitState";
import { RunningState } from "../fsm/RunningState";
import { LevelKeys } from "./LevelKeys";


/**
 * 战斗模式
 */
export class BattleMode extends LevelMode {

    fsm: FSM;

    constructor() {
        super();
        this.configs = [
            ConfigKeys.Monster_Monster,
            ConfigKeys.Tower_Tower,
            ConfigKeys.Skills_Skill,
        ];
        this.fsm = new FSM(this, "BattleFSM");
        this.fsm.addState(FSMStates.Init, new InitState(LevelKeys.Battle));
        this.fsm.addState(FSMStates.Idle, new IdleState(LevelKeys.Battle));
        this.fsm.addState(FSMStates.Running, new RunningState(LevelKeys.Battle));
        BattleModel.single.fsm = this.fsm;
    }

    protected $init(): void {
        this.fsm.switchState(FSMStates.Init, this.initData[0]);
        this.$initComplete();
    }

    tick(dt: number): void {
        this.fsm.tick(dt);
    }

    destroy(): boolean {
        if (super.destroy()) {
            this.fsm.destroy();
            this.fsm = null;
            BattleModel.single.fsm = null;
            return true;
        }
        return false;
    }

    private get model():BattleModel{
        return BattleModel.single;
    }
}