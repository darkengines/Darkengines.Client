import { IModel } from "./IModel";
import { IMember } from "./IMember";
export interface IEntity {
    modelName: string;
    name: string;
    description: string;
    displayName: string;
    model: IModel;
    members: IMember[];
}
export var EntityModelName: string = 'Entity';
