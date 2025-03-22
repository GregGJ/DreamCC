



export class StringUtils {

    /**
     * 判断字符串是否为空
     * @param str 
     * @returns 
     */
    static isEmpty(str: string): boolean {
        return !str || str.length === 0;
    }

    /**
     * 字符转二维数组
     * @param str 
     * @returns 
     */
    static str2NumArrList(str: string, separators: Array<string> = ["|", ","]): number[][] {
        if (separators.length < 2) throw new Error("separators 长度不能小于2");
        if (!str) return []
        let strArr: string[] = str.split(separators[0]);
        let len: number = strArr.length;
        let res: number[][] = [];
        for (let i = 0; i < len; i++) {
            let arr: number[] = strArr[i].split(separators[1]).map(item => Number(item));
            res.push(arr);
        }
        return res;
    }

    /**
     * 字符串转二维数组
     * @param str 
     * @param separators 
     * @returns 
     */
    static str2StringList(str: string, separators: Array<string> = ["|", ","]): string[][] {
        let strArr: string[] = str.split(separators[0]);
        let len: number = strArr.length;
        let res: string[][] = [];
        for (let i = 0; i < len; i++) {
            let arr: string[] = strArr[i].split(separators[1]);
            res.push(arr);
        }
        return res;
    }

    /**
     * 参数替换
     *  @param  str
     *  @param  rest
     *  
     *  @example
     *
     *  let str:string = "你好{},这里是:{}";
     *  console.log(StringUtil.substitute2(str, "蝈蝈","蓝星"));
     *
     *  // 输出结果如下:
     *  // "你好蝈蝈,这里是:蓝星"
     */
    static substitute(str: string, ...rest: any[]): string {
        if (str == null) return '';

        // Replace all of the parameters in the msg string.
        let len: number = rest.length;
        let args: any[];
        if (len == 1 && rest[0] instanceof Array) {
            args = rest[0];
            len = args.length;
        } else {
            args = rest;
        }
        let idx = 0;
        return str.replace(/{}/g, (_, index) => {
            return args[idx++];
        });
    }

    /**
     * 参数替换
     *  @param  str
     *  @param  rest
     *  
     *  @example
     *
     *  let str:string = "here is some info '{0}' and {1}";
     *  console.log(StringUtil.substitute(str, 15.4, true));
     *
     *  // this will output the following string:
     *  // "here is some info '15.4' and true"
     */
    static substitute2(str: string, ...rest: any[]): string {
        if (str == null) return '';

        // Replace all of the parameters in the msg string.
        let len: number = rest.length;
        let args: any[];
        if (len == 1 && rest[0] instanceof Array) {
            args = rest[0];
            len = args.length;
        } else {
            args = rest;
        }

        for (let i: number = 0; i < len; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
        }

        return str;
    }
}