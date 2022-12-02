import { injectable } from 'inversify';
import { IModel } from '../Model/IModel';

export interface IEditorComponentActions<TModel extends IModel = IModel, TValue = any>
	extends IComponentActions {
	valueChanged: (props: IEditorComponentProps<TModel, TValue>) => void;
}

export interface IEditorComponentProps<
	TModel extends IModel = IModel,
	TValue = any,
	TComponent = any
> extends IComponentProps<TModel, TValue, TComponent> {}

export interface IComponentProps<TModel extends IModel = IModel, TValue = any, TComponent = any> {
	model?: TModel;
	value?: TValue;
	component?: TComponent;
}
export interface IComponentActions {}

export interface IComponentFactory {
	canHandle(model: unknown): boolean;
	edit(
		props: IEditorComponentProps,
		actions: IEditorComponentActions,
		component?: (component: any) => void
	): any;
	filter(
		props: IEditorComponentProps,
		actions: IEditorComponentActions,
		onComponentLoaded: (component: any) => void
	): any;
	display(props: IComponentProps, actions: IComponentActions): any;
}

@injectable()
export abstract class ComponentFactory<TModel extends IModel, TValue> implements IComponentFactory {
	abstract canHandle(model: TModel): boolean;
	abstract edit(
		props: IEditorComponentProps<TModel, TValue>,
		actions: IEditorComponentActions<TModel, TValue>,
		component?: (component: any) => void
	): any;
	abstract filter(
		props: IEditorComponentProps<TModel, TValue>,
		actions: IEditorComponentActions<TModel, TValue>,
		onComponentLoaded?: (component: any) => void
	): any;
	abstract display(props: IComponentProps<TModel, TValue>, actions: IComponentActions): any;
}
