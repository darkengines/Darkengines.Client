import { injectable } from 'inversify';
import { runtimeRoot } from '../Application';
import { applicationMenuItem } from '../Applications/ApplicationMenuItem';
import { IApplicationMenuItemProvider } from '../Applications/IApplicationMenuItemProvider';
import { UserMiddleware } from './Middlewares/UserMiddleware';

@injectable()
export class UserApplicationMenuItemProvider implements IApplicationMenuItemProvider {
	getItems() {
		return [
			applicationMenuItem({
				name: UserMiddleware.name,
				display: 'User',
				isSelected: false,
				onClick: (e) =>
					runtimeRoot.children.authenticated.children.verifiedUserNode.children.applicationNode.children.userNode.children.index.execute(),
			}),
		];
	}
}
