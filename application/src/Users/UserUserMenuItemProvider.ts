import { injectable } from 'inversify';
import { userMenuItem } from '../Users/UserMenuItem';
import { IUserMenuItemProvider } from '../Users/IUserMenuItemProvider';
import { runtimeRoot } from '../Application';

@injectable()
export class UserUserMenuItemProvider implements IUserMenuItemProvider {
	getItems() {
		return [
			userMenuItem({
				name: 'Account',
				display: 'Account',
				isSelected: false,
				onClick: (e) =>
					runtimeRoot.children.authenticated.children.verifiedUserNode.children.applicationNode.children.userNode.children.account.execute()
			}),
			userMenuItem({
				name: 'Profile',
				display: 'Profile',
				isSelected: false,
				onClick: (e) =>
					runtimeRoot.children.authenticated.children.verifiedUserNode.children.applicationNode.children.userNode.children.profile.execute()
			}),
			userMenuItem({
				name: 'Account',
				display: 'Security',
				isSelected: false,
				onClick: (e) =>
					runtimeRoot.children.authenticated.children.verifiedUserNode.children.applicationNode.children.userNode.children.security.execute()
			}),
		];
	}
}
