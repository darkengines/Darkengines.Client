import { injectable } from 'inversify';
import { IModel } from '../../Model/IModel';
import { IFieldFactory, IFieldFactoryContext } from './IFieldFactory';
import { IFieldFactoryResult } from './IFieldFactoryResult';

@injectable()
export default abstract class FieldFactory<TModel extends IModel> implements IFieldFactory {
	abstract canHandle(model: TModel);
	abstract createFields(
		context: IFieldFactoryContext,
		model: TModel
	): Promise<IFieldFactoryResult>;
}
