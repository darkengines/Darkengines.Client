import { injectable } from 'inversify';
import { runtimeRoot } from '../Application';
import { applicationMenuItem } from '../Applications/ApplicationMenuItem';
import { IApplicationMenuItemProvider } from '../Applications/IApplicationMenuItemProvider';
import { UserMiddleware } from '../Users/Middlewares/UserMiddleware';

@injectable()
export class AdministrationApplicationMenuItemProvider implements IApplicationMenuItemProvider {
	getItems() {
		return [
			applicationMenuItem({
				name: UserMiddleware.name,
				display: 'Administration',
				isSelected: false,
				onClick: (e) =>
					runtimeRoot.children.authenticated.children.verifiedUserNode.children.applicationNode.children.administration.children.administrationGrid.execute(),
			}),
		];
	}
}
