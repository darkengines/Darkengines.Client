import { inject, injectable } from 'inversify';
import { html } from 'lit';
import tinymce from 'tinymce/tinymce';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { upload } from '../../Upload/Upload';
import {
	ComponentFactory,
	IComponentActions,
	IComponentProps,
	IEditorComponentActions,
	IEditorComponentProps
} from '../IComponentFactory';
import '../StringComponentFactory/StringDisplay';
import './ImageUrlDisplay';
import './ImageUrlEditor';

tinymce.baseURL = '/assets/tinymce';

@injectable()
export class ImageUrlComponentFactory extends ComponentFactory<IPropertyModel, string> {
	constructor() {
		super();
	}
	canHandle(model: IPropertyModel) {
		return model.displayTypeName == 'ImageUrl';
	}
	async edit(
		props: IEditorComponentProps<IPropertyModel, string>,
		actions: IEditorComponentActions<IPropertyModel, string>
	) {
		return html`<drk-image-url-editor
			style="width: 512px;"
			.props=${props}
			.onUpload=${async (blob: Blob) => {
				return await upload('AdminPhotoUploadHandler', blob);
			}}
			.actions=${actions}
		></drk-image-url-editor>`;
	}
	filter(
		props: IEditorComponentProps<IPropertyModel, string>,
		actions: IEditorComponentActions<IPropertyModel, string>
	) {
		return html`<drk-string-display .props=${props}></drk-string-display>`;
	}
	display(props: IComponentProps<IPropertyModel, string>, actions: IComponentActions) {
		return html`<drk-image-url-display .props=${props}></drk-image-url-display>`;
	}
}
