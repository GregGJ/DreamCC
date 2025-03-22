import { AudioClip } from "cc";
import { ResURL } from "dream-cc-core";




export class GamePath {
    
    static soundURL(url: string, type?: any, bundle?: string): ResURL {
        return {
            url: "sounds/" + url,
            type: type || AudioClip,
            bundle: bundle || "res"
        }
    }
}