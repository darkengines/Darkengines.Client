import { IColumnFactoryResult } from './IColumnFactoryResult';

export interface IColumnFactory {
	canHandle(item: any): boolean;
	createColumns(columnFactories: IColumnFactory[], item: any): Promise<IColumnFactoryResult>;
	createSummaryColumns(
		columnFactories: IColumnFactory[],
		item: any
	): Promise<IColumnFactoryResult>;
}
