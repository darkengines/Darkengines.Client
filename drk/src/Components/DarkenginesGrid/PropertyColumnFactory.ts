import { multiInject, inject, injectable } from 'inversify';
import { ComponentFactories } from '../../ComponentFactories/ComponentFactories';
import { IComponentFactory } from '../../ComponentFactories/IComponentFactory';
import { StringComponentFactory } from '../../ComponentFactories/StringComponentFactory/StringComponentFactory';
import * as estree from 'estree';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { ColumnFactory } from './ColumnFactory';
import { IColumnFactory } from './IColumnFactory';
import { IColumnFactoryResult } from './IColumnFactoryResult';
import { IFilter, IFilterOperator } from './IDarkenginesGrid';
import { Dictionary } from 'ts-essentials';
import { IColumn } from '../../Grid/IColumn';

@injectable()
export default class PropertyColumnFactory implements ColumnFactory<IPropertyModel> {
	protected componentFactories: IComponentFactory[];
	protected defaultComponentFactory: StringComponentFactory;

	constructor(
		@multiInject(ComponentFactories.IComponentFactory) componentFactories: IComponentFactory[],
		@inject(StringComponentFactory) defaultComponentFactory: StringComponentFactory
	) {
		this.componentFactories = componentFactories;
		this.defaultComponentFactory = defaultComponentFactory;
	}
	canHandle(property: IPropertyModel) {
		return property.modelType === 'PropertyModel';
	}
	async createColumns(
		columnFactories: IColumnFactory[],
		property: IPropertyModel
	): Promise<IColumnFactoryResult> {
		const columns: IColumn[] = [
			{
				model: property,
				getter: (item) => item?.[property.name],
				setter: (item, value) => ({ ...item, [property.name]: value }),
				setFilter: (args, filterOperator) => ({
					...args,
					[property.name]: filterOperator,
				}),
				getFilter: (args) => args[property.name],
				name: property.name,
				displayName: property.displayName ?? property.name,
				componentFactory:
					this.componentFactories.find((componentFactory) =>
						componentFactory.canHandle(property)
					) ?? this.defaultComponentFactory,
				operators: property.operators,
				getComponentProps: (gridProps, item) => ({
					component: undefined,
					model: property,
					value: item?.[property.name],
				}),
			},
		];
		const filter: IFilter<Dictionary<IFilterOperator>> = {
			buildExpression(parameterExpression, args) {
				const memberExpression: estree.MemberExpression = {
					type: 'MemberExpression',
					computed: false,
					optional: false,
					object: parameterExpression,
					property: {
						type: 'Identifier',
						name: property.name,
					},
				};
				if (args[property.name].args === undefined) return undefined;
				return args[property.name].operator.buildExpression(
					memberExpression,
					args[property.name].args
				);
			},
			args: { [property.name]: { args: undefined, operator: property.operators[0] } },
		};
		return {
			columns,
			filter,
		};
	}
	async createSummaryColumns(
		columnFactories: IColumnFactory[],
		property: IPropertyModel
	): Promise<IColumnFactoryResult> {
		return this.createColumns(columnFactories, property);
	}
}
