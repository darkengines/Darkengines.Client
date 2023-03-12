import * as escodegen from 'escodegen';
import * as estree from 'estree';
import { Dictionary } from 'lodash';
import { queryProvider } from '../Api/QueryProvider';
import { DarkenginesGridAction } from '../Components/DarkenginesGrid/DarkenginesGridAction';
import { IColumnFactory } from '../Components/DarkenginesGrid/IColumnFactory';
import {
	IDarkenginesGridProps, IFilter, IFilterOperator,
	IPagination,
	Order
} from '../Components/DarkenginesGrid/IDarkenginesGrid';
import { IEntityModel } from '../Model/IEntityModel';
import { IOrder } from '../Orders/IOrder';
import { IDarkenginesAdminProps } from './IDarkenginesAdminProps';

export function getBaseQuery(model: IEntityModel) {
	let query = `${model.name}`;
	query = applyIncludes(query, model);
	return query;
}

export function getCountQuery(baseQuery: string) {
	return `${baseQuery}.Count()`;
}

export async function setSelectedRepository(
	darkenginesAdmin: IDarkenginesAdminProps,
	model: IEntityModel,
	columnFactories: IColumnFactory[]
): Promise<IDarkenginesAdminProps> {
	const result = await columnFactories
		.find((columnFactory) => columnFactory.canHandle(model))
		.createColumns(columnFactories, model);
	const columns = result.columns.toDictionary((column) => column.name);
	const filter = result.filter;
	const pagination = {
		itemsPerPage: 32,
		pageIndex: 0,
		pageCount: 0,
		count: 0,
	};
	let query = getBaseQuery(model);
	const countQuery = getCountQuery(query);
	query = applyPagination(query, pagination);
	const count = queryProvider.queryAuthenticated<number>(countQuery).execute();
	const data = queryProvider.queryAuthenticated<any[]>(query).execute();
	const darkenginesGrid = Promise.all([data, count]).then(([data, count]) => {
		return {
			order: {},
			model,
			columns,
			actions: DarkenginesGridAction.Edit | DarkenginesGridAction.Delete,
			filter,
			data,
			pagination: {
				...pagination,
				count,
				pageCount: Math.ceil(count / pagination.itemsPerPage),
			},
		};
	});
	return {
		...darkenginesAdmin,
		selectedModel: model,
		darkenginesGrid: darkenginesGrid,
	};
}
export async function feedDarkenginesGrid(
	darkenginesGrid: IDarkenginesGridProps,
	model: IEntityModel,
	baseQuery?: string
) {
	let query = baseQuery ?? getBaseQuery(model);
	query = applyFilter(query, darkenginesGrid.filter, darkenginesGrid.filter.args);
	query = applyOrder(query, darkenginesGrid.order);
	const countQuery = getCountQuery(query);
	query = applyPagination(query, darkenginesGrid.pagination);
	const count = queryProvider.queryAuthenticated<number>(countQuery).execute();
	const data = queryProvider.queryAuthenticated<any[]>(query).execute();
	const darkenginesGridPromise = Promise.all([data, count]).then(([data, count]) => {
		return {
			...darkenginesGrid,
			data,
			pagination: {
				...darkenginesGrid.pagination,
				count,
				pageCount: Math.ceil(count / darkenginesGrid.pagination.itemsPerPage),
			},
			model,
		};
	});
	return darkenginesGridPromise;
}
export async function setFilter(
	darkenginesGrid: IDarkenginesGridProps,
	model: IEntityModel,
	filter: Dictionary<IFilterOperator>,
	baseQuery?: string
) {
	let query = baseQuery ?? getBaseQuery(model);
	query = applyFilter(query, darkenginesGrid.filter, filter);
	const countQuery = getCountQuery(query);
	query = applyOrder(query, darkenginesGrid.order);
	query = applyPagination(query, darkenginesGrid.pagination);
	const count = await queryProvider.queryAuthenticated<number>(countQuery).execute();
	const data = await queryProvider.queryAuthenticated<any[]>(query).execute();
	return {
		...darkenginesGrid,
		filter: { ...darkenginesGrid.filter, args: filter },
		data,
		pagination: {
			...darkenginesGrid.pagination,
			count,
			pageCount: Math.ceil(count / darkenginesGrid.pagination.itemsPerPage),
		},
	};
}

