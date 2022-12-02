import { INavigation } from './INavigation';

export interface ICollectionModel extends INavigation {
	getValue?: (instance: unknown) => unknown[];
	setValue?: (instance: unknown, value: unknown[]) => void;
	modelType: 'CollectionModel';
}
