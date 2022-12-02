import { inject, injectable } from 'inversify';
import { QueryExecutor } from '../../Api/QueryExecutor';
import ReferenceComponentFactory from '../../ComponentFactories/ReferenceComponentFactory/ReferenceComponentFactory';
import {
	IReferenceEditorProps,
	IReferenceEditorActions,
} from '../../ComponentFactories/ReferenceComponentFactory/ReferenceEditor';
import Queryable from '../../Expressions/Queryable';
import { IReferenceModel } from '../../Model/IReferenceModel';
import { normalize } from '../../store';
import { IEntityModel } from '../../Model/IEntityModel';
import { IFilter } from '../DarkenginesGrid/IDarkenginesGrid';
import { IFormActions, IFormField, IFormProps } from '../Forms';
import FieldFactory from './FieldFactory';
import { IFieldFactoryContext } from './IFieldFactory';
import { IFieldFactoryResult } from './IFieldFactoryResult';
import { applyFilter, applyIncludes, applyPagination } from '../../Grid/Grid';

export interface IReferenceFormField extends IFormField {
	form: {
		props: IFormProps;
		actions: IFormActions;
	};
	filter: IFilter;
	searchResult: any[];
}

@injectable()
export default class ReferenceFieldFactory extends FieldFactory<IReferenceModel> {
	protected queryExecutor: QueryExecutor;
	constructor(@inject(QueryExecutor) queryExecutor: QueryExecutor) {
		super();
		this.queryExecutor = queryExecutor;
	}
	canHandle(model: IReferenceModel) {
		return model.modelType == 'ReferenceModel';
	}
	async createFields(
		context: IFieldFactoryContext,
		reference: IReferenceModel
	): Promise<IFieldFactoryResult> {
		if (reference.type.componentFactories.length) {
			const field: IFormField = {
				componentFactory: reference.type.componentFactories[0],
				getComponentProps: (formProps) => ({
					component: undefined,
					model: reference.type,
					value: formProps.value?.[reference.name],
				}),
				getComponentActions: (formProps, formActions) => ({
					valueChanged: (props) =>
						formActions.valueChanged({
							...formProps,
							value: {
								...formProps.value,
								[reference.name]: props.value,
							},
						}),
				}),
				displayName: reference.displayName,
				name: reference.name,
				model: reference.type,
			};
			return {
				fields: [field],
			};
		}
		let columnFactoryResult = await context.columnFactories
			.find((columnFactory) => columnFactory.canHandle(reference.type))
			.createSummaryColumns(context.columnFactories, reference.type);

		const getComponentProps: (formProps: IFormProps) => IReferenceEditorProps = (formProps) => {
			const referenceField = formProps.fields[reference.name] as IReferenceFormField;
			const filter = referenceField.filter ?? columnFactoryResult.filter;
			return {
				columns: columnFactoryResult.columns,
				component: undefined,
				context: context,
				filter: filter,
				form: { ...referenceField.form, value: formProps.value?.[reference.name] },
				model: reference,
				searchResults: referenceField.searchResult ?? [],
				value: formProps.value?.[reference.name],
			};
		};
		function getBaseQuery(model: IEntityModel) {
			let query = `${model.name}Admin.Query`;
			query = applyIncludes(query, model);
			return query;
		}
		const getComponentActions: (
			formProps: IFormProps,
			formActions: IFormActions
		) => IReferenceEditorActions = (formProps, formActions) => {
			const valueChanged: (props: IReferenceEditorProps) => IReferenceEditorProps = (
				props
			) => {
				let referenceFormField = formProps.fields[reference.name] as IReferenceFormField;
				referenceFormField = {
					...referenceFormField,
					form: {
						...referenceFormField.form,
						props: {
							...referenceFormField.form.props,
							value: props.value,
						},
					},
				};
				formActions.formChanged({
					...formProps,
					fields: {
						...formProps.fields,
						[reference.name]: referenceFormField,
					},
					value: {
						...formProps.value,
						[reference.name]: props.value,
					},
				});
				return props;
			};
			return {
				valueChanged,
				filterChanged: async (props) => {
					let query = getBaseQuery(reference.type);
					query = applyFilter(query, props.filter, props.filter.args);
					query = applyPagination(query, {
						itemsPerPage: 16,
						pageIndex: 0,
						count: undefined,
						pageCount: 1,
					});
					const queryable = new Queryable<any[]>(query, this.queryExecutor);
					const results = await queryable.execute();
					const referenceFormField: IReferenceFormField = {
						...(formProps.fields[reference.name] as IReferenceFormField),
						filter: props.filter,
						searchResult: results,
					};
					formProps = {
						...formProps,
						fields: {
							...formProps.fields,
							[reference.name]: referenceFormField,
						},
					};
					formActions.formChanged(formProps);
					return { ...props, searchResults: results };
				},
				referenceFieldsRequested: async (referenceComponentProps) => {
					const fieldFactoryResult = await context.fieldFactories
						.find((fieldFactory) => fieldFactory.canHandle(reference.type))
						.createFields(context, reference.type);
					const fields = fieldFactoryResult.fields.toDictionary((field) => field.name);
					const form: { props: IFormProps; actions: IFormActions } = {
						props: {
							fields,
							model: reference.type,
							store: formProps.store,
							value: formProps.value[reference.name],
						},
						actions: {
							save: async (props) => props,
							valueChanged: (subFormProps) => {
								let referenceFormField = formProps.fields[
									reference.name
								] as IReferenceFormField;
								referenceFormField = {
									...referenceFormField,
									form: {
										...referenceFormField.form,
										props: subFormProps,
									},
								};
								formActions.formChanged({
									...formProps,
									fields: {
										...formProps.fields,
										[reference.name]: referenceFormField,
									},
									value: {
										...formProps.value,
										[reference.name]: subFormProps.value,
									},
								});
								return subFormProps;
							},
							formChanged: (subFormProps) => {
								let referenceFormField = formProps.fields[
									reference.name
								] as IReferenceFormField;
								referenceFormField = {
									...referenceFormField,
									form: {
										...referenceFormField.form,
										props: subFormProps,
									},
								};
								formProps = {
									...formProps,
									fields: {
										...formProps.fields,
										[reference.name]: referenceFormField,
									},
									value: {
										...formProps.value,
										[reference.name]: subFormProps.value,
									},
								};
								formActions.formChanged(formProps);
								return subFormProps;
							},
						},
					};
					const referenceFormField: IReferenceFormField = {
						...(formProps.fields[reference.name] as IReferenceFormField),
						form,
					};
					formProps = {
						...formProps,
						fields: {
							...formProps.fields,
							[reference.name]: referenceFormField,
						},
					};
					formActions.formChanged(formProps);
					return {
						...referenceComponentProps,
						form,
					};
				},
				referenceChanged: (props) => {
					const normalizationResult = normalize(
						formProps.store,
						reference.type,
						props.value
					);
					let referenceFormField = formProps.fields[
						reference.name
					] as IReferenceFormField;
					const [head, ...tail] = reference.foreignKey.map(
						(foreignKeyProperty, foreignKeyPropertyIndex) => ({
							[foreignKeyProperty.name]:
								normalizationResult.storedEntity[
									reference.targetForeignKey[foreignKeyPropertyIndex].name
								],
						})
					);

					const foreignKey = tail.reduce(
						(foreignKey, part) => ({ ...foreignKey, ...part }),
						head
					);
					referenceFormField = {
						...referenceFormField,
						form: {
							...referenceFormField.form,
							props: {
								...referenceFormField.form?.props,
								value: normalizationResult.storedEntity,
							},
						},
					};

					formActions.formChanged({
						...formProps,
						store: normalizationResult.context.store,
						fields: {
							...formProps.fields,
							[reference.name]: referenceFormField,
						},
						value: {
							...formProps.value,
							...foreignKey,
							[reference.name]: normalizationResult.storedEntity,
						},
					});
					return props;
				},
			};
		};

		const field: IFormField = {
			componentFactory: new ReferenceComponentFactory(),
			getComponentProps,
			getComponentActions,
			displayName: reference.displayName,
			name: reference.name,
			model: reference,
		};
		return {
			fields: [field],
		};
	}
}
