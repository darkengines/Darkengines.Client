import * as estree from 'estree';
import { inject, injectable, multiInject } from 'inversify';
import { flatten } from 'lodash';
import {
	LocalizedComponentFactory,
	createGetter,
	createSetter,
} from '../../ComponentFactories/LocalizedComponentFactory/LocalizedComponentFactory';
import { ILocalizedDisplayProps } from '../../ComponentFactories/LocalizedComponentFactory/LocalizedDisplay';
import { ComponentFactories } from '../../ComponentFactories/ComponentFactories';
import { IComponentFactory } from '../../ComponentFactories/IComponentFactory';
import { StringComponentFactory } from '../../ComponentFactories/StringComponentFactory/StringComponentFactory';
import { getConfig } from '../../config';
import { ILocalization } from '../../Localization/Models/ILocalization';
import { ILocalized } from '../../Localization/Models/ILocalized';
import { ICollectionModel } from '../../Model/ICollectionModel';
import { ColumnFactory } from './ColumnFactory';
import { IColumnFactory } from './IColumnFactory';
import { IColumnFactoryResult } from './IColumnFactoryResult';
import { IDarkenginesGridProps, IFilter } from './IDarkenginesGrid';

@injectable()
export default class LocalizationCollectionColumnFactory
	implements ColumnFactory<ICollectionModel>
{
	protected componentFactories: IComponentFactory[];
	protected defaultComponentFactory: StringComponentFactory;

	constructor(
		@multiInject(ComponentFactories.IComponentFactory) componentFactories: IComponentFactory[],
		@inject(StringComponentFactory) defaultComponentFactory: StringComponentFactory
	) {
		this.componentFactories = componentFactories;
		this.defaultComponentFactory = defaultComponentFactory;
	}
	canHandle(collection: ICollectionModel) {
		return (
			collection.modelType === 'CollectionModel' &&
			collection.displayTypeName == 'LocalizationCollection'
		);
	}

	async mapColumns(collection: ICollectionModel, results: IColumnFactoryResult[]) {
		let columns = flatten(results.map((result) => result.columns));
		const config = await getConfig();
		columns = columns.map((column) => {
			const underlyingComponentFactory = column.componentFactory;
			const componentFactory = new LocalizedComponentFactory();
			const getter = createGetter<ILocalization, ILocalized<ILocalization>>(
				(item) => item?.localizations
			);
			const setter = createSetter<ILocalization, ILocalized<ILocalization>>((item, value) => {
				return {
					...item,
					localizations: value,
				};
			});

			const columnGetFilter = column.getFilter;
			const columnSetFilter = column.setFilter;
			const getFilter = (args) => columnGetFilter(args);
			const setFilter = (args, value) => columnSetFilter(args, value);
			const getComponentProps: (
				gridProps: IDarkenginesGridProps,
				item: ILocalized<ILocalization>
			) => ILocalizedDisplayProps = (gridProps, item) => ({
				component: undefined,
				model: collection,
				value: item?.localizations,
				defaultLanguage: config.Localization.defaultLanguage,
				languages: config.Localization.languages,
				property: column.model,
				underlyingComponentFactory: underlyingComponentFactory,
			});
			return {
				...column,
				componentFactory,
				getComponentProps,
				getter,
				setter,
				setFilter,
				getFilter,
			};
		});
		const filter = {
			buildExpression(parameter: estree.Expression, args: IFilter): estree.Expression {
				const collectionItemParameter: estree.Identifier = {
					type: 'Identifier',
					name: 'item',
				};
				const [head, ...tail] = results
					.map((result) => result.filter)
					.map((filter) => {
						return filter.buildExpression(collectionItemParameter, args);
					})
					.filter((expression) => expression);
				if (!head) return undefined;
				const predicate = tail.reduce(
					(predicate, filter) => ({
						type: 'LogicalExpression',
						operator: '||',
						left: predicate,
						right: filter,
					}),
					head
				);
				return {
					type: 'CallExpression',
					optional: false,
					callee: {
						type: 'MemberExpression',
						computed: false,
						object: {
							type: 'MemberExpression',
							computed: false,
							optional: false,
							object: parameter,
							property: {
								type: 'Identifier',
								name: collection.name,
							},
						},
						optional: false,
						property: {
							type: 'Identifier',
							name: 'any',
						},
					},
					arguments: [
						{
							type: 'ArrowFunctionExpression',
							params: [collectionItemParameter],
							body: predicate,
							expression: true,
						},
					],
				};
			},
			args: results.reduce((args, result) => ({ ...args, ...result.filter.args }), {}),
		};
		return { columns, filter };
	}

	async createColumns(
		columnFactories: IColumnFactory[],
		collection: ICollectionModel
	): Promise<IColumnFactoryResult> {
		const primaryKey = collection.type.primaryKey;
		const localizedProperties = collection.type.properties.filter((property) =>
			primaryKey.every((pk) => pk !== property)
		);
		const results = await Promise.all(
			localizedProperties.map(
				async (localizedProperty) =>
					await columnFactories
						.find((columnFactory) => columnFactory.canHandle(localizedProperty))
						.createColumns(columnFactories, localizedProperty)
			)
		);
		return await this.mapColumns(collection, results);
	}

	async createSummaryColumns(
		columnFactories: IColumnFactory[],
		collection: ICollectionModel
	): Promise<IColumnFactoryResult> {
		const localizedProperties = collection.type.summaryProperties;
		const results = await Promise.all(
			localizedProperties.map((localizedProperty) =>
				columnFactories
					.find((columnFactory) => columnFactory.canHandle(localizedProperty))
					.createSummaryColumns(columnFactories, localizedProperty)
			)
		);
		return await this.mapColumns(collection, results);
	}
}
