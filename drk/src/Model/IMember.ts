import { IModel } from './IModel';

export interface IMember extends IModel {
	modelType: 'PropertyModel' | 'ReferenceModel' | 'CollectionModel';
}
