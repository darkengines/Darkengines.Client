import { injectable } from 'inversify';
import { runtimeRoot } from '../Application';
import { applicationMenuItem } from '../Applications/ApplicationMenuItem';
import { IApplicationMenuItemProvider } from '../Applications/IApplicationMenuItemProvider';
import { ModelsMiddleware } from './Middlewares/ModelsMiddleware';

@injectable()
export class ModelsApplicationMenuItemProvider implements IApplicationMenuItemProvider {
	getItems() {
		return [
			applicationMenuItem({
				name: ModelsMiddleware.name,
				display: 'Models',
				isSelected: false,
				onClick: (e) =>
					runtimeRoot.children.authenticated.children.verifiedUserNode.children.applicationNode.children.modelsNode.children.index.execute(),
			}),
		];
	}
}
