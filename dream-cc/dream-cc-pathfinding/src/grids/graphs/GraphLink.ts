

export class GraphLink {
    fromId: string;
    toId: string;
    id: string;
    data: any;
    constructor(fromId: string, toId: string, data: any, id: string) {
        this.fromId = fromId;
        this.toId = toId;
        this.data = data;
        this.id = id;
    }
}