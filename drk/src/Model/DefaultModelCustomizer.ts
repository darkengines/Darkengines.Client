import { injectable, multiInject } from 'inversify';
import '../ArrayExtensions';
import { ComponentFactories } from '../ComponentFactories/ComponentFactories';
import { IComponentFactory } from '../ComponentFactories/IComponentFactory';
import { StringComponentFactory } from '../ComponentFactories/StringComponentFactory/StringComponentFactory';
import { IOperator } from '../Operators/IOperator';
import { StartsWithOperator } from '../Operators/StartsWithOperator';
import { Operators } from '../Operators/Symbols';
import { IEntityModel } from './IEntityModel';
import { IMember } from './IMember';
import { IModel } from './IModel';
import { IModelCustomizer } from './IModelCustomizer';
import { INavigation } from './INavigation';
import { IPropertyModel } from './IPropertyModel';

export function wrapModel(model: IModel, parentModel: INavigation): IModel {
	return {
		...model,
		displayName: parentModel.displayName,
		name: parentModel.name,
		getValue: (instance: any) => model.getValue(parentModel.getValue(instance)),
		setValue: (instance: any, value: any) =>
			parentModel.setValue(instance, model.setValue(parentModel.getValue(instance), value)),
	};
}

@injectable()
export default class DefaultModelCustomizer implements IModelCustomizer {
	protected componentFactories: IComponentFactory[];
	protected operators: IOperator[];

	public constructor(
		@multiInject(ComponentFactories.IComponentFactory) componentFactories: IComponentFactory[],
		@multiInject(Operators.IOperator) operators: IOperator[]
	) {
		this.componentFactories = componentFactories;
		this.operators = operators;
	}

	static makeGetter(member: IMember) {
		return (instance) => instance?.[member.name];
	}
	static makeSetter(member: IMember) {
		return (instance, value) => (instance[member.name] = value);
	}
	canHandle(model: IEntityModel): boolean {
		return true;
	}
	customize(model: IEntityModel): IEntityModel {
		const defaultComponentFactory = this.componentFactories.find(
			(componentFactory) => componentFactory instanceof StringComponentFactory
		);
		const defaultOperator = this.operators.find(
			(operator) => operator instanceof StartsWithOperator
		);
		model.getValue = (instance) => instance;
		model.setValue = (instance, value) => value;
		model.modelType = 'EntityModel';
		if (!model.summaryProperties) model.summaryProperties = [];

		model.componentFactories = this.componentFactories.filter((cf) => cf.canHandle(model));
		model.operators = this.operators.filter((operator) =>
			(Operators.map[model.name] ?? [defaultOperator.constructor]).some(
				(identifier) => identifier === operator.identifier
			)
		);

		if (model.interfaces?.some?.((i) => i == 'ILocalized')) {
			const localizations = model.collections.find(
				(collection) => collection.name == 'localizations'
			);
			const localizedProperties = localizations.type.properties.filter(
				(property) => !localizations.type.primaryKey.some((pk) => pk == property)
			);
			if (
				localizedProperties.some(
					(localizedProperty) => localizedProperty.name == 'displayName'
				)
			) {
				model.summaryProperties = [];
				model.summaryCollections = [localizations];
			}
		}
		model.properties.forEach((property) => {
			property.modelType = 'PropertyModel';
			property.displayName = property.name;
			property.componentFactories = [
				...this.componentFactories.filter((cf) => cf.canHandle(property)),
				defaultComponentFactory,
			];
			property.getValue = DefaultModelCustomizer.makeGetter(property);
			property.setValue = DefaultModelCustomizer.makeSetter(property);
			let operators = Operators.map[property.typeName]
				?.map((operatorContructor) =>
					this.operators.find((operator) => operator.identifier == operatorContructor)
				)
				?.filter((operator) => operator);
			if (!operators || !operators.length) {
				operators = [defaultOperator];
			}
			property.operators = operators;
		});
		model.references.forEach((reference) => {
			reference.modelType = 'ReferenceModel';
			reference.displayName = reference.name;
			reference.componentFactories = [];
			// reference.componentFactories = [
			// 	...this.componentFactories.filter((cf) => cf.canHandle(reference)),
			// 	defaultComponentFactory,
			// ];
			reference.getValue = DefaultModelCustomizer.makeGetter(reference);
			reference.setValue = DefaultModelCustomizer.makeSetter(reference);
			reference.operators = this.operators
				.filter((operator) =>
					(Operators.map[reference.type.name] ?? [defaultOperator.constructor]).some(
						(identifier) => identifier === operator.identifier
					)
				)
				.distinct();
		});
		model.collections.forEach((collection) => {
			collection.displayName = collection.name;
			collection.getValue = DefaultModelCustomizer.makeGetter(collection);
			collection.setValue = DefaultModelCustomizer.makeSetter(collection);
			collection.modelType = 'CollectionModel';
			collection.componentFactories = [
				...this.componentFactories.filter((cf) => cf.canHandle(collection)),
				defaultComponentFactory,
			];
			collection.operators = this.operators
				.filter((operator) =>
					(Operators.map[collection.type.name] ?? [defaultOperator.constructor]).some(
						(identifier) => identifier === operator.identifier
					)
				)
				.distinct();
		});
		if (!model.summaryReferences) model.summaryReferences = [];
		if (!model.summaryCollections) model.summaryCollections = [];
		model.members = [...model.properties, ...model.references, ...model.collections];
		let displayNameProperty: IPropertyModel;
		if (
			(displayNameProperty = model.properties.find(
				(property) => property.name == 'displayName'
			))
		) {
			model.summaryProperties = [displayNameProperty];
		} else if (
			(displayNameProperty = model.properties.find((property) => property.name == 'name'))
		) {
			model.summaryProperties = [displayNameProperty];
		}
		model.propertyDictionary = model.properties.toDictionary((property) => property.name);
		model.referenceDictionary = model.references.toDictionary((reference) => reference.name);
		model.collectionDictionary = model.collections.toDictionary(
			(collection) => collection.name
		);
		return model;
	}
}
