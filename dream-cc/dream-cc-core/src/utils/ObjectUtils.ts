


/**
 * 对象工具类
 */
export class ObjectUtils {

    /**
     * 将source对象属性拷贝到target对象
     * @param source 
     * @param target 
     */
    static oto(source: any, target: any): void {
        for (let key in source) {
            target[key] = source[key];
        }
    }

    /**
     * 深度克隆
     * @param source 
     * @returns 
     */
    static deepClone<T>(source: any): T {
        if (!source || typeof source != "object")
            return null;
        var obj_str = JSON.stringify(source);
        let result = JSON.parse(obj_str);
        return result as T;
    }

    /**
     * 清理对象
     * @param obj 
     */
    static clear(obj: any): void {
        for (let key in obj) {
            delete obj[key];
        }
    }
}