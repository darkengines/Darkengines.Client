import { Container } from 'inversify';
import { ApplicationMiddlewareInterfaces } from '../Applications/Interfaces';
import { AdministrationApplicationMenuItemProvider } from './AdministrationApplicationMenuItemProvider';
import { AdministrationInterfaces } from './Interfaces';
import { AdministrationMiddleware } from './Middlewares/AdministrationMiddleware';
import { AdministrationEditorRoute } from './Routes/AdministrationEditorRoute';
import { AdministrationGridRoute } from './Routes/AdministrationGridRoute';

declare module 'inversify' {
	interface Container {
		addAdministration(): Container;
	}
}
Container.prototype.addAdministration = function (this: Container): Container {
	this.bind(AdministrationInterfaces.IAdministrationEditorRoute)
		.to(AdministrationEditorRoute)
		.inSingletonScope();
	this.bind(AdministrationInterfaces.IAdministrationGridRoute)
		.to(AdministrationGridRoute)
		.inSingletonScope();
	this.bind(AdministrationInterfaces.IAdministrationMiddleware)
		.to(AdministrationMiddleware)
		.inSingletonScope();
	this.bind(ApplicationMiddlewareInterfaces.IApplicationMenuItemProvider)
		.to(AdministrationApplicationMenuItemProvider)
		.inSingletonScope();

	return this;
};
