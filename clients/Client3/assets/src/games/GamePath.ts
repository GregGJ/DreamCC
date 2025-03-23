import { JsonAsset } from "cc";
import { Texture2D } from "cc";
import { SpriteFrame } from "cc";
import { AudioClip } from "cc";
import { Res, ResURL } from "dream-cc-core";




export class GamePath {

    static soundURL(url: string, type?: any, bundle?: string): ResURL {
        return {
            url: "sounds/" + url,
            type: type || AudioClip,
            bundle: bundle || "res"
        }
    }

    static sheetURL(sheet: string, type?: any, bundle?: string): ResURL {
        return {
            url: "configs/" + sheet,
            type: Res.TYPE.CONFIG,
            bundle: bundle || "res"
        }
    }

    static imageURL(url: string, type?: SpriteFrame | Texture2D): ResURL {
        return {
            url: "images/" + url,
            type: type || SpriteFrame,
            bundle: "res"
        }
    }

    /**
    * 战斗资源地址
    * @param url 
    * @param type 
    */
    static battleURL(url: string, type: any, bundle?: string): ResURL {
        return { url: url, type, bundle: "res" };
    }
}