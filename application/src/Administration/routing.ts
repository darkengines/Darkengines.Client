import { makeMiddleware, makeRoute } from '@drk/src/routing';
import { serviceCollection } from '../inversify.config';
import { AdministrationInterfaces } from './Interfaces';
import { IAdministrationMiddleware } from './Middlewares/AdministrationMiddleware';
import { IAdministrationEditorRoute } from './Routes/AdministrationEditorRoute';
import { IAdministrationGridRoute } from './Routes/AdministrationGridRoute';

const administrationMiddlewareService = serviceCollection.get<IAdministrationMiddleware>(
	AdministrationInterfaces.IAdministrationMiddleware
);
const administrationGridRouteService = serviceCollection.get<IAdministrationGridRoute>(
	AdministrationInterfaces.IAdministrationGridRoute
);
const administrationEditorRouteService = serviceCollection.get<IAdministrationEditorRoute>(
	AdministrationInterfaces.IAdministrationEditorRoute
);

export const administrationGrid = makeRoute({
	path: ['/', '/:modelName'],
	route: administrationGridRouteService,
});

export const administrationEditor = makeRoute({
	path: '/:modelName/*routeIdentifier',
	route: administrationEditorRouteService,
});

export const administration = makeMiddleware('/administration', administrationMiddlewareService, {
	administrationGrid,
	administrationEditor,
});
