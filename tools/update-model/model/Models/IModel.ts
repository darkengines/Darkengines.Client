import { IEntity } from "./IEntity";
export interface IModel {
    name: string;
    description: string;
    displayName: string;
    entities: IEntity[];
}
export var ModelModelName: string = 'Model';
