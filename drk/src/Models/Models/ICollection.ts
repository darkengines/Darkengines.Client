import { IEntity } from "./IEntity";
import { IForeignKey } from "./IForeignKey";
export interface ICollection {
    modelName: string;
    entityName: string;
    name: string;
    description: string;
    displayName: string;
    memberType: string;
    foreignKeyName: string;
    entity: IEntity;
    foreignKey: IForeignKey;
}
export var CollectionModelName: string = 'Collection';
