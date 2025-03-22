import { ILoader } from "../loaders/ILoader";
import { ResRequest } from "../ResRequest";
import { ResURL } from "../ResURL";



export interface IRes {

    /**
     * url转key
     * @param url 
     */
    url2Key(url: ResURL): string;

    /**
     * key转url
     * @param key 
     */
    key2Url(key: string): ResURL;

    /**
     * url转资源路径
     * @param url
     */
    url2Path(url: ResURL): string;

    /**
     * url是否相同
     * @param a 
     * @param b 
     */
    urlEqual(a: ResURL | null, b: ResURL | null): boolean;

    /**
     * 设置加载器
     * @param key 
     * @param loader 
     */
    setLoader(key: any, loader: new () => ILoader): void;

    /**
     * 创建资源请求
     * @param url 
     * @param refKey 
     * @param progress 
     * @param cb 
     */
    create(url: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void, cb?: (err?: Error) => void): ResRequest;
    /**
     * 获取加载器
     * @param key 
     */
    getLoader(key: any): new () => ILoader;
    /**
     * 获取AssetBundle
     * @param names 
     */
    loadAssetBundles(names: string | Array<string>): Promise<void>;
}