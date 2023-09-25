import { injectable } from 'inversify';
import { html } from 'lit';
import './DateTimeDisplay';
import './DateTimeEditor';
import {
	ComponentFactory,
	IComponentProps,
	IEditorComponentProps,
	IEditorComponentActions,
	IComponentActions,
} from '../IComponentFactory';
import { IPropertyModel } from '../../Model/IPropertyModel';

@injectable()
export class DateTimeComponentFactory implements ComponentFactory<IPropertyModel, Date> {
	display(props: IComponentProps<IPropertyModel, Date>, _actions: IComponentActions) {
		return html`<drk-date-time-display .props=${props}></drk-date-time-display>`;
	}
	async edit(
		props: IEditorComponentProps<IPropertyModel, Date>,
		actions: IEditorComponentActions<IPropertyModel, Date>
	) {
		return html`<drk-date-time-editor
			.label=${props?.model?.displayName ?? props?.model?.name}
			?required=${!props?.model?.isNullable}
			.props=${props}
			.actions=${actions}
		></drk-date-time-editor>`;
	}
	filter(
		props: IEditorComponentProps<IPropertyModel, Date>,
		actions: IEditorComponentActions<IPropertyModel, Date>
	) {
		return this.edit(props, actions);
	}
	canHandle(model: IPropertyModel) {
		return (
			(model.displayTypeName ?? model.typeName) == 'DateTime' ||
			(model.displayTypeName ?? model.typeName) == 'DateTimeOffset'
		);
	}
}
