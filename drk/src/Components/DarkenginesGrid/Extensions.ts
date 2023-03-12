import { Container, interfaces } from 'inversify';
import CollectionColumnFactory from './CollectionColumnFactory';
import EntityModelColumnFactory from './EntityModelColumnFactory';
import { Grid } from './Grid';
import { IColumnFactory } from './IColumnFactory';
import LocalizationCollectionColumnFactory from './LocalizationCollectionColumnFactory';
import PropertyColumnFactory from './PropertyColumnFactory';
import ReferenceColumnFactory from './ReferenceColumnFactory';
import { interfaces as modelInterfaces } from 'drk/src/Model/Interfaces';

export function bindColumnFactory(
	container: Container
): interfaces.BindingToSyntax<IColumnFactory> {
	return container.bind<IColumnFactory>(Grid.IColumnFactory);
}
export function addColumnFactories(container: Container) {
	bindColumnFactory(container).to(EntityModelColumnFactory).inSingletonScope();
	bindColumnFactory(container).to(PropertyColumnFactory).inSingletonScope();
	bindColumnFactory(container).to(ReferenceColumnFactory).inSingletonScope();
	bindColumnFactory(container).to(LocalizationCollectionColumnFactory).inSingletonScope();
	bindColumnFactory(container).to(CollectionColumnFactory).inSingletonScope();
	container.bind(modelInterfaces.IModelResourceFactory).toConstantValue({});
	return container;
}
