import { ResRequest } from "../ResRequest";
import { ResURL } from "../ResURL";

export interface ILoaderManager {
    /**
     * 加载资源
     */
    load(reqeust: ResRequest): void;
    /**
     * 卸载
     * @param request 
     */
    unload(request: ResRequest): void;
    /**加载进度汇报 */
    childComplete(url: ResURL): void;
    childError(url: ResURL, err: Error): void;
    childProgress(url: ResURL, progress: number): void;
}