import { injectable } from 'inversify';
import { html } from 'lit';
import { IPropertyModel } from '../../Model/IPropertyModel';
import {
	ComponentFactory,
	IComponentActions,
	IComponentProps,
	IEditorComponentActions,
	IEditorComponentProps,
} from '../IComponentFactory';
import './HtmlDisplay';
import './HtmlEditor';
import tinymce from 'tinymce';

tinymce.baseURL = '/assets/tinymce';

@injectable()
export class HtmlComponentFactory extends ComponentFactory<IPropertyModel, string> {
	display(props: IComponentProps<IPropertyModel, string>, actions: IComponentActions) {
		return html`<drk-html-display .props=${props}></drk-html-display>`;
	}
	async edit(
		props: IEditorComponentProps<IPropertyModel, string>,
		actions: IEditorComponentActions<IPropertyModel, string>
	) {
		return html`<drk-html-editor .props=${props} .actions=${actions}></drk-html-editor>`;
	}
	filter(
		props: IEditorComponentProps<IPropertyModel, string>,
		actions: IEditorComponentActions<IPropertyModel, string>
	) {
		return this.edit(props, actions);
	}
	canHandle(model: IPropertyModel) {
		return (model.displayTypeName ?? model.typeName) == 'Html';
	}
}
