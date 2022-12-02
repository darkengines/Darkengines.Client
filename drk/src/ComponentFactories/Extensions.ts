import { Container } from 'inversify';
import { Newable } from 'ts-essentials';
import { BooleanComponentFactory } from './BooleanComponentFactory/BooleanComponentFactory';
import { ComponentFactories } from './ComponentFactories';
import { DateTimeComponentFactory } from './DateTimeComponentFactory/DateTimeComponentFactory';
import { HtmlComponentFactory } from './HtmlComponentFactory/HtmlComponentFactory';
import { IComponentFactory } from './IComponentFactory';
import { ImageUrlComponentFactory } from './ImageUrlComponentFactory/ImageUrlComponentFactory';
import { Int32ComponentFactory } from './Int32ComponentFactory/Int32ComponentFactory';
import { StringComponentFactory } from './StringComponentFactory/StringComponentFactory';

export function addComponentFactory<TComponentFactory extends IComponentFactory>(
	container: Container,
	componentFactoryConstructor: Newable<IComponentFactory>
) {
	container.bind<TComponentFactory>(componentFactoryConstructor).toSelf().inSingletonScope();
	container.bind<IComponentFactory>(ComponentFactories.IComponentFactory).toService(
		componentFactoryConstructor
	);
	return container;
}

export function addComponentFactories(container: Container) {
	addComponentFactory(container, StringComponentFactory);
	container.bind(ComponentFactories.DefaultComponentFactory).toService(StringComponentFactory);
	addComponentFactory(container, Int32ComponentFactory);
	addComponentFactory(container, BooleanComponentFactory);
	addComponentFactory(container, DateTimeComponentFactory);
	addComponentFactory(container, HtmlComponentFactory);
	addComponentFactory(container, ImageUrlComponentFactory);
	//addComponentFactory(container, EntityComponentFactory);
	return container;
}
