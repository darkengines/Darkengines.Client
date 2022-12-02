import { IEntityModel } from '../../Model/IEntityModel';
import { IColumnFactory } from '../DarkenginesGrid/IColumnFactory';
import { IFilter } from '../DarkenginesGrid/IDarkenginesGrid';
import { IFieldFactoryResult } from './IFieldFactoryResult';

export interface IFieldFactoryContext {
	fieldFactories: IFieldFactory[];
	columnFactories: IColumnFactory[];
	onSearch(model: IEntityModel, filter: IFilter);
	//load(primaryKey: any[]): Promise<any>;
}
export interface IFieldFactory {
	canHandle(item: any): boolean;
	createFields(context: IFieldFactoryContext, item: any): Promise<IFieldFactoryResult>;
}
