import { Routing } from '@drk/src';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import { css, html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/Login/Login';
import { msg } from '@lit/localize';
import { Stateful } from '@drk/src/States/Stateful';
import { runtimeRoot } from 'application/src/Application';
import { ILoginActions, ILoginProps, Login } from '../Components/Login/Login';
import { ref } from 'lit/directives/ref.js';
import { apiClient } from '@drk/src/Api/Client';
import { authentication } from '@drk/src/Authentication/Authentication';
import '../../Dashboard/Dashboard';
import Schema from '@drk/src/Model/Schema';
import { setFilter, setOrder, setPagination, setModel } from '@drk/src/Grid/Grid';
import { Grid } from '@drk/src/Components/DarkenginesGrid/Grid';
import { IDarkenginesAdminProps } from '@drk/src/Grid/IDarkenginesAdminProps';
import { multiInject } from 'inversify';
import { IColumnFactory } from '@drk/src/Components/DarkenginesGrid/IColumnFactory';
import { IDarkenginesAdminActions } from '@drk/src/Grid/IDarkenginesAdminActions';
import { IEntityModel } from '@drk/src/Model/IEntityModel';

export interface IIndexRouteState {}

export interface IIndexRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class IndexRoute implements IRoute, IIndexRoute {
	protected schema: Schema;
	protected columnFactories: IColumnFactory[];
	public constructor(
		@inject(Schema) schema: Schema,
		@multiInject(Grid.IColumnFactory) columnFactories: IColumnFactory[]
	) {
		this.schema = schema;
		this.columnFactories = columnFactories;
	}
	public displayName: any = msg('Login', { id: 'loginDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		const initialState: IIndexRouteState = {};

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

		return html`<drk-dashboard
			.props=${{
				models,
				selectedModel
			}}
			.adminProps=${state}
			.adminActions=${actions}
		></drk-dashboard>`;
	}
}
