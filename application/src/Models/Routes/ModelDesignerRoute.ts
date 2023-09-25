import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/ModelDesigner/ModelDesigner';
import { msg } from '@lit/localize';
import '../Components/ModelDesigner/ModelDesigner';
import '../../index.css';
import { IModelDesignerProps } from '../Components/ModelDesigner/ModelDesigner';
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
import { IModel } from '@drk/src/Models/Models/IModel';
import { INavigation } from '@drk/src/Models/Models/INavigation';
import { apiClient } from '@drk/src/Api/Client';
import { cast, lambda } from '@drk/src/Expressions/LambdaExpression';
import { IMember } from '@drk/src/Models/Models/IMember';

export interface IModelDesignerRouteState {}

export interface IModelDesignerRoute {
	handler: (_: Routing.IRouteContext, modelName: string) => any;
}

@injectable()
export class ModelDesignerRoute implements IRoute, IModelDesignerRoute {
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

	public displayName: any = msg('ModelDesigner', { id: 'modelDesignerDisplayName' });
	public async handler(_: Routing.IRouteContext, modelName: string) {
		const models = await apiClient
			.query<IModel>('Model')
			.include((model) => model.entities)
			.thenInclude((entity) => entity.members)
			.thenInclude(lambda({}, context => member => context.cast<INavigation>('Navigation', member).foreignKey))
			.thenInclude((foreignKey) => foreignKey.properties)
			.where(lambda({ modelName }, (context) => (model) => model.name == context.scope.modelName))
			.execute();
		const model = models[0];

        const defaultModel: IModel = {
            name: undefined,
            description: undefined,
            displayName: undefined,
            entities: []
        };

		const initialProps: IModelDesignerProps = { model: model ?? defaultModel };
		return html`<drk-model-designer .props=${initialProps}></drk-model-designer>`;
	}
}

