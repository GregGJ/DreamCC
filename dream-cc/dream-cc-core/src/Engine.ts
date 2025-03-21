import { ConfigManager } from "./configs/ConfigManager";
import { LocalConfigLoader } from "./configs/res/LocalConfigLoader";
import { RemoteConfigLoader } from "./configs/res/RemoteConfigLoader";
import { Event } from "./events/Event";
import { IEnginePlugin } from "./interfaces/IEnginePlugin";
import { Res } from "./res/Res";
import { TickerManager } from "./ticker/TickerManager";
import { I18N, L18Acc } from "./utils/I18N";




/**
 * 引擎入口
 */
export class Engine {

    private static plugins = new Map<string, IEnginePlugin>();
    private static inited: boolean = false;

    /**
     * 启动引擎
     * @param plugins 
     * @param progress 
     * @param cb 
     */
    static start(plugins: Array<IEnginePlugin>, progress: (v: number) => void, cb: (err: Error | null) => void): void {
        if (this.inited) {
            throw new Error("重复启动引擎!");
        }
        //配置表加载器
        Res.setLoader(Res.TYPE.CONFIG, LocalConfigLoader);
        
        /**默认语言配置表存取器 */
        if (I18N.langenge != "zh_CN") {
            ConfigManager.register(I18N.defaultSheetName, L18Acc);
        }
        ConfigManager.register(I18N.sheetName, L18Acc);

        let setup_idx: number = 0;
        let total_count = plugins.length;
        for (let idx = 0; idx < plugins.length; idx++) {
            const plugin = plugins[idx];
            plugin.on(Event.PROGRESS, (e) => {
                progress && progress((setup_idx + e.progress) / total_count);
            }, this);
            plugin.on(Event.ERROR, (e) => {
                cb && cb(e.error!);
                //删除所有事件监听
                plugin.offAllEvent();
            }, this);
            plugin.on(Event.COMPLETE, (e) => {
                let target = e.target as IEnginePlugin;
                target.offAllEvent();
                setup_idx++;
                if (setup_idx >= total_count) {
                    cb && cb(null);
                }
            }, this);
            //启动模块
            plugin.start();
            this.plugins.set(plugin.name, plugin);
            this.inited = true;
        }
    }

    /**
     * 获取插件
     * @param name 
     * @returns 
     */
    static getPlugin(name: string): IEnginePlugin | undefined {
        return this.plugins.get(name);
    }

    /**
     * 心跳驱动
     * @param dt 
     * @returns 
     */
    static tick(dt: number): void {
        if (!this.inited) {
            return;
        }
        TickerManager.tick(dt);
    }
}