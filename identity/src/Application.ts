import { setConfig } from '@drk/src/config';
import config from '../config/appsettings.config.json';

setConfig(config);

import { Routing } from '@drk/src';
import { getCurrentPath, IRuntimeRoute, makeMiddleware } from '@drk/src/routing';
import { inject, injectable } from 'inversify';
import { html, render } from 'lit';
import { until } from 'lit/directives/until.js';
import 'reflect-metadata';
import RouteRecognizer from 'route-recognizer';
import './index.css';
import { ILoginRoute } from './Users/Routes/LoginRoute';
import { UserRouteInterfaces } from './Users/Routes/Interfaces';
import { IPasswordResetRequestRoute } from './Users/Routes/PasswordResetRequestRoute';
import { IPasswordResetRoute } from './Users/Routes/PasswordResetRoute';
import { ISignupRoute } from './Users/Routes/SignupRoute';
import { serviceCollection } from './inversify.config';
import { LOCALE_STATUS_EVENT } from '@lit/localize';

const loginRoute = serviceCollection.get<ILoginRoute>(UserRouteInterfaces.ILoginRoute);
const signupRoute = serviceCollection.get<ISignupRoute>(UserRouteInterfaces.ISignupRoute);
const passwordResetRequestRoute = serviceCollection.get<IPasswordResetRequestRoute>(
	UserRouteInterfaces.IPasswordResetRequestRoute
);
const passwordResetRoute = serviceCollection.get<IPasswordResetRoute>(
	UserRouteInterfaces.IPasswordResetRoute
);

const loginRouteNode = Routing.makeRoute({
	path: '/login',
	route: loginRoute,
});
const signupRouteNode = Routing.makeRoute({
	path: '/signup',
	route: signupRoute,
});
const passwordResetRequestRouteNode = Routing.makeRoute({
	path: '/request-password-reset',
	route: passwordResetRequestRoute,
});
const passwordResetRouteNode = Routing.makeRoute({
	path: '/password-reset/',
	route: passwordResetRoute,
});

const rootNode = makeMiddleware(
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
	}
);
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
