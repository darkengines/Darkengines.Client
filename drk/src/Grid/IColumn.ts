import { IComponentFactory, IComponentProps } from '../ComponentFactories/IComponentFactory';
import {
	IDarkenginesGridProps,
	IFilter,
	IFilterOperator,
} from '../Components/DarkenginesGrid/IDarkenginesGrid';
import { IModel } from '../Model/IModel';
import { IOperator } from '../Operators/IOperator';

export interface IColumn {
	name: string;
	displayName: string;
	componentFactory: IComponentFactory;
	operators: IOperator[];
	model: IModel;
	getter?: (item: any) => any;
	setter?: (item: any, value: any) => any;
	getComponentProps: (gridProps: IDarkenginesGridProps, item: any) => IComponentProps;
	setFilter(filter: IFilter, filterOperator: IFilterOperator);
	getFilter(filter: IFilter): IFilterOperator;
}
