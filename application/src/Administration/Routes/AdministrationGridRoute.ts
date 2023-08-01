import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import { msg } from '@lit/localize';
import '../Components/AdministrationGrid/AdministrationGrid';
import { setModel, setFilter, setOrder, setPagination } from '@drk/src/Grid/Grid';
import { IDarkenginesAdminActions } from '@drk/src/Grid/IDarkenginesAdminActions';
import { IDarkenginesAdminProps } from '@drk/src/Grid/IDarkenginesAdminProps';
import { IEntityModel } from '@drk/src/Model/IEntityModel';
import { Grid } from '@drk/src/Components/DarkenginesGrid/Grid';
import { IColumnFactory } from '@drk/src/Components/DarkenginesGrid/IColumnFactory';
import { inject, multiInject } from 'inversify';
import Schema from '@drk/src/Model/Schema';

export interface IAdministrationGridRouteState {}

export interface IAdministrationGridRoute {
	handler: (_: Routing.IRouteContext, modelName?: string) => any;
}

@injectable()
export class AdministrationGridRoute implements IRoute, IAdministrationGridRoute {
	protected schema: Schema;
	protected columnFactories: IColumnFactory[];
	public constructor(
		@inject(Schema) schema: Schema,
		@multiInject(Grid.IColumnFactory) columnFactories: IColumnFactory[]
	) {
		this.schema = schema;
		this.columnFactories = columnFactories;
	}
	public displayName: any = msg('Administration', { id: 'adminitrationDisplayName' });
	public async handler(_: Routing.IRouteContext, modelName?: string) {
		const initialState: IAdministrationGridRouteState = {};
		const models = await this.schema.model;
		const selectedModel = models['User'];
		let state: IDarkenginesAdminProps = {
			models: Object.values(models).sort((a, b) => a.name.localeCompare(b.name)),
			model: selectedModel,
			darkenginesGrid: undefined,
		};
		state = await setModel(state, selectedModel, this.columnFactories);

		const actions: IDarkenginesAdminActions = {
			setFilter,
			setOrder,
			setPagination,
			setModel: async (darkenginesAdmin: IDarkenginesAdminProps, model: IEntityModel) => {
				return await setModel(darkenginesAdmin, model, this.columnFactories);
			},
			edit: async (item) => console.log('edit'),
			add: async () => console.log('add'),
			delete: async (props) => {
				console.log('delete');
				return props;
			},
		};
		return html`<drk-administration-grid
			.props=${{
				models,
				selectedModel,
			}}
			.adminProps=${state}
			.adminActions=${actions}
		></drk-administration-grid>`;
	}
}
