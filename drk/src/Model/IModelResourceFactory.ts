import { Dictionary } from 'ts-essentials';

export interface IModelResource {
	displayName: string;
	members: Dictionary<string>;
}

export interface IModelResourceFactory {
	type: string;
	getResources(): IModelResource;
}
