import * as estree from 'estree';
import { Dictionary } from 'ts-essentials';
import { IColumn } from '../../Grid/IColumn';
import { IEntityModel } from '../../Model/IEntityModel';
import { IOperator } from '../../Operators/IOperator';
import { IOrder } from '../../Orders/IOrder';
import { DarkenginesGridAction } from './DarkenginesGridAction';

export enum Order {
	Ascendent = 1,
	Descendent = -1,
}

export interface IPagination {
	count: number;
	itemsPerPage: number;
	pageIndex: number;
	pageCount: number;
}
export interface IDarkenginesGridActions {
	setFilter: (
		darkenginesGrid: IDarkenginesGridProps,
		filter: Dictionary<IFilterOperator>
	) => Promise<IDarkenginesGridProps>;
	setPagination: (
		darkenginesGrid: IDarkenginesGridProps,
		pagination: IPagination
	) => Promise<IDarkenginesGridProps>;
	setOrder: (
		darkenginesGrid: IDarkenginesGridProps,
		order: Dictionary<IOrder>
	) => Promise<IDarkenginesGridProps>;
	edit: (item: unknown) => Promise<any>;
	delete?: (item: unknown) => Promise<any>;
}
export interface IDarkenginesGridProps {
	model: IEntityModel;
	columns: Dictionary<IColumn, string>;
	actions: DarkenginesGridAction;
	pagination: IPagination;
	order: Dictionary<IOrder>;
	filter: IFilter;
	data: unknown[];
}

type IDarkenginesGrid = IDarkenginesGridProps & IDarkenginesGridActions;
export default IDarkenginesGrid;

export interface IFilter<TArgs = any> {
	buildExpression(parameterExpression: estree.Expression, args: TArgs): estree.Expression;
	args: TArgs;
}
export interface IFilterOperator<T = any> {
	operator: IOperator;
	args: T;
}
