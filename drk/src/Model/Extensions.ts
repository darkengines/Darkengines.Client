import { Container } from 'inversify';
import DefaultModelCustomizer from './DefaultModelCustomizer';
import { IModelCustomizer } from './IModelCustomizer';
import Schema from './Schema';

const interfaces = {
	IModelCustomizer: Symbol.for('IModelCustomizer'),
	IModelResourceFactory: Symbol.for('IModelResourceFactory'),
};


export function addModels(container: Container) {
	container.bind<DefaultModelCustomizer>(DefaultModelCustomizer).toSelf().inSingletonScope();
	container.bind<IModelCustomizer>(interfaces.IModelCustomizer).toService(DefaultModelCustomizer);
    container.bind<Schema>(Schema).toSelf();
	return container;
}

export { interfaces };
