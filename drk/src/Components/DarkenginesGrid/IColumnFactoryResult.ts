import { IColumn } from '../../Grid/IColumn';
import { IFilter } from './IDarkenginesGrid';

export interface IColumnFactoryResult {
	columns: IColumn[];
	filter: IFilter;
}
