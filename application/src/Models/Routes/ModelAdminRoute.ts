import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/ModelAdmin/ModelAdmin';
import { msg } from '@lit/localize';
import '../Components/ModelAdmin/ModelAdmin';
import '../../index.css';
import { IModelAdminProps } from '../Components/ModelAdmin/ModelAdmin';
import Schema from '@drk/src/Model/Schema';
import {
	IFieldFactory,
	IFieldFactoryContext,
} from '@drk/src/Components/DarkenginesForm/IFieldFactory';
import { inject, multiInject } from 'inversify';
import DefaultModelCustomizer from '@drk/src/Model/DefaultModelCustomizer';
import { Forms } from '@drk/src/Components/Forms';
import { IColumnFactory } from '@drk/src/Components/DarkenginesGrid/IColumnFactory';
import { Grid } from '@drk/src/Components/DarkenginesGrid/Grid';
import { IFilter } from '@drk/src/Components/DarkenginesGrid/IDarkenginesGrid';
import { IEntityModel } from '@drk/src/Model/IEntityModel';

export interface IModelAdminRouteState {}

export interface IModelAdminRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class ModelAdminRoute implements IRoute, IModelAdminRoute {
	protected schema: Schema;
	protected defaultModelCustomizer: DefaultModelCustomizer;
	protected fieldFactories: IFieldFactory[];
	protected columnFactories: IColumnFactory[];

	public constructor(
		@inject(Schema) schema: Schema,
		@inject(DefaultModelCustomizer) defaultModelCustomizer: DefaultModelCustomizer,
		@multiInject(Forms.IFieldFactory) fieldFactories: IFieldFactory[],
		@multiInject(Grid.IColumnFactory) columnFactories: IColumnFactory[]
	) {
		this.schema = schema;
		this.defaultModelCustomizer = defaultModelCustomizer;
		this.fieldFactories = fieldFactories;
		this.columnFactories = columnFactories;
	}

	public displayName: any = msg('ModelAdmin', { id: 'modelAdminDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		const context: IFieldFactoryContext = {
			columnFactories: this.columnFactories,
			fieldFactories: this.fieldFactories,
			onSearch(model: IEntityModel, filter: IFilter) {
				return [];
			},
		};
		const schema = await this.schema.model;
		const model = schema['Model'];
		const fieldFactory = context.fieldFactories.find((fieldFactory) =>
			fieldFactory.canHandle(model)
		);
		const fieldFactoryResult = await fieldFactory.createFields(context, model);
		const initialProps: IModelAdminProps = { fields: fieldFactoryResult.fields, model };
		return html`<drk-model-admin .props=${initialProps}></drk-model-admin>`;
	}
}
