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
import EntityModelFieldFactory from './DarkenginesForm/EntityModelFieldFactory';
import { IFieldFactory } from './DarkenginesForm/IFieldFactory';
import LocalizationCollectionFieldFactory from './DarkenginesForm/LocalizationCollectionFieldFactory';
import PropertyFieldFactory from './DarkenginesForm/PropertyFieldFactory';
import ReferenceFieldFactory from './DarkenginesForm/ReferenceFieldFactory';

const Forms = { IFieldFactory: Symbol.for('IFieldFactory') };

function bindFieldFactory(container: Container): interfaces.BindingToSyntax<IFieldFactory> {
	return container.bind<IFieldFactory>(Forms.IFieldFactory);
}

export function addForms(container: Container) {
	bindFieldFactory(container).to(EntityModelFieldFactory).inSingletonScope();
	bindFieldFactory(container).to(PropertyFieldFactory).inSingletonScope();
	bindFieldFactory(container).to(ReferenceFieldFactory).inSingletonScope();
	//bindFieldFactory(container).to(CollectionFieldFactory).inSingletonScope();
	bindFieldFactory(container).to(LocalizationCollectionFieldFactory).inSingletonScope();
	return container;
}

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
