import { Dictionary } from 'ts-essentials';
import { ICollectionModel } from './ICollectionModel';
import { IMember } from './IMember';
import { IModel } from './IModel';
import { IPropertyModel } from './IPropertyModel';
import { IReferenceModel } from './IReferenceModel';

export interface IEntityModel extends IModel {
	fullName: string;
	namespace: string[];
	members: IMember[];
	interfaces: string[];
	//modelConstructor: Newable<Object>;
	propertyDictionary: Dictionary<IPropertyModel>;
	referenceDictionary: Dictionary<IReferenceModel>;
	collectionDictionary: Dictionary<ICollectionModel>;
	references: IReferenceModel[];
	collections: ICollectionModel[];
	properties: IPropertyModel[];
	primaryKey: IPropertyModel[];
	summaryProperties: IPropertyModel[];
	summaryReferences: IReferenceModel[];
	summaryCollections: ICollectionModel[];
	dependents: IEntityModel[];
	collectionDependents: IEntityModel[];
	parent: IEntityModel;
	modelType: 'EntityModel';
}
