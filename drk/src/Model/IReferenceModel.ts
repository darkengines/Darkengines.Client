import { INavigation } from './INavigation';

export interface IReferenceModel extends INavigation {
	isNullable: boolean;
	modelType: 'ReferenceModel';
}
