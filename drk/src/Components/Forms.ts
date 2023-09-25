import { Container, interfaces } from 'inversify';
import { Dictionary } from 'ts-essentials';
import {
	IComponentFactory,
	IEditorComponentActions,
	IEditorComponentProps,
} from '../ComponentFactories/IComponentFactory';
import { IEntityModel } from '../Model/IEntityModel';
import { IModel } from '../Model/IModel';
import { Store } from '../store';
import { EntityModelFieldFactory } from './DarkenginesForm/EntityModelFieldFactory';
import { IFieldFactory } from './DarkenginesForm/IFieldFactory';
import LocalizationCollectionFieldFactory from './DarkenginesForm/LocalizationCollectionFieldFactory';
import PropertyFieldFactory from './DarkenginesForm/PropertyFieldFactory';
import ReferenceFieldFactory from './DarkenginesForm/ReferenceFieldFactory';
import CollectionFieldFactory from './DarkenginesForm/CollectionFieldFactory';

const Forms = { IFieldFactory: Symbol.for('IFieldFactory') };
declare module 'inversify' {
	interface Container {
		addForms(): Container;
	}
}
function bindFieldFactory(container: Container): interfaces.BindingToSyntax<IFieldFactory> {
	return container.bind<IFieldFactory>(Forms.IFieldFactory);
}

Container.prototype.addForms = function (): Container {
	bindFieldFactory(this).to(EntityModelFieldFactory).inSingletonScope();
	bindFieldFactory(this).to(PropertyFieldFactory).inSingletonScope();
	bindFieldFactory(this).to(ReferenceFieldFactory).inSingletonScope();
	bindFieldFactory(this).to(CollectionFieldFactory).inSingletonScope();
	bindFieldFactory(this).to(LocalizationCollectionFieldFactory).inSingletonScope();
	return this;
};

export { Forms };
export interface IFormField {
	model: IModel;
	name: string;
	displayName: string;
	getComponentProps: (props: IFormProps) => IEditorComponentProps;
	getComponentActions: (props: IFormProps, actions: IFormActions) => IEditorComponentActions;
	componentFactory: IComponentFactory;
}
export interface IFormActions {
	valueChanged: (form: IFormProps) => IFormProps;
	save: (form: IFormProps, value: unknown) => Promise<IFormProps>;
	formChanged: (form: IFormProps) => IFormProps;
}
export interface IFormProps {
	fields: Dictionary<IFormField>;
	model: IEntityModel;
	value: any;
	store: Store;
}
