



/**
 * 属性集合
 */
export class Attributes {

    private __map = new Map<string, any>();

    setBaseValue(key: string, value: any) {
        this.__map.set(key, value);
    }

    getBaseValue(key: string) {
        return this.__map.get(key);
    }
}