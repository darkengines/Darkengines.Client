import { IMiddleware, IMiddlewareNode, IRouteContext, MiddlewareFunction } from '@drk/src/routing';
import { injectable, multiInject } from 'inversify';
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '../../Users/Components/UserMenu/UserMenu';
import { UserInterfaces } from '../Interfaces';
import { IUserMenuItemProvider } from '../IUserMenuItemProvider';

export interface IUserMiddleware {
	handler(context: IRouteContext, next: any): any;
}

@injectable()
export class UserMiddleware implements IMiddleware, IUserMiddleware {
	protected menuItemProviders: IUserMenuItemProvider[];
	public constructor(
		@multiInject(UserInterfaces.IUserMenuItemProvider)
		menuItemProviders: IUserMenuItemProvider[]
	) {
		this.menuItemProviders = menuItemProviders;
	}
	async handler(context, next) {
		const result = await next();
		const menuItems = this.menuItemProviders
			.map((menuItemProvider) => menuItemProvider.getItems())
			.flat();
		return html`<drk-user-menu>
			${repeat(menuItems, (menuItem) => {
				return html`<div slot="menu-item">${menuItem}</div>`;
			})}
			${result}
		</drk-user-menu>`;
	}
	display() {
		return html`User`;
	}
}
