import { GraphLink } from "./GraphLink";


export class GraphNode {
    id: string;
    links: Array<GraphLink>;
    data: any;
    constructor(id: string, data: any) {
        this.id = id;
        this.data = data;
    }
}