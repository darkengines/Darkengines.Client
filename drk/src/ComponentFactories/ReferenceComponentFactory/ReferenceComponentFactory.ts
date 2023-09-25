import { html } from 'lit';
import { state } from 'lit-element';
import { IReferenceModel } from '../../Model/IReferenceModel';
import '../../StringExtensions';
import {
	ComponentFactory,
	IComponentActions,
	IComponentProps,
	IEditorComponentActions,
	IEditorComponentProps
} from '../IComponentFactory';
import './ReferenceEditor';
import { IReferenceEditorActions, IReferenceEditorProps } from './ReferenceEditor';

export interface IReferenceValue {
	reference: IReferenceModel;
	value: any;
}

export default class ReferenceComponentFactory extends ComponentFactory<IReferenceModel, object> {
	canHandle(model: IReferenceModel) {
		return model.modelType == 'ReferenceModel';
	}
	async edit(props: IReferenceEditorProps, actions: IReferenceEditorActions) {
		return html`<drk-reference-editor
			.props=${props}
			.actions=${actions}
		></drk-reference-editor>`;
	}
	filter(
		props: IEditorComponentProps<IReferenceModel, object>,
		actions: IEditorComponentActions<IReferenceModel, object>
	) {
		return html`<drk-reference .state=${state}></drk-reference>`;
	}
	display(props: IComponentProps<IReferenceModel, object>, actions: IComponentActions) {
		return html`${props.value?.toString() ?? `NULL`}`;
	}
}
