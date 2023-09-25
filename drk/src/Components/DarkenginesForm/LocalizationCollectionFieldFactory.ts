import { inject, injectable, multiInject } from 'inversify';
import { flatten } from 'lodash';
import {
	LocalizedComponentFactory,
	createGetter,
	createSetter,
} from '../../ComponentFactories/LocalizedComponentFactory/LocalizedComponentFactory';
import { ILocalizedEditorProps } from '../../ComponentFactories/LocalizedComponentFactory/LocalizedEditor';
import { ILocalization } from '../../Localization/Models/ILocalization';
import { ILocalized } from '../../Localization/Models/ILocalized';
import { ComponentFactories } from '../../ComponentFactories/ComponentFactories';
import {
	IComponentFactory,
	IEditorComponentActions,
} from '../../ComponentFactories/IComponentFactory';
import { StringComponentFactory } from '../../ComponentFactories/StringComponentFactory/StringComponentFactory';
import { getConfig } from '../../config';
import '../../StringExtensions';
import { ICollectionModel } from '../../Model/ICollectionModel';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IFormActions, IFormProps } from '../Forms';
import FieldFactory from './FieldFactory';
import { IFieldFactoryContext } from './IFieldFactory';
import { IFieldFactoryResult } from './IFieldFactoryResult';

@injectable()
export default class LocalizationCollectionFieldFactory implements FieldFactory<ICollectionModel> {
	protected componentFactories: IComponentFactory[];
	protected defaultComponentFactory: StringComponentFactory;

	constructor(
		@multiInject(ComponentFactories.IComponentFactory) componentFactories: IComponentFactory[],
		@inject(StringComponentFactory) defaultComponentFactory: StringComponentFactory
	) {
		this.componentFactories = componentFactories;
		this.defaultComponentFactory = defaultComponentFactory;
	}
	canHandle(collection: ICollectionModel) {
		return (
			collection.modelType === 'CollectionModel' &&
			collection.displayTypeName == 'LocalizationCollection'
		);
	}
	async createFields(
		context: IFieldFactoryContext,
		collection: ICollectionModel
	): Promise<IFieldFactoryResult> {
		const primaryKey = collection.type.primaryKey;
		const localizedProperties = collection.type.properties.filter((property) =>
			primaryKey.every((pk) => pk !== property)
		);
		const results = await Promise.all(
			localizedProperties.map((localizedProperty) =>
				context.fieldFactories
					.find((columnFactory) => columnFactory.canHandle(localizedProperty))
					.createFields(context, localizedProperty)
			)
		);
		let fields = flatten(results.map((result) => result.fields));
		const config = await getConfig();
		fields = fields.map((field) => {
			const underlyingComponentFactory = field.componentFactory;
			const componentFactory = new LocalizedComponentFactory();
			const getValue = createGetter<ILocalization, ILocalized<ILocalization>>(
				(item) => item?.localizations
			);
			const setValue = createSetter<ILocalization, ILocalized<ILocalization>>(
				(item, value) => {
					return {
						...item,
						localizations: value,
					};
				}
			) as any;
			const getComponentProps: (formProps: IFormProps) => ILocalizedEditorProps = (
				formProps: IFormProps
			) => ({
				value: formProps.value.localizations,
				model: collection,
				component: undefined,
				property: field.model as IPropertyModel,
				underlyingComponentFactory,
				defaultLanguage: config.Localization.defaultLanguage,
				languages: config.Localization.languages,
				selectedLanguage: config.Localization.defaultLanguage,
			});
			const getComponentActions: (
				formProps: IFormProps,
				actions: IFormActions
			) => IEditorComponentActions = (formProps, actions) => ({
				valueChanged: (props) =>
					actions.valueChanged({
						...formProps,
						value: { ...formProps.value, [collection.name]: props.value },
					}),
			});
			return {
				...field,
				componentFactory,
				getValue,
				setValue,
				getComponentProps,
				getComponentActions,
			};
		});

		return { fields };
	}
}
