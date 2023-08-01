import { IMiddleware, IMiddlewareNode, IRouteContext, MiddlewareFunction } from '@drk/src/routing';
import { runtimeRoot } from '../Application';
import { injectable, multiInject } from 'inversify';
import { html } from 'lit';
import '../Applications/Components/Application';
import { IApplicationMenuItemProvider } from './IApplicationMenuItemProvider';
import { ApplicationMiddlewareInterfaces } from './Interfaces';
import { repeat } from 'lit/directives/repeat.js';

export interface IApplicationMiddleware {
	handler(context: IRouteContext, next: any): any;
}

@injectable()
export class ApplicationMiddleware implements IMiddleware, IApplicationMiddleware {
	protected applicationMenuItemProviders: IApplicationMenuItemProvider[];
	public constructor(
		@multiInject(ApplicationMiddlewareInterfaces.IApplicationMenuItemProvider)
		applicationMenuItemProviders: IApplicationMenuItemProvider[]
	) {
		this.applicationMenuItemProviders = applicationMenuItemProviders;
	}
	async handler(context, next) {
		console.log(context);
		const result = await next();
		const applicationMenuItems = this.applicationMenuItemProviders
			.map((applicationMenuItemProvider) => applicationMenuItemProvider.getItems())
			.flat();
		return html`<drk-application>
			<div slot="menu-item">${repeat(applicationMenuItems, (applicationMenuItem) => applicationMenuItem)}</div>
			${result}
		</drk-application>`;
	}
	display() {
		return html`Application`;
	}
}
