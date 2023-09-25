import { IEntity } from "./IEntity";
export interface IProperty {
    modelName: string;
    entityName: string;
    name: string;
    description: string;
    displayName: string;
    memberType: string;
    format: string;
    isAutoGenerated: boolean;
    isNullable: boolean;
    maximumLength: number;
    minimumLength: number;
    typeName: string;
    entity: IEntity;
}
export var PropertyModelName: string = 'Property';