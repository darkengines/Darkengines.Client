import * as estree from 'estree';
import { injectable, multiInject } from 'inversify';
import { flatten } from 'lodash';
import { Dictionary } from 'ts-essentials';
import { IModelResourceFactory } from '../../Model/IModelResourceFactory';
import { IEntityModel } from '../../Model/IEntityModel';
import { ColumnFactory } from './ColumnFactory';
import { IColumnFactory } from './IColumnFactory';
import { IColumnFactoryResult } from './IColumnFactoryResult';
import { IFilter } from './IDarkenginesGrid';
import { interfaces } from 'drk/src/Model/Interfaces';

@injectable()
export default class EntityModelColumnFactory extends ColumnFactory<IEntityModel> {
	protected resourceFactories: IModelResourceFactory[];
	constructor(
		@multiInject(interfaces.IModelResourceFactory) resourceFactories: IModelResourceFactory[]
	) {
		super();
		this.resourceFactories = resourceFactories;
	}
	canHandle(model: IEntityModel) {
		return model.modelType == 'EntityModel';
	}
	mapMembers(columnFactoryResults: IColumnFactoryResult[]) {
		const results = columnFactoryResults.map((columnFactoryResult) => ({
			columns: columnFactoryResult.columns.map((column) => {
				const columnGetFilter = column.getFilter;
				const columnSetFilter = column.setFilter;
				return {
					...column,
					getFilter: (args) => columnGetFilter(args),
					setFilter: (args, value) => ({
						...args,
						...columnSetFilter(args, value),
					}),
				};
			}),
			...columnFactoryResult,
		}));
		const columns = flatten(results.map((memberResult) => memberResult.columns));
		const filter: IFilter<Dictionary<IFilter<any>, number>> = {
			buildExpression(
				parameterExpression: estree.Expression,
				args: Dictionary<IFilter<any>>
			) {
				const [head, ...tail] = results
					.map((result) => result.filter)
					.map((filter) => filter.buildExpression(parameterExpression, args))
					.filter((expression) => expression !== undefined);
				if (!head) return undefined;
				const expression = tail.reduce(
					(expression, subExpression) => ({
						type: 'LogicalExpression',
						left: expression,
						right: subExpression,
						operator: '&&',
					}),
					head
				);
				return expression;
			},
			args: results.reduce((args, result) => ({ ...args, ...result.filter.args }), {}),
		};
		return {
			columns,
			filter,
		};
	}
	async createColumns(columnFactories: IColumnFactory[], model: IEntityModel) {
		const resourceFactory = this.resourceFactories.find(
			(resourceFactory) => resourceFactory.type == model.name
		);
		const resource = resourceFactory?.getResources();
		const properties = model.properties.filter(
			(property) =>
				!model.references.some((reference) =>
					reference.foreignKey.some((fkProperty) => fkProperty == property)
				)
		);
		const members = [...properties, ...model.references, ...model.collections].map((member) => {
			if (resource && resource.members?.[member.name]) {
				member = { ...member, displayName: resource.members[member.name] };
			}
			return member;
		});
		const results = await Promise.all(
			members.map((member) =>
				columnFactories
					.find((columnFactory) => columnFactory.canHandle(member))
					.createColumns(columnFactories, member)
			)
		);

		return this.mapMembers(results);
	}
	async createSummaryColumns(columnFactories: IColumnFactory[], model: IEntityModel) {
		const members = [
			...model.summaryProperties,
			...model.summaryReferences,
			...model.summaryCollections,
		];
		const results = await Promise.all(
			members.map((member) =>
				columnFactories
					.find((columnFactory) => columnFactory.canHandle(member))
					.createSummaryColumns(columnFactories, member)
			)
		);
		return this.mapMembers(results);
	}
}
