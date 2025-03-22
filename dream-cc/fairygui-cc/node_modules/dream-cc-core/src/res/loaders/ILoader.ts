import { IEventDispatcher } from "../../events/IEventDispatcher";
import { IPoolable } from "../../pools/IPoolable";
import { ResURL } from "../ResURL";


/**
 * 加载器接口
 * @event Event.COMPLETE 加载完成
 * @event Event.ERROR 加载错误
 * @event Event.PROGRESS 加载进度
 */
export interface ILoader extends IEventDispatcher, IPoolable {
    /**
     * 加载
     * @param url 
     */
    load(url: ResURL): void;
}