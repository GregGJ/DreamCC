import { GMovieClip } from "fairygui-cc";
import { UI_Flags } from "./MapBinder";



export class MapAniUtils {

    /**
     * 插旗动画
     */
    static readonly PLANT_FLAGS = 0;
    /**
     * 
     */
    static readonly RED = 1;
    /**
     * 升级到蓝色
     */
    static readonly UP_TO_BLUE = 2;
    /**
     * 蓝色旗帜
     */
    static readonly BLUE = 3;
    /**
     * 升级到白色
     */
    static readonly UP_TO_WHITE = 4;
    /**
     * 白色旗帜
     */
    static readonly WHITE = 5;

    private static __flagsAnis: Array<{ start: number, end: number }> = [
        { start: 0, end: 22 },
        { start: 22, end: 63 },
        { start: 64, end: 87 },
        { start: 88, end: 133 },
        { start: 134, end: 158 },
        { start: 158, end: 178 },
    ]

    /**
     * 播放旗帜动画
     * @param flags 
     * @param aniKey 
     * @param callBack 
     */
    static PlayFlagsAni(flags: UI_Flags, aniKey: number, times: number = -1, end?: number, callBack?: () => void): void {
        let aniData = this.__flagsAnis[aniKey];
        flags.m_ani_flags.playing = true;
        flags.m_ani_flags.setPlaySettings(aniData.start, aniData.end, times, end, callBack);
    }

    /**
     * 展示评分动画
     * @param flags 
     * @param start 
     * @param end 
     * @param cb 
     */
    static PlayStarAni(flags: UI_Flags, start: number, end: number, cb: () => void): void {
        this.ShowStars(flags, start);
        let aniCallback = (index: number) => {
            if (index < end) {
                this.__playStarAni(flags, index, aniCallback);
            } else {
                cb();
            }
        }
        this.__playStarAni(flags, start, aniCallback);
    }

    private static __playStarAni(flags: UI_Flags, index: number,callback: (index: number) => void): void {
        let starView = flags.getChild("ani_star_" + index) as GMovieClip;
        starView.visible = true;
        starView.playing = true;
        starView.setPlaySettings(0, 16, 1, 16, () => {
            starView.frame = 16;
            starView.playing = false;
            callback(index + 1);
        });
    }

    /**
     * 直接显示评分
     * @param flags 
     * @param stars 评分数量
     */
    static ShowStars(flags: UI_Flags, stars: number): void {
        for (let index = 0; index < 3; index++) {
            const starView = flags.getChild("ani_star_" + index) as GMovieClip;
            if (index < stars) {
                starView.playing = false;
                starView.frame = 16;
                starView.visible = true;
            } else {
                starView.visible = false;
            }
        }
    }
}