import { authentication } from '@drk/src/Authentication/Authentication';
import { IMiddleware, IMiddlewareNode, IRouteContext, MiddlewareFunction } from '@drk/src/routing';
import { runtimeRoot } from 'application/src/Application';
import { injectable } from 'inversify';
import { html } from 'lit';

export interface IVerifiedUserMiddleware {
	handler(context: IRouteContext, next: any): any;
}

@injectable()
export class VerifiedUserMiddleware implements IMiddleware, IVerifiedUserMiddleware {
	handler(context, next) {
		if (authentication.state.identity.isVerified) {
			console.debug('VerifiedUser');
			return next();
		} else {
			return runtimeRoot.children.authenticated.children.emailVerificationRequestRouteNode.execute();
		}
	}
	display() {
		return html`VerifiedUser`;
	}
}
