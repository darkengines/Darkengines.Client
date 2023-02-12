import { Container } from 'inversify';
import { DesignerRoute } from './Routes/DesignerRoute';
import { DesignerRouteInterfaces } from './Routes/Interfaces';

export function addDesigner(container: Container) {
	container.bind(DesignerRouteInterfaces.IDesignerRoute).to(DesignerRoute).inSingletonScope();
	return container;
}
