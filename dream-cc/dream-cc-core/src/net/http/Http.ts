import { Logger } from "../../loggers/Logger";

/**
 * http
 */
export class Http {

    /**
     * get请求
     * @param url 
     * @param param 
     * @param callback 
     * @param setRequestHeader 
     */
    static get(url: string, param: Object, callback: (err?: Error, data?: any) => void, setRequestHeader?: (v: XMLHttpRequest) => void): void {
        this.http(url, "get", param, callback, setRequestHeader);
    }

    /**
     * post 请求
     * @param url 
     * @param param 
     * @param callback 
     * @param setRequestHeader
     */
    static post(url: string, param: Object, callback: (err?: Error, data?: any) => void, setRequestHeader?: (v: XMLHttpRequest) => void): void {
        this.http(url, "post", param, callback, setRequestHeader);
    }

    private static http(url: string, method: string, param: object, callback: (err?: Error, data?: any) => void, setRequestHeader?: (v: XMLHttpRequest) => void): void {
        if (param) {
            let s = "?";
            for (let key in param) {
                let p = this.isValidKey(key, param);
                url += `${s}${key}=${p}`;
                s = '&';
            }
        }
        Logger.log(`http send:${url}`, Logger.TYPE.NET);
        let request = new XMLHttpRequest();
        if (method == "get") {
            request.open("get", url, true);
        } else {
            request.open("post", url);
        }
        //请求头信息设置
        if (setRequestHeader != null) {
            setRequestHeader(request);
        } else {
            this.setRequestHeader(request);
        }
        request.onreadystatechange = () => {
            console.log("url : " + request.responseURL);
            if (request.readyState == 4) {
                let status = request.status;
                let txt = request.responseText;
                if (status >= 200 && status < 300) {
                    Logger.log(`url:(${url}) result:${txt})`, Logger.TYPE.NET);
                    callback(undefined, txt);
                } else {
                    Logger.log(`url:(${url}) request error. status:(${request.status})`, Logger.TYPE.NET);
                    callback(new Error(`Http:${method}失败:${url}`));
                }
            }
        };
        request.send();
    }

    private static isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
        return key in object;
    }

    /**
     * 设置http头
     * @param request XMLHttpRequest
     */
    private static setRequestHeader(request: XMLHttpRequest): void {
        request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8;application/x-www-form-urlencoded;application/json;charset=UTF-8");
        request.setRequestHeader("Cache-Control", "no-store");
    }
}