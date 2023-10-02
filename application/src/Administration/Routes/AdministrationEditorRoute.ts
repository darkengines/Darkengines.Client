import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import { msg } from '@lit/localize';
import '../Components/AdministrationEditor/AdministrationEditor';
import { inject, multiInject } from 'inversify';
import Schema from '@drk/src/Model/Schema';
import { Forms, IFormActions, IFormProps } from '@drk/src/Components/Forms';
import { IFieldFactory } from '@drk/src/Components/DarkenginesForm/IFieldFactory';
import { Grid } from '@drk/src/Components/DarkenginesGrid/Grid';
import { IColumnFactory } from '@drk/src/Components/DarkenginesGrid/IColumnFactory';
import { apiClient } from '@drk/src/Api/Client';
import { IEntityModel } from '@drk/src/Model/IEntityModel';
import { Store, delta, normalize } from '@drk/src/store';
import { ref } from 'lit/directives/ref.js';
import { AdministrationEditor } from '../Components/AdministrationEditor/AdministrationEditor';
import { applyIncludes } from '@drk/src/Grid/Grid';

export interface IAdministrationEditorRouteState {}

export interface IAdministrationEditorRoute {
	handler: (_: Routing.IRouteContext, modelName: string, id: string) => any;
}

@injectable()
export class AdministrationEditorRoute implements IRoute, IAdministrationEditorRoute {
	protected fieldFactories: IFieldFactory[];
	protected columnFactories: IColumnFactory[];
	protected schema: Schema;

	public constructor(
		@inject(Schema) schema: Schema,
		@multiInject(Forms.IFieldFactory) fieldFactories: IFieldFactory[],
		@multiInject(Grid.IColumnFactory) columnFactories: IColumnFactory[]
	) {
		this.schema = schema;
		this.fieldFactories = fieldFactories;
		this.columnFactories = columnFactories;
	}
	public displayName: any = msg('Editor', { id: 'administrationDisplayName' });

	protected buildIdentifierPredicate(
		entityParameterName: string,
		entityModel: IEntityModel,
		args: any[]
	) {
		const predicates = entityModel.primaryKey.reduce((predicates, property, index) => {
			const isNumberProperty = property.typeName.startsWith('Int');
			const valueExpression = isNumberProperty ? args[index] : `'${args[index]}'`;
			return [...predicates, `${entityParameterName}.${property.name} == ${valueExpression}`];
		}, []);
		const predicate = predicates.join(' && ');
		return predicate;
	}

	public async handler(_: Routing.IRouteContext, modelName: string, id: string) {
		const model = await this.schema.model;
		const entityModel = model[modelName];
		let isCreation = true;
		let entity: any = {};

		if (modelName && id) {
			const entityParameterName = entityModel.name.toCamelCase();
			const baseQuery = apiClient.query<any>(modelName).code;
			let query = applyIncludes(baseQuery, entityModel)
			query = `${query}.firstOrDefault(${entityParameterName} => ${this.buildIdentifierPredicate(
				entityParameterName,
				entityModel,
				id.split('/')
			)})`;
			entity = await apiClient.rawQuery<any>(query).execute();
			isCreation = !!entity;
		}
		const rootFieldFactory = this.fieldFactories.find((fieldFactory) =>
			fieldFactory.canHandle(entityModel)
		);
		const fieldFactoryResult = await rootFieldFactory.createFields(
			{
				columnFactories: this.columnFactories,
				fieldFactories: this.fieldFactories,
				onSearch(model, filter) {},
			},
			entityModel
		);
		const fields = fieldFactoryResult.fields.toDictionary((field) => field.name);

		let store: Store;
		if (!isCreation) {
			const normalizationResult = normalize({}, entityModel, entity);
			store = normalizationResult.context.store;
			entity = normalizationResult.storedEntity;
		} else {
			store = {};
		}
		const formProps: IFormProps = {
			fields,
			model: entityModel,
			store,
			value: entity,
		};
		let resolveEditor: (element: AdministrationEditor) => void;
		const editor = new Promise<AdministrationEditor>(
			(resolve, reject) => (resolveEditor = resolve)
		);
		const formActions: IFormActions = {
			formChanged(form) {
				editor.then((editor) => (editor.props = { ...editor.props, form }));
				return form;
			},
			async save(form, value) {
				const adminElement = await editor;
				const diff = delta(adminElement.props.form.store, entity, value, entityModel);
				if (diff.hasChanged) {
					const result = await apiClient.saveOrUpdate(entityModel, diff.diff);
					const normalizationResult = normalize({ store: adminElement.props.form.store }, entityModel, result);
					form = {
						...form,
						value: normalizationResult.storedEntity,
						store: normalizationResult.context.store,
					};
				}
				editor.then((editor) => (editor.props = { ...editor.props, form }));
				return form;
			},
			valueChanged(form) {
				return form;
			},
		};
		const adminActions = {
			form: formActions,
		};
		const props = { form: formProps };
		return html`<drk-administration-editor
			${ref((element: AdministrationEditor) => resolveEditor(element))}
			.props=${props}
			.actions=${adminActions}
		></drk-administration-editor>`;
	}
}
