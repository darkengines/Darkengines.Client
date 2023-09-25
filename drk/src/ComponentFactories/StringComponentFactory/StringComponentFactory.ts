import '@material/mwc-textfield';
import { injectable } from 'inversify';
import { html } from 'lit';
import { ref } from 'lit/directives/ref.js';
import { IPropertyModel } from '../../Model/IPropertyModel';
import '../../StringExtensions';
import {
	ComponentFactory,
	IComponentActions,
	IComponentProps,
	IEditorComponentActions,
	IEditorComponentProps
} from '../IComponentFactory';
import './StringDisplay';
import './StringEditor';
import { StringEditor } from './StringEditor';

@injectable()
export class StringComponentFactory implements ComponentFactory<IPropertyModel, string> {
	display(props: IComponentProps<IPropertyModel, string>, actions: IComponentActions) {
		return html`<drk-string-display .props=${props}></drk-string-display>`;
	}
	async edit(
		props: IEditorComponentProps<IPropertyModel, string>,
		actions: IEditorComponentActions<IPropertyModel, string>,
		component: (component: StringEditor) => void
	) {
		return html`<drk-string-editor
			.label=${props.model.displayName ?? props.model.name}
			?required=${!props.model.isNullable}
			.props=${props}
			.actions=${actions}
			${ref((e) => {
				if (e) {
					component?.(e as StringEditor);
				}
			})}
		></drk-string-editor>`;
	}
	filter(
		props: IEditorComponentProps<IPropertyModel, string>,
		actions: IEditorComponentActions<IPropertyModel, string>,
		component: (component: StringEditor) => void
	) {
		return this.edit(props, actions, component);
	}
	canHandle(model: IPropertyModel) {
		return (model.displayTypeName ?? model.typeName) == 'String';
	}
}
