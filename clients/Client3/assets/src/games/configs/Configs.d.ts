declare namespace Config {
   namespace Constants {
      export interface Constants {
         /** diff */
         key: string;
         /** 测试 */
         value: number;
         /** 列表测试 */
         list: Array<number>;
         /** 字符串数组 */
         str_list: Array<string>;
      }
   }
   namespace Language {
      export interface Zh_cn {
         /** key */
         id: string;
         /** 值 */
         value: string;
      }
   }
   namespace Level {
      export interface Level {
         /** id */
         id: number;
         /** 地形 */
         terrains: string;
         /** 难度 */
         difficulty: number;
         /** 模式 */
         mode: number;
         /** 血量 */
         hp: number;
         /** 起始金币 */
         glod: number;
         /** 禁用塔类型 */
         disabledTowerType: Array<number>;
         /** 最大等级 */
         towerMaxLevel: number;
         /** 禁用英雄 */
         disableHero: number;
         /** 通关后开启关卡 */
         unlocks: Array<number>;
         /** 生命小于等于时通关失败 */
         endLife: number;
      }
   }
   namespace Maps {
      export interface MapPath {
         /** 关卡ID */
         level: number;
         /** 路径动画 */
         pathAni: string;
      }
   }
   namespace Monster {
      export interface Monster {
         /** id */
         id: number;
         /** 皮肤 */
         skin: string;
         /** 碰撞矩形 */
         bounds: Array<number>;
         /** 头位置 */
         head_position: Array<number>;
         /** 脚底位置 */
         anchor: Array<number>;
         /** 血条位置 */
         hp_bar: Array<number>;
         /** 血条缩放比例 */
         hp_scale: Array<number>;
         /** 半径大小 */
         size: number;
         /** 血量 */
         hp: number;
         /** 移动速度 */
         speed: number;
         /** 护甲 */
         armor: number;
         /** 护甲类型 */
         armor_type: number;
         /** 走到终点后扣血 */
         life: number;
         /** 技能ID */
         skills: Array<number>;
         /** 消灭后获得金币数量 */
         gold: number;
      }
   }
   namespace Skills {
      export interface PassiveSkill {
         /** id */
         id: number;
         /** 名称 */
         name: string;
         /** 图标 */
         icon: string;
         /** 类型 */
         type: number;
         /** 触发条件 */
         triggerCondition: number;
         /** 触发条件数据 */
         triggerArgs: Array<number>;
         /** 触发概率 */
         trigger: number;
         /** 额外作用 */
         cmd: string;
         /** 作用参数 */
         cmdArgs: Array<number>;
         /** 陷阱ID */
         trapID: number;
         /** 附加Buffer */
         buffers: Array<number>;
         /** 描述 */
         desc: string;
      }
      export interface Skill {
         /** 类型 */
         type: number;
         /** 等级 */
         level: number;
         /** 技能主类型 */
         mainType: number;
         /** 名称 */
         name: string;
         /** 图标 */
         icon: string;
         /** 描述 */
         desc: string;
         /** 主动技能类型 */
         activeType: number;
         /** 僵直时间 */
         cd: number;
         /** 起手动作 */
         startAnimation: string;
         /** 起手特效 */
         startEffect: string;
         /** 目标类型 */
         targetType: number;
         /** 攻击距离 */
         attackRange: number;
      }
   }
   namespace Tower {
      export interface Tower {
         /** id */
         id: number;
         /** 类型 */
         type: number;
         /** 等级 */
         level: number;
         /** 建造价格 */
         glod: number;
         /** 升级列表 */
         upList: Array<number>;
         /** 建造过程底座中心点 */
         building: Array<number>;
         /** 主图标 */
         icon: string;
         /** 平A */
         attack: number;
         /** 技能 */
         skill: Array<number>;
      }
   }
   }
