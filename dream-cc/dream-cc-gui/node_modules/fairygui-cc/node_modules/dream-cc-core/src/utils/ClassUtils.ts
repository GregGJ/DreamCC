


export class ClassUtils {
    
    /**
     * 获取单词指定位置单词
     * @param str 
     * @param n 
     * @returns 
     */
    static getWord(str: string, n: number | Array<number>): string | Array<string> {
        if (Array.isArray(n) && n.length > 0) {
            let arr = [];
            for (let i of n) {
                arr.push(this.getWord(str, i).toString());
            }
            return arr;
        } else {
            const m = str.match(new RegExp('^(?:\\w+\\W+){' + n + '}(\\w+)'));
            if (m) {
                return m[1];
            }
            return "";
        }
    }

    static getContractName(code: string): string {
        const words = this.getWord(code, [0, 1, 2])
        if (words[0] === 'abstract') {
            return words[2]
        }
        return words[1];
    }

    static getFunctionName(code: string): string {
        const words = this.getWord(code, [0, 1])
        if (words[0] === 'constructor') {
            return words[0];
        }
        return words[1];
    }

    static getClassName(value: any): string {
        let className: string;
        if (typeof value != "string") {
            className = value.toString();
            if (className.startsWith("function")) {
                return this.getFunctionName(className);
            } else {
                return this.getContractName(className);
            }
        } else {
            className = value;
        }
        return className;
    }
}