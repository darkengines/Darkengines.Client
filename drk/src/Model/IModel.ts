import IOperator from '../Operators/IOperator';
import IDisplayable from './IDisplayable';

export interface IModel extends IDisplayable {
	name: string;
	displayTypeName: string;
	displayName: string;
	operators: IOperator<any>[];
	getValue?: (instance: unknown) => unknown;
	setValue?: (instance: unknown, value: unknown) => void;
	modelType: 'PropertyModel' | 'ReferenceModel' | 'CollectionModel' | 'EntityModel';
}
