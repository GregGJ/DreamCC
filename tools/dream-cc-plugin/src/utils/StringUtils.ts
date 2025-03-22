


export class StringUtils{



    static isEmpty(value:string):boolean{
        if (value == null || value == undefined || value.length == 0) {
            return true;
        }
        return false;
    }
}