import { IEntity } from "./IEntity";
import { IForeignKey } from "./IForeignKey";
export interface IReference {
    modelName: string;
    entityName: string;
    name: string;
    description: string;
    displayName: string;
    memberType: string;
    foreignKeyName: string;
    isNullable: boolean;
    entity: IEntity;
    foreignKey: IForeignKey;
}
export var ReferenceModelName: string = 'Reference';