export async function setOrder(
	darkenginesGrid: IDarkenginesGridProps,
	model: IEntityModel,
	order: Dictionary<IOrder>,
	baseQuery?: string
) {
	let query = baseQuery ?? getBaseQuery(model);
	query = applyFilter(query, darkenginesGrid.filter, darkenginesGrid.filter.args);
	query = applyOrder(query, order);
	query = applyPagination(query, darkenginesGrid.pagination);

	const data = await queryProvider.queryAuthenticated<any[]>(query).execute();
	return {
		...darkenginesGrid,
		order,
		data,
	};
}

export async function setPagination(
	darkenginesGrid: IDarkenginesGridProps,
	model: IEntityModel,
	pagination: IPagination,
	baseQuery?: string
) {
	let query = baseQuery ?? getBaseQuery(model);
	query = applyFilter(query, darkenginesGrid.filter, darkenginesGrid.filter.args);
	query = applyOrder(query, darkenginesGrid.order);
	query = applyPagination(query, pagination);

	const data = await queryProvider.queryAuthenticated<any[]>(query).execute();
	return {
		...darkenginesGrid,
		data,
		pagination: {
			...pagination,
			pageCount: Math.ceil(pagination.count / pagination.itemsPerPage),
		},
	};
}

export function getOrderMethod(order: Order) {
	return order < 0 ? 'OrderByDescending' : 'OrderBy';
}
export function getThenOrderMethod(order: Order) {
	return order < 0 ? 'ThenByDescending' : 'ThenBy';
}
export function applyOrder(query: string, order: Dictionary<IOrder>) {
	const [head, ...queue] = Object.keys(order)
		.filter((key) => order[key].order)
		.sort((left, right) => order[left].index - order[right].index)
		.map((columnKey) => ({
			propertyName: columnKey,
			order: order[columnKey].order,
		}));
	if (head) {
		const parameterName = 'item';
		query = `${query}.${getOrderMethod(head.order)}(${parameterName} => ${parameterName}.${
			head.propertyName
		})`;
		query = queue.reduce((query, order) => {
			return `${query}.${getThenOrderMethod(
				order.order
			)}(${parameterName} => ${parameterName}.${order.propertyName})`;
		}, query);
	}
	return query;
}
export function applyIncludes(query: string, model: IEntityModel) {
	query = model.references.reduce(
		(query, reference) => `${query}.include(item => item.${reference.name})`,
		query
	);
	return query;
}
export function applyPagination(query: string, pagination: IPagination) {
	return `${query}.Skip(${pagination.pageIndex * pagination.itemsPerPage}).Take(${
		pagination.itemsPerPage
	})`;
}
export function applyFilter(query: string, filter: IFilter, args: Dictionary<IFilterOperator>) {
	const parameterName = 'item';
	const parameterExpression: estree.Identifier = {
		name: parameterName,
		type: 'Identifier',
	};
	const expression = filter.buildExpression(parameterExpression, args);
	if (!expression) return query;
	const code = escodegen.generate(expression, { format: { escapeless: true } });

	query = `${query}.Where(${parameterName} => ${code})`;

	return query;
}
export function buildPredicate(
	filter: { filterOperator: IFilterOperator; propertyName: string },
	parameterName: string
) {
	return filter.filterOperator.operator.buildExpression(
		{
			type: 'MemberExpression',
			computed: false,
			optional: false,
			object: { type: 'Identifier', name: parameterName },
			property: { type: 'Identifier', name: filter.propertyName },
		},
		filter.filterOperator.args
	);
}
