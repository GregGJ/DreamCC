import { IEventDispatcher } from "../../events/IEventDispatcher";
import { IPoolable } from "../../pools/IPoolable";
import { ResURL } from "../ResURL";


/**
 * 加载器接口
 */
export interface ILoader extends IEventDispatcher, IPoolable {
    /**
     * 加载
     * @param url 
     */
    load(url: ResURL): void;
}