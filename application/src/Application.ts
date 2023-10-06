import { setConfig } from '@drk/src/config';
import config from '../config/appsettings.config.json';
import '@material/web/textfield/outlined-text-field';
import '@material/web/select/outlined-select';
import '@material/web/menu/menu';
import '@material/web/menu/menu-item';
import '@material/web/select/select-option';
import '@material/web/button/elevated-button';
import '@material/web/button/filled-button';
import '@material/web/button/text-button';
import '@material/web/button/outlined-button';

setConfig(config);

import { Routing } from '@drk/src';
import { getCurrentPath, IRuntimeRoute, makeMiddleware, makeNamespace } from '@drk/src/routing';
import { injectable } from 'inversify';
import { html, render } from 'lit';
import { until } from 'lit/directives/until.js';
import 'reflect-metadata';
import RouteRecognizer from 'route-recognizer';
import './index.css';
import { UserMiddlewareInterfaces } from './Users/Interfaces';
import { serviceCollection } from './inversify.config';
import { LOCALE_STATUS_EVENT } from '@lit/localize';
import { IDesignerRoute } from './Designer/Routes/DesignerRoute';
import { DesignerRouteInterfaces } from './Designer/Routes/Interfaces';
import { IAuthenticatedUserMiddleware } from './Users/Middlewares/AuthenticatedUserMiddleware';
import { IVerifiedUserMiddleware } from './Users/Middlewares/VerifiedUserMiddleware';
import { IApplicationMiddleware } from './Applications/ApplicationMiddleware';
import { ApplicationMiddlewareInterfaces } from './Applications/Interfaces';

import {
	loginRouteNode,
	signupRouteNode,
	passwordResetRequestRouteNode,
	passwordResetRouteNode,
	indexRouteNode,
	emailVerificationRouteNode,
	emailVerificationRequestRouteNode,
	userNode,
} from './Users/routing';
import { administration } from './Administration/routing';
import { modelsNode } from './Models/routing';

const designerRoute = serviceCollection.get<IDesignerRoute>(DesignerRouteInterfaces.IDesignerRoute);

const authenticatedUserMiddleware = serviceCollection.get<IAuthenticatedUserMiddleware>(
	UserMiddlewareInterfaces.IAuthenticatedUserMiddleware
);
const applicationMiddleware = serviceCollection.get<IApplicationMiddleware>(
	ApplicationMiddlewareInterfaces.IApplicationMiddleware
);
const verifiedUserMiddleware = serviceCollection.get<IVerifiedUserMiddleware>(
	UserMiddlewareInterfaces.IVerifiedUserMiddleware
);

const designerRouteNode = Routing.makeRoute({
	path: '/designer/',
	route: designerRoute,
});
const anonymousNode = makeMiddleware(
	'/',
	{
		handler: (context, next) => next(),
		display: () => html`Home`,
	},
	{
		loginRouteNode,
		signupRouteNode,
		passwordResetRequestRouteNode,
		passwordResetRouteNode,
		designerRouteNode,
	}
);
const applicationNode = makeMiddleware('', applicationMiddleware, {
	indexRouteNode,
	userNode,
	administration,
	modelsNode
});
const verifiedUserNode = makeMiddleware('', verifiedUserMiddleware, {
	applicationNode,
});
const authenticatedNode = makeMiddleware('/', authenticatedUserMiddleware, {
	verifiedUserNode,
	emailVerificationRouteNode,
	emailVerificationRequestRouteNode,
});
const rootNode = makeNamespace({
	anonymous: anonymousNode,
	authenticated: authenticatedNode,
});
export const runtimeRoot = Routing.buildNode(rootNode);

const routes = Routing.getRoutes(runtimeRoot);

const routeRecognizer = new RouteRecognizer();
routes.forEach((route) => routeRecognizer.add(route));

async function resolve(path: string) {
	const routeResult = Array.from(routeRecognizer.recognize(path)!).reverse();
	const node = routeResult[0]!.handler as IRuntimeRoute;
	const args = routeResult.reduce(
		(args, segment) => [...Object.values(segment!.params), ...args],
		[]
	);
	const result = node.execute(...args);
	return result;
}

async function onAfterExecute(node: IRuntimeRoute, args, result) {
	history.pushState(undefined, undefined, node.getPath(...args));
	render(await result, document.body);
}
async function onPopStateAfterExecute(node, args, result) {
	render(await result, document.body);
}

addEventListener(LOCALE_STATUS_EVENT, async (e) => {
	if (e.detail.status == 'ready') resolve(await getCurrentPath());
});

runtimeRoot.afterExecute = onAfterExecute;
window.onpopstate = async (e) => {
	runtimeRoot.afterExecute = onPopStateAfterExecute;
	const result = resolve(await getCurrentPath());
	render(result, document.body);
	runtimeRoot.afterExecute = onAfterExecute;
};

@injectable()
export class Application {
	protected routeRecognizer: RouteRecognizer;

	public constructor() {
		const result = getCurrentPath().then(async (path) => await resolve(path));
		const x = html`${until(result)}`;

		render(x, document.body);
	}
}
