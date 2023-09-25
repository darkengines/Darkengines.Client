import { Routing } from '@drk/src';
import { makeMiddleware } from '@drk/src/routing';
import { serviceCollection } from '../inversify.config';
import { ModelsRouteInterfaces, ModelsMiddlewareInterfaces } from './Interfaces';
import { IModelsMiddleware } from './Middlewares/ModelsMiddleware';
import { IModelAdminRoute } from './Routes/ModelAdminRoute';
import { IModelDesignerRoute } from './Routes/ModelDesignerRoute';

const adminRoute = serviceCollection.get<IModelAdminRoute>(ModelsRouteInterfaces.IModelAdminRoute);
const designerRoute = serviceCollection.get<IModelDesignerRoute>(ModelsRouteInterfaces.IModelDesignerRoute);
const modelsMiddleware = serviceCollection.get<IModelsMiddleware>(
	ModelsMiddlewareInterfaces.IModelsMiddleware
);

export const modelsNode = makeMiddleware('models', modelsMiddleware, {
	index: {
		path: '/model',
		route: adminRoute,
	},
	designer: {
		path: '/model/:modelName',
		route: designerRoute,
	},
});
