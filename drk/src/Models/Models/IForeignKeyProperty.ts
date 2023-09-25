import { IEntity } from "./IEntity";
import { IProperty } from "./IProperty";
import { IForeignKey } from "./IForeignKey";
export interface IForeignKeyProperty {
    modelName: string;
    foreignKeyName: string;
    principalEntityName: string;
    principalPropertyName: string;
    dependentEntityName: string;
    dependentPropertyName: string;
    dependentEntity: IEntity;
    dependentProperty: IProperty;
    foreignKey: IForeignKey;
    principalEntity: IEntity;
    principalProperty: IProperty;
}
export var ForeignKeyPropertyModelName: string = 'ForeignKeyProperty';
