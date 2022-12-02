import config from '../config/appsettings.config.json';
import { setConfig } from '../../drk/src/config';

setConfig(config);

import 'reflect-metadata';
import { Routing } from '../../drk/src';
import { html, render } from 'lit';
import { until } from 'lit/directives/until.js';
import RouteRecognizer from 'route-recognizer';
import { AdminRoute } from './AdminRoute';
import { getCurrentPath, IRuntimeRoute } from '../../drk/src/routing';
import './Hello';
import './index.css';
import { serviceCollection } from './inversify.config';

const adminRoute = serviceCollection.get(AdminRoute);

const indexRoute = Routing.makeRoute({
	path: '/',
	route: adminRoute,
});

const runtimeRoot = Routing.buildNode(indexRoute);
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

const result = getCurrentPath().then(async (path) => await resolve(path));
const x = html`${until(result)}`;

render(x, document.body);
