import { apiClient, Client } from '@drk/src/Api/Client';
import { lambda } from '@drk/src/Expressions/LambdaExpression';
import { Container } from 'inversify';
import { ApplicationMiddleware } from './ApplicationMiddleware';
import { ApplicationMiddlewareInterfaces } from './Interfaces';

declare module 'inversify' {
	interface Container {
		addApplications(): Container;
	}
}
Container.prototype.addApplications = function (): Container {
	this.bind(ApplicationMiddlewareInterfaces.IApplicationMiddleware)
		.to(ApplicationMiddleware)
		.inSingletonScope();

	return this;
};
