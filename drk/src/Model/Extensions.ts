import { Container } from 'inversify';
import DefaultModelCustomizer from './DefaultModelCustomizer';
import { IModelCustomizer } from './IModelCustomizer';
import { interfaces } from './Interfaces';
import Schema from './Schema';

export function addModels(container: Container) {
	container.bind<DefaultModelCustomizer>(DefaultModelCustomizer).toSelf().inSingletonScope();
	container.bind<IModelCustomizer>(interfaces.IModelCustomizer).toService(DefaultModelCustomizer);
    container.bind<Schema>(Schema).toSelf();
	return container;
}
