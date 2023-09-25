import { injectable } from 'inversify';
import { userMenuItem } from '../Users/UserMenuItem';
import { runtimeRoot } from '../Application';
import { IModelsMenuItemProvider } from './IModelsMenuItemProvider';
import { modelsMenuItem } from './ModelsMenuItem';

@injectable()
export class ModelMenuItemProvider implements IModelsMenuItemProvider {
	getItems() {
		return [
			modelsMenuItem({
				name: 'Admin',
				display: 'Admin',
				isSelected: false,
				onClick: (e) =>
					runtimeRoot.children.authenticated.children.verifiedUserNode.children.applicationNode.children.modelsNode.children.index.execute(),
			}),
		];
	}
}
