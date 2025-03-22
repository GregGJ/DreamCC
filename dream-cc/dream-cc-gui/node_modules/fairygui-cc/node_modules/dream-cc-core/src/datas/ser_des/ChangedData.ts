



export class ChangedData {
    public key: string;
    public newValue: any;
    public oldValue: any;

    constructor() {

    }

    public static create(newValue?: any, oldValue?: any, key?: string): ChangedData {
        let result: ChangedData = new ChangedData();
        result.oldValue = oldValue;
        result.newValue = newValue;
        result.key = key;
        return result;
    }
}