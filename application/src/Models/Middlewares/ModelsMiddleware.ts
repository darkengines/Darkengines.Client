import { IMiddleware, IMiddlewareNode, IRouteContext, MiddlewareFunction } from '@drk/src/routing';
import { injectable, multiInject } from 'inversify';
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '../../Models/Components/Models/Models';
import { ModelsInterfaces } from '../Interfaces';
import { IModelsMenuItemProvider } from '../IModelsMenuItemProvider';

export interface IModelsMiddleware {
	handler(context: IRouteContext, next: any): any;
}

@injectable()
export class ModelsMiddleware implements IMiddleware, IModelsMiddleware {
	protected menuItemProviders: IModelsMenuItemProvider[];
	public constructor(
		@multiInject(ModelsInterfaces.IModelsMenuItemProvider)
		menuItemProviders: IModelsMenuItemProvider[]
	) {
		this.menuItemProviders = menuItemProviders;
	}
	async handler(context, next) {
		const result = await next();
		const menuItems = this.menuItemProviders
			.map((menuItemProvider) => menuItemProvider.getItems())
			.flat();
		return html`<drk-model-menu>
			${repeat(menuItems, (menuItem) => {
				return html`<div slot="menu-item">${menuItem}</div>`;
			})}
			${result}
		</drk-model-menu>`;
	}
	display() {
		return html`Models`;
	}
}
