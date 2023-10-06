import { Dictionary } from 'lodash';
import { IColumnFactory } from '../Components/DarkenginesGrid/IColumnFactory';
import {
	IDarkenginesGridProps,
	IFilterOperator,
	IPagination,
} from '../Components/DarkenginesGrid/IDarkenginesGrid';
import { IEntityModel } from '../Model/IEntityModel';
import { IOrder } from '../Orders/IOrder';
import { IDarkenginesAdminProps } from './IDarkenginesAdminProps';

export interface IDarkenginesAdminActions {
	setModel: (
		comeetAdmin: IDarkenginesAdminProps,
		model: IEntityModel
	) => Promise<IDarkenginesAdminProps>;
	setFilter: (
		comeetGrid: IDarkenginesGridProps,
		model: IEntityModel,
		filter: Dictionary<IFilterOperator>
	) => Promise<IDarkenginesGridProps>;
	setPagination: (
		comeetGrid: IDarkenginesGridProps,
		model: IEntityModel,
		pagination: IPagination
	) => Promise<IDarkenginesGridProps>;
	setOrder: (
		comeetGrid: IDarkenginesGridProps,
		model: IEntityModel,
		order: Dictionary<IOrder>
	) => Promise<IDarkenginesGridProps>;
	edit: (comeetAdmin: IDarkenginesAdminProps, item: unknown) => Promise<any>;
	delete: (comeetAdminProps: IDarkenginesAdminProps) => Promise<IDarkenginesAdminProps>;
	add: (comeetAdminProps: IDarkenginesAdminProps) => Promise<any>;
}
