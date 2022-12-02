import { injectable } from 'inversify';
import { IModel } from '../../Model/IModel';
import { IColumnFactory } from './IColumnFactory';
import { IColumnFactoryResult } from './IColumnFactoryResult';

@injectable()
export abstract class ColumnFactory<TModel extends IModel> implements IColumnFactory {
	abstract canHandle(model: TModel);
	abstract createColumns(columnFactories: IColumnFactory[], model: TModel): Promise<IColumnFactoryResult>;
	abstract createSummaryColumns(
		columnFactories: IColumnFactory[],
		model: TModel
	): Promise<IColumnFactoryResult>;
}
