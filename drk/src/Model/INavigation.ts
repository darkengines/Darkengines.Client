import { IEntityModel } from './IEntityModel';
import { IMember } from './IMember';
import { IPropertyModel } from './IPropertyModel';

export interface INavigation extends IMember {
	type: IEntityModel;
	foreignKey: IPropertyModel[];
	targetForeignKey: IPropertyModel[];
	isDependentToPrincipal: boolean;
	modelType: 'ReferenceModel' | 'CollectionModel';
}
