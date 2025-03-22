import { IGUIMediator } from "./IGUIMediator";


export interface IViewCreator
{
    /**
     * 创建Mediator
     */
    createMediator(): IGUIMediator;
}