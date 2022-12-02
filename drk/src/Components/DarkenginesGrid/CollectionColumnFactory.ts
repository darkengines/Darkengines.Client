import { inject, injectable, multiInject } from 'inversify';
import { ComponentFactories } from '../../ComponentFactories/ComponentFactories';
import { IComponentFactory } from '../../ComponentFactories/IComponentFactory';
import { StringComponentFactory } from '../../ComponentFactories/StringComponentFactory/StringComponentFactory';
import { ICollectionModel } from '../../Model/ICollectionModel';
import { ColumnFactory } from './ColumnFactory';
import { IColumnFactory } from './IColumnFactory';
import { IColumnFactoryResult } from './IColumnFactoryResult';

@injectable()
export default class CollectionColumnFactory implements ColumnFactory<ICollectionModel> {
	protected componentFactories: IComponentFactory[];
	protected defaultComponentFactory: StringComponentFactory;

	constructor(
		@multiInject(ComponentFactories.IComponentFactory) componentFactories: IComponentFactory[],
		@inject(StringComponentFactory) defaultComponentFactory: StringComponentFactory
	) {
		this.componentFactories = componentFactories;
		this.defaultComponentFactory = defaultComponentFactory;
	}
	canHandle(reference: ICollectionModel) {
		return reference.modelType === 'CollectionModel';
	}
	async createColumns(
		columnFactories: IColumnFactory[],
		collection: ICollectionModel
	): Promise<IColumnFactoryResult> {
		const columns = [];
		return {
			columns,
			filter: {
				args: {},
				buildExpression: (parameterExpression, args) => undefined,
			},
		};
	}
	async createSummaryColumns(
		columnFactories: IColumnFactory[],
		collection: ICollectionModel
	): Promise<IColumnFactoryResult> {
		const columns = [];
		return {
			columns,
			filter: {
				args: {},
				buildExpression: (parameterExpression, args) => undefined,
			},
		};
	}
}
