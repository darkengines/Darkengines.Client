import * as estree from 'estree';
import { Dictionary } from 'ts-essentials';
import { IFilter, IFilterOperator } from '../Components/DarkenginesGrid/IDarkenginesGrid';
import { ICollectionModel } from '../Model/ICollectionModel';
import { IEntityModel } from '../Model/IEntityModel';
import { IPropertyModel } from '../Model/IPropertyModel';
import { IReferenceModel } from '../Model/IReferenceModel';

export function entityFilter(entity: IEntityModel, underlyingFilters: IFilter[]) {
	return {
		buildExpression(parameterExpression: estree.Expression, args: Dictionary<IFilter<any>>) {
			const [head, ...tail] = underlyingFilters
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
		args: underlyingFilters.reduce(
			(args, underlyingFilter) => ({ ...args, ...underlyingFilter.args }),
			{}
		),
	};
}
export interface IFilterManager {
	setFilter(filter: any, value: any): any;
	getFilter(filter: any): any;
	buildExpression(instanceExpression: estree.Expression, args: any);
}
export abstract class FilterManager<TFilter, TArgs> implements IFilterManager {
	protected parent: IFilterManager;
	constructor(parent: IFilterManager) {
		this.parent = parent;
	}
	abstract buildExpression(parameterExpression: estree.Expression, args: any): estree.Expression;
	protected abstract getLocalFilter(filter: TFilter): TArgs;
	protected abstract setLocalFilter(filter: TFilter, value: TArgs);
	public setFilter(filter: TFilter, value: TArgs): any {
		const localFilter = this.setLocalFilter(filter, value);
		return this.parent?.setFilter(filter, localFilter) ?? value;
	}
	public getFilter(filter: TFilter): TArgs {
		if (this.parent) filter = this.parent.getFilter(filter);
		return this.getLocalFilter(filter);
	}
}
export class EntityFilterManager extends FilterManager<IFilterManager[], IFilterManager> {
	protected entity: IEntityModel;
	public children: IFilterManager[];
	constructor(entity: IEntityModel, parent: IFilterManager) {
		super(parent);
		this.entity = entity;
	}
	setLocalFilter(filter, value) {
		return value;
	}
	getLocalFilter(filter) {
		return filter;
	}
	buildExpression(instanceExpression: estree.Expression, args: Dictionary<any>) {
		const [head, ...tail] = this.children
			.map((memberFilterManager) =>
				memberFilterManager.buildExpression(instanceExpression, args)
			)
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
	}
}
export class PropertyFilterManager extends FilterManager<Dictionary<any>, IFilterOperator> {
	protected property: IPropertyModel;
	constructor(property: IPropertyModel, parent: IFilterManager) {
		super(parent);
		this.property = property;
	}

	setLocalFilter(filter: Dictionary<IFilterOperator>, value: IFilterOperator) {
		const localFilter = { ...filter, [this.property.name]: value };
		return localFilter;
	}
	getLocalFilter(filter: Dictionary<IFilterOperator>) {
		return (
			filter?.[this.property.name] ?? {
				args: undefined,
				operator: this.property.operators[0],
			}
		);
	}
	buildExpression(instanceExpression: estree.Expression, args: IFilterOperator) {
		const memberExpression: estree.MemberExpression = {
			type: 'MemberExpression',
			computed: false,
			optional: false,
			object: instanceExpression,
			property: {
				type: 'Identifier',
				name: this.property.name,
			},
		};
		return args.operator.buildExpression(memberExpression, args.args);
	}
}
export class ReferenceFilterManager extends FilterManager<Dictionary<any>, any> {
	protected reference: IReferenceModel;
	public valueManager: IFilterManager;
	constructor(reference: IReferenceModel, parent: IFilterManager) {
		super(parent);
		this.reference = reference;
	}

	setLocalFilter(filter: Dictionary<IFilterOperator>, value: any) {
		const localFilter = { ...filter, [this.reference.name]: value };
		return localFilter;
	}
	getLocalFilter(filter: Dictionary<IFilterOperator>) {
		return filter[this.reference.name];
	}
	buildExpression(instanceExpression: estree.Expression, args: any) {
		const memberExpression: estree.MemberExpression = {
			type: 'MemberExpression',
			computed: false,
			optional: false,
			object: instanceExpression,
			property: {
				type: 'Identifier',
				name: this.reference.name,
			},
		};
		return this.valueManager.buildExpression(memberExpression, args[this.reference.name]);
	}
}
export class LocalizationCollectionFilterManager extends FilterManager<
	Dictionary<any>,
	Dictionary<any>
> {
	protected localizationCollection: ICollectionModel;
	public memberFilterManagers: IFilterManager[];
	public constructor(localizationCollection: ICollectionModel, parent: IFilterManager) {
		super(parent);
		this.localizationCollection = localizationCollection;
	}
	protected getLocalFilter(filter: Dictionary<any, string>): Dictionary<any, string> {
		return filter[this.localizationCollection.name];
	}
	protected setLocalFilter(filter: Dictionary<any, string>, value: Dictionary<any, string>) {
		return { ...filter, [this.localizationCollection.name]: value };
	}

	buildExpression(parameter: estree.Expression, args: any): estree.Expression {
		const collectionItemParameter: estree.Identifier = {
			type: 'Identifier',
			name: 'item',
		};
		const [head, ...tail] = this.memberFilterManagers
			.map((filterManager) => {
				return filterManager.buildExpression(
					collectionItemParameter,
					args[this.localizationCollection.name]
				);
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
						name: this.localizationCollection.name,
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
	}
}
export function propertyFilter(property: IPropertyModel) {
	return {
		buildExpression(parameterExpression, args) {},
		args: { [property.name]: { args: undefined, operator: property.operators[0] } },
	};
}
export function referenceFilter(reference: IReferenceModel, underlyingFilters: IFilter[]) {
	return {
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
			return underlyingFilters[0].buildExpression(memberExpression, args[reference.name]);
		},
		args: { [reference.name]: underlyingFilters[0].args },
	};
}
export function collectionFilter(collection: ICollectionModel, underlyingFilters: IFilter[]) {
	return {
		buildExpression(parameterExpression: estree.Expression, args: Dictionary<IFilter>) {
			const memberExpression: estree.MemberExpression = {
				type: 'MemberExpression',
				computed: false,
				optional: false,
				object: parameterExpression,
				property: {
					type: 'Identifier',
					name: collection.name,
				},
			};
			return underlyingFilters[0].buildExpression(memberExpression, args[collection.name]);
		},
		args: { [collection.name]: underlyingFilters[0].args },
	};
}
