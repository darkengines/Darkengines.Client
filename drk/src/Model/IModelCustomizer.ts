import { IEntityModel } from './IEntityModel';

export interface IModelCustomizer {
	canHandle(model: IEntityModel): boolean;
	customize(model: IEntityModel): IEntityModel;
}
