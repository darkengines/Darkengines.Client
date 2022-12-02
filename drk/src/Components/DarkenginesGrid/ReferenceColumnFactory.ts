import * as estree from 'estree';
import { inject, injectable, multiInject } from 'inversify';
import { Dictionary } from 'ts-essentials';
import { ComponentFactories } from '../../ComponentFactories/ComponentFactories';
import { IComponentFactory } from '../../ComponentFactories/IComponentFactory';
import { StringComponentFactory } from '../../ComponentFactories/StringComponentFactory/StringComponentFactory';
import { IReferenceModel } from '../../Model/IReferenceModel';
import { ColumnFactory } from './ColumnFactory';
import { IColumnFactory } from './IColumnFactory';
import { IColumnFactoryResult } from './IColumnFactoryResult';
import { IFilter } from './IDarkenginesGrid';

@injectable()
export default class ReferenceColumnFactory implements ColumnFactory<IReferenceModel> {
	protected componentFactories: IComponentFactory[];
	protected defaultComponentFactory: StringComponentFactory;

	constructor(
		@multiInject(ComponentFactories.IComponentFactory) componentFactories: IComponentFactory[],
		@inject(StringComponentFactory) defaultComponentFactory: StringComponentFactory
	) {
		this.componentFactories = componentFactories;
		this.defaultComponentFactory = defaultComponentFactory;
	}
	canHandle(reference: IReferenceModel) {
		return reference.modelType === 'ReferenceModel';
	}
	mapColumns(reference: IReferenceModel, result: IColumnFactoryResult) {
		let columns = result.columns.map((column) => {
			const columnGetter = column.getter;
			const columnSetter = column.setter;
			const getter = (instance) => {
				const underlyingInstance = reference.getValue(instance);
				return underlyingInstance && columnGetter(underlyingInstance);
			};
			const setter = (instance, value) =>
				reference.setValue(instance, columnSetter(reference.getValue(instance), value));
			const columnGetFilter = column.getFilter;
			const columnSetFilter = column.setFilter;
			const getFilter = (args) => columnGetFilter(args[reference.name]);
			const setFilter = (args, value) => ({
				...args,
				[reference.name]: {
					...args[reference.name],
					...columnSetFilter(args[reference.name], value),
				},
			});
			const displayName = reference.displayName;
			const name = reference.name;
			const columnGetComponentProps = column.getComponentProps;
			column = {
				...column,
				getComponentProps: (props, item) => {
					const columnProps = columnGetComponentProps(props, reference.getValue(item));
					return columnProps;
				},
				name,
				displayName,
				getter,
				setter,
				getFilter,
				setFilter,
			};
			return column;
		});
		const filter: IFilter<Dictionary<IFilter>> = {
			buildExpression(parameterExpression: estree.Expression, args: Dictionary<IFilter>) {
				const memberExpression: estree.MemberExpression = {
					type: 'MemberExpression',
					computed: false,
					optional: false,
					object: parameterExpression,
					property: {
						type: 'Identifier',
						name: reference.name,
					},
				};
				return result.filter.buildExpression(memberExpression, args[reference.name]);
			},
			args: { [reference.name]: result.filter.args },
		};

		return {
			columns,
			filter,
		};
	}
	async createColumns(
		columnFactories: IColumnFactory[],
		reference: IReferenceModel
	): Promise<IColumnFactoryResult> {
		const summaryProperty =
			reference.type.summaryProperties?.[0] ?? reference.type.summaryCollections?.[0];
		const columnFactory = columnFactories.find((columnFactory) =>
			columnFactory.canHandle(summaryProperty)
		);
		let result = await columnFactory.createSummaryColumns(columnFactories, summaryProperty);
		return this.mapColumns(reference, result);
	}
	async createSummaryColumns(
		columnFactories: IColumnFactory[],
		reference: IReferenceModel
	): Promise<IColumnFactoryResult> {
		const summaryProperty =
			reference.type.summaryProperties?.[0] ?? reference.type.summaryCollections?.[0];
		const columnFactory = columnFactories.find((columnFactory) =>
			columnFactory.canHandle(summaryProperty)
		);
		let result = await columnFactory.createSummaryColumns(columnFactories, summaryProperty);
		return this.mapColumns(reference, result);
	}
}
