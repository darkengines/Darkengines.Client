import { html } from 'lit';
import {
	ComponentFactory,
	IComponentActions,
	IComponentProps,
	IEditorComponentActions,
	IEditorComponentProps,
} from '../IComponentFactory';
import './EntityEditor';
import './EntityDisplay';
import { IFormField } from '../../Components/Forms';
import { lambda } from '../../Expressions/LambdaExpression';
import { IEntityModel } from '../../Model/IEntityModel';
import { queryProvider } from '../../Api/QueryProvider';

export default class EntityComponentFactory extends ComponentFactory<IEntityModel, object> {
	protected fields: IFormField[];
	public constructor(fields: IFormField[]) {
		super();
		this.fields = fields;
	}
	canHandle(model: IEntityModel): boolean {
		return model.modelType == 'EntityModel';
	}
	filter(
		props: IEditorComponentProps<IEntityModel, object>,
		actions: IEditorComponentActions<IEntityModel, object>
	) {
		throw new Error('Method not implemented.');
	}
	async search(model: IEntityModel, value: string) {
		let query = queryProvider.queryAuthenticated<any[]>(`${model.name}.Query`);

		if (value) {
			if (model.properties.some((property) => property.name == 'displayName')) {
				query = query.where(
					lambda(
						{ value: `%${value}%` },
						(context) => (item: { displayName: string }) =>
							item.displayName.like(context.scope.value)
					)
				);
			}
		}

		query = query.take(16);
		const data = await query.execute();
		return data;
	}
	edit(
		props: IEditorComponentProps<IEntityModel, object>,
		actions: IEditorComponentActions<IEntityModel, object>
	) {
		return html`<drk-entity-editor .props=${props} .actions=${actions}></drk-entity-editor>`;
	}
	display(props: IComponentProps<IEntityModel, object>, actions: IComponentActions) {
		return html`<drk-entity-display .props=${props}></drk-entity-display>`;
	}
}
