import { Client } from '@drk/src/Api/Client';
import { lambda } from '@drk/src/Expressions/LambdaExpression';
import { Container } from 'inversify';
import { ModelsRouteInterfaces, ModelsMiddlewareInterfaces, ModelsInterfaces } from './Interfaces';
import { ApplicationMiddlewareInterfaces, ApplicationRouteInterfaces } from '../Applications/Interfaces';
import { ModelAdminRoute } from './Routes/ModelAdminRoute';
import { ModelsApplicationMenuItemProvider } from './ModelsApplicationMenuItemProvider';
import { ModelsMiddleware } from './Middlewares/ModelsMiddleware';
import { ModelMenuItemProvider } from './ModelMenuItemProvider';
import { ModelDesignerRoute } from './Routes/ModelDesignerRoute';

declare module 'inversify' {
	interface Container {
		addModels(): Container;
	}
}
Container.prototype.addModels = function (): Container {
	this.bind(ModelsRouteInterfaces.IModelAdminRoute).to(ModelAdminRoute).inSingletonScope();
	this.bind(ModelsRouteInterfaces.IModelDesignerRoute).to(ModelDesignerRoute).inSingletonScope();
	this.bind(ApplicationMiddlewareInterfaces.IApplicationMenuItemProvider).to(ModelsApplicationMenuItemProvider).inSingletonScope();
	this.bind(ModelsInterfaces.IModelsMenuItemProvider).to(ModelMenuItemProvider).inSingletonScope();
	this.bind(ModelsMiddlewareInterfaces.IModelsMiddleware)
		.to(ModelsMiddleware)
		.inSingletonScope();
	return this;
};
