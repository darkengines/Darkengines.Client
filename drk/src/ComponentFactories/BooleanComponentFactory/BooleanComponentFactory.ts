import { injectable } from 'inversify';
import { html } from 'lit';
import { IPropertyModel } from '../../Model/IPropertyModel';
import './BooleanDisplay';
import './BooleanEditor';
import {
	ComponentFactory,
	IComponentActions,
	IComponentProps,
	IEditorComponentActions,
	IEditorComponentProps,
} from '../IComponentFactory';
import '@material/mwc-checkbox';
import '@material/mwc-formfield';
import { Checkbox } from '@material/mwc-checkbox';

@injectable()
export class BooleanComponentFactory implements ComponentFactory<IPropertyModel, boolean> {
	display(props: IComponentProps<IPropertyModel, boolean>, _actions: IComponentActions) {
		return html`<drk-boolean-display .props=${props}></drk-boolean-display>`;
	}
	async edit(
		props: IEditorComponentProps<IPropertyModel, boolean>,
		actions: IEditorComponentActions<IPropertyModel, boolean>
	) {
		return html`<mwc-formfield label=${props?.model?.name ?? ''}>
			<mwc-checkbox
				?checked=${props.value}
				@change=${(e: Event) => {
					const value = (e.currentTarget as Checkbox).checked;
					actions.valueChanged?.({ ...props, value });
				}}
			>
			</mwc-checkbox
		></mwc-formfield>`;
	}
	filter(
		props: IEditorComponentProps<IPropertyModel, boolean>,
		actions: IEditorComponentActions<IPropertyModel, boolean>
	) {
		return html`<drk-boolean-editor
			.props=${props}
			.actions=${actions}
		></drk-boolean-editor>`;
	}
	canHandle(model: IPropertyModel) {
		return (model.displayTypeName ?? model.typeName) == 'Boolean';
	}
}
