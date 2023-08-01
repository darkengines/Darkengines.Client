import { authentication } from '@drk/src/Authentication/Authentication';
import { IMiddleware, IMiddlewareNode, IRouteContext, MiddlewareFunction } from '@drk/src/routing';
import { runtimeRoot } from 'application/src/Application';
import { injectable } from 'inversify';
import { html } from 'lit';

export interface IAuthenticatedUserMiddleware {
	handler(context: IRouteContext, next: any): any;
}

@injectable()
export class AuthenticatedUserMiddleware implements IMiddleware, IAuthenticatedUserMiddleware {
	handler(context, next) {
		if (authentication.state.idToken) {
            console.debug('AuthenticatedUser')
			return next();
		} else {
			return runtimeRoot.children.anonymous.children.loginRouteNode.execute();
		}
	}
	display() {
		return html`AuthenticatedUser`;
	}
}
