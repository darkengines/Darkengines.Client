import { inject, injectable, multiInject } from 'inversify';
import { QueryExecutor } from '../../Api/QueryExecutor';
import CollectionComponentFactory from '../../ComponentFactories/CollectionComponentFactory/CollectionComponentFactory';
import {
	ICollectionEditorProps,
	ICollectionEditorActions,
} from '../../ComponentFactories/CollectionComponentFactory/CollectionEditor';
import Queryable from '../../Expressions/Queryable';
import { ICollectionModel } from '../../Model/ICollectionModel';
import { normalize, normalizeMany } from '../../store';
import { IEntityModel } from '../../Model/IEntityModel';
import {
	IDarkenginesGridActions,
	IDarkenginesGridProps,
	IFilter,
} from '../DarkenginesGrid/IDarkenginesGrid';
import { IFormActions, IFormField, IFormProps } from '../Forms';
import FieldFactory from './FieldFactory';
import { IFieldFactoryContext } from './IFieldFactory';
import { IFieldFactoryResult } from './IFieldFactoryResult';
import {
	applyFilter,
	applyIncludes,
	applyPagination,
	setFilter,
	setModel,
	setOrder,
	setPagination,
} from '../../Grid/Grid';
import { apiClient } from 'drk/src/Api/Client';
import { Grid } from '../DarkenginesGrid/Grid';
import { IColumnFactory } from '../DarkenginesGrid/IColumnFactory';

export interface ICollectionFormField extends IFormField {
	form: {
		props: IFormProps;
		actions: IFormActions;
	};
	filter: IFilter;
	searchResult: any[];
}

@injectable()
export default class CollectionFieldFactory extends FieldFactory<ICollectionModel> {
	protected columnFactories: IColumnFactory[];
	constructor(@multiInject(Grid.IColumnFactory) columnFactories: IColumnFactory[]) {
		super();
		this.columnFactories = columnFactories;
	}
	canHandle(model: ICollectionModel) {
		return model.modelType == 'CollectionModel';
	}
	async createFields(
		context: IFieldFactoryContext,
		collection: ICollectionModel
	): Promise<IFieldFactoryResult> {
		if (collection.type.componentFactories.length) {
			const field: IFormField = {
				componentFactory: collection.type.componentFactories[0],
				getComponentProps: (formProps) => ({
					component: undefined,
					model: collection.type,
					value: formProps.value?.[collection.name],
				}),
				getComponentActions: (formProps, formActions) => ({
					valueChanged: (props) =>
						formActions.valueChanged({
							...formProps,
							value: {
								...formProps.value,
								[collection.name]: props.value,
							},
						}),
				}),
				displayName: collection.displayName,
				name: collection.name,
				model: collection.type,
			};
			return {
				fields: [field],
			};
		}
		let columnFactoryResult = await context.columnFactories
			.find((columnFactory) => columnFactory.canHandle(collection.type))
			.createSummaryColumns(context.columnFactories, collection.type);

		const getComponentProps: (formProps: IFormProps) => ICollectionEditorProps = (
			formProps
		) => {
			const grid = setModel(collection.type, this.columnFactories);
			const collectionField = formProps.fields[collection.name] as ICollectionFormField;
			const filter = collectionField.filter ?? columnFactoryResult.filter;

			const collectionEditorProps: ICollectionEditorProps = {
				grid: grid,
				component: undefined,
				context: context,
				form: { ...collectionField.form },
				model: collection,
				searchResults: collectionField.searchResult ?? [],
				value: formProps.value?.[collection.name],
			};

			return collectionEditorProps;
		};
		function getBaseQuery(model: IEntityModel) {
			let query = `${model.name}Admin.Query`;
			query = applyIncludes(query, model);
			return query;
		}
		const getComponentActions: (
			formProps: IFormProps,
			formActions: IFormActions
		) => ICollectionEditorActions = (formProps, formActions) => {
			const valueChanged: (props: ICollectionEditorProps) => ICollectionEditorProps = (
				props
			) => {
				let collectionFormField = formProps.fields[collection.name] as ICollectionFormField;
				collectionFormField = {
					...collectionFormField,
					form: {
						...collectionFormField.form,
						props: {
							...collectionFormField.form.props,
							value: props.value,
						},
					},
				};
				formActions.formChanged({
					...formProps,
					fields: {
						...formProps.fields,
						[collection.name]: collectionFormField,
					},
					value: {
						...formProps.value,
						[collection.name]: props.value,
					},
				});
				return props;
			};

			const gridActions: IDarkenginesGridActions = {
				setFilter: async (grid, filter) => await setFilter(grid, grid.model, filter),
				setOrder: async (grid, order) => await setOrder(grid, grid.model, order),
				setPagination: async (grid, pagination) =>
					await setPagination(grid, grid.model, pagination),
				edit: async (item) => console.log('edit'),
				delete: async (props) => {
					console.log('delete');
					return props;
				},
			};

			return {
				valueChanged,
				grid: gridActions,
			};
		};

		const field: IFormField = {
			componentFactory: new CollectionComponentFactory(this.columnFactories),
			getComponentProps,
			getComponentActions,
			displayName: collection.displayName,
			name: collection.name,
			model: collection,
		};
		return {
			fields: [field],
		};
	}
}
