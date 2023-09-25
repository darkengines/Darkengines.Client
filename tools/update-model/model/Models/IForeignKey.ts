import { IModel } from "./IModel";
import { INavigation } from "./INavigation";
import { IForeignKeyProperty } from "./IForeignKeyProperty";
export interface IForeignKey {
    modelName: string;
    name: string;
    model: IModel;
    navigations: INavigation[];
    properties: IForeignKeyProperty[];
}
export var ForeignKeyModelName: string = 'ForeignKey';
