import { AudioManager, ConfigManager, IDConfigAccessor } from "dream-cc-core";
import { CampComponent, DataComponent, ECSEntity, LevelManager, TransformComponent } from "dream-cc-ecs";
import { GamePath } from "../../../games/GamePath";
import { UI_BattleView } from "../BattleBinder";
import { ActionKeys } from "../actions/ActionKeys";
import { UnitAnimationComponent } from "../ecs/display/UnitAnimationComponent";
import { BattleEntityFactory } from "../levels/BattleEntityFactory";
import { BattleEntitys } from "../levels/BattleEntitys";
import { Timeline } from "../utils/Timeline";
import { BaseState } from "./BaseState";
import { SpawnData } from "../datas/SpawnData";
import { FGUIEvent } from "fairygui-cc";
import { ConfigKeys } from "../../../games/configs/ConfigKeys";
import { MonsterVO } from "../datas/entitys/MonsterVO";
import { GUIManager } from "dream-cc-gui";
import { GUIKeys } from "../../../games/consts/GUIKeys";
import { FSMStates } from "./FSMStates";
import { VictoryData } from "../../Map/datas/VictoryData";




export class RunningState extends BaseState {

    spawns: Array<SpawnData>;
    private __tips: Map<number, boolean>;
    private __time: number = 0;
    constructor(level: string) {
        super("RunningState", level);
        this.__tips = new Map<number, boolean>();
        this.spawns = [];
    }

    enter(data?: any): void {
        super.enter(data);
        //播放战斗前置音乐
        AudioManager.playMusic(GamePath.soundURL("MusicBattleUnderAttackForest1"));
        //清理
        this.__tips.clear();
        this.spawns.splice(0, this.spawns.length);
    }

    tick(dt: number): void {
        if (this.model.paused) {
            return;
        }
        Timeline.single.tick(dt);
        this.__time += dt;
        //怪物列表
        let monsters = this.world.getComponents(CampComponent).filter((com) => com.camp == 2).map((com) => com.entity);
        //游戏结束
        if (this.isGameover(monsters)) {

            return;
        }
        //波次检查
        this.__checkWave();
        this.__spawnMonster();
    }

    exit(): void {
        super.exit();
    }

    private isGameover(monsters: Array<ECSEntity>): boolean {
        //失败检测
        if (this.__isDefeated(monsters)) {
            return true;
        }
        if (this.__isVictory(monsters)) {
            return true;
        }
        return false;
    }

    /**
     * 检查波次
     */
    private __checkWave(): void {
        let list = this.model.waveConfig;
        if (this.model.waveIndex >= list.length) {
            return;
        }
        let waveConfig = list[this.model.waveIndex];
        if (this.__time >= waveConfig.time) {
            for (let sIdx = 0; sIdx < waveConfig.spawns.length; sIdx++) {
                const spawnConfig = waveConfig.spawns[sIdx];
                const count = spawnConfig.count;
                for (let index = 0; index < count; index++) {
                    let spawn = new SpawnData(
                        this.model.waveIndex,
                        this.__time + spawnConfig.delay + (spawnConfig.interval * index),
                        spawnConfig.path,
                        spawnConfig.creep,
                        index
                    );
                    this.spawns.push(spawn);
                }
            }
            this.model.waveIndex++;
            if (this.ui.m_ui_bottom.m_ui_start.m_btn_start.enabled) {
                //取消提示
                this.__closeTip();
            }
        } else {
            if (this.model.waveIndex == 0) {
                return;
            }
            if (this.__tips.has(this.model.waveIndex)) {
                return;
            }
            if (this.__time + waveConfig.tipTime >= waveConfig.time) {
                this.__tips.set(this.model.waveIndex, true);
                //需要提示下一波即将到来
                console.log("下一波即将到来");
                this.ui.m_ui_bottom.m_ui_start.m_btn_start.enabled = true;
                this.ui.m_ui_bottom.m_ui_start.m_btn_start.onClick(this.__startButtonClick, this);
            }
        }
    }

    /**
     * 生成怪物
     */
    private __spawnMonster(): void {
        //怪物配置
        for (let index = 0; index < this.spawns.length; index++) {
            const spawn = this.spawns[index];
            if (this.__time >= spawn.time) {
                this.spawns.splice(index, 1);
                index--;
                BattleEntityFactory.createMonster(this.world, spawn);
            }
        }
    }

    /**
     * 检测是否失败
     */
    private __isDefeated(monsters: Array<ECSEntity>): boolean {
        if (!this.model.end) {
            throw new Error("结束区域不存在！");
        }
        for (let index = 0; index < monsters.length; index++) {
            const entity = monsters[index];
            const trans = this.world.getComponent(entity, TransformComponent);
            const data_com = this.world.getComponent(entity, DataComponent);

            let battleVO = data_com.data as MonsterVO;

            let x: number = trans.x;
            let y: number = trans.y;

            //走进结束点
            if (this.model.end.contains(x, y)) {
                this.world.removeEntity(entity);
                let life = this.model.life - battleVO.config!.life;
                life = life < 0 ? 0 : life;
                this.model.life = life;

                //检测玩家血量
                const endLife = this.model.levelConfig.endLife || 0;
                if (this.model.life <= endLife) {
                    this.model.paused = true;
                    GUIManager.open(GUIKeys.Defeated, (index: number) => {
                        this.model.paused = false;
                        if (index == 0) {
                            //重来
                            this.model.fsm.switchState(FSMStates.Init, this.data);
                        } else {
                            GUIManager.close(GUIKeys.Battle, true);
                        }
                    });
                    return true;
                }
            }
        }
        return false;
    }

    private __isVictory(monsters: Array<ECSEntity>): boolean {
        if (this.model.waveIndex < this.model.waveTotal) {
            return false;
        }
        if (monsters.length == 0 && this.spawns.length == 0) {
            this.model.paused = true;
            //游戏结束
            let progress: number = this.model.life / this.model.maxlife;
            let star: number = 0;
            if (progress < 0.3) {
                star = 1;
            } else if (progress < 0.6) {
                star = 2;
            } else {
                star = 3;
            }
            let data: VictoryData = new VictoryData();
            data.level = this.model.level;
            data.difficulty = this.model.difficulty;
            data.mode = this.model.mode;
            data.stars = star;
            GUIManager.open(GUIKeys.Settlement, data);
            return true;
        }
        return false;
    }

    private __startButtonClick(e: FGUIEvent): void {
        this.__closeTip();
        const waveConfig = this.model.waveConfig![this.model.waveIndex];
        if (waveConfig.glod != undefined) {
            const starTip = waveConfig.time - waveConfig.tipTime;
            const t = this.__time - starTip;
            const p = 1 - (t / waveConfig.tipTime);
            if (p > 0.7) {
                this.model.glod += waveConfig.glod;
            } else {
                this.model.glod += Math.floor(waveConfig.glod * p);
            }
        }
        this.__time = waveConfig.time;
    }

    private __closeTip(): void {
        this.ui.m_ui_bottom.m_ui_start.m_btn_start.offClick(this.__startButtonClick, this);
        this.ui.m_ui_bottom.m_ui_start.m_btn_start.enabled = false;
    }

    private get ui(): UI_BattleView {
        return this.model.mediator.ui as UI_BattleView;
    }
}