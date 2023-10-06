import { authentication } from '@drk/src/Authentication/Authentication';
import { IMiddleware, IMiddlewareNode, IRouteContext, MiddlewareFunction } from '@drk/src/routing';
import { runtimeRoot } from 'application/src/Application';
import { injectable } from 'inversify';
import { html } from 'lit';

export interface IAdministrationMiddleware {
	handler(context: IRouteContext, next: any): any;
}

@injectable()
export class AdministrationMiddleware implements IMiddleware, IAdministrationMiddleware {
	async handler(context, next) {
		const nextResult = await next();
		return nextResult;
	}
	display() {
		return html`Administration`;
	}
}
