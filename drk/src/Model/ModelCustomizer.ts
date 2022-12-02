import { Newable } from 'ts-essentials';
import { IEntityModel } from './IEntityModel';
import { IModelCustomizer } from './IModelCustomizer';

export default class ModelCustomizer<TEntity extends Object> implements IModelCustomizer {
	protected entityContructor: Newable<TEntity>;
	protected customizer: (model: IEntityModel) => IEntityModel;
	constructor(
		entityConstructor: Newable<TEntity>,
		customizer: (model: IEntityModel) => IEntityModel
	) {
		this.entityContructor = entityConstructor;
		this.customizer = customizer;
	}
	canHandle(model: IEntityModel): boolean {
		return model.name === this.entityContructor.name;
	}
	customize(model: IEntityModel): IEntityModel {
		return this.customizer(model);
	}
}
