import { Direction8 } from "../directions/Direction8";
import { ActionKeys } from "./ActionKeys";




export class ActionUtils {


    /**
     * 获取资源动作
     * @param action 
     * @param dir 
     * @returns 
     */
    static getResAction(action: string, dir: Direction8): string {
        if (action == ActionKeys.attack || action == ActionKeys.idle) {
            return action;
        }
        if (action == ActionKeys.walking) {
            if (dir == Direction8.B_B) {
                return ActionKeys.walkingDown;
            } else if (dir == Direction8.T_T) {
                return ActionKeys.walkingUp;
            } else {
                return ActionKeys.walkingRightLeft;
            }
        }
        throw new Error("not support action:" + action);
    }
}