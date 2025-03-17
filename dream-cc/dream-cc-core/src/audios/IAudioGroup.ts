import { ResURL } from "../res/ResURL";
import { IAudioChannel } from "./IAudioChannel";



/**
 * 音频组
 */
export interface IAudioGroup {
    key: number;

    volume: number;

    mute: boolean;

    calculateVolume(): void;

    calculateMute(): void;

    tick(dt: number): void;
    
    play(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;

    getPlayingChannel(url: ResURL): IAudioChannel;

    stopAll(): void;
}